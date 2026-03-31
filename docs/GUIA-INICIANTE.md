━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SMARTBOX — GUIA COMPLETO PARA INICIANTES
  Do seu PC até o app no ar, passo a passo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


╔════════════════════════════════════════════════╗
║  PARTE 1 — PREPARAR O PC                      ║
╚════════════════════════════════════════════════╝

─────────────────────────────────────────────────
  O QUE INSTALAR NO SEU PC
─────────────────────────────────────────────────

1. Node.js (o motor que roda o servidor)
   → Acesse: https://nodejs.org
   → Baixe a versão "LTS" (a recomendada)
   → Instale normalmente (next, next, finish)
   → Para confirmar, abra o terminal e digite:
        node --version
     Deve aparecer algo como: v20.11.0

2. Git (para enviar o código pro GitHub)
   → Acesse: https://git-scm.com/downloads
   → Baixe para Windows/Mac e instale
   → Para confirmar:
        git --version
     Deve aparecer: git version 2.x.x

3. Como abrir o terminal:
   Windows → aperte Win+R → digite "cmd" → Enter
             OU clique com botão direito na pasta → "Abrir no Terminal"
   Mac     → aperte Cmd+Espaço → digite "Terminal" → Enter


─────────────────────────────────────────────────
  ESTRUTURA DE PASTAS DO PROJETO
─────────────────────────────────────────────────

Quando você descompactar o ZIP, vai ficar assim:

  smartbox/
  ├── backend/          ← servidor Node.js
  │   ├── server.js
  │   ├── package.json
  │   ├── .env.example  ← copie para .env e preencha
  │   ├── db/
  │   │   ├── schema.sql
  │   │   └── pool.js
  │   ├── middleware/
  │   │   └── auth.js
  │   └── routes/
  │       ├── auth.js, perfis.js, catalogo.js...
  ├── frontend/         ← site (HTML, CSS, JS)
  │   ├── index.html
  │   ├── script.js, style.css, data.js...
  │   └── pwa/
  │       ├── manifest.json
  │       ├── service-worker.js
  │       ├── register-sw.js
  │       ├── icon-192.png  ← você vai criar
  │       └── icon-512.png  ← você vai criar
  ├── videos/           ← CRIE ESTA PASTA e coloque seus .mp4 aqui
  └── docs/
      ├── DEPLOY.md
      └── upload-videos.js


─────────────────────────────────────────────────
  INSTALAR AS DEPENDÊNCIAS DO BACKEND
─────────────────────────────────────────────────

Abra o terminal, navegue até a pasta backend e rode:

  cd smartbox/backend
  npm install

Vai aparecer uma pasta "node_modules" — é normal, são as bibliotecas.


─────────────────────────────────────────────────
  ADICIONAR VÍDEOS (PC local, para testar)
─────────────────────────────────────────────────

1. Crie a pasta:  smartbox/videos/
2. Coloque seus arquivos .mp4 lá dentro
3. No data.js, no campo "video" de cada episódio,
   coloque só o NOME do arquivo (sem o caminho):
   
   video: "mario.mp4"       ✅ correto
   video: "C:/videos/mario.mp4"   ❌ errado
   video: "videos/mario.mp4"      ❌ errado

4. Os vídeos NÃO aparecem sozinhos. Você precisa
   registrar cada um no data.js com título, poster, etc.
   Leia os comentários dentro do data.js — tem exemplos
   de como copiar e colar para adicionar mais.


─────────────────────────────────────────────────
  TESTAR NO PC (antes de subir para internet)
─────────────────────────────────────────────────

  cd smartbox/backend
  node server.js

  Abra o navegador em: http://localhost:3000
  Se aparecer o login, está funcionando!

  Para parar o servidor: Ctrl+C no terminal


╔════════════════════════════════════════════════╗
║  PARTE 2 — ÍCONES DO APP (PWA)                ║
╚════════════════════════════════════════════════╝

Os ícones aparecem na tela do celular quando o
usuário instala o SmartBox como app.

NÃO PRECISA DE CÓDIGO — é só uma imagem PNG.

COMO CRIAR (usando Canva, gratuito):
  1. Acesse https://canva.com e crie conta
  2. Clique "Criar design" → "Dimensões personalizadas"
  3. Largura: 512  Altura: 512  Unidade: px → "Criar"
  4. Fundo vermelho #e50914
  5. Adicione texto "SB" ou "SMARTBOX" em branco
  6. Baixe: clique "Compartilhar" → "Baixar" → PNG
  7. Esse arquivo = icon-512.png
  8. Clique "Redimensionar" → 192x192 → Baixar
  9. Esse arquivo = icon-192.png

