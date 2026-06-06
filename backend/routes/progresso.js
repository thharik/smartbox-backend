const router = require("express").Router();
const pool = require("../db/pool");
const { perfilMiddleware } = require("../middleware/auth");

// Salvar/atualizar progresso de vídeo
router.post("/", perfilMiddleware, async (req, res) => {
  try {
    const { episodioId, conteudoId, currentTime, duration, titulo, ep_titulo, poster, capa } = req.body;

    if (!episodioId || !conteudoId) {
      return res.status(400).json({ mensagem: "episodioId e conteudoId obrigatórios" });
    }

    const tempoAtual = Number(currentTime) || 0;
    const duracao    = Number(duration)    || 0;
    const concluido  = duracao > 0 && tempoAtual / duracao >= 0.95;

    await pool.query(
    `INSERT INTO progresso (
      perfil_id, episodio_id, conteudo_id,
      "current_time", duration,
      titulo, ep_titulo, poster, capa,
      concluido, atualizado_em
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
    ON CONFLICT (perfil_id, episodio_id) DO UPDATE SET
      "current_time" = EXCLUDED."current_time",
      duration       = EXCLUDED.duration,
      titulo         = EXCLUDED.titulo,
      ep_titulo      = EXCLUDED.ep_titulo,
      poster         = EXCLUDED.poster,
      capa           = EXCLUDED.capa,
      concluido      = EXCLUDED.concluido,
      atualizado_em  = NOW()`,
    [
      req.perfilId,
      episodioId,
      conteudoId,
      tempoAtual,
      duracao,
      titulo || "",
      ep_titulo || "",
      poster || "",
      capa || "",
      concluido
    ]
);

    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao salvar progresso:", err);
    return res.status(500).json({ mensagem: "Erro ao salvar progresso." });
  }
});

// Continuar assistindo
router.get("/continuar", perfilMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (p.conteudo_id)
         p.episodio_id,
         p.conteudo_id,
         p."current_time",
         p.duration,
         p.titulo,
         p.ep_titulo,
         p.poster,
         p.capa,
         p.atualizado_em AS updated_at
       FROM progresso p
       WHERE p.perfil_id = $1
         AND p.concluido   = FALSE
         AND p."current_time" > 5
       ORDER BY p.conteudo_id, p.atualizado_em DESC
       LIMIT 20`,
      [req.perfilId]
    );

    // Ordena por mais recente primeiro (o DISTINCT ON não garante ordem global)
    rows.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    return res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar continuar assistindo:", err);
    return res.status(500).json({ mensagem: "Erro ao buscar continuar assistindo." });
  }
});

module.exports = router;