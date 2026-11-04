(()=>{
"use strict";
if(window.__ME_SCENE_CENTER__)return;
window.__ME_SCENE_CENTER__=true;

const style=document.createElement("style");
style.id="me-scene-center-style";
style.textContent=`
@media(max-width:740px){
  /* MARINA = scena centrale */
  #marinas>.me-lux-page-head{display:none!important}
  #marinas>.panel{padding:4px!important;background:transparent!important;border:0!important;box-shadow:none!important}
  #marinas .marina-list-heading{display:none!important}
  #marinas #marinaList{margin:0!important}
  #marinas #marinaList>[data-marina-card]{display:none!important}
  #marinas #marinaList>.me-current-marina-card,
  #marinas #marinaList>[data-marina-card].me-scene-current{display:block!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
  #marinas #marinaList>.me-current-marina-card>*:not(.me-live-marina),
  #marinas #marinaList>[data-marina-card].me-scene-current>*:not(.me-live-marina){display:none!important}

  #marinas .me-live-marina{
    position:relative!important;
    min-height:calc(100svh - 238px)!important;
    margin:3px 0 9px!important;
    border:1px solid #b99557!important;
    border-radius:18px!important;
    overflow:hidden!important;
    background:#052333!important;
    box-shadow:0 12px 30px #00131da8!important;
  }

  #marinas .me-live-water{
    position:absolute!important;inset:0!important;height:auto!important;min-height:100%!important;
    background:
      linear-gradient(180deg,rgba(3,18,30,.05) 0 24%,rgba(6,54,72,.16) 46%,rgba(4,47,66,.88) 73%,#052d41 100%),
      radial-gradient(ellipse at 68% 18%,rgba(247,220,158,.35),transparent 18%),
      linear-gradient(180deg,#4d91aa 0%,#72b8ca 22%,#98cbd5 36%,#1f7189 37%,#07566e 70%,#04374f 100%)!important;
    filter:none!important;
  }
  #marinas .me-live-water:before{
    content:"";position:absolute;left:-4%;right:-4%;top:27%;height:30%;
    background:
      linear-gradient(155deg,transparent 0 18%,#0b2b34 19% 22%,transparent 23%),
      repeating-linear-gradient(90deg,transparent 0 18px,rgba(8,36,44,.88) 19px 24px,transparent 25px 48px),
      linear-gradient(180deg,transparent 0 52%,rgba(11,43,52,.92) 53% 61%,rgba(7,29,37,.98) 62%);
    clip-path:polygon(0 63%,8% 55%,14% 61%,21% 46%,31% 58%,39% 40%,49% 58%,60% 47%,71% 59%,82% 43%,91% 56%,100% 48%,100% 100%,0 100%);
    opacity:.92;filter:drop-shadow(0 5px 8px rgba(0,0,0,.3));
  }
  #marinas .me-live-water:after{
    content:"";position:absolute;left:-20%;right:-20%;top:57%;bottom:-15%;
    background:
      repeating-radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.11) 0 1px,transparent 2px 15px),
      linear-gradient(110deg,transparent 0 26%,rgba(255,255,255,.06) 34%,transparent 43% 100%);
    animation:meSceneSea 7s linear infinite!important;transform:none!important;
  }

  #marinas .me-live-marina-head{
    position:absolute!important;z-index:8;top:9px;left:9px;right:9px;
    padding:8px 10px!important;border:1px solid rgba(219,183,112,.45);border-radius:10px;
    background:rgba(3,27,40,.75);backdrop-filter:blur(9px);font-size:9px!important
  }
  #marinas .me-live-player-status{
    position:absolute!important;z-index:8;top:54px;left:9px;margin:0!important;
    background:rgba(4,43,48,.72)!important;backdrop-filter:blur(7px)
  }
  #marinas .me-live-intensity{
    position:absolute!important;z-index:8;top:54px;right:9px;margin:0!important;padding:5px 7px!important;
    background:rgba(4,38,50,.78)!important;backdrop-filter:blur(7px)
  }
  #marinas .me-live-intensity small{display:none!important}

  #marinas .me-live-vhf{
    position:absolute!important;z-index:9;left:9px;right:9px;bottom:10px;
    margin:0!important;padding:9px 10px!important;border:1px solid rgba(111,181,206,.48)!important;border-left:3px solid #7fc6df!important;
    border-radius:11px;background:rgba(3,29,42,.86)!important;backdrop-filter:blur(10px);font-size:9px!important
  }
  #marinas .me-live-vhf-preview{margin:5px 0 0!important;padding:5px!important;background:rgba(255,255,255,.045)!important}
  #marinas .me-live-vhf-action{width:100%!important;min-height:38px!important;margin-top:6px!important;font-size:9px!important;font-weight:900!important}
  #marinas .me-live-vhf-career{display:none!important}

  #marinas .me-live-feed{
    position:absolute!important;z-index:8;left:9px;right:9px;bottom:112px;
    padding:6px 8px!important;display:block!important;max-height:54px;overflow:hidden;
    border-radius:9px;background:rgba(2,28,40,.66);backdrop-filter:blur(7px);font-size:8px!important
  }
  #marinas .me-live-feed-row:not(:first-child){display:none!important}
  #marinas .me-live-community{display:none!important}

  #marinas .me-live-boat{
    z-index:5!important;font-size:29px!important;filter:drop-shadow(0 4px 3px rgba(0,0,0,.45))!important
  }
  #marinas .me-live-boat small{font-size:8px!important;padding:2px 5px!important;background:rgba(2,25,34,.8)!important}
  #marinas .me-live-boat:nth-child(1){top:49%!important;--dur:24s!important}
  #marinas .me-live-boat:nth-child(2){top:58%!important;--dur:31s!important}
  #marinas .me-live-boat:nth-child(3){top:68%!important;--dur:27s!important}

  /* i moduli di mondo vivo restano overlay discreti sotto la scena */
  #marinas .me-world-continuity,
  #marinas .me-marina-memory,
  #marinas .me-marina-shift,
  #marinas .me-event-chain,
  #marinas .me-traffic-board{display:none!important}

  /* NAVIGAZIONE = scena centrale */
  #map.me-trip-active>.me-lux-page-head{display:none!important}
  #map.me-trip-active>.grid{display:block!important}
  #map.me-trip-active>.grid>.panel:first-child{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
  #map.me-trip-active #voyageCinema{
    display:block!important;margin:3px 0 9px!important;border:1px solid #b99557!important;border-radius:18px!important;
    min-height:calc(100svh - 238px)!important;background:#052333!important
  }
  #map.me-trip-active #cinemaDock,
  #map.me-trip-active #cinemaSea{height:calc(100svh - 338px)!important;max-height:none!important;min-height:300px!important}
  #map.me-trip-active #meVoyageQuickInfo{display:none!important}
  #map.me-trip-active #cinemaRadio{
    position:absolute!important;z-index:800;left:9px;right:9px;bottom:54px;
    padding:8px 10px!important;border:1px solid rgba(111,181,206,.4);border-radius:10px;
    background:rgba(3,29,42,.82)!important;backdrop-filter:blur(9px)
  }
  #map.me-trip-active #cinemaStatus{font-size:10px!important}
  #map.me-trip-active .grid>.panel:last-child{display:none!important}
}
@keyframes meSceneSea{
  from{transform:translate3d(-2%,0,0)}
  50%{transform:translate3d(2%,1.5%,0)}
  to{transform:translate3d(-2%,0,0)}
}
`;
document.head.appendChild(style);

function currentMarinaCard(){
  const list=document.getElementById("marinaList");
  if(!list)return null;
  const key=String(state?.port||"rimini").toLowerCase();
  return list.querySelector('[data-marina-card="'+CSS.escape(key)+'"]')||list.querySelector(".me-current-marina-card")||list.firstElementChild;
}
function syncMarina(){
  const list=document.getElementById("marinaList");if(!list)return;
  list.querySelectorAll("[data-marina-card]").forEach(x=>x.classList.remove("me-scene-current"));
  currentMarinaCard()?.classList.add("me-scene-current");
}
function syncMap(){
  const map=document.getElementById("map");
  if(map)map.classList.toggle("me-trip-active",!!state?.trip);
}
function sync(){if(typeof state==="undefined")return;syncMarina();syncMap()}
const list=document.getElementById("marinaList");
if(list)new MutationObserver(()=>setTimeout(syncMarina,40)).observe(list,{childList:true,subtree:true});
window.addEventListener("marina-empire-updated",()=>setTimeout(sync,50));
window.addEventListener("marina-world-event",()=>setTimeout(sync,50));
setInterval(sync,30000);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
})();