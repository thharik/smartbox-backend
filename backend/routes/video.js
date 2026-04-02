const express = require("express");
const B2      = require("backblaze-b2");

const router = express.Router();

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey:   process.env.B2_APPLICATION_KEY,
});

let autorizado    = false;
let downloadUrl   = "";

async function autorizarB2() {
  if (!autorizado) {
    const resp = await b2.authorize();
    autorizado  = true;
    downloadUrl = resp.data.downloadUrl;
  }
}

// GET /video/:fileName
// Suporta Range requests (necessário para o player HTML5 funcionar corretamente
// e para a tela cheia / seek funcionarem sem travar)
router.get("/:fileName", async (req, res) => {
  try {
    await autorizarB2();

    const fileName  = req.params.fileName;
    const bucketName = process.env.B2_BUCKET_NAME;
    const rangeHeader = req.headers["range"];

    // Busca informações do arquivo primeiro (tamanho)
    let fileInfo;
    try {
      fileInfo = await b2.downloadFileByName({
        bucketName,
        fileName,
        responseType: "stream",
        axiosOverride: {
          headers: { Range: "bytes=0-0" }, // só para pegar o tamanho
        },
      });
    } catch {
      // Se falhar a verificação, tenta sem range
      fileInfo = null;
    }

    const contentLength = fileInfo
      ? parseInt(fileInfo.headers["content-range"]?.split("/")[1] || "0", 10)
      : 0;

    if (rangeHeader && contentLength > 0) {
      // ── Resposta parcial (Range request) ─────────────────────────────────
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end   = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
      const chunkSize = end - start + 1;

      const response = await b2.downloadFileByName({
        bucketName,
        fileName,
        responseType: "stream",
        axiosOverride: {
          headers: { Range: `bytes=${start}-${end}` },
        },
      });

      res.writeHead(206, {
        "Content-Range":  `bytes ${start}-${end}/${contentLength}`,
        "Accept-Ranges":  "bytes",
        "Content-Length": chunkSize,
        "Content-Type":   response.headers["content-type"] || "video/mp4",
      });
      response.data.pipe(res);
    } else {
      // ── Resposta completa ─────────────────────────────────────────────────
      const response = await b2.downloadFileByName({
        bucketName,
        fileName,
        responseType: "stream",
      });

      const headers = {
        "Content-Type":  response.headers["content-type"] || "video/mp4",
        "Accept-Ranges": "bytes",
      };
      if (contentLength > 0) headers["Content-Length"] = contentLength;

      res.writeHead(200, headers);
      response.data.pipe(res);
    }
  } catch (error) {
    // Token B2 expirado — força reautorização na próxima chamada
    if (error?.response?.status === 401) autorizado = false;

    console.error(
      "Erro ao buscar vídeo no B2:",
      error?.response?.data || error.message || error
    );
    if (!res.headersSent) {
      res.status(500).json({ mensagem: "Erro ao carregar vídeo" });
    }
  }
});

// GET /video/pdf/:fileName — serve PDFs (mangás) do B2
router.get("/pdf/:fileName", async (req, res) => {
  try {
    await autorizarB2();

    const response = await b2.downloadFileByName({
      bucketName:   process.env.B2_BUCKET_NAME,
      fileName:     req.params.fileName,
      responseType: "stream",
    });

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Accept-Ranges",       "bytes");
    response.data.pipe(res);
  } catch (error) {
    if (error?.response?.status === 401) autorizado = false;
    console.error("Erro ao buscar PDF no B2:", error?.response?.data || error.message);
    if (!res.headersSent) {
      res.status(500).json({ mensagem: "Erro ao carregar PDF" });
    }
  }
});

module.exports = router;
