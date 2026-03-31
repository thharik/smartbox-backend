const router = require("express").Router();
const pool   = require("../db/pool");
const { perfilMiddleware } = require("../middleware/auth");

router.get("/", perfilMiddleware, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.* FROM favoritos f JOIN conteudos c ON c.id=f.conteudo_id
     WHERE f.perfil_id=$1 ORDER BY f.adicionado_em DESC`,
    [req.perfilId]
  );
  res.json(rows);
});

router.post("/toggle", perfilMiddleware, async (req, res) => {
  const { conteudoId } = req.body;
  if (!conteudoId) return res.status(400).json({ mensagem: "conteudoId obrigatório" });

  const { rows } = await pool.query(
    "SELECT 1 FROM favoritos WHERE perfil_id=$1 AND conteudo_id=$2",
    [req.perfilId, conteudoId]
  );
  if (rows.length) {
    await pool.query("DELETE FROM favoritos WHERE perfil_id=$1 AND conteudo_id=$2", [req.perfilId, conteudoId]);
    res.json({ favoritado: false });
  } else {
    await pool.query("INSERT INTO favoritos (perfil_id,conteudo_id) VALUES ($1,$2)", [req.perfilId, conteudoId]);
    res.json({ favoritado: true });
  }
});

module.exports = router;
