(()=>{
"use strict";
if(window.__ME_BUSINESS_OPS_V1__)return;
window.__ME_BUSINESS_OPS_V1__=true;

const EVENTS=[
 {id:"promo",icon:"📣",title:"Campagna locale",text:"Spingi prenotazioni e richieste per le prossime 24 ore.",cost:900,mult:1.18,rep:2},
 {id:"staff",icon:"👥",title:"Formazione staff",text:"Migliora qualità del servizio e fidelizzazione clienti.",cost:1200,mult:1.14,rep:4},
 {id:"maint",icon:"🔧",title:"Manutenzione preventiva",text:"Riduce fermi operativi e mantiene alta la redditività.",cost:700,mult:1.10,rep:3},
 {id:"vip",icon:"✨",title:"Pacchetto VIP",text:"Prepara un servizio premium ad alta marginalità.",cost:1600,mult:1.24,rep:5}
];
const style=document.createElement("style");
style.textContent=`
.me-business-ops{margin:12px 0;padding:12px;border:1px solid rgba(102,185,203,.34);border-radius:12px;background:#082d3b}
.me-business-ops h3{margin:0 0 6px;color:#bfe7ef}.me-business-op{padding:9px;margin-top:7px;border:1px solid rgba(255,255,255,.08);border-radius:9px;background:#0a3040}
.me-business-op button{margin-top:7px;min-height:40px}.me-business-op small{display:block;color:#9cb4bd;margin-top:4px}
@media(max-width:899px){.me-business-ops{padding:9px}.me-business-op button{width:100%;min-height:44px}}
`;
document.head.appendChild(style);

function sref(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function keyDay(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function h(str){let n=2166136261;for(const ch of String(str)){n^=ch.charCodeAt(0);n=Math.imul(n,16777619)}return n>>>0}
function eventFor(key){return EVENTS[h(key+"|"+keyDay())%EVENTS.length]}
function opState(key){
 const s=sref();const all=s?.businessOps&&typeof s.businessOps==="object"?s.businessOps:{};
 const x=all[key]||null;
 if(!x)return null;
 if(Number(x.expiresAt)<=Date.now())return null;
 return x;
}
function multiplier(key){return Math.max(1,Number(opState(key)?.mult)||1)}
function activate(key){
 const s=sref();if(!s||s.trip)return false;
 const ev=eventFor(key),active=opState(key);
 if(active){if(typeof notice==="function")notice("Operazione attività già attiva.");return false}
 if((Number(s.coins)||0)<ev.cost){if(typeof notice==="function")notice("Crediti insufficienti per questa operazione.");return false}
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{
  s.coins-=ev.cost;
  s.businessOps=s.businessOps&&typeof s.businessOps==="object"?s.businessOps:{};
  s.businessOps[key]={eventId:ev.id,title:ev.title,mult:ev.mult,startedAt:Date.now(),expiresAt:Date.now()+86400000};
  s.sectorReputation=s.sectorReputation&&typeof s.sectorReputation==="object"?s.sectorReputation:{};
  s.sectorReputation.servizi=Math.max(0,Number(s.sectorReputation.servizi)||0)+ev.rep;
 }):false;
 if(!ok)return false;
 if(typeof notice==="function")notice(ev.title+" attivata · bonus attività per 24h");
 if(typeof render==="function")render();
 window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"business-operation"}}));
 draw();
 return true;
}
let box=null;
function draw(){
 const s=sref();if(!s?.name)return;
 const host=document.getElementById("meBusinessUpgradesV1")||document.getElementById("businessList");
 if(!host)return;
 if(!box||!box.isConnected){box=document.createElement("section");box.id="meBusinessOpsV1";box.className="me-business-ops";host.insertAdjacentElement("afterend",box)}
 const owned=Object.entries(s.businesses||{}).filter(([,v])=>!!v);
 if(!owned.length){box.style.display="none";return}
 box.style.display="";
 const defs=Array.isArray(window.MarinaEmpireBusinessCatalog)?window.MarinaEmpireBusinessCatalog:[];
 box.innerHTML='<h3>📋 OPERAZIONI GIORNALIERE</h3><p class="small muted">Scegli dove reinvestire per aumentare temporaneamente il rendimento delle attività.</p>'+owned.map(([key])=>{
  const id=key.split(":").pop(),def=defs.find(x=>x.id===id)||{name:id},ev=eventFor(key),active=opState(key);
  return '<div class="me-business-op"><strong>'+def.name+'</strong><small>'+(active?('✅ '+active.title+' attiva · +'+Math.round((active.mult-1)*100)+'% rendimento fino alle '+new Date(active.expiresAt).toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"})):(ev.icon+' '+ev.title+' · '+ev.text+' · costo '+ev.cost.toLocaleString("it-IT")+' CR'))+'</small><button type="button" data-business-op="'+key+'" '+(active||s.trip||s.coins<ev.cost?'disabled':'')+'>'+(active?'OPERAZIONE ATTIVA':'ATTIVA PER 24H')+'</button></div>';
 }).join("");
 box.querySelectorAll("[data-business-op]").forEach(b=>b.addEventListener("click",()=>activate(b.dataset.businessOp)));
}
window.MarinaEmpireBusinessOps={eventFor,opState,multiplier,activate,render:draw};
function boot(){draw();window.addEventListener("marina-empire-updated",()=>setTimeout(draw,80));setInterval(draw,30000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();