// ─── Helpers ─────────────────────────────────────────────────────────────────
const ls = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: k => localStorage.removeItem(k),
};

const API = "https://tvxbox-backend-1.onrender.com";

function getToken()    { return ls.get("sb_token"); }
function getPerfilId() { return ls.get("sb_perfil_id"); }

function headers(comPerfil = false) {
  const h = { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` };
  if (comPerfil) h["x-perfil-id"] = getPerfilId();
  return h;
}

async function apiFetch(path, opts = {}) {
  try {
    const r = await fetch(API + path, opts);
    if (r.status === 401) { logout(); return null; }
    // 402 = sem assinatura ativa: redireciona para login mostrando banner
    if (r.status === 402) {
      window.location.href = "login.html?sem_assinatura=1";
      return null;
    }
    return await r.json();
  } catch {
    return null;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function logout() {
  ls.del("sb_token");
  ls.del("sb_perfil_id");
  ls.del("sb_perfil_nome");
  window.location.href = "login.html";
}

function verificarLogin() {
  const pagina = window.location.pathname;
  const livres = ["/login.html", "/cadastro.html"];
  if (!getToken() && !livres.some(p => pagina.endsWith(p))) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}
verificarLogin();

// ─── Estado global ────────────────────────────────────────────────────────────
let catalogoData = null;
let userData = { favoritos: [], continuarAssistindo: [] };

// ─── Normalizar dados do backend ──────────────────────────────────────────────
function normalizarCatalogo(data) {
  function normEp(ep) {
    if (!ep.video && ep.video_url) ep.video = ep.video_url;
    if (!ep.videoDublado && ep.video_url_dub) ep.videoDublado = ep.video_url_dub;
    if (!ep.videoLegendado && ep.video_url_leg) ep.videoLegendado = ep.video_url_leg;
    if (!ep.videoDublado && !ep.videoLegendado) {
      ep.videoDublado   = ep.video;
      ep.videoLegendado = ep.video;
    }
    return ep;
  }
  function normItem(item) {
    if (item.temporadas) {
      item.temporadas = item.temporadas.map(t => ({
        ...t,
        episodios: (t.episodios || []).map(normEp)
      }));
    }
    return item;
  }
  const cats = ['destaques','animes','series','aulas','mangas','aoVivo'];
  cats.forEach(cat => { if (data[cat]) data[cat] = data[cat].map(normItem); });
  return data;
}

// ─── Canais ao vivo embutidos ─────────────────────────────────────────────────
const CANAIS_BUILTIN = [
  { id:"adesso-tv", titulo:"Adesso TV", tipo:"AoVivo", poster:"https://i.imgur.com/KgetM8j.png", video:"https://cdn.jmvstream.com/w/LVW-9715/LVW9715_12B26T62tm/playlist.m3u8" },
  { id:"com-brasil", titulo:"COM Brasil", tipo:"AoVivo", poster:"https://i.imgur.com/GrjGwKM.png", video:"https://br5093.streamingdevideo.com.br/abc/abc/playlist.m3u8" },
  { id:"conexao-tv", titulo:"Conexão TV", tipo:"AoVivo", poster:"https://i.imgur.com/CJ9SPsZ.png", video:"https://5a57bda70564a.streamlock.net/conexaotv/conexaotv.sdp/playlist.m3u8" },
  { id:"eutv", titulo:"EUTV", tipo:"AoVivo", poster:"https://i.imgur.com/8PxpamC.png", video:"https://cdn.jmvstream.com/w/LVW-8719/LVW8719_AcLVAxWy5J/playlist.m3u8" },
  { id:"fala-litoral", titulo:"Fala Litoral", tipo:"AoVivo", poster:"https://i.imgur.com/NF6PL8O.png", video:"https://5c483b9d1019c.streamlock.net/falalitoraltv/falalitoraltv/playlist.m3u8" },
  { id:"rbatv", titulo:"RBATV", tipo:"AoVivo", poster:"https://i.imgur.com/ZWFxlU1.png", video:"https://cdn.live.br1.jmvstream.com/w/LVW-15748/LVW15748_Yed7yzLuRC/playlist.m3u8" },
  { id:"sbt-interior", titulo:"SBT Interior", tipo:"AoVivo", poster:"https://i.imgur.com/IkZfa4j.png", video:"https://cdn.jmvstream.com/w/LVW-10801/LVW10801_Xvg4R0u57n/playlist.m3u8" },
  { id:"sertao-tv", titulo:"Sertão TV", tipo:"AoVivo", poster:"https://i.imgur.com/b5xOCsC.png", video:"http://wz4.dnip.com.br/sertaotv/sertaotv.sdp/playlist.m3u8" },
  { id:"tv-mais-marica", titulo:"TV Mais Maricá", tipo:"AoVivo", poster:"https://i.imgur.com/lgCRX7q.png", video:"https://5cf4a2c2512a2.streamlock.net/tvmaismarica/tvmaismarica/playlist.m3u8" },
  { id:"tv-nbn", titulo:"TVNBN", tipo:"AoVivo", poster:"https://i.imgur.com/zoHBxn1.png", video:"https://cdn.jmvstream.com/w/LVW-8410/LVW8410_uiZOVm6vz1/playlist.m3u8" },
  { id:"tv-passo-fundo", titulo:"TV Passo Fundo", tipo:"AoVivo", poster:"https://i.imgur.com/QFE6TiV.png", video:"https://5a57bda70564a.streamlock.net/tvpasso/tvpasso.sdp/playlist.m3u8" },
  { id:"tv-sul-minas", titulo:"TV Sul de Minas", tipo:"AoVivo", poster:"https://i.imgur.com/hPh8cxK.png", video:"https://5cf4a2c2512a2.streamlock.net/tvsuldeminas/tvsuldeminas/playlist.m3u8" },
  { id:"tv-vila-real", titulo:"TV Vila Real", tipo:"AoVivo", poster:"https://i.imgur.com/Z1uWe7g.png", video:"https://cdn.jmvstream.com/w/LVW-10841/LVW10841_mT77z9o2cP/playlist.m3u8" },
  { id:"tvcom-df", titulo:"TVCOM DF", tipo:"AoVivo", poster:"https://i.imgur.com/uxefHY3.png", video:"https://5b7f3c45ab7c2.streamlock.net/8008/smil:8008.smil/playlist.m3u8?DVR=" },
  { id:"canal-38", titulo:"Canal 38", tipo:"AoVivo", poster:"https://i.imgur.com/co7TCWC.png", video:"https://cdn.jmvstream.com/w/LVW-8503/LVW8503_d0V5oduFlK/playlist.m3u8" },
  { id:"plena-tv", titulo:"Plena TV", tipo:"AoVivo", poster:"https://i.imgur.com/lH4RT7b.png", video:"https://cdn.jmvstream.com/w/LVW-9591/LVW9591_PmXtgATnaS/playlist.m3u8" },
  { id:"stz-tv", titulo:"STZ TV", tipo:"AoVivo", poster:"https://i.imgur.com/SeF2I7q.png", video:"https://cdn.live.br1.jmvstream.com/webtv/AVJ-12952/playlist/playlist.m3u8" },
  { id:"tv-sim-cachoeiro", titulo:"TV Sim Cachoeiro", tipo:"AoVivo", poster:"https://i.imgur.com/t5oUK3C.png", video:"https://5cf4a2c2512a2.streamlock.net/8104/8104/playlist.m3u8" },
  { id:"tv-sim-colatina", titulo:"TV Sim Colatina", tipo:"AoVivo", poster:"https://i.imgur.com/t5oUK3C.png", video:"https://5cf4a2c2512a2.streamlock.net/8132/8132/playlist.m3u8" },
  { id:"tv-sim-sao-mateus", titulo:"TV Sim São Mateus", tipo:"AoVivo", poster:"https://i.imgur.com/t5oUK3C.png", video:"https://5cf4a2c2512a2.streamlock.net/8236/8236/playlist.m3u8" },
  { id:"tv-zoom", titulo:"TV Zoom", tipo:"AoVivo", poster:"https://i.imgur.com/jCGrjf5.png", video:"https://cdn.jmvstream.com/w/LVW-9730/LVW9730_LmUwslM8jt/playlist.m3u8" },
  { id:"despertar-tv", titulo:"Despertar TV", tipo:"AoVivo", poster:"https://res.cloudinary.com/dpkehkbpv/image/upload/v1721839192/logo/mixtv/despertar_tv_ieb2l3.png", video:"https://cdn.live.br1.jmvstream.com/webtv/pejexypz/playlist/playlist.m3u8" },
  { id:"fonte-tv", titulo:"Fonte TV", tipo:"AoVivo", poster:"https://i.imgur.com/7q2BmNc.png", video:"http://flash.softhost.com.br:1935/fonte/fontetv/live.m3u8" },
  { id:"nova-era-tv", titulo:"Nova Era TV", tipo:"AoVivo", poster:"https://i.imgur.com/IK3F9Uq.png", video:"http://wz3.dnip.com.br:1935/novaeratv/novaeratv.sdp/live.m3u8" },
  { id:"tv-aparecida", titulo:"TV Aparecida", tipo:"AoVivo", poster:"https://i.imgur.com/kxrja0X.png", video:"https://cdn.jmvstream.com/w/LVW-9716/LVW9716_HbtQtezcaw/playlist.m3u8" },
  { id:"tv-cancao-nova", titulo:"TV Canção Nova", tipo:"AoVivo", poster:"https://i.imgur.com/OaM9hkH.png", video:"https://5c65286fc6ace.streamlock.net/cancaonova/CancaoNova.stream_720p/playlist.m3u8" },
  { id:"tv-terceiro-anjo", titulo:"TV Terceiro Anjo", tipo:"AoVivo", poster:"https://i.imgur.com/PExKWNv.png", video:"https://streamer1.streamhost.org/salive/GMI3anjoh/playlist.m3u8" },
  { id:"boas-novas", titulo:"Boas Novas", tipo:"AoVivo", poster:"https://i.imgur.com/ZqhizdP.png", video:"https://cdn.jmvstream.com/w/LVW-9375/LVW9375_6i0wPBCHYc/playlist.m3u8" },
  { id:"chroma-tv", titulo:"Chroma TV", tipo:"AoVivo", poster:"https://i.imgur.com/SnaIMgj.png", video:"https://5c483b9d1019c.streamlock.net/8054/8054/playlist.m3u8" },
  { id:"tv-aratu", titulo:"TV Aratu", tipo:"AoVivo", poster:"https://i.imgur.com/LCETtuk.png", video:"https://cdn.jmvstream.com/w/LVW-8379/LVW8379_rIq6ZYiIiA/playlist.m3u8" },
  { id:"tv-clube", titulo:"TV Clube", tipo:"AoVivo", poster:"https://i.imgur.com/CpXjcyE.png", video:"https://5c483b9d1019c.streamlock.net/8186/8186/playlist.m3u8" },
  { id:"tv-max", titulo:"TV MAX", tipo:"AoVivo", poster:"https://i.imgur.com/2Pg0baJ.png", video:"https://5cf4a2c2512a2.streamlock.net/tvmax/tvmax/playlist.m3u8" },
  { id:"tv-pantanal", titulo:"TV Pantanal MS", tipo:"AoVivo", poster:"https://i.imgur.com/0FOmktl.png", video:"https://5a2b083e9f360.streamlock.net/tvpantanal/tvpantanal.sdp/playlist.m3u8" },
  { id:"tv-vicosa", titulo:"TV Viçosa", tipo:"AoVivo", poster:"https://i.imgur.com/TZF55f9.png", video:"http://wz4.dnip.com.br/fratevitv/fratevitv.sdp/playlist.m3u8" },
  { id:"1001-noites", titulo:"1001 Noites", tipo:"AoVivo", poster:"https://i.imgur.com/dWA9y2J.png", video:"https://cdn.jmvstream.com/w/LVW-8155/ngrp:LVW8155_41E1ciuCvO_all/playlist.m3u8" },
  { id:"tv-ufg", titulo:"TV UFG", tipo:"AoVivo", poster:"https://i.imgur.com/Yp3dbJo.png", video:"http://flash.softhost.com.br:1935/ufg/tvufgweb/playlist.m3u8" },
  { id:"unisul-tv", titulo:"UNISUL TV", tipo:"AoVivo", poster:"https://i.imgur.com/N0TvAFz.png", video:"https://sitetv.brasilstream.com.br/hls/sitetv/index.m3u8?token=" },
  { id:"boktv", titulo:"BOK TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://livestream2.bokradio.co.za/hls/Bok5c.m3u8" },
  { id:"gnf-tv", titulo:"GNF TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://oqgdrb8my4rm-hls-live.5centscdn.com/GNF02/bcea197d8b00f79cb716c6288a861000.sdp/playlist.m3u8" },
  { id:"homebase-tv", titulo:"Homebase TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://viewmedia7219.bozztv.com/wmedia/viewmedia100/web_022/Stream/playlist.m3u8" },
  { id:"hope-channel-africa", titulo:"Hope Channel Africa", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://jstre.am/live/jsl:i1onRBELcGV.m3u8" },
  { id:"ln24sa", titulo:"LN24SA", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://cdnstack.internetmultimediaonline.org/ln24/ln24.stream/playlist.m3u8" },
  { id:"loveworld-sat", titulo:"LoveworldSAT", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://cdnstack.internetmultimediaonline.org/lwsat/lwsat.stream/index.m3u8" },
  { id:"nuview-tv", titulo:"NuView TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://viewmedia7219.bozztv.com/wmedia/viewmedia100/web_002/Stream/playlist.m3u8" },
  { id:"redemption-tv", titulo:"Redemption TV Ministry", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live.nixsat.com/play/rtm/index.m3u8" },
  { id:"rlw-tv", titulo:"RLW TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://webstreaming-8.viewmedia.tv/web_119/Stream/playlist.m3u8" },
  { id:"rov-tv", titulo:"ROV TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://viewmedia7219.bozztv.com/wmedia/viewmedia100/web_012/Stream/playlist.m3u8" },
  { id:"wildearth", titulo:"WildEarth", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01290-wildearth-oando/playlist.m3u8" },
  { id:"amc-af", titulo:"AMC", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://amchls.wns.live/hls/stream.m3u8" },
  { id:"bahar-tv", titulo:"Bahar TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://59d39900ebfb8.streamlock.net/bahartv/bahartv/playlist.m3u8" },
  { id:"chekad-tv", titulo:"Chekad TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://go5lmqxjyawb-hls-live.5centscdn.com/Chekad/271ddf829afeece44d8732757fba1a66.sdp/chunks.m3u8" },
  { id:"dunya-naw-tv", titulo:"Dunya Naw TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://dunyanhls.wns.live/hls/stream.m3u8" },
  { id:"eslah-tv", titulo:"Eslah TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://eslahtvhls.wns.live/hls/stream.m3u8" },
  { id:"hewad-tv", titulo:"Hewad TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"http://51.210.199.58/hls/stream.m3u8" },
  { id:"iman-tv", titulo:"Iman TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live.relentlessinnovations.net:1936/imantv/imantv/playlist.m3u8" },
  { id:"kayhan-tv", titulo:"Kayhan TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://playout395.livestreamingcdn.com/live/Stream1/playlist.m3u8" },
  { id:"rta", titulo:"RTA", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA1)/index.m3u8" },
  { id:"rta-education", titulo:"RTA Education", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA4)/index.m3u8" },
  { id:"rta-news", titulo:"RTA News", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA2)/index.m3u8" },
  { id:"rta-sport", titulo:"RTA Sport", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA3)/index.m3u8" },
  { id:"shams-tv", titulo:"Shams TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://fflive-darya-educationtv.b-cdn.net/master.m3u8" },
  { id:"shamshad-tv", titulo:"Shamshad TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://5a1178b42cc03.streamlock.net/shamshadtelevision/shamshadtelevision/playlist.m3u8" },
  { id:"sharq-radio-tv", titulo:"Sharq Radio TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://59nyqa5elwap-hls-live.5centscdn.com/Sharq/eec89088ee408b80387155272b113256.sdp/playlist.m3u8" },
  { id:"tamadon-tv", titulo:"Tamadon TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://hls.tamadon.live/hls/stream.m3u8" },
  { id:"tolo-news", titulo:"Tolo News", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://raw.githubusercontent.com/taodicakhia/IPTV_Exception/master/channels/af/tolonews.m3u8" },
  { id:"albkanale-music", titulo:"AlbKanale Music TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://albportal.net/albkanalemusic.m3u8" },
  { id:"cna-al", titulo:"CNA Albania", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live1.mediadesk.al/cnatvlive.m3u8" },
  { id:"euronews-albania", titulo:"Euronews Albania", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://gjirafa-video-live.gjirafa.net/gjvideo-live/2dw-zuf-1c9-pxu/index.m3u8" },
  { id:"news24-al", titulo:"News 24 Albania", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://tv.balkanweb.com/news24/livestream/playlist.m3u8" },
  { id:"ora-news", titulo:"Ora News", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live1.mediadesk.al/oranews.m3u8" },
  { id:"report-tv", titulo:"Report TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://deb10stream.duckdns.org/hls/stream.m3u8" },
  { id:"rtsh1", titulo:"RTSH 1", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"http://178.33.11.6:8696/live/rtsh1ott/playlist.m3u8" },
  { id:"rtsh2", titulo:"RTSH 2", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"http://178.33.11.6:8696/live/rtsh2/playlist.m3u8" },
  { id:"rtsh24", titulo:"RTSH 24", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"http://178.33.11.6:8696/live/rtsh24/playlist.m3u8" },
  { id:"rtsh-shqip", titulo:"RTSH Shqip", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"http://178.33.11.6:8696/live/rtshshqip/playlist.m3u8" },
  { id:"rtsh-sport", titulo:"RTSH Sport", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"http://178.33.11.6:8696/live/rtshsport/playlist.m3u8" },
  { id:"syri-tv", titulo:"Syri TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://stream.syritv.al/live/syritv/playlist.m3u8" },
  { id:"vizion-plus", titulo:"Vizion Plus", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://tringliveviz.akamaized.net/delta/105/out/u/qwaszxerdfcvrtryuy.m3u8" },
  { id:"zjarr-tv", titulo:"Zjarr TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://zjarr.future.al/hls/playlist.m3u8" },
  { id:"abya-yala-tv", titulo:"Abya Yala TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://seo.tv.bo/tv/LIpSEO-TV-8.m3u8" },
  { id:"atb-la-paz", titulo:"ATB La Paz", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://stream.atb.com.bo/live/daniel/index.m3u8" },
  { id:"bolivia-tv72", titulo:"Bolivia TV 7.2", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://video1.getstreamhosting.com:1936/8224/8224/playlist.m3u8" },
  { id:"bolivision", titulo:"Bolivisión", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://alba-bo-bolivision-bolivision.stream.mediatiquestream.com/index.m3u8" },
  { id:"ctv-bo", titulo:"CTV Bolivia", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live.ctvbolivia.com/hls/ctv.m3u8" },
  { id:"fap-tv", titulo:"FAP TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://nd106.republicaservers.com/hls/c7284/index.m3u8" },
  { id:"ftv-bo", titulo:"FTV Bolivia", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://master.tucableip.com/ftvhd/index.m3u8" },
  { id:"palenque-tv", titulo:"Palenque TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://tv.bitstreaming.net:3234/live/palenquetvlive.m3u8" },
  { id:"pat-la-paz", titulo:"PAT La Paz", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://www.redpat.tv/proxylpz/index.m3u8" },
  { id:"red-cctv", titulo:"Red CCTV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://solo.disfrutaenlared.com:1936/redcctv/redcctv/playlist.m3u8" },
  { id:"red-tv-shop", titulo:"Red TV Shop", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://master.tucableip.com/redtvshop/index.m3u8" },
  { id:"red-uno-sc", titulo:"Red Uno Santa Cruz", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://master.tucableip.com/muxredunosc/index.m3u8" },
  { id:"rtp-bo", titulo:"RTP Bolivia", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://rtp.noxun.net/hls/stream.m3u8" },
  { id:"tdt-multimedia", titulo:"TDT Multimedia", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://video01.kshost.com.br:4443/juan6318/juan6318/playlist.m3u8" },
  { id:"tv-off", titulo:"TV OFF", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://seo.tv.bo/tv/TV-OFF.m3u8" },
  { id:"unifranz", titulo:"Unifranz", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live.enhdtv.com:8081/8192/index.m3u8" },
  { id:"univalle-tv", titulo:"Univalle Televisión", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://master.tucableip.com/univalletv/playlist.m3u8" },
  { id:"zoy-tv-turcas", titulo:"Zoy TV Turcas", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://mio.zoymilton.com/ZoyTurcas/index.m3u8" },
  { id:"zoy-tv-plus", titulo:"ZoyTV Plus", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://mio.zoymilton.com/ZoyPlus/index.m3u8" },
  { id:"nhk-sogo", titulo:"NHK総合 (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/fAZ2BEZ.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS291&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"nhk-etele", titulo:"NHK Eテレ (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/WxtftlO.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS292&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"nippon-tv", titulo:"日本テレビ (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/ecbM7QS.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS294&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"tv-asahi", titulo:"テレビ朝日 (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/5XnMfcR.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS295&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"tbs-tv", titulo:"TBSテレビ (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/jIZ9TlO.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS296&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"tv-tokyo", titulo:"テレビ東京 (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/U8jBxEi.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS297&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"fuji-tv", titulo:"フジテレビ (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/epJYc7P.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS298&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"nhk-bs", titulo:"NHK BS (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/t0uZcSR.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS101&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"animax-jp", titulo:"Animax (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/jO0qUvj.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=BS236&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"nhk-world", titulo:"NHK World Japan", tipo:"AoVivo", poster:"https://i.imgur.com/Mhw1Ihk.png", video:"https://master.nhkworld.jp/nhkworld-tv/playlist/live.m3u8" },
  { id:"shop-channel-jp", titulo:"Shop Channel (Japão)", tipo:"AoVivo", poster:"https://i.imgur.com/CCMAF7W.png", video:"https://stream3.shopch.jp/HLS/master.m3u8" },
  { id:"kids-station-jp", titulo:"Kids Station (Japão)", tipo:"AoVivo", poster:"https://www.lyngsat-logo.com/logo/tv/kk/kidsstation.png", video:"https://stream01.willfonk.com/live_playlist.m3u8?cid=CS330&r=FHD&ccode=JP&m=d0:20:20:04:35:cc&t=0d6938cb3dcf4b79848bc1753a59daf1" },
  { id:"kbs1-kr", titulo:"KBS 1TV (Coreia)", tipo:"AoVivo", poster:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/KBS_1_logo.svg/512px-KBS_1_logo.svg.png", video:"http://mytv.dothome.co.kr/ch/public/1.php" },
  { id:"ebs1-kr", titulo:"EBS 1 (Coreia)", tipo:"AoVivo", poster:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/EBS_1TV_Logo.svg/512px-EBS_1TV_Logo.svg.png", video:"https://ebsonair.ebs.co.kr/ebs1familypc/familypc1m/playlist.m3u8" },
  { id:"ebs2-kr", titulo:"EBS 2 (Coreia)", tipo:"AoVivo", poster:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/EBS_2TV_Logo.svg/512px-EBS_2TV_Logo.svg.png", video:"https://ebsonair.ebs.co.kr/ebs2familypc/familypc1m/playlist.m3u8" },
  { id:"arirang-kr", titulo:"Arirang (Coreia)", tipo:"AoVivo", poster:"https://i.imgur.com/RuHZ6Dx.png", video:"http://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8" },
  { id:"kbs-world", titulo:"KBS World", tipo:"AoVivo", poster:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/KBS_World_%282009%29.svg/512px-KBS_World_%282009%29.svg.png", video:"http://ye23.vip/z7z8/2021/kbs2020.php?id=3" },
  { id:"ajman-tv", titulo:"Ajman TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://cdn1.logichost.in/ajmantv/live/playlist.m3u8" },
  { id:"al-arabiya", titulo:"Al Arabiya", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8" },
  { id:"al-arabiya-business", titulo:"Al Arabiya Business", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live.alarabiya.net/alarabiapublish/aswaaq.smil/playlist.m3u8" },
  { id:"al-qamar-tv", titulo:"Al Qamar TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://streamer3.premio.link/alqamar/playlist.m3u8" },
  { id:"al-shallal-tv", titulo:"Al Shallal TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://amg01480-alshallalfze-alshallal-ono-q0hfg.amagi.tv/playlist.m3u8" },
  { id:"al-sharqiya-min-kabla", titulo:"Al Sharqiya Min Kabla", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://svs.itworkscdn.net/kablatvlive/kabtv1.smil/playlist.m3u8" },
  { id:"al-wousta-tv", titulo:"Al Wousta TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://svs.itworkscdn.net/alwoustalive/alwoustatv.smil/playlist.m3u8" },
  { id:"al-yaum-tv", titulo:"Al Yaum TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://hlspackager.akamaized.net/live/DB/ALYAUM_TV/HLS/ALYAUM_TV.m3u8" },
  { id:"cnbc-arabiya", titulo:"CNBC Arabiya", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://cnbc-live.akamaized.net/cnbc/master.m3u8" },
  { id:"fujairah-tv", titulo:"Fujairah TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live.kwikmotion.com/fujairahlive/fujairah.smil/playlist.m3u8" },
  { id:"mbc1", titulo:"MBC 1", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-1/15cf99af5de54063fdabfefe66adc075/index.m3u8" },
  { id:"mbc4", titulo:"MBC 4", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-4/24f134f1cd63db9346439e96b86ca6ed/index.m3u8" },
  { id:"mbc5", titulo:"MBC 5", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-5/ee6b000cee0629411b666ab26cb13e9b/index.m3u8" },
  { id:"mbc-drama", titulo:"MBC Drama", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-drama/2c28a458e2f3253e678b07ac7d13fe71/index.m3u8" },
  { id:"mbc-persia", titulo:"MBC Persia", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://hls.mbcpersia.live/hls/stream.m3u8" },
  { id:"nour-tv", titulo:"Nour TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://cdn.bestream.io:19360/elfaro4/elfaro4.m3u8" },
  { id:"peace-tv-english", titulo:"Peace TV English", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://dzkyvlfyge.erbvr.com/PeaceTvEnglish/index.m3u8" },
  { id:"sharjah-tv", titulo:"Sharjah TV", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live.kwikmotion.com/smc1live/smc1tv.smil/playlist.m3u8" },
  { id:"sharjah2", titulo:"Sharjah 2", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://svs.itworkscdn.net/smc2live/smc2tv.smil/playlist.m3u8" },
  { id:"sky-news-arabia", titulo:"Sky News Arabia", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://live-stream.skynewsarabia.com/c-horizontal-channel/horizontal-stream/index.m3u8" },
  { id:"spacetoon-arabic", titulo:"Spacetoon Arabic", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://shd-gcp-live.edgenextcdn.net/live/bitmovin-spacetoon/d8382fb9ab4b2307058f12c7ea90db54/index.m3u8" },
  { id:"wanasah", titulo:"Wanasah", tipo:"AoVivo", poster:"https://i.imgur.com/placeholder.png", video:"https://shd-gcp-live.edgenextcdn.net/live/bitmovin-wanasah/13e82ea6232fa647c43b26e8a41f173d/index.m3u8" },
];

function mesclarCanais(base, extras) {
  const ids = new Set(base.map(c => c.id));
  return [...base, ...extras.filter(c => !ids.has(c.id))];
}

async function carregarCatalogo() {
  if (navigator.onLine) {
    const data = await apiFetch("/catalogo", { headers: headers() });
    if (data) {
      catalogoData = normalizarCatalogo(data);
      // Canais builtin só aparecem com assinatura ativa (data != null)
      catalogoData.aoVivo = mesclarCanais(catalogoData.aoVivo || [], CANAIS_BUILTIN);
      try {
        const canaisExt = await apiFetch("/canais", { headers: headers() });
        const extras = Array.isArray(canaisExt) ? canaisExt : [];
        catalogoData.aoVivo = mesclarCanais(catalogoData.aoVivo, extras);
      } catch { /* ignora */ }
      ls.set("sb_catalogo_cache", catalogoData);
      return;
    }
    // data==null: pode ser 402 (sem assinatura) — redirecionamento já feito no apiFetch
    return;
  }
  // Fallback offline: só usa cache salvo de sessão anterior (usuário já tinha assinatura)
  const cache = ls.get("sb_catalogo_cache");
  if (cache) {
    catalogoData = cache;
    catalogoData.aoVivo = mesclarCanais(catalogoData.aoVivo || [], CANAIS_BUILTIN);
  } else {
    catalogoData = { destaques:[], animes:[], series:[], aoVivo:[], mangas:[], aulas:[] };
  }
}

async function carregarUserData() {
  if (!getPerfilId()) return;
  const [favs, continuar] = await Promise.all([
    apiFetch("/favoritos",           { headers: headers(true) }),
    apiFetch("/progresso/continuar", { headers: headers(true) }),
  ]);
  if (favs)     userData.favoritos            = favs.map(f => f.id || f.conteudo_id);
  if (continuar) userData.continuarAssistindo = continuar;
}

// ─── Múltiplos perfis ─────────────────────────────────────────────────────────
async function mostrarTelaPerfis() {
  const perfis = await apiFetch("/perfis", { headers: headers() });
  if (!perfis) return;
  if (perfis.length === 1 && !perfis[0].tem_pin) { selecionarPerfil(perfis[0]); return; }

  const overlay = document.createElement("div");
  overlay.id = "perfilOverlay";
  overlay.style.cssText = "position:fixed;inset:0;background:#111;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;";
  overlay.innerHTML = `
    <h1 style="font-size:28px;color:#fff;font-weight:500">Quem está assistindo?</h1>
    <div id="perfilGrid" style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center"></div>
    <button id="btnGerenciarPerfis" style="background:transparent;border:1px solid #555;color:#aaa;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:14px;">Gerenciar perfis</button>
  `;
  const grid = overlay.querySelector("#perfilGrid");
  perfis.forEach(p => {
    const btn = document.createElement("button");
    btn.style.cssText = "background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:10px;";
    btn.innerHTML = `
      <div style="width:90px;height:90px;border-radius:10px;background:#222;font-size:36px;display:flex;align-items:center;justify-content:center;border:2px solid transparent;transition:border-color .2s;" class="perfil-avatar">${p.avatar.length === 1 || p.avatar.startsWith("avat") ? "🎬" : p.avatar}</div>
      <span style="color:#ccc;font-size:14px">${p.nome}</span>
      ${p.tem_pin ? '<span style="color:#777;font-size:12px">🔒 PIN</span>' : ""}
    `;
    btn.addEventListener("mouseenter", () => btn.querySelector(".perfil-avatar").style.borderColor = "#e50914");
    btn.addEventListener("mouseleave", () => btn.querySelector(".perfil-avatar").style.borderColor = "transparent");
    btn.addEventListener("click", () => { if (p.tem_pin) pedirPin(p, overlay); else { selecionarPerfil(p); overlay.remove(); } });
    grid.appendChild(btn);
  });
  if (perfis.length < 4) {
    const btnNovo = document.createElement("button");
    btnNovo.style.cssText = "background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:10px;";
    btnNovo.innerHTML = `<div style="width:90px;height:90px;border-radius:10px;background:#1a1a1a;border:2px dashed #333;font-size:36px;display:flex;align-items:center;justify-content:center;color:#555;">+</div><span style="color:#777;font-size:14px">Novo perfil</span>`;
    btnNovo.addEventListener("click", () => abrirModalCriarPerfil(overlay));
    grid.appendChild(btnNovo);
  }
  overlay.querySelector("#btnGerenciarPerfis").addEventListener("click", () => abrirModalCriarPerfil(overlay));
  document.body.appendChild(overlay);
}

function pedirPin(perfil, overlay) {
  const modal = document.createElement("div");
  modal.style.cssText = "position:absolute;inset:0;background:rgba(0,0,0,.8);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;";
  modal.innerHTML = `
    <h2 style="color:#fff;font-size:20px">PIN do perfil ${perfil.nome}</h2>
    <input id="pinInput" type="password" maxlength="4" placeholder="••••" style="background:#222;border:1px solid #444;color:#fff;font-size:28px;text-align:center;padding:12px 20px;border-radius:10px;width:140px;letter-spacing:8px;">
    <div style="display:flex;gap:10px">
      <button id="btnConfirmarPin" style="background:#e50914;color:#fff;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-size:15px">Entrar</button>
      <button id="btnCancelarPin"  style="background:#222;color:#aaa;border:1px solid #333;padding:12px 24px;border-radius:8px;cursor:pointer">Cancelar</button>
    </div>
    <p id="pinErro" style="color:#ff6b6b;font-size:14px;min-height:18px"></p>
  `;
  modal.querySelector("#btnCancelarPin").addEventListener("click", () => modal.remove());
  modal.querySelector("#btnConfirmarPin").addEventListener("click", async () => {
    const pin = modal.querySelector("#pinInput").value;
    const ok  = await apiFetch(`/perfis/${perfil.id}/pin`, { method:"POST", headers:headers(), body:JSON.stringify({ pin }) });
    if (ok?.ok) { selecionarPerfil(perfil); overlay.remove(); }
    else modal.querySelector("#pinErro").textContent = "PIN incorreto. Tente novamente.";
  });
  overlay.appendChild(modal);
}

function abrirModalCriarPerfil(overlay) {
  const modal = document.createElement("div");
  modal.style.cssText = "position:absolute;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;";
  modal.innerHTML = `
    <div style="background:#1a1a1a;border-radius:16px;padding:32px;width:100%;max-width:380px;border:1px solid #2a2a2a">
      <h2 style="color:#fff;font-size:20px;margin-bottom:20px">Novo perfil</h2>
      <label style="color:#ccc;font-size:13px">Nome</label>
      <input id="nomePerfilInput" placeholder="Ex: Família" style="width:100%;padding:12px;margin:6px 0 14px;border-radius:8px;border:1px solid #333;background:#111;color:#fff;font-size:15px;box-sizing:border-box;">
      <label style="color:#ccc;font-size:13px">PIN (opcional, 4 dígitos)</label>
      <input id="pinPerfilInput" type="password" maxlength="4" placeholder="••••" style="width:100%;padding:12px;margin:6px 0 14px;border-radius:8px;border:1px solid #333;background:#111;color:#fff;font-size:15px;box-sizing:border-box;">
      <label style="display:flex;align-items:center;gap:8px;color:#ccc;font-size:13px;margin-bottom:18px;cursor:pointer"><input type="checkbox" id="infantilCheck"> Perfil infantil</label>
      <div style="display:flex;gap:10px">
        <button id="btnSalvarPerfil"      style="flex:1;background:#e50914;color:#fff;border:none;padding:13px;border-radius:8px;cursor:pointer;font-size:15px">Criar</button>
        <button id="btnFecharModalPerfil" style="background:#222;color:#aaa;border:1px solid #333;padding:13px 18px;border-radius:8px;cursor:pointer">Cancelar</button>
      </div>
      <p id="perfilModalErro" style="color:#ff6b6b;font-size:13px;margin-top:10px;min-height:16px"></p>
    </div>
  `;
  modal.querySelector("#btnFecharModalPerfil").addEventListener("click", () => modal.remove());
  modal.querySelector("#btnSalvarPerfil").addEventListener("click", async () => {
    const nome     = modal.querySelector("#nomePerfilInput").value.trim();
    const pin      = modal.querySelector("#pinPerfilInput").value;
    const infantil = modal.querySelector("#infantilCheck").checked;
    if (!nome) { modal.querySelector("#perfilModalErro").textContent = "Nome obrigatório"; return; }
    const res = await apiFetch("/perfis", { method:"POST", headers:headers(), body:JSON.stringify({ nome, pin: pin || undefined, infantil }) });
    if (res?.id) { modal.remove(); overlay.remove(); mostrarTelaPerfis(); }
    else modal.querySelector("#perfilModalErro").textContent = res?.mensagem || "Erro ao criar perfil";
  });
  overlay.appendChild(modal);
}

function selecionarPerfil(perfil) {
  ls.set("sb_perfil_id",   perfil.id);
  ls.set("sb_perfil_nome", perfil.nome);
}

// ─── Preview hover nos cards ──────────────────────────────────────────────────
let previewTimeout = null;
let previewEl = null;

function criarPreview(item, cardEl) {
  removerPreview();
  previewEl = document.createElement("div");
  previewEl.className = "card-preview";
  const temVideo = item.temporadas?.[0]?.episodios?.[0]?.video;
  previewEl.innerHTML = `
    <div class="preview-media">
      ${temVideo
        ? `<video src="${temVideo}" muted autoplay playsinline loop style="width:100%;height:100%;object-fit:cover;border-radius:10px 10px 0 0"></video>`
        : `<img src="${item.poster}" style="width:100%;height:100%;object-fit:cover;border-radius:10px 10px 0 0">`}
    </div>
    <div class="preview-info">
      <strong>${item.titulo}</strong>
      <div class="preview-meta">
        <span class="preview-tipo">${item.tipo || ""}</span>
        ${item.classificacao ? `<span class="preview-class">${item.classificacao}</span>` : ""}
        ${item.ano ? `<span>${item.ano}</span>` : ""}
      </div>
      ${item.descricao ? `<p class="preview-desc">${item.descricao.slice(0,100)}${item.descricao.length>100?"…":""}</p>` : ""}
    </div>
  `;
  document.body.appendChild(previewEl);
  posicionarPreview(cardEl);
}

function posicionarPreview(cardEl) {
  if (!previewEl) return;
  const rect = cardEl.getBoundingClientRect();
  const pw   = 260;
  let left   = rect.left + (rect.width - pw) / 2;
  left       = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  previewEl.style.cssText = `left:${left}px;top:${rect.bottom + window.scrollY + 6}px;width:${pw}px;`;
}

function removerPreview() {
  if (previewEl) { previewEl.remove(); previewEl = null; }
  clearTimeout(previewTimeout);
}

// ─── Criar card ───────────────────────────────────────────────────────────────
function criarCard(item, onClick) {
  const card = document.createElement("div");
  card.className = "poster-card";
  card.dataset.titulo = (item.titulo || "").toLowerCase();
  card.dataset.tipo   = item.tipo || "";
  card.innerHTML = `
    <img src="${item.poster || "assets/posters/placeholder.jpg"}" alt="${item.titulo}" loading="lazy">
    <div class="info"><h3>${item.titulo}</h3><p>${item.tipo || ""}</p></div>
  `;
  card.addEventListener("click", onClick);
  if (window.matchMedia("(hover:hover)").matches) {
    card.addEventListener("mouseenter", () => { previewTimeout = setTimeout(() => criarPreview(item, card), 500); });
    card.addEventListener("mouseleave", removerPreview);
  }
  return card;
}

// ─── Renderizar rows ──────────────────────────────────────────────────────────
function renderRow(idContainer, lista, tipoClique) {
  const container = document.getElementById(idContainer);
  if (!container) return;
  container.innerHTML = "";
  // Esconde a section pai se não houver itens
  const section = container.closest("section");
  if (!lista.length) {
    if (section) section.style.display = "none";
    return;
  }
  if (section) section.style.display = "";
  lista.forEach(item => {
    let acao = () => window.location.href = `detalhe.html?id=${encodeURIComponent(item.id)}&categoria=${encodeURIComponent(idContainer)}`;
    if (tipoClique === "aoVivo") {
      acao = () => item.video ? (window.location.href = `assistir.html?canal=${encodeURIComponent(item.id)}`) : alert("Vídeo não configurado.");
    }
    container.appendChild(criarCard(item, acao));
  });
}

function buscarListaPorCategoria(cat) {
  if (!catalogoData) return [];
  const mapa = { rowDestaques:"destaques", rowAnimes:"animes", rowSeries:"series", rowAulas:"aulas", rowMangas:"mangas" };
  return catalogoData[mapa[cat]] || [];
}

// CORRIGIDO: busca em todas as categorias para montar links corretos mesmo sem saber a categoria
function buscarItemEmTodoCatalogo(id) {
  if (!catalogoData) return { item:null, cat:null };
  const categorias = [
    { key:"destaques", cat:"rowDestaques" },
    { key:"animes",    cat:"rowAnimes"    },
    { key:"series",    cat:"rowSeries"    },
    { key:"aulas",     cat:"rowAulas"     },
    { key:"mangas",    cat:"rowMangas"    },
  ];
  for (const { key, cat } of categorias) {
    const item = (catalogoData[key] || []).find(x => x.id === id);
    if (item) return { item, cat };
  }
  return { item:null, cat:null };
}

// ─── Favoritos ────────────────────────────────────────────────────────────────
function itemEhFavorito(id) { return userData.favoritos.includes(id); }

async function alternarFavorito(itemId) {
  const res = await apiFetch("/favoritos/toggle", { method:"POST", headers:headers(true), body:JSON.stringify({ conteudoId: itemId }) });
  if (res !== null) {
    if (res.favoritado) userData.favoritos.push(itemId);
    else userData.favoritos = userData.favoritos.filter(x => x !== itemId);
  } else {
    const favs = ls.get("sb_fav_cache") || [];
    const idx = favs.indexOf(itemId);
    if (idx === -1) favs.push(itemId); else favs.splice(idx, 1);
    ls.set("sb_fav_cache", favs);
    userData.favoritos = favs;
  }
  atualizarBotaoFavorito(itemId);
  renderFavoritos();
}

function atualizarBotaoFavorito(id) {
  const btn = document.getElementById("btnFavoritoDetalhe");
  if (!btn) return;
  if (itemEhFavorito(id)) { btn.classList.add("active"); btn.textContent = "✓ Na minha lista"; }
  else { btn.classList.remove("active"); btn.textContent = "+ Minha lista"; }
}

function renderFavoritos() {
  const box = document.getElementById("favoritosBox");
  const row = document.getElementById("favoritosRow");
  if (!box || !row) return;
  const todos = [...(catalogoData?.destaques||[]),...(catalogoData?.animes||[]),...(catalogoData?.series||[]),...(catalogoData?.aulas||[]),...(catalogoData?.aoVivo||[])];
  const itens = todos.filter(i => userData.favoritos.includes(i.id));
  row.innerHTML = "";
  if (!itens.length) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  itens.forEach(item => {
    const ehCanal = (catalogoData?.aoVivo || []).find(x => x.id === item.id);
    if (ehCanal) {
      row.appendChild(criarCard(item, () => item.video ? (window.location.href=`assistir.html?canal=${encodeURIComponent(item.id)}`) : alert("Vídeo não configurado.")));
      return;
    }
    const { cat } = buscarItemEmTodoCatalogo(item.id);
    row.appendChild(criarCard(item, () => window.location.href=`detalhe.html?id=${encodeURIComponent(item.id)}&categoria=${encodeURIComponent(cat||"rowAnimes")}`));
  });
}

// ─── Salvar progresso ─────────────────────────────────────────────────────────
async function salvarProgresso(payload) {
  const res = await apiFetch("/progresso", { method:"POST", headers:headers(true), body:JSON.stringify(payload) });
  if (!res) {
    const fila = ls.get("sb_fila_sync") || [];
    fila.push({ ...payload, ts: Date.now() });
    ls.set("sb_fila_sync", fila);
  }
}

window.addEventListener("online", async () => {
  const fila = ls.get("sb_fila_sync") || [];
  if (!fila.length) return;
  for (const item of fila) await apiFetch("/progresso", { method:"POST", headers:headers(true), body:JSON.stringify(item) });
  ls.del("sb_fila_sync");
});

// ─── Continuar assistindo ─────────────────────────────────────────────────────
function renderContinuarAssistindo() {
  const box  = document.getElementById("continuarBox");
  const row  = document.getElementById("continuarCard");
  if (!box || !row) return;

  // Ordena: mais recente primeiro (o backend já retorna assim, mas garantimos)
  const lista = [...(userData.continuarAssistindo || [])];
  if (!lista.length) { box.classList.add("hidden"); return; }

  row.innerHTML = "";

  lista.forEach(item => {
    const pct = item.duration > 0 ? Math.min(100, Math.round((item.current_time / item.duration) * 100)) : 0;
    const { cat } = buscarItemEmTodoCatalogo(item.conteudo_id);
    const catUrl  = cat || "rowAnimes";
    const link    = `assistir.html?serie=${encodeURIComponent(item.conteudo_id)}&categoria=${encodeURIComponent(catUrl)}&temporada=1&episodio=${encodeURIComponent(item.episodio_id)}&autoplay=1`;

    const restanteSeg = item.duration - item.current_time;
    const restanteMin = Math.max(0, Math.round(restanteSeg / 60));
    const restanteTxt = restanteMin > 1 ? `${restanteMin}min restantes` : "Quase finalizado";

    const bloco = document.createElement("div");
    bloco.className = "continuar-mini-card";
    bloco.innerHTML = `
      <a href="${link}" class="continuar-mini-link">
        <div class="continuar-mini-thumb">
          <img src="${item.poster || item.capa || "assets/posters/placeholder.jpg"}" alt="${item.titulo || ""}">
          <div class="continuar-mini-overlay">▶</div>
        </div>
        <div class="continuar-mini-info">
          <div class="continuar-mini-progress"><div class="continuar-mini-fill" style="width:${pct}%"></div></div>
          <p class="continuar-mini-titulo">${item.titulo || "Sem título"}</p>
          <p class="continuar-mini-ep">${item.ep_titulo || ""}</p>
          <p class="continuar-mini-resto">${restanteTxt}</p>
        </div>
      </a>
    `;
    row.appendChild(bloco);
  });
  box.classList.remove("hidden");
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function renderHome() {
  if (!catalogoData) return;
  renderRow("rowDestaques", catalogoData.destaques || [], "detalhe");
  renderRow("rowAnimes",    catalogoData.animes    || [], "detalhe");
  renderRow("rowSeries",    catalogoData.series    || [], "detalhe");
  renderCanaisAoVivo("lista-canais", catalogoData.aoVivo || []);
  iniciarBusca();
  iniciarFiltros();
  renderContinuarAssistindo();
  renderFavoritos();
}

function renderAulasPage() {
  if (!document.getElementById("rowAulas")) return;
  renderRow("rowAulas", catalogoData?.aulas || [], "detalhe");
}

function renderMangasPage() {
  const row = document.getElementById("rowMangas");
  if (!row) return;
  (catalogoData?.mangas || []).forEach(manga => row.appendChild(criarCard(manga, () => abrirCapitulosManga(manga))));
}

async function abrirCapitulosManga(manga) {
  const capBox    = document.getElementById("capitulosBox");
  const capGrid   = document.getElementById("capitulosGrid");
  const titulo    = document.getElementById("mangaSelecionadoTitulo");
  const btnVoltar = document.getElementById("btnVoltarMangas");
  if (!capBox || !capGrid) return;
  titulo.textContent = manga.titulo;
  capGrid.innerHTML  = "<p style='color:#888'>Carregando capítulos...</p>";
  capBox.classList.remove("hidden");
  window.scrollTo({ top: capBox.offsetTop - 80, behavior:"smooth" });
  const capitulos = await apiFetch(`/mangas/${manga.id}/capitulos`, { headers: headers() });
  const lista     = capitulos || manga.capitulos || [];
  capGrid.innerHTML = "";
  if (!lista.length) { capGrid.innerHTML = "<p style='color:#888'>Nenhum capítulo disponível.</p>"; return; }
  lista.forEach(cap => {
    const card = document.createElement("div");
    card.className = "capitulo-card";
    card.innerHTML = `<h3>Cap. ${cap.numero}</h3><p>${cap.titulo}</p>`;
    card.addEventListener("click", () => abrirLeitorManga(cap, manga));
    capGrid.appendChild(card);
  });
  btnVoltar.addEventListener("click", () => { capBox.classList.add("hidden"); window.scrollTo({ top:0, behavior:"smooth" }); }, { once:true });
}

function abrirLeitorManga(cap, manga) {
  const overlay   = document.getElementById("mangaReaderOverlay");
  const frame     = document.getElementById("readerFrame");
  const titulo    = document.getElementById("readerTitulo");
  const btnFechar = document.getElementById("btnReaderFechar");
  if (!overlay || !frame) return;
  const pdfUrl = cap.pdfUrl?.startsWith("http") ? cap.pdfUrl : `${API}/video/pdf/${cap.pdfUrl}`;
  titulo.textContent = `${manga.titulo} — Cap. ${cap.numero}: ${cap.titulo}`;
  frame.src = pdfUrl;
  overlay.classList.add("ativo");
  document.body.style.overflow = "hidden";
  overlay.requestFullscreen?.().catch(() => {});
  btnFechar.onclick = () => { overlay.classList.remove("ativo"); frame.src=""; document.body.style.overflow=""; if (document.fullscreenElement) document.exitFullscreen?.(); };
}

// ─── Detalhe ─────────────────────────────────────────────────────────────────
function renderDetalhe() {
  const box = document.getElementById("detalheConteudo");
  if (!box) return;

  const params = new URLSearchParams(location.search);
  const id     = params.get("id");
  const cat    = params.get("categoria");

  let item = buscarListaPorCategoria(cat).find(c => c.id === id);
  if (!item) item = buscarItemEmTodoCatalogo(id).item;
  if (!item) { box.innerHTML = "<h1>Não encontrado.</h1>"; return; }

  box.innerHTML = `
    <img src="${item.poster || ""}" alt="${item.titulo}">
    <div><h1>${item.titulo}</h1><p>${item.descricao || ""}</p></div>
  `;

  const btnFav  = document.getElementById("btnFavoritoDetalhe");
  const btnPlay = document.getElementById("btnAssistirDetalhe");
  const audioBox= document.getElementById("audioSelectorBox");
  const tempBox = document.getElementById("temporadaBox");
  const tempSel = document.getElementById("temporadaSelect");
  const epGrid  = document.getElementById("episodiosGrid");

  const catReal      = cat || buscarItemEmTodoCatalogo(item.id).cat || "rowAnimes";
  const primeiraTemp = item.temporadas?.[0];
  const primeiroEp   = primeiraTemp?.episodios?.[0];

  // Detecta se o conteúdo tem áudio separado (dub ≠ leg)
  const temAudio = (item.temporadas || []).some(t =>
    (t.episodios || []).some(e => e.videoDublado && e.videoLegendado && e.videoDublado !== e.videoLegendado)
  );

  // Selector de áudio
  let audioModo = ls.get("sb_audio_modo") || "dublado";
  if (audioBox) {
    if (temAudio) {
      audioBox.style.display = "flex";
      audioBox.querySelectorAll(".audio-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.audio === audioModo);
        btn.addEventListener("click", () => {
          audioModo = btn.dataset.audio;
          ls.set("sb_audio_modo", audioModo);
          audioBox.querySelectorAll(".audio-btn").forEach(b => b.classList.toggle("active", b.dataset.audio === audioModo));
        });
      });
    } else {
      audioBox.style.display = "none";
    }
  }

  atualizarBotaoFavorito(item.id);
  if (btnFav)  btnFav.onclick = () => alternarFavorito(item.id);
  if (btnPlay) btnPlay.onclick = () => {
    if (!primeiroEp) { alert("Nenhum episódio disponível."); return; }
    const src = audioModo === "legendado" ? primeiroEp.videoLegendado : primeiroEp.videoDublado;
    if (!src && !primeiroEp.video) { alert("Vídeo não configurado."); return; }
    window.location.href = `assistir.html?serie=${encodeURIComponent(item.id)}&categoria=${encodeURIComponent(catReal)}&temporada=${primeiraTemp.numero}&episodio=${encodeURIComponent(primeiroEp.id)}&audio=${audioModo}&autoplay=1`;
  };

  // Filmes com 1 ep não precisam de grade
  const totalEps = item.temporadas?.reduce((s, t) => s + (t.episodios?.length || 0), 0) || 0;
  if (item.tipo === "Filme" && totalEps <= 1) {
    if (tempBox) tempBox.style.display = "none";
    if (epGrid)  epGrid.innerHTML = "";
    return;
  }

  const tempsComEps = (item.temporadas || []).filter(t => t.episodios?.length > 0);
  if (!tempsComEps.length) {
    if (tempBox) tempBox.style.display = "none";
    if (epGrid)  epGrid.innerHTML = "<p style='color:#888;padding:16px 0'>Nenhum episódio cadastrado ainda.</p>";
    return;
  }

  if (tempBox) tempBox.style.display = "block";
  if (tempSel) {
    tempSel.innerHTML = "";
    tempsComEps.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.numero; opt.textContent = `Temporada ${t.numero}`;
      tempSel.appendChild(opt);
    });
  }

  function mostrarEps(num) {
    const temp = item.temporadas.find(t => t.numero == num);
    if (!epGrid || !temp) return;
    epGrid.innerHTML = "";
    temp.episodios.forEach((ep, idx) => {
      const c = document.createElement("div");
      c.className = "ep-card";
      const prog = (userData.continuarAssistindo || []).find(p => p.episodio_id === ep.id);
      const pct  = prog?.duration > 0 ? Math.min(100, Math.round((prog.current_time / prog.duration) * 100)) : 0;
      c.innerHTML = `
        <h3>EP ${ep.numero || idx + 1}</h3>
        <p>${ep.titulo}</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      `;
      c.addEventListener("click", () => {
        const src = audioModo === "legendado" ? ep.videoLegendado : ep.videoDublado;
        if (!src && !ep.video) { alert("Sem vídeo configurado."); return; }
        window.location.href = `assistir.html?serie=${encodeURIComponent(item.id)}&categoria=${encodeURIComponent(catReal)}&temporada=${num}&episodio=${encodeURIComponent(ep.id)}&audio=${audioModo}&autoplay=1`;
      });
      epGrid.appendChild(c);
    });
  }

  mostrarEps(tempsComEps[0]?.numero);
  if (tempSel) tempSel.addEventListener("change", e => mostrarEps(e.target.value));
}

// ─── Player ───────────────────────────────────────────────────────────────────
let hlsInstance = null;

function carregarVideoHLS(videoEl, src) {
  if (!src) return;
  if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
  const ehHLS = src.includes(".m3u8");
  if (ehHLS && typeof Hls !== "undefined" && Hls.isSupported()) {
    hlsInstance = new Hls({ enableWorker:true, lowLatencyMode:true });
    hlsInstance.loadSource(src);
    hlsInstance.attachMedia(videoEl);
  } else {
    videoEl.src = src;
    videoEl.load();
  }
}

// ── NOVO: Preview na barra de progresso do vídeo ─────────────────────────────
// Mostra um tooltip com o tempo quando o usuário passa o mouse na região dos controles
function instalarPreviewProgressbar(videoEl) {
  const anterior = document.getElementById("progressTooltip");
  if (anterior) anterior.remove();

  const shell = videoEl.closest(".player-shell") || videoEl.parentElement;

  const tooltip = document.createElement("div");
  tooltip.id = "progressTooltip";
  tooltip.style.cssText = `
    position:absolute; bottom:62px; pointer-events:none; display:none; z-index:30;
    background:rgba(0,0,0,.88); color:#fff; padding:5px 12px; border-radius:6px;
    font-size:13px; font-weight:700; white-space:nowrap;
    box-shadow:0 2px 10px rgba(0,0,0,.6); transform:translateX(-50%);
  `;
  shell.appendChild(tooltip);

  function formatarTempo(seg) {
    const s  = Math.floor(Math.max(0, seg));
    const h  = Math.floor(s / 3600);
    const m  = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`
      : `${m}:${String(ss).padStart(2,"0")}`;
  }

  videoEl.addEventListener("mousemove", e => {
    if (!videoEl.duration || isNaN(videoEl.duration)) return;
    const rect   = videoEl.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    // A progressbar nativa fica nos últimos ~48px do elemento vídeo
    if (mouseY < rect.height - 48) { tooltip.style.display = "none"; return; }
    const mouseX  = e.clientX - rect.left;
    const pct     = Math.max(0, Math.min(1, mouseX / rect.width));
    tooltip.textContent   = formatarTempo(pct * videoEl.duration);
    tooltip.style.display = "block";
    tooltip.style.left    = `${mouseX}px`;
  });

  videoEl.addEventListener("mouseleave", () => { tooltip.style.display = "none"; });
}

