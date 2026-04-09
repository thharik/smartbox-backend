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

const VIDEO_BASE  = "https://tvxbox-b2.tharikluan-miguel.workers.dev";
const POSTER_BASE = "https://tvxbox-b2.tharikluan-miguel.workers.dev";

// ─────────────────────────────────────────────────────────────────────────────
// GUIA DE PREENCHIMENTO
// ─────────────────────────────────────────────────────────────────────────────
//
//  conteudo_id     → ID único do conteúdo (sem espaços, ex: "one_piece")
//  titulo          → Título exibido no site
//  tipo            → "Anime" | "Série" | "Filme"
//  poster          → Nome do arquivo de imagem no B2 (ex: "one_piece.jpg")
//  descricao       → Descrição curta
//  generos         → Array de strings (ex: ["Anime", "Ação"])
//  classificacao   → "Livre" | "10" | "12" | "14" | "16" | "18"
//  ano             → Número (ex: 2024)
//
//  temporadas      → Array de temporadas. Cada temporada tem:
//    temporada_id  → UUID fixo único para esta temporada
//    numero        → Número da temporada (1, 2, 3...)
//    episodios     → Array de episódios. Cada episódio tem:
//      id          → ID único do episódio (ex: "buddy_ep1")
//      titulo      → Título do episódio
//      numero      → Número do episódio
//      duracao_seg → Duração em segundos
//
//      ── ÁUDIO ──
//      arquivo          → Arquivo principal (usado se não houver dublado/legendado separados)
//      arquivo_dublado  → Arquivo da versão DUBLADA  (opcional)
//      arquivo_legendado→ Arquivo da versão LEGENDADA (opcional)
//
//      Se você só tem um arquivo (sem distinção dub/leg), use apenas "arquivo".
//      Se tiver versões separadas, preencha "arquivo_dublado" e "arquivo_legendado".
//      O site exibirá a barra de seleção "Dublado / Legendado" automaticamente
//      quando houver arquivos distintos.
//
// ─────────────────────────────────────────────────────────────────────────────

