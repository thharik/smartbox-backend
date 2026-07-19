/**
 * assinatura.js — Rotas de assinatura via Mercado Pago (Orders API + Pix)
 *
 * Como funciona: gera uma "Order" com um pagamento Pix a cada ciclo de
 * cobrança (mensal). O usuário paga escaneando o QR code ou colando o
 * código "copia e cola", e o webhook confirma o pagamento e estende a
 * validade da assinatura por 31 dias.
 *
 * Endpoints:
 *   POST /assinatura/pix                  → cria uma Order com pagamento Pix (QR code + copia-e-cola)
 *   GET  /assinatura/verificar/:orderId   → consulta status de uma Order específica (polling)
 *   POST /assinatura/webhook              → recebe notificações "order" do Mercado Pago (com validação de assinatura)
 *   GET  /assinatura/status               → verifica se o usuário tem assinatura ativa
 */

const crypto = require("crypto");
const router = require("express").Router();
const { MercadoPagoConfig, Order } = require("mercadopago");
const pool = require("../db/pool");
const { authMiddleware } = require("../middleware/auth");

const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const orderClient = new Order(mpClient);

const PRECO_MENSAL  = Number(process.env.MP_PRECO_MENSAL || 9.99).toFixed(2);
const VALIDADE_DIAS = 31;

// ─── POST /assinatura/pix ──────────────────────────────────────────────────
router.post("/pix", authMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // O token JWT não carrega o e-mail (só o id) — busca direto no banco.
    const { rows: usuarioRows } = await pool.query(
      "SELECT email FROM usuarios WHERE id=$1",
      [usuarioId]
    );
    const email = usuarioRows[0]?.email;

    if (!email) {
      return res.status(400).json({ mensagem: "Não foi possível encontrar o e-mail desta conta." });
    }

    const order = await orderClient.create({
      body: {
        type: "online",
        total_amount: String(PRECO_MENSAL),
        external_reference: String(usuarioId),
        processing_mode: "automatic",
        transactions: {
          payments: [
            {
              amount: String(PRECO_MENSAL),
              payment_method: { id: "pix", type: "bank_transfer" },
              expiration_time: "PT30M", // 30 minutos — Pix "avulso", renovado a cada ciclo
            },
          ],
        },
        payer: { email },
      },
      requestOptions: {
        idempotencyKey: crypto.randomUUID(),
      },
    });

    const pagamento = order.transactions?.payments?.[0];
    const dadosPix = pagamento?.payment_method;

    if (!dadosPix?.qr_code) {
      console.error("Resposta do Mercado Pago sem dados de Pix:", JSON.stringify(order));
      return res.status(500).json({ mensagem: "Não foi possível gerar o Pix. Tente novamente." });
    }

    return res.json({
      orderId:   order.id,               // usar este id pra consultar/polling
      status:    order.status,
      qrCode:    dadosPix.qr_code,        // "copia e cola"
      qrCodeImg: dadosPix.qr_code_base64, // imagem base64 (PNG), sem prefixo data:
      ticketUrl: dadosPix.ticket_url,     // link alternativo com QR + instruções prontas
    });
  } catch (err) {
    console.error("Erro ao gerar Pix:", err);
    return res.status(500).json({ mensagem: "Erro ao gerar cobrança Pix." });
  }
});

// ─── GET /assinatura/verificar/:orderId ────────────────────────────────────
// Permite o frontend consultar diretamente o status de uma Order — útil pra
// polling, já que o webhook pode levar alguns segundos pra chegar.
router.get("/verificar/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await orderClient.get({ id: req.params.orderId });

    // Segurança: garante que o usuário só consulta orders que são dele
    if (String(order.external_reference) !== String(req.usuario.id)) {
      return res.status(403).json({ mensagem: "Order não pertence a este usuário." });
    }

    if (order.status === "processed" && order.status_detail === "accredited") {
      await ativarAssinatura(req.usuario.id, order.id);
    }

    return res.json({ status: order.status, statusDetail: order.status_detail });
  } catch (err) {
    console.error("Erro ao verificar order:", err);
    return res.status(500).json({ mensagem: "Erro ao verificar pagamento." });
  }
});

