# Tvxbox — Back-end: Mudanças e Correções

## 🐛 Bugs Corrigidos

### 1. Continuar Assistindo quebrado (`progresso.js`)
**Causa:** O código fazia INSERT usando colunas `tempo_atual` e `duracao`,
mas o schema define as colunas como `current_time` e `duration`.
O PostgreSQL rejeitava o insert silenciosamente e nada era salvo.

**Correção:** Nomes das colunas alinhados com o schema em `progresso.js`.

---

### 2. Favoritos sem tratamento de erro (`favoritos.js`)
O arquivo original não tinha try/catch nas queries. Qualquer erro de banco
derrubava a request sem resposta adequada. Adicionados try/catch em todas
as rotas + nova rota `GET /favoritos/check/:conteudoId`.

---

### 3. Vídeo sem suporte a Range Requests (`video.js`)
**Causa:** O player HTML5 precisa de Range Requests para funcionar corretamente
(seek, tela cheia, retomada). O B2 retornava o arquivo inteiro sem suporte a
`bytes=start-end`, o que impedia o player de funcionar bem.

**Correção:** `video.js` agora detecta o header `Range` e faz a requisição
correspondente ao B2 (`bytes=start-end`), respondendo com status `206 Partial Content`.

Isso também resolve o player já abrir preparado para tela cheia — o front-end
pode chamar `videoElement.requestFullscreen()` no evento `loadedmetadata`.

---

## ✨ Novas Funcionalidades

### Mangás (PDFs no B2)

**Novo arquivo:** `routes/mangas.js`
**Nova tabela:** `capitulos`, `progresso_manga`

Rotas disponíveis:
```
GET  /mangas/:conteudoId/capitulos     → lista capítulos
POST /mangas/capitulo                  → cadastrar/editar capítulo (admin)
DEL  /mangas/capitulo/:id              → remover capítulo (admin)
POST /mangas/progresso                 → salvar página atual
GET  /mangas/progresso/continuar       → mangás em andamento
GET  /mangas/progresso/:conteudoId     → progresso por mangá
```

Para servir o PDF do B2 (leitura no browser):
```
GET  /video/pdf/:fileName              → serve o PDF inline
```

**Exemplo de cadastro de capítulo:**
```json
POST /mangas/capitulo
{
  "id": "one-piece-cap-1100",
  "conteudoId": "one-piece",
  "numero": 1100,
  "titulo": "Capítulo 1100",
  "pdfUrl": "mangas/one-piece/1100.pdf",
  "capa": "https://...",
  "paginas": 18
}
```

---

### Aulas

Aulas funcionam exatamente igual a Séries/Filmes no back-end.
Basta cadastrar o conteúdo com `tipo: "Aula"` e adicionar temporadas/episódios normalmente.

```json
POST /catalogo
{
  "id": "curso-react-2025",
  "titulo": "Curso de React 2025",
  "tipo": "Aula",
  "poster": "https://...",
  "descricao": "Aprenda React do zero"
}
```

---

### YouTube removido

O tipo `"YouTube"` foi removido de `catalogo.js`.
Tipos válidos agora: `Filme | Série | Anime | AoVivo | Manga | Aula`

---

## 📁 Arquivos Alterados

| Arquivo          | Status     | O que mudou                                      |
|------------------|------------|--------------------------------------------------|
| `schema.sql`     | ✏️ Editado  | Novas tabelas capitulos, progresso_manga         |
| `progresso.js`   | 🐛 Bugfix   | Nomes de coluna current_time/duration corrigidos |
| `catalogo.js`    | ✏️ Editado  | Remove YouTube, adiciona Manga e Aula            |
| `favoritos.js`   | ✏️ Editado  | Try/catch + rota check/:id adicionada            |
| `video.js`       | ✏️ Editado  | Range Requests + rota /pdf/:fileName             |
| `mangas.js`      | 🆕 Novo     | Rotas completas para capítulos e progresso       |
| `server.js`      | 📋 Exemplo  | Como registrar todas as rotas                    |

---

## 🔄 Migração do Banco

Se o banco já existe em produção, rode apenas as novas tabelas:

```sql
-- Rodar no banco existente (não recria o que já existe)
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

CREATE TABLE IF NOT EXISTS progresso_manga (
  perfil_id    UUID NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  capitulo_id  TEXT NOT NULL REFERENCES capitulos(id) ON DELETE CASCADE,
  conteudo_id  TEXT NOT NULL,
  pagina_atual INT DEFAULT 1,
  concluido    BOOLEAN DEFAULT FALSE,
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (perfil_id, capitulo_id)
);

CREATE INDEX IF NOT EXISTS idx_capitulos_content ON capitulos(conteudo_id);
CREATE INDEX IF NOT EXISTS idx_prog_manga_perfil ON progresso_manga(perfil_id);
```

---

## 🎬 Tela Cheia Automática (Front-end)

No player de vídeo, adicione isto ao evento de play:

```js
videoEl.addEventListener('play', () => {
  if (videoEl.requestFullscreen) videoEl.requestFullscreen();
  else if (videoEl.webkitRequestFullscreen) videoEl.webkitRequestFullscreen();
}, { once: true });
```

O suporte a Range Requests no back-end garante que o seek e a tela cheia
funcionem sem travar o vídeo.
