(()=>{
"use strict";
if(window.__ME_MARINA_SHIFT_CYCLE__)return;
window.__ME_MARINA_SHIFT_CYCLE__=true;

const PHASES=[
 {id:"prep",icon:"🧭",label:"PREPARAZIONE TURNO",traffic:.88,demand:.96,service:1.02,duration:60*60*1000,text:"Staff e servizi preparano il prossimo ciclo operativo."},
 {id:"rush",icon:"🔥",label:"PICCO OPERATIVO",traffic:1.28,demand:1.18,service:1.2,duration:2*60*60*1000,text:"Arrivi, partenze e richieste servizi aumentano rapidamente."},
 {id:"flow",icon:"⚓",label:"FLUSSO STABILE",traffic:1.08,demand:1.08,service:1.08,duration:2*60*60*1000,text:"La marina lavora a regime con traffico continuo."},
 {id:"recovery",icon:"🔧",label:"SMALTIMENTO SERVIZI",traffic:.9,demand:1.12,service:1.22,duration:90*60*1000,text:"Meno movimenti, ma più manutenzione, fuel e assistenza."},
 {id:"night",icon:"🌙",label:"TURNO NOTTURNO",traffic:.62,demand:.86,service:.94,duration:3*60*60*1000,text:"Operatività ridotta con presidio tecnico e VHF attivo."}
];

const style=document.createElement("style");
style.id="me-marina-shift-style";
style.textContent=`
.me-marina-shift{margin:8px 0;padding:9px 10px;border:1px solid rgba(126,185,207,.28);border-radius:10px;background:#082735}
.me-marina-shift-head{display:flex;justify-content:space-between;gap:8px;align-items:center}.me-marina-shift-head strong{font-size:9px;color:#9ed8eb;letter-spacing:.06em}.me-marina-shift-head span{font-size:8px;color:#89a9b5}
.me-marina-shift p{margin:5px 0;font-size:8.5px;color:#b9ccd3}.me-marina-shift small{font-size:8px;color:#7f9ea9}
`;document.head.appendChild(style);

let box=null;
function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function port(){try{return String(state?.port||"rimini").toLowerCase()}catch(_){return "rimini"}}
function store(){
 if(typeof state==="undefined"||!state)return null;
 if(!state.marinaShiftCycles||typeof state.marinaShiftCycles!=="object")state.marinaShiftCycles={};
 return state.marinaShiftCycles;
}
function cycleLength(){return PHASES.reduce((n,p)=>n+p.duration,0)}
function baseStart(key){
 const day=new Date();day.setHours(0,0,0,0);
 const offset=(hash(key+"|shift")%120)*60000;
 return day.getTime()+offset;
}
function snapshot(key=port(),at=Date.now()){
 const s=store(),cycle=cycleLength(),base=baseStart(key);
 let delta=((at-base)%cycle+cycle)%cycle,phase=PHASES[0],started=base;
 for(const p of PHASES){
  if(delta<p.duration){phase=p;break}
  delta-=p.duration;started+=p.duration;
 }
 const index=PHASES.findIndex(p=>p.id===phase.id);
 const cycleStart=at-((((at-base)%cycle)+cycle)%cycle);
 const phaseStart=cycleStart+PHASES.slice(0,index).reduce((n,p)=>n+p.duration,0);
 const until=phaseStart+phase.duration;
 const data={...phase,index,port:key,startedAt:phaseStart,until,cycleStart};
 if(s){
  const prev=s[key]||{};
  if(prev.phase!==data.id||Number(prev.startedAt)!==phaseStart){
   s[key]={phase:data.id,startedAt:phaseStart,until,transitions:Math.max(0,Number(prev.transitions)||0)+1,lastAt:at};
   try{if(typeof persist==="function")persist()}catch(_){}
  }
 }
 return data;
}
function modifiers(key=port()){
 const p=snapshot(key);
 const memory=window.MarinaEmpireMarinaMemory?.current?.()||{};
 let traffic=p.traffic,demand=p.demand,service=p.service;
 if(Number(memory.pressure)>=1.2&&p.id==="rush")traffic*=1.08;
 if(Number(memory.serviceLoad)>=1.15&&p.id==="recovery")service*=1.08;
 return {phase:p,traffic:Math.max(.5,Math.min(1.5,traffic)),demand:Math.max(.75,Math.min(1.35,demand)),service:Math.max(.75,Math.min(1.4,service))};
}
function left(until){
 const m=Math.max(0,Math.ceil((until-Date.now())/60000));
 return m>=60?Math.floor(m/60)+"h "+(m%60)+"m":m+" min";
}
function ensure(){
 const host=document.querySelector(".me-live-marina");if(!host)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("div");box.className="me-marina-shift";box.id="meMarinaShift";
 const mem=host.querySelector(".me-marina-memory");
 if(mem&&mem.nextSibling)host.insertBefore(box,mem.nextSibling);else host.appendChild(box);
 return true;
}
function draw(){
 if(!ensure())return;
 const p=snapshot(),next=PHASES[(p.index+1)%PHASES.length];
 box.innerHTML='<div class="me-marina-shift-head"><strong>'+p.icon+' '+p.label+'</strong><span>'+left(p.until)+'</span></div><p>'+p.text+'</p><small>Prossima fase: '+next.icon+' '+next.label+'. Il ciclo operativo influenza traffico, domanda e servizi.</small>';
}
function boot(){
 if(typeof state==="undefined"||!state){setTimeout(boot,700);return}
 draw();
 setInterval(draw,60000);
 window.addEventListener("marina-empire-updated",()=>setTimeout(draw,80));
}
window.MarinaEmpireShiftCycle={snapshot,modifiers};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();