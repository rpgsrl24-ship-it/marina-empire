(()=>{
"use strict";
if(window.__ME_COMMAND_DECK__)return;
window.__ME_COMMAND_DECK__=true;

const css=document.createElement("style");
css.id="me-command-deck-style";
css.textContent=`
.me-command-rail,.me-command-bottom,.me-command-drawer{display:none}
@media(max-width:740px){
  body{padding-bottom:76px!important}
  html body .mobile-game-nav,html body #meMobileMore{display:none!important}
  #meGameGuide{display:none!important}
  .shell{padding-left:49px!important;padding-right:49px!important}
  .stats{margin-left:-41px!important;margin-right:-41px!important}
  .top{margin-left:-41px!important;margin-right:-41px!important}

  .me-command-rail{
    position:fixed;top:132px;bottom:82px;z-index:9996;
    display:flex;flex-direction:column;gap:7px;justify-content:flex-start;
    width:42px;padding:4px;background:rgba(3,20,32,.88);
    border:1px solid rgba(194,154,96,.38);backdrop-filter:blur(10px);
    box-shadow:0 8px 22px rgba(0,0,0,.35)
  }
  .me-command-rail.left{left:3px;border-radius:0 12px 12px 0}
  .me-command-rail.right{right:3px;border-radius:12px 0 0 12px}
  .me-command-rail button{
    width:34px;height:42px;min-height:42px;padding:0;border:0;border-radius:9px;
    display:flex;align-items:center;justify-content:center;background:transparent;
    font-size:19px;color:#e7edf0;box-shadow:none
  }
  .me-command-rail button.on{background:#23485a;color:#f4d796;box-shadow:inset 0 0 0 1px rgba(214,181,117,.55)}
  .me-command-rail button:active{transform:scale(.96)}

  .me-command-bottom{
    position:fixed;left:50px;right:50px;bottom:7px;z-index:9997;
    display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;
    padding:8px 9px;background:rgba(6,29,43,.96);border:1px solid #b89458;border-radius:13px;
    box-shadow:0 7px 24px rgba(0,0,0,.48);backdrop-filter:blur(12px)
  }
  .me-command-bottom small{display:block;color:#e0bd7b;font-size:8px;font-weight:900;letter-spacing:.08em}
  .me-command-bottom strong{display:block;margin-top:2px;color:#fff3d0;font-size:11px;line-height:1.18}
  .me-command-bottom button{min-height:40px;padding:8px 10px;font-size:9px;font-weight:900;white-space:normal;border-color:#d1a95e;background:linear-gradient(135deg,#d9b465,#9e6d27);color:#10202b}

  .me-command-drawer{
    position:fixed;top:126px;right:50px;z-index:9998;width:min(260px,calc(100vw - 105px));
    padding:9px;background:#071f2ded;border:1px solid #b89458;border-radius:13px;
    box-shadow:0 12px 28px rgba(0,0,0,.55);backdrop-filter:blur(12px)
  }
  .me-command-drawer.open{display:grid;gap:6px}
  .me-command-drawer button{
    min-height:42px;text-align:left;padding:9px 11px;background:#0b3141;border:1px solid rgba(184,148,82,.35);
    color:#f5e4bc;font-size:10px;font-weight:800
  }
}
@media(max-width:390px){
  .shell{padding-left:45px!important;padding-right:45px!important}
  .me-command-rail{width:39px}
  .me-command-rail button{width:31px;height:40px;min-height:40px;font-size:18px}
  .me-command-bottom{left:46px;right:46px}
}
@media(min-width:741px) and (max-width:899px) and (orientation:landscape){
  body{padding-bottom:0!important}
  html body .mobile-game-nav,html body #meMobileMore{display:none!important}
  #meGameGuide{display:none!important}
  .shell{padding-left:98px!important;padding-right:98px!important;padding-top:54px!important}
  .me-command-rail{
    position:fixed;top:56px;bottom:12px;z-index:9996;
    display:flex;flex-direction:column;gap:8px;justify-content:center;
    width:78px;padding:6px;background:rgba(3,20,32,.90);
    border:1px solid rgba(194,154,96,.45);backdrop-filter:blur(10px);
    box-shadow:0 8px 22px rgba(0,0,0,.36)
  }
  .me-command-rail.left{left:8px;border-radius:14px}
  .me-command-rail.right{right:8px;border-radius:14px}
  .me-command-rail button{
    width:64px;height:58px;min-height:58px;padding:0;border:0;border-radius:10px;
    display:flex;align-items:center;justify-content:center;background:transparent;
    font-size:22px;color:#e7edf0;box-shadow:none
  }
  .me-command-rail button.on{background:#23485a;color:#f4d796;box-shadow:inset 0 0 0 1px rgba(214,181,117,.55)}
  .me-command-bottom{
    position:fixed;left:180px;right:180px;bottom:8px;z-index:9997;
    display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;
    padding:7px 10px;background:rgba(6,29,43,.96);border:1px solid #b89458;border-radius:13px;
    box-shadow:0 7px 24px rgba(0,0,0,.48);backdrop-filter:blur(12px)
  }
  .me-command-bottom small{display:block;color:#e0bd7b;font-size:8px;font-weight:900;letter-spacing:.08em}
  .me-command-bottom strong{display:block;margin-top:2px;color:#fff3d0;font-size:11px;line-height:1.18}
  .me-command-bottom button{min-height:38px;padding:7px 11px;font-size:9px;font-weight:900;border-color:#d1a95e;background:linear-gradient(135deg,#d9b465,#9e6d27);color:#10202b}
  .me-command-drawer{
    position:fixed;top:60px;right:94px;z-index:9998;width:min(270px,36vw);
    padding:9px;background:#071f2ded;border:1px solid #b89458;border-radius:13px;
    box-shadow:0 12px 28px rgba(0,0,0,.55);backdrop-filter:blur(12px)
  }
  .me-command-drawer.open{display:grid;gap:6px}
  .me-command-drawer button{
    min-height:40px;text-align:left;padding:8px 10px;background:#0b3141;border:1px solid rgba(184,148,82,.35);
    color:#f5e4bc;font-size:10px;font-weight:800
  }
}
`;document.head.appendChild(css);

const left=document.createElement("nav");
left.className="me-command-rail left";
left.setAttribute("aria-label","Comandi principali");
left.innerHTML=`
<button data-deck-tab="home" title="Home">⌂</button>
<button data-deck-tab="missions" title="Missioni">🎯</button>
<button data-deck-tab="map" title="Mappa">🗺️</button>
<button data-deck-tab="fleet" title="Flotta">🛥️</button>`;

const right=document.createElement("nav");
right.className="me-command-rail right";
right.setAttribute("aria-label","Comandi laterali");
right.innerHTML=`
<button data-deck-tab="marinas" title="Marine">⚓</button>
<button data-deck-tab="office" title="Attività nautiche">⛵</button>
<button data-deck-community="1" title="Community">💬</button>
<button data-deck-menu="1" title="Altro">☰</button>`;

const drawer=document.createElement("div");
drawer.className="me-command-drawer";
drawer.id="meCommandDrawer";
drawer.innerHTML=`
<button data-deck-tab="marketplace">🛒 Marketplace</button>
<button data-deck-tab="credits">💳 Acquista crediti</button>
<button data-deck-tab="profile">👤 Comandante / Account</button>
<button data-deck-tab="headquarters">🏝️ Isola delle Rose</button>
<button data-deck-help="1">ⓘ Assistenza</button>`;

const bottom=document.createElement("div");
bottom.className="me-command-bottom";
bottom.id="meCommandBottom";
bottom.innerHTML='<div><small>AZIONE CONSIGLIATA</small><strong id="meCommandBottomText">Continua il tuo impero</strong></div><button id="meCommandBottomAction" type="button">GIOCA</button>';

document.body.append(left,right,drawer,bottom);

function active(){return document.querySelector(".screen:not(.hide)")?.id||"home"}
function go(tab){
 drawer.classList.remove("open");
 if(typeof showTab==="function")showTab(tab);
 setTimeout(sync,40);
}
function recommended(){
 try{
  if(typeof state==="undefined"||!state?.name)return {text:"Inizia la tua avventura",label:"INIZIA",tab:"home"};
  if(!state.setupComplete&&(Number(state.voyages)||0)===0)return {text:"Configura yacht e marina di partenza",label:"CONFIGURA",tab:"office"};
  if(state.trip)return {text:"Segui la rotta fino alla marina",label:"SEGUI",tab:"map"};
  const cond=Number(state.condition);
  if(Number.isFinite(cond)&&cond<70)return {text:"Lo yacht ha bisogno di manutenzione",label:"RIPARA",tab:"office"};
  const boatInfo=(typeof boats!=="undefined"&&Array.isArray(boats))?boats.find(b=>b.id===state.boat):null;
  const tank=Number(boatInfo?.tank)||400,fuel=Number(state.fuel)||0;
  if(fuel/tank<.22)return {text:"Carburante basso prima della prossima rotta",label:"RIFORNISCI",tab:"office"};
  if((Number(state.voyages)||0)<3)return {text:"Completa la prossima missione",label:"MISSIONE",tab:"missions"};
  const biz=state.businesses&&typeof state.businesses==="object"?Object.values(state.businesses).filter(Boolean).length:0;
  if(!biz)return {text:"Apri la tua prima attività nautica",label:"ATTIVITÀ",tab:"office"};
  const a=active();
  if(a==="marinas")return {text:"Guarda traffico e incarichi della marina",label:"ATTIVITÀ",target:".me-live-marina"};
  if(a==="fleet")return {text:"Scegli lo yacht e preparati a partire",label:"MISSIONI",tab:"missions"};
  if(a==="marketplace")return {text:"Valuta un affare utile alla tua crescita",label:"MERCATO",target:"#meMarketplaceApp"};
  return {text:"Continua a far crescere il tuo impero",label:"MISSIONI",tab:"missions"};
 }catch(_){return {text:"Continua il tuo impero",label:"GIOCA",tab:"missions"}}
}
function sync(){
 const a=active();
 document.querySelectorAll("[data-deck-tab]").forEach(b=>b.classList.toggle("on",b.dataset.deckTab===a));
 const r=recommended();
 const text=document.getElementById("meCommandBottomText"),btn=document.getElementById("meCommandBottomAction");
 if(text)text.textContent=r.text;
 if(btn){btn.textContent=r.label;btn.onclick=()=>{if(r.tab)go(r.tab);else if(r.target){document.querySelector(r.target)?.scrollIntoView({behavior:"smooth",block:"start"})}}}
}
left.addEventListener("click",e=>{const b=e.target.closest("[data-deck-tab]");if(b)go(b.dataset.deckTab)});
right.addEventListener("click",e=>{
 const b=e.target.closest("[data-deck-tab]");if(b){go(b.dataset.deckTab);return}
 if(e.target.closest("[data-deck-community]")){
   drawer.classList.remove("open");go("office");
   setTimeout(()=>document.getElementById("marinaCommunity")?.scrollIntoView({behavior:"smooth",block:"start"}),120);return;
 }
 if(e.target.closest("[data-deck-menu]"))drawer.classList.toggle("open");
});
drawer.addEventListener("click",e=>{
 const b=e.target.closest("[data-deck-tab]");if(b){go(b.dataset.deckTab);return}
 if(e.target.closest("[data-deck-help]")){
   drawer.classList.remove("open");
   document.getElementById("meSupportDrawer")?.setAttribute("open","");
   document.getElementById("meSupportDrawer")?.scrollIntoView({behavior:"smooth",block:"start"});
 }
});
document.addEventListener("click",e=>{
 if(!e.target.closest(".me-command-drawer")&&!e.target.closest("[data-deck-menu]"))drawer.classList.remove("open");
});
document.querySelectorAll(".screen").forEach(s=>new MutationObserver(sync).observe(s,{attributes:true,attributeFilter:["class"]}));
window.addEventListener("marina-empire-updated",sync);
window.addEventListener("resize",sync);
setTimeout(sync,250);
})();