ONDE COLOCAR:
  smartbox/frontend/pwa/icon-192.png
  smartbox/frontend/pwa/icon-512.png

SOBRE O LINK NO HTML:
  Já está no código! Essa linha em cada .html
  já aponta para o ícone:
    <link rel="apple-touch-icon" href="pwa/icon-192.png">
  Você não precisa fazer mais nada além de
  criar e colocar os arquivos no lugar certo.


╔════════════════════════════════════════════════╗
║  PARTE 3 — PASSO 4: RAILWAY (backend + banco) ║
╚════════════════════════════════════════════════╝

─────────────────────────────────────────────────
  4.1 Criar conta e projeto
─────────────────────────────────────────────────

  1. Acesse https://railway.app
  2. Clique "Login" → "Login with GitHub"
     (Se não tiver GitHub, crie em github.com primeiro)
  3. Autorize o Railway
  4. Clique "New Project"
  5. Clique "+ Add Service" → "Database" → "PostgreSQL"
     → O banco é criado na hora!


─────────────────────────────────────────────────
  4.2 Pegar a DATABASE_URL
─────────────────────────────────────────────────

  1. No projeto Railway, clique no serviço "PostgreSQL"
  2. Clique na aba "Connect"
  3. Procure "Postgres Connection URL"
  4. Clique no ícone de copiar
  5. Vai ser algo assim:
     postgresql://postgres:AbC123@monorail.proxy.rlwy.net:12345/railway


─────────────────────────────────────────────────
  PASSO 5: CRIAR AS TABELAS (schema.sql)
─────────────────────────────────────────────────

Opção A — Pelo site do Railway (mais fácil):
  1. Clique no PostgreSQL → aba "Query"
  2. Abra o arquivo: smartbox/backend/db/schema.sql
     no Bloco de Notas (Windows) ou TextEdit (Mac)
  3. Selecione TODO o texto (Ctrl+A) e copie (Ctrl+C)
  4. Cole no campo de Query do Railway
  5. Clique "Run Query"
  6. Deve aparecer "CREATE TABLE" em verde = sucesso!

Opção B — Pelo terminal (se tiver psql instalado):
  psql "sua-connection-string-aqui" -f backend/db/schema.sql


─────────────────────────────────────────────────
  PASSO 6: PREENCHER O .env
─────────────────────────────────────────────────

  1. Dentro de smartbox/backend/, copie o arquivo
     .env.example e renomeie para .env
     (no Windows: copie e renomeie normalmente)

  2. Abra o .env com o Bloco de Notas

  3. Preencha cada campo:

  DATABASE_URL=postgresql://postgres:AbC123@monorail...
  → Cole a URL que você copiou no passo 4.2

  JWT_SECRET=aqui-vai-um-texto-aleatorio-longo
  → Abra o terminal e rode:
       node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  → Vai aparecer um texto longo. Copie e cole aqui.

  NODE_ENV=development
  → Deixe assim para testes no PC
  → Mude para "production" quando subir pro Railway

  PORT=3000
  → Deixe assim

  FRONTEND_URL=http://localhost:3000
  → Deixe assim para testes
  → Mude para https://seudominio.com.br depois

  BASE_URL=http://localhost:3000
  → Deixe assim para testes

  B2_PUBLIC_URL=https://videos.seudominio.com.br
  → Preencha depois de criar o Backblaze (passo 7)
  → Por enquanto pode deixar vazio

  4. Salve o arquivo .env


─────────────────────────────────────────────────
  PASSO 7: BACKBLAZE B2 (onde ficam os vídeos)
