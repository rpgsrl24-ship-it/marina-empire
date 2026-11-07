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
 {id:"charter_boom",icon:"🛥️",title:"Boom charter",text:"Forte domanda di charter e servizi premium.",detail:"Le richieste charter aumentano nelle marine. È un buon momento per cercare contratti, preparare la flotta e sfruttare i servizi dedicati agli ospiti.",bonus:"Domanda charter +18%",action:"VAI AI CONTRATTI",target:"missions",market:{boats:1.03,toys:1.12,tech:1},traffic:1.25,demand:1.18,sectors:["charter","servizi"]},
 {id:"yard_rush",icon:"🔧",title:"Cantiere sotto pressione",text:"Aumentano richieste tecniche, ricambi e manutenzione.",detail:"I cantieri stanno ricevendo più richieste del normale. Refit, manutenzione e interventi tecnici diventano più importanti.",bonus:"Domanda tecnica +20%",action:"APRI CANTIERE",target:"refit",market:{boats:.98,toys:1,tech:1.14},traffic:1.08,demand:1.2,sectors:["tecnica"]},
 {id:"owner_selloff",icon:"💼",title:"Vendite armatori",text:"Più yacht usati e occasioni sul mercato locale.",detail:"Diversi armatori stanno mettendo sul mercato imbarcazioni e attrezzature. Controlla il Marketplace per cercare occasioni utili alla crescita.",bonus:"Prezzi yacht più favorevoli",action:"APRI MARKETPLACE",target:"marketplace",market:{boats:.9,toys:.98,tech:1},traffic:1.05,demand:1.08,sectors:["broker"]},
 {id:"toy_weekend",icon:"🌊",title:"Weekend Water Toys",text:"SUP, E-Foil e toys nautici sono molto richiesti.",detail:"Il weekend porta più ospiti in acqua. Charter e yacht richiedono SUP, E-Foil, Seabob e servizi dedicati ai water toys.",bonus:"Domanda water toys +22%",action:"APRI EVENTO",target:"weekend-water-toys",market:{boats:1,toys:1.15,tech:1},traffic:1.15,demand:1.22,sectors:["servizi","charter"]},
 {id:"fuel_pressure",icon:"⛽",title:"Pressione sui rifornimenti",text:"Traffico elevato al fuel dock e più richieste di assistenza.",detail:"Molte imbarcazioni stanno facendo rifornimento. Il traffico aumenta e i servizi marina diventano più richiesti.",bonus:"Traffico marina +30%",action:"APRI MARINA LIVE",target:"marinas",market:{boats:1.01,toys:1,tech:1.05},traffic:1.3,demand:1.12,sectors:["marina"]},
 {id:"quiet_harbor",icon:"⚓",title:"Porto tranquillo",text:"Domanda contenuta e migliori occasioni d'acquisto.",detail:"La marina attraversa una fase più calma. È un buon momento per pianificare investimenti, controllare il Marketplace e preparare la prossima espansione.",bonus:"Occasioni acquisto migliori",action:"APRI MARKETPLACE",target:"marketplace",market:{boats:.96,toys:.96,tech:.97},traffic:.72,demand:.88,sectors:["broker"]},
 {id:"vip_arrivals",icon:"✨",title:"Arrivi VIP",text:"Yacht premium in arrivo: cresce la domanda di servizi.",detail:"Ospiti e yacht premium stanno arrivando in marina. Charter, concierge e servizi di alto livello possono generare nuove opportunità.",bonus:"Domanda servizi +25%",action:"APRI MARINA LIVE",target:"marinas",market:{boats:1.08,toys:1.09,tech:1.05},traffic:1.35,demand:1.25,sectors:["charter","servizi","broker"]},
 {id:"regatta_day",icon:"⛵",title:"Giornata di regata",text:"Le marine ospitano equipaggi e imbarcazioni a vela.",detail:"Una regata regionale porta equipaggi, assistenza tecnica e più traffico nelle marine coinvolte.",bonus:"Traffico +20% · servizi +15%",action:"APRI MARINA LIVE",target:"marinas",market:{boats:1.02,toys:1.03,tech:1.08},traffic:1.2,demand:1.15,sectors:["marina","tecnica"]},
 {id:"superyacht_week",icon:"🛳️",title:"Superyacht Week",text:"Superyacht e tender premium aumentano nelle marine.",detail:"Una settimana dedicata ai grandi yacht porta richieste di ormeggio, charter, equipaggio e servizi premium.",bonus:"Servizi premium +28%",action:"VAI AI CONTRATTI",target:"missions",market:{boats:1.07,toys:1.08,tech:1.08},traffic:1.32,demand:1.28,sectors:["charter","servizi","tecnica"]}
];

