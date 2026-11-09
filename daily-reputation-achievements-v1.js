(()=>{"use strict";if(window.__ME_DAILY_REP_ACH_V1__)return;window.__ME_DAILY_REP_ACH_V1__=true;
const css=document.createElement("style");css.id="me-daily-rep-ach-v1-style";css.textContent=`
.me-dra-box{margin:9px 0;padding:10px;border:1px solid rgba(222,181,98,.55);border-radius:13px;background:linear-gradient(145deg,#103e52,#08283a);box-shadow:0 8px 22px #0004;color:#eef6f7}
.me-dra-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.me-dra-head small{display:block;color:#93b0ba;font-size:7px;font-weight:950;letter-spacing:.12em}.me-dra-head strong{display:block;margin-top:2px;color:#f2d28f;font:800 14px Georgia,serif}.me-dra-pill{padding:5px 7px;border:1px solid #d4aa61;border-radius:999px;color:#f5d897;font-size:7px;font-weight:950}
.me-dra-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}.me-dra-card{padding:9px;border:1px solid #3f6b7b;border-radius:11px;background:#0a3042}.me-dra-card.done{border-color:#61ca97;background:#0c3b3b}.me-dra-card b{display:block;color:#f0d08c;font-size:9px}.me-dra-card p{margin:4px 0;color:#b9cdd3;font-size:7.5px;line-height:1.3}.me-dra-bar{height:6px;border-radius:99px;overflow:hidden;background:#173946}.me-dra-bar i{display:block;height:100%;background:linear-gradient(90deg,#69daa4,#e5c06b)}.me-dra-foot{display:flex;justify-content:space-between;gap:5px;margin-top:4px;color:#9eb6bf;font-size:7px}.me-dra-claim{width:100%;min-height:35px;margin-top:7px;border:1px solid #dfb96a;border-radius:9px;background:#153f51;color:#f5d99c;font-size:8px;font-weight:950}
.me-dra-rep{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;margin-top:8px;padding:9px;border:1px solid #49788a;border-radius:11px;background:#092f42}.me-dra-icon{font-size:24px}.me-dra-rep strong{display:block;color:#f3d18b;font-size:10px}.me-dra-rep p{margin:3px 0;color:#b8ccd2;font-size:7.5px}.me-dra-level{color:#7de2a7;font-size:8px;font-weight:950;text-align:right}.me-dra-ach{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}.me-dra-ach .me-dra-card{min-height:86px}
@media(max-width:899px){.me-dra-grid,.me-dra-ach{grid-template-columns:1fr}.me-dra-box{margin:8px 0}}
`;document.head.appendChild(css);

function s(){try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}}
function save(){try{if(typeof persist==="function")persist()}catch(_){};try{window.dispatchEvent(new Event("marina-empire-updated"))}catch(_){}}
function msg(t){try{if(typeof notice==="function")notice(t);else alert(t)}catch(_){alert(t)}}
function dayKey(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function portId(){return String(s()?.port||"rimini")}
function portName(){try{return typeof port==="function"?(port(portId())?.name||portId()):portId()}catch(_){return portId()}}
function ensure(){
 const st=s();if(!st)return null;
 if(!st.dailyOps||typeof st.dailyOps!=="object"||st.dailyOps.key!==dayKey())st.dailyOps={key:dayKey(),claimed:false,startVoyages:Number(st.voyages)||0,startPrestige:Number(st.prestige)||0,startContracts:Number(st.livingContractsDone)||0,startCoins:Number(st.coins)||0};
 if(!st.portReputation||typeof st.portReputation!=="object")st.portReputation={};
 if(!st.achievements||typeof st.achievements!=="object")st.achievements={};
 return st;
}
function currentRep(){const st=ensure();return Math.max(0,Number(st?.portReputation?.[portId()])||0)}
function repLevel(rep=currentRep()){return Math.max(1,Math.min(10,1+Math.floor(rep/100)))}
function repTitle(l){return ["Ospite","Conosciuto","Affidabile","Partner","Operatore","Referente","Manager","Direttore","Elite","Leggenda"][Math.max(0,Math.min(9,l-1))]}
function addRep(n){const st=ensure();if(!st)return;const id=portId();st.portReputation[id]=Math.max(0,(Number(st.portReputation[id])||0)+n);save()}
function daily(){
 const st=ensure();if(!st)return[];
 return[
  {id:"voy",title:"Rotta del giorno",desc:"Completa 1 viaggio oggi.",value:Math.max(0,(Number(st.voyages)||0)-st.dailyOps.startVoyages),need:1,reward:1500,rep:10},
  {id:"contract",title:"Operatore di marina",desc:"Completa 2 contratti dinamici.",value:Math.max(0,(Number(st.livingContractsDone)||0)-st.dailyOps.startContracts),need:2,reward:2200,rep:15},
  {id:"prestige",title:"Prestigio quotidiano",desc:"Guadagna 80 prestigio.",value:Math.max(0,(Number(st.prestige)||0)-st.dailyOps.startPrestige),need:80,reward:1800,rep:12}
 ];
}
function claimDaily(){
 const st=ensure(),g=daily();if(!st||st.dailyOps.claimed)return;if(g.some(x=>x.value<x.need))return msg("Completa tutti gli obiettivi giornalieri.");
 const reward=g.reduce((n,x)=>n+x.reward,0),rep=g.reduce((n,x)=>n+x.rep,0);
 st.coins=(Number(st.coins)||0)+reward;st.prestige=(Number(st.prestige)||0)+35;st.dailyOps.claimed=true;addRep(rep);save();draw();msg("Giornata completata: +"+reward.toLocaleString("it-IT")+" crediti · +35 prestigio · +"+rep+" reputazione marina");
}
const ACH=[
 {id:"first_voyage",name:"Primo Comando",desc:"Completa il primo viaggio.",icon:"🧭",check:st=>(Number(st.voyages)||0)>=1,reward:1000},
 {id:"five_voyages",name:"Skipper Esperto",desc:"Completa 5 viaggi.",icon:"⚓",check:st=>(Number(st.voyages)||0)>=5,reward:5000},
 {id:"ten_contracts",name:"Operatore Nautico",desc:"Completa 10 contratti dinamici.",icon:"📻",check:st=>(Number(st.livingContractsDone)||0)>=10,reward:7500},
 {id:"fleet_three",name:"Piccola Flotta",desc:"Possiedi almeno 3 imbarcazioni.",icon:"🛥️",check:st=>Array.isArray(st.owned)&&new Set(st.owned).size>=3,reward:10000},
 {id:"prestige_1000",name:"Nome Conosciuto",desc:"Raggiungi 1.000 prestigio.",icon:"👑",check:st=>(Number(st.prestige)||0)>=1000,reward:15000},
 {id:"rep_500",name:"Partner della Marina",desc:"Raggiungi 500 reputazione in una marina.",icon:"🏆",check:st=>Object.values(st.portReputation||{}).some(v=>(Number(v)||0)>=500),reward:20000}
];
function updateAchievements(){
 const st=ensure();if(!st)return;let changed=false;
 ACH.forEach(a=>{if(!st.achievements[a.id]&&a.check(st)){st.achievements[a.id]={unlocked:true,claimed:false,at:Date.now()};changed=true}});
 if(changed)save();
}
function claimAch(id){
 const st=ensure(),a=ACH.find(x=>x.id===id),rec=st?.achievements?.[id];if(!st||!a||!rec||rec.claimed)return;
 st.coins=(Number(st.coins)||0)+a.reward;rec.claimed=true;save();draw();msg("Achievement "+a.name+": +"+a.reward.toLocaleString("it-IT")+" crediti");
}
function ensureBoxes(){
 const home=document.getElementById("mePremiumHome")||document.querySelector("#home .me-mobile-home-dashboard");
 if(home&&!document.getElementById("meDailyOps")){const x=document.createElement("section");x.id="meDailyOps";x.className="me-dra-box";const a=home.querySelector("#meWeeklyGoals")||home.querySelector("#meLivingCareer")||home.querySelector(".meph-live")||home.firstElementChild;if(a)a.insertAdjacentElement("afterend",x);else home.prepend(x)}
 const marinas=document.getElementById("marinas");
 if(marinas&&!document.getElementById("mePortRep")){const x=document.createElement("section");x.id="mePortRep";x.className="me-dra-box";const p=marinas.querySelector(".panel")||marinas;p.insertBefore(x,p.firstChild)}
 const profile=document.getElementById("profile");
 if(profile&&!document.getElementById("meAchievements")){const x=document.createElement("section");x.id="meAchievements";x.className="me-dra-box";const p=profile.querySelector(".panel")||profile;p.insertBefore(x,p.firstChild)}
}
function drawDaily(){
 const box=document.getElementById("meDailyOps");if(!box)return;const st=ensure(),g=daily(),done=g.every(x=>x.value>=x.need);
 box.innerHTML='<div class="me-dra-head"><div><small>OBIETTIVI GIORNALIERI · '+dayKey()+'</small><strong>Tre incarichi per mantenere attivo il comandante</strong></div><span class="me-dra-pill">'+g.filter(x=>x.value>=x.need).length+'/3</span></div><div class="me-dra-grid">'+g.map(x=>{const pct=Math.max(0,Math.min(100,Math.round(x.value/x.need*100)));return '<article class="me-dra-card '+(x.value>=x.need?"done":"")+'"><b>'+x.title+'</b><p>'+x.desc+'</p><div class="me-dra-bar"><i style="width:'+pct+'%"></i></div><div class="me-dra-foot"><span>'+Math.min(Math.floor(x.value),x.need)+' / '+x.need+'</span><span>+'+x.reward.toLocaleString("it-IT")+' cr · +'+x.rep+' rep</span></div></article>'}).join("")+'</div><button class="me-dra-claim" data-dra-daily '+(done&&!st.dailyOps.claimed?"":"disabled")+'>'+(st.dailyOps.claimed?"RICOMPENSA GIORNALIERA RISCOSSA":done?"RISCUOTI RICOMPENSA GIORNALIERA":"COMPLETA I 3 OBIETTIVI")+'</button>';
 box.querySelector("[data-dra-daily]")?.addEventListener("click",claimDaily);
}
function drawRep(){
 const box=document.getElementById("mePortRep");if(!box)return;const rep=currentRep(),lv=repLevel(rep),pct=lv>=10?100:Math.max(0,Math.min(100,rep%100));
 box.innerHTML='<div class="me-dra-head"><div><small>REPUTAZIONE MARINA</small><strong>'+portName()+'</strong></div><span class="me-dra-pill">LV '+lv+'/10</span></div><div class="me-dra-rep"><div class="me-dra-icon">⚓</div><div><strong>'+repTitle(lv)+'</strong><p>'+rep+' reputazione · completa attività qui per aumentarla.</p><div class="me-dra-bar"><i style="width:'+pct+'%"></i></div></div><div class="me-dra-level">'+(lv>=10?"MAX":(100-(rep%100))+" al prossimo")+'</div></div>';
}
function drawAch(){
 const box=document.getElementById("meAchievements");if(!box)return;const st=ensure();updateAchievements();
 box.innerHTML='<div class="me-dra-head"><div><small>ACHIEVEMENT PERMANENTI</small><strong>La storia del tuo impero</strong></div><span class="me-dra-pill">'+ACH.filter(a=>st.achievements?.[a.id]).length+'/'+ACH.length+'</span></div><div class="me-dra-ach">'+ACH.map(a=>{const rec=st.achievements?.[a.id],done=!!rec;return '<article class="me-dra-card '+(done?"done":"")+'"><b>'+a.icon+' '+a.name+'</b><p>'+a.desc+'</p><span style="color:#7ee0a6;font-size:7px;font-weight:900">'+(done?"SBLOCCATO":"DA SBLOCCARE")+' · premio '+a.reward.toLocaleString("it-IT")+' cr</span>'+(done&&!rec.claimed?'<button class="me-dra-claim" data-dra-ach="'+a.id+'">RISCUOTI</button>':done?'<div style="margin-top:7px;color:#86aab6;font-size:7px">RICOMPENSA RISCOSSA</div>':'')+'</article>'}).join("")+'</div>';
 box.querySelectorAll("[data-dra-ach]").forEach(b=>b.addEventListener("click",()=>claimAch(b.dataset.draAch)));
}
function draw(){ensureBoxes();drawDaily();drawRep();drawAch()}
function visible(){const ids=["marinas","profile"];return !document.hidden&&ids.some(id=>{const el=document.getElementById(id);return el&&!el.classList.contains("hide")})} function boot(){draw();setInterval(()=>{if(visible())draw()},15000);window.addEventListener("marina-empire-updated",()=>{if(visible())setTimeout(draw,150)});document.addEventListener("click",e=>{if(e.target.closest("[data-tab='marinas'],[data-tab='profile'],[data-mobile-more-tab='marinas'],[data-mobile-more-tab='profile']"))setTimeout(draw,120)})}
window.MarinaEmpireDailyReputation={daily,currentRep,repLevel,achievements:ACH};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();