─────────────────────────────────────────────────

  7.1 Criar conta
    1. Acesse https://backblaze.com
    2. Clique "Sign Up for B2 Cloud Storage"
    3. Preencha e-mail e senha → confirme o e-mail

  7.2 Criar o bucket (pasta na nuvem)
    1. No painel, clique "B2 Cloud Storage" no menu
    2. Clique "Create a Bucket"
    3. Bucket Name: smartbox-videos
       (nome único — se der erro, tente smartbox-videos-2025)
    4. Files in Bucket: Public  ← MUITO IMPORTANTE
    5. Clique "Create a Bucket"

  7.3 Pegar as chaves de acesso
    1. No menu esquerdo, clique "App Keys"
    2. Clique "Add a New Application Key"
    3. Name of Key: smartbox-upload
    4. Allow access to Bucket(s): smartbox-videos
    5. Type of Access: Read and Write
    6. Clique "Create New Key"
    7. ANOTE os dois valores que aparecem:
         keyID:          xxxxxxxxxxxx   → é o B2_APPLICATION_KEY_ID
         applicationKey: xxxxxxxxxxxx   → é o B2_APPLICATION_KEY
       ⚠️ Eles aparecem UMA ÚNICA VEZ. Salve em algum lugar!

  7.4 Preencher o .env com os dados do B2
    Abra o .env e adicione:

    B2_APPLICATION_KEY_ID=o-keyID-que-você-anotou
    B2_APPLICATION_KEY=a-applicationKey-que-você-anotou
    B2_BUCKET_NAME=smartbox-videos
    B2_PUBLIC_URL=https://f005.backblazeb2.com/file/smartbox-videos
    (a URL exata aparece nas configs do bucket — aba "Endpoint")

  7.5 Subir vídeos pelo site do B2 (mais fácil no início)
    1. Clique no bucket "smartbox-videos"
    2. Clique "Upload/Download"
    3. Clique "Upload Files"
    4. Selecione seus .mp4 e espere o upload terminar
    5. Após subir, clique no arquivo → "File Information"
    6. Copie a "Friendly URL" — exemplo:
       https://f005.backblazeb2.com/file/smartbox-videos/mario.mp4
    7. Cole essa URL no campo "video" do data.js:
       video: "https://f005.backblazeb2.com/file/smartbox-videos/mario.mp4"

  7.6 Subir vídeos em lote pelo terminal (para muitos arquivos)
    cd smartbox/docs
    npm install @aws-sdk/client-s3 dotenv
    node upload-videos.js C:/caminho/para/sua/pasta/de/videos
    → O script envia todos os .mp4 e imprime as URLs no final


╔════════════════════════════════════════════════╗
║  PARTE 4 — PASSO 9: DOMÍNIO                   ║
╚════════════════════════════════════════════════╝

─────────────────────────────────────────────────
  Registrar em registro.br (.com.br)
─────────────────────────────────────────────────

  1. Acesse https://registro.br
  2. Na caixa de busca, pesquise o nome que quer
     Ex: smartbox → vai verificar se "smartbox.com.br" está livre
  3. Se estiver disponível, clique "Registrar"
  4. Crie uma conta (CPF obrigatório para .com.br)
  5. Finalize o pagamento (~R$40/ano)
  6. Acesse "Painel" → clique no domínio que comprou
  7. Guarde o acesso — você vai precisar no próximo passo

─────────────────────────────────────────────────
  Registrar em Namecheap (.com, mais barato)
─────────────────────────────────────────────────

  1. Acesse https://namecheap.com
  2. Pesquise o domínio → compre (~$12/ano)
  3. Painel → "Domain List" → clique no domínio
  4. "Nameservers" → você vai mudar isso no próximo passo


╔════════════════════════════════════════════════╗
║  PARTE 5 — PASSO 10: CLOUDFLARE               ║
╚════════════════════════════════════════════════╝

  O Cloudflare é grátis e faz 3 coisas importantes:
  1. Serve seus vídeos do B2 SEM cobrar banda de saída
  2. Deixa o site mais rápido (CDN global)
  3. Protege contra ataques

  1. Acesse https://cloudflare.com → crie conta grátis
  2. Clique "Add a Site"
  3. Digite seu domínio: smartbox.com.br → Continue
  4. Escolha plano "Free" → Continue
  5. Cloudflare mostra seus nameservers atuais
     e os nameservers novos (do Cloudflare)
     Ex: ada.ns.cloudflare.com
         bob.ns.cloudflare.com
  6. Vá no painel do registro.br/Namecheap
  7. Encontre a opção "Nameservers" ou "DNS"
  8. Troque pelos nameservers do Cloudflare
  9. Volte ao Cloudflare e clique "Done"
  10. Aguarde até 24h (geralmente 30 minutos)

  Após propagar, configure os registros DNS no Cloudflare:

  → Para os vídeos do B2 ficarem em videos.seudominio.com.br:
    Type: CNAME
    Name: videos
    Target: f005.backblazeb2.com   ← copie o endpoint exato do B2
    Proxy:  Ligado (nuvem laranja) ← IMPORTANTE para gratuito


