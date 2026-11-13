(()=>{
"use strict";
if(window.MarinaEmpireLegendaryEventsV2)return;
const EVENTS=Object.freeze([
 Object.freeze({
  id:"monaco-weekend-2026-11",sequence:1,enabled:true,playable:true,
  missionId:"LEGEND_MONACO_20261113",portId:"monaco",marina:"Monaco · Port Hercule",
  country:"Monaco",region:"Costa Azzurra",gateway:"loano",gatewayName:"Marina di Loano",
  theme:"SUPERYACHT & VIP",icon:"👑",start:"2026-11-13T00:00:00+01:00",end:"2026-11-15T23:59:59+01:00",
  reward:3000,prestige:120,cost:350,gatewayCost:500,gatewayPrestige:20,
  badge:"MONACO WEEKEND · 2026",description:"Weekend speciale nel Principato. Raggiungi Monaco via Loano e conquista il timbro evento."
 }),
 Object.freeze({
  id:"sainttropez-weekend",sequence:2,enabled:false,playable:false,
  missionId:"LEGEND_SAINTTROPEZ",portId:"sainttropez",marina:"Saint-Tropez · Vieux Port",
  country:"Francia",region:"Costa Azzurra",gateway:"loano",gatewayName:"Marina di Loano",
  theme:"LUXURY & PRESTIGE",icon:"✨",start:null,end:null,
  reward:3600,prestige:150,cost:400,gatewayCost:500,gatewayPrestige:20,
  badge:"SAINT-TROPEZ WEEKEND",description:"Evento Luxury & Prestige sulla Costa Azzurra.",
  planned:true
 }),
 Object.freeze({
  id:"ibiza-weekend",sequence:3,enabled:false,playable:false,
  missionId:"LEGEND_IBIZA",portId:"ibiza",marina:"Ibiza · Marina Botafoch",
  country:"Spagna",region:"Baleari",gateway:"portocervo",gatewayName:"Marina di Porto Cervo",
  theme:"CHARTER & WATER TOYS",icon:"🌅",start:null,end:null,
  reward:4500,prestige:180,cost:500,gatewayCost:650,gatewayPrestige:25,
  badge:"IBIZA WEEKEND",description:"Evento Charter & Water Toys nelle Baleari.",
  planned:true
 }),
 Object.freeze({
  id:"palma-weekend",sequence:4,enabled:false,playable:false,
  missionId:"LEGEND_PALMA",portId:"palma",marina:"Palma de Mallorca",
  country:"Spagna",region:"Baleari",gateway:"portocervo",gatewayName:"Marina di Porto Cervo",
  theme:"REGATTA & SUPERYACHT",icon:"⛵",start:null,end:null,
  reward:5000,prestige:200,cost:550,gatewayCost:650,gatewayPrestige:25,
  badge:"PALMA WEEKEND",description:"Evento Regatta & Superyacht a Palma de Mallorca.",
  planned:true
 })
]);
const ROADMAP=Object.freeze([
 Object.freeze({id:"italy",label:"ITALIA",state:"open",note:"15 marine disponibili"}),
 Object.freeze({id:"riviera",label:"COSTA AZZURRA",state:"event",note:"Monaco attivo · Saint-Tropez in preparazione"}),
 Object.freeze({id:"balearics",label:"BALEARI",state:"next",note:"Ibiza e Palma · prossima espansione"}),
 Object.freeze({id:"greece",label:"GRECIA",state:"locked",note:"Sblocco legato alla crescita della community"}),
 Object.freeze({id:"world",label:"MONDO",state:"locked",note:"Nuove regioni con la crescita di Marina Empire"})
]);
function state(event,now=Date.now()){
 if(!event)return"missing";
 if(!event.enabled||!event.playable||!event.start||!event.end)return"planned";
 const t=Number(now),start=Date.parse(event.start),end=Date.parse(event.end);
 if(t<start)return"upcoming";
 if(t<=end)return"active";
 return"expired";
}
function completed(game,event){return !!event&&Array.isArray(game?.legendaryEventsCompleted)&&game.legendaryEventsCompleted.includes(event.id)}
function current(now=Date.now()){return EVENTS.find(e=>state(e,now)==="active")||null}
function next(){return EVENTS.filter(e=>e.planned||state(e)==="upcoming").sort((a,b)=>a.sequence-b.sequence)[0]||null}
function planned(){return EVENTS.filter(e=>state(e)==="planned").sort((a,b)=>a.sequence-b.sequence)}
function byPort(id){return EVENTS.find(e=>e.portId===String(id||""))||null}
function byMission(id){return EVENTS.find(e=>e.missionId===String(id||""))||null}
function isLegendaryPort(id){return !!byPort(id)}
function view(event,game,now=Date.now()){
 const s=state(event,now),done=completed(game,event),end=event?.end?Date.parse(event.end):0,remain=end?Math.max(0,end-Number(now)):0;
 return Object.freeze({...event,state:s,completed:done,remainingMs:remain});
}
function remainingText(ms){
 ms=Math.max(0,Number(ms)||0);const h=Math.floor(ms/3600000),d=Math.floor(h/24),rh=h%24;
 if(d>0)return d+"g "+rh+"h";
 const m=Math.max(1,Math.ceil(ms/60000));return h>0?h+"h "+Math.floor((ms%3600000)/60000)+"m":m+"m";
}
function gatewayMissionId(event,origin){return"LEGEND_GATEWAY_"+event.id+"_"+String(origin||"unknown")}
window.MarinaEmpireLegendaryEventsV2=Object.freeze({events:EVENTS,roadmap:ROADMAP,state,current,next,planned,byPort,byMission,isLegendaryPort,view,completed,remainingText,gatewayMissionId});
window.MarinaEmpireLegendaryEvents=window.MarinaEmpireLegendaryEventsV2;
})();