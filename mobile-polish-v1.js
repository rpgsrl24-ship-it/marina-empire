(()=>{
"use strict";
if(window.__ME_MOBILE_POLISH_V1__)return;
window.__ME_MOBILE_POLISH_V1__=true;

const style=document.createElement("style");
style.textContent=`
@media(max-width:740px){
 #missions>.me-lux-page-head{position:relative!important}
 #meMobileMissionClose{
   position:absolute;right:10px;top:10px;z-index:3;min-height:38px;padding:7px 10px;
   border:1px solid rgba(232,198,132,.55);border-radius:10px;background:rgba(4,28,41,.82);
   color:#ffe0a0;font-size:9px;font-weight:900;backdrop-filter:blur(8px)
 }
 button[data-me-locked-helper="1"]{opacity:.72!important}
 html body #missions{max-width:100vw!important;overflow-x:hidden!important}
 html body #missions>*{max-width:100%!important;min-width:0!important}
 html body #missions .panel,html body #missions .item{max-width:100%!important;min-width:0!important;overflow-x:hidden!important}
 html body #missions .me-mission-search{grid-template-columns:minmax(0,1fr)!important}
 html body #missions .me-mission-search input,html body #missions .me-mission-search select{width:100%!important;max-width:100%!important;min-width:0!important}
 html body .me-npc-box{display:none!important}
 html body .me-live-marina .me-npc-box:first-of-type{display:block!important}
 #meMobileMissionFixedHome{
   position:fixed;z-index:250;left:10px;top:10px;min-height:40px;padding:7px 11px;
   border:1px solid rgba(232,198,132,.65);border-radius:10px;background:rgba(4,28,41,.94);
   color:#ffe0a0;font-size:10px;font-weight:900;box-shadow:0 4px 18px rgba(0,0,0,.35)
 }
}
`;
document.head.appendChild(style);

function ensureMissionClose(){
 if(window.innerWidth>740)return;
 const missions=document.getElementById("missions");
 if(!missions)return;
 let b=document.getElementById("meMobileMissionFixedHome");
 const visible=!missions.classList.contains("hide");
 if(!b){
  b=document.createElement("button");
  b.id="meMobileMissionFixedHome";b.type="button";b.textContent="← HOME";
  b.addEventListener("click",()=>{if(typeof showTab==="function")showTab("home")});
  document.body.appendChild(b);
 }
 b.style.display=visible?"block":"none";
}
function polishLocked(){
 if(window.innerWidth>740)return;
 document.querySelectorAll("button:disabled").forEach(b=>{
  const t=(b.textContent||"").trim().toLowerCase();
  if(t.includes("avvia prima la tua partita")){
   b.textContent="SBLOCCA DOPO L'AVVIO";
   b.dataset.meLockedHelper="1";
   b.title="Completa l'avvio della partita per sbloccare questa attività.";
  }else if(t.includes("registrati gratuitamente")){
   b.textContent="RICHIEDE REGISTRAZIONE";
   b.dataset.meLockedHelper="1";
  }
 });
}
function pruneNpc(){
 const boxes=[...document.querySelectorAll(".me-npc-box")];
 if(!boxes.length)return;
 const visibleLive=[...document.querySelectorAll(".me-live-marina")].find(el=>el.offsetParent!==null)||document.querySelector(".me-live-marina");
 const keep=visibleLive?boxes.find(x=>visibleLive.contains(x)):boxes[0];
 boxes.forEach(x=>{if(x!==keep)x.remove()});
}
function sync(){ensureMissionClose();polishLocked();pruneNpc()}
window.addEventListener("resize",sync);
window.addEventListener("marina-empire-updated",()=>setTimeout(sync,40));
const mo=new MutationObserver(()=>sync());
if(document.body)mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled","class"]});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
setInterval(sync,20000);
})();