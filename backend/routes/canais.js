const express = require("express");
const router = express.Router();

const canais = [
  { id: "monster-jam", 
    titulo: "Monster Jam",   
    tipo: "AoVivo",
    poster: "https://i.imgur.com/jxGhINd.png", 
    video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/65bce7f1d77d450008b3a430/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
    
  { id: "robot-wars",         titulo: "Robot Wars (MECH+)",      tipo: "AoVivo", poster: "https://i.imgur.com/vGqha3k.png",    video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/651581ba6a84140008593586/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
  { id: "pfl-mma",            titulo: "PFL MMA",                 tipo: "AoVivo", poster: "https://i.imgur.com/zScgLTv.png",    video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/654a299cab05240008a12639/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },
  { id: "wrestling-classic",  titulo: "Classic Wrestling",       tipo: "AoVivo", poster: "https://i.imgur.com/QVN5qv3.png",    video: "https://service-stitcher.clusters.pluto.tv/v1/stitch/embed/hls/channel/652516fb7971630008a58e74/master.m3u8?deviceId=channel&deviceModel=web&deviceVersion=1.0&appVersion=1.0&deviceType=rokuChannel&deviceMake=rokuChannel&deviceDNT=1" },

  
];

router.get("/", (req, res) => {
  res.json(canais);
});

module.exports = router;