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

    // ── ESPORTES ─────────────────────────────────────────────
  { id: "bandsports", titulo: "BandSports", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18852" },
  { id: "espn", titulo: "ESPN", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18780" },
  { id: "espn-brasil", titulo: "ESPN Brasil", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18781" },
  { id: "combate", titulo: "Combate", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18784" },

  // ── INFANTIL ─────────────────────────────────────────────
  { id: "cartoon-network", titulo: "Cartoon Network", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18849" },
  { id: "disney", titulo: "Disney Channel", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18782" },
  { id: "discovery-kids", titulo: "Discovery Kids", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18843" },
  { id: "boomerang", titulo: "Boomerang", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18851" },

  // ── FILMES E SÉRIES ─────────────────────────────────────
  { id: "axn", titulo: "AXN", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18854" },
  { id: "amc", titulo: "AMC", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18857" },
  { id: "cinemax", titulo: "Cinemax", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18848" },
  { id: "fx", titulo: "FX", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18829" },

  // ── DOCUMENTÁRIOS ───────────────────────────────────────
  { id: "discovery", titulo: "Discovery Channel", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18783" },
  { id: "animal-planet", titulo: "Animal Planet", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18856" },

  // ── NOTÍCIAS ────────────────────────────────────────────
  { id: "bandnews", titulo: "BandNews", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18853" },
  { id: "cnn", titulo: "CNN Internacional", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/28054" },

  // ── VARIEDADES ─────────────────────────────────────────
  { id: "ae", titulo: "A&E", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18858" },
  { id: "comedy-central", titulo: "Comedy Central", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18847" },
  { id: "bis", titulo: "Bis", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18785" },

  // ── ABERTOS ────────────────────────────────────────────
  { id: "band", titulo: "Band", tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://psrv.io:80/9089247/coreurl.me/18786" },

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

  // ── ÁFRICA DO SUL ──────────────────────────────────────────────────────────────
  { id: "boktv",                titulo: "BOK TV",                    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://livestream2.bokradio.co.za/hls/Bok5c.m3u8" },
  { id: "gnf-tv",               titulo: "GNF TV",                    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://oqgdrb8my4rm-hls-live.5centscdn.com/GNF02/bcea197d8b00f79cb716c6288a861000.sdp/playlist.m3u8" },
  { id: "homebase-tv",          titulo: "Homebase TV",               tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://viewmedia7219.bozztv.com/wmedia/viewmedia100/web_022/Stream/playlist.m3u8" },
  { id: "hope-channel-africa",  titulo: "Hope Channel Africa",       tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://jstre.am/live/jsl:i1onRBELcGV.m3u8" },
  { id: "ln24sa",               titulo: "LN24SA",                    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://cdnstack.internetmultimediaonline.org/ln24/ln24.stream/playlist.m3u8" },
  { id: "loveworld-sat",        titulo: "LoveworldSAT",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://cdnstack.internetmultimediaonline.org/lwsat/lwsat.stream/index.m3u8" },
  { id: "nuview-tv",            titulo: "NuView TV",                 tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://viewmedia7219.bozztv.com/wmedia/viewmedia100/web_002/Stream/playlist.m3u8" },
  { id: "redemption-tv",        titulo: "Redemption TV Ministry",    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live.nixsat.com/play/rtm/index.m3u8" },
  { id: "rlw-tv",               titulo: "RLW TV",                    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://webstreaming-8.viewmedia.tv/web_119/Stream/playlist.m3u8" },
  { id: "rov-tv",               titulo: "ROV TV",                    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://viewmedia7219.bozztv.com/wmedia/viewmedia100/web_012/Stream/playlist.m3u8" },
  { id: "wildearth",            titulo: "WildEarth",                 tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01290-wildearth-oando/playlist.m3u8" },

  // ── AFEGANISTÃO ────────────────────────────────────────────────────────────────
  { id: "amc-af",          titulo: "AMC",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://amchls.wns.live/hls/stream.m3u8" },
  { id: "bahar-tv",        titulo: "Bahar TV",         tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://59d39900ebfb8.streamlock.net/bahartv/bahartv/playlist.m3u8" },
  { id: "chekad-tv",       titulo: "Chekad TV",        tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://go5lmqxjyawb-hls-live.5centscdn.com/Chekad/271ddf829afeece44d8732757fba1a66.sdp/chunks.m3u8" },
  { id: "dunya-naw-tv",    titulo: "Dunya Naw TV",     tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://dunyanhls.wns.live/hls/stream.m3u8" },
  { id: "eslah-tv",        titulo: "Eslah TV",         tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://eslahtvhls.wns.live/hls/stream.m3u8" },
  { id: "hewad-tv",        titulo: "Hewad TV",         tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://51.210.199.58/hls/stream.m3u8" },
  { id: "iman-tv",         titulo: "Iman TV",          tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live.relentlessinnovations.net:1936/imantv/imantv/playlist.m3u8" },
  { id: "kayhan-tv",       titulo: "Kayhan TV",        tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://playout395.livestreamingcdn.com/live/Stream1/playlist.m3u8" },
  { id: "rta",             titulo: "RTA",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA1)/index.m3u8" },
  { id: "rta-education",   titulo: "RTA Education",    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA4)/index.m3u8" },
  { id: "rta-news",        titulo: "RTA News",         tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA2)/index.m3u8" },
  { id: "rta-sport",       titulo: "RTA Sport",        tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA3)/index.m3u8" },
  { id: "shams-tv",        titulo: "Shams TV",         tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://fflive-darya-educationtv.b-cdn.net/master.m3u8" },
  { id: "shamshad-tv",     titulo: "Shamshad TV",      tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://5a1178b42cc03.streamlock.net/shamshadtelevision/shamshadtelevision/playlist.m3u8" },
  { id: "sharq-radio-tv",  titulo: "Sharq Radio TV",   tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://59nyqa5elwap-hls-live.5centscdn.com/Sharq/eec89088ee408b80387155272b113256.sdp/playlist.m3u8" },
  { id: "tamadon-tv",      titulo: "Tamadon TV",       tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://hls.tamadon.live/hls/stream.m3u8" },
  { id: "tolo-news",       titulo: "Tolo News",        tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://raw.githubusercontent.com/taodicakhia/IPTV_Exception/master/channels/af/tolonews.m3u8" },

  // ── ALBÂNIA ────────────────────────────────────────────────────────────────────
  { id: "albkanale-music",  titulo: "AlbKanale Music TV",  tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://albportal.net/albkanalemusic.m3u8" },
  { id: "cna-al",           titulo: "CNA Albania",         tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live1.mediadesk.al/cnatvlive.m3u8" },
  { id: "euronews-albania",  titulo: "Euronews Albania",   tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://gjirafa-video-live.gjirafa.net/gjvideo-live/2dw-zuf-1c9-pxu/index.m3u8" },
  { id: "news24-al",        titulo: "News 24 Albania",     tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://tv.balkanweb.com/news24/livestream/playlist.m3u8" },
  { id: "ora-news",         titulo: "Ora News",            tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live1.mediadesk.al/oranews.m3u8" },
  { id: "report-tv",        titulo: "Report TV",           tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://deb10stream.duckdns.org/hls/stream.m3u8" },
  { id: "rtsh1",            titulo: "RTSH 1",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://178.33.11.6:8696/live/rtsh1ott/playlist.m3u8" },
  { id: "rtsh2",            titulo: "RTSH 2",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://178.33.11.6:8696/live/rtsh2/playlist.m3u8" },
  { id: "rtsh24",           titulo: "RTSH 24",             tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://178.33.11.6:8696/live/rtsh24/playlist.m3u8" },
  { id: "rtsh-shqip",       titulo: "RTSH Shqip",          tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://178.33.11.6:8696/live/rtshshqip/playlist.m3u8" },
  { id: "rtsh-sport",       titulo: "RTSH Sport",          tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "http://178.33.11.6:8696/live/rtshsport/playlist.m3u8" },
  { id: "syri-tv",          titulo: "Syri TV",             tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://stream.syritv.al/live/syritv/playlist.m3u8" },
  { id: "vizion-plus",      titulo: "Vizion Plus",         tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://tringliveviz.akamaized.net/delta/105/out/u/qwaszxerdfcvrtryuy.m3u8" },
  { id: "zjarr-tv",         titulo: "Zjarr TV",            tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://zjarr.future.al/hls/playlist.m3u8" },

  // ── BOLÍVIA ────────────────────────────────────────────────────────────────────
  { id: "abya-yala-tv",   titulo: "Abya Yala TV",          tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://seo.tv.bo/tv/LIpSEO-TV-8.m3u8" },
  { id: "atb-la-paz",     titulo: "ATB La Paz",            tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://stream.atb.com.bo/live/daniel/index.m3u8" },
  { id: "bolivia-tv72",   titulo: "Bolivia TV 7.2",        tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://video1.getstreamhosting.com:1936/8224/8224/playlist.m3u8" },
  { id: "bolivision",     titulo: "Bolivisión",            tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://alba-bo-bolivision-bolivision.stream.mediatiquestream.com/index.m3u8" },
  { id: "ctv-bo",         titulo: "CTV Bolivia",           tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live.ctvbolivia.com/hls/ctv.m3u8" },
  { id: "fap-tv",         titulo: "FAP TV",                tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://nd106.republicaservers.com/hls/c7284/index.m3u8" },
  { id: "ftv-bo",         titulo: "FTV Bolivia",           tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://master.tucableip.com/ftvhd/index.m3u8" },
  { id: "palenque-tv",    titulo: "Palenque TV",           tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://tv.bitstreaming.net:3234/live/palenquetvlive.m3u8" },
  { id: "pat-la-paz",     titulo: "PAT La Paz",            tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://www.redpat.tv/proxylpz/index.m3u8" },
  { id: "red-cctv",       titulo: "Red CCTV",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://solo.disfrutaenlared.com:1936/redcctv/redcctv/playlist.m3u8" },
  { id: "red-tv-shop",    titulo: "Red TV Shop",           tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://master.tucableip.com/redtvshop/index.m3u8" },
  { id: "red-uno-sc",     titulo: "Red Uno Santa Cruz",    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://master.tucableip.com/muxredunosc/index.m3u8" },
  { id: "rtp-bo",         titulo: "RTP Bolivia",           tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://rtp.noxun.net/hls/stream.m3u8" },
  { id: "tdt-multimedia", titulo: "TDT Multimedia",        tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://video01.kshost.com.br:4443/juan6318/juan6318/playlist.m3u8" },
  { id: "tv-off",         titulo: "TV OFF",                tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://seo.tv.bo/tv/TV-OFF.m3u8" },
  { id: "unifranz",       titulo: "Unifranz",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live.enhdtv.com:8081/8192/index.m3u8" },
  { id: "univalle-tv",    titulo: "Univalle Televisión",   tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://master.tucableip.com/univalletv/playlist.m3u8" },
  { id: "zoy-tv-turcas",  titulo: "Zoy TV Turcas",         tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://mio.zoymilton.com/ZoyTurcas/index.m3u8" },
  { id: "zoy-tv-plus",    titulo: "ZoyTV Plus",            tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://mio.zoymilton.com/ZoyPlus/index.m3u8" },

  // ── JAPÃO ──────────────────────────────────────────────────────────────────────
  { id: "nhk-sogo",        titulo: "NHK総合 (Japão)",       tipo: "AoVivo", poster: "https://i.imgur.com/fAZ2BEZ.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS291&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "nhk-etele",       titulo: "NHK Eテレ (Japão)",     tipo: "AoVivo", poster: "https://i.imgur.com/WxtftlO.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS292&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "nippon-tv",       titulo: "日本テレビ (Japão)",     tipo: "AoVivo", poster: "https://i.imgur.com/ecbM7QS.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS294&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "tv-asahi",        titulo: "テレビ朝日 (Japão)",     tipo: "AoVivo", poster: "https://i.imgur.com/5XnMfcR.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS295&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "tbs-tv",          titulo: "TBSテレビ (Japão)",      tipo: "AoVivo", poster: "https://i.imgur.com/jIZ9TlO.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS296&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "tv-tokyo",        titulo: "テレビ東京 (Japão)",     tipo: "AoVivo", poster: "https://i.imgur.com/U8jBxEi.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS297&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "fuji-tv",         titulo: "フジテレビ (Japão)",     tipo: "AoVivo", poster: "https://i.imgur.com/epJYc7P.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS298&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "nhk-bs",          titulo: "NHK BS (Japão)",        tipo: "AoVivo", poster: "https://i.imgur.com/t0uZcSR.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS101&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "animax-jp",       titulo: "Animax (Japão)",        tipo: "AoVivo", poster: "https://i.imgur.com/jO0qUvj.png",   video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=BS236&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id: "nhk-world",       titulo: "NHK World Japan",       tipo: "AoVivo", poster: "https://i.imgur.com/Mhw1Ihk.png",   video: "https://master.nhkworld.jp/nhkworld-tv/playlist/live.m3u8" },
  { id: "shop-channel-jp", titulo: "Shop Channel (Japão)",  tipo: "AoVivo", poster: "https://i.imgur.com/CCMAF7W.png",   video: "https://stream3.shopch.jp/HLS/master.m3u8" },
  { id: "kids-station-jp", titulo: "Kids Station (Japão)",  tipo: "AoVivo", poster: "https://www.lyngsat-logo.com/logo/tv/kk/kidsstation.png", video: "https://stream01.willfonk.com/live_playlist.m3u8?cid=CS330&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },

  // ── COREIA ─────────────────────────────────────────────────────────────────────
  { id: "kbs1-kr",    titulo: "KBS 1TV (Coreia)",  tipo: "AoVivo", poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/KBS_1_logo.svg/512px-KBS_1_logo.svg.png", video: "http://mytv.dothome.co.kr/ch/public/1.php" },
  { id: "ebs1-kr",    titulo: "EBS 1 (Coreia)",    tipo: "AoVivo", poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/EBS_1TV_Logo.svg/512px-EBS_1TV_Logo.svg.png", video: "https://ebsonair.ebs.co.kr/ebs1familypc/familypc1m/playlist.m3u8" },
  { id: "ebs2-kr",    titulo: "EBS 2 (Coreia)",    tipo: "AoVivo", poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/EBS_2TV_Logo.svg/512px-EBS_2TV_Logo.svg.png", video: "https://ebsonair.ebs.co.kr/ebs2familypc/familypc1m/playlist.m3u8" },
  { id: "arirang-kr", titulo: "Arirang (Coreia)",  tipo: "AoVivo", poster: "https://i.imgur.com/RuHZ6Dx.png", video: "http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8" },
  { id: "kbs-world",  titulo: "KBS World",         tipo: "AoVivo", poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/KBS_World_%282009%29.svg/512px-KBS_World_%282009%29.svg.png", video: "http://ye23.vip/z7z8/2021/kbs2020.php?id=3" },

  // ── EMIRADOS ÁRABES ────────────────────────────────────────────────────────────
  { id: "ajman-tv",              titulo: "Ajman TV",               tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://cdn1.logichost.in/ajmantv/live/playlist.m3u8" },
  { id: "al-arabiya",            titulo: "Al Arabiya",             tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8" },
  { id: "al-arabiya-business",   titulo: "Al Arabiya Business",    tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live.alarabiya.net/alarabiapublish/aswaaq.smil/playlist.m3u8" },
  { id: "al-qamar-tv",           titulo: "Al Qamar TV",            tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://streamer3.premio.link/alqamar/playlist.m3u8" },
  { id: "al-shallal-tv",         titulo: "Al Shallal TV",          tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://amg01480-alshallalfze-alshallal-ono-q0hfg.amagi.tv/playlist.m3u8" },
  { id: "al-sharqiya-min-kabla", titulo: "Al Sharqiya Min Kabla",  tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://svs.itworkscdn.net/kablatvlive/kabtv1.smil/playlist.m3u8" },
  { id: "al-wousta-tv",          titulo: "Al Wousta TV",           tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://svs.itworkscdn.net/alwoustalive/alwoustatv.smil/playlist.m3u8" },
  { id: "al-yaum-tv",            titulo: "Al Yaum TV",             tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://hlspackager.akamaized.net/live/DB/ALYAUM_TV/HLS/ALYAUM_TV.m3u8" },
  { id: "cnbc-arabiya",          titulo: "CNBC Arabiya",           tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://cnbc-live.akamaized.net/cnbc/master.m3u8" },
  { id: "fujairah-tv",           titulo: "Fujairah TV",            tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live.kwikmotion.com/fujairahlive/fujairah.smil/playlist.m3u8" },
  { id: "mbc1",                  titulo: "MBC 1",                  tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-1/15cf99af5de54063fdabfefe66adc075/index.m3u8" },
  { id: "mbc4",                  titulo: "MBC 4",                  tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-4/24f134f1cd63db9346439e96b86ca6ed/index.m3u8" },
  { id: "mbc5",                  titulo: "MBC 5",                  tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-5/ee6b000cee0629411b666ab26cb13e9b/index.m3u8" },
  { id: "mbc-drama",             titulo: "MBC Drama",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-drama/2c28a458e2f3253e678b07ac7d13fe71/index.m3u8" },
  { id: "mbc-persia",            titulo: "MBC Persia",             tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://hls.mbcpersia.live/hls/stream.m3u8" },
  { id: "nour-tv",               titulo: "Nour TV",                tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://cdn.bestream.io:19360/elfaro4/elfaro4.m3u8" },
  { id: "peace-tv-english",      titulo: "Peace TV English",       tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8" },
  { id: "sharjah-tv",            titulo: "Sharjah TV",             tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live.kwikmotion.com/smc1live/smc1tv.smil/playlist.m3u8" },
  { id: "sharjah2",              titulo: "Sharjah 2",              tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://svs.itworkscdn.net/smc2live/smc2tv.smil/playlist.m3u8" },
  { id: "sky-news-arabia",       titulo: "Sky News Arabia",        tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://live-stream.skynewsarabia.com/c-horizontal-channel/horizontal-stream/index.m3u8" },
  { id: "spacetoon-arabic",      titulo: "Spacetoon Arabic",       tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-spacetoon/d8382fb9ab4b2307058f12c7ea90db54/index.m3u8" },
  { id: "wanasah",               titulo: "Wanasah",                tipo: "AoVivo", poster: "https://i.imgur.com/placeholder.png", video: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-wanasah/13e82ea6232fa647c43b26e8a41f173d/index.m3u8" },

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