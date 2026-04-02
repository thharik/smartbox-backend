-- Tvxbox — Schema PostgreSQL
-- Como rodar: psql $DATABASE_URL -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS perfis (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome       TEXT NOT NULL,
  avatar     TEXT DEFAULT 'avatar1',
  pin_hash   TEXT,
  infantil   BOOLEAN DEFAULT FALSE,
  criado_em  TIMESTAMPTZ DEFAULT NOW()
);

-- Tipos válidos: Filme | Série | Anime | AoVivo | Manga | Aula
CREATE TABLE IF NOT EXISTS conteudos (
  id            TEXT PRIMARY KEY,
  titulo        TEXT NOT NULL,
  tipo          TEXT NOT NULL,
  poster        TEXT,
  descricao     TEXT,
  generos       TEXT[],
  classificacao TEXT DEFAULT 'Livre',
  ano           INT,
  criado_em     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS temporadas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conteudo_id TEXT NOT NULL REFERENCES conteudos(id) ON DELETE CASCADE,
  numero      INT NOT NULL,
  UNIQUE(conteudo_id, numero)
);

CREATE TABLE IF NOT EXISTS episodios (
  id           TEXT PRIMARY KEY,
  temporada_id UUID NOT NULL REFERENCES temporadas(id) ON DELETE CASCADE,
  titulo       TEXT NOT NULL,
  descricao    TEXT,
  capa         TEXT,
  video_url    TEXT,
  duracao_seg  INT,
  numero       INT NOT NULL,
  intro_inicio INT DEFAULT 0,
  intro_fim    INT DEFAULT 90,
  criado_em    TIMESTAMPTZ DEFAULT NOW()
);

-- Capítulos de mangá (PDFs no B2)
CREATE TABLE IF NOT EXISTS capitulos (
  id           TEXT PRIMARY KEY,
  conteudo_id  TEXT NOT NULL REFERENCES conteudos(id) ON DELETE CASCADE,
  numero       INT NOT NULL,
  titulo       TEXT NOT NULL,
  pdf_url      TEXT NOT NULL,
  capa         TEXT,
  paginas      INT DEFAULT 0,
  criado_em    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conteudo_id, numero)
);

CREATE TABLE IF NOT EXISTS favoritos (
  perfil_id     UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  conteudo_id   TEXT NOT NULL REFERENCES conteudos(id) ON DELETE CASCADE,
  adicionado_em TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (perfil_id, conteudo_id)
);

-- CORRIGIDO: campos current_time e duration (alinhados com o schema original)
CREATE TABLE IF NOT EXISTS progresso (
  perfil_id     UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  episodio_id   TEXT NOT NULL REFERENCES episodios(id) ON DELETE CASCADE,
  conteudo_id   TEXT NOT NULL,
  current_time  INT DEFAULT 0,
  duration      INT DEFAULT 0,
  concluido     BOOLEAN DEFAULT FALSE,
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (perfil_id, episodio_id)
);

-- Progresso de leitura de mangá
CREATE TABLE IF NOT EXISTS progresso_manga (
  perfil_id    UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  capitulo_id  TEXT NOT NULL REFERENCES capitulos(id) ON DELETE CASCADE,
  conteudo_id  TEXT NOT NULL,
  pagina_atual INT DEFAULT 1,
  concluido    BOOLEAN DEFAULT FALSE,
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (perfil_id, capitulo_id)
);

CREATE INDEX IF NOT EXISTS idx_perfis_usuario   ON perfis(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_perfil  ON favoritos(perfil_id);
CREATE INDEX IF NOT EXISTS idx_progresso_perfil  ON progresso(perfil_id);
CREATE INDEX IF NOT EXISTS idx_ep_temporada      ON episodios(temporada_id);
CREATE INDEX IF NOT EXISTS idx_capitulos_content ON capitulos(conteudo_id);
CREATE INDEX IF NOT EXISTS idx_prog_manga_perfil ON progresso_manga(perfil_id);
