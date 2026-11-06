(()=>{
"use strict";
if(window.__ME_REFIT_V1__)return;
window.__ME_REFIT_V1__=true;

const TRACKS={
 engine:{icon:"⚙️",label:"Efficienza motore",desc:"Riduce il consumo carburante del 4% per livello.",max:3,base:.015},
 hospitality:{icon:"✨",label:"Hospitality",desc:"Migliora rating e rendimento Charter.",max:3,base:.012},
 reliability:{icon:"🛠️",label:"Affidabilità",desc:"Riduce l'usura dello yacht del 5% per livello.",max:3,base:.010}
};

const style=document.createElement("style");
style.textContent=`
.me-refit{margin:12px 0;padding:12px;border:1px solid rgba(214,181,117,.38);border-radius:13px;background:linear-gradient(145deg,#0a2f3f,#082431)}
.me-refit-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.me-refit-head strong{color:#f2d293}.me-refit-head small{color:#91aab4}
.me-refit-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:9px}
.me-refit-track{padding:9px;border:1px solid rgba(255,255,255,.09);border-radius:10px;background:#0a2633}
.me-refit-track b{display:block;color:#f1d196;font-size:11px}.me-refit-track p{font-size:9px!important;margin:5px 0!important;color:#a9bdc5!important}
.me-refit-track button{width:100%;min-height:40px;padding:7px;font-size:8px}
.me-refit-level{font-size:9px;color:#e5c680;margin-bottom:6px}
@media(max-width:899px){.me-refit-grid{grid-template-columns:1fr}.me-refit-track button{min-height:44px;font-size:9px}}
`;
document.head.appendChild(style);

function sref(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function binfo(id){try{return typeof boat==="function"?boat(id):null}catch(_){return null}}
function ensure(){
 const s=sref();if(!s)return null;
 if(!s.refits||typeof s.refits!=="object")s.refits={};
 const id=String(s.boat||"voyager");
 if(!s.refits[id]||typeof s.refits[id]!=="object")s.refits[id]={engine:0,hospitality:0,reliability:0};
 const r=s.refits[id];
 for(const k of Object.keys(TRACKS))r[k]=Math.max(0,Math.min(TRACKS[k].max,Math.floor(Number(r[k])||0)));
 return r;
}
function snapshot(id){
 const s=sref();id=String(id||s?.boat||"voyager");
 const raw=s?.refits?.[id]||{engine:0,hospitality:0,reliability:0};
 const engine=Math.max(0,Math.min(3,Math.floor(Number(raw.engine)||0)));
 const hospitality=Math.max(0,Math.min(3,Math.floor(Number(raw.hospitality)||0)));
 const reliability=Math.max(0,Math.min(3,Math.floor(Number(raw.reliability)||0)));
 return {engine,hospitality,reliability,burnMultiplier:1-engine*.04,charterMultiplier:1+hospitality*.025,charterRating:hospitality*.06,wearMultiplier:1-reliability*.05};
}
function cost(track,id){
 const t=TRACKS[track],b=binfo(id),lvl=snapshot(id)[track]||0;
 if(!t||!b||lvl>=t.max)return 0;
 return Math.max(2500,Math.round((Number(b.price)||25000)*t.base*(lvl+1)));
}
function upgrade(track){
 const s=sref(),r=ensure(),t=TRACKS[track];if(!s||!r||!t||s.trip)return;
 const id=String(s.boat||"voyager"),lvl=r[track],price=cost(track,id);
 if(lvl>=t.max){if(typeof notice==="function")notice(t.label+" già al massimo.");return}
 if((Number(s.coins)||0)<price){if(typeof notice==="function")notice("Crediti insufficienti per il refit.");return}
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{s.coins-=price;r[track]=lvl+1}):false;
 if(!ok)return;
 if(typeof render==="function")render();
 if(typeof notice==="function")notice(t.label+" portato a livello "+(lvl+1));
 window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"refit"}}));
 draw();
}
let box=null;
function host(){return document.getElementById("officeFleet")}
function draw(){
 const s=sref(),h=host();if(!s?.name||!h)return;
 if(!box||!box.isConnected){box=document.createElement("section");box.id="meRefitV1";box.className="me-refit";h.insertAdjacentElement("afterend",box)}
 const unlocked=Math.max(0,Number(s.voyages)||0)>=3||(Array.isArray(s.owned)&&s.owned.length>=2);
 if(!unlocked){box.style.display="none";return}
 box.style.display="";
 const id=String(s.boat||"voyager"),b=binfo(id),snap=snapshot(id);
 box.innerHTML='<div class="me-refit-head"><div><small>CANTIERE & REFIT</small><strong>🛠️ '+(b?.name||"Yacht")+'</strong></div><small>Solo in marina</small></div><div class="me-refit-grid">'+Object.entries(TRACKS).map(([k,t])=>{const lvl=snap[k],price=cost(k,id);return '<div class="me-refit-track"><b>'+t.icon+' '+t.label+'</b><p>'+t.desc+'</p><div class="me-refit-level">Livello '+lvl+'/'+t.max+'</div><button type="button" data-refit="'+k+'" '+(s.trip||lvl>=t.max||s.coins<price?'disabled':'')+'>'+(lvl>=t.max?'MASSIMO':'MIGLIORA · '+price.toLocaleString("it-IT")+' CR')+'</button></div>'}).join("")+'</div>';
 box.querySelectorAll("[data-refit]").forEach(b=>b.addEventListener("click",()=>upgrade(b.dataset.refit)));
}
window.MarinaEmpireRefit={snapshot,cost,upgrade,render:draw};
function boot(){
 draw();
 window.addEventListener("marina-empire-updated",()=>setTimeout(draw,50));
 setInterval(draw,30000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();