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

const VIDEO_BASE  = "https://tvxbox-backend-1.onrender.com/video";
const POSTER_BASE = "https://tvxbox-b2.tharikluan-miguel.workers.dev";
const PDF_BASE    = "https://tvxbox-backend-1.onrender.com/video/pdf";

// Compatibilidade
const FILE_BASE = POSTER_BASE;
const conteudos = [
   {
    conteudo_id: "a-face-da-vinganca",
    titulo: "A Face da Vingança",
    tipo: "Filme",
    poster: `${FILE_BASE}/afacedavinganca.jpg`,
    descricao: "Um ex-agente do governo, marcado por uma tragédia pessoal, sai das sombras para acertar as contas com os responsáveis por destruir sua família. Em uma corrida implacável contra o tempo, ele usa cada habilidade adquirida para executar uma vingança precisa e brutal.",
    generos: ["Ação", "Thriller"],
    classificacao: "16",
    ano: 2023,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000001",
        numero: 1,
        episodios: [
          { id: "afacedavinganca_filme", titulo: "A Face da Vingança", numero: 1, duracao_seg: 7200, arquivo: "AFacedaVinganca.mp4" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "agente-infiltrado",
    titulo: "Agente Infiltrado",
    tipo: "Filme",
    poster: `${FILE_BASE}/agenteinfiltrado.jpg`,
    descricao: "Um agente da CIA é enviado para se infiltrar em uma das organizações criminosas mais perigosas do mundo. Com sua identidade sempre à beira do colapso, ele precisa equilibrar lealdade, sobrevivência e a linha tênue entre o bem e o mal.",
    generos: ["Ação", "Suspense"],
    classificacao: "16",
    ano: 2024,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000002",
        numero: 1,
        episodios: [
          { id: "agente_infiltrado_filme", titulo: "Agente Infiltrado", numero: 1, duracao_seg: 6840, arquivo: "AgenteInfiltrado.mp4" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "alien-vs-predador",
    titulo: "Alien vs. Predador",
    tipo: "Filme",
    poster: `${FILE_BASE}/alienvspredator.webp`,
    descricao: "Nas profundezas da Antártida, uma equipe de cientistas descobre uma pirâmide antiga enterrada sob o gelo. Ao adentrá-la, acabam presos no meio de uma batalha épica entre as duas criaturas extraterrestres mais letais do universo: os Aliens e os Predadores.",
    generos: ["Ação", "Ficção Científica", "Terror"],
    classificacao: "14",
    ano: 2004,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000003",
        numero: 1,
        episodios: [
          { id: "alien_vs_predador_filme", titulo: "Alien vs. Predador", numero: 1, duracao_seg: 6000, arquivo: "Alienvspredador.mp4" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "encanto",
    titulo: "Encanto",
    tipo: "Filme",
    poster: `${FILE_BASE}/encanto.webp`,
    descricao: "Na Colômbia mágica, a família Madrigal vive numa casa encantada onde cada membro possui um dom especial — exceto Mirabel. Quando a magia começa a desaparecer, ela é a única esperança de salvar o lar da família e descobrir o segredo que une a todos.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2021,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000004",
        numero: 1,
        episodios: [
          { id: "encanto_filme", titulo: "Encanto", numero: 1, duracao_seg: 6120, arquivo: "Encanto.mp4" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "mulan",
    titulo: "Mulan",
    tipo: "Filme",
    poster: `${FILE_BASE}/mulanAnima.jpg`,
    descricao: "Para salvar o pai doente de lutar na guerra, a corajosa Mulan se disfarça de homem e assume seu lugar no exército imperial. Em uma jornada repleta de perigos, ela descobre que a verdadeira força vem de dentro — e que honra e coragem não conhecem gênero.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 1998,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000005",
        numero: 1,
        episodios: [
          { id: "mulan_filme", titulo: "Mulan", numero: 1, duracao_seg: 5520, arquivo: "Mulan.mp4" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "zootopia",
    titulo: "Zootopia",
    tipo: "Filme",
    poster: `${FILE_BASE}/zootopia.jpg`,
    descricao: "Na metrópole animal de Zootopia, a jovem coelha Judy Hopps realiza o sonho de se tornar policial. Junto ao astuto raposo Nick Wilde, ela precisa desvendar uma conspiração que ameaça toda a cidade — e aprender que os preconceitos são o maior inimigo de qualquer sociedade.",
    generos: ["Animação", "Aventura", "Comédia"],
    classificacao: "Livre",
    ano: 2016,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000006",
        numero: 1,
        episodios: [
          { id: "zootopia_filme", titulo: "Zootopia", numero: 1, duracao_seg: 6480, arquivo: "Zootopia (2016) 5.1 CH Dublado 1080p (By-LuanHarper).mp4" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "zootopia-2",
    titulo: "Zootopia 2",
    tipo: "Filme",
    poster: `${FILE_BASE}/Zootopia2.webp`,
    descricao: "Judy Hopps e Nick Wilde estão de volta em uma nova aventura pela cidade animal mais vibrante do mundo. Desta vez, um misterioso plano ameaça a frágil paz entre predadores e presas, e a dupla inseparável precisará unir forças novamente para salvar Zootopia.",
    generos: ["Animação", "Aventura", "Comédia"],
    classificacao: "Livre",
    ano: 2025,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000007",
        numero: 1,
        episodios: [
          { id: "zootopia2_filme", titulo: "Zootopia 2", numero: 1, duracao_seg: 6300, arquivo: "Zootopia 2.mp4" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "wifi-ralph",
    titulo: "WiFi Ralph: Quebrando a Internet",
    tipo: "Filme",
    poster: `${FILE_BASE}/wifi_ralp.webp`,
    descricao: "Ralph e Vanellope deixam o conforto dos fliperama e mergulham no caótico mundo da internet para encontrar uma peça que salve o jogo da amiga. Entre vírus, algoritmos e as maravilhas da web, eles descobrem que a verdadeira amizade supera qualquer firewall.",
    generos: ["Animação", "Aventura", "Comédia"],
    classificacao: "Livre",
    ano: 2018,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000008",
        numero: 1,
        episodios: [
          { id: "wifi_ralph_filme", titulo: "WiFi Ralph: Quebrando a Internet", numero: 1, duracao_seg: 6480, arquivo: "WIFI RALPH - QUEBRANDO A INTERNET.mkv" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "tinker-bell-piratas",
    titulo: "Tinker Bell e os Piratas",
    tipo: "Filme",
    poster: `${FILE_BASE}/tinkerbellepiratas.jpg`,
    descricao: "Tinker Bell e suas amigas fadas enfrentam um temível pirata que ameaça o mundo mágico de Pixie Hollow. Em uma aventura cheia de voos emocionantes, lealdade e amizade, elas provam que até as menores fadas podem ter a coragem de gigantes.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2014,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000009",
        numero: 1,
        episodios: [
          { id: "tinker_bell_piratas_filme", titulo: "Tinker Bell e os Piratas", numero: 1, duracao_seg: 4800, arquivo: "TINKER BELL FADAS E PIRATAS.rar" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "avioes",
    titulo: "Aviões",
    tipo: "Filme",
    poster: `${FILE_BASE}/Avioes.webp`,
    descricao: "Dusty é um avião de pulverização agrícola que sonha em competir nas grandes corridas aéreas internacionais. Com a ajuda de um veterano de guerra, ele supera seus medos e limitações para mostrar que não importa de onde você vem — o que importa é onde você sonha chegar.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2013,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000010",
        numero: 1,
        episodios: [
          { id: "avioes_filme", titulo: "Aviões", numero: 1, duracao_seg: 5400, arquivo: "AVIÔES.mkv" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "avioes-2",
    titulo: "Aviões 2: Heróis do Fogo ao Resgate",
    tipo: "Filme",
    poster: `${FILE_BASE}/avioes2.jpg`,
    descricao: "Após um acidente que danifica seu motor, Dusty precisa se reinventar e se junta a uma equipe de resgate de incêndio florestal. Entre chamas e tempestades, ele descobre que ser herói vai muito além de velocidade — exige coragem, sacrifício e espírito de equipe.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2014,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000011",
        numero: 1,
        episodios: [
          { id: "avioes2_filme", titulo: "Aviões 2: Heróis do Fogo ao Resgate", numero: 1, duracao_seg: 5160, arquivo: "AVIOES2.mkv" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "chainsaw-man-filme",
    titulo: "Chainsaw Man – O Filme: Arco da Reze",
    tipo: "Filme",
    poster: `${FILE_BASE}/ChainsawFilm.jpg`,
    descricao: "Denji enfrenta a poderosa Reze, uma espiã com poderes bombásticos que se aproxima dele com intenções obscuras. Em meio a combates brutais e uma conexão inesperada, Denji é posto à prova em um dos arcos mais intensos e emocionantes de Chainsaw Man.",
    generos: ["Anime", "Ação", "Sobrenatural"],
    classificacao: "18",
    ano: 2025,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000012",
        numero: 1,
        episodios: [
          { id: "chainsaw_filme", titulo: "Chainsaw Man – O Filme: Arco da Reze", numero: 1, duracao_seg: 7200, arquivo: "Chainsaw_Man_–_O_Filme_Arco_da_Reze_2025_WEB_DL_1080p_x264_FULLHD.mp4" }
        ]
      }
    ]
  },
 
  {
    conteudo_id: "inuyasha-sentimentos",
    titulo: "InuYasha: Sentimentos que Transcendem o Tempo",
    tipo: "Filme",
    poster: `${FILE_BASE}/inuyashaSentimentostempo.jpg`,
    descricao: "InuYasha e Kagome são transportados para um Japão feudal ainda mais antigo, onde enfrentam um demônio imortal que surgiu muito antes dos acontecimentos da série. Uma história de amor e batalha que vai além das fronteiras do tempo.",
    generos: ["Anime", "Aventura", "Romance", "Fantasia"],
    classificacao: "12",
    ano: 2001,
    temporadas: [
      {
        temporada_id: "f0000001-0000-0000-0000-000000000013",
        numero: 1,
        episodios: [
          { id: "inuyasha_filme", titulo: "InuYasha: Sentimentos que Transcendem o Tempo", numero: 1, duracao_seg: 5400, arquivo: "InuYasha - Sentimentos que Transcendem o Tempo.mkv" }
        ]
      }
    ]
  },
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
      conteudo_id: "Evangelion",
      titulo: "Neon Genesis Evangelion",
      tipo: "Anime",
      poster: `${POSTER_BASE}/photo_5089449135689542774_x.jpg`,
      descricao: "Em um mundo devastado após o Segundo Impacto, Shinji Ikari é convocado para pilotar uma unidade Evangelion e enfrentar os misteriosos Anjos.",
      generos: ["Anime", "Ação", "Drama", "Mecha"],
      classificacao: "14",
      ano: 1995,
      temporadas: [
        {
          temporada_id: "a5555555-5555-5555-5555-555555555555",
          numero: 1,
          episodios: [
            { id: "eva_ep1",  titulo: "Neon Genesis Evangelion - Episódio 1",  numero: 1,  duracao_seg: 1500, arquivo: "EvanelionEp1.mp4" },
            { id: "eva_ep2",  titulo: "Neon Genesis Evangelion - Episódio 2",  numero: 2,  duracao_seg: 1500, arquivo: "EvanelionEP2.mp4" },
            { id: "eva_ep3",  titulo: "Neon Genesis Evangelion - Episódio 3",  numero: 3,  duracao_seg: 1500, arquivo: "EvanelionEP3.mp4" },
            { id: "eva_ep4",  titulo: "Neon Genesis Evangelion - Episódio 4",  numero: 4,  duracao_seg: 1500, arquivo: "EvanelionEP4.mp4" },
            { id: "eva_ep5",  titulo: "Neon Genesis Evangelion - Episódio 5",  numero: 5,  duracao_seg: 1500, arquivo: "EvanelionEP5.mp4" },
            { id: "eva_ep6",  titulo: "Neon Genesis Evangelion - Episódio 6",  numero: 6,  duracao_seg: 1500, arquivo: "EvanelionEP6.mp4" },
            { id: "eva_ep7",  titulo: "Neon Genesis Evangelion - Episódio 7",  numero: 7,  duracao_seg: 1500, arquivo: "EvanelionEP7.mp4" },
            { id: "eva_ep8",  titulo: "Neon Genesis Evangelion - Episódio 8",  numero: 8,  duracao_seg: 1500, arquivo: "EvanelionEP8.mp4" },
            { id: "eva_ep9",  titulo: "Neon Genesis Evangelion - Episódio 9",  numero: 9,  duracao_seg: 1500, arquivo: "EvanelionEP9.mp4" },
            { id: "eva_ep10", titulo: "Neon Genesis Evangelion - Episódio 10", numero: 10, duracao_seg: 1500, arquivo: "EvanelionEP10.mp4" },
            { id: "eva_ep11", titulo: "Neon Genesis Evangelion - Episódio 11", numero: 11, duracao_seg: 1500, arquivo: "EvanelionEP11.mp4" },
            { id: "eva_ep12", titulo: "Neon Genesis Evangelion - Episódio 12", numero: 12, duracao_seg: 1500, arquivo: "EvanelionEP12.mp4" },
            { id: "eva_ep13", titulo: "Neon Genesis Evangelion - Episódio 13", numero: 13, duracao_seg: 1500, arquivo: "EvanelionEP13.mp4" },
            { id: "eva_ep14", titulo: "Neon Genesis Evangelion - Episódio 14", numero: 14, duracao_seg: 1500, arquivo: "EvanelionEP14.mp4" },
            { id: "eva_ep15", titulo: "Neon Genesis Evangelion - Episódio 15", numero: 15, duracao_seg: 1500, arquivo: "EvanelionEP15.mp4" },
            { id: "eva_ep16", titulo: "Neon Genesis Evangelion - Episódio 16", numero: 16, duracao_seg: 1500, arquivo: "EvanelionEP16.mp4" },
            { id: "eva_ep17", titulo: "Neon Genesis Evangelion - Episódio 17", numero: 17, duracao_seg: 1500, arquivo: "EvanelionEP17.mp4" },
            { id: "eva_ep18", titulo: "Neon Genesis Evangelion - Episódio 18", numero: 18, duracao_seg: 1500, arquivo: "EvanelionEP18.mp4" },
            { id: "eva_ep19", titulo: "Neon Genesis Evangelion - Episódio 19", numero: 19, duracao_seg: 1500, arquivo: "EvanelionEP19.mp4" },
            { id: "eva_ep20", titulo: "Neon Genesis Evangelion - Episódio 20", numero: 20, duracao_seg: 1500, arquivo: "EvanelionEP20.mp4" },
            { id: "eva_ep21", titulo: "Neon Genesis Evangelion - Episódio 21", numero: 21, duracao_seg: 1500, arquivo: "EvanelionEP21.mp4" },
            { id: "eva_ep22", titulo: "Neon Genesis Evangelion - Episódio 22", numero: 22, duracao_seg: 1500, arquivo: "EvanelionEP22.mp4" },
            { id: "eva_ep23", titulo: "Neon Genesis Evangelion - Episódio 23", numero: 23, duracao_seg: 1500, arquivo: "EvanelionEP23.mp4" },
            { id: "eva_ep24", titulo: "Neon Genesis Evangelion - Episódio 24", numero: 24, duracao_seg: 1500, arquivo: "EvanelionEP24.mp4" },
            { id: "eva_ep25", titulo: "Neon Genesis Evangelion - Episódio 25", numero: 25, duracao_seg: 1500, arquivo: "EvanelionEP25.mp4" },
            { id: "eva_ep26", titulo: "Neon Genesis Evangelion - Episódio 26", numero: 26, duracao_seg: 1500, arquivo: "EvanelionEP26.mp4" },
            
          ]
        }
      ]
    },
  
  // ── NOVOS FILMES ──────────────────────────────────────────────────────────────

  {
    conteudo_id: "soul",
    titulo: "Soul",
    tipo: "Filme",
    poster: `${FILE_BASE}/SoulAMG.jpg`,
    descricao: "Joe Gardner é um professor de música que sempre sonhou em se tornar um grande músico de jazz. Quando finalmente tem a chance de realizar seu sonho, um acidente o leva a um lugar além da vida — onde terá que descobrir o que realmente importa na existência.",
    generos: ["Animação", "Comédia", "Drama"],
    classificacao: "Livre",
    ano: 2020,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000020",
      numero: 1,
      episodios: [
        { id: "soul_filme", titulo: "Soul", numero: 1, duracao_seg: 5940, arquivo: "Soul.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "toy-story-4",
    titulo: "Toy Story 4",
    tipo: "Filme",
    poster: `${FILE_BASE}/toy-story-4.jpg`,
    descricao: "Woody, Buzz e os demais brinquedos embarcam em uma nova aventura quando Forky, o novo brinquedo favorito de Bonnie, foge. Durante a jornada, Woody reencontra um rosto familiar do passado e precisa decidir qual é o seu verdadeiro lugar no mundo.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2019,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000021",
      numero: 1,
      episodios: [
        { id: "toy_story4_filme", titulo: "Toy Story 4", numero: 1, duracao_seg: 5940, arquivo: "ToyStory4.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "wish-o-poder-dos-desejos",
    titulo: "Wish: O Poder dos Desejos",
    tipo: "Filme",
    poster: `${FILE_BASE}/Wish.jpg`,
    descricao: "No reino de Rosas, a jovem Asha faz um desejo tão poderoso que é respondido por uma força cósmica — uma pequena e mágica estrela. Juntos, eles precisam enfrentar o rei Magnifico para proteger os sonhos de todos os habitantes do reino.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2023,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000022",
      numero: 1,
      episodios: [
        { id: "wish_filme", titulo: "Wish: O Poder dos Desejos", numero: 1, duracao_seg: 6420, arquivo: "Wish.O.Poder.dos.Desejos.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "rota-de-fuga",
    titulo: "Rota de Fuga",
    tipo: "Filme",
    poster: `${FILE_BASE}/ROTADEFULGA.jpg`,
    descricao: "Ray Breslin é o maior especialista do mundo em segurança de prisões. Quando é jogado na instalação mais segura já construída, ele precisa usar todo o seu conhecimento para escapar — e descobrir quem o colocou ali.",
    generos: ["Ação", "Thriller"],
    classificacao: "16",
    ano: 2013,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000023",
      numero: 1,
      episodios: [
        { id: "rota_de_fuga_filme", titulo: "Rota de Fuga", numero: 1, duracao_seg: 7080, arquivo: "RotadeFuga.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "rota-de-fuga-2",
    titulo: "Rota de Fuga 2",
    tipo: "Filme",
    poster: `${FILE_BASE}/rota-de-fuga-2.jpg`,
    descricao: "Ray Breslin monta uma equipe de elite para resgatar um de seus agentes preso numa prisão de alta tecnologia controlada por inteligência artificial. Em uma corrida contra o tempo, ele enfrenta obstáculos ainda maiores que no primeiro filme.",
    generos: ["Ação", "Thriller"],
    classificacao: "16",
    ano: 2018,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000024",
      numero: 1,
      episodios: [
        { id: "rota_de_fuga_2_filme", titulo: "Rota de Fuga 2", numero: 1, duracao_seg: 6420, arquivo: "ROTADEFuga2.mp4" }
      ]
    }]
  },

  
  {
    conteudo_id: "rota-de-fuga-3",
    titulo: "Rota de Fuga 3: O Resgate",
    tipo: "Filme",
    poster: `${FILE_BASE}/rota-de-fuga-3-o-resgate-1.jpg`,
    descricao: "Ray Breslin enfrenta sua missão mais perigosa ao tentar resgatar a filha de um empresário de uma prisão privada na China. Com novos aliados e inimigos implacáveis, ele precisa superar um labirinto de traições para sobreviver.",
    generos: ["Ação", "Thriller"],
    classificacao: "16",
    ano: 2019,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000025",
      numero: 1,
      episodios: [
        { id: "rota_de_fuga_3_filme", titulo: "Rota de Fuga 3: O Resgate", numero: 1, duracao_seg: 6300, arquivo: "Rota_de_Fuga_3_O_Resgate_.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "onde-os-fracos-nao-tem-vez",
    titulo: "Onde os Fracos Não Têm Vez",
    tipo: "Filme",
    poster: `${FILE_BASE}/ondeosfracosntemvez.webp`,
    descricao: "No Texas de 1980, um caçador encontra acidentalmente o rastro de um massacre ligado ao narcotráfico e foge com uma mala cheia de dinheiro. O que se segue é uma perseguição implacável por um assassino frio e calculista, em um dos thrillers mais aclamados do cinema.",
    generos: ["Thriller", "Drama", "Crime"],
    classificacao: "18",
    ano: 2007,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000026",
      numero: 1,
      episodios: [
        { id: "onde_fracos_filme", titulo: "Onde os Fracos Não Têm Vez", numero: 1, duracao_seg: 7380, arquivo: "OndeosFracosNaoTemVez.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "ilha-dos-cachorros",
    titulo: "Ilha dos Cachorros",
    tipo: "Filme",
    poster: `${FILE_BASE}/ilhadoscachorros.webp`,
    descricao: "Numa cidade japonesa do futuro, todos os cachorros são banidos para uma ilha de lixo por decreto do prefeito. Um garoto de 12 anos parte em uma missão corajosa para encontrar seu cão de estimação, iniciando uma aventura que mudará o destino de todos.",
    generos: ["Animação", "Aventura", "Comédia"],
    classificacao: "Livre",
    ano: 2018,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000027",
      numero: 1,
      episodios: [
        { id: "ilha_cachorros_filme", titulo: "Ilha dos Cachorros", numero: 1, duracao_seg: 6120, arquivo: "Ilhados Cachorro.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "super-mario-bros",
    titulo: "Super Mario Bros.: O Filme",
    tipo: "Filme",
    poster: `${FILE_BASE}/super_mario_bros_filme_poster__81029lb0.jpeg`,
    descricao: "Mario e Luigi são encanadores de Brooklyn que são sugados para um mundo mágico e colorido. Mario precisa se tornar um herói para resgatar seu irmão e salvar o Reino dos Cogumelos das garras do poderoso Bowser.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2023,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000028",
      numero: 1,
      episodios: [
        { id: "mario_filme", titulo: "Super Mario Bros.: O Filme", numero: 1, duracao_seg: 5520, arquivo: "mario.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "your-name",
    titulo: "Your Name",
    tipo: "Filme",
    poster: `${FILE_BASE}/your-name.webp`,
    descricao: "Dois adolescentes — um garoto da cidade grande e uma garota do interior — descobrem que trocam de corpo misteriosamente enquanto dormem. À medida que tentam se encontrar, uma verdade devastadora os separa além do espaço e do tempo.",
    generos: ["Anime", "Romance", "Drama", "Fantasia"],
    classificacao: "12",
    ano: 2016,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000029",
      numero: 1,
      episodios: [
        { id: "yourname_filme", titulo: "Your Name", numero: 1, duracao_seg: 6420, arquivo: "yourname.mp4" }
      ]
    }]
  },

  // ── DRAGON BALL — FILMES ───────────────────────────────────────────────────

  {
    conteudo_id: "dragon-ball-filmes",
    titulo: "Dragon Ball: Coleção de Filmes",
    tipo: "Filme",
    poster: `${FILE_BASE}/Dragon-Ball-franquia.jpg`,
    descricao: "A coleção completa dos filmes clássicos de Dragon Ball e Dragon Ball Z, com batalhas épicas, transformações icônicas e histórias paralelas que expandem o universo de Goku e seus amigos.",
    generos: ["Anime", "Ação", "Aventura"],
    classificacao: "12",
    ano: 1986,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000030",
      numero: 1,
      episodios: [
        { id: "db_filme01", titulo: "Filme 01 - Devolva-me Gohan",                    numero: 1,  duracao_seg: 5400, arquivo: "Filme01Devolva-me Gohan.mkv" },
        { id: "db_filme03", titulo: "Filme 03 - A Árvore do Poder",                   numero: 2,  duracao_seg: 5400, arquivo: "Filme3AÁrvoreDoPoder.mkv" },
        { id: "db_filme04", titulo: "Filme 04 - Goku, o Super Saiyajin",              numero: 3,  duracao_seg: 5400, arquivo: "Filme4GokuOSuperSaiyajin.mkv" },
        { id: "db_filme05", titulo: "Filme 05 - Uma Vingança para Freeza",            numero: 4,  duracao_seg: 5400, arquivo: "Filme 5UmaVingançaParaFreeza.mkv" },
        { id: "db_filme07", titulo: "Filme 07 - O Retorno dos Andróides",             numero: 5,  duracao_seg: 5400, arquivo: "Filme 07ORetorno dosAndróides.mkv" },
        { id: "db_filme08", titulo: "Filme 08 - O Poder Invencível",                  numero: 6,  duracao_seg: 5400, arquivo: "Filme08OPoderInvencível.mkv" },
        { id: "db_filme09", titulo: "Filme 09 - A Batalha nos Dois Mundos",           numero: 7,  duracao_seg: 5400, arquivo: "Filme 9ABatalhaNosDoisMundos.mkv" },
        { id: "db_filme10", titulo: "Filme 10 - O Retorno do Guerreiro Lendário",     numero: 8,  duracao_seg: 5400, arquivo: "Filme 10ORetornodoGerreiroLendário.mkv" },
        { id: "db_filme11", titulo: "Filme 11 - O Combate Final: Bio-Broly",          numero: 9,  duracao_seg: 5400, arquivo: "Filme11OCombaeFinalBio-Broly.mkv" },
        { id: "db_filme13", titulo: "Filme 13 - O Ataque do Dragão",                  numero: 10, duracao_seg: 5400, arquivo: "Filme 13-OAtaquedoDragão.mkv" },
      ]
    }]
  },

  // ── SÉRIES ────────────────────────────────────────────────────────────────────

  {
    conteudo_id: "o-tempo-tras-voce-pra-mim",
    titulo: "O Tempo Trás Você Pra Mim",
    tipo: "Série",
    poster: `${FILE_BASE}/OTempoTrásVocêPraMim.jpg`,
    descricao: "Um drama coreano emocionante sobre dois jovens cujas vidas se entrelaçam através do tempo e das circunstâncias. Uma história de amor, saudade e reencontros que desafia as leis do tempo.",
    generos: ["Drama", "Romance"],
    classificacao: "12",
    ano: 2022,
    temporadas: [{
      temporada_id: "10000001-0000-0000-0000-000000000001",
      numero: 1,
      episodios: [
        { id: "otempo_ep1",  titulo: "Episódio 1",  numero: 1,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP1.mp4" },
        { id: "otempo_ep2",  titulo: "Episódio 2",  numero: 2,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP2.mp4" },
        { id: "otempo_ep3",  titulo: "Episódio 3",  numero: 3,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP3.mp4" },
        { id: "otempo_ep4",  titulo: "Episódio 4",  numero: 4,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP4.mp4" },
        { id: "otempo_ep5",  titulo: "Episódio 5",  numero: 5,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP5.mp4" },
        { id: "otempo_ep6",  titulo: "Episódio 6",  numero: 6,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP6.mp4" },
        { id: "otempo_ep7",  titulo: "Episódio 7",  numero: 7,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP7.mp4" },
        { id: "otempo_ep8",  titulo: "Episódio 8",  numero: 8,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP8.mp4" },
        { id: "otempo_ep9",  titulo: "Episódio 9",  numero: 9,  duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP9.mp4" },
        { id: "otempo_ep10", titulo: "Episódio 10", numero: 10, duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP10.mp4" },
        { id: "otempo_ep11", titulo: "Episódio 11", numero: 11, duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP11.mp4" },
        { id: "otempo_ep12", titulo: "Episódio 12", numero: 12, duracao_seg: 2700, arquivo: "OTempoTrásVocêPraMimEP12.mp4" },
      ]
    }]
  },

  {
    conteudo_id: "w-dois-mundos",
    titulo: "W - Dois Mundos",
    tipo: "Série",
    poster: `${FILE_BASE}/W_Dois_mundos.jpg (2)`,
    descricao: "Uma médica é misteriosamente puxada para dentro de um webtoon onde conhece o protagonista da história. Enquanto os dois mundos — o real e o fictício — começam a se misturar, eles se apaixonam numa narrativa que desafia a fronteira entre realidade e ficção.",
    generos: ["Drama", "Romance", "Fantasia"],
    classificacao: "12",
    ano: 2016,
    temporadas: [{
      temporada_id: "00000001-0000-0000-0000-000000000002",
      numero: 1,
      episodios: [
        { id: "w_ep1", titulo: "Episódio 1", numero: 1, duracao_seg: 4500, arquivo: "W_S01E01_Episode 1.mp4" },
      ]
    }]
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
  },

  {
    conteudo_id: "jojolion",
    titulo: "JojoLion",
    tipo: "Manga",
    poster: `${POSTER_BASE}/jojolion.jpg`,
    descricao: "A oitava parte de JoJo's Bizarre Adventure. Em Morioh, uma cidade estranha após um terremoto, Josuke Higashikata desperta sem memórias e com poderes misteriosos.",
    generos: ["Manga", "Ação", "Mistério", "Sobrenatural"],
    classificacao: "14",
    ano: 2011,
    temporadas: []
  },

  {
    conteudo_id: "jojolands",
    titulo: "The JoJoLands",
    tipo: "Manga",
    poster: `${POSTER_BASE}/jojolands.webp`,
    descricao: "A nona parte de JoJo's Bizarre Adventure. Jodio Joestar, um jovem do Havaí, embarca em uma jornada para acumular riqueza em um mundo governado por leis próprias.",
    generos: ["Manga", "Ação", "Aventura", "Sobrenatural"],
    classificacao: "14",
    ano: 2023,
    temporadas: []
  },

  // ─── Novos conteúdos adicionados do B2 ─────────────────────────────────────
  {
    conteudo_id: "demon-slayer-castelo-infinito",
    titulo: "Demon Slayer: Castelo Infinito",
    tipo: "Anime",
    poster: `${FILE_BASE}/Demon-Slayer-Castelo-Infinito.webp`,
    descricao: "Tanjiro e seus companheiros do Esquadrão de Caça aos Demônios invadem o Castelo Infinito para o confronto final contra Muzan Kibutsuji e a Lua Superior, em uma batalha que decidirá o destino da humanidade.",
    generos: ["Anime", "Ação", "Sobrenatural"],
    classificacao: "16",
    ano: 2025,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000040",
      numero: 1,
      episodios: [
        { id: "demonslayer_castelo_filme", titulo: "Demon Slayer: Castelo Infinito", numero: 1, duracao_seg: 7560, arquivo: "CasteloInfinito(Leg).mp4" }
      ]
    }]
  },

  {
    conteudo_id: "sword-art-online-filme",
    titulo: "Sword Art Online: O Filme",
    tipo: "Anime",
    poster: `${FILE_BASE}/suord-art-online-filme.jpg`,
    descricao: "Kirito e Asuna enfrentam um novo perigo que ameaça transbordar do mundo virtual para o real, num confronto que coloca à prova tudo o que conquistaram desde os dias presos no Sword Art Online.",
    generos: ["Anime", "Ação", "Ficção Científica", "Romance"],
    classificacao: "14",
    ano: 2017,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000031",
      numero: 1,
      episodios: [
        { id: "sao_filme", titulo: "Sword Art Online: O Filme", numero: 1, duracao_seg: 6840, arquivo: "Sword_Art_Onlinefml.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "yo-kai-watch-o-filme",
    titulo: "Yo-Kai Watch: O Filme",
    tipo: "Anime",
    poster: `${FILE_BASE}/YOKWTCHOflm.jpg`,
    descricao: "Keita e seus amigos Yo-kai embarcam em uma nova aventura cheia de mistérios e criaturas curiosas, enfrentando perigos que só podem ser resolvidos com a ajuda do Yo-kai Watch.",
    generos: ["Anime", "Aventura", "Comédia"],
    classificacao: "Livre",
    ano: 2014,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000032",
      numero: 1,
      episodios: [
        { id: "yokai_watch_filme", titulo: "Yo-Kai Watch: O Filme", numero: 1, duracao_seg: 5700, arquivo: "YOKWTCHOFLM.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "a-ratinha-valente",
    titulo: "A Ratinha Valente",
    tipo: "Filme",
    poster: `${FILE_BASE}/a-ratinha-valente.jpg`,
    descricao: "Uma pequena ratinha cheia de coragem enfrenta perigos muito maiores do que ela em uma jornada animada repleta de aventura, amizade e superação.",
    generos: ["Animação", "Aventura", "Família"],
    classificacao: "Livre",
    ano: 2024,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000033",
      numero: 1,
      episodios: [
        { id: "ratinha_valente_parte1", titulo: "A Ratinha Valente - Parte 1", numero: 1, duracao_seg: 4800, arquivo: "aratinhavalente1.mp4" },
        { id: "ratinha_valente_parte2", titulo: "A Ratinha Valente - Parte 2", numero: 2, duracao_seg: 4500, arquivo: "aratinhavalente2.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "kill-boksoon",
    titulo: "Kill Boksoon",
    tipo: "Filme",
    poster: `${FILE_BASE}/killBoksoon.jpg`,
    descricao: "Gil Bok-soon é uma assassina de elite que trabalha para uma agência de execuções sob contrato. Enquanto tenta equilibrar a carreira mortal com a criação da filha adolescente, um conflito interno da agência ameaça sua vida e tudo que construiu.",
    generos: ["Ação", "Drama", "Suspense"],
    classificacao: "16",
    ano: 2023,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000034",
      numero: 1,
      episodios: [
        { id: "kill_boksoon_filme", titulo: "Kill Boksoon", numero: 1, duracao_seg: 7080, arquivo: "KillBoksoon2023.DUB.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "mestres-do-universo-2026",
    titulo: "Mestres do Universo",
    tipo: "Filme",
    poster: `${FILE_BASE}/MestreUniverso.jpg`,
    descricao: "He-Man precisa descobrir seu verdadeiro poder e proteger Eternia contra Skeletor em uma adaptação live-action do clássico universo de fantasia e ação.",
    generos: ["Ação", "Aventura", "Fantasia"],
    classificacao: "12",
    ano: 2026,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000035",
      numero: 1,
      episodios: [
        { id: "mestres_universo_filme", titulo: "Mestres do Universo", numero: 1, duracao_seg: 6600, arquivo: "MestresdoUniverso2026(LEGENDADO).mp4" }
      ]
    }]
  },

  {
    conteudo_id: "mune-o-guardiao-da-lua",
    titulo: "Mune: O Guardião da Lua",
    tipo: "Filme",
    poster: `${FILE_BASE}/mune-guardia-da-lua.jpg`,
    descricao: "Mune é escolhido para se tornar o novo Guardião da Lua, mas precisa provar seu valor numa jornada mágica para impedir que o mundo mergulhe na escuridão eterna.",
    generos: ["Animação", "Aventura", "Fantasia"],
    classificacao: "Livre",
    ano: 2015,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000036",
      numero: 1,
      episodios: [
        { id: "mune_guardiao_lua_filme", titulo: "Mune: O Guardião da Lua", numero: 1, duracao_seg: 5400, arquivo: "MuneOGuardiãodaLua.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "fogo-contra-fogo",
    titulo: "Fogo Contra Fogo",
    tipo: "Filme",
    poster: `${FILE_BASE}/fogo-contra-fogo.jpg`,
    descricao: "Um confronto explosivo entre dois lados decididos a não recuar, numa trama de ação onde estratégia e instinto de sobrevivência determinam quem sai vivo.",
    generos: ["Ação", "Suspense"],
    classificacao: "16",
    ano: 2024,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000037",
      numero: 1,
      episodios: [
        { id: "fogo_contra_fogo_filme", titulo: "Fogo Contra Fogo", numero: 1, duracao_seg: 5760, arquivo: "FogoContraFogo.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "rain-man",
    titulo: "Rain Man",
    tipo: "Filme",
    poster: `${FILE_BASE}/rain-man.webp`,
    descricao: "Um jovem golpista descobre que tem um irmão mais velho autista savant internado numa instituição e, ao tentar tirar proveito da herança da família, embarca com ele numa viagem que muda sua vida para sempre.",
    generos: ["Drama"],
    classificacao: "12",
    ano: 1988,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000038",
      numero: 1,
      episodios: [
        { id: "rain_man_filme", titulo: "Rain Man", numero: 1, duracao_seg: 7320, arquivo: "rain-man.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "oppenheimer",
    titulo: "Oppenheimer",
    tipo: "Filme",
    poster: `${FILE_BASE}/oppenheimer-poster.avif`,
    descricao: "A história do físico J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica durante o Projeto Manhattan, e as consequências morais e políticas que o perseguiram pelo resto da vida.",
    generos: ["Drama", "Biografia", "História"],
    classificacao: "16",
    ano: 2023,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000039",
      numero: 1,
      episodios: [
        { id: "oppenheimer_filme", titulo: "Oppenheimer", numero: 1, duracao_seg: 10800, arquivo: "oppenheimer.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "bunny-girl-senpai-sonha-com-garota",
    titulo: "Seishun Buta Yarou wa Yumemiru Shoujo no Yume wo Minai",
    tipo: "Anime",
    poster: `${FILE_BASE}/SeishunButaYarouwaYumemiruShoujonoYumewoMinai.jpg`,
    descricao: "Sakuta Azusagawa precisa ajudar uma garota afetada pela Síndrome da Puberdade, enquanto enfrenta dilemas que envolvem memória, identidade e o peso de escolhas do passado que ameaçam o futuro dela.",
    generos: ["Anime", "Romance", "Drama", "Sobrenatural"],
    classificacao: "12",
    ano: 2023,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000041",
      numero: 1,
      episodios: [
        { id: "bunnygirl_sonha_filme", titulo: "Seishun Buta Yarou wa Yumemiru Shoujo no Yume wo Minai", numero: 1, duracao_seg: 5400, arquivo: "SeishunButaYarouwaYumemiruShoujonoYumewoMinai.mp4" }
      ]
    }]
  },

  {
    conteudo_id: "bunny-girl-senpai-odekake-sister",
    titulo: "Seishun Buta Yarou wa Odekake Sister no Yume wo Minai",
    tipo: "Anime",
    poster: `${FILE_BASE}/SeishunButaYarouwaodekakesister.jpg`,
    descricao: "Em uma nova fase de sua vida, Sakuta acompanha a irmã mais nova de Mai em um capítulo cheio de descobertas, laços familiares e mais um mistério ligado à Síndrome da Puberdade.",
    generos: ["Anime", "Romance", "Drama", "Slice of Life"],
    classificacao: "12",
    ano: 2025,
    temporadas: [{
      temporada_id: "f0000001-0000-0000-0000-000000000042",
      numero: 1,
      episodios: [
        { id: "bunnygirl_odekake_filme", titulo: "Seishun Buta Yarou wa Odekake Sister no Yume wo Minai", numero: 1, duracao_seg: 4500, arquivo: "SeishunButaYarouwaodekakesister.mp4" }
      ]
    }]
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
  { id: "gintama_vol_76", conteudo_id: "gintama", numero: 76, titulo: "Gintama - Volume 76", pdf_url: `${PDF_BASE}/GINTAMAVOL.76.pdf`, capa: `${POSTER_BASE}/gintama.avif`, paginas: 0 },

  // JojoLion
  { id: "jojolion_vol_01", conteudo_id: "jojolion", numero: 1,  titulo: "JojoLion - Volume 01", pdf_url: `${PDF_BASE}/JojoLion1.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_02", conteudo_id: "jojolion", numero: 2,  titulo: "JojoLion - Volume 02", pdf_url: `${PDF_BASE}/JojoLion2.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_03", conteudo_id: "jojolion", numero: 3,  titulo: "JojoLion - Volume 03", pdf_url: `${PDF_BASE}/JojoLion3.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_04", conteudo_id: "jojolion", numero: 4,  titulo: "JojoLion - Volume 04", pdf_url: `${PDF_BASE}/JojoLion4.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_05", conteudo_id: "jojolion", numero: 5,  titulo: "JojoLion - Volume 05", pdf_url: `${PDF_BASE}/JojoLion5.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_06", conteudo_id: "jojolion", numero: 6,  titulo: "JojoLion - Volume 06", pdf_url: `${PDF_BASE}/JojoLion6.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_07", conteudo_id: "jojolion", numero: 7,  titulo: "JojoLion - Volume 07", pdf_url: `${PDF_BASE}/JojoLion7.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_08", conteudo_id: "jojolion", numero: 8,  titulo: "JojoLion - Volume 08", pdf_url: `${PDF_BASE}/JojoLion8.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_09", conteudo_id: "jojolion", numero: 9,  titulo: "JojoLion - Volume 09", pdf_url: `${PDF_BASE}/JojoLion9.pdf`,  capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_10", conteudo_id: "jojolion", numero: 10, titulo: "JojoLion - Volume 10", pdf_url: `${PDF_BASE}/JojoLion10.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_11", conteudo_id: "jojolion", numero: 11, titulo: "JojoLion - Volume 11", pdf_url: `${PDF_BASE}/JojoLion11.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_12", conteudo_id: "jojolion", numero: 12, titulo: "JojoLion - Volume 12", pdf_url: `${PDF_BASE}/JojoLion12.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_13", conteudo_id: "jojolion", numero: 13, titulo: "JojoLion - Volume 13", pdf_url: `${PDF_BASE}/JojoLion13.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_14", conteudo_id: "jojolion", numero: 14, titulo: "JojoLion - Volume 14", pdf_url: `${PDF_BASE}/JojoLion14.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_15", conteudo_id: "jojolion", numero: 15, titulo: "JojoLion - Volume 15", pdf_url: `${PDF_BASE}/JojoLion15.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_16", conteudo_id: "jojolion", numero: 16, titulo: "JojoLion - Volume 16", pdf_url: `${PDF_BASE}/JojoLion16.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_17", conteudo_id: "jojolion", numero: 17, titulo: "JojoLion - Volume 17", pdf_url: `${PDF_BASE}/JojoLion17.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_18", conteudo_id: "jojolion", numero: 18, titulo: "JojoLion - Volume 18", pdf_url: `${PDF_BASE}/JojoLion18.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_19", conteudo_id: "jojolion", numero: 19, titulo: "JojoLion - Volume 19", pdf_url: `${PDF_BASE}/JojoLion19.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_20", conteudo_id: "jojolion", numero: 20, titulo: "JojoLion - Volume 20", pdf_url: `${PDF_BASE}/JojoLion20.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_21", conteudo_id: "jojolion", numero: 21, titulo: "JojoLion - Volume 21", pdf_url: `${PDF_BASE}/JojoLion21.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_22", conteudo_id: "jojolion", numero: 22, titulo: "JojoLion - Volume 22", pdf_url: `${PDF_BASE}/JojoLion22.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_23", conteudo_id: "jojolion", numero: 23, titulo: "JojoLion - Volume 23", pdf_url: `${PDF_BASE}/JojoLion23.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_24", conteudo_id: "jojolion", numero: 24, titulo: "JojoLion - Volume 24", pdf_url: `${PDF_BASE}/JojoLion24.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_25", conteudo_id: "jojolion", numero: 25, titulo: "JojoLion - Volume 25", pdf_url: `${PDF_BASE}/JojoLion25.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_26", conteudo_id: "jojolion", numero: 26, titulo: "JojoLion - Volume 26", pdf_url: `${PDF_BASE}/JojoLion26.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },
  { id: "jojolion_vol_27", conteudo_id: "jojolion", numero: 27, titulo: "JojoLion - Volume 27", pdf_url: `${PDF_BASE}/JojoLion27.pdf`, capa: `${POSTER_BASE}/jojolion.jpg`, paginas: 0 },

  // The JoJoLands
  { id: "jojolands_vol_01", conteudo_id: "jojolands", numero: 1, titulo: "The JoJoLands - Volume 01", pdf_url: `${PDF_BASE}/JOJOLANDSVOL.01.pdf`, capa: `${POSTER_BASE}/jojolands.webp`, paginas: 0 },
  { id: "jojolands_vol_02", conteudo_id: "jojolands", numero: 2, titulo: "The JoJoLands - Volume 02", pdf_url: `${PDF_BASE}/JOJOLANDSVOL.02.pdf`, capa: `${POSTER_BASE}/jojolands.webp`, paginas: 0 },
  { id: "jojolands_vol_03", conteudo_id: "jojolands", numero: 3, titulo: "The JoJoLands - Volume 03", pdf_url: `${PDF_BASE}/JOJOLANDSVOL.03.pdf`, capa: `${POSTER_BASE}/jojolands.webp`, paginas: 0 },
  { id: "jojolands_vol_04", conteudo_id: "jojolands", numero: 4, titulo: "The JoJoLands - Volume 04", pdf_url: `${PDF_BASE}/JOJOLANDSVOL.04.pdf`, capa: `${POSTER_BASE}/jojolands.webp`, paginas: 0 },
  { id: "jojolands_vol_05", conteudo_id: "jojolands", numero: 5, titulo: "The JoJoLands - Volume 05", pdf_url: `${PDF_BASE}/JOJOLANDSVOL.05.pdf`, capa: `${POSTER_BASE}/jojolands.webp`, paginas: 0 },
  { id: "jojolands_vol_06", conteudo_id: "jojolands", numero: 6, titulo: "The JoJoLands - Volume 06", pdf_url: `${PDF_BASE}/JOJOLANDSVOL.06.pdf`, capa: `${POSTER_BASE}/jojolands.webp`, paginas: 0 }
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