// ─── POST /assinatura/webhook ───────────────────────────────────────────────
router.post("/webhook", async (req, res) => {
  try {
    // ── 1. Validar a assinatura (x-signature) usando o segredo do .env ──────
    // A assinatura secreta NUNCA fica no código — só existe como variável de
    // ambiente no Render (MP_WEBHOOK_SECRET) e é lida aqui, em tempo de execução.
    const assinaturaValida = validarAssinatura(req);
    if (!assinaturaValida) {
      console.warn("Webhook do Mercado Pago com assinatura inválida — ignorado.");
      return res.status(401).json({ mensagem: "Assinatura inválida." });
    }

    // ── 2. Só processa notificações do tipo "order" (o único evento marcado) ─
    const tipo = req.body?.type || req.query?.type;
    const orderId = req.query?.["data.id"] || req.body?.data?.id;

    if (tipo !== "order" || !orderId) {
      return res.status(200).json({ recebido: true }); // ignora outros tipos, mas responde 200
    }

    // Nunca confia no status que vier na notificação — sempre busca a Order
    // de novo direto na API do Mercado Pago.
    const order = await orderClient.get({ id: orderId });

    if (order.status === "processed" && order.status_detail === "accredited" && order.external_reference) {
      await ativarAssinatura(order.external_reference, order.id);
    }

    return res.status(200).json({ recebido: true });
  } catch (err) {
    console.error("Erro ao processar webhook do Mercado Pago:", err);
    // Sempre responde 200 pro Mercado Pago não ficar reenviando indefinidamente
    return res.status(200).json({ recebido: true, erro: true });
  }
});

// ─── GET /assinatura/status ───────────────────────────────────────────────
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
      valida_ate: assinatura.valida_ate,
    });
  } catch (err) {
    console.error("Erro ao verificar assinatura:", err);
    return res.status(500).json({ mensagem: "Erro ao verificar assinatura." });
  }
});

// ─── Helper: valida o header x-signature usando MP_WEBHOOK_SECRET ──────────
// Algoritmo oficial do Mercado Pago: monta um "manifest" com o id da
// notificação + o x-request-id + o timestamp, gera um HMAC-SHA256 com o
// segredo, e compara com o valor "v1" recebido no header x-signature.
function validarAssinatura(req) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.error("MP_WEBHOOK_SECRET não configurado no .env / Render!");
    return false;
  }

  const signatureHeader = req.headers["x-signature"];
  const xRequestId       = req.headers["x-request-id"];
  const dataId           = req.query?.["data.id"] || req.body?.data?.id;

  if (!signatureHeader || !xRequestId || !dataId) return false;

  const partes = signatureHeader.split(",").reduce((acc, parte) => {
    const [chave, valor] = parte.split("=");
    if (chave && valor) acc[chave.trim()] = valor.trim();
    return acc;
  }, {});

  const ts = partes.ts;
  const v1 = partes.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`;
  const hashCalculado = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return hashCalculado === v1;
}

// ─── Helper: ativa/renova a assinatura no banco ────────────────────────────
async function ativarAssinatura(usuarioId, mpOrderId) {
  const validaAte = new Date();
  validaAte.setDate(validaAte.getDate() + VALIDADE_DIAS);

  await pool.query(
    `INSERT INTO assinaturas (usuario_id, mp_payment_id, status, valida_ate)
     VALUES ($1, $2, 'ativa', $3)
     ON CONFLICT (usuario_id)
     DO UPDATE SET
       mp_payment_id = EXCLUDED.mp_payment_id,
       status        = 'ativa',
       valida_ate    = EXCLUDED.valida_ate,
       atualizado_em = NOW()`,
    [usuarioId, String(mpOrderId), validaAte]
  );

  console.log(
    `Assinatura ativada (Mercado Pago) para usuario ${usuarioId} até ${validaAte.toISOString()}`
  );
}

module.exports = router;