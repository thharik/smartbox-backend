const express = require("express");
const router  = express.Router();

const canais = [

  // ── CANAIS ABERTOS (1 canais) ───────────────────────────────────────────
  { id: "sbt-interior", titulo: "SBT Interior", tipo: "AoVivo", poster: "https://i.imgur.com/IkZfa4j.png", video: "https://cdn.jmvstream.com/w/LVW-10801/LVW10801_Xvg4R0u57n/playlist.m3u8" },
  
  // ── NOTÍCIAS (6 canais) ───────────────────────────────────────────
  { id: "rta-news", titulo: "RTA News", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA2)/index.m3u8" },
  { id: "tolo-news", titulo: "Tolo News", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://raw.githubusercontent.com/taodicakhia/IPTV_Exception/master/channels/af/tolonews.m3u8" },
 
    // ── PLUTO TV / ANIMES / FILMES / VARIEDADES ───────────────────────────

  {
    id: "acumuladores-obsessivos",
    titulo: "Acumuladores Obsessivos",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Acumuladores",
    video: "https://jmp2.uk/plu-656e2a4b4261ca00083aa99e.m3u8",
  },
  {
    id: "cacadores-de-ovnis",
    titulo: "Caçadores de Óvnis",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Ca%C3%A7adores+de+%C3%93vnis",
    video: "https://jmp2.uk/plu-656e2a10954b020008ed167c.m3u8",
  },
  {
    id: "boruto",
    titulo: "Boruto: Naruto Next Generations",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Boruto",
    video: "https://jmp2.uk/plu-656f389c3944b60008e5bdab.m3u8",
  },
  {
    id: "cocorico",
    titulo: "Cocoricó",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Cocoric%C3%B3",
    video: "https://jmp2.uk/plu-62d969fd8451a30007f0fd94.m3u8",
  },
  {
    id: "comedy-central-pluto-tv",
    titulo: "Comedy Central Pluto TV",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Comedy+Central",
    video: "https://jmp2.uk/plu-5f357e91b18f0b00073583d2.m3u8",
  },
  {
    id: "euronews-portuguese",
    titulo: "Euronews Portuguese",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Euronews",
    video: "https://jmp2.uk/plu-619e6614c9d9650007a2b171.m3u8",
  },
  {
    id: "inuyasha-canal",
    titulo: "Inuyasha",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Inuyasha",
    video: "https://jmp2.uk/plu-66b26681d2d50d00083abe8b.m3u8",
  },
  {
    id: "mais-masterchef-brasil",
    titulo: "Mais MasterChef Brasil",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Mais+MasterChef",
    video: "https://jmp2.uk/plu-681111be5e0764e297fb200e.m3u8",
  },
  {
    id: "masterchef",
    titulo: "MasterChef",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=MasterChef",
    video: "https://jmp2.uk/plu-6077045b6031bd00078de127.m3u8",
  },
  {
    id: "jojos-bizarre-adventure",
    titulo: "JoJo's Bizarre Adventure",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=JoJo",
    video: "https://jmp2.uk/plu-66c7982f6838ee00085f0d24.m3u8",
  },
  {
    id: "one-piece-canal",
    titulo: "One Piece",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=One+Piece",
    video: "https://jmp2.uk/plu-624b1c8d4321e200073ee421.m3u8",
  },
  {
    id: "pluto-tv-cine-classicos",
    titulo: "Pluto TV Cine Clássicos",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Cine+Cl%C3%A1ssicos",
    video: "https://jmp2.uk/plu-5fa1612a669ba0000702017b.m3u8",
  },
  {
    id: "pluto-tv-cine-drama",
    titulo: "Pluto TV Cine Drama",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Cine+Drama",
    video: "https://jmp2.uk/plu-5f1210d14ae1f80007bafb1d.m3u8",
  },
  {
    id: "pluto-tv-esportes",
    titulo: "Pluto TV Esportes",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Esportes",
    video: "https://jmp2.uk/plu-5f32d2db0af67400077f29c4.m3u8",
  },
  {
    id: "pluto-tv-filmes-de-luta",
    titulo: "Pluto TV Filmes de Luta",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Filmes+de+Luta",
    video: "https://jmp2.uk/plu-6806d62369aec5b19cd628c0.m3u8",
  },
  {
    id: "pluto-tv-kids",
    titulo: "Pluto TV Kids",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Pluto+Kids",
    video: "https://jmp2.uk/plu-5f1214a637c6fd00079c652f.m3u8",
  },
  {
    id: "pluto-tv-kids-club",
    titulo: "Pluto TV Kids Club",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Kids+Club",
    video: "https://jmp2.uk/plu-66c8cae7fed35b0008580ec0.m3u8",
  },
  {
    id: "pluto-tv-negocio-fechado",
    titulo: "Pluto TV Negócio Fechado",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Neg%C3%B3cio+Fechado",
    video: "https://jmp2.uk/plu-64ad7394798def00087b2bfe.m3u8",
  },
  {
    id: "pluto-tv-record-news",
    titulo: "Pluto TV Record News",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Record+News",
    video: "https://jmp2.uk/plu-6102e04e9ab1db0007a980a1.m3u8",
  },
  {
    id: "pokemon",
    titulo: "Pokémon",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Pok%C3%A9mon",
    video: "https://jmp2.uk/plu-687007a8ee4155e89a8f6d67.m3u8",
  },
  {
    id: "super-onze",
    titulo: "Super Onze",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Super+Onze",
    video: "https://jmp2.uk/plu-63988c2750108d00072e2686.m3u8",
  },
  {
    id: "yu-gi-oh",
    titulo: "Yu-Gi-Oh",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Yu-Gi-Oh",
    video: "https://jmp2.uk/plu-63988a50be012600070f5db3.m3u8",
  },
  {
    id: "pluto-tv-novelas",
    titulo: "Pluto TV Novelas",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Novelas",
    video: "https://jmp2.uk/plu-5f512365abe1f50007d3ff56.m3u8",
  },
  {
    id: "pluto-tv-netmovies",
    titulo: "Pluto TV Netmovies",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Netmovies",
    video: "https://jmp2.uk/plu-663b9de4f999220008230fa8.m3u8",
  },
  {
    id: "pfl-mma",
    titulo: "PFL MMA",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=PFL+MMA",
    video: "https://jmp2.uk/plu-64f6180130ab3300083d896b.m3u8",
  },
  {
    id: "os-padrinhos-magicos",
    titulo: "Os Padrinhos Mágicos",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Padrinhos+M%C3%A1gicos",
    video: "https://jmp2.uk/plu-63221e41af69b500076f84e7.m3u8",
  },
  {
    id: "os-arquivos-do-fbi",
    titulo: "Os Arquivos do FBI",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Arquivos+do+FBI",
    video: "https://jmp2.uk/plu-620d12a82e8ac50007c269c3.m3u8",
  },
  {
    id: "hunter-x-hunter",
    titulo: "Hunter x Hunter",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Hunter+x+Hunter",
    video: "https://jmp2.uk/plu-65d9167818036500080e8780.m3u8",
  },
  {
    id: "beyblade",
    titulo: "Beyblade",
    tipo: "AoVivo",
    poster: "https://via.placeholder.com/300x450/141414/ffffff?text=Beyblade",
    video: "https://jmp2.uk/plu-633dc392e0282400071b0d39.m3u8",
  },
  // ── VARIEDADES (109 canais) ───────────────────────────────────────────
  { id: "adesso-tv", titulo: "Adesso TV", tipo: "AoVivo", poster: "https://i.imgur.com/KgetM8j.png", video: "https://cdn.jmvstream.com/w/LVW-9715/LVW9715_12B26T62tm/playlist.m3u8" },
  { id: "com-brasil", titulo: "COM Brasil", tipo: "AoVivo", poster: "https://i.imgur.com/GrjGwKM.png", video: "https://br5093.streamingdevideo.com.br/abc/abc/playlist.m3u8" },
  { id: "conexao-tv", titulo: "Conexão TV", tipo: "AoVivo", poster: "https://i.imgur.com/CJ9SPsZ.png", video: "https://5a57bda70564a.streamlock.net/conexaotv/conexaotv.sdp/playlist.m3u8" },
  { id: "eutv", titulo: "EUTV", tipo: "AoVivo", poster: "https://i.imgur.com/8PxpamC.png", video: "https://cdn.jmvstream.com/w/LVW-8719/LVW8719_AcLVAxWy5J/playlist.m3u8" },
  { id: "fala-litoral", titulo: "Fala Litoral", tipo: "AoVivo", poster: "https://i.imgur.com/NF6PL8O.png", video: "https://5c483b9d1019c.streamlock.net/falalitoraltv/falalitoraltv/playlist.m3u8" },
  { id: "rbatv", titulo: "RBATV", tipo: "AoVivo", poster: "https://i.imgur.com/ZWFxlU1.png", video: "https://cdn.live.br1.jmvstream.com/w/LVW-15748/LVW15748_Yed7yzLuRC/playlist.m3u8" },
  { id: "tv-mais-marica", titulo: "TV Mais Maricá", tipo: "AoVivo", poster: "https://i.imgur.com/lgCRX7q.png", video: "https://5cf4a2c2512a2.streamlock.net/tvmaismarica/tvmaismarica/playlist.m3u8" },
  { id: "tv-nbn", titulo: "TVNBN", tipo: "AoVivo", poster: "https://i.imgur.com/zoHBxn1.png", video: "https://cdn.jmvstream.com/w/LVW-8410/LVW8410_uiZOVm6vz1/playlist.m3u8" },
  { id: "tv-passo-fundo", titulo: "TV Passo Fundo", tipo: "AoVivo", poster: "https://i.imgur.com/QFE6TiV.png", video: "https://5a57bda70564a.streamlock.net/tvpasso/tvpasso.sdp/playlist.m3u8" },
  { id: "tv-sul-minas", titulo: "TV Sul de Minas", tipo: "AoVivo", poster: "https://i.imgur.com/hPh8cxK.png", video: "https://5cf4a2c2512a2.streamlock.net/tvsuldeminas/tvsuldeminas/playlist.m3u8" },
  { id: "tv-vila-real", titulo: "TV Vila Real", tipo: "AoVivo", poster: "https://i.imgur.com/Z1uWe7g.png", video: "https://cdn.jmvstream.com/w/LVW-10841/LVW10841_mT77z9o2cP/playlist.m3u8" },
  { id: "tvcom-df", titulo: "TVCOM DF", tipo: "AoVivo", poster: "https://i.imgur.com/uxefHY3.png", video: "https://5b7f3c45ab7c2.streamlock.net/8008/smil:8008.smil/playlist.m3u8?DVR=" },
  { id: "canal-38", titulo: "Canal 38", tipo: "AoVivo", poster: "https://i.imgur.com/co7TCWC.png", video: "https://cdn.jmvstream.com/w/LVW-8503/LVW8503_d0V5oduFlK/playlist.m3u8" },
  { id: "plena-tv", titulo: "Plena TV", tipo: "AoVivo", poster: "https://i.imgur.com/lH4RT7b.png", video: "https://cdn.jmvstream.com/w/LVW-9591/LVW9591_PmXtgATnaS/playlist.m3u8" },
  { id: "stz-tv", titulo: "STZ TV", tipo: "AoVivo", poster: "https://i.imgur.com/SeF2I7q.png", video: "https://cdn.live.br1.jmvstream.com/webtv/AVJ-12952/playlist/playlist.m3u8" },
  { id: "tv-sim-cachoeiro",titulo: "TV Sim Cachoeiro", tipo: "AoVivo", poster: "https://i.imgur.com/t5oUK3C.png", video: "https://5cf4a2c2512a2.streamlock.net/8104/8104/playlist.m3u8" },
  { id: "tv-sim-colatina", titulo: "TV Sim Colatina", tipo: "AoVivo", poster: "https://i.imgur.com/t5oUK3C.png", video: "https://5cf4a2c2512a2.streamlock.net/8132/8132/playlist.m3u8" },
  { id: "tv-sim-sao-mateus",titulo: "TV Sim São Mateus", tipo: "AoVivo", poster: "https://i.imgur.com/t5oUK3C.png", video: "https://5cf4a2c2512a2.streamlock.net/8236/8236/playlist.m3u8" },
  { id: "tv-zoom", titulo: "TV Zoom", tipo: "AoVivo", poster: "https://i.imgur.com/jCGrjf5.png", video: "https://cdn.jmvstream.com/w/LVW-9730/LVW9730_LmUwslM8jt/playlist.m3u8" },
  { id: "despertar-tv", titulo: "Despertar TV", tipo: "AoVivo", poster: "https://res.cloudinary.com/dpkehkbpv/image/upload/v1721839192/logo/mixtv/despertar_tv_ieb2l3.png", video: "https://cdn.live.br1.jmvstream.com/webtv/pejexypz/playlist/playlist.m3u8" },
  { id: "tv-cancao-nova", titulo: "TV Canção Nova", tipo: "AoVivo", poster: "https://i.imgur.com/OaM9hkH.png", video: "https://5c65286fc6ace.streamlock.net/cancaonova/CancaoNova.stream_720p/playlist.m3u8" },
  { id: "tv-terceiro-anjo",titulo: "TV Terceiro Anjo", tipo: "AoVivo", poster: "https://i.imgur.com/PExKWNv.png", video: "https://streamer1.streamhost.org/salive/GMI3anjoh/playlist.m3u8" },
  { id: "boas-novas", titulo: "Boas Novas", tipo: "AoVivo", poster: "https://i.imgur.com/ZqhizdP.png", video: "https://cdn.jmvstream.com/w/LVW-9375/LVW9375_6i0wPBCHYc/playlist.m3u8" },
  { id: "chroma-tv", titulo: "Chroma TV", tipo: "AoVivo", poster: "https://i.imgur.com/SnaIMgj.png", video: "https://5c483b9d1019c.streamlock.net/8054/8054/playlist.m3u8" },
  { id: "tv-aratu", titulo: "TV Aratu", tipo: "AoVivo", poster: "https://i.imgur.com/LCETtuk.png", video: "https://cdn.jmvstream.com/w/LVW-8379/LVW8379_rIq6ZYiIiA/playlist.m3u8" },
  { id: "shop-channel-jp", titulo: "Shop Channel (Japão)", tipo: "AoVivo", poster: "https://i.imgur.com/CCMAF7W.png", video: "https://stream3.shopch.jp/HLS/master.m3u8" },
  
  { id: "ebs1-kr", titulo: "EBS 1 (Coreia)", tipo: "AoVivo", poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/EBS_1TV_Logo.svg/512px-EBS_1TV_Logo.svg.png", video: "https://ebsonair.ebs.co.kr/ebs1familypc/familypc1m/playlist.m3u8" },
  { id: "ebs2-kr", titulo: "EBS 2 (Coreia)", tipo: "AoVivo", poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/EBS_2TV_Logo.svg/512px-EBS_2TV_Logo.svg.png", video: "https://ebsonair.ebs.co.kr/ebs2familypc/familypc1m/playlist.m3u8" },
 
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