const conteudos = [
  // ── EXEMPLO COM VERSÃO ÚNICA (sem dub/leg separados) ─────────────────────
  {
    conteudo_id:   "buddy",
    titulo:        "Buddy",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/Buddy.jpg`,
    descricao:     "A série acompanha personagens que enfrentam desafios, amizades inesperadas e situações cheias de aventura.",
    generos:       ["Anime", "Aventura"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "a1111111-1111-1111-1111-111111111111",
        numero: 1,
        episodios: [
          { id: "buddy_ep1",  titulo: "Buddy - Episódio 1",  numero: 1,  duracao_seg: 1787, arquivo: "buddyEP1.mp4"  },
          { id: "buddy_ep2",  titulo: "Buddy - Episódio 2",  numero: 2,  duracao_seg: 1529, arquivo: "buddyEP2.mp4"  },
          { id: "buddy_ep3",  titulo: "Buddy - Episódio 3",  numero: 3,  duracao_seg: 1039, arquivo: "buddyEP3.mp4"  },
          { id: "buddy_ep4",  titulo: "Buddy - Episódio 4",  numero: 4,  duracao_seg: 1521, arquivo: "buddyEP4.mp4"  },
          { id: "buddy_ep5",  titulo: "Buddy - Episódio 5",  numero: 5,  duracao_seg:  992, arquivo: "buddyEP5.mp4"  },
          { id: "buddy_ep6",  titulo: "Buddy - Episódio 6",  numero: 6,  duracao_seg: 1580, arquivo: "buddyEP6.mp4"  },
          { id: "buddy_ep7",  titulo: "Buddy - Episódio 7",  numero: 7,  duracao_seg: 1432, arquivo: "buddyEP7.mp4"  },
          { id: "buddy_ep8",  titulo: "Buddy - Episódio 8",  numero: 8,  duracao_seg: 1141, arquivo: "buddyEP8.mp4"  },
          { id: "buddy_ep9",  titulo: "Buddy - Episódio 9",  numero: 9,  duracao_seg: 1736, arquivo: "buddyEP9.mp4"  },
          { id: "buddy_ep10", titulo: "Buddy - Episódio 10", numero: 10, duracao_seg: 1531, arquivo: "buddyEP10.mp4" },
          { id: "buddy_ep11", titulo: "Buddy - Episódio 11", numero: 11, duracao_seg: 1327, arquivo: "buddyEP11.mp4" },
          { id: "buddy_ep12", titulo: "Buddy - Episódio 12", numero: 12, duracao_seg: 1331, arquivo: "buddyEP12.mp4" },
        ]
      }
    ]
  },

  // ── EXEMPLO COM DUBLADO E LEGENDADO SEPARADOS ─────────────────────────────
  // {
  //   conteudo_id:   "one_piece",
  //   titulo:        "One Piece",
  //   tipo:          "Anime",
  //   poster:        `${POSTER_BASE}/one_piece.jpg`,
  //   descricao:     "...",
  //   generos:       ["Anime", "Aventura"],
  //   classificacao: "Livre",
  //   ano:           1999,
  //   temporadas: [
  //     {
  //       temporada_id: "aa000000-0000-0000-0000-000000000001",
  //       numero: 1,
  //       episodios: [
  //         {
  //           id: "op_ep1", titulo: "One Piece - Episódio 1", numero: 1, duracao_seg: 1400,
  //           arquivo_dublado:   "OnePieceEP1_DUB.mp4",  // ← versão dublada
  //           arquivo_legendado: "OnePieceEP1_LEG.mp4",  // ← versão legendada
  //         },
  //       ]
  //     },
  //     {
  //       temporada_id: "aa000000-0000-0000-0000-000000000002",
  //       numero: 2,
  //       episodios: [
  //         { id: "op_s2_ep1", titulo: "One Piece T2 - Episódio 1", numero: 1, duracao_seg: 1400, arquivo: "OnePieceS2EP1.mp4" },
  //       ]
  //     }
  //   ]
  // },

  {
    conteudo_id:   "frieren",
    titulo:        "Frieren",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/frieren.jpg`,
    descricao:     "Depois do fim de uma grande jornada, Frieren, uma maga elfa de vida longa, continua viajando pelo mundo enquanto aprende mais sobre amizade, memórias e o valor do tempo.",
    generos:       ["Anime", "Fantasia"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "b2222222-2222-2222-2222-222222222222",
        numero: 1,
        episodios: [
          { id: "frieren_ep1", titulo: "Frieren - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "FrierenEP1.mp4" },
          { id: "frieren_ep2", titulo: "Frieren - Episódio 2", numero: 2, duracao_seg: 1500, arquivo: "FrierenEP2.mp4" },
          { id: "frieren_ep3", titulo: "Frieren - Episódio 3", numero: 3, duracao_seg: 1500, arquivo: "FrierenEP3.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "kingdom",
    titulo:        "Kingdom",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/kingdom.jpg`,
    descricao:     "Em meio a guerras e disputas pelo poder, a história acompanha jovens que sonham em se tornar grandes generais. Com batalhas intensas e estratégias militares, Kingdom mostra coragem, ambição e conquista.",
    generos:       ["Anime", "Acao"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "c3333333-3333-3333-3333-333333333333",
        numero: 1,
        episodios: [
          { id: "kingdom_ep1",  titulo: "Kingdom - Episódio 1",  numero: 1,  duracao_seg: 1500, arquivo: "KingdomEP1.mp4"  },
          { id: "kingdom_ep2",  titulo: "Kingdom - Episódio 2",  numero: 2,  duracao_seg: 1500, arquivo: "KingdomEP2.mp4"  },
          { id: "kingdom_ep3",  titulo: "Kingdom - Episódio 3",  numero: 3,  duracao_seg: 1500, arquivo: "KingdomEP3.mp4"  },
          { id: "kingdom_ep5",  titulo: "Kingdom - Episódio 5",  numero: 5,  duracao_seg: 1500, arquivo: "KingdomEP5.mp4"  },
          { id: "kingdom_ep6",  titulo: "Kingdom - Episódio 6",  numero: 6,  duracao_seg: 1500, arquivo: "KingdomEP6.mp4"  },
          { id: "kingdom_ep7",  titulo: "Kingdom - Episódio 7",  numero: 7,  duracao_seg: 1500, arquivo: "KingdomEP7.mp4"  },
          { id: "kingdom_ep8",  titulo: "Kingdom - Episódio 8",  numero: 8,  duracao_seg: 1500, arquivo: "KingdomEP8.mp4"  },
          { id: "kingdom_ep9",  titulo: "Kingdom - Episódio 9",  numero: 9,  duracao_seg: 1500, arquivo: "KingdomEP9.mp4"  },
          { id: "kingdom_ep10", titulo: "Kingdom - Episódio 10", numero: 10, duracao_seg: 1500, arquivo: "KingdomEP10.mp4" },
          { id: "kingdom_ep11", titulo: "Kingdom - Episódio 11", numero: 11, duracao_seg: 1500, arquivo: "KingdomEP11.mp4" },
          { id: "kingdom_ep13", titulo: "Kingdom - Episódio 13", numero: 13, duracao_seg: 1500, arquivo: "KingdomEP13.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "zatbell",
    titulo:        "Zatch Bell",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/zatbell.jpg`,
    descricao:     "Kiyo Takamine encontra Zatch Bell, um menino misterioso que participa de uma batalha entre mamodos. Juntos, eles enfrentam inimigos poderosos em uma aventura cheia de ação, amizade e magia.",
    generos:       ["Anime", "Aventura"],
    classificacao: "Livre",
    ano:           2003,
    temporadas: [
      {
        temporada_id: "d4444444-4444-4444-4444-444444444444",
        numero: 1,
        episodios: [
          { id: "zatbell_ep1", titulo: "Zatch Bell - Episódio 1", numero: 1, duracao_seg: 4120, arquivo: "zatbell.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "gashbell",
    titulo:        "Konjiki no Gash Bell",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/zatbell.jpg`,
    descricao:     "A obra acompanha a jornada de Gash Bell e Kiyo Takamine em batalhas entre mamodos. Com muita emoção, humor e combates marcantes, a série mistura magia, amizade e coragem.",
    generos:       ["Anime", "Aventura"],
    classificacao: "Livre",
    ano:           2003,
    temporadas: [
      {
        temporada_id: "e5555555-5555-5555-5555-555555555555",
        numero: 1,
        episodios: [
          { id: "gash_ep1", titulo: "Konjiki no Gash Bell - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP1.mp4" },
          { id: "gash_ep2", titulo: "Konjiki no Gash Bell - Episódio 2", numero: 2, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP2.mp4" },
          { id: "gash_ep3", titulo: "Konjiki no Gash Bell - Episódio 3", numero: 3, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP3.mp4" },
          { id: "gash_ep4", titulo: "Konjiki no Gash Bell - Episódio 4", numero: 4, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP4.mp4" },
          { id: "gash_ep5", titulo: "Konjiki no Gash Bell - Episódio 5", numero: 5, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP5.mp4" },
          { id: "gash_ep6", titulo: "Konjiki no Gash Bell - Episódio 6", numero: 6, duracao_seg: 1500, arquivo: "Konjiki_no_Gash_BellEP6.mp4" },
          { id: "gash_ep7", titulo: "Konjiki no Gash Bell - Episódio 7", numero: 7, duracao_seg: 1500, arquivo: "GashBellEP7.mp4" },
          { id: "gash_ep8", titulo: "Konjiki no Gash Bell - Episódio 8", numero: 8, duracao_seg: 1500, arquivo: "GashBellEP8.mp4" },
          { id: "gash_ep9", titulo: "Konjiki no Gash Bell - Episódio 9", numero: 9, duracao_seg: 1500, arquivo: "GashBellEP9.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "jidou",
    titulo:        "Jidou Anabaiki",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/Jidouanbaiki.jpg`,
    descricao:     "Com uma proposta curiosa e divertida, a série apresenta situações incomuns e personagens marcantes em uma narrativa leve, criativa e cheia de humor.",
    generos:       ["Anime", "Comedia"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "f1111111-1111-1111-1111-111111111111",
        numero: 1,
        episodios: [
          { id: "jidou_ep1", titulo: "Jidou Anabaiki - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "Jidou_anabaikiT3EP1.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "kirio_fan_club",
    titulo:        "Kirio Fan Club",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/KIRIO_FAN_CLUB_.webp`,
    descricao:     "A série apresenta situações divertidas e exageradas envolvendo admiração, convivência e momentos cômicos em torno de personagens cheios de personalidade.",
    generos:       ["Anime", "Comedia"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "f2222222-2222-2222-2222-222222222222",
        numero: 1,
        episodios: [
          { id: "kirio_ep1", titulo: "Kirio Fan Club - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "KirioFanclubEP1.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "maid",
    titulo:        "Maid-san wa Taberu dake",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/Maid.jpg`,
    descricao:     "Uma obra leve e descontraída que acompanha o cotidiano de personagens carismáticos, com foco em momentos simples, humor e cenas acolhedoras.",
    generos:       ["Anime", "Slice of Life"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "f3333333-3333-3333-3333-333333333333",
        numero: 1,
        episodios: [
          { id: "maid_ep1", titulo: "Maid-san wa Taberu dake - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "Maid-san_wa_Taberu_dakeEP1.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "mata_korosarete",
    titulo:        "Mata Korosarete",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/Mata-Korosarete.jpg`,
    descricao:     "Uma trama de ação e mistério com reviravolta intensa.",
    generos:       ["Anime", "Acao"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "f4444444-4444-4444-4444-444444444444",
        numero: 1,
        episodios: [
          { id: "mata_ep1", titulo: "Mata Korosarete - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "MataKorosarete_EP1.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "ika",
    titulo:        "Shinryaku Ika Musume",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/Shinryaku.jpg`,
    descricao:     "Uma garota-lula chega à superfície com a missão de invadir a humanidade, mas acaba vivendo situações engraçadas e inesperadas.",
    generos:       ["Anime", "Comedia"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "f6666666-6666-6666-6666-666666666666",
        numero: 1,
        episodios: [
          { id: "ika_ep1", titulo: "Shinryaku Ika Musume - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "Shinryaku_Ika_MusumeEP1.mp4" },
          { id: "ika_ep2", titulo: "Shinryaku Ika Musume - Episódio 2", numero: 2, duracao_seg: 1500, arquivo: "ShinryakuEP2.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "saikyouno_ousama",
    titulo:        "Saikyouno Ousama Nidomeno Jinsei wa Nani wo Suru",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/SaikyounoOusamaNidomenoJinseiwaNaniwoSuru.jpg`,
    descricao:     "Após uma nova oportunidade de vida, o protagonista recomeça sua jornada em um mundo cheio de desafios, magia e descobertas.",
    generos:       ["Anime", "Fantasia"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "f7777777-7777-7777-7777-777777777777",
        numero: 1,
        episodios: [
          { id: "saikyouno_ousama_ep1", titulo: "Saikyouno Ousama - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "SaikyounoOusamaNidomenoJinseiwaNaniwoSuruT1EP1.mp4" },
        ]
      }
    ]
  },

  {
    conteudo_id:   "yomi_no_tsu",
    titulo:        "Yomi no TsuaiO",
    tipo:          "Anime",
    poster:        `${POSTER_BASE}/yumi_no_tsu.jpg`,
    descricao:     "Em uma trama cercada por mistério, ação e forças sobrenaturais, o protagonista enfrenta perigos enquanto busca compreender o mundo ao seu redor.",
    generos:       ["Anime", "Acao"],
    classificacao: "Livre",
    ano:           2026,
    temporadas: [
      {
        temporada_id: "f8888888-8888-8888-8888-888888888888",
        numero: 1,
        episodios: [
          { id: "yomi_no_tsu_ep1", titulo: "Yomi no TsuaiO - Episódio 1", numero: 1, duracao_seg: 1500, arquivo: "Yomi_no_TsuaiOEP1.mp4" },
        ]
      }
    ]
  },
];

// Capítulos de mangá (estrutura separada)
const capitulos = [
  // Exemplo:
  // { id: "naruto_cap1", conteudo_id: "naruto", numero: 1, titulo: "Naruto Uzumaki!", pdf_url: "https://...", capa: "https://...", paginas: 45 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Execução — não edite abaixo desta linha
// ─────────────────────────────────────────────────────────────────────────────

async function resolverVideoUrl(ep) {
  // Prioridade: arquivo_dublado / arquivo_legendado, depois arquivo genérico
  const dub = ep.arquivo_dublado  ? `${VIDEO_BASE}/${ep.arquivo_dublado}`  : null;
  const leg = ep.arquivo_legendado? `${VIDEO_BASE}/${ep.arquivo_legendado}`: null;
  const gen = ep.arquivo          ? `${VIDEO_BASE}/${ep.arquivo}`          : null;
  return {
    video_url:     gen || dub || leg || null,
    video_url_dub: dub || gen || null,
    video_url_leg: leg || gen || null,
  };
}

async function salvarConteudos() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Garante que as colunas de áudio existem (migração automática)
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='episodios' AND column_name='video_url_dub'
        ) THEN
          ALTER TABLE episodios ADD COLUMN video_url_dub TEXT;
          ALTER TABLE episodios ADD COLUMN video_url_leg TEXT;
        END IF;
      END $$;
    `);

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
        [serie.conteudo_id, serie.titulo, serie.tipo, serie.poster,
         serie.descricao, serie.generos, serie.classificacao, serie.ano]
      );

      for (const temporada of (serie.temporadas || [])) {
        let temporadaIdReal;

        const temporadaExistente = await client.query(
          `SELECT id FROM temporadas WHERE conteudo_id=$1 AND numero=$2 LIMIT 1`,
          [serie.conteudo_id, temporada.numero]
        );

        if (temporadaExistente.rows.length > 0) {
          temporadaIdReal = temporadaExistente.rows[0].id;
          console.log(`  Temporada ${temporada.numero} já existe (${temporadaIdReal})`);
        } else {
          const nova = await client.query(
            `INSERT INTO temporadas (id, conteudo_id, numero) VALUES ($1,$2,$3) RETURNING id`,
            [temporada.temporada_id, serie.conteudo_id, temporada.numero]
          );
          temporadaIdReal = nova.rows[0].id;
          console.log(`  Temporada ${temporada.numero} criada (${temporadaIdReal})`);
        }

        for (const ep of (temporada.episodios || [])) {
          const { video_url, video_url_dub, video_url_leg } = await resolverVideoUrl(ep);
          console.log(`    Episódio: ${ep.id}`);

          await client.query(
            `INSERT INTO episodios
              (id, temporada_id, titulo, descricao, capa, video_url, video_url_dub, video_url_leg,
               duracao_seg, numero, intro_inicio, intro_fim)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
             ON CONFLICT (id) DO UPDATE SET
               temporada_id  = EXCLUDED.temporada_id,
               titulo        = EXCLUDED.titulo,
               descricao     = EXCLUDED.descricao,
               capa          = EXCLUDED.capa,
               video_url     = EXCLUDED.video_url,
               video_url_dub = EXCLUDED.video_url_dub,
               video_url_leg = EXCLUDED.video_url_leg,
               duracao_seg   = EXCLUDED.duracao_seg,
               numero        = EXCLUDED.numero,
               intro_inicio  = EXCLUDED.intro_inicio,
               intro_fim     = EXCLUDED.intro_fim`,
            [ep.id, temporadaIdReal, ep.titulo, ep.titulo, serie.poster,
             video_url, video_url_dub, video_url_leg,
             ep.duracao_seg, ep.numero, ep.intro_inicio ?? 0, ep.intro_fim ?? 90]
          );
        }
      }
    }

    // Capítulos de mangá
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
        [cap.id, cap.conteudo_id, cap.numero, cap.titulo, cap.pdf_url, cap.capa || null, cap.paginas || 0]
      );
    }

    await client.query("COMMIT");
    console.log(" Conteúdos salvos com sucesso!");
  } catch (erro) {
    await client.query("ROLLBACK");
    console.error("❌ Erro ao salvar conteúdos:", erro.message);
    console.error(erro);
  } finally {
    client.release();
    await pool.end();
  }
}

salvarConteudos();