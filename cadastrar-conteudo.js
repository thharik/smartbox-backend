require("dotenv").config();
const { Pool } = require("pg");
 
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});
 
// URL base dos vídeos (Cloudflare Worker que serve o B2)
const VIDEO_BASE = "https://tvxbox-b2.tharikluan-miguel.workers.dev";
 
// ==========================
//  LISTA DE CONTEÚDOS
//  Tipos válidos: Filme | Série | Anime | AoVivo | Manga | Aula
// ==========================
 
const conteudos = [
  {
    conteudo_id:      "buddy",
    titulo:           "Buddy",
    tipo:             "Anime",
    poster:           "https://via.placeholder.com/300x450",
    descricao:        "Série adicionada ao catálogo Tvxbox.",
    generos:          ["Anime", "Aventura"],
    classificacao:    "Livre",
    ano:              2026,
 
    temporada_id:     "a1111111-1111-1111-1111-111111111111",
    numero_temporada: 1,
 
    episodios: [
      { id: "buddy_ep1",  titulo: "Buddy - Episódio 1",  arquivo: "buddyEP1.mp4",  duracao_seg: 1787, numero: 1  },
      { id: "buddy_ep2",  titulo: "Buddy - Episódio 2",  arquivo: "buddyEP2.mp4",  duracao_seg: 1529, numero: 2  },
      { id: "buddy_ep3",  titulo: "Buddy - Episódio 3",  arquivo: "buddyEP3.mp4",  duracao_seg: 1039, numero: 3  },
      { id: "buddy_ep4",  titulo: "Buddy - Episódio 4",  arquivo: "buddyEP4.mp4",  duracao_seg: 1521, numero: 4  },
      { id: "buddy_ep5",  titulo: "Buddy - Episódio 5",  arquivo: "buddyEP5.mp4",  duracao_seg: 992,  numero: 5  },
      { id: "buddy_ep6",  titulo: "Buddy - Episódio 6",  arquivo: "buddyEP6.mp4",  duracao_seg: 1580, numero: 6  },
      { id: "buddy_ep7",  titulo: "Buddy - Episódio 7",  arquivo: "buddyEP7.mp4",  duracao_seg: 1432, numero: 7  },
      { id: "buddy_ep8",  titulo: "Buddy - Episódio 8",  arquivo: "buddyEP8.mp4",  duracao_seg: 1141, numero: 8  },
      { id: "buddy_ep9",  titulo: "Buddy - Episódio 9",  arquivo: "buddyEP9.mp4",  duracao_seg: 1736, numero: 9  },
      { id: "buddy_ep10", titulo: "Buddy - Episódio 10", arquivo: "buddyEP10.mp4", duracao_seg: 1531, numero: 10 },
      { id: "buddy_ep11", titulo: "Buddy - Episódio 11", arquivo: "buddyEP11.mp4", duracao_seg: 1327, numero: 11 },
      { id: "buddy_ep12", titulo: "Buddy - Episódio 12", arquivo: "buddyEP12.mp4", duracao_seg: 1331, numero: 12 },
    ],
  },
 
  {
    conteudo_id:      "frieren",
    titulo:           "Frieren",
    tipo:             "Anime",
    poster:           "https://via.placeholder.com/300x450",
    descricao:        "Conteúdo adicionado ao catálogo Tvxbox.",
    generos:          ["Anime", "Fantasia"],
    classificacao:    "Livre",
    ano:              2026,
 
    // CORRIGIDO: UUID único (estava igual ao de Zatch Bell — causaria conflito no banco)
    temporada_id:     "b2222222-2222-2222-2222-222222222222",
    numero_temporada: 1,
 
    episodios: [
      { id: "frieren_ep1", titulo: "Frieren - Episódio 1", arquivo: "FrierenEP1.mp4", duracao_seg: 1500, numero: 1 },
      { id: "frieren_ep2", titulo: "Frieren - Episódio 2", arquivo: "FrierenEP2.mp4", duracao_seg: 1500, numero: 2 },
    ],
  },
 
  {
    conteudo_id:      "kingdom",
    titulo:           "Kingdom",
    tipo:             "Anime",
    poster:           "https://via.placeholder.com/300x450",
    descricao:        "Conteúdo adicionado ao catálogo Tvxbox.",
    generos:          ["Anime", "Ação"],
    classificacao:    "Livre",
    ano:              2026,
 
    // CORRIGIDO: UUID único (estava igual ao de Zatch Bell)
    temporada_id:     "c3333333-3333-3333-3333-333333333333",
    numero_temporada: 1,
 
    episodios: [
      { id: "kingdom_ep1",  titulo: "Kingdom - Episódio 1",  arquivo: "KingdomEP1.mp4",  duracao_seg: 1500, numero: 1  },
      { id: "kingdom_ep2",  titulo: "Kingdom - Episódio 2",  arquivo: "KingdomEP2.mp4",  duracao_seg: 1500, numero: 2  },
      { id: "kingdom_ep3",  titulo: "Kingdom - Episódio 3",  arquivo: "KingdomEP3.mp4",  duracao_seg: 1500, numero: 3  },
      { id: "kingdom_ep5",  titulo: "Kingdom - Episódio 5",  arquivo: "KingdomEP5.mp4",  duracao_seg: 1500, numero: 5  },
      { id: "kingdom_ep6",  titulo: "Kingdom - Episódio 6",  arquivo: "KingdomEP6.mp4",  duracao_seg: 1500, numero: 6  },
      { id: "kingdom_ep7",  titulo: "Kingdom - Episódio 7",  arquivo: "KingdomEP7.mp4",  duracao_seg: 1500, numero: 7  },
      { id: "kingdom_ep8",  titulo: "Kingdom - Episódio 8",  arquivo: "KingdomEP8.mp4",  duracao_seg: 1500, numero: 8  },
      { id: "kingdom_ep9",  titulo: "Kingdom - Episódio 9",  arquivo: "KingdomEP9.mp4",  duracao_seg: 1500, numero: 9  },
      { id: "kingdom_ep10", titulo: "Kingdom - Episódio 10", arquivo: "KingdomEP10.mp4", duracao_seg: 1500, numero: 10 },
      { id: "kingdom_ep11", titulo: "Kingdom - Episódio 11", arquivo: "KingdomEP11.mp4", duracao_seg: 1500, numero: 11 },
      { id: "kingdom_ep13", titulo: "Kingdom - Episódio 13", arquivo: "KingdomEP13.mp4", duracao_seg: 1500, numero: 13 },
    ],
  },
 
  {
    conteudo_id:      "zatbell",
    titulo:           "Zatch Bell",
    tipo:             "Anime",
    poster:           "https://via.placeholder.com/300x450",
    descricao:        "A história conta sobre Kiyo Takamine e seu mamodo Zatch Bell.",
    generos:          ["Anime", "Aventura"],
    classificacao:    "Livre",
    ano:              2003,
 
    temporada_id:     "d4444444-4444-4444-4444-444444444444",
    numero_temporada: 1,
 
    episodios: [
      { id: "zatbell_ep1", titulo: "Zatch Bell - Episódio 1", arquivo: "zatbell.mp4", duracao_seg: 4120, numero: 1 },
    ],
  },
 
  // -- EXEMPLO: como adicionar um mangá ------------------------------------
  // {
  //   conteudo_id:   "one-piece-manga",
  //   titulo:        "One Piece",
  //   tipo:          "Manga",
  //   poster:        "https://...",
  //   descricao:     "Aventura de Luffy para encontrar o One Piece.",
  //   generos:       ["Ação", "Aventura"],
  //   classificacao: "10",
  //   ano:           1997,
  //   episodios:     [],
  // },
 
  // -- EXEMPLO: como adicionar uma aula ------------------------------------
  // {
  //   conteudo_id:      "curso-react",
  //   titulo:           "Curso de React",
  //   tipo:             "Aula",
  //   poster:           "https://...",
  //   descricao:        "Aprenda React do zero ao avançado.",
  //   generos:          ["Programação"],
  //   classificacao:    "Livre",
  //   ano:              2025,
  //   temporada_id:     "e5555555-5555-5555-5555-555555555555",
  //   numero_temporada: 1,
  //   episodios: [
  //     { id: "react-aula1", titulo: "Aula 1 — Introdução",  arquivo: "react-aula1.mp4", duracao_seg: 900,  numero: 1 },
  //     { id: "react-aula2", titulo: "Aula 2 — Componentes", arquivo: "react-aula2.mp4", duracao_seg: 1200, numero: 2 },
  //   ],
  // },
];
 
