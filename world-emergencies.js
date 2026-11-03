(()=>{
"use strict";
if(window.__ME_WORLD_EMERGENCIES__)return;
window.__ME_WORLD_EMERGENCIES__=true;

const BASE=[
 {type:"SOS",icon:"🆘",title:"Yacht in difficoltà",text:"Un'imbarcazione segnala perdita di propulsione vicino alla marina.",sector:"tecnica",cost:180,reward:620,prestige:14,reputation:8,duration:32},
 {type:"Recupero",icon:"🚤",title:"Tender alla deriva",text:"Un tender non riesce a rientrare in porto e richiede assistenza.",sector:"marina",cost:120,reward:420,prestige:10,reputation:6,duration:26},
 {type:"Avaria",icon:"🔧",title:"Guasto generatore",text:"Un armatore richiede intervento urgente sul generatore di bordo.",sector:"tecnica",cost:160,reward:560,prestige:12,reputation:7,duration:30},
 {type:"Ormeggio",icon:"⚓",title:"Manovra critica",text:"Yacht in ingresso richiede supporto immediato all'ormeggio.",sector:"marina",cost:90,reward:340,prestige:8,reputation:5,duration:22},
 {type:"Assistenza",icon:"🧰",title:"Cima nell'elica",text:"Richiesta urgente di assistenza tecnica in acqua.",sector:"tecnica",cost:140,reward:500,prestige:11,reputation:7,duration:28},
 {type:"VIP",icon:"✨",title:"Trasferimento ospiti VIP",text:"Concierge richiede un intervento rapido per ospiti appena arrivati.",sector:"servizi",cost:220,reward:760,prestige:18,reputation:10,duration:34}
];

const style=document.createElement("style");
style.textContent=".me-emergency-box{margin:10px 0;padding:10px 12px;border:1px solid rgba(255,115,115,.45);border-radius:12px;background:linear-gradient(135deg,#351820,#112b37)}.me-emergency-box strong{color:#ffd0b7;font-size:12px}.me-emergency-box p{margin:4px 0;font-size:10px;color:#d8e1e4}.me-emergency-meta{display:flex;gap:7px;flex-wrap:wrap;font-size:9px;color:#9fb7c1;margin:6px 0}.me-emergency-actions{display:flex;gap:6px;flex-wrap:wrap}.me-emergency-actions button{padding:7px 10px;border-radius:9px;border:1px solid rgba(255,199,150,.45);background:#563224;color:#fff;cursor:pointer}.me-emergency-progress{height:5px;background:#40262a;border-radius:99px;overflow:hidden;margin-top:8px}.me-emergency-progress span{display:block;height:100%;width:0;background:#f3b66e}.me-emergency-status{font-size:9px;margin-top:6px;color:#dce7eb}";
document.head.appendChild(style);

let current=null,job=null,box=null,timer=null,tick=null;
function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function snap(){return window.MarinaEmpireEmergencyEconomy?.snapshot?.()||{port:"rimini",coins:0,registered:false,trip:false}}
function world(){return window.MarinaEmpireWorldEvents?.modifiers?.(snap().port)||null}
function slot(){return Math.floor(Date.now()/3600000)}
function choose(){
 const s=snap(),w=world(),seed=hash(s.port+"|"+slot());
 const pool=[...BASE];
 if(w?.weather?.id==="rough"){pool.push(BASE[0],BASE[1],BASE[4],BASE[4]);}
 if(w?.weather?.id==="rain"){pool.push(BASE[2],BASE[3]);}
 if(w?.event?.id==="vip_arrivals"){pool.push(BASE[5],BASE[5]);}
 const e={...pool[seed%pool.length]};
 const danger=w?.weather?.id==="rough"?1.25:w?.weather?.id==="rain"?1.1:1;
 const eventBoost=w?.event?.demand?Math.max(1,Number(w.event.demand)):1;
 e.reward=Math.round(e.reward*danger*eventBoost);
 e.prestige=Math.round(e.prestige*danger);
 e.id="emergency-"+s.port+"-"+slot()+"-"+e.type.toLowerCase();
 e.expiresAt=(slot()+1)*3600000;
 return e;
}
function timeLeft(){return Math.max(0,Math.ceil((current.expiresAt-Date.now())/60000))}
function host(){
 return document.querySelector(".me-live-marina")||document.querySelector("#missions .panel")||document.getElementById("missionList");
}
function ensure(){
 const h=host();if(!h)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("div");box.className="me-emergency-box";
 h.appendChild(box);return true;
}
function navigable(em){return em?.type==="SOS"||em?.type==="Recupero"}
function render(){
 if(!ensure())return;
 if(!current)current=choose();
 const w=world();
 box.innerHTML='<strong>'+current.icon+' EMERGENZA LIVE · '+current.title+'</strong><p>'+current.text+'</p><div class="me-emergency-meta"><span>'+current.type+'</span><span>⏱ '+current.duration+'s</span><span>Costo '+current.cost+'</span><span>Ricompensa '+current.reward+'</span><span>Prestigio +'+current.prestige+'</span><span>Rep. '+current.sector+' +'+current.reputation+'</span><span>Scade tra '+timeLeft()+' min</span>'+(w?.weather?'<span>'+w.weather.icon+' '+w.weather.label+'</span>':'')+'</div><div class="me-emergency-actions"><button type="button" class="me-emergency-accept" '+(job?'disabled':'')+'>'+(navigable(current)?"SALPA PER SOS":"ACCETTA EMERGENZA")+'</button></div><div class="me-emergency-progress"><span style="width:'+(job?Math.min(100,job.progress):0)+'%"></span></div><div class="me-emergency-status">'+(job?'Intervento in corso':'Disponibile ora')+'</div>';
 box.querySelector(".me-emergency-accept")?.addEventListener("click",accept);
}
function accept(){
 if(job||!current)return;
 const st=box.querySelector(".me-emergency-status");
 if(navigable(current)){
  const nav=window.MarinaEmpireEmergencyNavigation;
  const result=nav?.start?.(current)||{ok:false,message:"Navigazione SOS non disponibile."};
  st.textContent=result.message||"";
  if(result.ok){job={...current,navigation:true,progress:0};setTimeout(()=>{box?.remove();box=null;},900);}
  return;
 }
 const econ=window.MarinaEmpireEmergencyEconomy;
 const check=econ?.canStart?.(current)||{ok:false,message:"Sistema emergenze non disponibile."};
 if(!check.ok){st.textContent=check.message;return;}
 job={...current,started:Date.now(),progress:0};
 st.textContent="Intervento accettato";
 clearInterval(tick);
 tick=setInterval(()=>{
  const elapsed=(Date.now()-job.started)/1000;
  job.progress=Math.min(100,elapsed/job.duration*100);
  const bar=box.querySelector(".me-emergency-progress span");if(bar)bar.style.width=job.progress+"%";
  if(st)st.textContent=job.progress>=100?"Registrazione intervento…":"In corso · "+Math.max(0,Math.ceil(job.duration-elapsed))+"s";
  if(job.progress>=100){
   clearInterval(tick);tick=null;
   const r=econ.complete(job,job.id);
   if(st)st.textContent=r.ok?("Completata · netto +"+r.net+" · prestigio +"+r.prestige+" · rep. "+r.sector+" +"+r.reputation):(r.message||"Intervento non registrato.");
   setTimeout(()=>{job=null;current=choose();render();},r.ok?3500:5000);
  }
 },500);
}
function refresh(){
 if(!job){const next=choose();if(!current||next.id!==current.id){current=next;render()}else render()}
 clearTimeout(timer);timer=setTimeout(refresh,60000);
}
function boot(){
 if(!ensure()){setTimeout(boot,800);return;}
 current=choose();render();refresh();
 window.addEventListener("marina-world-event",()=>{if(!job){current=choose();render()}});
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;ensure();render()},80));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();