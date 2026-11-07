(()=>{
"use strict";
if(window.__ME_CAPTAINS_LOG_V1__)return;
window.__ME_CAPTAINS_LOG_V1__=true;

const style=document.createElement("style");
style.id="me-captains-log-v1-style";
style.textContent=`
@media(max-width:899px){
 #meCaptainsLog{
   order:-11!important;margin:0!important;padding:10px 11px!important;
   border:1px solid rgba(205,166,96,.42)!important;border-radius:13px!important;
   background:linear-gradient(145deg,#082c3b,#071f2c)!important;
   box-shadow:0 7px 18px rgba(0,0,0,.20)!important
 }
 #meCaptainsLogHead{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:8px!important;align-items:center!important}
 #meCaptainsLogHead small{display:block!important;color:#8da9b4!important;font-size:7px!important;font-weight:950!important;letter-spacing:.12em!important}
 #meCaptainsLogHead strong{display:block!important;margin-top:2px!important;color:#f1d397!important;font-size:13px!important}
 #meCaptainsLogToggle{min-height:36px!important;padding:6px 9px!important;border:1px solid rgba(214,181,117,.42)!important;border-radius:9px!important;background:#123848!important;color:#f1d397!important;font-size:8px!important;font-weight:950!important}
 #meCaptainsLogSummary{margin-top:6px!important;color:#c7d7dc!important;font-size:9px!important;line-height:1.35!important}
 #meCaptainsLogBody{display:none!important;margin-top:8px!important;gap:6px!important}
 #meCaptainsLog.open #meCaptainsLogBody{display:grid!important}
 .me-log-row{display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;gap:8px!important;align-items:start!important;padding:8px!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:9px!important;background:rgba(4,25,36,.52)!important}
 .me-log-row span{font-size:17px!important;line-height:1!important}
 .me-log-row b{display:block!important;color:#edf3f4!important;font-size:9px!important}
 .me-log-row em{display:block!important;margin-top:2px!important;color:#91aab4!important;font-size:8px!important;font-style:normal!important;line-height:1.3!important}
}
@media(min-width:900px){#meCaptainsLog{display:none!important}}
`;
document.head.appendChild(style);

function num(v){return Math.max(0,Math.floor(Number(v)||0))}
function stateRef(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function marinaName(id){try{return typeof port==="function"?port(id)?.name||"Marina":"Marina"}catch(_){return"Marina"}}
function timeAgo(ts){
 const d=Math.max(0,Date.now()-Number(ts||0));
 if(!Number(ts))return "";
 const min=Math.floor(d/60000);
 if(min<1)return "adesso";
 if(min<60)return min+" min fa";
 const h=Math.floor(min/60);
 if(h<24)return h+" h fa";
 return Math.floor(h/24)+" g fa";
}
function rows(){
 const s=stateRef();if(!s)return [];
 const out=[];
 if(s.lastArrival?.at){
  out.push({at:Number(s.lastArrival.at),icon:"⚓",title:"Arrivo a "+marinaName(s.lastArrival.destination||s.port),detail:"Missione completata · +"+num(s.lastArrival.reward).toLocaleString("it-IT")+" cr · "+timeAgo(s.lastArrival.at)});
 }
 if(s.lastCharterReview?.at){
  const r=s.lastCharterReview;
  out.push({at:Number(r.at),icon:"🛥️",title:"Charter · "+String(r.client||"Cliente"),detail:"Rating "+Number(r.rating||0).toFixed(1)+"/5 · "+String(r.tier||"Standard")+(r.returningClient?" · cliente di ritorno":"")+" · "+timeAgo(r.at)});
 }
 if(s.lastEmergency?.at){
  const e=s.lastEmergency;
  out.push({at:Number(e.at),icon:"🆘",title:String(e.type||"Emergenza")+" risolta",detail:"+"+num(e.reward).toLocaleString("it-IT")+" cr · reputazione +"+num(e.reputation)+" · "+timeAgo(e.at)});
 }
 const crew=window.MarinaEmpireCrew?.snapshot?.(s.boat);
 if(crew?.unlocked){
  const tired=(crew.roster||[]).filter(m=>Number(window.MarinaEmpireCrew?.effectiveMorale?.(m)??m.morale??100)<65).length;
  out.push({at:Date.now()-1,icon:"👥",title:"Equipaggio · morale "+num(crew.avgMemberMorale)+"%",detail:(tired?tired+" membri da recuperare":"Equipaggio operativo")+" · competenza media "+num(crew.avgSkill)+" · "+num(crew.payroll).toLocaleString("it-IT")+" cr/missione"});
 }
 const op=window.MarinaEmpireServiceChains?.operation?.(s.port);
 if(op){
  out.push({at:Date.now()-2,icon:"⚙️",title:marinaName(s.port)+" · Operatività Lv."+num(op.level),detail:String(op.label||"Operatività base")+" · "+num(op.completed)+" catene completate"+(op.next>0?" · "+num(op.next)+" al prossimo livello":"")});
 }
 return out.sort((a,b)=>b.at-a.at).slice(0,4);
}
function milestone(){
 try{return window.MarinaEmpireMobileProgression?.milestone?.()||null}catch(_){return null}
}
function ensure(){
 if((Number(globalThis.innerWidth)||1024)>899)return null;
 const home=document.querySelector("#home .me-mobile-home-dashboard");if(!home)return null;
 let box=document.getElementById("meCaptainsLog");if(box)return box;
 box=document.createElement("section");box.id="meCaptainsLog";
 box.innerHTML='<div id="meCaptainsLogHead"><div><small>DIARIO DEL COMANDANTE</small><strong>Il tuo impero, in breve</strong></div><button type="button" id="meCaptainsLogToggle" aria-expanded="false">APRI</button></div><div id="meCaptainsLogSummary"></div><div id="meCaptainsLogBody"></div>';
 box.querySelector("#meCaptainsLogToggle")?.addEventListener("click",()=>{
   const open=box.classList.toggle("open"),b=box.querySelector("#meCaptainsLogToggle");
   b.setAttribute("aria-expanded",String(open));b.textContent=open?"CHIUDI":"APRI";
 });
 const growth=document.getElementById("meMobileGrowth");
 if(growth)growth.insertAdjacentElement("afterend",box);
 else {
   const daily=document.getElementById("meMobileDailyOps");
   if(daily)daily.insertAdjacentElement("afterend",box);else home.append(box);
 }
 return box;
}
function render(){
 const s=stateRef();if(!s?.name)return;
 const box=ensure();if(!box)return;
 const m=milestone(),list=rows();
 const summary=box.querySelector("#meCaptainsLogSummary");
 if(summary)summary.textContent=m?"Prossimo passo: "+m.title+" · "+m.label:(list[0]?.title||"Costruisci il tuo impero nautico.");
 const body=box.querySelector("#meCaptainsLogBody");
 if(body)body.innerHTML=list.length?list.map(x=>'<div class="me-log-row"><span>'+x.icon+'</span><div><b>'+x.title+'</b><em>'+x.detail+'</em></div></div>').join(""):'<div class="me-log-row"><span>🧭</span><div><b>Primo giorno di comando</b><em>Completa la prima missione per iniziare il diario.</em></div></div>';
}
window.MarinaEmpireCaptainsLog={render,rows};
function boot(){
 if(!ensure()){setTimeout(boot,500);return}
 render();
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,80));
 window.addEventListener("marina-world-event",()=>setTimeout(render,80));
 setInterval(render,30000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();