function economySlot(){return Math.floor(Date.now()/7200000)}
function displaySlot(){return Math.floor(Date.now()/900000)}
function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function currentPort(){try{if(typeof state!=="undefined"&&state?.port)return state.port}catch(_){}return document.querySelector(".me-current-marina-card")?.dataset?.marinaCard||"rimini"}
function weatherFor(port=currentPort(),offset=0){const s=economySlot()+offset,h=hash("weather|"+port+"|"+s),w=WEATHER[h%WEATHER.length];return {...w,port,slot:s,until:(s+1)*7200000}}
function economyEventFor(port=currentPort(),offset=0){const s=economySlot()+offset,h=hash("economy|"+port+"|"+s),e=EVENTS[h%EVENTS.length];return {...e,port,slot:s,until:(s+1)*7200000}}
function displayEventFor(port=currentPort(),offset=0){const s=displaySlot()+offset,h=hash("display|"+port+"|"+s),e=EVENTS[h%EVENTS.length];return {...e,port,displaySlot:s,until:(s+1)*900000}}
function current(){return displayEventFor(currentPort())}
function dayPhase(){const h=new Date().getHours();if(h>=6&&h<9)return {id:"dawn",label:"ALBA",icon:"🌅",traffic:.8};if(h>=9&&h<18)return {id:"day",label:"GIORNO",icon:"☀️",traffic:1.15};if(h>=18&&h<21)return {id:"sunset",label:"TRAMONTO",icon:"🌇",traffic:1.05};return {id:"night",label:"NOTTE",icon:"🌙",traffic:.55}}
function modifiers(port=currentPort()){
 const economic=economyEventFor(port),event=displayEventFor(port),phase=dayPhase(),weather=weatherFor(port);
 return {boats:economic.market.boats,toys:economic.market.toys,tech:economic.market.tech,traffic:economic.traffic*phase.traffic*weather.traffic,demand:economic.demand,event,economyEvent:economic,phase,weather,missionDuration:weather.duration,missionWear:weather.wear};
}
function eventById(id){return EVENTS.find(x=>x.id===id)||null}
function eventUrl(event=current(),port=currentPort()){
 if(event?.id==="toy_weekend")return "./weekend-water-toys.html";
 return "./evento-mondo.html?event="+encodeURIComponent(event?.id||"")+"&port="+encodeURIComponent(port||"rimini");
}
function timeLeft(until){const m=Math.max(0,Math.ceil((Number(until)-Date.now())/60000));return m>=60?Math.floor(m/60)+"h "+(m%60)+"m":m+" min"}

window.MarinaEmpireWorldEvents={current,displayEventFor,economyEventFor,weatherFor,modifiers,economySlot,displaySlot,dayPhase,eventById,eventUrl,timeLeft,events:EVENTS};

const style=document.createElement("style");
style.textContent=`
.me-world-event{margin:10px 0;padding:11px 12px;border:1px solid rgba(214,181,117,.5);border-radius:13px;background:linear-gradient(135deg,#0b3a4d,#102739);display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;box-shadow:0 8px 22px #0003}
.me-world-event-icon{font-size:24px}.me-world-event strong{display:block;color:#f0cf8a;font-size:12px}.me-world-event p{margin:3px 0;font-size:10px;color:#cbdbe1}.me-world-event small{display:block;color:#8fb0bc;font-size:9px}
.me-world-event a{padding:8px 10px;border:1px solid #d2ad66;border-radius:9px;background:#123d51;color:#ffe0a4;text-decoration:none;font-size:9px;font-weight:900;white-space:nowrap}
@media(max-width:430px){.me-world-event{grid-template-columns:auto minmax(0,1fr)}.me-world-event a{grid-column:2;justify-self:start}}
`;
document.head.appendChild(style);

let box=null,timer=null;
function host(){return document.querySelector(".me-live-marina")||document.querySelector("#marinas .panel")||document.getElementById("marinaList")}
function render(){
 const h=host();if(!h)return false;
 const existing=[...h.querySelectorAll(":scope > .me-world-event")];
 if(!box||!box.isConnected||box.parentNode!==h){box=existing[0]||document.createElement("div");box.className="me-world-event";if(!box.isConnected)h.prepend(box)}
 existing.forEach(el=>{if(el!==box)el.remove()});
 const e=current(),weather=weatherFor(currentPort()),phase=dayPhase();
 box.innerHTML='<div class="me-world-event-icon">'+e.icon+'</div><div><strong>EVENTO DAL MONDO · '+e.title+'</strong><p>'+e.text+'</p><small>'+weather.icon+' '+weather.label+' · '+phase.icon+' '+phase.label+' · cambia tra '+timeLeft(e.until)+'</small></div><a href="'+eventUrl(e,currentPort())+'">DETTAGLI ›</a>';
 window.dispatchEvent(new CustomEvent("marina-world-event",{detail:e}));
 return true;
}
function tick(){render();clearTimeout(timer);timer=setTimeout(tick,30000)}
function boot(){if(!render()){setTimeout(boot,700);return}tick()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();