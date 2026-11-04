(()=>{
"use strict";
if(window.__ME_WORLD_CONTINUITY__)return;
window.__ME_WORLD_CONTINUITY__=true;

const style=document.createElement("style");
style.id="me-world-continuity-style";
style.textContent=`
.me-world-continuity{margin:10px 0;padding:11px;border:1px solid rgba(214,181,117,.3);border-radius:12px;background:linear-gradient(135deg,#082632,#0d3342)}
.me-world-continuity h3{margin:0 0 5px;color:#f0d29d;font-size:12px}.me-world-continuity p{margin:3px 0;font-size:9.5px;color:#bcd0d7}
.me-world-continuity-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}.me-world-continuity-card{padding:8px;border:1px solid rgba(255,255,255,.08);border-radius:9px;background:#09222d}
.me-world-continuity-card strong{display:block;color:#e8f0f2;font-size:9px}.me-world-continuity-card span{display:block;margin-top:3px;color:#8faeb9;font-size:8.5px}.me-world-continuity small{display:block;margin-top:7px;color:#7f9ca7;font-size:8px}
@media(max-width:740px){.me-world-continuity-grid{grid-template-columns:1fr}.me-world-continuity{padding:9px}}
`;
document.head.appendChild(style);

const PORTS=["rimini","ancona","ravenna","pescara","brindisi","salerno","nettuno","scarlino","loano","portocervo","capodorlando","lignano","cervia","bari","rose"];
let box=null,lastRenderedKey="";

function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function now(){return Date.now()}
function currentPort(){try{return String(state?.port||"rimini").toLowerCase()}catch(_){return "rimini"}}
function safeStore(){
 if(typeof state==="undefined"||!state)return null;
 if(!state.worldContinuity||typeof state.worldContinuity!=="object")state.worldContinuity={};
 const wc=state.worldContinuity;
 if(!Array.isArray(wc.history))wc.history=[];
 if(!wc.ports||typeof wc.ports!=="object")wc.ports={};
 return wc;
}
function intensity(port,slot){
 const profile=window.MarinaEmpireMarinaProfiles?.profile?.(port);
 const local=window.MarinaEmpireLocalEvents?.modifiers?.(port);
 const world=window.MarinaEmpireWorldEvents?.modifiers?.(port);
 const base=Math.max(.55,Math.min(1.55,(Number(profile?.trafficBias)||1)*(Number(local?.traffic)||1)*(Number(world?.traffic)||1)));
 const jitter=.82+(hash(port+"|"+slot)%37)/100;
 return Math.max(.45,Math.min(1.8,base*jitter));
}
function simulatePort(port,from,to){
 const hours=Math.max(.05,(to-from)/3600000),slot=Math.floor(to/1800000),factor=intensity(port,slot);
 const arrivals=Math.max(0,Math.round(hours*factor*(1.4+(hash("a|"+port+"|"+slot)%6)/10)));
 const departures=Math.max(0,Math.round(hours*factor*(1.1+(hash("d|"+port+"|"+slot)%6)/10)));
 const services=Math.max(0,Math.round(hours*factor*(.8+(hash("s|"+port+"|"+slot)%5)/10)));
 return {arrivals,departures,services,factor};
}
function updateOffline(){
 const wc=safeStore();if(!wc)return null;
 const t=now(),last=Number(wc.lastSeen)||t;
 const elapsed=Math.max(0,t-last);
 if(elapsed<60000){wc.lastSeen=t;return null}
 const capped=Math.min(elapsed,24*3600000);
 const from=t-capped;
 const summary={at:t,elapsed:capped,ports:{},total:{arrivals:0,departures:0,services:0}};
 for(const port of PORTS){
  const r=simulatePort(port,from,t);summary.ports[port]=r;
  summary.total.arrivals+=r.arrivals;summary.total.departures+=r.departures;summary.total.services+=r.services;
  const p=wc.ports[port]||{arrivals:0,departures:0,services:0};
  p.arrivals+=r.arrivals;p.departures+=r.departures;p.services+=r.services;p.updatedAt=t;wc.ports[port]=p;
 }
 if(capped>=5*60000){
  wc.history.unshift(summary);wc.history=wc.history.slice(0,12);
  wc.lastSummary=summary;
 }
 wc.lastSeen=t;
 try{if(typeof persist==="function")persist()}catch(_){}
 return summary;
}
function relative(ms){
 const m=Math.max(1,Math.round(ms/60000));
 if(m<60)return m+" min";
 const h=Math.floor(m/60),rm=m%60;
 return h+"h"+(rm?" "+rm+"m":"");
}
function ensure(){
 const host=document.querySelector(".me-live-marina")||document.querySelector("#marinas .panel")||document.getElementById("marinaList");
 if(!host)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("section");box.className="me-world-continuity";box.id="meWorldContinuity";
 host.appendChild(box);return true;
}
function draw(){
 if(!ensure())return;
 const wc=safeStore();if(!wc)return;
 const s=wc.lastSummary,port=currentPort(),local=s?.ports?.[port],key=JSON.stringify([s?.at,port,local?.arrivals,local?.departures,local?.services]);
 if(key===lastRenderedKey&&box.innerHTML)return;lastRenderedKey=key;
 if(!s||!local){
  box.innerHTML='<h3>🌐 MONDO PERSISTENTE</h3><p>Il mondo nautico continua a muoversi anche tra una sessione e l’altra.</p><small>La prossima volta che torni troverai un riepilogo dell’attività avvenuta durante la tua assenza.</small>';return;
 }
 box.innerHTML='<h3>🌐 MENTRE ERI VIA</h3><p>Durante le ultime <b>'+relative(s.elapsed)+'</b> Marina Empire ha continuato a simulare traffico e servizi.</p><div class="me-world-continuity-grid"><div class="me-world-continuity-card"><strong>⚓ '+local.arrivals+' arrivi</strong><span>Nella marina attuale</span></div><div class="me-world-continuity-card"><strong>🛥️ '+local.departures+' partenze</strong><span>Movimenti completati</span></div><div class="me-world-continuity-card"><strong>🔧 '+local.services+' servizi</strong><span>Fuel, assistenza e banchina</span></div></div><small>Rete Italia: '+s.total.arrivals+' arrivi · '+s.total.departures+' partenze · '+s.total.services+' servizi simulati.</small>';
}
function touch(){
 const wc=safeStore();if(!wc)return;
 if(!wc.lastSeen)wc.lastSeen=now();
 else wc.lastSeen=now();
 try{if(typeof persist==="function")persist()}catch(_){}
}
function boot(){
 if(typeof state==="undefined"||!state){setTimeout(boot,700);return}
 updateOffline();draw();
 window.addEventListener("marina-empire-updated",()=>setTimeout(draw,80));
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"){updateOffline();draw()}else touch()});
 window.addEventListener("beforeunload",touch);
 setInterval(()=>{touch();draw()},60000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();