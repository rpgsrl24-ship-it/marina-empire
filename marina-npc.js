(()=>{
"use strict";
if(window.__ME_MARINA_NPC__) return;
window.__ME_MARINA_NPC__=true;

const NPCS=[
 {role:"Comandante",icon:"🧑‍✈️",asks:["richiede rifornimento prima della partenza","cerca un posto transito per questa notte","segnala un problema al generatore"]},
 {role:"Marinaio",icon:"🧑‍🔧",asks:["richiede assistenza per una cima nell'elica","prenota lavaggio coperta","chiede supporto per la manovra"]},
 {role:"Charter",icon:"🛥️",asks:["cerca disponibilità per un'uscita giornaliera","richiede cambusa urgente","prenota trasferimento ospiti"]},
 {role:"Armatore",icon:"👤",asks:["richiede detailing completo","chiede preventivo manutenzione","cerca ormeggio mensile"]},
 {role:"Tecnico",icon:"🔧",asks:["intervento su batterie di bordo","controllo aria condizionata","verifica elettronica di navigazione"]},
 {role:"Broker",icon:"💼",asks:["organizza visita a uno yacht in vendita","cerca disponibilità per prova in mare","richiede posto ospiti per cliente"]}
];

const style=document.createElement("style");
style.textContent=".me-npc-box{margin-top:8px;border-top:1px solid rgba(194,154,96,.22);padding:8px 10px 10px;background:rgba(2,14,22,.28)}.me-npc-title{font-size:9px;letter-spacing:.08em;color:#8fb4c2;margin-bottom:5px}.me-npc-row{display:flex;gap:7px;align-items:flex-start;font-size:10px;color:#d7e2e6;line-height:1.25}.me-npc-role{color:#f0d29d;font-weight:600;white-space:nowrap}.me-npc-level{font-size:9px;color:#8fb4c2;margin-top:6px}";
document.head.appendChild(style);

let timer=null,box=null;

function level(){
 const h=new Date().getHours();
 if(h>=11&&h<19)return "MOLTO ALTA";
 if(h>=7&&h<11)return "ALTA";
 if(h>=19&&h<23)return "MEDIA";
 return "BASSA";
}
function pick(){
 const n=NPCS[Math.floor(Math.random()*NPCS.length)];
 return {icon:n.icon,role:n.role,text:n.asks[Math.floor(Math.random()*n.asks.length)]};
}
function ensure(){
 const live=document.querySelector(".me-live-marina");
 if(!live)return false;
 if(box&&box.parentNode===live)return true;
 box=document.createElement("div");
 box.className="me-npc-box";
 box.innerHTML='<div class="me-npc-title">RICHIESTA DAL PORTO</div><div class="me-npc-row"></div><div class="me-npc-level"></div>';
 live.appendChild(box);
 return true;
}
function render(){
 if(!ensure())return;
 const n=pick();
 box.querySelector(".me-npc-row").innerHTML='<span>'+n.icon+'</span><span><span class="me-npc-role">'+n.role+'</span> · '+n.text+'</span>';
 box.querySelector(".me-npc-level").textContent="Attività marina: "+level();
}
function loop(){
 clearTimeout(timer);
 if(!document.hidden)render();
 timer=setTimeout(loop,18000+Math.floor(Math.random()*18000));
}
function boot(){
 if(!ensure()){setTimeout(boot,700);return;}
 render();
 loop();
 const list=document.getElementById("marinaList");
 if(list)new MutationObserver(()=>setTimeout(()=>{box=null;render();},80)).observe(list,{childList:true,subtree:true});
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;render();},80));
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)render();});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
})();