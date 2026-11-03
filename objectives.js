(()=>{
"use strict";
if(window.__ME_OBJECTIVES__)return;
window.__ME_OBJECTIVES__=true;

const DAILY_POOL=[
 {id:"voyages",metric:"voyages",label:"Completa 2 missioni",target:2,reward:1200,prestige:18,icon:"🧭"},
 {id:"jobs",metric:"npcJobs",label:"Completa 2 lavori marina",target:2,reward:900,prestige:14,icon:"⚓"},
 {id:"emergency",metric:"emergencies",label:"Gestisci 1 emergenza",target:1,reward:1100,prestige:16,icon:"🆘"},
 {id:"market",metric:"marketDeals",label:"Concludi 1 affare Marketplace",target:1,reward:800,prestige:12,icon:"💼"},
 {id:"chain",metric:"chains",label:"Completa 1 catena specializzazione",target:1,reward:1600,prestige:24,icon:"🎯"}
];
const WEEKLY_POOL=[
 {id:"voyages",metric:"voyages",label:"Completa 10 missioni",target:10,reward:8000,prestige:90,icon:"🗺️"},
 {id:"jobs",metric:"npcJobs",label:"Completa 8 lavori marina",target:8,reward:5000,prestige:70,icon:"⚓"},
 {id:"emergency",metric:"emergencies",label:"Gestisci 4 emergenze",target:4,reward:5200,prestige:75,icon:"🆘"},
 {id:"market",metric:"marketDeals",label:"Concludi 4 affari Marketplace",target:4,reward:4200,prestige:60,icon:"💼"},
 {id:"chain",metric:"chains",label:"Completa 2 catene specializzazione",target:2,reward:6500,prestige:85,icon:"🎯"}
];

const style=document.createElement("style");
style.textContent=".me-streak{margin:10px 0;padding:9px 10px;border:1px solid rgba(214,181,117,.3);border-radius:10px;background:#102f3c}.me-streak strong{color:#f0d296}.me-streak button{margin-top:6px;padding:7px 9px;border-radius:8px;border:1px solid rgba(214,181,117,.45);background:#5a4726;color:#fff}.me-objectives{margin:12px 0;padding:12px;border:1px solid rgba(214,181,117,.38);border-radius:13px;background:#0d2d3b}.me-objectives-head{display:flex;justify-content:space-between;gap:8px;align-items:center}.me-objectives h3{margin:0;color:#f0d296}.me-objective-tabs{display:flex;gap:6px}.me-objective-tabs button{padding:6px 9px;border-radius:999px;border:1px solid rgba(214,181,117,.35);background:#113847;color:#dce7ea}.me-objective-tabs button.on{background:#6a522a;color:#fff}.me-objective-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}.me-objective{padding:10px;border:1px solid rgba(214,181,117,.22);border-radius:10px;background:#0a2531}.me-objective strong{display:block;color:#fff}.me-objective p{margin:5px 0;font-size:10px}.me-objective progress{width:100%;accent-color:#d6b575}.me-objective button{margin-top:7px;width:100%;padding:7px;border-radius:8px;border:1px solid rgba(214,181,117,.45);background:#17465b;color:#fff}.me-objective button:disabled{opacity:.5}.me-objective-status{font-size:9px;color:#9fb8c2;margin-top:6px}@media(max-width:740px){.me-objective-list{grid-template-columns:1fr}.me-objectives{padding:10px}}";
document.head.appendChild(style);

let mode="daily",box=null;
function dayKey(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function weekKey(){
 const d=new Date(),copy=new Date(d.getFullYear(),d.getMonth(),d.getDate());
 const day=(copy.getDay()+6)%7;copy.setDate(copy.getDate()-day);
 return "W-"+copy.getFullYear()+"-"+String(copy.getMonth()+1).padStart(2,"0")+"-"+String(copy.getDate()).padStart(2,"0");
}
function key(){return mode==="weekly"?weekKey():dayKey()}
function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function selected(){
 const pool=mode==="weekly"?WEEKLY_POOL:DAILY_POOL,seed=hash(key());
 const items=[...pool];
 items.sort((a,b)=>((hash(a.id+"|"+seed)%1000)-(hash(b.id+"|"+seed)%1000)));
 return items.slice(0,3);
}
function host(){
 return document.querySelector("#home .panel")||document.getElementById("missionList")||document.querySelector("#missions .panel");
}
function ensure(){
 const h=host();if(!h)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("section");box.className="me-objectives";box.setAttribute("aria-label","Obiettivi");
 h.prepend(box);return true;
}
function render(){
 if(!ensure())return;
 const api=window.MarinaEmpireObjectives;if(!api)return;
 api.ensure(mode,key());
 const st=api.status(mode,key());if(!st)return;
 const claims=new Set(st.claimed||[]),items=selected();
 const streak=window.MarinaEmpireObjectives?.status?null:null;
 box.innerHTML='<div class="me-streak"><strong>🔥 CONTINUITÀ COMANDANTE</strong><p id="meStreakText">Rientra e riscuoti il premio giornaliero.</p><button type="button" id="meStreakClaim">RISCATTA PREMIO DI OGGI</button></div><div class="me-objectives-head"><h3>🏁 OBIETTIVI '+(mode==="daily"?"GIORNALIERI":"SETTIMANALI")+'</h3><div class="me-objective-tabs"><button type="button" data-obj-mode="daily" class="'+(mode==="daily"?"on":"")+'">OGGI</button><button type="button" data-obj-mode="weekly" class="'+(mode==="weekly"?"on":"")+'">SETTIMANA</button></div></div><div class="me-objective-list">'+items.map(o=>{const base=Number(st.base?.[o.metric])||0,now=Number(st.metrics?.[o.metric])||0,p=Math.max(0,now-base),done=p>=o.target,claimed=claims.has(o.id);return '<article class="me-objective"><strong>'+o.icon+' '+o.label+'</strong><p>'+Math.min(p,o.target)+' / '+o.target+' · Premio '+o.reward.toLocaleString("it-IT")+' crediti · prestigio +'+o.prestige+'</p><progress max="'+o.target+'" value="'+Math.min(p,o.target)+'"></progress><button type="button" data-obj-claim="'+o.id+'" data-metric="'+o.metric+'" data-target="'+o.target+'" data-reward="'+o.reward+'" data-prestige="'+o.prestige+'" '+(!done||claimed?'disabled':'')+'>'+(claimed?'PREMIO RISCOSSO':done?'RISCATTA PREMIO':'IN CORSO')+'</button></article>'}).join("")+'</div><div class="me-objective-status">Gli obiettivi si aggiornano con le attività reali del gioco.</div>';
 const streakBtn=box.querySelector("#meStreakClaim");if(streakBtn)streakBtn.addEventListener("click",()=>{const r=api.checkIn(dayKey());const t=box.querySelector("#meStreakText");if(t)t.textContent=r?.message||"";if(r?.ok||r?.already)streakBtn.disabled=true;});
 box.querySelectorAll("[data-obj-mode]").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.objMode;render()}));
 box.querySelectorAll("[data-obj-claim]").forEach(b=>b.addEventListener("click",()=>{
  const r=api.claim(mode,key(),b.dataset.objClaim,b.dataset.metric,Number(b.dataset.target),Number(b.dataset.reward),Number(b.dataset.prestige));
  const s=box.querySelector(".me-objective-status");if(s)s.textContent=r?.message||"";
  if(r?.ok)setTimeout(render,300);
 }));
}
function boot(){
 if(!ensure()){setTimeout(boot,800);return}
 render();
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,80));
 window.addEventListener("marina-world-event",()=>setTimeout(render,80));
 setInterval(render,60000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();