(()=>{
"use strict";
if(window.MarinaEmpireCommanderRanks)return;
const RANKS=[
 {id:"cadet",label:"ALLIEVO",icon:"⚓",min:0,next:200},
 {id:"skipper",label:"SKIPPER",icon:"🧭",min:200,next:600},
 {id:"captain",label:"CAPITANO",icon:"🎖️",min:600,next:1500},
 {id:"commander",label:"COMANDANTE",icon:"⭐",min:1500,next:3500},
 {id:"admiral",label:"AMMIRAGLIO",icon:"🏅",min:3500,next:8000},
 {id:"tycoon",label:"MAGNATE DEL MARE",icon:"👑",min:8000,next:null}
];
function at(prestige){
 const p=Math.max(0,Number(prestige)||0);
 let current=RANKS[0];
 for(const rank of RANKS)if(p>=rank.min)current=rank;
 const idx=RANKS.findIndex(x=>x.id===current.id),next=RANKS[idx+1]||null;
 const start=current.min,end=next?next.min:current.min;
 const progress=next?Math.max(0,Math.min(100,Math.round((p-start)/(end-start)*100))):100;
 return Object.freeze({...current,prestige:p,progress,next});
}
function readGame(){
 try{
  const c=window.MarinaLocalSaveContext;if(!c)return null;
  let h=c.capture(),g=h&&c.readGame(h);
  if(!g){c.select(null);h=c.capture();g=h&&c.readGame(h)}
  return g||null;
 }catch(_){return null}
}
function render(){
 const g=readGame();if(!g)return;
 const rank=at(g.prestige);
 document.querySelectorAll("[data-me-rank-label]").forEach(el=>el.textContent=rank.label);
 document.querySelectorAll("[data-me-rank-icon]").forEach(el=>el.textContent=rank.icon);
 document.querySelectorAll("[data-me-rank-progress]").forEach(el=>el.style.width=rank.progress+"%");
 document.querySelectorAll("[data-me-rank-next]").forEach(el=>el.textContent=rank.next?((rank.next.min-rank.prestige).toLocaleString("it-IT")+" prestigio al grado "+rank.next.label):"GRADO MASSIMO ATTUALE");
 document.querySelectorAll("[data-me-rank-value]").forEach(el=>el.textContent=rank.next?(rank.prestige.toLocaleString("it-IT")+" / "+rank.next.min.toLocaleString("it-IT")):rank.prestige.toLocaleString("it-IT"));
}
window.MarinaEmpireCommanderRanks=Object.freeze({ranks:RANKS,current:()=>at(readGame()?.prestige||0),at,render});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});else render();
window.addEventListener("marina-empire-updated",()=>setTimeout(render,60));
window.addEventListener("pageshow",()=>setTimeout(render,30));
})();