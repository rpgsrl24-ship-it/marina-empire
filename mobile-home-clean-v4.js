(()=>{
"use strict";
if(window.__ME_MOBILE_HOME_CLEAN_V4__)return;
function meViewportWidth(){return typeof globalThis!=="undefined"&&Number.isFinite(Number(globalThis.innerWidth))?Number(globalThis.innerWidth):1024}
window.__ME_MOBILE_HOME_CLEAN_V4__=true;

const st=document.createElement("style");
st.id="me-mobile-home-clean-v4-style";
st.textContent=`
@media(max-width:899px){
  /* One navigation system only: bottom bar */
  html body .me-command-rail,
  html body .me-command-bottom,
  html body .me-command-drawer{display:none!important}
  html body .mobile-game-nav{display:grid!important}
  html body #meMobileMore{display:grid!important}
  html body #meMobileMore.hide{display:none!important}
  html body{padding-bottom:calc(86px + env(safe-area-inset-bottom,0px))!important}
  html body .shell{padding-left:10px!important;padding-right:10px!important}

  /* One HUD only */
  html body .stats{display:none!important}
  html body .me-compact-hud{
    display:grid!important;
    grid-template-columns:repeat(4,minmax(0,1fr))!important;
    gap:6px!important;
    margin:6px 0 8px!important
  }

  /* Desktop/live ticker must never render as wrapped text on a phone */
  html body #mePcLiveTicker,
  html body .me-pc-live-ticker{display:none!important}

  /* Old live overlay is not used on portrait mobile Home */
  #home .me-live-home-overlay{display:none!important}

  #meMobileMarinaLiveCard{
    display:grid!important;
    grid-template-columns:minmax(0,1fr) auto!important;
    gap:10px!important;
    align-items:center!important;
    width:100%!important;
    margin:6px 0 10px!important;
    padding:10px 12px!important;
    border:1px solid rgba(205,166,96,.62)!important;
    border-radius:13px!important;
    background:linear-gradient(145deg,rgba(8,43,58,.96),rgba(5,28,42,.96))!important;
    box-shadow:0 7px 20px rgba(0,0,0,.28)!important;
    color:#edf6f7!important
  }
  #meMobileMarinaLiveCard small{
    display:block!important;
    color:#e5c37e!important;
    font-size:9px!important;
    font-weight:900!important;
    letter-spacing:.08em!important
  }
  #meMobileMarinaLiveCard strong{
    display:block!important;
    margin-top:3px!important;
    color:#fff0c9!important;
    font-size:12px!important;
    line-height:1.22!important;
    white-space:nowrap!important;
    overflow:hidden!important;
    text-overflow:ellipsis!important
  }
  #meMobileMarinaLiveCard button{
    min-height:38px!important;
    padding:7px 10px!important;
    border-color:#caa45f!important;
    background:#123f52!important;
    color:#ffe1a4!important;
    font-size:9px!important;
    font-weight:900!important
  }

  /* Keep the mobile Home content clear of browser/bottom navigation */
  #home{padding-bottom:96px!important}
  #home .me-mobile-home-dashboard{padding-top:0!important}
}
@media(min-width:900px){
  #meMobileMarinaLiveCard{display:none!important}
}
`;
document.head.appendChild(st);

function portName(){
  try{
    if(typeof port==="function"&&typeof state!=="undefined")return port(state?.port||"rimini")?.name||"Marina";
    return typeof state!=="undefined"&&state?.port?String(state.port):"Marina";
  }catch(_){return"Marina"}
}
function liveSummary(){
  try{
    const snap=window.MarinaEmpireLiveTraffic?.snapshot?.();
    const n=Number(snap?.volume)||snap?.items?.length||0;
    const first=snap?.items?.[0];
    if(first)return portName()+" · "+n+" unità · "+first.name+" "+String(first.action||"").toLowerCase();
    return portName()+" · MONDO VIVO";
  }catch(_){return portName()+" · MONDO VIVO"}
}
function ensure(){
  if(meViewportWidth()>899)return;
  const hud=document.getElementById("meCompactHud");
  const home=document.getElementById("home");
  if(!home)return;
  let card=document.getElementById("meMobileMarinaLiveCard");
  if(!card){
    card=document.createElement("div");
    card.id="meMobileMarinaLiveCard";
    card.innerHTML='<div><small>⚓ MARINA LIVE</small><strong id="meMobileMarinaLiveText">Mondo vivo</strong></div><button type="button" id="meMobileMarinaLiveOpen">APRI</button>';
    if(hud&&hud.parentNode)hud.insertAdjacentElement("afterend",card);
    else home.prepend(card);
    document.getElementById("meMobileMarinaLiveOpen").onclick=()=>{
      if(typeof showTab==="function")showTab("marinas");
    };
  }
  const text=document.getElementById("meMobileMarinaLiveText");
  if(text)text.textContent=liveSummary();
}
function sync(){
  ensure();
  const card=document.getElementById("meMobileMarinaLiveCard");
  const home=document.getElementById("home");
  if(card)card.style.display=(meViewportWidth()<=740&&home&&!home.classList.contains("hide"))?"grid":"none";
  const text=document.getElementById("meMobileMarinaLiveText");
  if(text)text.textContent=liveSummary();
}
window.addEventListener("marina-empire-updated",sync);
window.addEventListener("resize",sync);
document.querySelectorAll(".screen").forEach(s=>new MutationObserver(sync).observe(s,{attributes:true,attributeFilter:["class"]}));
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
setTimeout(sync,500);
setInterval(sync,15000);
})();