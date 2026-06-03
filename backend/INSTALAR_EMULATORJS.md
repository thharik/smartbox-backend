# Como instalar o EmulatorJS no Tvxbox

## O que é o EmulatorJS

É uma biblioteca open source que roda emuladores de arcade, SNES, NES,
GBA e outros diretamente no navegador. O `jogos.html` espera encontrá-la em:

  /emulatorjs/data/loader.js   (na raiz do seu frontend no Vercel)

---

## Passo 1 — Baixar o EmulatorJS

No terminal, dentro da pasta do **frontend**:

```bash
# Entra na pasta do frontend
cd frontend   # ou onde ficam seus .html

# Cria a pasta
mkdir -p emulatorjs

# Baixa o EmulatorJS
curl -L https://github.com/EmulatorJS/EmulatorJS/archive/refs/heads/main.zip -o ejs.zip
unzip ejs.zip
mv EmulatorJS-main emulatorjs/
rm ejs.zip
```

Estrutura esperada depois:
```
frontend/
├── emulatorjs/
│   └── data/
│       ├── loader.js          ← o script que jogos.html carrega
│       ├── cores/
│       │   └── mame/          ← core de arcade
│       └── ...
├── index.html
├── jogos.html
└── ...
```

---

## Passo 2 — Subir para o Vercel

```bash
cd frontend   # ou raiz do projeto

git add emulatorjs/
git commit -m "feat: adiciona EmulatorJS para jogos arcade"
git push
```

O Vercel redeploya automaticamente.

---

## Passo 3 — Testar

Acesse:
  https://tvxbox.com.br/emulatorjs/data/loader.js

Deve retornar código JS (não um 404).

Se retornar 404, verifique se a pasta `emulatorjs/` está na raiz do
projeto que você deployou no Vercel.

---

## Passo 4 — Verificar o backend (rota da ROM)

Após deployar o backend com o `video.js` atualizado, teste:

  https://tvxbox-backend-1.onrender.com/video/rom/King%20of%20Fighters%202002.7z

Deve começar a baixar o arquivo .7z (confirma que o B2 está servindo).

---

## Estrutura de arquivos para adicionar ao projeto

```
BACKEND (já feito — substituir):
└── backend/routes/video.js        ← versão nova com /rom/:fileName

FRONTEND (substituir/criar):
├── jogos.html                     ← página de jogos
└── emulatorjs/                    ← baixar conforme acima
    └── data/
        └── loader.js
```

Não é preciso mexer em `script.js` — a página `jogos.html` é independente.

---

## Adicionando mais jogos no futuro

No `jogos.html`, dentro do array `JOGOS_LISTA`, adicione:

```js
{
  id:      "metalsug3",
  titulo:  "Metal Slug 3",
  sistema: "arcade",
  core:    "arcade",
  poster:  "https://...imagem...",
  romFile: "Metal Slug 3.zip",   // nome EXATO do arquivo no B2
  descricao: "Ação e aventura"
},
```

Só precisa fazer upload do arquivo no B2 e adicionar a entrada acima.

---

## Cores suportados pelo EmulatorJS

| Sistema          | core          |
|------------------|---------------|
| Arcade (MAME)    | arcade        |
| NES / Famicom    | nes           |
| Super Nintendo   | snes          |
| Game Boy         | gb            |
| Game Boy Color   | gbc           |
| Game Boy Advance | gba           |
| Nintendo 64      | n64           |
| PlayStation 1    | psx           |
| Sega Genesis     | segaMD        |
| Sega Game Gear   | segaGG        |
| Neo Geo          | arcade        |

---

## Observações importantes

- O arquivo `King of Fighters 2002.7z` **já está no B2** e será servido
  via `/video/rom/King%20of%20Fighters%202002.7z` pelo backend.
- O EmulatorJS suporta `.7z` nativamente para arcade (MAME).
- O jogo exige "inserir moeda" antes de jogar: pressione **5** no teclado.
