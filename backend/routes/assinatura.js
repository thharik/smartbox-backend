/**
 * assinatura.js — Rotas de assinatura via Stripe
 *
 * Endpoints:
 *   POST /assinatura/checkout   → cria Checkout Session (retorna { url })
 *   POST /assinatura/webhook    → recebe eventos do Stripe (raw body)
 *   GET  /assinatura/status     → verifica se o usuário tem assinatura ativa
 */

const router = require("express").Router();
const Stripe = require("stripe");
const pool = require("../db/pool");
const { authMiddleware } = require("../middleware/auth");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ─── POST /assinatura/checkout ────────────────────────────────────────────────
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const email = req.usuario.email || null;

    // Verifica se já tem assinatura ativa
    const { rows } = await pool.query(
      "SELECT usuario_id FROM assinaturas WHERE usuario_id=$1 AND status='ativa' AND valida_ate > NOW()",
      [usuarioId]
    );

    if (rows.length) {
      return res.json({
        ja_ativo: true,
        mensagem: "Você já tem uma assinatura ativa."
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email || undefined,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      metadata: {
        usuario_id: String(usuarioId)
      },
      success_url: `${process.env.FRONTEND_URL}/index.html?assinatura=ok`,
      cancel_url: `${process.env.FRONTEND_URL}/login.html?assinatura=cancelada`
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar checkout:", err);
    return res.status(500).json({ mensagem: "Erro ao iniciar pagamento." });
  }
});

// ─── POST /assinatura/webhook ─────────────────────────────────────────────────
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let evento;

  try {
    evento = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook inválido:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const objeto = evento.data.object;
  const usuarioId = objeto?.metadata?.usuario_id || null;
  const stripeSubId =
    objeto?.subscription ||
    objeto?.id ||
    objeto?.data?.object?.subscription ||
    null;
  const stripeCustomerId = objeto?.customer || null;

  try {
    switch (evento.type) {
      // Pagamento aprovado / renovação
      case "checkout.session.completed":
      case "invoice.payment_succeeded": {
        if (!usuarioId && !stripeCustomerId) break;

        // validade provisória de 31 dias
        const validaAte = new Date();
        validaAte.setDate(validaAte.getDate() + 31);

        let uid = usuarioId;

        // Se não veio usuario_id no metadata, tenta achar pelo customer
        if (!uid && stripeCustomerId) {
          const { rows } = await pool.query(
            "SELECT usuario_id FROM assinaturas WHERE stripe_customer_id=$1 LIMIT 1",
            [stripeCustomerId]
          );
          uid = rows[0]?.usuario_id || null;
        }

        if (!uid) break;

        await pool.query(
          `INSERT INTO assinaturas (
             usuario_id,
             stripe_subscription_id,
             stripe_customer_id,
             status,
             valida_ate
           )
           VALUES ($1, $2, $3, 'ativa', $4)
           ON CONFLICT (usuario_id)
           DO UPDATE SET
             stripe_subscription_id = EXCLUDED.stripe_subscription_id,
             stripe_customer_id = EXCLUDED.stripe_customer_id,
             status = 'ativa',
             valida_ate = EXCLUDED.valida_ate,
             atualizado_em = NOW()`,
          [uid, stripeSubId, stripeCustomerId, validaAte]
        );

        console.log(
          `Assinatura ativada para usuario ${uid} até ${validaAte.toISOString()}`
        );
        break;
      }

      // Atualização da assinatura
      case "customer.subscription.updated": {
        console.log("Assinatura atualizada:", stripeSubId);
        break;
      }

      // Falha/cancelamento
      case "invoice.payment_failed":
      case "customer.subscription.deleted": {
        if (!stripeSubId) break;

        await pool.query(
          "UPDATE assinaturas SET status='inativa', atualizado_em=NOW() WHERE stripe_subscription_id=$1",
          [stripeSubId]
        );

        console.log(`Assinatura cancelada/falhou: ${stripeSubId}`);
        break;
      }

      default:
        console.log(`Evento ignorado: ${evento.type}`);
        break;
    }
  } catch (dbErr) {
    console.error("Erro ao processar webhook no banco:", dbErr);
  }

  return res.json({ received: true });
});

// ─── GET /assinatura/status ───────────────────────────────────────────────────
router.get("/status", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT status, valida_ate FROM assinaturas WHERE usuario_id=$1",
      [req.usuario.id]
    );

    if (!rows.length) {
      return res.json({ ativa: false, status: "inativa" });
    }

    const assinatura = rows[0];
    const ativa =
      assinatura.status === "ativa" &&
      assinatura.valida_ate &&
      new Date(assinatura.valida_ate) > new Date();

    return res.json({
      ativa,
      status: assinatura.status,
      valida_ate: assinatura.valida_ate
    });
  } catch (err) {
    console.error("Erro ao verificar assinatura:", err);
    return res.status(500).json({ mensagem: "Erro ao verificar assinatura." });
  }
});

module.exports = router;