function renderPlayer() {
  const playerInfo  = document.getElementById("playerInfo");
  const videoPlayer = document.getElementById("videoPlayer");
  const btnSkip     = document.getElementById("btnSkipIntro");
  const btnNext     = document.getElementById("btnNextEpisode");
  const clickZone   = document.getElementById("videoClickZone");

  if (!playerInfo || !videoPlayer) return;

  // Instala preview na progressbar
  instalarPreviewProgressbar(videoPlayer);

  if (clickZone) {
    clickZone.addEventListener("click", () => {
      if (videoPlayer.paused) videoPlayer.play().catch(() => {}); else videoPlayer.pause();
    });
  }

  // Tela cheia automática no primeiro play
  const shell = document.querySelector(".player-shell");
  videoPlayer.addEventListener("play", () => {
    const alvo = shell || videoPlayer;
    if (!document.fullscreenElement) alvo.requestFullscreen?.().catch(() => alvo.webkitRequestFullscreen?.());
  }, { once:true });

  const params    = new URLSearchParams(location.search);
  const canalId   = params.get("canal");
  const serieId   = params.get("serie");
  const categoria = params.get("categoria");
  const autoplay  = params.get("autoplay") === "1";

  // ── Canal ao vivo ─────────────────────────────────────────────────────────
  if (canalId) {
    const canal = (catalogoData?.aoVivo || []).find(c => c.id === canalId);
    if (!canal) { playerInfo.innerHTML = "<h1>Canal não encontrado.</h1>"; return; }
    function renderInfoCanal() {
      const favAtivo = itemEhFavorito(canal.id);
      playerInfo.innerHTML = `
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <div><h1>${canal.titulo}</h1><p>${canal.descricao || ""}</p></div>
          <button id="btnFavCanal" style="padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-weight:bold;background:${favAtivo?"#e50914":"#2a2a2a"};color:#fff;border:1px solid ${favAtivo?"#e50914":"#444"};font-size:14px;transition:all .2s;">${favAtivo?"✓ Na minha lista":"+ Minha lista"}</button>
        </div>`;
      document.getElementById("btnFavCanal")?.addEventListener("click", async () => { await alternarFavorito(canal.id); renderInfoCanal(); renderFavoritos(); });
    }
    renderInfoCanal();
    carregarVideoHLS(videoPlayer, canal.video);
    if (autoplay) videoPlayer.addEventListener("canplay", () => videoPlayer.play().catch(() => {}), { once:true });
    return;
  }

  // ── Série/Anime/Filme ─────────────────────────────────────────────────────
  let item = buscarListaPorCategoria(categoria).find(c => c.id === serieId);
  // CORRIGIDO: fallback caso categoria da URL não bata
  if (!item) item = buscarItemEmTodoCatalogo(serieId).item;
  if (!item) { playerInfo.innerHTML = "<h1>Não encontrado.</h1>"; return; }

  let tempNumAtual    = parseInt(params.get("temporada")) || item.temporadas?.[0]?.numero || 1;
  let episodioIdAtual = params.get("episodio") || item.temporadas?.[0]?.episodios?.[0]?.id;
  let audioModo = params.get("audio") || ls.get("sb_audio_modo") || "dublado";
  ls.set("sb_audio_modo", audioModo);

  function getEpisodioAtual() {
    return item.temporadas.find(t => t.numero === tempNumAtual)?.episodios.find(e => e.id === episodioIdAtual) || null;
  }

  function carregarVideo(ep) {
    if (!ep) { playerInfo.innerHTML = "<h1>Episódio não encontrado.</h1>"; return; }
    let videoUrl = ep.video;
    if (audioModo === "legendado" && ep.videoLegendado) videoUrl = ep.videoLegendado;
    else if (audioModo === "dublado" && ep.videoDublado) videoUrl = ep.videoDublado;
    playerInfo.innerHTML = `<h1>${item.titulo}</h1><p>${ep.titulo}${ep.descricao?" — "+ep.descricao:""}</p>`;
    carregarVideoHLS(videoPlayer, videoUrl);
    videoPlayer.addEventListener("loadedmetadata", () => { if (autoplay) videoPlayer.play().catch(() => {}); }, { once:true });
    renderEpisodiosBar();
    atualizarBotaoProximo();
  }

  function injetarControlesPlayer() {
    document.getElementById("playerControlesBar")?.remove();
    const bar = document.createElement("div");
    bar.id = "playerControlesBar";
    bar.style.cssText = "background:#111;padding:20px 24px;border-top:1px solid #222;max-width:1400px;margin:0 auto;";

    // Linha 1: temporada + próximo + áudio
    const linha1 = document.createElement("div");
    linha1.style.cssText = "display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px;";

    if (item.temporadas.length > 1) {
      const labelTemp  = document.createElement("span");
      labelTemp.textContent = "Temporada:";
      labelTemp.style.cssText = "color:#aaa;font-size:14px;font-weight:600;";
      const selectTemp = document.createElement("select");
      selectTemp.id = "playerTempSelect";
      selectTemp.style.cssText = "background:#222;color:#fff;border:1px solid #444;padding:8px 14px;border-radius:8px;font-size:14px;cursor:pointer;";
      item.temporadas.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.numero; opt.textContent = `Temporada ${t.numero}`;
        if (t.numero === tempNumAtual) opt.selected = true;
        selectTemp.appendChild(opt);
      });
      selectTemp.addEventListener("change", () => {
        tempNumAtual = parseInt(selectTemp.value);
        episodioIdAtual = item.temporadas.find(t => t.numero === tempNumAtual)?.episodios?.[0]?.id;
        carregarVideo(getEpisodioAtual());
      });
      linha1.appendChild(labelTemp);
      linha1.appendChild(selectTemp);
    }

    linha1.appendChild(Object.assign(document.createElement("div"), { style:"flex:1" }));

    // ── NOVO: Botão próximo episódio na barra de controles ─────────────────
    const btnProximoBar = document.createElement("button");
    btnProximoBar.id = "btnProximoBar";
    btnProximoBar.textContent = "Próximo ▶";
    btnProximoBar.style.cssText = "padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;border:1px solid #e50914;background:#e50914;color:#fff;display:none;transition:opacity .2s;";
    btnProximoBar.addEventListener("click", () => {
      const proximo = encontrarProximo(item, tempNumAtual, episodioIdAtual);
      if (!proximo) return;
      episodioIdAtual = proximo.episodio.id;
      tempNumAtual    = proximo.temporada;
      const sel = document.getElementById("playerTempSelect");
      if (sel) sel.value = tempNumAtual;
      carregarVideo(proximo.episodio);
      window.scrollTo({ top:0, behavior:"smooth" });
    });
    linha1.appendChild(btnProximoBar);

    // Botões dublado/legendado
    const audioBtns = document.createElement("div");
    audioBtns.style.cssText = "display:flex;gap:8px;";
    ["dublado","legendado"].forEach(modo => {
      const btn = document.createElement("button");
      btn.dataset.audio = modo;
      btn.textContent   = modo === "dublado" ? "🔊 Dublado" : "💬 Legendado";
      btn.style.cssText = `padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;border:1px solid #444;transition:all .2s;background:${audioModo===modo?"#e50914":"#222"};color:#fff;border-color:${audioModo===modo?"#e50914":"#444"};`;
      btn.addEventListener("click", () => {
        audioModo = modo; ls.set("sb_audio_modo", audioModo);
        audioBtns.querySelectorAll("button").forEach(b => {
          const a = b.dataset.audio === audioModo;
          b.style.background = a ? "#e50914" : "#222";
          b.style.borderColor = a ? "#e50914" : "#444";
        });
        const ep = getEpisodioAtual(); if (!ep) return;
        const t  = videoPlayer.currentTime;
        let url  = ep.video;
        if (audioModo === "legendado" && ep.videoLegendado) url = ep.videoLegendado;
        else if (audioModo === "dublado" && ep.videoDublado) url = ep.videoDublado;
        videoPlayer.src = url; videoPlayer.load();
        videoPlayer.addEventListener("loadedmetadata", () => { videoPlayer.currentTime = t; videoPlayer.play().catch(() => {}); }, { once:true });
      });
      audioBtns.appendChild(btn);
    });
    linha1.appendChild(audioBtns);
    bar.appendChild(linha1);

    // Linha 2: grade de episódios
    const linha2 = document.createElement("div");
    linha2.id = "playerEpisodiosGrid";
    linha2.style.cssText = "display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin;scrollbar-color:#333 transparent;";
    bar.appendChild(linha2);

    document.querySelector(".player-main")?.insertAdjacentElement("afterend", bar);
  }

  function renderEpisodiosBar() {
    const grid = document.getElementById("playerEpisodiosGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const temp = item.temporadas.find(t => t.numero === tempNumAtual);
    if (!temp) return;
    temp.episodios.forEach((ep, idx) => {
      const btn   = document.createElement("button");
      const ativo = ep.id === episodioIdAtual;
      btn.style.cssText = `min-width:120px;max-width:150px;padding:10px 12px;border-radius:10px;cursor:pointer;text-align:left;border:2px solid ${ativo?"#e50914":"#2a2a2a"};background:${ativo?"#2a0a0a":"#1a1a1a"};color:${ativo?"#fff":"#ccc"};flex-shrink:0;transition:all .2s;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
      btn.innerHTML = `<div style="font-weight:bold;margin-bottom:3px;color:${ativo?"#e50914":"#888"}">EP ${ep.numero||idx+1}</div><div style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ep.titulo}</div>`;
      btn.addEventListener("click", () => { episodioIdAtual = ep.id; carregarVideo(ep); window.scrollTo({top:0,behavior:"smooth"}); });
      btn.addEventListener("mouseenter", () => { if (ep.id !== episodioIdAtual) { btn.style.borderColor="#555"; btn.style.background="#222"; } });
      btn.addEventListener("mouseleave", () => { if (ep.id !== episodioIdAtual) { btn.style.borderColor="#2a2a2a"; btn.style.background="#1a1a1a"; } });
      grid.appendChild(btn);
    });
    setTimeout(() => {
      const btns = grid.querySelectorAll("button");
      const idx  = temp.episodios.findIndex(e => e.id === episodioIdAtual);
      if (btns[idx]) btns[idx].scrollIntoView({ inline:"center", behavior:"smooth" });
    }, 100);
  }

  function atualizarBotaoProximo() {
    const proximo = encontrarProximo(item, tempNumAtual, episodioIdAtual);
    // Botão flutuante
    if (btnNext) {
      if (proximo) {
        btnNext.classList.remove("hidden");
        btnNext.onclick = () => {
          episodioIdAtual = proximo.episodio.id; tempNumAtual = proximo.temporada;
          const sel = document.getElementById("playerTempSelect"); if (sel) sel.value = tempNumAtual;
          carregarVideo(proximo.episodio); window.scrollTo({top:0,behavior:"smooth"});
        };
      } else { btnNext.classList.add("hidden"); }
    }
    // Botão na barra de controles
    const btnBar = document.getElementById("btnProximoBar");
    if (btnBar) btnBar.style.display = proximo ? "block" : "none";
  }

  injetarControlesPlayer();
  const epInicial = getEpisodioAtual();
  if (!epInicial) { playerInfo.innerHTML = "<h1>Episódio não encontrado.</h1>"; return; }
  carregarVideo(epInicial);

  if (btnSkip) {
    btnSkip.classList.remove("hidden");
    btnSkip.onclick = () => { videoPlayer.currentTime = Math.min(videoPlayer.currentTime + 60, videoPlayer.duration - 1); };
  }

  let saveTimer = null;
  function salvar() {
    if (!videoPlayer.duration || isNaN(videoPlayer.duration)) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => salvarProgresso({ episodioId: episodioIdAtual, conteudoId: item.id, currentTime: Math.floor(videoPlayer.currentTime), duration: Math.floor(videoPlayer.duration) }), 500);
  }

  videoPlayer.addEventListener("timeupdate", () => {
    salvar();
    if (btnSkip) { const r = videoPlayer.duration - videoPlayer.currentTime; btnSkip.classList.toggle("hidden", r <= 60); }
    const proximo = encontrarProximo(item, tempNumAtual, episodioIdAtual);
    if (btnNext && proximo) { const r = videoPlayer.duration - videoPlayer.currentTime; btnNext.classList.toggle("hidden", r > 60); }
  });
  videoPlayer.addEventListener("pause", salvar);
}