╔════════════════════════════════════════════════╗
║  PARTE 6 — PASSO 11: VERCEL (frontend)        ║
╚════════════════════════════════════════════════╝

  1. Crie conta em https://github.com (se não tiver)
  2. Crie um repositório novo no GitHub:
     → Clique no "+" → "New repository"
     → Nome: smartbox
     → Public ou Private → "Create repository"
  3. No terminal, dentro da pasta smartbox/:
       git init
       git add .
       git commit -m "primeiro commit"
       git branch -M main
       git remote add origin https://github.com/SEUUSUARIO/smartbox.git
       git push -u origin main
  4. Acesse https://vercel.com → login com GitHub
  5. Clique "Add New Project"
  6. Escolha o repositório "smartbox"
  7. Configure:
       Root Directory: frontend    ← MUITO IMPORTANTE
       Framework: Other
  8. Clique "Deploy"
  9. Em poucos minutos o site vai estar em:
     https://smartbox-xxxx.vercel.app
  10. Para usar seu domínio:
      Settings → Domains → Add: smartbox.com.br
      No Cloudflare, DNS:
      Type: CNAME | Name: @ | Target: cname.vercel-dns.com | Proxy: OFF
      Type: CNAME | Name: www | Target: cname.vercel-dns.com | Proxy: OFF


╔════════════════════════════════════════════════╗
║  PARTE 7 — PASSO 12: RAILWAY (deploy backend) ║
╚════════════════════════════════════════════════╝

  1. No Railway, no seu projeto (onde criou o PostgreSQL)
  2. Clique "+ Add Service" → "GitHub Repo"
  3. Selecione o repositório "smartbox"
  4. Configure:
       Root Directory: backend    ← MUITO IMPORTANTE
  5. Clique em "Variables" no serviço Node.js
  6. Adicione TODAS as variáveis do seu .env:
       NODE_ENV          = production
       JWT_SECRET        = (o texto longo que você gerou)
       FRONTEND_URL      = https://smartbox.com.br
       BASE_URL          = https://api.smartbox.com.br
       B2_APPLICATION_KEY_ID  = (do B2)
       B2_APPLICATION_KEY     = (do B2)
       B2_BUCKET_NAME         = smartbox-videos
       B2_PUBLIC_URL          = https://videos.smartbox.com.br
       DATABASE_URL      = (Railway preenche automático do PostgreSQL)
  7. Railway faz o deploy automático!
  8. Clique em "Settings" → "Domains" → "Generate Domain"
     Vai aparecer algo como: smartbox-backend.up.railway.app
  9. Para domínio personalizado (api.seudominio.com.br):
     Settings → Domains → Add Custom Domain:
     api.smartbox.com.br
     No Cloudflare:
     Type: CNAME | Name: api | Target: smartbox-backend.up.railway.app | Proxy: OFF

  10. IMPORTANTE: após o deploy, atualize o script.js:
      Abra frontend/script.js e na linha:
        const API = "";
      Mude para:
        const API = "https://api.smartbox.com.br";
      Depois faça git push e o Vercel atualiza sozinho!


╔════════════════════════════════════════════════╗
║  RESUMO FINAL — ORDEM CERTA DE FAZER TUDO     ║
╚════════════════════════════════════════════════╝

  [PC]      1. Instalar Node.js e Git
  [PC]      2. Descompactar o ZIP do projeto
  [PC]      3. Criar pasta videos/ e colocar os .mp4
  [PC]      4. Rodar: cd backend && npm install
  [PC]      5. Testar local: node server.js → abrir localhost:3000
  [Canva]   6. Criar icon-192.png e icon-512.png
  [PC]      7. Colocar os ícones em frontend/pwa/
  [Railway] 8. Criar conta + PostgreSQL
  [Railway] 9. Rodar o schema.sql pelo painel Query
  [PC]      10. Preencher o .env com DATABASE_URL e JWT_SECRET
  [B2]      11. Criar conta + bucket smartbox-videos
  [B2]      12. Subir vídeos + anotar as URLs
  [PC]      13. Atualizar video: no data.js com as URLs do B2
  [GitHub]  14. Criar repositório e fazer git push
  [Vercel]  15. Deploy do frontend
  [Railway] 16. Deploy do backend com as variáveis de ambiente
  [Domínio] 17. Comprar domínio (registro.br ou Namecheap)
  [CF]      18. Configurar Cloudflare + DNS
  [PC]      19. Atualizar const API no script.js + git push
  [Teste]   20. Abrir o site, cadastrar, testar vídeo, instalar PWA no celular

  Qualquer erro em qualquer passo: copie a mensagem de erro
  e pergunte — fica muito mais fácil de resolver assim!
