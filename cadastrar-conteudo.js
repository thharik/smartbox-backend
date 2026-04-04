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

const VIDEO_BASE = "https://tvxbox-b2.tharikluan-miguel.workers.dev";
const POSTER_BASE = VIDEO_BASE;

const conteudos = [

  // ===================== BUDDY =====================
  {
    conteudo_id: "buddy",
    titulo: "Buddy",
    tipo: "Anime",
    poster: `${POSTER_BASE}/Buddy.jpg`,
    descricao: "Serie adicionada ao catalogo Tvxbox.",
    generos: ["Anime", "Aventura"],
    classificacao: "Livre",
    ano: 2026,
    temporada_id: "a1111111-1111-1111-1111-111111111111",
    numero_temporada: 1,
    episodios: [
      { id: "buddy_ep1", titulo: "Episódio 1", arquivo: "buddyEP1.mp4", duracao_seg: 1787, numero: 1 },
      { id: "buddy_ep2", titulo: "Episódio 2", arquivo: "buddyEP2.mp4", duracao_seg: 1529, numero: 2 },
      { id: "buddy_ep3", titulo: "Episódio 3", arquivo: "buddyEP3.mp4", duracao_seg: 1039, numero: 3 },
      { id: "buddy_ep4", titulo: "Episódio 4", arquivo: "buddyEP4.mp4", duracao_seg: 1521, numero: 4 },
      { id: "buddy_ep5", titulo: "Episódio 5", arquivo: "buddyEP5.mp4", duracao_seg: 992, numero: 5 },
      { id: "buddy_ep6", titulo: "Episódio 6", arquivo: "buddyEP6.mp4", duracao_seg: 1580, numero: 6 },
      { id: "buddy_ep7", titulo: "Episódio 7", arquivo: "buddyEP7.mp4", duracao_seg: 1432, numero: 7 },
      { id: "buddy_ep8", titulo: "Episódio 8", arquivo: "buddyEP8.mp4", duracao_seg: 1141, numero: 8 },
      { id: "buddy_ep9", titulo: "Episódio 9", arquivo: "buddyEP9.mp4", duracao_seg: 1736, numero: 9 },
      { id: "buddy_ep10", titulo: "Episódio 10", arquivo: "buddyEP10.mp4", duracao_seg: 1531, numero: 10 },
      { id: "buddy_ep11", titulo: "Episódio 11", arquivo: "buddyEP11.mp4", duracao_seg: 1327, numero: 11 },
      { id: "buddy_ep12", titulo: "Episódio 12", arquivo: "buddyEP12.mp4", duracao_seg: 2662, numero: 12 }
    ]
  },

  // ===================== FRIEREN =====================
  {
    conteudo_id: "frieren",
    titulo: "Frieren",
    tipo: "Anime",
    poster: `${POSTER_BASE}/frieren.jpg`,
    descricao: "Anime de fantasia.",
    generos: ["Anime", "Fantasia"],
    classificacao: "Livre",
    ano: 2026,
    temporada_id: "b2222222-2222-2222-2222-222222222222",
    numero_temporada: 1,
    episodios: [
      { id: "frieren_ep1", titulo: "Episódio 1", arquivo: "FrierenEP1.mp4", duracao_seg: 1500, numero: 1 },
      { id: "frieren_ep2", titulo: "Episódio 2", arquivo: "FrierenEP2.mp4", duracao_seg: 1500, numero: 2 },
      { id: "frieren_ep3", titulo: "Episódio 3", arquivo: "FrierenEP3.mp4", duracao_seg: 1500, numero: 3 }
    ]
  },

  // ===================== KINGDOM =====================
  {
    conteudo_id: "kingdom",
    titulo: "Kingdom",
    tipo: "Anime",
    poster: `${POSTER_BASE}/kingdom.jpg`,
    descricao: "Anime de ação e guerra.",
    generos: ["Anime", "Acao"],
    classificacao: "Livre",
    ano: 2026,
    temporada_id: "c3333333-3333-3333-3333-333333333333",
    numero_temporada: 1,
    episodios: [
      { id: "kingdom_ep1", titulo: "Ep 1", arquivo: "KingdomEP1.mp4", duracao_seg: 1500, numero: 1 },
      { id: "kingdom_ep2", titulo: "Ep 2", arquivo: "KingdomEP2.mp4", duracao_seg: 1500, numero: 2 },
      { id: "kingdom_ep3", titulo: "Ep 3", arquivo: "KingdomEP3.mp4", duracao_seg: 1500, numero: 3 },
      { id: "kingdom_ep5", titulo: "Ep 5", arquivo: "KingdomEP5.mp4", duracao_seg: 1500, numero: 5 },
      { id: "kingdom_ep6", titulo: "Ep 6", arquivo: "KingdomEP6.mp4", duracao_seg: 1500, numero: 6 },
      { id: "kingdom_ep7", titulo: "Ep 7", arquivo: "KingdomEP7.mp4", duracao_seg: 1500, numero: 7 },
      { id: "kingdom_ep8", titulo: "Ep 8", arquivo: "KingdomEP8.mp4", duracao_seg: 1500, numero: 8 },
      { id: "kingdom_ep9", titulo: "Ep 9", arquivo: "KingdomEP9.mp4", duracao_seg: 1500, numero: 9 },
      { id: "kingdom_ep10", titulo: "Ep 10", arquivo: "KingdomEP10.mp4", duracao_seg: 1500, numero: 10 },
      { id: "kingdom_ep11", titulo: "Ep 11", arquivo: "KingdomEP11.mp4", duracao_seg: 1500, numero: 11 },
      { id: "kingdom_ep13", titulo: "Ep 13", arquivo: "KingdomEP13.mp4", duracao_seg: 1500, numero: 13 }
    ]
  },

  // ===================== GASH BELL =====================
  {
    conteudo_id: "gashbell",
    titulo: "Konjiki no Gash Bell",
    tipo: "Anime",
    poster: `${POSTER_BASE}/KIRIO_FAN_CLUB_.webp`,
    descricao: "Anime clássico de batalhas.",
    generos: ["Anime", "Aventura"],
    classificacao: "Livre",
    ano: 2003,
    temporada_id: "e5555555-5555-5555-5555-555555555555",
    numero_temporada: 1,
    episodios: [
      { id: "gash_ep1", titulo: "Ep 1", arquivo: "Konjiki_no_Gash_BellEP1.mp4", duracao_seg: 1500, numero: 1 },
      { id: "gash_ep2", titulo: "Ep 2", arquivo: "Konjiki_no_Gash_BellEP2.mp4", duracao_seg: 1500, numero: 2 },
      { id: "gash_ep3", titulo: "Ep 3", arquivo: "Konjiki_no_Gash_BellEP3.mp4", duracao_seg: 1500, numero: 3 },
      { id: "gash_ep4", titulo: "Ep 4", arquivo: "Konjiki_no_Gash_BellEP4.mp4", duracao_seg: 1500, numero: 4 },
      { id: "gash_ep5", titulo: "Ep 5", arquivo: "Konjiki_no_Gash_BellEP5.mp4", duracao_seg: 1500, numero: 5 },
      { id: "gash_ep6", titulo: "Ep 6", arquivo: "Konjiki_no_Gash_BellEP6.mp4", duracao_seg: 1500, numero: 6 },
      { id: "gash_ep7", titulo: "Ep 7", arquivo: "GashBellEP7.mp4", duracao_seg: 1500, numero: 7 },
      { id: "gash_ep8", titulo: "Ep 8", arquivo: "GashBellEP8.mp4", duracao_seg: 1500, numero: 8 },
      { id: "gash_ep9", titulo: "Ep 9", arquivo: "GashBellEP9.mp4", duracao_seg: 1500, numero: 9 }
    ]
  }

];

const capitulos = [];