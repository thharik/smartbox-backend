require("dotenv").config();
const { Pool } = require("pg");
const crypto = require("crypto");

const usarSSL =
  process.env.DATABASE_URL && process.env.DATABASE_URL.includes("render.com");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: usarSSL ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 15000,
});

const VIDEO_BASE = "https://smartbox-backend.onrender.com/video";
const POSTER_BASE = "https://tvxbox-b2.tharikluan-miguel.workers.dev";
const PDF_BASE = "https://smartbox-backend.onrender.com/video/pdf";
const FILE_BASE = POSTER_BASE;

const POSTER_PADRAO =
  "https://via.placeholder.com/300x450/141414/ffffff?text=TVXBOX";

const conteudosRemovidos = [
  "wifi-ralph",
  "detona-ralph",
  "ilha-dos-cachorros",
  "avioes",
  "o-tempo-tras-voce-pra-mim",
];

const episodiosRemovidos = [
  "db_filme01",
  "db_filme03",
  "db_filme04",
  "db_filme05",
  "db_filme07",
  "db_filme09",
  "db_filme11",
  "db_filme13",
];

function poster(nomeArquivo) {
  if (!nomeArquivo) return POSTER_PADRAO;
  if (nomeArquivo.startsWith("http")) return nomeArquivo;
  return `${FILE_BASE}/${nomeArquivo}`;
}

function filme({
  id,
  titulo,
  arquivo,
  posterArquivo,
  descricao,
  generos = ["Filme"],
  classificacao = "Livre",
  ano = 2026,
  duracao = 5400,
}) {
  return {
    conteudo_id: id,
    titulo,
    tipo: "Filme",
    poster: poster(posterArquivo),
    descricao:
      descricao ||
      `${titulo} disponível no catálogo TVXBOX, com reprodução online pelo navegador.`,
    generos,
    classificacao,
    ano,
    temporadas: [
      {
        temporada_id: crypto.randomUUID(),
        numero: 1,
        episodios: [
          {
            id: `${id}_filme`,
            titulo,
            numero: 1,
            duracao_seg: duracao,
            arquivo,
          },
        ],
      },
    ],
  };
}

function serie({
  id,
  titulo,
  posterArquivo,
  descricao,
  generos = ["Anime"],
  classificacao = "Livre",
  ano = 2026,
  episodios = [],
}) {
  return {
    conteudo_id: id,
    titulo,
    tipo: "Anime",
    poster: poster(posterArquivo),
    descricao:
      descricao ||
      `${titulo} disponível no catálogo TVXBOX, com episódios organizados para assistir online.`,
    generos,
    classificacao,
    ano,
    temporadas: [
      {
        temporada_id: crypto.randomUUID(),
        numero: 1,
        episodios,
      },
    ],
  };
}

function manga({
  id,
  titulo,
  posterArquivo,
  descricao,
  generos = ["Mangá"],
  classificacao = "12",
  ano = 2026,
}) {
  return {
    conteudo_id: id,
    titulo,
    tipo: "Manga",
    poster: poster(posterArquivo),
    descricao,
    generos,
    classificacao,
    ano,
    temporadas: [],
  };
}

function ep(idPrefixo, tituloBase, numero, arquivo) {
  return {
    id: `${idPrefixo}_ep${numero}`,
    titulo: `${tituloBase} - Episódio ${numero}`,
    numero,
    duracao_seg: 1500,
    arquivo,
  };
}

function capituloPDF({ id, conteudo_id, numero, titulo, arquivo, capa }) {
  return {
    id,
    conteudo_id,
    numero,
    titulo,
    pdf_url: `${PDF_BASE}/${arquivo}`,
    capa: poster(capa),
    paginas: 0,
  };
}

function range(inicio, fim) {
  const lista = [];

  for (let i = inicio; i <= fim; i++) {
    lista.push(i);
  }

  return lista;
}

