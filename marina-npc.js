(()=>{
"use strict";
if(window.__ME_MARINA_NPC__) return;
window.__ME_MARINA_NPC__=true;

const OPPORTUNITIES=[
 {role:"Comandante",icon:"🧑‍✈️",type:"Rifornimento",text:"richiede rifornimento prima della partenza",duration:18,cost:120,reward:320,prestige:8},
 {role:"Comandante",icon:"🧑‍✈️",type:"Ormeggio",text:"cerca un posto transito per questa notte",duration:22,cost:80,reward:280,prestige:7},
 {role:"Comandante",icon:"🧑‍✈️",type:"Tecnica",text:"segnala un problema al generatore",duration:28,cost:160,reward:460,prestige:12,reputation:8,requiredSectorLevel:2},
 {role:"Marinaio",icon:"🧑‍🔧",type:"Assistenza",text:"richiede assistenza per una cima nell'elica",duration:20,cost:90,reward:300},
 {role:"Marinaio",icon:"🧑‍🔧",type:"Pulizia",text:"prenota lavaggio coperta",duration:16,cost:70,reward:220,prestige:5},
 {role:"Charter",icon:"🛥️",type:"Charter",text:"cerca disponibilità per un'uscita giornaliera",duration:35,cost:240,reward:720},
 {role:"Charter",icon:"🛥️",type:"Cambusa",text:"richiede cambusa urgente",duration:24,cost:130,reward:390,prestige:10},
 {role:"Armatore",icon:"👤",type:"Detailing",text:"richiede detailing completo",duration:30,cost:180,reward:540,prestige:14},
 {role:"Armatore",icon:"👤",type:"Manutenzione",text:"chiede preventivo manutenzione",duration:32,cost:210,reward:620,prestige:16,reputation:9,requiredSectorLevel:2},
 {role:"Tecnico",icon:"🔧",type:"Elettrico",text:"intervento su batterie di bordo",duration:26,cost:150,reward:450,prestige:12},
 {role:"Broker",icon:"💼",type:"Brokerage",text:"organizza visita a uno yacht in vendita",duration:20,cost:60,reward:260,prestige:7},
 {role:"Broker",icon:"💼",type:"Sea Trial",text:"cerca disponibilità per prova in mare",duration:30,cost:140,reward:500,prestige:13,reputation:8,requiredSectorLevel:2}
];

const style=document.createElement("style");
style.textContent=`
.me-npc-box{margin-top:8px;border-top:1px solid rgba(194,154,96,.22);padding:8px 10px 10px;background:rgba(2,14,22,.28)}
.me-npc-title{font-size:9px;letter-spacing:.08em;color:#8fb4c2;margin-bottom:5px}
.me-npc-row{display:flex;gap:7px;align-items:flex-start;font-size:10px;color:#d7e2e6;line-height:1.25}
.me-npc-role{color:#f0d29d;font-weight:600;white-space:nowrap}
.me-npc-level{font-size:9px;color:#8fb4c2;margin-top:6px}
.me-npc-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:7px;font-size:9px;color:#9fb9c4}
.me-npc-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.me-npc-actions button{border:1px solid rgba(240,210,157,.45);background:#0b3144;color:#f3e5c8;border-radius:9px;padding:7px 10px;font-size:10px;cursor:pointer}
.me-npc-actions button:hover{background:#10445f}
.me-npc-actions button:disabled{opacity:.45;cursor:not-allowed}
.me-npc-progress{height:5px;background:#123548;border-radius:99px;overflow:hidden;margin-top:8px}
.me-npc-progress>span{display:block;height:100%;width:0;background:#d9b06f;transition:width .4s linear}
.me-npc-status{margin-top:6px;font-size:9px;color:#cbd9de}
`;
document.head.appendChild(style);

let timer=null,box=null,current=null,job=null,jobTick=null;

function level(){
 const h=new Date().getHours();
 if(h>=11&&h<19)return "MOLTO ALTA";
 if(h>=7&&h<11)return "ALTA";
 if(h>=19&&h<23)return "MEDIA";
 return "BASSA";
}
function worldEvent(){return window.MarinaEmpireWorldEvents?.current?.()||null}
function worldWeather(){return window.MarinaEmpireWorldEvents?.modifiers?.()?.weather||null}
function worldSector(op){
 const economy=window.MarinaEmpireNpcEconomy;
 return economy?.sectorFor?economy.sectorFor(op):"servizi";
}
function adjusted(op){
 const e=worldEvent();
 if(!e)return {...op};
 const sector=worldSector(op),fav=Array.isArray(e.sectors)&&e.sectors.includes(sector);
 const rewardMult=fav?Math.max(1.05,Number(e.demand)||1):1;
 const prestigeMult=fav?1.15:1;
 return {...op,
  reward:Math.max(1,Math.round(op.reward*rewardMult)),
  prestige:Math.max(1,Math.round((op.prestige||Math.max(2,op.reward/40))*prestigeMult)),
  worldEvent:e.title,
  worldFavored:fav
 };
}
function pick(){
 const e=worldEvent(),w=worldWeather();
 const weighted=[];
 for(const op of OPPORTUNITIES){
  const sector=worldSector(op),fav=e&&Array.isArray(e.sectors)&&e.sectors.includes(sector);
  weighted.push(op);
  if(fav){weighted.push(op);weighted.push(op);}
  const sector=worldSector(op);
  if(w?.id==="rough"&&(sector==="tecnica"||sector==="marina")){weighted.push(op);weighted.push(op);}
  if(w?.id==="rain"&&sector==="servizi")weighted.push(op);
 }
 const picked=adjusted(weighted[Math.floor(Math.random()*weighted.length)]);
 const w=worldWeather();
 if(w&&w.id==="rough"&&worldSector(picked)==="charter")picked.reward=Math.round(picked.reward*.9);
 return picked;
}
function ensure(){
 const live=document.querySelector(".me-live-marina");
 if(!live)return false;
 if(box&&box.parentNode===live)return true;
 box=document.createElement("div");
 box.className="me-npc-box";
 box.innerHTML='<div class="me-npc-title">OPPORTUNITÀ DAL PORTO</div><div class="me-npc-row"></div><div class="me-npc-meta"></div><div class="me-npc-actions"><button type="button" class="me-npc-accept">ACCETTA</button><button type="button" class="me-npc-skip">PASSA</button></div><div class="me-npc-progress"><span></span></div><div class="me-npc-status"></div><div class="me-npc-level"></div>';
 live.appendChild(box);
 box.querySelector(".me-npc-accept").addEventListener("click",acceptCurrent);
 box.querySelector(".me-npc-skip").addEventListener("click",()=>{ if(!job){ current=pick(); renderCurrent(); }});
 return true;
}
function renderCurrent(){
 if(!ensure())return;
 if(!current)current=pick();
 box.querySelector(".me-npc-row").innerHTML='<span>'+current.icon+'</span><span><span class="me-npc-role">'+current.role+'</span> · '+current.text+'</span>';
 const economy=window.MarinaEmpireNpcEconomy;
 const sector=economy?.sectorFor?economy.sectorFor(current):"servizi";
 const sectorLevel=economy?.sectorLevel?economy.sectorLevel(sector):1;
 const rep=current.reputation||Math.max(3,Math.round(current.reward/70));
 const req=current.requiredSectorLevel||1;
 box.querySelector(".me-npc-meta").innerHTML='<span>'+current.type+'</span><span>⏱ '+current.duration+'s</span><span>Costo '+current.cost+'</span><span>Ricompensa '+current.reward+'</span><span>Prestigio +'+current.prestige+'</span><span>Rep. '+sector+' +'+rep+'</span><span>Lv settore '+sectorLevel+(req>1?' / richiesto '+req:'')+'</span>'+(current.worldFavored?'<span>🔥 BONUS EVENTO: '+current.worldEvent+'</span>':'');
 const w=worldWeather();box.querySelector(".me-npc-level").textContent="Attività marina: "+level()+(w?" · "+w.icon+" "+w.label:"");
 box.querySelector(".me-npc-status").textContent=job?"Attività in corso":"Disponibile ora";
 box.querySelector(".me-npc-progress span").style.width=job?Math.min(100,job.progress)+"%":"0%";
 box.querySelector(".me-npc-accept").disabled=!!job;
 box.querySelector(".me-npc-skip").disabled=!!job;
}
function acceptCurrent(){
 if(job||!current)return;
 const economy=window.MarinaEmpireNpcEconomy;
 if(!economy||typeof economy.canStart!=="function"){box.querySelector(".me-npc-status").textContent="Economia marina non disponibile.";return;}
 const check=economy.canStart(current);
 if(!check.ok){box.querySelector(".me-npc-status").textContent=check.message||"Incarico non disponibile.";return;}
 job={...current,started:Date.now(),progress:0,id:"npc-"+Date.now()+"-"+Math.random().toString(36).slice(2,8)};
 box.querySelector(".me-npc-status").textContent="Attività accettata · simulazione locale";
 box.querySelector(".me-npc-accept").disabled=true;
 box.querySelector(".me-npc-skip").disabled=true;
 clearInterval(jobTick);
 jobTick=setInterval(()=>{
   const elapsed=(Date.now()-job.started)/1000;
   job.progress=Math.min(100,(elapsed/job.duration)*100);
   const bar=box&&box.querySelector(".me-npc-progress span");
   if(bar)bar.style.width=job.progress+"%";
   const st=box&&box.querySelector(".me-npc-status");
   if(st)st.textContent=job.progress>=100?"Completamento in registrazione…":"In corso · "+Math.max(0,Math.ceil(job.duration-elapsed))+"s";
   if(job.progress>=100){
     clearInterval(jobTick);jobTick=null;
     const result=window.MarinaEmpireNpcEconomy?.complete(job,job.id)||{ok:false,message:"Economia marina non disponibile."};
     if(st)st.textContent=result.ok?("Completata · netto +"+result.net+" · prestigio +"+result.prestige+" · rep. "+result.sector+" +"+result.reputation+" · lv settore "+result.sectorLevel):(result.message||"Completamento non registrato.");
     setTimeout(()=>{job=null;current=pick();renderCurrent();},result.ok?3200:5000);
   }
 },500);
}
function loop(){
 clearTimeout(timer);
 if(!document.hidden&&!job){current=pick();renderCurrent();}
 timer=setTimeout(loop,26000+Math.floor(Math.random()*16000));
}
function boot(){
 if(!ensure()){setTimeout(boot,700);return;}
 current=pick();renderCurrent();loop();
 const list=document.getElementById("marinaList");
 if(list)new MutationObserver(()=>setTimeout(()=>{box=null;ensure();renderCurrent();},100)).observe(list,{childList:true,subtree:true});
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;ensure();renderCurrent();},100));
 window.addEventListener("marina-world-event",()=>{if(!job){current=pick();setTimeout(renderCurrent,80);}});
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)renderCurrent();});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
})();