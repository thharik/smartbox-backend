// backend/routes/jogos.js
// Rota para servir ROMs do Backblaze B2
// Adicione ao server.js: app.use("/video", require("./backend/routes/video"));
// (já existente — a rota /rom/:fileName é nova dentro do video.js)
// OU registre separado com: app.use("/jogos", require("./backend/routes/jogos"));

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
    console.log("ID =", process.env.B2_APPLICATION_KEY_ID);
    console.log("KEY EXISTE =", !!process.env.B2_APPLICATION_KEY);
    console.log("BUCKET =", process.env.B2_BUCKET_NAME);
    
    const resp = await b2.authorize();
    autorizado   = true;
    downloadUrl  = resp.data.downloadUrl;
  }
}

// GET /video/rom/:fileName
// Serve ROMs do B2 para o EmulatorJS
// Suporta Range requests (necessário para arquivos grandes)
router.get("/rom/:fileName(*)", async (req, res) => {
  try {
    await autorizarB2();

    const fileName   = req.params.fileName;   // ex: "King of Fighters 2002.7z"
    const bucketName = process.env.B2_BUCKET_NAME;
    const rangeHeader = req.headers["range"];

    // Extensão → Content-Type
    const ext = fileName.split(".").pop().toLowerCase();
    const mimeMap = {
      "7z":  "application/x-7z-compressed",
      "zip": "application/zip",
      "nes": "application/octet-stream",
      "smc": "application/octet-stream",
      "sfc": "application/octet-stream",
      "gba": "application/octet-stream",
      "gb":  "application/octet-stream",
      "gbc": "application/octet-stream",
      "n64": "application/octet-stream",
      "z64": "application/octet-stream",
      "iso": "application/octet-stream",
    };
    const contentType = mimeMap[ext] || "application/octet-stream";

    if (rangeHeader) {
      // Primeiro busca tamanho total
      let totalSize = 0;
      try {
        const info = await b2.downloadFileByName({
          bucketName,
          fileName,
          responseType: "stream",
          axiosOverride: { headers: { Range: "bytes=0-0" } },
        });
        totalSize = parseInt(info.headers["content-range"]?.split("/")[1] || "0", 10);
      } catch { totalSize = 0; }

      const parts  = rangeHeader.replace(/bytes=/, "").split("-");
      const start  = parseInt(parts[0], 10);
      const end    = parts[1] ? parseInt(parts[1], 10) : (totalSize ? totalSize - 1 : start + 1048576);
      const chunkSize = end - start + 1;

      const response = await b2.downloadFileByName({
        bucketName,
        fileName,
        responseType: "stream",
        axiosOverride: { headers: { Range: `bytes=${start}-${end}` } },
      });

      res.writeHead(206, {
        "Content-Range":              `bytes ${start}-${end}/${totalSize || "*"}`,
        "Accept-Ranges":              "bytes",
        "Content-Length":             chunkSize,
        "Content-Type":               contentType,
        "Access-Control-Allow-Origin":"*",
      });
      response.data.pipe(res);

    } else {
      // Arquivo completo
      const response = await b2.downloadFileByName({
        bucketName,
        fileName,
        responseType: "stream",
      });

      res.setHeader("Content-Type",               contentType);
      res.setHeader("Accept-Ranges",              "bytes");
      res.setHeader("Access-Control-Allow-Origin","*");
      const cl = response.headers["content-length"];
      if (cl) res.setHeader("Content-Length", cl);

      response.data.pipe(res);
    }

  } catch (error) {
    if (error?.response?.status === 401) autorizado = false;
    console.error("Erro ao buscar ROM no B2:", error?.response?.data || error.message || error);
    if (!res.headersSent) {
      res.status(500).json({ mensagem: "Erro ao carregar ROM" });
    }
  }
});

module.exports = router;