const filmes = [
  {
    id: "a-face-da-vinganca",
    titulo: "A Face da Vingança",
    arquivo: "AFacedaVinganca.mp4",
    posterArquivo: "afacedavinganca.jpg",
    generos: ["Ação", "Thriller"],
    classificacao: "16",
    ano: 2023,
    duracao: 7200,
  },
  {
    id: "agente-infiltrado",
    titulo: "Agente Infiltrado",
    arquivo: "AgenteInfiltrado.mp4",
    posterArquivo: "agenteinfiltrado.jpg",
    generos: ["Ação", "Suspense"],
    classificacao: "16",
    ano: 2024,
    duracao: 6840,
  },
  {
    id: "alien-vs-predador",
    titulo: "Alien vs. Predador",
    arquivo: "AlienvsPredador.mp4",
    posterArquivo: "alienvspredator.webp",
    generos: ["Ação", "Ficção Científica", "Terror"],
    classificacao: "14",
    ano: 2004,
    duracao: 6000,
  },
  {
    id: "encanto",
    titulo: "Encanto",
    arquivo: "Encanto.mp4",
    posterArquivo: "encanto.webp",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2021,
    duracao: 6120,
  },
  {
    id: "mulan",
    titulo: "Mulan",
    arquivo: "Mulan.mp4",
    posterArquivo: "mulanAnima.jpg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 1998,
    duracao: 5520,
  },
  {
    id: "zootopia",
    titulo: "Zootopia",
    arquivo: "Zootopia (2016) 5.1 CH Dublado 1080p (By-LuanHarper).mp4",
    posterArquivo: "zootopia.jpg",
    generos: ["Animação", "Aventura", "Comédia"],
    classificacao: "Livre",
    ano: 2016,
    duracao: 6480,
  },
  {
    id: "zootopia-2",
    titulo: "Zootopia 2",
    arquivo: "Zootopia 2.mp4",
    posterArquivo: "Zootopia2.webp",
    generos: ["Animação", "Aventura", "Comédia"],
    classificacao: "Livre",
    ano: 2025,
    duracao: 6300,
  },
  {
    id: "avioes-2",
    titulo: "Aviões 2: Heróis do Fogo ao Resgate",
    arquivo: "AVIOES2.mp4",
    posterArquivo: "avioes2.jpg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2014,
    duracao: 5160,
  },
  {
    id: "chainsaw-man-filme",
    titulo: "Chainsaw Man – O Filme: Arco da Reze",
    arquivo:
      "Chainsaw_Man_–_O_Filme_Arco_da_Reze_2025_WEB_DL_1080p_x264_FULLHD.mp4",
    posterArquivo: "chainsaw-man-o-filme.webp",
    generos: ["Anime", "Ação", "Sobrenatural"],
    classificacao: "18",
    ano: 2025,
    duracao: 7200,
  },
  {
    id: "inuyasha-sentimentos",
    titulo: "InuYasha: Sentimentos que Transcendem o Tempo",
    arquivo: "InuYasha - Sentimentos que Transcendem o Tempo.mp4",
    posterArquivo: "inuyashaSentimentostempo.jpg",
    generos: ["Anime", "Aventura", "Romance", "Fantasia"],
    classificacao: "12",
    ano: 2001,
    duracao: 5400,
  },
  {
    id: "soul",
    titulo: "Soul",
    arquivo: "Soul.mp4",
    posterArquivo: "SoulAMG.jpg",
    generos: ["Animação", "Comédia", "Drama"],
    classificacao: "Livre",
    ano: 2020,
    duracao: 5940,
  },
  {
    id: "toy-story-4",
    titulo: "Toy Story 4",
    arquivo: "ToyStory4.mp4",
    posterArquivo: "toy-story-4.jpg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2019,
    duracao: 5940,
  },
  {
    id: "wish-o-poder-dos-desejos",
    titulo: "Wish: O Poder dos Desejos",
    arquivo: "Wish.O.Poder.dos.Desejos.mp4",
    posterArquivo: "Wish.jpg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2023,
    duracao: 6420,
  },
  {
    id: "rota-de-fuga",
    titulo: "Rota de Fuga",
    arquivo: "RotadeFuga.mp4",
    posterArquivo: "ROTADEFULGA.jpg",
    generos: ["Ação", "Thriller"],
    classificacao: "16",
    ano: 2013,
    duracao: 7080,
  },
  {
    id: "rota-de-fuga-2",
    titulo: "Rota de Fuga 2",
    arquivo: "ROTADEFuga2.mp4",
    posterArquivo: "rota-de-fuga-2.jpg",
    generos: ["Ação", "Thriller"],
    classificacao: "16",
    ano: 2018,
    duracao: 6420,
  },
  {
    id: "rota-de-fuga-3",
    titulo: "Rota de Fuga 3: O Resgate",
    arquivo: "Rota_de_Fuga_3_O_Resgate_.mp4",
    posterArquivo: "rota-de-fuga-3-o-resgate-1.jpg",
    generos: ["Ação", "Thriller"],
    classificacao: "16",
    ano: 2019,
    duracao: 6300,
  },
  {
    id: "onde-os-fracos-nao-tem-vez",
    titulo: "Onde os Fracos Não Têm Vez",
    arquivo: "OndeosFracosNaoTemVez.mp4",
    posterArquivo: "ondeosfracosntemvez.webp",
    generos: ["Thriller", "Drama", "Crime"],
    classificacao: "18",
    ano: 2007,
    duracao: 7380,
  },
  {
    id: "super-mario-bros",
    titulo: "Super Mario Bros.: O Filme",
    arquivo: "mario.mp4",
    posterArquivo: "super_mario_bros_filme_poster__81029lb0.jpeg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2023,
    duracao: 5520,
  },
  {
    id: "your-name",
    titulo: "Your Name",
    arquivo: "yourname.mp4",
    posterArquivo: "your-name.webp",
    generos: ["Anime", "Romance", "Drama", "Fantasia"],
    classificacao: "12",
    ano: 2016,
    duracao: 6420,
  },
  {
    id: "kubo-e-as-cordas-magicas",
    titulo: "Kubo e as Cordas Mágicas",
    arquivo: "Kubo_e_as_CordasMágicas.mp4",
    posterArquivo: "kubo-e-as-cordas-magicas.jpg",
    generos: ["Animação", "Aventura", "Fantasia"],
    classificacao: "Livre",
    ano: 2016,
    duracao: 6120,
  },
  {
    id: "rio-2",
    titulo: "Rio 2",
    arquivo: "Rio 2.mp4",
    posterArquivo: "rio2.jpg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2014,
    duracao: 6060,
  },
  {
    id: "irmao-urso",
    titulo: "Irmão Urso",
    arquivo:
      "1_Irmão_Ursos_2003_1080p_BRRip_DDP5_1_x264_DUAL_WWW_BLUDV_TV_TioKennedy.mp4",
    posterArquivo: "imao_urso.jpg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2003,
    duracao: 5100,
  },
  {
    id: "a-era-do-gelo-natal",
    titulo: "A Era do Gelo: Especial de Natal",
    arquivo: "AEradoGeloNatal.mp4",
    posterArquivo: "a-era-do-gelo-especial-de-natal.jpg",
    generos: ["Animação", "Comédia", "Família"],
    classificacao: "Livre",
    ano: 2011,
    duracao: 1500,
  },
  {
    id: "carros-3",
    titulo: "Carros 3",
    arquivo: "Carros3.mp4",
    posterArquivo: "carros-3.jpg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2017,
    duracao: 6120,
  },
  {
    id: "frozen",
    titulo: "Frozen: Uma Aventura Congelante",
    arquivo: "Frozen.mp4",
    posterArquivo: "frozen.webp",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2013,
    duracao: 6120,
  },
  {
    id: "filme-minecraft",
    titulo: "Minecraft: O Filme",
    arquivo: "Filme.Minecraft.mp4",
    posterArquivo: "manicraft.jpg",
    generos: ["Aventura", "Família"],
    classificacao: "Livre",
    ano: 2025,
    duracao: 6000,
  },
  {
    id: "deu-a-louca-na-chapeuzinho",
    titulo: "Deu a Louca na Chapeuzinho",
    arquivo: "DeuaLoucanaChapeuzinho.mp4",
    posterArquivo: "deuALoucaNaCapeusino.jpg",
    generos: ["Animação", "Comédia", "Família"],
    classificacao: "Livre",
    ano: 2005,
    duracao: 4860,
  },
  {
    id: "deu-a-louca-na-chapeuzinho-2",
    titulo: "Deu a Louca na Chapeuzinho 2",
    arquivo: "Deu_a_Louca_na_Chapeuzinho_Film.mp4",
    posterArquivo: "deuALoucaNaCapeusino.jpg",
    generos: ["Animação", "Comédia", "Família"],
    classificacao: "Livre",
    ano: 2011,
    duracao: 5100,
  },
  {
    id: "demon-slayer-castelo-infinito",
    titulo: "Demon Slayer: Castelo Infinito",
    arquivo: "CasteloInfinito(Leg).mp4",
    posterArquivo: "Demon-Slayer-Castelo-Infinito.webp",
    generos: ["Anime", "Ação", "Fantasia"],
    classificacao: "16",
    ano: 2025,
    duracao: 7200,
  },
  {
    id: "sword-art-online-filme",
    titulo: "Sword Art Online: O Filme",
    arquivo: "Sword_Art_Onlinefml.mp4",
    posterArquivo: "suord-art-online-filme.jpg",
    generos: ["Anime", "Ação", "Aventura"],
    classificacao: "12",
    ano: 2017,
    duracao: 7200,
  },
  {
    id: "yo-kai-watch-o-filme",
    titulo: "Yo-Kai Watch: O Filme",
    arquivo: "YOKWTCHOFLM.mp4",
    posterArquivo: "YOKWTCHOflm.jpg",
    generos: ["Anime", "Aventura", "Comédia"],
    classificacao: "Livre",
    ano: 2014,
    duracao: 5700,
  },
  {
    id: "a-ratinha-valente",
    titulo: "A Ratinha Valente",
    arquivo: "aratinhavalente1.mp4",
    posterArquivo: "a-ratinha-valente.jpg",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 1982,
    duracao: 4920,
  },
  {
    id: "a-ratinha-valente-2",
    titulo: "A Ratinha Valente 2",
    arquivo: "aratinhavalente2.mp4",
    posterArquivo: "a-ratinha-valente-2.download",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 1998,
    duracao: 4800,
  },
  {
    id: "kill-boksoon",
    titulo: "Kill Boksoon",
    arquivo: "KillBoksoon2023.DUB.mp4",
    posterArquivo: "killBoksoon.jpg",
    generos: ["Ação", "Drama", "Thriller"],
    classificacao: "18",
    ano: 2023,
    duracao: 8220,
  },
  {
    id: "mestres-do-universo-2026",
    titulo: "Mestres do Universo 2026",
    arquivo: "MestresdoUniverso2026(LEGENDADO).mp4",
    posterArquivo: "MestreUniverso.jpg",
    generos: ["Ação", "Fantasia", "Aventura"],
    classificacao: "14",
    ano: 2026,
    duracao: 6000,
  },
  {
    id: "mune-o-guardiao-da-lua",
    titulo: "Mune: O Guardião da Lua",
    arquivo: "MuneOGuardiãodaLua.mp4",
    posterArquivo: "mune-guardia-da-lua.jpg",
    generos: ["Animação", "Aventura", "Fantasia"],
    classificacao: "Livre",
    ano: 2014,
    duracao: 5100,
  },
  {
    id: "fogo-contra-fogo",
    titulo: "Fogo Contra Fogo",
    arquivo: "FogoContraFogo.mp4",
    posterArquivo: "fogo-contra-fogo.jpg",
    generos: ["Ação", "Crime", "Drama"],
    classificacao: "16",
    ano: 1995,
    duracao: 10200,
  },
  {
    id: "oppenheimer",
    titulo: "Oppenheimer",
    arquivo: "oppenheimer.mp4",
    posterArquivo: "oppenheimer-poster.avif",
    generos: ["Drama", "Histórico", "Biografia"],
    classificacao: "14",
    ano: 2023,
    duracao: 10800,
  },
  {
    id: "rain-man",
    titulo: "Rain Man",
    arquivo: "rain-man.mp4",
    posterArquivo: "rain-man.webp",
    generos: ["Drama"],
    classificacao: "12",
    ano: 1988,
    duracao: 8040,
  },
  {
    id: "bunny-girl-senpai-sonha-com-garota",
    titulo: "Bunny Girl Senpai: O Filme",
    arquivo: "SeishunButaYarouwaYumemiruShoujonoYumewoMinai.mp4",
    posterArquivo: "SeishunButaYarouwaYumemiruShoujonoYumewoMinai.jpg",
    generos: ["Anime", "Drama", "Romance"],
    classificacao: "12",
    ano: 2019,
    duracao: 5400,
  },
  {
    id: "bunny-girl-senpai-odekake-sister",
    titulo: "Bunny Girl Senpai: Odekake Sister",
    arquivo: "SeishunButaYarouwaodekakesister.mp4",
    posterArquivo: "SeishunButaYarouwaodekakesister.jpg",
    generos: ["Anime", "Drama", "Romance"],
    classificacao: "12",
    ano: 2023,
    duracao: 4500,
  },
];

