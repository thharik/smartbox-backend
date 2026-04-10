require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

const FILE_BASE = "https://tvxbox-b2.tharikluan-miguel.workers.dev";
const VIDEO_BASE = FILE_BASE;
const POSTER_BASE = FILE_BASE;
const PDF_BASE = FILE_BASE;

const conteudos = [
  {
    conteudo_id: "gashbell",
    titulo: "Konjiki no Gash Bell",
    tipo: "Anime",
    poster: `${POSTER_BASE}/gash_capa1.jpg`,
    descricao: "A história acompanha Gash Bell e Kiyo Takamine em batalhas entre mamodos. Com muita emoção, humor e combates marcantes, a série mistura magia, amizade e coragem.",
    generos: ["Anime", "Aventura"],
    classificacao: "Livre",
    ano: 2003,
    temporadas: [
      {
        temporada_id: "e5555555-5555-5555-5555-555555555555",
        numero: 1,
        episodios: [
          { id: "gash_ep1", titulo: "Konjiki no Gash Bell - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP1.mp4" },
          { id: "gash_ep4", titulo: "Konjiki no Gash Bell - Episódio 4", numero: 4, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP4.mp4" },
          { id: "gash_ep5", titulo: "Konjiki no Gash Bell - Episódio 5", numero: 5, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP5.mp4" },
          { id: "gash_ep6", titulo: "Konjiki no Gash Bell - Episódio 6", numero: 6, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP6.mp4" },
          { id: "gash_ep7", titulo: "Konjiki no Gash Bell - Episódio 7", numero: 7, duracao_seg: 1500, arquivo: "GashBellEP7.mp4" },
          { id: "gash_ep8", titulo: "Konjiki no Gash Bell - Episódio 8", numero: 8, duracao_seg: 1500, arquivo: "GashBellEP8.mp4" },
          { id: "gash_ep9", titulo: "Konjiki no Gash Bell - Episódio 9", numero: 9, duracao_seg: 1500, arquivo: "GashBellEP9.mp4" },
          { id: "gash_ep10", titulo: "Konjiki no Gash Bell - Episódio 10", numero: 10, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP10.mp4" },
          { id: "gash_ep11", titulo: "Konjiki no Gash Bell - Episódio 11", numero: 11, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP11.mp4" },
          { id: "gash_ep12", titulo: "Konjiki no Gash Bell - Episódio 12", numero: 12, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP12.mp4" },
          { id: "gash_ep13", titulo: "Konjiki no Gash Bell - Episódio 13", numero: 13, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP13.mp4" },
          { id: "gash_ep14", titulo: "Konjiki no Gash Bell - Episódio 14", numero: 14, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP14.mp4" },
          { id: "gash_ep15", titulo: "Konjiki no Gash Bell - Episódio 15", numero: 15, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP15.mp4" },
          { id: "gash_ep16", titulo: "Konjiki no Gash Bell - Episódio 16", numero: 16, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP16.mp4" },
          { id: "gash_ep17", titulo: "Konjiki no Gash Bell - Episódio 17", numero: 17, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP17.mp4" },
          { id: "gash_ep18", titulo: "Konjiki no Gash Bell - Episódio 18", numero: 18, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP18.mp4" },
          { id: "gash_ep19", titulo: "Konjiki no Gash Bell - Episódio 19", numero: 19, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP19.mp4" },
          { id: "gash_ep20", titulo: "Konjiki no Gash Bell - Episódio 20", numero: 20, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP20.mp4" },
          { id: "gash_ep21", titulo: "Konjiki no Gash Bell - Episódio 21", numero: 21, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP21.mp4" },
          { id: "gash_ep22", titulo: "Konjiki no Gash Bell - Episódio 22", numero: 22, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP22.mp4" },
          { id: "gash_ep23", titulo: "Konjiki no Gash Bell - Episódio 23", numero: 23, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP23.mp4" },
          { id: "gash_ep24", titulo: "Konjiki no Gash Bell - Episódio 24", numero: 24, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP24.mp4" },
          { id: "gash_ep25", titulo: "Konjiki no Gash Bell - Episódio 25", numero: 25, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP25.mp4" },
          { id: "gash_ep26", titulo: "Konjiki no Gash Bell - Episódio 26", numero: 26, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP26.mp4" },
          { id: "gash_ep27", titulo: "Konjiki no Gash Bell - Episódio 27", numero: 27, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP27.mp4" },
          { id: "gash_ep28", titulo: "Konjiki no Gash Bell - Episódio 28", numero: 28, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP28.mp4" },
          { id: "gash_ep29", titulo: "Konjiki no Gash Bell - Episódio 29", numero: 29, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP29.mp4" }
        ]
      }
    ]
  },

  {
    conteudo_id: "konjiki_no_gash_2",
    titulo: "Konjiki no Gash!! 2",
    tipo: "Mangá",
    poster: `${POSTER_BASE}/Gash_fu_capa2.jpg`,
    descricao: "Continuação oficial de Konjiki no Gash Bell, trazendo uma nova fase da história com reencontros, batalhas e mistérios.",
    generos: ["Mangá", "Aventura"],
    classificacao: "Livre",
    ano: 2026,
    temporadas: []
  },

  {
    conteudo_id: "soul_eater",
    titulo: "Soul Eater",
    tipo: "Mangá",
    poster: `${POSTER_BASE}/gash_capa1.jpg`,
    descricao: "Em um mundo sombrio e estilizado, estudantes da Shibusen lutam contra almas malignas e criaturas perigosas em uma aventura cheia de ação e fantasia.",
    generos: ["Mangá", "Ação", "Fantasia"],
    classificacao: "14",
    ano: 2009,
    temporadas: []
  }
];

const capitulos = [
  { id: "gash2_vol_01", conteudo_id: "konjiki_no_gash_2", numero: 1, titulo: "Konjiki no Gash!! 2 - Volume 01", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 01.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "gash2_vol_02", conteudo_id: "konjiki_no_gash_2", numero: 2, titulo: "Konjiki no Gash!! 2 - Volume 02", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 02.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "gash2_vol_03", conteudo_id: "konjiki_no_gash_2", numero: 3, titulo: "Konjiki no Gash!! 2 - Volume 03", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 03.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "gash2_vol_04", conteudo_id: "konjiki_no_gash_2", numero: 4, titulo: "Konjiki no Gash!! 2 - Volume 04", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 04.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "gash2_vol_05", conteudo_id: "konjiki_no_gash_2", numero: 5, titulo: "Konjiki no Gash!! 2 - Volume 05", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 05.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },

  { id: "souleater_vol_01", conteudo_id: "soul_eater", numero: 1, titulo: "Soul Eater - Volume 01", pdf_url: `${PDF_BASE}/SOULEATERVOL.01.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_02", conteudo_id: "soul_eater", numero: 2, titulo: "Soul Eater - Volume 02", pdf_url: `${PDF_BASE}/SOULEATERVOL.02.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_03", conteudo_id: "soul_eater", numero: 3, titulo: "Soul Eater - Volume 03", pdf_url: `${PDF_BASE}/SOULEATERVOL.03.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_04", conteudo_id: "soul_eater", numero: 4, titulo: "Soul Eater - Volume 04", pdf_url: `${PDF_BASE}/SOULEATERVOL.04.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_05", conteudo_id: "soul_eater", numero: 5, titulo: "Soul Eater - Volume 05", pdf_url: `${PDF_BASE}/SOULEATERVOL.05.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_06", conteudo_id: "soul_eater", numero: 6, titulo: "Soul Eater - Volume 06", pdf_url: `${PDF_BASE}/SOULEATERVOL.06.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_07", conteudo_id: "soul_eater", numero: 7, titulo: "Soul Eater - Volume 07", pdf_url: `${PDF_BASE}/SOULEATERVOL.07.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_08", conteudo_id: "soul_eater", numero: 8, titulo: "Soul Eater - Volume 08", pdf_url: `${PDF_BASE}/SOULEATERVOL.08.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_09", conteudo_id: "soul_eater", numero: 9, titulo: "Soul Eater - Volume 09", pdf_url: `${PDF_BASE}/SOULEATERVOL.09.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_10", conteudo_id: "soul_eater", numero: 10, titulo: "Soul Eater - Volume 10", pdf_url: `${PDF_BASE}/SOULEATERVOL.10.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_11", conteudo_id: "soul_eater", numero: 11, titulo: "Soul Eater - Volume 11", pdf_url: `${PDF_BASE}/SOULEATERVOL.11.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_12", conteudo_id: "soul_eater", numero: 12, titulo: "Soul Eater - Volume 12", pdf_url: `${PDF_BASE}/SOULEATERVOL.12.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_14", conteudo_id: "soul_eater", numero: 14, titulo: "Soul Eater - Volume 14", pdf_url: `${PDF_BASE}/SOULEATERVOL.14.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_15", conteudo_id: "soul_eater", numero: 15, titulo: "Soul Eater - Volume 15", pdf_url: `${PDF_BASE}/SOULEATERVOL.15.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_16", conteudo_id: "soul_eater", numero: 16, titulo: "Soul Eater - Volume 16", pdf_url: `${PDF_BASE}/SOULEATERVOL.16.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_17", conteudo_id: "soul_eater", numero: 17, titulo: "Soul Eater - Volume 17", pdf_url: `${PDF_BASE}/SOULEATERVOL.17.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_18", conteudo_id: "soul_eater", numero: 18, titulo: "Soul Eater - Volume 18", pdf_url: `${PDF_BASE}/SOULEATERVOL.18.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_19", conteudo_id: "soul_eater", numero: 19, titulo: "Soul Eater - Volume 19", pdf_url: `${PDF_BASE}/SOULEATERVOL.19.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_20", conteudo_id: "soul_eater", numero: 20, titulo: "Soul Eater - Volume 20", pdf_url: `${PDF_BASE}/SOULEATERVOL.20.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_21", conteudo_id: "soul_eater", numero: 21, titulo: "Soul Eater - Volume 21", pdf_url: `${PDF_BASE}/SOULEATERVOL.21.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_22", conteudo_id: "soul_eater", numero: 22, titulo: "Soul Eater - Volume 22", pdf_url: `${PDF_BASE}/SOULEATERVOL.22.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_23", conteudo_id: "soul_eater", numero: 23, titulo: "Soul Eater - Volume 23", pdf_url: `${PDF_BASE}/SOULEATERVOL.23.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_24", conteudo_id: "soul_eater", numero: 24, titulo: "Soul Eater - Volume 24", pdf_url: `${PDF_BASE}/SOULEATERVOL.24.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 },
  { id: "souleater_vol_25", conteudo_id: "soul_eater", numero: 25, titulo: "Soul Eater - Volume 25", pdf_url: `${PDF_BASE}/SOULEATERVOL.25.pdf`, capa: `${POSTER_BASE}/gash_capa1.jpg`, paginas: 0 }
];

async function salvarConteudos() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("Iniciando salvamento dos conteúdos...");

    for (const serie of conteudos) {
      console.log(`Salvando conteúdo: ${serie.conteudo_id}`);

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
        [
          serie.conteudo_id,
          serie.titulo,
          serie.tipo,
          serie.poster,
          serie.descricao,
          serie.generos,
          serie.classificacao,
          serie.ano
        ]
      );

      for (const temporada of (serie.temporadas || [])) {
        let temporadaIdReal;

        const temporadaExistente = await client.query(
          `SELECT id FROM temporadas WHERE conteudo_id=$1 AND numero=$2 LIMIT 1`,
          [serie.conteudo_id, temporada.numero]
        );

        if (temporadaExistente.rows.length > 0) {
          temporadaIdReal = temporadaExistente.rows[0].id;
          console.log(`Temporada ${temporada.numero} já existe (${temporadaIdReal})`);
        } else {
          const nova = await client.query(
            `INSERT INTO temporadas (id, conteudo_id, numero)
             VALUES ($1,$2,$3)
             RETURNING id`,
            [temporada.temporada_id, serie.conteudo_id, temporada.numero]
          );
          temporadaIdReal = nova.rows[0].id;
          console.log(`Temporada ${temporada.numero} criada (${temporadaIdReal})`);
        }

        for (const ep of (temporada.episodios || [])) {
          console.log(`Episódio: ${ep.id}`);

          await client.query(
            `INSERT INTO episodios
              (id, temporada_id, titulo, descricao, capa, video_url, duracao_seg, numero, intro_inicio, intro_fim)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             ON CONFLICT (id) DO UPDATE SET
               temporada_id = EXCLUDED.temporada_id,
               titulo       = EXCLUDED.titulo,
               descricao    = EXCLUDED.descricao,
               capa         = EXCLUDED.capa,
               video_url    = EXCLUDED.video_url,
               duracao_seg  = EXCLUDED.duracao_seg,
               numero       = EXCLUDED.numero,
               intro_inicio = EXCLUDED.intro_inicio,
               intro_fim    = EXCLUDED.intro_fim`,
            [
              ep.id,
              temporadaIdReal,
              ep.titulo,
              ep.titulo,
              serie.poster,
              `${VIDEO_BASE}/${ep.arquivo}`,
              ep.duracao_seg,
              ep.numero,
              0,
              90
            ]
          );
        }
      }
    }

    for (const cap of capitulos) {
      console.log(`Capítulo/PDF: ${cap.id}`);

      await client.query(
        `INSERT INTO capitulos (id, conteudo_id, numero, titulo, pdf_url, capa, paginas)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET
           numero  = EXCLUDED.numero,
           titulo  = EXCLUDED.titulo,
           pdf_url = EXCLUDED.pdf_url,
           capa    = EXCLUDED.capa,
           paginas = EXCLUDED.paginas`,
        [
          cap.id,
          cap.conteudo_id,
          cap.numero,
          cap.titulo,
          cap.pdf_url,
          cap.capa || null,
          cap.paginas || 0
        ]
      );
    }

    await client.query("COMMIT");
    console.log("Conteúdos salvos com sucesso!");
  } catch (erro) {
    await client.query("ROLLBACK");
    console.error("Erro ao salvar conteúdos:", erro.message);
  } finally {
    client.release();
    await pool.end();
  }
}

salvarConteudos();