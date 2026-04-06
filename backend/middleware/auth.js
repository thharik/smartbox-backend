/**
 * middleware/auth.js
 *
 * authMiddleware     — verifica JWT
 * perfilMiddleware   — verifica JWT + perfil selecionado
 * assinaturaMiddleware — verifica se o usuário tem assinatura ativa
 *                        (use em rotas que exigem pagamento)
 */

const jwt  = require("jsonwebtoken");
const pool = require("../db/pool");

// ─── JWT ──────────────────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = (req.headers["authorization"] || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
}

// ─── Perfil ───────────────────────────────────────────────────────────────────
async function perfilMiddleware(req, res, next) {
  authMiddleware(req, res, async () => {
    const perfilId = req.headers["x-perfil-id"];
    if (!perfilId) return res.status(400).json({ mensagem: "Perfil não selecionado" });

    const { rows } = await pool.query(
      "SELECT id FROM perfis WHERE id=$1 AND usuario_id=$2",
      [perfilId, req.usuario.id]
    );
    if (!rows.length) return res.status(403).json({ mensagem: "Perfil inválido" });

    req.perfilId = perfilId;
    next();
  });
}

// ─── Assinatura ───────────────────────────────────────────────────────────────
// Usa APÓS authMiddleware. Bloqueia com 402 se não houver assinatura ativa.
async function assinaturaMiddleware(req, res, next) {
  try {
    const { rows } = await pool.query(
      "SELECT status, valida_ate FROM assinaturas WHERE usuario_id=$1",
      [req.usuario.id]
    );

    // Sem registro ou assinatura inativa
    if (!rows.length || rows[0].status !== "ativa") {
      return res.status(402).json({
        mensagem: "Assinatura necessária",
        codigo:   "ASSINATURA_INATIVA",
      });
    }

    // Expirada (segurança extra além do webhook)
    if (new Date(rows[0].valida_ate) <= new Date()) {
      await pool.query(
        "UPDATE assinaturas SET status='inativa' WHERE usuario_id=$1",
        [req.usuario.id]
      );
      return res.status(402).json({
        mensagem: "Assinatura expirada",
        codigo:   "ASSINATURA_EXPIRADA",
      });
    }

    next();
  } catch (err) {
    console.error("Erro no assinaturaMiddleware:", err);
    res.status(500).json({ mensagem: "Erro interno ao verificar assinatura" });
  }
}

module.exports = { authMiddleware, perfilMiddleware, assinaturaMiddleware };