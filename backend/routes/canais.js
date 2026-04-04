const express = require("express");
const router  = express.Router();

// ── Canais Ao Vivo — todos verificados como estáveis ─────────────────────
const canais = [

  // ── ESPORTES GERAIS ────────────────────────────────────────────────────
  { id: "trt-spor",        titulo: "TRT Spor (Turquia)",      tipo: "AoVivo", poster: "https://i.imgur.com/N2wGZyf.png",                                                                         video: "https://tv-trtspor1.medya.trt.com.tr/master.m3u8" },
  { id: "trt-spor2",       titulo: "TRT Spor 2 (Turquia)",    tipo: "AoVivo", poster: "https://i.imgur.com/ysKteM8.png",                                                                         video: "https://tv-trtspor2.medya.trt.com.tr/master.m3u8" },
  { id: "orf-sport",       titulo: "ORF Sport+ (Áustria)",    tipo: "AoVivo", poster: "https://i.imgur.com/MVNZ4gf.png",                                                                         video: "https://orfs.mdn.ors.at/out/u/orfs/q8c/manifest.m3u8" },
  { id: "rai-sport",       titulo: "Rai Sport (Itália)",       tipo: "AoVivo", poster: "https://i.imgur.com/xsGljsb.png",                                                                         video: "https://mediapolis.rai.it/relinker/relinkerServlet.htm?cont=358025&output=7&forceUserAgent=rainet/4.0.5" },
  { id: "sportitalia",     titulo: "Sportitalia Plus",        tipo: "AoVivo", poster: "https://i.imgur.com/hu56Ya5.png",                                                                         video: "https://sportsitalia-samsungitaly.amagi.tv/playlist.m3u8" },
  { id: "tv2-sport",       titulo: "TV 2 Sport (Noruega)",    tipo: "AoVivo", poster: "https://i.imgur.com/asKHqNZ.png",                                                                         video: "https://ws31-hls-live.akamaized.net/out/u/1416253.m3u8" },
  { id: "stadium-us",      titulo: "Stadium (EUA)",            tipo: "AoVivo", poster: "https://i.imgur.com/6ae9E8d.png",                                                                         video: "https://bcovlive-a.akamaihd.net/e64d564b9275484f85981d8c146fb915/us-east-1/5994000126001/profile_1/976f34cf5a614518b7b539cbf9812080/chunklist_ssaiV.m3u8" },
  { id: "sport-pluto",     titulo: "Sport (Pluto TV)",         tipo: "AoVivo", poster: "https://i.imgur.com/o2psAYW.png",                                                                         video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/608030eff4b6f70007e1684c/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
  { id: "unbeaten-sports", titulo: "Unbeaten Sports",          tipo: "AoVivo", poster: "https://i.imgur.com/UAiv612.png",                                                                         video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/64c3b106dac71b00080a26d2/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
  { id: "xsport-ua",       titulo: "XSport (Ucrânia)",         tipo: "AoVivo", poster: "https://i.imgur.com/CHDcfrT.png",                                                                         video: "http://cdnua05.hls.tv/946/hls/8743361621b245838bee193c9ec28322/3999/stream.m3u8" },
  { id: "m4-sport",        titulo: "M4 Sport (Hungria)",       tipo: "AoVivo", poster: "https://nb1.hu/uploads/news/3/31023.jpg",                                                                 video: "https://c401-node62-cdn.connectmedia.hu/110110/5dd8dc6d853c9b7f94db85646ed44326/641177e3/index.m3u8" },
  { id: "deport-tv",       titulo: "DeporTV (Argentina)",      tipo: "AoVivo", poster: "https://i.imgur.com/iyYLNRt.png",                                                                         video: "https://5fb24b460df87.streamlock.net/live-cont.ar/deportv/playlist.m3u8" },

  // ── ESPORTES ÁRABES / FUTEBOL ──────────────────────────────────────────
  { id: "alkass-one",      titulo: "Alkass One (Catar)",       tipo: "AoVivo", poster: "https://i.imgur.com/10mmlha.png",                                                                         video: "https://www.tvkaista.net/stream-forwarder/get.php?x=AlkassOne" },
  { id: "alkass-two",      titulo: "Alkass Two (Catar)",       tipo: "AoVivo", poster: "https://i.imgur.com/8w61kFX.png",                                                                         video: "https://www.tvkaista.net/stream-forwarder/get.php?x=AlkassTwo" },
  { id: "alkass-three",    titulo: "Alkass Three (Catar)",     tipo: "AoVivo", poster: "https://i.imgur.com/d57BdFh.png",                                                                         video: "https://www.tvkaista.net/stream-forwarder/get.php?x=AlkassThree" },
  { id: "alkass-four",     titulo: "Alkass Four (Catar)",      tipo: "AoVivo", poster: "https://i.imgur.com/iDL65Wu.png",                                                                         video: "https://www.tvkaista.net/stream-forwarder/get.php?x=AlkassFour" },
  { id: "abu-dhabi-sport1",titulo: "Abu Dhabi Sports 1",       tipo: "AoVivo", poster: "https://i.imgur.com/7cNke07.png",                                                                         video: "https://vo-live.cdb.cdn.orange.com/Content/Channel/AbuDhabiSportsChannel1/HLS/index.m3u8" },
  { id: "abu-dhabi-sport2",titulo: "Abu Dhabi Sports 2",       tipo: "AoVivo", poster: "https://i.imgur.com/7cNke07.png",                                                                         video: "https://vo-live.cdb.cdn.orange.com/Content/Channel/AbuDhabiSportsChannel2/HLS/index.m3u8" },
  { id: "dubai-sport1",    titulo: "Dubai Sports 1",           tipo: "AoVivo", poster: "https://www.lyngsat.com/logo/tv/dd/dubai-sports-ae.png",                                                 video: "https://dmitnthfr.cdn.mgmlcdn.com/dubaisports/smil:dubaisports.stream.smil/chunklist.m3u8" },
  { id: "dubai-sport2",    titulo: "Dubai Sports 2",           tipo: "AoVivo", poster: "https://www.lyngsat.com/logo/tv/dd/dubai-sports-ae.png",                                                 video: "https://dmitwlvvll.cdn.mangomolo.com/dubaisportshd/smil:dubaisportshd.smil/index.m3u8" },
  { id: "dubai-sport3",    titulo: "Dubai Sports 3",           tipo: "AoVivo", poster: "https://www.lyngsat.com/logo/tv/dd/dubai-sports-ae.png",                                                 video: "https://dmitwlvvll.cdn.mangomolo.com/dubaisportshd5/smil:dubaisportshd5.smil/index.m3u8" },
  { id: "cbc-sport-az",    titulo: "CBC Sport (Azerbaijão)",   tipo: "AoVivo", poster: "https://upload.wikimedia.org/wikipedia/az/0/04/CBC_Sport_TV_loqo.png",                                   video: "https://mn-nl.mncdn.com/cbcsports_live/cbcsports/playlist.m3u8" },

  // ── CORRIDA / RACING ───────────────────────────────────────────────────
  { id: "dubai-racing1",   titulo: "Dubai Racing 1",           tipo: "AoVivo", poster: "https://www.lyngsat.com/logo/tv/dd/dubai-racing-ae.png",                                                 video: "https://dmisvthvll.cdn.mgmlcdn.com/events/smil:events.stream.smil/playlist.m3u8" },
  { id: "dubai-racing2",   titulo: "Dubai Racing 2",           tipo: "AoVivo", poster: "https://www.lyngsat.com/logo/tv/dd/dubai-racing-ae.png",                                                 video: "https://dmithrvll.cdn.mangomolo.com/dubairacing/smil:dubairacing.smil/playlist.m3u8" },
  { id: "dubai-racing3",   titulo: "Dubai Racing 3",           tipo: "AoVivo", poster: "https://www.lyngsat.com/logo/tv/dd/dubai-racing-ae.png",                                                 video: "https://dmithrvll.cdn.mangomolo.com/dubaimubasher/smil:dubaimubasher.smil/playlist.m3u8" },
  { id: "racing-com-au",   titulo: "Racing.com (Austrália)",   tipo: "AoVivo", poster: "https://i.imgur.com/pma0OCf.png",                                                                         video: "https://racingvic-i.akamaized.net/hls/live/598695/racingvic/1500.m3u8" },
  { id: "car-chase-pluto", titulo: "Car Chase TV",             tipo: "AoVivo", poster: "https://i.imgur.com/F1jXkhK.png",                                                                         video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/65a939fad77d450008863835/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },

  // ── MONSTER / LUTAS / WRESTLING ────────────────────────────────────────
  { id: "monster-jam",     titulo: "Monster Jam",              tipo: "AoVivo", poster: "https://i.imgur.com/jxGhINd.png",                                                                         video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/65bce7f1d77d450008b3a430/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
  { id: "robot-wars",      titulo: "Robot Wars (MECH+)",       tipo: "AoVivo", poster: "https://i.imgur.com/vGqha3k.png",                                                                         video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/651581ba6a84140008593586/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
  { id: "pfl-mma",         titulo: "PFL MMA",                  tipo: "AoVivo", poster: "https://i.imgur.com/zScgLTv.png",                                                                         video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/654a299cab05240008a12639/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
  { id: "wrestling-classic",titulo: "Classic Wrestling",       tipo: "AoVivo", poster: "https://i.imgur.com/QVN5qv3.png",                                                                         video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/652516fb7971630008a58e74/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },

  // ── ANIME ──────────────────────────────────────────────────────────────
  { id: "anime-pluto",     titulo: "Anime (Pluto TV)",         tipo: "AoVivo", poster: "https://i.imgur.com/rhVF0eC.png",                                                                         video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/65b90daed77d450008a43345/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
  { id: "animax-jp",       titulo: "Animax (Japão)",           tipo: "AoVivo", poster: "https://i.imgur.com/jO0qUvj.png",                                                                         video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS236&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },

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