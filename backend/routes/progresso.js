const router = require("express").Router();
const pool   = require("../db/pool");
const { perfilMiddleware } = require("../middleware/auth");

router.post("/", perfilMiddleware, async (req, res) => {
  const { episodioId, conteudoId, currentTime, duration } = req.body;
  if (!episodioId || !conteudoId)
    return res.status(400).json({ mensagem: "episodioId e conteudoId obrigatórios" });

  const concluido = duration > 0 && (currentTime / duration) >= 0.9;

  await pool.query(
    `INSERT INTO progresso (perfil_id,episodio_id,conteudo_id,tempo_atual,duracao,concluido,atualizado_em)
     VALUES ($1,$2,$3,$4,$5,$6,NOW())
     ON CONFLICT (perfil_id,episodio_id)
     DO UPDATE SET tempo_atual=$4, duracao=$5, concluido=$6, atualizado_em=NOW()`,
    [req.perfilId, episodioId, conteudoId, currentTime||0, duration||0, concluido]
  );
  res.json({ ok: true });
});

router.get("/continuar", perfilMiddleware, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT ON (p.conteudo_id)
       p.episodio_id, p.conteudo_id, p.tempo_atual AS current_time, p.duracao AS duration,
       e.titulo AS ep_titulo, e.capa,
       c.titulo, c.poster, p.atualizado_em
     FROM progresso p
     JOIN episodios e ON e.id = p.episodio_id
     JOIN conteudos c ON c.id = p.conteudo_id
     WHERE p.perfil_id=$1 AND p.concluido=FALSE AND p.tempo_atual > 5
     ORDER BY p.conteudo_id, p.atualizado_em DESC
     LIMIT 10`,
    [req.perfilId]
  );
  res.json(rows);
});

module.exports = router;