const conteudos = filmes.map(filme);

conteudos.push({
  conteudo_id: "dragon-ball-filmes",
  titulo: "Dragon Ball: Filmes 8 e 10",
  tipo: "Filme",
  poster: poster("Dragon-Ball-franquia.jpg"),
  descricao:
    "Coleção reduzida com os filmes de Dragon Ball liberados no catálogo: Filme 08 e Filme 10.",
  generos: ["Anime", "Ação", "Aventura"],
  classificacao: "12",
  ano: 1993,
  temporadas: [
    {
      temporada_id: crypto.randomUUID(),
      numero: 1,
      episodios: [
        {
          id: "db_filme08",
          titulo: "Filme 08 - O Poder Invencível",
          numero: 1,
          duracao_seg: 5400,
          arquivo: "Filme08OPoderInvencível.mp4",
        },
        {
          id: "db_filme10",
          titulo: "Filme 10 - O Retorno do Guerreiro Lendário",
          numero: 2,
          duracao_seg: 5400,
          arquivo: "Filme 10ORetornodoGerreiroLendário.mp4",
        },
      ],
    },
  ],
});

conteudos.push(
  serie({
    id: "fairy-tail",
    titulo: "Fairy Tail",
    posterArquivo: "FairyTail.jpg",
    descricao:
      "Anime de aventura e magia acompanhando a guilda Fairy Tail em missões repletas de ação, amizade e humor.",
    generos: ["Anime", "Aventura", "Fantasia"],
    classificacao: "12",
    ano: 2009,
    episodios: [
      ep("fairy_tail", "Fairy Tail", 1, "001-FairyTail.mp4"),
      ep("fairy_tail", "Fairy Tail", 2, "002-FairyTail.mp4"),
      ep("fairy_tail", "Fairy Tail", 3, "003-FairyTail.mp4"),
    ],
  })
);

