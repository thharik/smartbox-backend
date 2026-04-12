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
          { id: "gash_ep1",  titulo: "Konjiki no Gash Bell - Episódio 1",  numero: 1,  duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP1.mp4" },
          { id: "gash_ep2",  titulo: "Konjiki no Gash Bell - Episódio 2",  numero: 2,  duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP2.mp4" },
          { id: "gash_ep3",  titulo: "Konjiki no Gash Bell - Episódio 3",  numero: 3,  duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP3.mp4" },
          { id: "gash_ep4",  titulo: "Konjiki no Gash Bell - Episódio 4",  numero: 4,  duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP4.mp4" },
          { id: "gash_ep5",  titulo: "Konjiki no Gash Bell - Episódio 5",  numero: 5,  duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP5.mp4" },
          { id: "gash_ep6",  titulo: "Konjiki no Gash Bell - Episódio 6",  numero: 6,  duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP6.mp4" },
          { id: "gash_ep7",  titulo: "Konjiki no Gash Bell - Episódio 7",  numero: 7,  duracao_seg: 1500, arquivo: "GashBellEP7.mp4" },
          { id: "gash_ep8",  titulo: "Konjiki no Gash Bell - Episódio 8",  numero: 8,  duracao_seg: 1500, arquivo: "GashBellEP8.mp4" },
          { id: "gash_ep9",  titulo: "Konjiki no Gash Bell - Episódio 9",  numero: 9,  duracao_seg: 1500, arquivo: "GashBellEP9.mp4" },
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
          { id: "gash_ep29", titulo: "Konjiki no Gash Bell - Episódio 29", numero: 29, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP29.mp4" },
          { id: "gash_ep30", titulo: "Konjiki no Gash Bell - Episódio 30", numero: 30, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP30.mp4" },
          { id: "gash_ep31", titulo: "Konjiki no Gash Bell - Episódio 31", numero: 31, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP31.mp4" },
          { id: "gash_ep32", titulo: "Konjiki no Gash Bell - Episódio 32", numero: 32, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP32.mp4" },
          { id: "gash_ep33", titulo: "Konjiki no Gash Bell - Episódio 33", numero: 33, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP33.mp4" },
          { id: "gash_ep34", titulo: "Konjiki no Gash Bell - Episódio 34", numero: 34, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP34.mp4" },
          { id: "gash_ep35", titulo: "Konjiki no Gash Bell - Episódio 35", numero: 35, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP35.mp4" },
          { id: "gash_ep36", titulo: "Konjiki no Gash Bell - Episódio 36", numero: 36, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP36.mp4" },
          { id: "gash_ep37", titulo: "Konjiki no Gash Bell - Episódio 37", numero: 37, duracao_seg: 1500, arquivo: "KonjikinoGashBellEP37.mp4" },
          { id: "gash_ep38", titulo: "Konjiki no Gash Bell - Episódio 38", numero: 38, duracao_seg: 1500, arquivo: "KonjikinoGashBell38.mp4" },
          { id: "gash_ep39", titulo: "Konjiki no Gash Bell - Episódio 39", numero: 39, duracao_seg: 1500, arquivo: "KonjikinoGashBell39.mp4" },
          { id: "gash_ep40", titulo: "Konjiki no Gash Bell - Episódio 40", numero: 40, duracao_seg: 1500, arquivo: "KonjikinoGashBell40.mp4" },
          { id: "gash_ep41", titulo: "Konjiki no Gash Bell - Episódio 41", numero: 41, duracao_seg: 1500, arquivo: "KonjikinoGashBell41.mp4" },
          { id: "gash_ep42", titulo: "Konjiki no Gash Bell - Episódio 42", numero: 42, duracao_seg: 1500, arquivo: "KonjikinoGashBell42.mp4" },
          { id: "gash_ep43", titulo: "Konjiki no Gash Bell - Episódio 43", numero: 43, duracao_seg: 1500, arquivo: "KonjikinoGashBell43.mp4" },
          { id: "gash_ep44", titulo: "Konjiki no Gash Bell - Episódio 44", numero: 44, duracao_seg: 1500, arquivo: "KonjikinoGashBell44.mp4" },
          { id: "gash_ep45", titulo: "Konjiki no Gash Bell - Episódio 45", numero: 45, duracao_seg: 1500, arquivo: "KonjikinoGashBell45.mp4" },
          { id: "gash_ep46", titulo: "Konjiki no Gash Bell - Episódio 46", numero: 46, duracao_seg: 1500, arquivo: "KonjikinoGashBell46.mp4" },
          { id: "gash_ep47", titulo: "Konjiki no Gash Bell - Episódio 47", numero: 47, duracao_seg: 1500, arquivo: "KonjikinoGashBell47.mp4" }
        ]
      }
    ]
  },

  {
    conteudo_id: "konjiki_no_gash_2",
    titulo: "Konjiki no Gash!! 2",
    tipo: "Manga",
    poster: `${POSTER_BASE}/Gash_fu_capa2.jpg`,
    descricao: "Continuação oficial de Konjiki no Gash Bell, trazendo uma nova fase da história com reencontros, batalhas e mistérios.",
    generos: ["Manga", "Aventura"],
    classificacao: "Livre",
    ano: 2026,
    temporadas: []
  },

  {
    conteudo_id: "soul_eater",
    titulo: "Soul Eater",
    tipo: "Manga",
    poster: `${POSTER_BASE}/souleaterimagem.jpg`,
    descricao: "Em um mundo sombrio e estilizado, estudantes da Shibusen lutam contra almas malignas e criaturas perigosas em uma aventura cheia de ação e fantasia.",
    generos: ["Manga", "Ação", "Fantasia"],
    classificacao: "14",
    ano: 2009,
    temporadas: []
  },

  {
    conteudo_id: "gintama",
    titulo: "Gintama",
    tipo: "Manga",
    poster: `${POSTER_BASE}/gintama.avif`,
    descricao: "No Japão feudal invadido por alienígenas, o samurai Gintoki Sakata e seus companheiros embarcam em aventuras hilárias e emocionantes enquanto tentam sobreviver em um mundo completamente fora do comum.",
    generos: ["Manga", "Comédia", "Ação", "Ficção Científica"],
    classificacao: "14",
    ano: 2003,
    temporadas: []
  }
];

const capitulos = [
  // Konjiki no Gash!! 2
  { id: "gash2_vol_01", conteudo_id: "konjiki_no_gash_2", numero: 1, titulo: "Konjiki no Gash!! 2 - Volume 01", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 01.pdf`, capa: `${POSTER_BASE}/Gash_fu_capa2.jpg`, paginas: 0 },
  { id: "gash2_vol_02", conteudo_id: "konjiki_no_gash_2", numero: 2, titulo: "Konjiki no Gash!! 2 - Volume 02", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 02.pdf`, capa: `${POSTER_BASE}/Gash_fu_capa2.jpg`, paginas: 0 },
  { id: "gash2_vol_03", conteudo_id: "konjiki_no_gash_2", numero: 3, titulo: "Konjiki no Gash!! 2 - Volume 03", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 03.pdf`, capa: `${POSTER_BASE}/Gash_fu_capa2.jpg`, paginas: 0 },
  { id: "gash2_vol_04", conteudo_id: "konjiki_no_gash_2", numero: 4, titulo: "Konjiki no Gash!! 2 - Volume 04", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 04.pdf`, capa: `${POSTER_BASE}/Gash_fu_capa2.jpg`, paginas: 0 },
  { id: "gash2_vol_05", conteudo_id: "konjiki_no_gash_2", numero: 5, titulo: "Konjiki no Gash!! 2 - Volume 05", pdf_url: `${PDF_BASE}/Konjiki no Gash!! 2 - Volume 05.pdf`, capa: `${POSTER_BASE}/Gash_fu_capa2.jpg`, paginas: 0 },

  // Soul Eater
  { id: "souleater_vol_01", conteudo_id: "soul_eater", numero: 1,  titulo: "Soul Eater - Volume 01", pdf_url: `${PDF_BASE}/SOULEATERVOL.01.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_02", conteudo_id: "soul_eater", numero: 2,  titulo: "Soul Eater - Volume 02", pdf_url: `${PDF_BASE}/SOULEATERVOL.02.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_03", conteudo_id: "soul_eater", numero: 3,  titulo: "Soul Eater - Volume 03", pdf_url: `${PDF_BASE}/SOULEATERVOL.03.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_04", conteudo_id: "soul_eater", numero: 4,  titulo: "Soul Eater - Volume 04", pdf_url: `${PDF_BASE}/SOULEATERVOL.04.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_05", conteudo_id: "soul_eater", numero: 5,  titulo: "Soul Eater - Volume 05", pdf_url: `${PDF_BASE}/SOULEATERVOL.05.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_06", conteudo_id: "soul_eater", numero: 6,  titulo: "Soul Eater - Volume 06", pdf_url: `${PDF_BASE}/SOULEATERVOL.06.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_07", conteudo_id: "soul_eater", numero: 7,  titulo: "Soul Eater - Volume 07", pdf_url: `${PDF_BASE}/SOULEATERVOL.07.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_08", conteudo_id: "soul_eater", numero: 8,  titulo: "Soul Eater - Volume 08", pdf_url: `${PDF_BASE}/SOULEATERVOL.08.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_09", conteudo_id: "soul_eater", numero: 9,  titulo: "Soul Eater - Volume 09", pdf_url: `${PDF_BASE}/SOULEATERVOL.09.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_10", conteudo_id: "soul_eater", numero: 10, titulo: "Soul Eater - Volume 10", pdf_url: `${PDF_BASE}/SOULEATERVOL.10.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_11", conteudo_id: "soul_eater", numero: 11, titulo: "Soul Eater - Volume 11", pdf_url: `${PDF_BASE}/SOULEATERVOL.11.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_12", conteudo_id: "soul_eater", numero: 12, titulo: "Soul Eater - Volume 12", pdf_url: `${PDF_BASE}/SOULEATERVOL.12.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_14", conteudo_id: "soul_eater", numero: 14, titulo: "Soul Eater - Volume 14", pdf_url: `${PDF_BASE}/SOULEATERVOL.14.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_15", conteudo_id: "soul_eater", numero: 15, titulo: "Soul Eater - Volume 15", pdf_url: `${PDF_BASE}/SOULEATERVOL.15.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_16", conteudo_id: "soul_eater", numero: 16, titulo: "Soul Eater - Volume 16", pdf_url: `${PDF_BASE}/SOULEATERVOL.16.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_17", conteudo_id: "soul_eater", numero: 17, titulo: "Soul Eater - Volume 17", pdf_url: `${PDF_BASE}/SOULEATERVOL.17.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_18", conteudo_id: "soul_eater", numero: 18, titulo: "Soul Eater - Volume 18", pdf_url: `${PDF_BASE}/SOULEATERVOL.18.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_19", conteudo_id: "soul_eater", numero: 19, titulo: "Soul Eater - Volume 19", pdf_url: `${PDF_BASE}/SOULEATERVOL.19.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_20", conteudo_id: "soul_eater", numero: 20, titulo: "Soul Eater - Volume 20", pdf_url: `${PDF_BASE}/SOULEATERVOL.20.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_21", conteudo_id: "soul_eater", numero: 21, titulo: "Soul Eater - Volume 21", pdf_url: `${PDF_BASE}/SOULEATERVOL.21.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_22", conteudo_id: "soul_eater", numero: 22, titulo: "Soul Eater - Volume 22", pdf_url: `${PDF_BASE}/SOULEATERVOL.22.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_23", conteudo_id: "soul_eater", numero: 23, titulo: "Soul Eater - Volume 23", pdf_url: `${PDF_BASE}/SOULEATERVOL.23.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_24", conteudo_id: "soul_eater", numero: 24, titulo: "Soul Eater - Volume 24", pdf_url: `${PDF_BASE}/SOULEATERVOL.24.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },
  { id: "souleater_vol_25", conteudo_id: "soul_eater", numero: 25, titulo: "Soul Eater - Volume 25", pdf_url: `${PDF_BASE}/SOULEATERVOL.25.pdf`, capa: `${POSTER_BASE}/souleaterimagem.jpg`, paginas: 0 },

  // Gintama — nomes sem espaço conforme storage atual
  { id: "gintama_vol_01", conteudo_id: "gintama", numero: 1,  titulo: "Gintama - Volume 01", pdf_url: `${PDF_BASE}/GINTAMAVOL.01.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_02", conteudo_id: "gintama", numero: 2,  titulo: "Gintama - Volume 02", pdf_url: `${PDF_BASE}/GINTAMAVOL.02.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_03", conteudo_id: "gintama", numero: 3,  titulo: "Gintama - Volume 03", pdf_url: `${PDF_BASE}/GINTAMAVOL.03.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_04", conteudo_id: "gintama", numero: 4,  titulo: "Gintama - Volume 04", pdf_url: `${PDF_BASE}/GINTAMAVOL.04.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_05", conteudo_id: "gintama", numero: 5,  titulo: "Gintama - Volume 05", pdf_url: `${PDF_BASE}/GINTAMAVOL.05.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_06", conteudo_id: "gintama", numero: 6,  titulo: "Gintama - Volume 06", pdf_url: `${PDF_BASE}/GINTAMAVOL.06.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_07", conteudo_id: "gintama", numero: 7,  titulo: "Gintama - Volume 07", pdf_url: `${PDF_BASE}/GINTAMAVOL.07.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_08", conteudo_id: "gintama", numero: 8,  titulo: "Gintama - Volume 08", pdf_url: `${PDF_BASE}/GINTAMAVOL.08.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_09", conteudo_id: "gintama", numero: 9,  titulo: "Gintama - Volume 09", pdf_url: `${PDF_BASE}/GINTAMAVOL.09.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_10", conteudo_id: "gintama", numero: 10, titulo: "Gintama - Volume 10", pdf_url: `${PDF_BASE}/GINTAMAVOL.10.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_11", conteudo_id: "gintama", numero: 11, titulo: "Gintama - Volume 11", pdf_url: `${PDF_BASE}/GINTAMAVOL.11.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_12", conteudo_id: "gintama", numero: 12, titulo: "Gintama - Volume 12", pdf_url: `${PDF_BASE}/GINTAMAVOL.12.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_13", conteudo_id: "gintama", numero: 13, titulo: "Gintama - Volume 13", pdf_url: `${PDF_BASE}/GINTAMAVOL.13.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_14", conteudo_id: "gintama", numero: 14, titulo: "Gintama - Volume 14", pdf_url: `${PDF_BASE}/GINTAMAVOL.14.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_15", conteudo_id: "gintama", numero: 15, titulo: "Gintama - Volume 15", pdf_url: `${PDF_BASE}/GINTAMAVOL.15.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_16", conteudo_id: "gintama", numero: 16, titulo: "Gintama - Volume 16", pdf_url: `${PDF_BASE}/GINTAMAVOL.16.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_17", conteudo_id: "gintama", numero: 17, titulo: "Gintama - Volume 17", pdf_url: `${PDF_BASE}/GINTAMAVOL.17.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_18", conteudo_id: "gintama", numero: 18, titulo: "Gintama - Volume 18", pdf_url: `${PDF_BASE}/GINTAMAVOL.18.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_19", conteudo_id: "gintama", numero: 19, titulo: "Gintama - Volume 19", pdf_url: `${PDF_BASE}/GINTAMAVOL.19.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_20", conteudo_id: "gintama", numero: 20, titulo: "Gintama - Volume 20", pdf_url: `${PDF_BASE}/GINTAMAVOL.20.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_21", conteudo_id: "gintama", numero: 21, titulo: "Gintama - Volume 21", pdf_url: `${PDF_BASE}/GINTAMAVOL.21.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_22", conteudo_id: "gintama", numero: 22, titulo: "Gintama - Volume 22", pdf_url: `${PDF_BASE}/GINTAMAVOL.22.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_23", conteudo_id: "gintama", numero: 23, titulo: "Gintama - Volume 23", pdf_url: `${PDF_BASE}/GINTAMAVOL.23.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_24", conteudo_id: "gintama", numero: 24, titulo: "Gintama - Volume 24", pdf_url: `${PDF_BASE}/GINTAMAVOL.24.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_25", conteudo_id: "gintama", numero: 25, titulo: "Gintama - Volume 25", pdf_url: `${PDF_BASE}/GINTAMAVOL.25.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_26", conteudo_id: "gintama", numero: 26, titulo: "Gintama - Volume 26", pdf_url: `${PDF_BASE}/GINTAMAVOL.26.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_27", conteudo_id: "gintama", numero: 27, titulo: "Gintama - Volume 27", pdf_url: `${PDF_BASE}/GINTAMAVOL.27.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_28", conteudo_id: "gintama", numero: 28, titulo: "Gintama - Volume 28", pdf_url: `${PDF_BASE}/GINTAMAVOL.28.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_34", conteudo_id: "gintama", numero: 34, titulo: "Gintama - Volume 34", pdf_url: `${PDF_BASE}/GINTAMAVOL.34.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_35", conteudo_id: "gintama", numero: 35, titulo: "Gintama - Volume 35", pdf_url: `${PDF_BASE}/GINTAMAVOL.35.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_40", conteudo_id: "gintama", numero: 40, titulo: "Gintama - Volume 40", pdf_url: `${PDF_BASE}/GINTAMAVOL.40.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_41", conteudo_id: "gintama", numero: 41, titulo: "Gintama - Volume 41", pdf_url: `${PDF_BASE}/GINTAMAVOL.41.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_42", conteudo_id: "gintama", numero: 42, titulo: "Gintama - Volume 42", pdf_url: `${PDF_BASE}/GINTAMAVOL.42.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_44", conteudo_id: "gintama", numero: 44, titulo: "Gintama - Volume 44", pdf_url: `${PDF_BASE}/GINTAMAVOL.44.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_45", conteudo_id: "gintama", numero: 45, titulo: "Gintama - Volume 45", pdf_url: `${PDF_BASE}/GINTAMAVOL.45.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_46", conteudo_id: "gintama", numero: 46, titulo: "Gintama - Volume 46", pdf_url: `${PDF_BASE}/GINTAMAVOL.46.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_47", conteudo_id: "gintama", numero: 47, titulo: "Gintama - Volume 47", pdf_url: `${PDF_BASE}/GINTAMAVOL.47.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_48", conteudo_id: "gintama", numero: 48, titulo: "Gintama - Volume 48", pdf_url: `${PDF_BASE}/GINTAMAVOL.48.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_49", conteudo_id: "gintama", numero: 49, titulo: "Gintama - Volume 49", pdf_url: `${PDF_BASE}/GINTAMAVOL.49.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_51", conteudo_id: "gintama", numero: 51, titulo: "Gintama - Volume 51", pdf_url: `${PDF_BASE}/GINTAMAVOL.51.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_53", conteudo_id: "gintama", numero: 53, titulo: "Gintama - Volume 53", pdf_url: `${PDF_BASE}/GINTAMAVOL.53.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_55", conteudo_id: "gintama", numero: 55, titulo: "Gintama - Volume 55", pdf_url: `${PDF_BASE}/GINTAMAVOL.55.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_56", conteudo_id: "gintama", numero: 56, titulo: "Gintama - Volume 56", pdf_url: `${PDF_BASE}/GINTAMAVOL.56.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_57", conteudo_id: "gintama", numero: 57, titulo: "Gintama - Volume 57", pdf_url: `${PDF_BASE}/GINTAMAVOL.57.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_58", conteudo_id: "gintama", numero: 58, titulo: "Gintama - Volume 58", pdf_url: `${PDF_BASE}/GINTAMAVOL.58.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_62", conteudo_id: "gintama", numero: 62, titulo: "Gintama - Volume 62", pdf_url: `${PDF_BASE}/GINTAMAVOL.62.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_63", conteudo_id: "gintama", numero: 63, titulo: "Gintama - Volume 63", pdf_url: `${PDF_BASE}/GINTAMAVOL.63.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_68", conteudo_id: "gintama", numero: 68, titulo: "Gintama - Volume 68", pdf_url: `${PDF_BASE}/GINTAMAVOL.68.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_69", conteudo_id: "gintama", numero: 69, titulo: "Gintama - Volume 69", pdf_url: `${PDF_BASE}/GINTAMAVOL.69.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },
  { id: "gintama_vol_76", conteudo_id: "gintama", numero: 76, titulo: "Gintama - Volume 76", pdf_url: `${PDF_BASE}/GINTAMAVOL.76.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 }
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