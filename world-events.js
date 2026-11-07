(()=>{
"use strict";
if(window.__ME_WORLD_EVENTS__)return;
window.__ME_WORLD_EVENTS__=true;

const WEATHER=[
 {id:"calm",icon:"☀️",label:"CALMO",sea:"Mare calmo",traffic:1.08,duration:1,wear:3},
 {id:"breeze",icon:"🌤️",label:"BREZZA",sea:"Mare poco mosso",traffic:1,duration:1.05,wear:4},
 {id:"rain",icon:"🌧️",label:"PIOGGIA",sea:"Visibilità ridotta",traffic:.82,duration:1.08,wear:4},
 {id:"rough",icon:"🌊",label:"MARE MOSSO",sea:"Mare mosso",traffic:.62,duration:1.12,wear:5}
];

const EVENTS=[
 {id:"charter_boom",icon:"🛥️",title:"Boom charter",text:"Forte domanda di charter e water toys.",market:{boats:1.03,toys:1.12,tech:1},traffic:1.25,demand:1.18,sectors:["charter","servizi"]},
 {id:"yard_rush",icon:"🔧",title:"Cantiere sotto pressione",text:"Aumentano richieste tecniche, ricambi e manutenzione.",market:{boats:.98,toys:1,tech:1.14},traffic:1.08,demand:1.2,sectors:["tecnica"]},
 {id:"owner_selloff",icon:"💼",title:"Vendite armatori",text:"Più yacht usati e occasioni sul mercato locale.",market:{boats:.9,toys:.98,tech:1},traffic:1.05,demand:1.08,sectors:["broker"]},
 {id:"toy_weekend",icon:"🌊",title:"Weekend water toys",text:"SUP, E-Foil e toys nautici sono molto richiesti.",market:{boats:1,toys:1.15,tech:1},traffic:1.15,demand:1.22,sectors:["servizi","charter"]},
 {id:"fuel_pressure",icon:"⛽",title:"Pressione sui rifornimenti",text:"Traffico elevato al fuel dock e più richieste di assistenza.",market:{boats:1.01,toys:1,tech:1.05},traffic:1.3,demand:1.12,sectors:["marina"]},
 {id:"quiet_harbor",icon:"⚓",title:"Porto tranquillo",text:"Domanda contenuta e migliori occasioni d'acquisto.",market:{boats:.96,toys:.96,tech:.97},traffic:.72,demand:.88,sectors:["broker"]},
 {id:"vip_arrivals",icon:"✨",title:"Arrivi VIP",text:"Yacht premium in arrivo: cresce la domanda di servizi.",market:{boats:1.08,toys:1.09,tech:1.05},traffic:1.35,demand:1.25,sectors:["charter","servizi","broker"]}
];

function slot(){return Math.floor(Date.now()/7200000)}\nfunction displaySlot(){return Math.floor(Date.now()/900000)}
function hash(str){
 let h=2166136261;
 for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
 return h>>>0;
}
function weatherFor(port,offset=0){
 const s=slot()+offset,h=hash("weather|"+port+"|"+s);
 const w=WEATHER[h%WEATHER.length];
 return {...w,port,slot:s,until:(s+1)*7200000};
}
function eventFor(port,offset=0){
 const s=slot()+offset,h=hash(port+"|"+s);
 const e=EVENTS[h%EVENTS.length];
 return {...e,port,slot:s,until:(s+1)*7200000};
}
function currentPort(){
 try{if(typeof state!=="undefined"&&state&&state.port)return state.port}catch(_){}
 return document.querySelector(".me-current-marina-card")?.dataset?.marinaCard||"rimini";
}
function displayEventFor(port=currentPort()){\n const s=displaySlot(),h=hash("display|"+port+"|"+s);\n const e=EVENTS[h%EVENTS.length];\n return {...e,port,displaySlot:s,until:(s+1)*900000};\n}\nfunction current(){return displayEventFor(currentPort())}
function modifiers(port=currentPort()){
 const e=eventFor(port),phase=dayPhase(),weather=weatherFor(port);
 return {boats:e.market.boats,toys:e.market.toys,tech:e.market.tech,traffic:e.traffic*phase.traffic*weather.traffic,demand:e.demand,event:e,phase,weather,missionDuration:weather.duration,missionWear:weather.wear};
}
function dayPhase(){
 const h=new Date().getHours();
 if(h>=6&&h<9)return {id:"dawn",label:"ALBA",icon:"🌅",traffic:.8};
 if(h>=9&&h<18)return {id:"day",label:"GIORNO",icon:"☀️",traffic:1.15};
 if(h>=18&&h<21)return {id:"sunset",label:"TRAMONTO",icon:"🌇",traffic:1.05};
 return {id:"night",label:"NOTTE",icon:"🌙",traffic:.55};
}
window.MarinaEmpireWorldEvents={current,eventFor,displayEventFor,weatherFor,modifiers,slot,displaySlot,dayPhase};

const style=document.createElement("style");
style.textContent=".me-world-event{margin:10px 0;padding:10px 12px;border:1px solid rgba(214,181,117,.38);border-radius:12px;background:linear-gradient(135deg,#0b3042,#102739);display:flex;gap:10px;align-items:flex-start}.me-world-event-icon{font-size:22px}.me-world-event strong{display:block;color:#f0cf8a;font-size:12px}.me-world-event p{margin:3px 0;font-size:10px;color:#cbdbe1}.me-world-event small{color:#829fab;font-size:9px}";
document.head.appendChild(style);

let box=null,timer=null;
function timeLeft(until){
 const m=Math.max(0,Math.ceil((until-Date.now())/60000));
 return m>=60?Math.floor(m/60)+"h "+(m%60)+"m":m+" min";
}
function host(){
 return document.querySelector(".me-live-marina")||document.querySelector("#marinas .panel")||document.getElementById("marinaList");
}
function render(){
 const h=host();if(!h)return false;
 const existing=[...h.querySelectorAll(":scope > .me-world-event")];
 if(!box||!box.isConnected||box.parentNode!==h){
  box=existing[0]||document.createElement("div");
  box.className="me-world-event";
  if(!box.isConnected)h.prepend(box);
 }
 existing.forEach(el=>{if(el!==box)el.remove()});
 const e=current();
 const phase=dayPhase(),weather=weatherFor(currentPort());box.innerHTML='<div class="me-world-event-icon">'+e.icon+'</div><div><strong>EVENTO MONDO · '+e.title+'</strong><p>'+e.text+'</p><p>'+weather.icon+' '+weather.label+' · '+weather.sea+'</p><small>'+phase.icon+' '+phase.label+' · aggiornamento tra '+timeLeft(e.until)+'</small></div>';
 window.dispatchEvent(new CustomEvent("marina-world-event",{detail:e}));
 return true;
}
function tick(){render();clearTimeout(timer);timer=setTimeout(tick,60000)}
function boot(){if(!render()){setTimeout(boot,800);return}tick()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();