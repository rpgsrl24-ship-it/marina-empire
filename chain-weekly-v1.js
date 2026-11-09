(()=>{"use strict";if(window.__ME_CHAIN_WEEKLY_V1__)return;window.__ME_CHAIN_WEEKLY_V1__=true;
const style=document.createElement("style");style.id="me-chain-weekly-v1-style";style.textContent=`
.me-cw-box{margin:9px 0;padding:10px;border:1px solid rgba(222,181,98,.55);border-radius:13px;background:linear-gradient(145deg,#113f53,#08293a);box-shadow:0 8px 22px #0004;color:#edf6f6}
.me-cw-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.me-cw-head small{display:block;color:#94b1ba;font-size:7px;font-weight:950;letter-spacing:.12em}.me-cw-head strong{display:block;margin-top:2px;color:#f1d28f;font:800 14px Georgia,serif}.me-cw-badge{padding:5px 7px;border:1px solid #d3aa60;border-radius:999px;color:#f6d996;font-size:7px;font-weight:950}
.me-cw-chain{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}.me-cw-step{padding:9px;border:1px solid #3f6b7c;border-radius:11px;background:#0a3043}.me-cw-step.on{border-color:#e0b665;background:#123d4f}.me-cw-step.done{border-color:#64c99a;background:#0d3b3d}.me-cw-step b{display:block;color:#f1d08b;font-size:9px}.me-cw-step p{margin:4px 0;color:#b8cdd3;font-size:7.5px;line-height:1.3}.me-cw-step span{display:block;color:#7fdca4;font-size:7px;font-weight:900}.me-cw-step button{width:100%;min-height:34px;margin-top:6px;border:1px solid #d8b365;border-radius:9px;background:#123b4e;color:#f7dca4;font-size:7px;font-weight:950}.me-cw-step button.gold{background:linear-gradient(180deg,#e5c374,#b98232);color:#082333}
.me-cw-week{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}.me-cw-goal{padding:9px;border:1px solid #3f6b7c;border-radius:11px;background:#0a3043}.me-cw-goal strong{display:block;color:#f3d28f;font-size:9px}.me-cw-goal p{margin:4px 0;color:#b7cbd2;font-size:7.5px}.me-cw-bar{height:6px;border-radius:99px;overflow:hidden;background:#173a48}.me-cw-bar i{display:block;height:100%;background:linear-gradient(90deg,#69daa4,#e6c16a)}.me-cw-foot{display:flex;justify-content:space-between;gap:6px;margin-top:4px;color:#9db6bf;font-size:7px}.me-cw-claim{width:100%;min-height:36px;margin-top:7px;border:1px solid #dfb96a;border-radius:9px;background:#153f51;color:#f5d99c;font-size:8px;font-weight:950}
@media(max-width:899px){.me-cw-chain,.me-cw-week{grid-template-columns:1fr}.me-cw-box{margin:8px 0}}
`;document.head.appendChild(style);
function st(){try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}}
function save(){try{if(typeof persist==="function")persist()}catch(_){};try{window.dispatchEvent(new Event("marina-empire-updated"))}catch(_){}}
function notice2(t){try{if(typeof notice==="function")notice(t);else alert(t)}catch(_){alert(t)}}
function weekKey(){const d=new Date(),onejan=new Date(d.getFullYear(),0,1),days=Math.floor((d-onejan)/86400000);return d.getFullYear()+"-W"+String(Math.ceil((days+onejan.getDay()+1)/7)).padStart(2,"0")}
function ensureData(){const s=st();if(!s)return null;
 if(!s.chainMission||typeof s.chainMission!=="object")s.chainMission={id:"med_run",step:0,done:false,claimed:false};
 if(!s.weeklyGoals||typeof s.weeklyGoals!=="object"||s.weeklyGoals.key!==weekKey())s.weeklyGoals={key:weekKey(),claimed:false,startVoyages:Number(s.voyages)||0,startPrestige:Number(s.prestige)||0,startContracts:Number(s.livingContractsDone)||0,startCoins:Number(s.coins)||0};
 return s;
}
const STEPS=[
 {title:"Rotta di lancio",text:"Completa 1 viaggio per aprire la catena.",type:"voyages",need:1,reward:2500,prestige:15},
 {title:"Operazione marina",text:"Completa 2 contratti dinamici.",type:"contracts",need:2,reward:5000,prestige:25},
 {title:"Comandante in crescita",text:"Guadagna 120 prestigio durante la catena.",type:"prestige",need:120,reward:9000,prestige:40}
];
function baseline(){const s=ensureData();if(!s)return null;if(!s.chainMission.base)s.chainMission.base={voyages:Number(s.voyages)||0,contracts:Number(s.livingContractsDone)||0,prestige:Number(s.prestige)||0};return s.chainMission.base}
function progressFor(step){const s=ensureData(),b=baseline();if(!s||!b)return 0;if(step.type==="voyages")return Math.max(0,(Number(s.voyages)||0)-b.voyages);if(step.type==="contracts")return Math.max(0,(Number(s.livingContractsDone)||0)-b.contracts);return Math.max(0,(Number(s.prestige)||0)-b.prestige)}
function advance(){const s=ensureData();if(!s||s.chainMission.done)return;const i=Math.max(0,Math.min(STEPS.length-1,Number(s.chainMission.step)||0)),step=STEPS[i],p=progressFor(step);if(p<step.need)return notice2("Obiettivo non ancora completato.");
 s.coins=(Number(s.coins)||0)+step.reward;s.prestige=(Number(s.prestige)||0)+step.prestige;s.chainMission.step=i+1;if(s.chainMission.step>=STEPS.length)s.chainMission.done=true;save();draw();notice2("Fase completata: +"+step.reward.toLocaleString("it-IT")+" crediti · +"+step.prestige+" prestigio");
}
function weekly(){const s=ensureData();if(!s)return[];return[
 {id:"voy",title:"Navigazione",desc:"Completa 4 viaggi questa settimana.",value:Math.max(0,(Number(s.voyages)||0)-s.weeklyGoals.startVoyages),need:4},
 {id:"prest",title:"Prestigio",desc:"Guadagna 400 prestigio.",value:Math.max(0,(Number(s.prestige)||0)-s.weeklyGoals.startPrestige),need:400},
 {id:"contracts",title:"Contratti",desc:"Completa 6 contratti dinamici.",value:Math.max(0,(Number(s.livingContractsDone)||0)-s.weeklyGoals.startContracts),need:6},
 {id:"earn",title:"Crescita economica",desc:"Guadagna 25.000 crediti netti.",value:Math.max(0,(Number(s.coins)||0)-s.weeklyGoals.startCoins),need:25000}
]}
function claimWeekly(){const s=ensureData(),g=weekly();if(!s||s.weeklyGoals.claimed)return;if(g.some(x=>x.value<x.need))return notice2("Completa tutti gli obiettivi settimanali.");
 s.coins=(Number(s.coins)||0)+30000;s.prestige=(Number(s.prestige)||0)+150;s.weeklyGoals.claimed=true;save();draw();notice2("Settimana completata: +30.000 crediti · +150 prestigio");
}
function ensure(){
 const missions=document.getElementById("missions"),home=document.getElementById("mePremiumHome")||document.querySelector("#home .me-mobile-home-dashboard");
 if(missions&&!document.getElementById("meChainMission")){const x=document.createElement("section");x.id="meChainMission";x.className="me-cw-box";const p=missions.querySelector(".panel")||missions;p.insertBefore(x,p.firstChild)}
 if(home&&!document.getElementById("meWeeklyGoals")){const x=document.createElement("section");x.id="meWeeklyGoals";x.className="me-cw-box";const a=home.querySelector("#meLivingCareer")||home.querySelector(".meph-live")||home.firstElementChild;if(a)a.insertAdjacentElement("afterend",x);else home.prepend(x)}
}
function drawChain(){const box=document.getElementById("meChainMission");if(!box)return;const s=ensureData(),idx=Math.max(0,Math.min(STEPS.length,Number(s.chainMission.step)||0));
 box.innerHTML='<div class="me-cw-head"><div><small>MISSIONE A CATENA · OPERAZIONE MEDITERRANEO</small><strong>Tre fasi consecutive con ricompensa crescente</strong></div><span class="me-cw-badge">'+(s.chainMission.done?"COMPLETATA":"FASE "+(idx+1)+"/3")+'</span></div><div class="me-cw-chain">'+STEPS.map((x,i)=>{const p=progressFor(x),done=i<idx||s.chainMission.done,on=i===idx&&!s.chainMission.done;return '<article class="me-cw-step '+(done?"done":on?"on":"")+'"><b>'+(done?"✓ ":"")+x.title+'</b><p>'+x.text+'</p><span>'+Math.min(p,x.need)+' / '+x.need+' · +'+x.reward.toLocaleString("it-IT")+' cr · +'+x.prestige+' prest.</span>'+(on?'<button class="gold" data-cw-advance '+(p>=x.need?"":"disabled")+'>'+(p>=x.need?"RISCUOTI E CONTINUA":"IN CORSO")+'</button>':'')+'</article>'}).join("")+'</div>';
 box.querySelector("[data-cw-advance]")?.addEventListener("click",advance);
}
function drawWeekly(){const box=document.getElementById("meWeeklyGoals");if(!box)return;const s=ensureData(),g=weekly(),done=g.every(x=>x.value>=x.need);
 box.innerHTML='<div class="me-cw-head"><div><small>OBIETTIVI SETTIMANALI · '+s.weeklyGoals.key+'</small><strong>Costruisci il tuo impero durante la settimana</strong></div><span class="me-cw-badge">'+g.filter(x=>x.value>=x.need).length+'/4</span></div><div class="me-cw-week">'+g.map(x=>{const pct=Math.max(0,Math.min(100,Math.round(x.value/x.need*100)));return '<article class="me-cw-goal"><strong>'+x.title+'</strong><p>'+x.desc+'</p><div class="me-cw-bar"><i style="width:'+pct+'%"></i></div><div class="me-cw-foot"><span>'+Math.min(Math.floor(x.value),x.need)+' / '+x.need+'</span><span>'+pct+'%</span></div></article>'}).join("")+'</div><button class="me-cw-claim" data-cw-weekly '+(done&&!s.weeklyGoals.claimed?"":"disabled")+'>'+(s.weeklyGoals.claimed?"RICOMPENSA SETTIMANALE RISCOSSA":done?"RISCUOTI · +30.000 CREDITI · +150 PRESTIGIO":"COMPLETA TUTTI GLI OBIETTIVI")+'</button>';
 box.querySelector("[data-cw-weekly]")?.addEventListener("click",claimWeekly);
}
function draw(){ensure();drawChain();drawWeekly()}
function boot(){draw();setInterval(draw,2500);window.addEventListener("marina-empire-updated",()=>setTimeout(draw,50));document.addEventListener("click",e=>{if(e.target.closest("[data-tab='missions'],[data-mobile-tab='missions']"))setTimeout(draw,80)})}
window.MarinaEmpireChainWeekly={weekly,steps:STEPS};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();