const episodiosEvangelion = [
  ep("eva", "Neon Genesis Evangelion", 1, "EvanelionEp1.mp4"),
  ep("eva", "Neon Genesis Evangelion", 2, "EvanelionEP2.mp4"),
  ...range(5, 26).map((n) =>
    ep("eva", "Neon Genesis Evangelion", n, `EvanelionEP${n}.mp4`)
  ),
];

conteudos.push(
  serie({
    id: "evangelion",
    titulo: "Neon Genesis Evangelion",
    posterArquivo: "photo_5089449135689542774_x.jpg",
    descricao:
      "Em um mundo devastado após o Segundo Impacto, Shinji Ikari é convocado para pilotar uma unidade Evangelion e enfrentar os misteriosos Anjos.",
    generos: ["Anime", "Ação", "Drama", "Mecha"],
    classificacao: "14",
    ano: 1995,
    episodios: episodiosEvangelion,
  })
);

const episodiosGash = [
  ...range(1, 6).map((n) =>
    ep("gash", "Konjiki no Gash Bell", n, `Konjiki_no_Gash_BellEP${n}.mp4`)
  ),
  ...range(7, 9).map((n) =>
    ep("gash", "Konjiki no Gash Bell", n, `GashBellEP${n}.mp4`)
  ),
  ...range(10, 37).map((n) =>
    ep("gash", "Konjiki no Gash Bell", n, `KonjikinoGashBellEP${n}.mp4`)
  ),
  ...range(38, 47).map((n) =>
    ep("gash", "Konjiki no Gash Bell", n, `KonjikinoGashBell${n}.mp4`)
  ),
];