function encontrarProximo(item, tempNum, epId) {
  const temp = item.temporadas.find(t => t.numero === tempNum);
  if (!temp) return null;
  const idx = temp.episodios.findIndex(e => e.id === epId);
  if (idx < temp.episodios.length - 1) return { temporada:tempNum, episodio:temp.episodios[idx+1] };
  const proxTemp = item.temporadas.find(t => t.numero === tempNum + 1);
  if (proxTemp?.episodios.length) return { temporada:proxTemp.numero, episodio:proxTemp.episodios[0] };
  return null;
}

// ─── Ao Vivo ──────────────────────────────────────────────────────────────────
function renderCanaisAoVivo(containerId, lista) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = "";
  lista.forEach(item => {
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:relative;display:inline-block;";
    const card = criarCard(item, () => item.video ? (window.location.href=`assistir.html?canal=${encodeURIComponent(item.id)}`) : alert("Vídeo não configurado."));
    const btnFav = document.createElement("button");
    btnFav.className = "canal-fav-btn";
    btnFav.title = "Adicionar à minha lista";
    atualizarEstiloBtnFavCanal(btnFav, item.id);
    btnFav.addEventListener("click", async e => {
      e.stopPropagation();
      const jaNosCat = (catalogoData?.aoVivo||[]).find(c => c.id === item.id);
      if (!jaNosCat && catalogoData) { catalogoData.aoVivo = catalogoData.aoVivo||[]; catalogoData.aoVivo.push(item); }
      await alternarFavorito(item.id);
      atualizarEstiloBtnFavCanal(btnFav, item.id);
      renderFavoritos();
    });
    wrap.appendChild(card); wrap.appendChild(btnFav); grid.appendChild(wrap);
  });
}

