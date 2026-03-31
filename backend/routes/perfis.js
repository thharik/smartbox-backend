const router = require("express").Router();
const bcrypt = require("bcryptjs");
const pool   = require("../db/pool");
const { authMiddleware } = require("../middleware/auth");

// Listar perfis
router.get("/", authMiddleware, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id,nome,avatar,infantil,(pin_hash IS NOT NULL) AS tem_pin FROM perfis WHERE usuario_id=$1 ORDER BY criado_em",
    [req.usuario.id]
  );
  res.json(rows);
});

// Criar perfil
router.post("/", authMiddleware, async (req, res) => {
  const { nome, avatar = "avatar1", infantil = false, pin } = req.body;
  if (!nome) return res.status(400).json({ mensagem: "Nome obrigatório" });

  const { rows: existentes } = await pool.query(
    "SELECT id FROM perfis WHERE usuario_id=$1", [req.usuario.id]
  );
  if (existentes.length >= 4)
    return res.status(400).json({ mensagem: "Máximo de 4 perfis atingido" });

  const pinHash = pin ? await bcrypt.hash(String(pin), 10) : null;
  const { rows } = await pool.query(
    "INSERT INTO perfis (usuario_id,nome,avatar,infantil,pin_hash) VALUES ($1,$2,$3,$4,$5) RETURNING id,nome,avatar,infantil",
    [req.usuario.id, nome, avatar, infantil, pinHash]
  );
  res.status(201).json(rows[0]);
});

// Editar perfil
router.put("/:id", authMiddleware, async (req, res) => {
  const { nome, avatar, infantil, pin } = req.body;
  const campos = [], vals = [];
  let i = 1;
  if (nome    !== undefined) { campos.push(`nome=$${i++}`);     vals.push(nome); }
  if (avatar  !== undefined) { campos.push(`avatar=$${i++}`);   vals.push(avatar); }
  if (infantil!== undefined) { campos.push(`infantil=$${i++}`); vals.push(infantil); }
  if (pin     !== undefined) {
    const h = await bcrypt.hash(String(pin), 10);
    campos.push(`pin_hash=$${i++}`); vals.push(h);
  }
  if (!campos.length) return res.status(400).json({ mensagem: "Nada para atualizar" });
  vals.push(req.params.id, req.usuario.id);
  await pool.query(
    `UPDATE perfis SET ${campos.join(",")} WHERE id=$${i++} AND usuario_id=$${i}`, vals
  );
  res.json({ mensagem: "Perfil atualizado" });
});

// Deletar perfil
router.delete("/:id", authMiddleware, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id FROM perfis WHERE usuario_id=$1", [req.usuario.id]
  );
  if (rows.length <= 1)
    return res.status(400).json({ mensagem: "Não é possível apagar o único perfil" });
  await pool.query("DELETE FROM perfis WHERE id=$1 AND usuario_id=$2", [req.params.id, req.usuario.id]);
  res.json({ mensagem: "Perfil removido" });
});

// Verificar PIN
router.post("/:id/pin", authMiddleware, async (req, res) => {
  const { pin } = req.body;
  const { rows } = await pool.query(
    "SELECT pin_hash FROM perfis WHERE id=$1 AND usuario_id=$2", [req.params.id, req.usuario.id]
  );
  if (!rows.length) return res.status(404).json({ mensagem: "Perfil não encontrado" });
  if (!rows[0].pin_hash) return res.json({ ok: true });
  const ok = await bcrypt.compare(String(pin), rows[0].pin_hash);
  if (!ok) return res.status(401).json({ mensagem: "PIN incorreto" });
  res.json({ ok: true });
});

module.exports = router;
