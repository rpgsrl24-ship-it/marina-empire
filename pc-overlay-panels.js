(()=>{
"use strict";
if(window.__ME_PC_OVERLAY_PANELS__)return;
window.__ME_PC_OVERLAY_PANELS__=true;

const st=document.createElement("style");
st.id="me-pc-overlay-panels-style";
st.textContent=`
@media(min-width:900px){
  body{overflow:hidden!important}
  #home.screen{
    display:block!important;
    position:fixed!important;
    inset:58px 112px 10px 112px!important;
    z-index:1!important;
    margin:0!important;
    padding:0!important;
    pointer-events:auto!important;
  }
  #home.screen.hide{
    display:block!important;
    pointer-events:none!important;
  }
  #home.screen.hide .me-live-home-overlay,
  #home.screen.hide .hero{filter:saturate(.92) brightness(.82)}
  #home.screen.hide .me-live-home-contract{opacity:.35!important}
  #home.screen.hide .me-live-home-vhf{opacity:.55!important}
  #home.screen.hide .me-live-home-traffic{opacity:.45!important}

  .screen:not(#home){
    position:fixed!important;
    z-index:5000!important;
    top:72px!important;
    right:118px!important;
    bottom:78px!important;
    left:auto!important;
    width:min(520px,36vw)!important;
    max-width:none!important;
    overflow-y:auto!important;
    overflow-x:hidden!important;
    margin:0!important;
    padding:12px!important;
    border:1px solid rgba(201,164,98,.68)!important;
    border-radius:16px!important;
    background:rgba(5,27,40,.965)!important;
    box-shadow:0 18px 42px rgba(0,0,0,.52)!important;
    backdrop-filter:blur(14px)!important;
  }
  .screen:not(#home).hide{display:none!important}
  .screen:not(#home)>.me-lux-page-head{
    min-height:84px!important;
    margin:0 0 10px!important;
    padding:12px 14px!important;
    border-radius:12px!important
  }
  .screen:not(#home)>.me-lux-page-head h1{font-size:24px!important;margin:2px 0!important}
  .screen:not(#home)>.me-lux-page-head p{font-size:11px!important;margin:0!important}
  .screen:not(#home)>.panel{margin:8px 0!important;padding:12px!important}
  .screen:not(#home) button{min-height:38px}
  
  #map.screen{
    left:160px!important;
    right:160px!important;
    width:auto!important;
  }
  #map.screen .grid{grid-template-columns:minmax(0,1fr)!important}
  #map.screen .grid>.panel:last-child{display:none!important}
  #map.screen #interactiveMapDisplay{min-height:430px!important}
  
  #missions.screen{width:min(500px,34vw)!important}
  #fleet.screen{width:min(540px,36vw)!important}
  #marinas.screen{width:min(560px,37vw)!important}
  #office.screen{width:min(560px,37vw)!important}
  #marketplace.screen{width:min(580px,38vw)!important}
  #profile.screen{width:min(500px,34vw)!important}
  #credits.screen{width:min(460px,32vw)!important}
  #headquarters.screen{width:min(560px,37vw)!important}

  .me-pc-panel-close{
    position:fixed;z-index:9999;top:82px;right:128px;
    width:34px;height:34px;min-height:34px!important;padding:0!important;
    border-radius:50%!important;border:1px solid #c7a15e!important;
    background:#0b3041!important;color:#f2d59a!important;
    font-size:18px!important;line-height:1!important;
    box-shadow:0 4px 14px rgba(0,0,0,.35)!important
  }
  #map:not(.hide)~.me-pc-panel-close{right:170px}
}
@media(min-width:900px) and (max-width:1199px){
  .screen:not(#home){
    right:108px!important;
    width:min(430px,39vw)!important;
  }
  #missions.screen,#profile.screen{width:min(400px,36vw)!important}
  #fleet.screen,#marinas.screen,#office.screen,#headquarters.screen{width:min(430px,39vw)!important}
  #marketplace.screen{width:min(450px,40vw)!important}
  #credits.screen{width:min(380px,34vw)!important}
}
`;
document.head.appendChild(st);

const close=document.createElement("button");
close.type="button";
close.className="me-pc-panel-close";
close.id="mePcPanelClose";
close.textContent="×";
close.title="Chiudi pannello";
close.style.display="none";
document.body.appendChild(close);

function active(){
 return [...document.querySelectorAll(".screen")].find(s=>s.id!=="home"&&!s.classList.contains("hide"))||null;
}
function sync(){
 if(innerWidth<900){close.style.display="none";return}
 const a=active();
 close.style.display=a?"block":"none";
 close.style.right=a?.id==="map"?"170px":"128px";
 document.body.classList.toggle("me-pc-panel-open",!!a);
}
close.addEventListener("click",()=>{
 if(typeof showTab==="function")showTab("home");
 setTimeout(sync,40);
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&innerWidth>=900&&active()&&typeof showTab==="function")showTab("home");
});
document.querySelectorAll(".screen").forEach(s=>new MutationObserver(sync).observe(s,{attributes:true,attributeFilter:["class"]}));
window.addEventListener("resize",sync);
setTimeout(sync,250);
})();