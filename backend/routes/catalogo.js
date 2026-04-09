const router = require("express").Router();
const pool   = require("../db/pool");
const { authMiddleware } = require("../middleware/auth");

// GET /catalogo — assinaturaMiddleware DESATIVADO temporariamente para testes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { rows: conteudos }  = await pool.query("SELECT * FROM conteudos ORDER BY criado_em DESC");
    const { rows: temporadas } = await pool.query("SELECT * FROM temporadas ORDER BY numero");
    const { rows: episodios }  = await pool.query("SELECT * FROM episodios ORDER BY numero");
    const { rows: capitulos }  = await pool.query("SELECT * FROM capitulos ORDER BY numero");

    // Montar mapa de temporadas com episódios
    const mapTemp = {};
    temporadas.forEach(t => { mapTemp[t.id] = { ...t, episodios: [] }; });
    episodios.forEach(ep => {
      if (mapTemp[ep.temporada_id]) {
        mapTemp[ep.temporada_id].episodios.push({
          id:          ep.id,
          titulo:      ep.titulo,
          descricao:   ep.descricao,
          capa:        ep.capa,
          video:       ep.video_url,
          duracaoSeg:  ep.duracao_seg,
          numero:      ep.numero,
          introInicio: ep.intro_inicio,
          introFim:    ep.intro_fim,
        });
      }
    });

    // Mapa de capítulos por conteúdo (mangás)
    const mapCap = {};
    capitulos.forEach(cap => {
      if (!mapCap[cap.conteudo_id]) mapCap[cap.conteudo_id] = [];
      mapCap[cap.conteudo_id].push({
        id:      cap.id,
        numero:  cap.numero,
        titulo:  cap.titulo,
        pdfUrl:  cap.pdf_url,
        capa:    cap.capa,
        paginas: cap.paginas,
      });
    });

    const cat = {
      destaques: [],
      animes:    [],
      series:    [],
      aoVivo:    [],
      mangas:    [],
      aulas:     [],
    };

    conteudos.forEach(c => {
      const temps = Object.values(mapTemp)
        .filter(t => t.conteudo_id === c.id)
        .map(t => ({ numero: t.numero, episodios: t.episodios }));

      const item = {
        id:           c.id,
        titulo:       c.titulo,
        tipo:         c.tipo,
        poster:       c.poster,
        descricao:    c.descricao,
        generos:      c.generos || [],
        classificacao: c.classificacao,
        temporadas:   temps,
        capitulos:    mapCap[c.id] || [],
      };

      if      (c.tipo === "Filme")  cat.destaques.push(item);
      else if (c.tipo === "Anime")  cat.animes.push(item);
      else if (c.tipo === "Série")  cat.series.push(item);
      else if (c.tipo === "AoVivo") cat.aoVivo.push(item);
      else if (c.tipo === "Manga")  cat.mangas.push(item);
      else if (c.tipo === "Aula")   cat.aulas.push(item);
    });

    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao carregar catálogo" });
  }
});

// POST /catalogo — upsert conteúdo
router.post("/", authMiddleware, async (req, res) => {
  const { id, titulo, tipo, poster, descricao, generos, classificacao, ano } = req.body;
  if (!id || !titulo || !tipo)
    return res.status(400).json({ mensagem: "id, titulo e tipo obrigatórios" });

  const tiposValidos = ["Filme", "Série", "Anime", "AoVivo", "Manga", "Aula"];
  if (!tiposValidos.includes(tipo))
    return res.status(400).json({ mensagem: `Tipo inválido. Use: ${tiposValidos.join(", ")}` });

  await pool.query(
    `INSERT INTO conteudos (id, titulo, tipo, poster, descricao, generos, classificacao, ano)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (id) DO UPDATE
       SET titulo=$2, tipo=$3, poster=$4, descricao=$5, generos=$6, classificacao=$7, ano=$8`,
    [id, titulo, tipo, poster, descricao, generos || [], classificacao || "Livre", ano]
  );
  res.json({ mensagem: "Conteúdo salvo" });
});

module.exports = router;