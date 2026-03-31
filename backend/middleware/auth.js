const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

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

module.exports = { authMiddleware, perfilMiddleware };