function atualizarEstiloBtnFavCanal(btn, id) {
  const fav = itemEhFavorito(id);
  btn.textContent = fav ? "✓" : "+";
  btn.style.cssText = `position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;border:none;cursor:pointer;font-size:16px;font-weight:bold;display:flex;align-items:center;justify-content:center;background:${fav?"#e50914":"rgba(0,0,0,.65)"};color:#fff;z-index:10;transition:background .2s,transform .15s;box-shadow:0 2px 8px rgba(0,0,0,.5);`;
}

function renderAoVivoPage() { renderCanaisAoVivo("canaisGrid", catalogoData?.aoVivo || []); }

// ─── Busca e filtros ──────────────────────────────────────────────────────────
function iniciarBusca() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", () => {
    const t = input.value.toLowerCase().trim();
    document.querySelectorAll(".poster-card").forEach(c => c.classList.toggle("hidden", !!(t && !c.dataset.titulo?.includes(t))));
  });
}

function iniciarFiltros() {
  const botoes = document.querySelectorAll(".filter-btn");
  if (!botoes.length) return;
  botoes.forEach(btn => btn.addEventListener("click", () => {
    botoes.forEach(b => b.classList.remove("active")); btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll("#rowDestaques .poster-card,#rowAnimes .poster-card,#rowSeries .poster-card")
      .forEach(c => c.classList.toggle("hidden", f !== "todos" && c.dataset.tipo !== f));
  }));
}