// ==========================
//  CAPÍTULOS DE MANGÁ (PDFs)
// ==========================
 
const capitulos = [
  // {
  //   id:          "one-piece-cap-1",
  //   conteudo_id: "one-piece-manga",
  //   numero:      1,
  //   titulo:      "Romance Dawn",
  //   pdf_url:     "mangas/one-piece/001.pdf",
  //   capa:        "https://...",
  //   paginas:     53,
  // },
];
 
// ==========================
//  FUNÇÃO PRINCIPAL
// ==========================
 
async function salvarConteudos() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
 
    for (const serie of conteudos) {
      // 1) Conteúdo principal
      await client.query(
        `INSERT INTO conteudos (id, titulo, tipo, poster, descricao, generos, classificacao, ano)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET
           titulo        = EXCLUDED.titulo,
           tipo          = EXCLUDED.tipo,
           poster        = EXCLUDED.poster,
           descricao     = EXCLUDED.descricao,
           generos       = EXCLUDED.generos,
           classificacao = EXCLUDED.classificacao,
           ano           = EXCLUDED.ano`,
        [serie.conteudo_id, serie.titulo, serie.tipo, serie.poster,
         serie.descricao, serie.generos, serie.classificacao, serie.ano]
      );
 
      // 2) Temporada (se houver episódios)
      if (serie.episodios?.length && serie.temporada_id) {
        await client.query(
          `INSERT INTO temporadas (id, conteudo_id, numero)
           VALUES ($1,$2,$3)
           ON CONFLICT (conteudo_id, numero) DO NOTHING`,
          [serie.temporada_id, serie.conteudo_id, serie.numero_temporada]
        );
 
        // 3) Episódios
        for (const ep of serie.episodios) {
          await client.query(
            `INSERT INTO episodios
               (id, temporada_id, titulo, descricao, capa, video_url, duracao_seg, numero, intro_inicio, intro_fim)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             ON CONFLICT (id) DO UPDATE SET
               titulo      = EXCLUDED.titulo,
               descricao   = EXCLUDED.descricao,
               capa        = EXCLUDED.capa,
               video_url   = EXCLUDED.video_url,
               duracao_seg = EXCLUDED.duracao_seg,
               numero      = EXCLUDED.numero`,
            [
              ep.id,
              serie.temporada_id,
              ep.titulo,
              ep.descricao || ep.titulo,
              ep.capa      || serie.poster,
              `${VIDEO_BASE}/${ep.arquivo}`,
              ep.duracao_seg,
              ep.numero,
              0,
              90,
            ]
          );
        }
      }
    }
 
    // 4) Capítulos de mangá
    for (const cap of capitulos) {
      await client.query(
        `INSERT INTO capitulos (id, conteudo_id, numero, titulo, pdf_url, capa, paginas)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET
           numero  = EXCLUDED.numero,
           titulo  = EXCLUDED.titulo,
           pdf_url = EXCLUDED.pdf_url,
           capa    = EXCLUDED.capa,
           paginas = EXCLUDED.paginas`,
        [cap.id, cap.conteudo_id, cap.numero, cap.titulo,
         cap.pdf_url, cap.capa || null, cap.paginas || 0]
      );
    }
 
    await client.query("COMMIT");
    console.log("? Conteúdos salvos com sucesso!");
  } catch (erro) {
    await client.query("ROLLBACK");
    console.error("? Erro ao salvar conteúdos:", erro.message);
  } finally {
    client.release();
    await pool.end();
  }
}
 
salvarConteudos();
