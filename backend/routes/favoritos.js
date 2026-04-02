const router = require("express").Router();
const pool   = require("../db/pool");
const { perfilMiddleware } = require("../middleware/auth");

// GET /favoritos — lista favoritos do perfil
router.get("/", perfilMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*
       FROM favoritos f
       JOIN conteudos c ON c.id = f.conteudo_id
       WHERE f.perfil_id = $1
       ORDER BY f.adicionado_em DESC`,
      [req.perfilId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar favoritos" });
  }
});

// POST /favoritos/toggle — adiciona ou remove favorito
router.post("/toggle", perfilMiddleware, async (req, res) => {
  const { conteudoId } = req.body;
  if (!conteudoId)
    return res.status(400).json({ mensagem: "conteudoId obrigatório" });

  try {
    const { rows } = await pool.query(
      "SELECT 1 FROM favoritos WHERE perfil_id=$1 AND conteudo_id=$2",
      [req.perfilId, conteudoId]
    );

    if (rows.length) {
      await pool.query(
        "DELETE FROM favoritos WHERE perfil_id=$1 AND conteudo_id=$2",
        [req.perfilId, conteudoId]
      );
      return res.json({ favoritado: false });
    }

    await pool.query(
      "INSERT INTO favoritos (perfil_id, conteudo_id) VALUES ($1,$2)",
      [req.perfilId, conteudoId]
    );
    res.json({ favoritado: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao atualizar favorito" });
  }
});

// GET /favoritos/check/:conteudoId — verifica se um conteúdo é favorito
router.get("/check/:conteudoId", perfilMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT 1 FROM favoritos WHERE perfil_id=$1 AND conteudo_id=$2",
      [req.perfilId, req.params.conteudoId]
    );
    res.json({ favoritado: rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao verificar favorito" });
  }
});

module.exports = router;
