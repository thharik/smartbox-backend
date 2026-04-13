const express = require("express");
const router  = express.Router();

// ── Canais Ao Vivo — Canais Brasileiros Abertos ───────────────────────────────
const canais = [

  // ── GERAL ──────────────────────────────────────────────────────────────────
  { id: "adesso-tv",       titulo: "Adesso TV",               tipo: "AoVivo", poster: "https://i.imgur.com/KgetM8j.png",  video: "https://cdn.jmvstream.com/w/LVW-9715/LVW9715_12B26T62tm/playlist.m3u8" },
  { id: "com-brasil",      titulo: "COM Brasil",              tipo: "AoVivo", poster: "https://i.imgur.com/GrjGwKM.png",  video: "https://br5093.streamingdevideo.com.br/abc/abc/playlist.m3u8" },
  { id: "conexao-tv",      titulo: "Conexão TV",              tipo: "AoVivo", poster: "https://i.imgur.com/CJ9SPsZ.png",  video: "https://5a57bda70564a.streamlock.net/conexaotv/conexaotv.sdp/playlist.m3u8" },
  { id: "eutv",            titulo: "EUTV",                    tipo: "AoVivo", poster: "https://i.imgur.com/8PxpamC.png",  video: "https://cdn.jmvstream.com/w/LVW-8719/LVW8719_AcLVAxWy5J/playlist.m3u8" },
  { id: "fala-litoral",    titulo: "Fala Litoral",            tipo: "AoVivo", poster: "https://i.imgur.com/NF6PL8O.png",  video: "https://5c483b9d1019c.streamlock.net/falalitoraltv/falalitoraltv/playlist.m3u8" },
  { id: "rbatv",           titulo: "RBATV",                   tipo: "AoVivo", poster: "https://i.imgur.com/ZWFxlU1.png",  video: "https://cdn.live.br1.jmvstream.com/w/LVW-15748/LVW15748_Yed7yzLuRC/playlist.m3u8" },
  { id: "sbt-interior",    titulo: "SBT Interior",            tipo: "AoVivo", poster: "https://i.imgur.com/IkZfa4j.png",  video: "https://cdn.jmvstream.com/w/LVW-10801/LVW10801_Xvg4R0u57n/playlist.m3u8" },
  { id: "sertao-tv",       titulo: "Sertão TV",               tipo: "AoVivo", poster: "https://i.imgur.com/b5xOCsC.png",  video: "http://wz4.dnip.com.br/sertaotv/sertaotv.sdp/playlist.m3u8" },
  { id: "tv-mais-marica",  titulo: "TV Mais Maricá",          tipo: "AoVivo", poster: "https://i.imgur.com/lgCRX7q.png",  video: "https://5cf4a2c2512a2.streamlock.net/tvmaismarica/tvmaismarica/playlist.m3u8" },
  { id: "tv-nbn",          titulo: "TVNBN",                   tipo: "AoVivo", poster: "https://i.imgur.com/zoHBxn1.png",  video: "https://cdn.jmvstream.com/w/LVW-8410/LVW8410_uiZOVm6vz1/playlist.m3u8" },
  { id: "tv-passo-fundo",  titulo: "TV Passo Fundo",          tipo: "AoVivo", poster: "https://i.imgur.com/QFE6TiV.png",  video: "https://5a57bda70564a.streamlock.net/tvpasso/tvpasso.sdp/playlist.m3u8" },
  { id: "tv-sul-minas",    titulo: "TV Sul de Minas",         tipo: "AoVivo", poster: "https://i.imgur.com/hPh8cxK.png",  video: "https://5cf4a2c2512a2.streamlock.net/tvsuldeminas/tvsuldeminas/playlist.m3u8" },
  { id: "tv-vila-real",    titulo: "TV Vila Real",            tipo: "AoVivo", poster: "https://i.imgur.com/Z1uWe7g.png",  video: "https://cdn.jmvstream.com/w/LVW-10841/LVW10841_mT77z9o2cP/playlist.m3u8" },
  { id: "tvcom-df",        titulo: "TVCOM DF",                tipo: "AoVivo", poster: "https://i.imgur.com/uxefHY3.png",  video: "https://5b7f3c45ab7c2.streamlock.net/8008/smil:8008.smil/playlist.m3u8?DVR=" },

  // ── NOTÍCIAS ───────────────────────────────────────────────────────────────
  { id: "canal-38",        titulo: "Canal 38",                tipo: "AoVivo", poster: "https://i.imgur.com/co7TCWC.png",  video: "https://cdn.jmvstream.com/w/LVW-8503/LVW8503_d0V5oduFlK/playlist.m3u8" },
  { id: "plena-tv",        titulo: "Plena TV",                tipo: "AoVivo", poster: "https://i.imgur.com/lH4RT7b.png",  video: "https://cdn.jmvstream.com/w/LVW-9591/LVW9591_PmXtgATnaS/playlist.m3u8" },
  { id: "stz-tv",          titulo: "STZ TV",                  tipo: "AoVivo", poster: "https://i.imgur.com/SeF2I7q.png",  video: "https://cdn.live.br1.jmvstream.com/webtv/AVJ-12952/playlist/playlist.m3u8" },
  { id: "tv-sim-cachoeiro",titulo: "TV Sim Cachoeiro",        tipo: "AoVivo", poster: "https://i.imgur.com/t5oUK3C.png",  video: "https://5cf4a2c2512a2.streamlock.net/8104/8104/playlist.m3u8" },
  { id: "tv-sim-colatina", titulo: "TV Sim Colatina",         tipo: "AoVivo", poster: "https://i.imgur.com/t5oUK3C.png",  video: "https://5cf4a2c2512a2.streamlock.net/8132/8132/playlist.m3u8" },
  { id: "tv-sim-sao-mateus",titulo: "TV Sim São Mateus",      tipo: "AoVivo", poster: "https://i.imgur.com/t5oUK3C.png",  video: "https://5cf4a2c2512a2.streamlock.net/8236/8236/playlist.m3u8" },
  { id: "tv-zoom",         titulo: "TV Zoom",                 tipo: "AoVivo", poster: "https://i.imgur.com/jCGrjf5.png",  video: "https://cdn.jmvstream.com/w/LVW-9730/LVW9730_LmUwslM8jt/playlist.m3u8" },

  // ── RELIGIOSO ──────────────────────────────────────────────────────────────
  { id: "despertar-tv",    titulo: "Despertar TV",            tipo: "AoVivo", poster: "https://res.cloudinary.com/dpkehkbpv/image/upload/v1721839192/logo/mixtv/despertar_tv_ieb2l3.png", video: "https://cdn.live.br1.jmvstream.com/webtv/pejexypz/playlist/playlist.m3u8" },
  { id: "fonte-tv",        titulo: "Fonte TV",                tipo: "AoVivo", poster: "https://i.imgur.com/7q2BmNc.png",  video: "http://flash.softhost.com.br:1935/fonte/fontetv/live.m3u8" },
  { id: "nova-era-tv",     titulo: "Nova Era TV",             tipo: "AoVivo", poster: "https://i.imgur.com/IK3F9Uq.png",  video: "http://wz3.dnip.com.br:1935/novaeratv/novaeratv.sdp/live.m3u8" },
  { id: "tv-aparecida",    titulo: "TV Aparecida",            tipo: "AoVivo", poster: "https://i.imgur.com/kxrja0X.png",  video: "https://cdn.jmvstream.com/w/LVW-9716/LVW9716_HbtQtezcaw/playlist.m3u8" },
  { id: "tv-cancao-nova",  titulo: "TV Canção Nova",          tipo: "AoVivo", poster: "https://i.imgur.com/OaM9hkH.png",  video: "https://5c65286fc6ace.streamlock.net/cancaonova/CancaoNova.stream_720p/playlist.m3u8" },
  { id: "tv-terceiro-anjo",titulo: "TV Terceiro Anjo",        tipo: "AoVivo", poster: "https://i.imgur.com/PExKWNv.png",  video: "https://streamer1.streamhost.org/salive/GMI3anjoh/playlist.m3u8" },
  { id: "boas-novas",      titulo: "Boas Novas",              tipo: "AoVivo", poster: "https://i.imgur.com/ZqhizdP.png",  video: "https://cdn.jmvstream.com/w/LVW-9375/LVW9375_6i0wPBCHYc/playlist.m3u8" },

  // ── ENTRETENIMENTO ─────────────────────────────────────────────────────────
  { id: "chroma-tv",       titulo: "Chroma TV",               tipo: "AoVivo", poster: "https://i.imgur.com/SnaIMgj.png",  video: "https://5c483b9d1019c.streamlock.net/8054/8054/playlist.m3u8" },
  { id: "tv-aratu",        titulo: "TV Aratu",                tipo: "AoVivo", poster: "https://i.imgur.com/LCETtuk.png",  video: "https://cdn.jmvstream.com/w/LVW-8379/LVW8379_rIq6ZYiIiA/playlist.m3u8" },
  { id: "tv-clube",        titulo: "TV Clube",                tipo: "AoVivo", poster: "https://i.imgur.com/CpXjcyE.png",  video: "https://5c483b9d1019c.streamlock.net/8186/8186/playlist.m3u8" },
  { id: "tv-max",          titulo: "TV MAX",                  tipo: "AoVivo", poster: "https://i.imgur.com/2Pg0baJ.png",  video: "https://5cf4a2c2512a2.streamlock.net/tvmax/tvmax/playlist.m3u8" },
  { id: "tv-pantanal",     titulo: "TV Pantanal MS",          tipo: "AoVivo", poster: "https://i.imgur.com/0FOmktl.png",  video: "https://5a2b083e9f360.streamlock.net/tvpantanal/tvpantanal.sdp/playlist.m3u8" },
  { id: "tv-vicosa",       titulo: "TV Viçosa",               tipo: "AoVivo", poster: "https://i.imgur.com/TZF55f9.png",  video: "http://wz4.dnip.com.br/fratevitv/fratevitv.sdp/playlist.m3u8" },
  { id: "1001-noites",     titulo: "1001 Noites",             tipo: "AoVivo", poster: "https://i.imgur.com/dWA9y2J.png",  video: "https://cdn.jmvstream.com/w/LVW-8155/ngrp:LVW8155_41E1ciuCvO_all/playlist.m3u8" },

  // ── EDUCAÇÃO / CULTURA ─────────────────────────────────────────────────────
  { id: "tv-ufg",          titulo: "TV UFG",                  tipo: "AoVivo", poster: "https://i.imgur.com/Yp3dbJo.png",  video: "http://flash.softhost.com.br:1935/ufg/tvufgweb/playlist.m3u8" },
  { id: "unisul-tv",       titulo: "UNISUL TV",               tipo: "AoVivo", poster: "https://i.imgur.com/N0TvAFz.png",  video: "https://sitetv.brasilstream.com.br/hls/sitetv/index.m3u8?token=" },

];

// GET /canais — retorna lista completa
router.get("/", (req, res) => {
  res.json(canais);
});

// GET /canais/:id — retorna canal pelo id (para o player)
router.get("/:id", (req, res) => {
  const canal = canais.find(c => c.id === req.params.id);
  if (!canal) return res.status(404).json({ mensagem: "Canal não encontrado" });
  res.json(canal);
});

module.exports = router;