(()=>{
"use strict";
if(window.__ME_MOBILE_DAILY_OPS_V1__)return;
window.__ME_MOBILE_DAILY_OPS_V1__=true;

const DAILY_POOL=[
 {id:"voyages",metric:"voyages",label:"Completa 2 missioni",target:2,reward:1200,prestige:18,icon:"🧭",panel:"missions"},
 {id:"jobs",metric:"npcJobs",label:"Completa 2 lavori marina",target:2,reward:900,prestige:14,icon:"⚓",panel:"marinas"},
 {id:"emergency",metric:"emergencies",label:"Gestisci 1 emergenza",target:1,reward:1100,prestige:16,icon:"🆘",panel:"marinas"},
 {id:"market",metric:"marketDeals",label:"Concludi 1 affare Marketplace",target:1,reward:800,prestige:12,icon:"💼",panel:"marketplace"},
 {id:"chain",metric:"chains",label:"Completa 1 catena specializzazione",target:1,reward:1600,prestige:24,icon:"🎯",panel:"marinas"}
];

const style=document.createElement("style");
style.id="me-mobile-daily-ops-v1-style";
style.textContent=`
@media(max-width:740px){
  #home .me-objectives{display:none!important}
  #meMobileDailyOps{
    order:-12!important;
    margin:0!important;padding:11px!important;
    border:1px solid rgba(204,166,96,.62)!important;border-radius:14px!important;
    background:linear-gradient(145deg,#0a3141,#082534)!important;
    box-shadow:0 8px 22px rgba(0,0,0,.24)!important;
  }
  #meMobileDailyOpsHead{
    display:flex!important;align-items:center!important;justify-content:space-between!important;
    gap:8px!important;margin-bottom:8px!important
  }
  #meMobileDailyOpsHead div{min-width:0!important}
  #meMobileDailyOpsHead small{
    display:block!important;color:#8daab5!important;font-size:7px!important;
    font-weight:900!important;letter-spacing:.12em!important
  }
  #meMobileDailyOpsHead strong{
    display:block!important;margin-top:2px!important;color:#f3d598!important;
    font-size:13px!important;line-height:1.05!important
  }
  #meMobileDailyStreak{
    flex:0 0 auto!important;min-height:34px!important;padding:6px 9px!important;
    border:1px solid rgba(214,181,117,.5)!important;border-radius:999px!important;
    background:#143949!important;color:#f3d69d!important;font-size:8px!important;font-weight:950!important
  }
  #meMobileDailyStreak.ready{
    background:linear-gradient(135deg,#d7af58,#a4742e)!important;color:#102532!important;
    border-color:#efd087!important
  }
  #meMobileDailyOpsList{display:grid!important;gap:6px!important}
  .me-mobile-daily-row{
    display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;
    gap:8px!important;align-items:center!important;
    padding:8px!important;border:1px solid rgba(255,255,255,.08)!important;
    border-radius:10px!important;background:rgba(4,26,37,.55)!important
  }
  .me-mobile-daily-row.done{border-color:rgba(83,207,158,.34)!important}
  .me-mobile-daily-copy{min-width:0!important}
  .me-mobile-daily-copy strong{
    display:block!important;color:#e8f0f2!important;font-size:9px!important;
    white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important
  }
  .me-mobile-daily-copy span{
    display:block!important;margin-top:3px!important;color:#94afb9!important;font-size:8px!important
  }
  .me-mobile-daily-bar{
    display:block!important;height:4px!important;margin-top:5px!important;border-radius:99px!important;
    background:#173b49!important;overflow:hidden!important
  }
  .me-mobile-daily-bar i{
    display:block!important;height:100%!important;background:#d8b366!important;border-radius:99px!important
  }
  .me-mobile-daily-row.done .me-mobile-daily-bar i{background:#65c99f!important}
  .me-mobile-daily-action{
    min-width:80px!important;min-height:38px!important;padding:6px 8px!important;
    border:1px solid rgba(214,181,117,.48)!important;border-radius:9px!important;
    background:#123b4b!important;color:#f2d498!important;font-size:8px!important;font-weight:950!important
  }
  .me-mobile-daily-action.claim{
    background:linear-gradient(135deg,#dfbd68,#a77731)!important;color:#102532!important
  }
  .me-mobile-daily-action:disabled{opacity:.48!important}
  #meMobileDailySummary{
    margin-top:7px!important;color:#8da9b4!important;font-size:8px!important;text-align:center!important
  }
}
@media(min-width:741px){#meMobileDailyOps{display:none!important}}
`;
document.head.appendChild(style);

function dayKey(){
 const d=new Date();
 return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function hash(str){
 let h=2166136261;
 for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
 return h>>>0;
}
function selected(){
 const seed=hash(dayKey()),items=[...DAILY_POOL];
 items.sort((a,b)=>((hash(a.id+"|"+seed)%1000)-(hash(b.id+"|"+seed)%1000)));
 return items.slice(0,3);
}
function api(){return window.MarinaEmpireObjectives||null}
function openPanel(id){
 if(window.MarinaEmpireMobileHome?.open){window.MarinaEmpireMobileHome.open(id);return}
 if(typeof showTab==="function")showTab(id);
}
function ensure(){
 if(typeof innerWidth!=="undefined"&&innerWidth>740)return null;
 const home=document.querySelector("#home .me-mobile-home-dashboard");
 if(!home)return null;
 let box=document.getElementById("meMobileDailyOps");
 if(box)return box;
 box=document.createElement("section");
 box.id="meMobileDailyOps";
 box.innerHTML='<div id="meMobileDailyOpsHead"><div><small>OPERAZIONI DI OGGI</small><strong>La tua giornata da comandante</strong></div><button type="button" id="meMobileDailyStreak">🔥 CONTINUITÀ</button></div><div id="meMobileDailyOpsList"></div><div id="meMobileDailySummary">3 attività dinamiche · premi crediti e prestigio</div>';
 const services=document.getElementById("meMobileHomeServices");
 if(services)services.insertAdjacentElement("afterend",box);
 else {
   const center=document.getElementById("meMobileHomeCommandCenter");
   if(center)center.insertAdjacentElement("beforebegin",box);else home.append(box);
 }
 box.querySelector("#meMobileDailyStreak")?.addEventListener("click",()=>{
   const a=api();if(!a)return;
   const r=a.checkIn(dayKey());
   try{if(typeof notice==="function"&&r?.message)notice(r.message,5000)}catch(_){}
   setTimeout(render,80);
 });
 box.addEventListener("click",e=>{
   const b=e.target.closest("[data-daily-id]");if(!b)return;
   const item=selected().find(x=>x.id===b.dataset.dailyId);if(!item)return;
   const a=api(),st=a?.status?.("daily",dayKey());
   const claimed=new Set(st?.claimed||[]);
   const base=Number(st?.base?.[item.metric])||0;
   const now=Number(st?.metrics?.[item.metric])||0;
   const progress=Math.max(0,now-base);
   if(progress>=item.target&&!claimed.has(item.id)){
     const r=a.claim("daily",dayKey(),item.id,item.metric,item.target,item.reward,item.prestige);
     try{if(typeof notice==="function"&&r?.message)notice(r.message,5000)}catch(_){}
     setTimeout(render,100);
     return;
   }
   if(progress<item.target)openPanel(item.panel);
 });
 return box;
}
function render(){
 if(typeof innerWidth!=="undefined"&&innerWidth>740)return;
 const box=ensure(),a=api();
 if(!box||!a||typeof state==="undefined"||!state?.name)return;
 const tutorialDone=!!window.meRegisteredPlayer||(Number(state.voyages)||0)>=2;
 box.style.display=tutorialDone?"":"none";
 if(!tutorialDone)return;
 a.ensure("daily",dayKey());
 const st=a.status("daily",dayKey());
 if(!st)return;
 const claims=new Set(st.claimed||[]);
 const items=selected();

 const streak=box.querySelector("#meMobileDailyStreak");
 if(streak){
   const done=state.dailyStreak?.lastDay===dayKey();
   const count=Math.max(0,Math.floor(Number(state.dailyStreak?.count)||0));
   streak.disabled=done;
   streak.classList.toggle("ready",!done);
   streak.textContent=done?"🔥 "+Math.max(1,count)+" GIORNI":"🔥 RISCATTA";
 }

 let completed=0;
 const list=box.querySelector("#meMobileDailyOpsList");
 if(list){
   list.innerHTML=items.map(item=>{
     const base=Number(st.base?.[item.metric])||0;
     const now=Number(st.metrics?.[item.metric])||0;
     const progress=Math.max(0,now-base);
     const done=progress>=item.target;
     const claimed=claims.has(item.id);
     if(claimed)completed++;
     const pct=Math.max(0,Math.min(100,Math.round(progress/item.target*100)));
     const action=claimed?"RISCOSSO":done?"RISCATTA":"VAI";
     return '<div class="me-mobile-daily-row '+(done?"done":"")+'"><div class="me-mobile-daily-copy"><strong>'+item.icon+' '+item.label+'</strong><span>'+Math.min(progress,item.target)+' / '+item.target+' · '+item.reward.toLocaleString("it-IT")+' cr · +'+item.prestige+' prest.</span><span class="me-mobile-daily-bar"><i style="width:'+pct+'%"></i></span></div><button type="button" class="me-mobile-daily-action '+(done&&!claimed?"claim":"")+'" data-daily-id="'+item.id+'" '+(claimed?"disabled":"")+'>'+action+'</button></div>';
   }).join("");
 }
 const summary=box.querySelector("#meMobileDailySummary");
 if(summary)summary.textContent=completed===3?"Operazioni giornaliere completate · torna domani per nuovi incarichi":completed+" / 3 premi riscossi · obiettivi aggiornati in tempo reale";
}
window.MarinaEmpireMobileDailyOps={render,selected,dayKey};

function boot(){
 if(!ensure()){setTimeout(boot,500);return}
 render();
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,60));
 window.addEventListener("marina-world-event",()=>setTimeout(render,60));
 setInterval(render,15000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();