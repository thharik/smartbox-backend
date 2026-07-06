// backend/routes/video.js — versão CORRIGIDA (estabilidade de streaming)
// Rotas: GET /video/:fileName, GET /video/pdf/:fileName, GET /video/rom/:fileName

const express = require("express");
const B2      = require("backblaze-b2");
const router  = express.Router();

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
  applicationKey:   process.env.B2_APPLICATION_KEY,
});

let autorizado  = false;
let downloadUrl = "";

async function autorizarB2() {
  if (!autorizado) {
    console.log("=================================");
    console.log("B2_APPLICATION_KEY_ID =", process.env.B2_APPLICATION_KEY_ID);
    console.log("B2_APPLICATION_KEY existe =", !!process.env.B2_APPLICATION_KEY);
    console.log("B2_BUCKET_NAME =", process.env.B2_BUCKET_NAME);
    console.log("=================================");

    const resp = await b2.authorize();

    autorizado = true;
    downloadUrl = resp.data.downloadUrl;
  }
}

// ── Cache de tamanho de arquivo ────────────────────────────────────────────────
// Evita bater no B2 duas vezes por chunk pedido (uma só pra descobrir o tamanho,
// outra pra baixar o range de verdade). Um player de vídeo faz DEZENAS de
// requisições Range por sessão (buffer, seek, troca de qualidade), então sem
// esse cache o servidor abre o dobro de conexões com o B2 do que precisa.
const cacheTamanhos = new Map(); // fileName -> tamanho em bytes

function destruirStreamAoDesconectar(res, streamB2) {
  const destruir = () => {
    if (streamB2 && !streamB2.destroyed) streamB2.destroy();
  };
  res.on("close", destruir);
  res.on("error", destruir);
}

// ── Helpers ────────────────────────────────────────────────────────────────────
async function getTamanhoArquivo(bucketName, fileName) {
  if (cacheTamanhos.has(fileName)) return cacheTamanhos.get(fileName);

  try {
    const info = await b2.downloadFileByName({
      bucketName, fileName,
      responseType: "stream",
      axiosOverride: { headers: { Range: "bytes=0-0" } },
    });

    // Esse stream só existe pra gente ler o header content-range.
    // Tem que ser destruído explicitamente, senão fica pendurado
    // consumindo memória/socket até o processo estourar.
    info.data.destroy();

    const tamanho = parseInt(info.headers["content-range"]?.split("/")[1] || "0", 10);
    cacheTamanhos.set(fileName, tamanho);
    return tamanho;
  } catch {
    return 0;
  }
}

// ── GET /video/:fileName — vídeos com Range Requests ──────────────────────────
router.get("/:fileName", async (req, res) => {
  // Evita que /video/pdf/ e /video/rom/ caiam aqui
  const fn = req.params.fileName;
  if (fn === "pdf" || fn === "rom") return res.status(400).json({ mensagem: "Use /video/pdf/:nome ou /video/rom/:nome" });

  try {
    await autorizarB2();
    const bucketName  = process.env.B2_BUCKET_NAME;
    const rangeHeader = req.headers["range"];
    const contentLength = await getTamanhoArquivo(bucketName, fn);

    if (rangeHeader && contentLength > 0) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end   = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
      const chunkSize = end - start + 1;

      const response = await b2.downloadFileByName({
        bucketName, fileName: fn, responseType: "stream",
        axiosOverride: { headers: { Range: `bytes=${start}-${end}` } },
      });

      res.writeHead(206, {
        "Content-Range":  `bytes ${start}-${end}/${contentLength}`,
        "Accept-Ranges":  "bytes",
        "Content-Length": chunkSize,
        "Content-Type":   response.headers["content-type"] || "video/mp4",
      });

      destruirStreamAoDesconectar(res, response.data);
      response.data.pipe(res);
    } else {
      const response = await b2.downloadFileByName({ bucketName, fileName: fn, responseType: "stream" });
      const headers = { "Content-Type": response.headers["content-type"] || "video/mp4", "Accept-Ranges": "bytes" };
      if (contentLength > 0) headers["Content-Length"] = contentLength;
      res.writeHead(200, headers);

      destruirStreamAoDesconectar(res, response.data);
      response.data.pipe(res);
    }
  } catch (error) {
    if (error?.response?.status === 401) autorizado = false;
    console.error("Erro vídeo B2:", error?.response?.data || error.message || error);
    if (!res.headersSent) res.status(500).json({ mensagem: "Erro ao carregar vídeo" });
  }
});

// ── GET /video/pdf/:fileName — PDFs (mangás) ──────────────────────────────────
router.get("/pdf/:fileName", async (req, res) => {
  try {
    await autorizarB2();
    const response = await b2.downloadFileByName({
      bucketName: process.env.B2_BUCKET_NAME,
      fileName:   req.params.fileName,
      responseType: "stream",
    });
    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Accept-Ranges",       "bytes");

    destruirStreamAoDesconectar(res, response.data);
    response.data.pipe(res);
  } catch (error) {
    if (error?.response?.status === 401) autorizado = false;
    console.error("Erro PDF B2:", error?.response?.data || error.message);
    if (!res.headersSent) res.status(500).json({ mensagem: "Erro ao carregar PDF" });
  }
});

// ── GET /video/rom/:fileName — ROMs para emulador ─────────────────────────────
// Suporta arquivos .7z, .zip, .nes, .gba, etc.
// O EmulatorJS chama esta URL para baixar a ROM
router.get("/rom/:fileName(*)", async (req, res) => {
  try {
    await autorizarB2();
    const fileName   = req.params.fileName;  // ex: "King of Fighters 2002.7z"
    const bucketName = process.env.B2_BUCKET_NAME;
    const rangeHeader = req.headers["range"];

    const extMap = { "7z":"application/x-7z-compressed", "zip":"application/zip" };
    const ext    = fileName.split(".").pop().toLowerCase();
    const contentType = extMap[ext] || "application/octet-stream";

    if (rangeHeader) {
      const totalSize = await getTamanhoArquivo(bucketName, fileName);
      const parts     = rangeHeader.replace(/bytes=/, "").split("-");
      const start     = parseInt(parts[0], 10);
      const end       = parts[1] ? parseInt(parts[1], 10) : (totalSize ? totalSize - 1 : start + 1048576);

      const response = await b2.downloadFileByName({
        bucketName, fileName, responseType: "stream",
        axiosOverride: { headers: { Range: `bytes=${start}-${end}` } },
      });

      res.writeHead(206, {
        "Content-Range":               `bytes ${start}-${end}/${totalSize || "*"}`,
        "Accept-Ranges":               "bytes",
        "Content-Length":              end - start + 1,
        "Content-Type":                contentType,
        "Access-Control-Allow-Origin": "*",
      });

      destruirStreamAoDesconectar(res, response.data);
      response.data.pipe(res);
    } else {
      const response = await b2.downloadFileByName({ bucketName, fileName, responseType: "stream" });
      res.setHeader("Content-Type",               contentType);
      res.setHeader("Accept-Ranges",              "bytes");
      res.setHeader("Access-Control-Allow-Origin","*");
      const cl = response.headers["content-length"];
      if (cl) res.setHeader("Content-Length", cl);

      destruirStreamAoDesconectar(res, response.data);
      response.data.pipe(res);
    }
  } catch (error) {
    if (error?.response?.status === 401) autorizado = false;
    console.error("Erro ROM B2:", error?.response?.data || error.message || error);
    if (!res.headersSent) res.status(500).json({ mensagem: "Erro ao carregar ROM" });
  }
});

module.exports = router;