conteudos.push(
  serie({
    id: "gashbell",
    titulo: "Konjiki no Gash Bell",
    posterArquivo: "gash_capa1.jpg",
    descricao:
      "A história acompanha Gash Bell e Kiyo Takamine em batalhas entre mamodos, misturando magia, amizade e coragem.",
    generos: ["Anime", "Aventura"],
    classificacao: "Livre",
    ano: 2003,
    episodios: episodiosGash,
  })
);

conteudos.push(
  manga({
    id: "soul-eater",
    titulo: "Soul Eater",
    posterArquivo: "souleaterimagem.jpg",
    descricao:
      "Mangá de ação e fantasia que acompanha estudantes da escola Shibusen em batalhas contra ameaças sobrenaturais.",
    generos: ["Mangá", "Ação", "Fantasia", "Aventura"],
    classificacao: "12",
    ano: 2004,
  }),
  manga({
    id: "konjiki-no-gash-2",
    titulo: "Konjiki no Gash!! 2",
    posterArquivo: "Gash_fu_capa2.jpg",
    descricao:
      "Continuação em mangá da história de Konjiki no Gash, com novas batalhas, reencontros e aventuras envolvendo o mundo dos mamodos.",
    generos: ["Mangá", "Ação", "Aventura"],
    classificacao: "12",
    ano: 2022,
  }),
  manga({
    id: "gintama",
    titulo: "Gintama",
    posterArquivo: "gintama.avif",
    descricao:
      "Mangá de ação, comédia e ficção científica que acompanha Gintoki Sakata e seus companheiros em missões absurdas, batalhas intensas e situações cheias de humor.",
    generos: ["Mangá", "Ação", "Comédia", "Aventura"],
    classificacao: "12",
    ano: 2003,
  }),
  manga({
    id: "jojolion",
    titulo: "JojoLion",
    posterArquivo: "jojolion.jpg",
    descricao:
      "Parte da saga JoJo's Bizarre Adventure, JojoLion acompanha uma história misteriosa em Morioh, envolvendo identidades perdidas, famílias complexas e poderes Stand.",
    generos: ["Mangá", "Ação", "Mistério", "Aventura"],
    classificacao: "14",
    ano: 2011,
  }),
  manga({
    id: "jojolands",
    titulo: "The JoJoLands",
    posterArquivo: "jojolands.webp",
    descricao:
      "The JoJoLands acompanha uma nova geração da saga JoJo's Bizarre Adventure, com ambição, crime, aventura e poderes Stand em uma nova história.",
    generos: ["Mangá", "Ação", "Aventura"],
    classificacao: "14",
    ano: 2023,
  })
);

