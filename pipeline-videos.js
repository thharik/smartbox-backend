const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const BASE = "E:\\tvxbox-pipeline";
const ENTRADA = path.join(BASE, "entrada");
const PRONTOS = path.join(BASE, "prontos");
const LOGS = path.join(BASE, "logs");
const HTML_TESTE = path.join(BASE, "teste-videos.html");

const EXTENSOES = [".mp4", ".mkv", ".avi", ".mov", ".webm"];

function garantirPastas() {
  for (const pasta of [ENTRADA, PRONTOS, LOGS]) {
    if (!fs.existsSync(pasta)) {
      fs.mkdirSync(pasta, { recursive: true });
    }
  }
}

function nomeSemExtensao(nome) {
  return path.basename(nome, path.extname(nome));
}

function limparNomeArquivo(nome) {
  return nome
    .normalize("NFC")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function existeComando(cmd) {
  const teste = spawnSync(cmd, ["-version"], { encoding: "utf8" });
  return !teste.error;
}

function converterVideo(arquivo) {
  const entrada = path.join(ENTRADA, arquivo);

  const nomeBase = limparNomeArquivo(nomeSemExtensao(arquivo));
  const saida = path.join(PRONTOS, `${nomeBase}.mp4`);

  if (fs.existsSync(saida)) {
    console.log(`⏭️ Já convertido, pulando: ${nomeBase}.mp4`);
    return {
      arquivoOriginal: arquivo,
      arquivoPronto: `${nomeBase}.mp4`,
      status: "ja_existia",
    };
  }

  console.log("");
  console.log(`🎬 Convertendo: ${arquivo}`);
  console.log(`➡️ Saída: ${nomeBase}.mp4`);

  const args = [
    "-y",
    "-i", entrada,

    // Pega o primeiro vídeo e o primeiro áudio, se existir.
    "-map", "0:v:0",
    "-map", "0:a:0?",

    // Vídeo compatível com navegador.
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "22",
    "-pix_fmt", "yuv420p",

    // Áudio compatível com navegador.
    "-c:a", "aac",
    "-b:a", "192k",
    "-ac", "2",

    // Deixa o MP4 iniciar mais rápido no navegador.
    "-movflags", "+faststart",

    saida,
  ];

  const result = spawnSync("ffmpeg", args, {
    stdio: "inherit",
    encoding: "utf8",
  });

  if (result.status !== 0) {
    console.log(`❌ Erro ao converter: ${arquivo}`);
    return {
      arquivoOriginal: arquivo,
      arquivoPronto: null,
      status: "erro",
    };
  }

  console.log(`✅ Convertido: ${nomeBase}.mp4`);

  return {
    arquivoOriginal: arquivo,
    arquivoPronto: `${nomeBase}.mp4`,
    status: "convertido",
  };
}

function gerarHtmlTeste(arquivosProntos) {
  const cards = arquivosProntos
    .filter(item => item.arquivoPronto)
    .map(item => {
      const nome = item.arquivoPronto;

      return `
        <section class="card">
          <h2>${nome}</h2>

          <video controls preload="metadata" src="./prontos/${nome}"></video>

          <div class="botoes">
            <button onclick="marcar('${nome}', 'ok')">✅ Áudio OK</button>
            <button onclick="marcar('${nome}', 'erro')">❌ Sem áudio / problema</button>
          </div>

          <p id="status-${nome}" class="status">Aguardando teste...</p>
        </section>
      `;
    })
    .join("\n");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Teste de Vídeos TVXBOX</title>
  <style>
    body {
      margin: 0;
      padding: 30px;
      background: #111;
      color: #fff;
      font-family: Arial, sans-serif;
    }

    h1 {
      margin-bottom: 10px;
    }

    .aviso {
      background: #242424;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 25px;
      line-height: 1.5;
    }

    .card {
      background: #1b1b1b;
      padding: 20px;
      margin-bottom: 25px;
      border-radius: 12px;
      border: 1px solid #333;
    }

    video {
      width: 100%;
      max-width: 900px;
      background: #000;
      border-radius: 10px;
      display: block;
      margin-top: 10px;
    }

    button {
      margin-top: 12px;
      margin-right: 10px;
      padding: 10px 14px;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
    }

    .status {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Área de teste de vídeos — TVXBOX</h1>

  <div class="aviso">
    Abra esta página no Chrome ou Edge e teste cada vídeo antes de subir para o B2.
    Se o áudio funcionar aqui, a chance de funcionar no navegador do site é muito maior.
  </div>

  ${cards}

  <script>
    function marcar(nome, tipo) {
      const el = document.getElementById("status-" + nome);

      if (tipo === "ok") {
        el.textContent = "✅ Testado: áudio funcionando";
        el.style.color = "#74ff74";
      } else {
        el.textContent = "❌ Problema detectado: revisar este vídeo";
        el.style.color = "#ff7676";
      }
    }
  </script>
</body>
</html>
`;

  fs.writeFileSync(HTML_TESTE, html, "utf8");
  console.log("");
  console.log("🧪 Página de teste criada:");
  console.log(HTML_TESTE);
}

function main() {
  garantirPastas();

  if (!existeComando("ffmpeg")) {
    console.log("❌ FFmpeg não encontrado no PATH.");
    console.log("Teste no PowerShell: ffmpeg -version");
    return;
  }

  const arquivos = fs
    .readdirSync(ENTRADA)
    .filter(arquivo => {
      const ext = path.extname(arquivo).toLowerCase();
      return EXTENSOES.includes(ext);
    });

  if (arquivos.length === 0) {
    console.log("⚠️ Nenhum vídeo encontrado em:");
    console.log(ENTRADA);
    return;
  }

  console.log(`📁 Vídeos encontrados: ${arquivos.length}`);

  const resultado = [];

  for (const arquivo of arquivos) {
    resultado.push(converterVideo(arquivo));
  }

  const logPath = path.join(LOGS, `resultado-${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(resultado, null, 2), "utf8");

  gerarHtmlTeste(resultado);

  console.log("");
  console.log("🎉 Processo finalizado.");
  console.log("Agora abra o arquivo abaixo no navegador:");
  console.log(HTML_TESTE);
}

main();