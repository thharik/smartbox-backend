const router  = require("express").Router();
const pool    = require("../db/pool");
const { authMiddleware, perfilMiddleware } = require("../middleware/auth");

// ── Capítulos ──────────────────────────────────────────────────────────────

// GET /mangas/:conteudoId/capitulos — lista capítulos de um mangá
router.get("/:conteudoId/capitulos", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM capitulos WHERE conteudo_id=$1 ORDER BY numero",
      [req.params.conteudoId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao listar capítulos" });
  }
});

// POST /mangas/capitulo — cadastrar/atualizar capítulo (admin)
router.post("/capitulo", authMiddleware, async (req, res) => {
  const { id, conteudoId, numero, titulo, pdfUrl, capa, paginas } = req.body;
  if (!id || !conteudoId || numero === undefined || !titulo || !pdfUrl)
    return res.status(400).json({ mensagem: "id, conteudoId, numero, titulo e pdfUrl obrigatórios" });

  try {
    await pool.query(
      `INSERT INTO capitulos (id, conteudo_id, numero, titulo, pdf_url, capa, paginas)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (id) DO UPDATE
         SET conteudo_id=$2, numero=$3, titulo=$4, pdf_url=$5, capa=$6, paginas=$7`,
      [id, conteudoId, numero, titulo, pdfUrl, capa || null, paginas || 0]
    );
    res.json({ mensagem: "Capítulo salvo" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao salvar capítulo" });
  }
});

// DELETE /mangas/capitulo/:id — remover capítulo (admin)
router.delete("/capitulo/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query("DELETE FROM capitulos WHERE id=$1", [req.params.id]);
    res.json({ mensagem: "Capítulo removido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao remover capítulo" });
  }
});

// ── Progresso de leitura ───────────────────────────────────────────────────

// POST /mangas/progresso — salvar página atual
router.post("/progresso", perfilMiddleware, async (req, res) => {
  const { capituloId, conteudoId, paginaAtual, totalPaginas } = req.body;
  if (!capituloId || !conteudoId)
    return res.status(400).json({ mensagem: "capituloId e conteudoId obrigatórios" });

  const concluido = totalPaginas > 0 && paginaAtual >= totalPaginas;

  try {
    await pool.query(
      `INSERT INTO progresso_manga (perfil_id, capitulo_id, conteudo_id, pagina_atual, concluido, atualizado_em)
       VALUES ($1,$2,$3,$4,$5,NOW())
       ON CONFLICT (perfil_id, capitulo_id)
       DO UPDATE SET pagina_atual=$4, concluido=$5, atualizado_em=NOW()`,
      [req.perfilId, capituloId, conteudoId, paginaAtual || 1, concluido]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao salvar progresso" });
  }
});

// GET /mangas/progresso/continuar — mangás em andamento
router.get("/progresso/continuar", perfilMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (pm.conteudo_id)
         pm.capitulo_id,
         pm.conteudo_id,
         pm.pagina_atual,
         cap.titulo    AS cap_titulo,
         cap.numero    AS cap_numero,
         cap.capa,
         c.titulo,
         c.poster,
         pm.atualizado_em
       FROM progresso_manga pm
       JOIN capitulos  cap ON cap.id  = pm.capitulo_id
       JOIN conteudos  c   ON c.id    = pm.conteudo_id
       WHERE pm.perfil_id = $1
         AND pm.concluido = FALSE
       ORDER BY pm.conteudo_id, pm.atualizado_em DESC
       LIMIT 10`,
      [req.perfilId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar progresso" });
  }
});

// GET /mangas/progresso/:conteudoId — progresso de todos os capítulos de um mangá
router.get("/progresso/:conteudoId", perfilMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT pm.capitulo_id, pm.pagina_atual, pm.concluido
       FROM progresso_manga pm
       JOIN capitulos cap ON cap.id = pm.capitulo_id
       WHERE pm.perfil_id=$1 AND cap.conteudo_id=$2`,
      [req.perfilId, req.params.conteudoId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar progresso" });
  }
});

module.exports = router;