const capitulos = [
  ...[
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "34",
    "35",
    "40",
    "41",
    "42",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "51",
    "53",
    "55",
    "56",
    "57",
    "58",
    "62",
    "63",
    "68",
    "69",
    "76",
  ].map((vol) =>
    capituloPDF({
      id: `gintama_vol_${vol}`,
      conteudo_id: "gintama",
      numero: Number(vol),
      titulo: `Gintama - Volume ${vol}`,
      arquivo: `GINTAMAVOL.${vol}.pdf`,
      capa: "gintama.avif",
    })
  ),

  ...range(1, 27).map((vol) =>
    capituloPDF({
      id: `jojolion_vol_${String(vol).padStart(2, "0")}`,
      conteudo_id: "jojolion",
      numero: vol,
      titulo: `JojoLion - Volume ${String(vol).padStart(2, "0")}`,
      arquivo: `JojoLion${vol}.pdf`,
      capa: "jojolion.jpg",
    })
  ),

  ...["01", "02", "03", "04", "05", "06"].map((vol) =>
    capituloPDF({
      id: `jojolands_vol_${vol}`,
      conteudo_id: "jojolands",
      numero: Number(vol),
      titulo: `The JoJoLands - Volume ${vol}`,
      arquivo: `JOJOLANDSVOL.${vol}.pdf`,
      capa: "jojolands.webp",
    })
  ),

  ...[
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
  ].map((vol) =>
    capituloPDF({
      id: `soul_eater_vol_${vol}`,
      conteudo_id: "soul-eater",
      numero: Number(vol),
      titulo: `Soul Eater - Volume ${vol}`,
      arquivo: `SOULEATERVOL.${vol}.pdf`,
      capa: "souleaterimagem.jpg",
    })
  ),

  ...["01", "02", "03", "04", "05"].map((vol) =>
    capituloPDF({
      id: `konjiki_no_gash_2_vol_${vol}`,
      conteudo_id: "konjiki-no-gash-2",
      numero: Number(vol),
      titulo: `Konjiki no Gash!! 2 - Volume ${vol}`,
      arquivo: `Konjiki no Gash!! 2 - Volume ${vol}.pdf`,
      capa: "Gash_fu_capa2.jpg",
    })
  ),
];

