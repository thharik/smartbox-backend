const express = require("express");
const router = express.Router();

const canais = [
  {
    id: "canal1",
    nome: "TV Escola",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/TV_Escola_logo.svg/512px-TV_Escola_logo.svg.png",
    categoria: "Educação",
    stream_url: "COLOQUE_AQUI_O_LINK_DO_CANAL.m3u8"
  },
  {
    id: "canal2",
    nome: "Canal Câmara",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/TV_C%C3%A2mara_logo.svg/512px-TV_C%C3%A2mara_logo.svg.png",
    categoria: "Notícias",
    stream_url: "COLOQUE_AQUI_OUTRO_LINK.m3u8"
  }
];

router.get("/", (req, res) => {
  res.json(canais);
});

module.exports = router;