// ─── Menu mobile ─────────────────────────────────────────────────────────────
function iniciarMenuMobile() {
  const toggle = document.getElementById("menuToggle");
  const nav    = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => { const a = nav.classList.toggle("nav-aberto"); toggle.setAttribute("aria-expanded", a); toggle.innerHTML = a ? "✕" : "☰"; });
  document.addEventListener("click", e => { if (!toggle.contains(e.target) && !nav.contains(e.target)) { nav.classList.remove("nav-aberto"); toggle.innerHTML = "☰"; } });
}

// ─── Usuário no header ────────────────────────────────────────────────────────
function configurarUsuario() {
  const nome    = document.getElementById("usuarioNome");
  const btnSair = document.getElementById("btnSair");
  if (nome)    nome.textContent = ls.get("sb_perfil_nome") || localStorage.getItem("usuarioEmail") || "";
  if (btnSair) btnSair.addEventListener("click", logout);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
(async function init() {
  await carregarCatalogo();
  const temPerfil = !!getPerfilId();
  const naHome    = !!(document.getElementById("rowDestaques"));
  if (!temPerfil && naHome) await mostrarTelaPerfis();
  await carregarUserData();
  configurarUsuario();
  renderHome();
  renderDetalhe();
  renderPlayer();
  renderAoVivoPage();
  renderAulasPage();
  renderMangasPage();
  iniciarMenuMobile();
})();