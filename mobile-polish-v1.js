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
   position:fixed;z-index:250;left:10px;top:10px;min-height:44px;padding:8px 12px;
   border:1px solid rgba(232,198,132,.65);border-radius:10px;background:rgba(4,28,41,.94);
   color:#ffe0a0;font-size:10px;font-weight:900;box-shadow:0 4px 18px rgba(0,0,0,.35)
 }
 #navigation button,.me-mobile-left-rail button,.me-mobile-right-rail button{min-width:44px!important;min-height:44px!important}
 #meMobileSetupHint{padding:10px 11px;margin:8px 0;border:1px solid rgba(214,181,117,.42);border-radius:10px;background:#0a3040;color:#f3d495;font-size:11px;line-height:1.35}
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
 if(boxes.length){
  const visibleLive=[...document.querySelectorAll(".me-live-marina")].find(el=>el.offsetParent!==null)||document.querySelector(".me-live-marina");
  const keep=visibleLive?boxes.find(x=>visibleLive.contains(x)):boxes[0];
  boxes.forEach(x=>{if(x!==keep)x.remove()});
 }
 const roots=[...document.querySelectorAll(".me-live-marina,#meMarinaLivePanel,#home")];
 for(const root of roots){
  const seen=new Set();
  const cards=[...root.querySelectorAll(".me-live-row,.me-contract,.me-npc-box,.me-live-feed-row")];
  for(const card of cards){
   const key=(card.className+"|"+(card.textContent||"").replace(/\s+/g," ").trim()).slice(0,600);
   if(!key||key.length<18)continue;
   if(seen.has(key))card.remove();else seen.add(key);
  }
 }
}
function polishLabels(){
 if(window.innerWidth>740)return;
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{if(n.nodeValue&&n.nodeValue.includes("AZIONECONSIGLIATA"))n.nodeValue=n.nodeValue.replaceAll("AZIONECONSIGLIATA","AZIONE CONSIGLIATA")});
}
function missionGuidance(){
 if(window.innerWidth>740)return;
 let s=null;try{s=typeof state!=="undefined"?state:null}catch(_){}
 const list=document.getElementById("missionList");if(!list)return;
 let hint=document.getElementById("meMobileSetupHint");
 const needs=!!(s?.name&&!s?.setupComplete&&(Number(s?.voyages)||0)===0);
 if(!needs){hint?.remove();return}
 if(!hint){hint=document.createElement("div");hint.id="meMobileSetupHint";hint.textContent="⚓ Completa prima la configurazione iniziale: yacht + marina. Subito dopo comparirà la prima missione.";list.insertAdjacentElement("beforebegin",hint)}
}
function sync(){ensureMissionClose();polishLocked();pruneNpc();polishLabels();missionGuidance()}
window.addEventListener("resize",sync);
window.addEventListener("marina-empire-updated",()=>setTimeout(sync,40));
const mo=new MutationObserver(()=>sync());
if(document.body)mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled","class"]});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
setInterval(sync,20000);
})();