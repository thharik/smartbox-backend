const express = require("express");
const B2 = require("backblaze-b2");

const router = express.Router();

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY
});

let autorizado = false;

async function autorizarB2() {
  if (!autorizado) {
    await b2.authorize();
    autorizado = true;
  }
}

router.get("/:fileName", async (req, res) => {
  try {
    await autorizarB2();

    const fileName = req.params.fileName;
    const bucketName = process.env.B2_BUCKET_NAME;

    const response = await b2.downloadFileByName({
      bucketName,
      fileName,
      responseType: "stream"
    });

    res.setHeader("Content-Type", response.headers["content-type"] || "video/mp4");
    res.setHeader("Accept-Ranges", "bytes");

    response.data.pipe(res);
  } catch (error) {
    console.error("Erro ao buscar vídeo no B2:", error?.response?.data || error.message || error);
    res.status(500).json({ mensagem: "Erro ao carregar vídeo" });
  }
});

module.exports = router;