async function removerAntigos(client) {
  if (episodiosRemovidos.length > 0) {
    await client.query("DELETE FROM episodios WHERE id = ANY($1::text[])", [
      episodiosRemovidos,
    ]);

    console.log("✅ Episódios removidos:", episodiosRemovidos.join(", "));
  }

  if (conteudosRemovidos.length > 0) {
    await client.query(
      `
      DELETE FROM episodios
      WHERE temporada_id IN (
        SELECT id FROM temporadas
        WHERE conteudo_id = ANY($1::text[])
      )
      `,
      [conteudosRemovidos]
    );

    await client.query(
      "DELETE FROM temporadas WHERE conteudo_id = ANY($1::text[])",
      [conteudosRemovidos]
    );

    await client.query(
      "DELETE FROM capitulos WHERE conteudo_id = ANY($1::text[])",
      [conteudosRemovidos]
    );

    await client.query("DELETE FROM conteudos WHERE id = ANY($1::text[])", [
      conteudosRemovidos,
    ]);

    console.log("✅ Conteúdos removidos:", conteudosRemovidos.join(", "));
  }
}

async function salvarConteudo(client, item) {
  console.log(`📌 Salvando conteúdo: ${item.titulo}`);

  await client.query(
    `
    INSERT INTO conteudos
      (id, titulo, tipo, poster, descricao, generos, classificacao, ano)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO UPDATE SET
      titulo = EXCLUDED.titulo,
      tipo = EXCLUDED.tipo,
      poster = EXCLUDED.poster,
      descricao = EXCLUDED.descricao,
      generos = EXCLUDED.generos,
      classificacao = EXCLUDED.classificacao,
      ano = EXCLUDED.ano
    `,
    [
      item.conteudo_id,
      item.titulo,
      item.tipo,
      item.poster,
      item.descricao,
      item.generos,
      item.classificacao,
      item.ano,
    ]
  );

  for (const temporada of item.temporadas || []) {
    let temporadaIdReal;

    const existente = await client.query(
      `
      SELECT id FROM temporadas
      WHERE conteudo_id = $1 AND numero = $2
      LIMIT 1
      `,
      [item.conteudo_id, temporada.numero]
    );

    if (existente.rows.length > 0) {
      temporadaIdReal = existente.rows[0].id;
    } else {
      const nova = await client.query(
        `
        INSERT INTO temporadas (id, conteudo_id, numero)
        VALUES ($1, $2, $3)
        RETURNING id
        `,
        [temporada.temporada_id, item.conteudo_id, temporada.numero]
      );

      temporadaIdReal = nova.rows[0].id;
    }

    for (const episodio of temporada.episodios || []) {
      await client.query(
        `
        INSERT INTO episodios
          (
            id,
            temporada_id,
            titulo,
            descricao,
            capa,
            video_url,
            duracao_seg,
            numero,
            intro_inicio,
            intro_fim
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          temporada_id = EXCLUDED.temporada_id,
          titulo = EXCLUDED.titulo,
          descricao = EXCLUDED.descricao,
          capa = EXCLUDED.capa,
          video_url = EXCLUDED.video_url,
          duracao_seg = EXCLUDED.duracao_seg,
          numero = EXCLUDED.numero,
          intro_inicio = EXCLUDED.intro_inicio,
          intro_fim = EXCLUDED.intro_fim
        `,
        [
          episodio.id,
          temporadaIdReal,
          episodio.titulo,
          episodio.titulo,
          item.poster,
          `${VIDEO_BASE}/${episodio.arquivo}`,
          episodio.duracao_seg || 5400,
          episodio.numero,
          0,
          90,
        ]
      );

      console.log(`   🎬 Episódio cadastrado: ${episodio.titulo}`);
    }
  }
}

