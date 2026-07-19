const router = require("express").Router();
const pool = require("../db/pool");
const { perfilMiddleware } = require("../middleware/auth");

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

function perfilValido(perfilId) {
  return (
    perfilId &&
    perfilId !== "null" &&
    perfilId !== "undefined" &&
    UUID_RE.test(String(perfilId))
  );
}

// Salvar/atualizar progresso de vídeo
router.post("/", perfilMiddleware, async (req, res) => {
  try {
    const perfilId = req.perfilId;

    if (!perfilValido(perfilId)) {
      return res.status(400).json({
        mensagem: "perfilId inválido. Escolha um perfil novamente.",
      });
    }

    const {
      episodioId,
      conteudoId,
      currentTime,
      duration,
      titulo,
      ep_titulo,
      poster,
      capa,
    } = req.body;

    if (!episodioId || !conteudoId) {
      return res.status(400).json({
        mensagem: "episodioId e conteudoId obrigatórios",
      });
    }

    const tempoAtual = Number(currentTime) || 0;
    const duracao = Number(duration) || 0;
    const concluido = duracao > 0 && tempoAtual / duracao >= 0.95;

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
        perfilId,
        episodioId,
        conteudoId,
        tempoAtual,
        duracao,
        titulo || "",
        ep_titulo || "",
        poster || "",
        capa || "",
        concluido,
      ]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao salvar progresso:", err);
    return res.status(500).json({
      mensagem: "Erro ao salvar progresso.",
      detalhe: err.message,
    });
  }
});

// Continuar assistindo
router.get("/continuar", perfilMiddleware, async (req, res) => {
  try {
    const perfilId = req.perfilId;

    if (!perfilValido(perfilId)) {
      return res.status(400).json({
        mensagem: "perfilId inválido. Escolha um perfil novamente.",
      });
    }

    // O LIMIT precisa vir DEPOIS de já ter escolhido o mais recente por
    // conteúdo E ordenado por recência — senão, com mais de 20 títulos
    // distintos no histórico, pode cortar um assistido recentemente antes
    // mesmo de chegar na ordenação final.
    const { rows } = await pool.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (p.conteudo_id)
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
           AND p.concluido = FALSE
           AND p."current_time" > 5
         ORDER BY p.conteudo_id, p.atualizado_em DESC
       ) ultimos
       ORDER BY updated_at DESC
       LIMIT 20`,
      [perfilId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar continuar assistindo:", err);
    return res.status(500).json({
      mensagem: "Erro ao buscar continuar assistindo.",
      detalhe: err.message,
    });
  }
});

module.exports = router;