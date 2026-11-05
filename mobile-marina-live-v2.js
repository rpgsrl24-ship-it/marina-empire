(()=>{
"use strict";
if(window.__ME_MOBILE_MARINA_LIVE_V2__)return;
function meViewportWidth(){return typeof globalThis!=="undefined"&&Number.isFinite(Number(globalThis.innerWidth))?Number(globalThis.innerWidth):1024}
window.__ME_MOBILE_MARINA_LIVE_V2__=true;

const style=document.createElement("style");
style.id="me-mobile-marina-live-v2-style";
style.textContent=`
@media(max-width:740px){
  #marinas{
    padding-bottom:96px!important;
  }
  #marinas>.me-lux-page-head,
  #marinas #me-marina-ad-strip,
  #marinas .marinas-feature,
  #marinas .marina-command-center,
  #marinas .me-secondary-details,
  #marinas .me-marina-advertising,
  #marinas #me-online-berths,
  #marinas .marina-list-heading,
  #marinas .marina-business-heading,
  #marinas .marina-business-heading + p,
  #marinas #businessList{
    display:none!important;
  }

  #marinas>.panel{
    padding:8px!important;
    border-radius:14px!important;
    min-height:0!important;
  }

  #marinas #meMobileMarinasMore{
    display:block!important;
    width:100%!important;
    min-height:46px!important;
    margin:0 0 8px!important;
    border:1px solid #b89452!important;
    border-radius:11px!important;
    background:#103d50!important;
    color:#e7c77f!important;
    font-size:10px!important;
    font-weight:900!important;
  }

  #marinas:not(.me-mobile-expanded) #marinaList{
    display:block!important;
    margin:0!important;
    padding:0!important;
  }
  #marinas:not(.me-mobile-expanded) #marinaList>.item{
    display:none!important;
  }
  #marinas:not(.me-mobile-expanded) #marinaList>.item.me-current-marina-card{
    display:block!important;
    min-height:0!important;
    height:auto!important;
    max-height:none!important;
    margin:0!important;
    padding:0!important;
    border:0!important;
    border-radius:0!important;
    background:transparent!important;
    box-shadow:none!important;
    overflow:visible!important;
  }
  #marinas:not(.me-mobile-expanded) #marinaList>.item.me-current-marina-card > :not(.me-live-marina){
    display:none!important;
  }

  #marinas:not(.me-mobile-expanded) .me-live-marina{
    position:static!important;
    display:flex!important;
    flex-direction:column!important;
    width:100%!important;
    min-height:0!important;
    height:auto!important;
    max-height:none!important;
    margin:0!important;
    padding:0!important;
    border:1px solid rgba(194,154,96,.58)!important;
    border-radius:14px!important;
    background:linear-gradient(180deg,#08283a,#061b29)!important;
    overflow:hidden!important;
  }

  #marinas:not(.me-mobile-expanded) .me-live-marina-head{
    order:0!important;
    padding:10px!important;
    font-size:10px!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-intensity{
    order:1!important;
    margin:0 9px 7px!important;
    padding:7px 8px!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-player-status{
    order:2!important;
    margin:0 9px 7px!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-water{
    order:3!important;
    display:block!important;
    height:88px!important;
    min-height:88px!important;
    max-height:88px!important;
    flex:0 0 88px!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-feed{
    order:4!important;
    padding:8px 9px!important;
    gap:5px!important;
    font-size:9px!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-feed-row:nth-child(n+3){
    display:none!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-vhf{
    order:5!important;
    margin:0 9px 8px!important;
    padding:9px!important;
    border:1px solid rgba(126,185,207,.35)!important;
    border-left:3px solid #7eb9cf!important;
    border-radius:10px!important;
    background:#0a3040!important;
    font-size:9px!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-vhf-career{
    display:none!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-vhf-action{
    display:block!important;
    width:100%!important;
    min-height:44px!important;
    margin-top:7px!important;
    font-size:10px!important;
    font-weight:900!important;
  }
  #marinas:not(.me-mobile-expanded) .me-live-community{
    order:6!important;
    max-height:70px!important;
    padding:7px 9px!important;
    overflow:hidden!important;
  }

  /* Keep Marina Live compact on small phones: one primary live card, no repeated secondary cards. */
  #marinas:not(.me-mobile-expanded) .me-live-marina ~ .me-live-marina,
  #marinas:not(.me-mobile-expanded) .me-current-marina-card .item .item:nth-of-type(n+4){
    display:none!important;
  }

  @media(max-width:390px){
    #marinas:not(.me-mobile-expanded) .me-live-water{
      height:72px!important;
      min-height:72px!important;
      max-height:72px!important;
      flex-basis:72px!important;
    }
    #marinas:not(.me-mobile-expanded) .me-live-vhf{
      margin-bottom:6px!important;
      padding:8px!important;
    }
    #marinas:not(.me-mobile-expanded) .me-live-vhf-preview{
      display:none!important;
    }
  }
  #marinas:not(.me-mobile-expanded) .me-live-community-row:nth-child(n+2){
    display:none!important;
  }

  #marinas.me-mobile-expanded #marinaList{
    display:grid!important;
    margin-top:8px!important;
  }
  #marinas.me-mobile-expanded #marinaList>.item{
    display:block!important;
  }
  #marinas.me-mobile-expanded #marinaList>.item.me-current-marina-card{
    min-height:0!important;
    height:auto!important;
  }
  #marinas.me-mobile-expanded #marinaList>.item.me-current-marina-card > *{
    display:revert!important;
  }
  #marinas.me-mobile-expanded .marina-business-heading,
  #marinas.me-mobile-expanded .marina-business-heading + p,
  #marinas.me-mobile-expanded #businessList{
    display:block!important;
  }
}
@media(min-width:741px){
  #me-mobile-marina-live-v2-style{display:none}
}
`;
document.head.appendChild(style);

function normalize(){
  if(meViewportWidth()>740)return;
  const section=document.getElementById("marinas");
  const list=document.getElementById("marinaList");
  if(!section||!list)return;

  let current=null;
  try{
    if(typeof state!=="undefined"&&state?.port){
      current=list.querySelector('[data-marina-card="'+CSS.escape(String(state.port))+'"]');
    }
  }catch(_){}
  current=current||list.querySelector(".me-current-marina-card")||list.firstElementChild;
  if(!current)return;

  list.querySelectorAll("[data-marina-card]").forEach(card=>card.classList.toggle("me-current-marina-card",card===current));

  const live=current.querySelector(".me-live-marina");
  if(live){
    live.style.removeProperty("min-height");
    live.style.removeProperty("height");
    live.style.removeProperty("max-height");
  }
  current.style.removeProperty("min-height");
  current.style.removeProperty("height");
  current.style.removeProperty("max-height");
}

const marinas=document.getElementById("marinas");
const list=document.getElementById("marinaList");
if(marinas)new MutationObserver(()=>setTimeout(normalize,40)).observe(marinas,{attributes:true,attributeFilter:["class"]});
if(list)new MutationObserver(()=>setTimeout(normalize,40)).observe(list,{childList:true,subtree:true});
window.addEventListener("marina-empire-updated",()=>setTimeout(normalize,40));
window.addEventListener("resize",normalize);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalize,{once:true});else normalize();
setTimeout(normalize,300);
})();