async function salvarCapitulos(client) {
  for (const cap of capitulos) {
    await client.query(
      `
      INSERT INTO capitulos
        (id, conteudo_id, numero, titulo, pdf_url, capa, paginas)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        conteudo_id = EXCLUDED.conteudo_id,
        numero = EXCLUDED.numero,
        titulo = EXCLUDED.titulo,
        pdf_url = EXCLUDED.pdf_url,
        capa = EXCLUDED.capa,
        paginas = EXCLUDED.paginas
      `,
      [
        cap.id,
        cap.conteudo_id,
        cap.numero,
        cap.titulo,
        cap.pdf_url,
        cap.capa,
        cap.paginas || 0,
      ]
    );

    console.log(`📖 PDF cadastrado: ${cap.titulo}`);
  }
}

async function main() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("🚀 Iniciando cadastro de conteúdos...");

    await removerAntigos(client);

    for (const item of conteudos) {
      await salvarConteudo(client, item);
    }

    await salvarCapitulos(client);

    await client.query("COMMIT");

    console.log("");
    console.log("🎉 Cadastro finalizado com sucesso!");
    console.log(`✅ Conteúdos cadastrados: ${conteudos.length}`);
    console.log(`✅ PDFs cadastrados: ${capitulos.length}`);
  } catch (erro) {
    await client.query("ROLLBACK");

    console.error("");
    console.error("❌ Erro ao cadastrar conteúdos:");
    console.error(erro.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();