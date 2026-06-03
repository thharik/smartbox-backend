// backend/routes/video.js — versão ATUALIZADA
// Adicionada rota GET /video/rom/:fileName para servir ROMs do B2

const express = require("express");
const B2      = require("backblaze-b2");
const router  = express.Router();

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey:   process.env.B2_APPLICATION_KEY,
});

let autorizado  = false;
let downloadUrl = "";

async function autorizarB2() {
  if (!autorizado) {
    const resp = await b2.authorize();
    autorizado   = true;
    downloadUrl  = resp.data.downloadUrl;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
async function getTamanhoArquivo(bucketName, fileName) {
  try {
    const info = await b2.downloadFileByName({
      bucketName, fileName,
      responseType: "stream",
      axiosOverride: { headers: { Range: "bytes=0-0" } },
    });
    return parseInt(info.headers["content-range"]?.split("/")[1] || "0", 10);
  } catch { return 0; }
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
      response.data.pipe(res);
    } else {
      const response = await b2.downloadFileByName({ bucketName, fileName: fn, responseType: "stream" });
      const headers = { "Content-Type": response.headers["content-type"] || "video/mp4", "Accept-Ranges": "bytes" };
      if (contentLength > 0) headers["Content-Length"] = contentLength;
      res.writeHead(200, headers);
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
      response.data.pipe(res);
    } else {
      const response = await b2.downloadFileByName({ bucketName, fileName, responseType: "stream" });
      res.setHeader("Content-Type",               contentType);
      res.setHeader("Accept-Ranges",              "bytes");
      res.setHeader("Access-Control-Allow-Origin","*");
      const cl = response.headers["content-length"];
      if (cl) res.setHeader("Content-Length", cl);
      response.data.pipe(res);
    }
  } catch (error) {
    if (error?.response?.status === 401) autorizado = false;
    console.error("Erro ROM B2:", error?.response?.data || error.message || error);
    if (!res.headersSent) res.status(500).json({ mensagem: "Erro ao carregar ROM" });
  }
});

module.exports = router;
