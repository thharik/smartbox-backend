const router = require("express").Router();
const fs     = require("fs");
const path   = require("path");
const pool   = require("../db/pool");
const { perfilMiddleware } = require("../middleware/auth");

// Retorna URL do vídeo (B2/local)
router.get("/:episodioId/url", perfilMiddleware, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT video_url FROM episodios WHERE id=$1", [req.params.episodioId]
  );
  if (!rows.length || !rows[0].video_url)
    return res.status(404).json({ mensagem: "Vídeo não encontrado" });

  const url = rows[0].video_url;
  // URL já é externa (B2 / Cloudflare) — retorna direto
  if (url.startsWith("http")) return res.json({ url });

  // Arquivo local (desenvolvimento)
  const base = process.env.BASE_URL || `http://localhost:${process.env.PORT||3000}`;
  res.json({ url: `${base}/video/stream/${url}` });
});

// Serve arquivo local com suporte a Range (seek no player)
router.get("/stream/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../../videos", req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).end();

  const stat     = fs.statSync(filePath);
  const fileSize = stat.size;
  const range    = req.headers.range;

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end   = endStr ? parseInt(endStr, 10) : fileSize - 1;
    res.writeHead(206, {
      "Content-Range":  `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges":  "bytes",
      "Content-Length": end - start + 1,
      "Content-Type":   "video/mp4",
    });
    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "Content-Length": fileSize, "Content-Type": "video/mp4" });
    fs.createReadStream(filePath).pipe(res);
  }
});

module.exports = router;
