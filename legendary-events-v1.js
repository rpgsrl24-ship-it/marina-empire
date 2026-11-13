(()=>{
"use strict";
if(window.MarinaEmpireLegendaryEvents)return;
const EVENTS=Object.freeze([
 Object.freeze({
  id:"monaco-weekend-2026-11",
  missionId:"LEGEND_MONACO_20261113",
  portId:"monaco",
  marina:"Monaco · Port Hercule",
  country:"Monaco",
  region:"Costa Azzurra",
  gateway:"loano",
  gatewayName:"Marina di Loano",
  theme:"SUPERYACHT & VIP",
  icon:"👑",
  start:"2026-11-13T00:00:00+01:00",
  end:"2026-11-15T23:59:59+01:00",
  reward:3000,
  prestige:120,
  badge:"MONACO WEEKEND · 2026",
  description:"Weekend speciale nel Principato. Raggiungi Monaco via Loano e conquista il timbro evento."
 })
]);
const ROADMAP=Object.freeze([
 Object.freeze({id:"italy",label:"ITALIA",state:"open",note:"15 marine disponibili"}),
 Object.freeze({id:"riviera",label:"COSTA AZZURRA",state:"event",note:"Monaco · evento weekend"}),
 Object.freeze({id:"balearics",label:"BALEARI",state:"next",note:"Ibiza e Palma · prossima espansione"}),
 Object.freeze({id:"greece",label:"GRECIA",state:"locked",note:"Si sbloccherà con la crescita della community"}),
 Object.freeze({id:"world",label:"MONDO",state:"locked",note:"Nuove regioni con la crescita di Marina Empire"})
]);
function state(event,now=Date.now()){
 const t=Number(now),start=Date.parse(event.start),end=Date.parse(event.end);
 if(t<start)return"upcoming";
 if(t<=end)return"active";
 return"expired";
}
function completed(game,event){return Array.isArray(game?.legendaryEventsCompleted)&&game.legendaryEventsCompleted.includes(event.id)}
function current(now=Date.now()){return EVENTS.find(e=>state(e,now)==="active")||null}
function byPort(id){return EVENTS.find(e=>e.portId===id)||null}
function byMission(id){return EVENTS.find(e=>e.missionId===id)||null}
function view(event,game,now=Date.now()){
 const s=state(event,now),done=completed(game,event),end=Date.parse(event.end),remain=Math.max(0,end-Number(now));
 return Object.freeze({...event,state:s,completed:done,remainingMs:remain});
}
function remainingText(ms){
 ms=Math.max(0,Number(ms)||0);const h=Math.floor(ms/3600000),d=Math.floor(h/24),rh=h%24;
 if(d>0)return d+"g "+rh+"h";
 const m=Math.max(1,Math.ceil(ms/60000));return h>0?h+"h "+Math.floor((ms%3600000)/60000)+"m":m+"m";
}
window.MarinaEmpireLegendaryEvents=Object.freeze({events:EVENTS,roadmap:ROADMAP,state,current,byPort,byMission,view,completed,remainingText});
})();