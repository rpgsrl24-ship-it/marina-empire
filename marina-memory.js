(()=>{
"use strict";
if(window.__ME_MARINA_MEMORY__)return;
window.__ME_MARINA_MEMORY__=true;

const style=document.createElement("style");
style.id="me-marina-memory-style";
style.textContent=`
.me-marina-memory{margin:8px 0;padding:9px 10px;border:1px solid rgba(214,181,117,.25);border-radius:10px;background:#092631}
.me-marina-memory-head{display:flex;justify-content:space-between;gap:8px;align-items:center}.me-marina-memory-head strong{font-size:9px;color:#f0d29d;letter-spacing:.06em}.me-marina-memory-head span{font-size:8px;color:#8fb0bc}
.me-marina-memory-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:7px}.me-marina-memory-card{padding:7px;border-radius:8px;background:#0b303d;border:1px solid rgba(255,255,255,.06)}
.me-marina-memory-card b{display:block;font-size:9px;color:#dce8ec}.me-marina-memory-card small{font-size:8px;color:#8daab5}.me-marina-memory-note{margin-top:6px;font-size:8px;color:#9cb5be}
@media(max-width:740px){.me-marina-memory-grid{grid-template-columns:1fr 1fr 1fr}.me-marina-memory-card{padding:6px}}
`;
document.head.appendChild(style);

let box=null,lastPort="",lastVisitStamp=0;

function port(){try{return String(state?.port||"rimini").toLowerCase()}catch(_){return "rimini"}}
function store(){
 if(typeof state==="undefined"||!state)return null;
 if(!state.marinaWorldMemory||typeof state.marinaWorldMemory!=="object")state.marinaWorldMemory={};
 return state.marinaWorldMemory;
}
function continuity(portId){
 try{
  const p=state?.worldContinuity?.ports?.[portId];
  return p&&typeof p==="object"?p:{arrivals:0,departures:0,services:0};
 }catch(_){return {arrivals:0,departures:0,services:0}}
}
function relationVisits(portId){
 try{
  const all=state?.vesselRelations?.[portId]||{};
  return Object.values(all).reduce((n,v)=>n+Math.max(0,Number(v?.visits)||0),0);
 }catch(_){return 0}
}
function recalc(portId=port()){
 const s=store();if(!s)return null;
 const c=continuity(portId),prev=s[portId]||{};
 const totalMoves=Math.max(0,Number(c.arrivals)||0)+Math.max(0,Number(c.departures)||0);
 const services=Math.max(0,Number(c.services)||0);
 const visits=relationVisits(portId);
 const profile=window.MarinaEmpireMarinaProfiles?.profile?.(portId);
 const bias=Math.max(.6,Math.min(1.5,Number(profile?.trafficBias)||1));
 const pressure=Math.max(.65,Math.min(1.45,.78+Math.log10(1+totalMoves)*.08+Math.log10(1+visits)*.05))*bias;
 const serviceLoad=Math.max(.7,Math.min(1.4,.82+Math.log10(1+services)*.11));
 const memory={
  visits:Math.max(0,Math.floor(Number(prev.visits)||0)),
  lastVisit:Number(prev.lastVisit)||0,
  pressure,
  serviceLoad,
  accumulatedArrivals:Math.max(0,Math.floor(Number(c.arrivals)||0)),
  accumulatedDepartures:Math.max(0,Math.floor(Number(c.departures)||0)),
  accumulatedServices:Math.max(0,Math.floor(Number(c.services)||0)),
  updatedAt:Date.now()
 };
 s[portId]=memory;
 return memory;
}
function markVisit(){
 const p=port(),s=store();if(!s)return;
 const now=Date.now();
 if(p===lastPort&&now-lastVisitStamp<300000)return;
 const m=recalc(p)||{};
 m.visits=Math.max(0,Math.floor(Number(m.visits)||0))+1;
 m.lastVisit=now;s[p]=m;lastPort=p;lastVisitStamp=now;
 try{if(typeof persist==="function")persist()}catch(_){}
}
function trafficMultiplier(portId=port()){
 const m=recalc(portId);
 return m?Math.max(.75,Math.min(1.3,Number(m.pressure)||1)):1;
}
function serviceMultiplier(portId=port()){
 const m=recalc(portId);
 return m?Math.max(.8,Math.min(1.25,Number(m.serviceLoad)||1)):1;
}
function label(v){
 if(v>=1.2)return "ALTA";
 if(v>=1.02)return "ATTIVA";
 if(v>=.88)return "NORMALE";
 return "BASSA";
}
function ensure(){
 const host=document.querySelector(".me-live-marina");
 if(!host)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("div");box.className="me-marina-memory";box.id="meMarinaMemory";
 const liveIntensity=host.querySelector(".me-live-intensity");
 if(liveIntensity)liveIntensity.insertAdjacentElement("afterend",box);else host.appendChild(box);
 return true;
}
function draw(){
 if(!ensure())return;
 const p=port(),m=recalc(p);if(!m)return;
 box.innerHTML='<div class="me-marina-memory-head"><strong>🧠 MEMORIA DELLA MARINA</strong><span>'+((window.MarinaEmpireMarinaProfiles?.profile?.(p)?.label)||p.toUpperCase())+'</span></div><div class="me-marina-memory-grid"><div class="me-marina-memory-card"><b>'+label(m.pressure)+'</b><small>pressione traffico</small></div><div class="me-marina-memory-card"><b>'+label(m.serviceLoad)+'</b><small>carico servizi</small></div><div class="me-marina-memory-card"><b>'+m.visits+'</b><small>visite del giocatore</small></div></div><div class="me-marina-memory-note">Storico simulato: '+m.accumulatedArrivals+' arrivi · '+m.accumulatedDepartures+' partenze · '+m.accumulatedServices+' servizi.</div>';
}
function boot(){
 if(typeof state==="undefined"||!state){setTimeout(boot,700);return}
 markVisit();draw();
 window.addEventListener("marina-empire-updated",()=>{markVisit();setTimeout(draw,80)});
 window.addEventListener("marina-world-event",()=>setTimeout(draw,80));
 setInterval(draw,60000);
}
window.MarinaEmpireMarinaMemory={trafficMultiplier,serviceMultiplier,recalc,current:()=>recalc(port())};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();