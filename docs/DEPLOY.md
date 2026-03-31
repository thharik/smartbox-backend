# SmartBox — Guia completo de deploy
# Do zero até o app no ar com domínio próprio

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 RESUMO DOS CUSTOS (1TB de vídeo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Domínio (.com.br)      R$ 40/ano    (~R$ 3/mês)
  Backblaze B2 (1TB)     ~$6/mês      (~R$ 30/mês)
  Railway (backend)      $0–5/mês     (~R$ 0–25/mês)
  Vercel (frontend)      Grátis
  Cloudflare (CDN+DNS)   Grátis
  ─────────────────────────────────────────────
  TOTAL                  ~R$ 33–58/mês

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSO 1 — DOMÍNIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Acesse registro.br (para .com.br) ou namecheap.com (para .com)
2. Pesquise "smartbox" ou o nome que quiser
3. Compre e anote os dados de acesso ao painel DNS

Dica: .com.br é mais barato (~R$40/ano no registro.br)
      .com custa ~$12/ano no Namecheap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSO 2 — CLOUDFLARE (CDN + DNS grátis)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

O Cloudflare fica "na frente" de tudo. Ele:
  - Serve os vídeos do B2 SEM cobrar banda de saída
  - Protege contra ataques
  - Deixa o site mais rápido

1. Crie conta em cloudflare.com (grátis)
2. Clique "Add a Site" → digite seu domínio
3. Escolha plano "Free"
4. Cloudflare mostra 2 nameservers (ex: ada.ns.cloudflare.com)
5. No painel do registro.br/Namecheap, troque os nameservers
   para os do Cloudflare
6. Aguarde até 24h para propagar (geralmente 30 min)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSO 3 — BACKBLAZE B2 (storage dos vídeos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.1 Criar conta e bucket
  1. Acesse backblaze.com → crie conta grátis
  2. Vá em "B2 Cloud Storage" → "Create a Bucket"
  3. Nome do bucket: smartbox-videos
  4. Files in Bucket: Public  ← IMPORTANTE
  5. Clique "Create Bucket"

3.2 Obter chave de acesso
  1. Vá em "App Keys" → "Add a New Application Key"
  2. Nome: smartbox-upload
  3. Bucket: smartbox-videos
  4. Permissions: Read and Write
  5. SALVE o keyID e a applicationKey (aparecem uma única vez!)

3.3 Subir vídeos pelo navegador (pequenos lotes)
  - Na página do bucket, clique "Upload/Download"
  - Arraste os arquivos de vídeo
  - Cada arquivo vai gerar uma URL assim:
    https://f005.backblazeb2.com/file/smartbox-videos/mario.mp4

3.4 Subir vídeos em lote pelo terminal (recomendado para muitos arquivos)
  # Instale o b2-tools:
  pip install b2
  
  # Autentique:
  b2 authorize-account SEU_KEY_ID SUA_APPLICATION_KEY
  
  # Suba uma pasta inteira:
  b2 sync ./videos b2://smartbox-videos/videos

3.5 Conectar Cloudflare ao B2 (elimina custo de banda)
  1. No Cloudflare, vá em DNS → Add Record
  2. Type: CNAME
     Name: videos
     Target: f005.backblazeb2.com   ← substitua pelo endpoint do seu bucket
     Proxy: Ligado (nuvem laranja)
  3. Salvar

  Agora seus vídeos ficam acessíveis em:
  https://videos.SEUDOMINIO.com.br/file/smartbox-videos/mario.mp4

  No seu data.js ou banco, use essa URL nos campos "video":
  "video": "https://videos.SEUDOMINIO.com.br/file/smartbox-videos/mario.mp4"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSO 4 — RAILWAY (backend + PostgreSQL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1 Criar projeto
  1. Acesse railway.app → faça login com GitHub
  2. "New Project" → "Empty Project"
  3. Clique "+" → "Database" → "PostgreSQL"
     Railway cria o banco automaticamente!
  4. Clique "+" → "GitHub Repo" → selecione seu repositório
     (ou use "Deploy from local" com o CLI)

4.2 Configurar variáveis de ambiente
  No Railway, clique no serviço Node.js → "Variables":
  
  DATABASE_URL    = (Railway preenche automaticamente — copie do PostgreSQL)
  JWT_SECRET      = (gere com o comando abaixo e cole aqui)
  NODE_ENV        = production
  FRONTEND_URL    = https://SEUDOMINIO.com.br
  B2_PUBLIC_URL   = https://videos.SEUDOMINIO.com.br

  Para gerar o JWT_SECRET, rode no seu terminal:
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

4.3 Criar as tabelas do banco
  No Railway, clique no PostgreSQL → "Connect" → copie a connection string
  
  No seu terminal:
  psql "SUA_CONNECTION_STRING" -f backend/db/schema.sql

4.4 Deploy
  Railway detecta o package.json e faz deploy automático.
  Cada push no GitHub redeploya sozinho.

  Seu backend ficará em: https://smartbox-XXXXX.up.railway.app

4.5 Domínio personalizado no backend (opcional)
  Railway → Settings → Domains → Add Custom Domain
  Digite: api.SEUDOMINIO.com.br
  
  No Cloudflare, adicione:
  Type: CNAME | Name: api | Target: smartbox-XXXXX.up.railway.app | Proxy: OFF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSO 5 — VERCEL (frontend)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5.1 Deploy
  1. Acesse vercel.com → login com GitHub
  2. "New Project" → selecione seu repositório
  3. Root Directory: frontend   ← IMPORTANTE
  4. Framework: Other
  5. "Deploy"

5.2 Variável de ambiente no Vercel
  Settings → Environment Variables:
  NEXT_PUBLIC_API = https://api.SEUDOMINIO.com.br
  (ou a URL do Railway diretamente)

5.3 Domínio personalizado
  Settings → Domains → Add: SEUDOMINIO.com.br
  
  No Cloudflare, DNS:
  Type: CNAME | Name: @ | Target: cname.vercel-dns.com | Proxy: OFF
  Type: CNAME | Name: www | Target: cname.vercel-dns.com | Proxy: OFF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSO 6 — ATUALIZAR script.js PARA PRODUÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No frontend/script.js, na linha do const API:

  // Desenvolvimento (local):
  const API = "http://localhost:3000";

  // Produção (troque pela URL do Railway):
  const API = "https://api.SEUDOMINIO.com.br";

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSO 7 — PWA: ícones do app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para o app aparecer com ícone bonito ao instalar:

1. Crie uma imagem 512x512px com o logo do SmartBox
   (pode usar Canva, Figma, ou qualquer editor)
2. Salve como:
   frontend/pwa/icon-192.png  (redimensione para 192x192)
   frontend/pwa/icon-512.png  (512x512)
3. Faça deploy novamente

Ferramenta gratuita para gerar todos os tamanhos:
  https://realfavicongenerator.net

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PASSO 8 — TESTAR INSTALAÇÃO NA TV / CELULAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Celular Android:
  1. Abra Chrome → acesse SEUDOMINIO.com.br
  2. Menu (3 pontos) → "Adicionar à tela inicial"
  3. O app instala como qualquer app nativo

iPhone / iPad:
  1. Safari → acesse SEUDOMINIO.com.br
  2. Botão compartilhar → "Adicionar à Tela de Início"

Smart TV (Samsung/LG com navegador):
  1. Abra o navegador da TV
  2. Acesse SEUDOMINIO.com.br
  3. O site já funciona — a TV não instala PWA mas usa normalmente

Notebook:
  1. Chrome/Edge → acesse SEUDOMINIO.com.br
  2. Ícone de instalar na barra de endereço (ou Menu → Instalar SmartBox)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ESTRUTURA FINAL DE ARQUIVOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

smartbox/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example        ← copie para .env e preencha
│   ├── db/
│   │   ├── pool.js
│   │   └── schema.sql      ← rode uma vez para criar as tabelas
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── perfis.js
│       ├── catalogo.js
│       ├── progresso.js
│       ├── favoritos.js
│       └── video.js
└── frontend/
    ├── index.html
    ├── assistir.html
    ├── detalhe.html
    ├── ao-vivo.html
    ├── youtube.html
    ├── login.html
    ├── cadastro.html
    ├── script.js
    ├── style.css
    ├── data.js
    └── pwa/
        ├── manifest.json
        ├── service-worker.js
        ├── register-sw.js
        ├── icon-192.png    ← você cria
        └── icon-512.png    ← você cria

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 QUANDO CRESCER ALÉM DE 1TB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  - B2 escala automaticamente: cada TB adicional = +$6/mês
  - Upgrade Railway para $5/mês (mais recursos)
  - Se ultrapassar 5TB: considere Hetzner Storage Box
    (1TB = €3.81/mês, muito mais barato para grandes volumes)
  - Cloudflare continua grátis em qualquer tamanho

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CHECKLIST RÁPIDO ANTES DE LANÇAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] Domínio registrado e apontando pro Cloudflare
[ ] Bucket B2 criado como Public
[ ] Vídeos enviados pro B2 com URL pública
[ ] CNAME "videos" configurado no Cloudflare apontando pro B2
[ ] Railway com PostgreSQL criado
[ ] Variáveis de ambiente preenchidas no Railway
[ ] schema.sql executado no banco (tabelas criadas)
[ ] Frontend com const API apontando pro Railway
[ ] register-sw.js incluído em todos os HTMLs
[ ] Ícones icon-192.png e icon-512.png criados
[ ] Testar login, favoritos e progresso em 2 dispositivos diferentes
