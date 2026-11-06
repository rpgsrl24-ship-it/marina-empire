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
}
`;
document.head.appendChild(style);

function ensureMissionClose(){
 if(window.innerWidth>740)return;
 const head=document.querySelector("#missions>.me-lux-page-head");
 if(!head||document.getElementById("meMobileMissionClose"))return;
 const b=document.createElement("button");
 b.id="meMobileMissionClose";b.type="button";b.textContent="← HOME";
 b.addEventListener("click",()=>{if(typeof showTab==="function")showTab("home")});
 head.appendChild(b);
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
 const live=document.querySelector(".me-live-marina");
 if(!live)return;
 const boxes=[...document.querySelectorAll(".me-npc-box")];
 const inside=boxes.filter(x=>live.contains(x));
 const keep=inside[0]||null;
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