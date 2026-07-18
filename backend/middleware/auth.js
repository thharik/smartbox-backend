/**
 * middleware/auth.js
 *
 * authMiddleware       — verifica JWT
 * perfilMiddleware     — verifica JWT + perfil selecionado
 * assinaturaMiddleware — verifica se o usuário tem assinatura ativa OU é
 *                        uma conta isenta (isento_pagamento = true no banco)
 */

const jwt  = require("jsonwebtoken");
const pool = require("../db/pool");

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── JWT ──────────────────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = (req.headers["authorization"] || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);

    // O login (routes/auth.js) assina o token com o campo "userId", mas todo
    // o resto do backend (perfilMiddleware, assinaturaMiddleware, etc) lê
    // "req.usuario.id". Sem essa normalização, req.usuario.id fica undefined
    // pra QUALQUER conta — inclusive as isentas — e todo mundo cai no bloqueio.
    if (!req.usuario.id && req.usuario.userId) {
      req.usuario.id = req.usuario.userId;
    }

    next();
  } catch {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
}

// ─── Perfil ───────────────────────────────────────────────────────────────────
async function perfilMiddleware(req, res, next) {
  authMiddleware(req, res, async () => {
    try {
      const perfilId = req.headers["x-perfil-id"];

      // Cobre undefined, "", "null" (string literal vinda do frontend) e
      // qualquer valor que não seja um UUID válido — evita que o Postgres
      // quebre com "invalid input syntax for type uuid" e derrube o processo.
      if (!perfilId || perfilId === "null" || !UUID_RE.test(perfilId)) {
        return res.status(400).json({ mensagem: "Perfil não selecionado" });
      }

      const { rows } = await pool.query(
        "SELECT id FROM perfis WHERE id=$1 AND usuario_id=$2",
        [perfilId, req.usuario.id]
      );
      if (!rows.length) return res.status(403).json({ mensagem: "Perfil inválido" });

      req.perfilId = perfilId;
      next();
    } catch (err) {
      console.error("Erro no perfilMiddleware:", err);
      if (!res.headersSent) {
        res.status(500).json({ mensagem: "Erro interno ao verificar perfil" });
      }
    }
  });
}

// ─── Assinatura ───────────────────────────────────────────────────────────────
// Usa APÓS authMiddleware. Bloqueia com 402 se não houver assinatura ativa —
// exceto contas marcadas como isentas (isento_pagamento = true na tabela
// usuarios), usada pra liberar acesso administrativo sem senha/código especial.
async function assinaturaMiddleware(req, res, next) {
  try {
    const { rows: userRows } = await pool.query(
      "SELECT isento_pagamento FROM usuarios WHERE id=$1",
      [req.usuario.id]
    );
    if (userRows[0]?.isento_pagamento) return next();

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
    if (!res.headersSent) {
      res.status(500).json({ mensagem: "Erro interno ao verificar assinatura" });
    }
  }
}

module.exports = { authMiddleware, perfilMiddleware, assinaturaMiddleware };