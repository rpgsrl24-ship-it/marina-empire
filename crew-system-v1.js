(()=>{
"use strict";
if(window.__ME_CREW_SYSTEM_V1__)return;
window.__ME_CREW_SYSTEM_V1__=true;

const style=document.createElement("style");
style.id="me-crew-system-v1-style";
style.textContent=`
.me-crew-card{margin:12px 0;padding:12px;border:1px solid rgba(214,181,117,.38);border-radius:13px;background:linear-gradient(145deg,#0a2f3f,#082431)}
.me-crew-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.me-crew-head strong{color:#f2d293}.me-crew-head small{color:#8fa9b3;font-size:9px}
.me-crew-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:9px}
.me-crew-stat{padding:8px;border:1px solid rgba(255,255,255,.09);border-radius:9px;background:#0a2633}
.me-crew-stat b{display:block;color:#f1d196;font-size:13px}.me-crew-stat span{display:block;margin-top:2px;color:#9db4bd;font-size:8px}
.me-crew-role{margin-top:8px;color:#c8d8dd;font-size:9px}
.me-crew-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
.me-crew-actions button{flex:1 1 120px;min-height:40px;padding:7px 9px;font-size:9px}
.me-crew-bonus{margin-top:8px;padding:7px 8px;border-radius:8px;background:rgba(214,181,117,.08);color:#edd29b;font-size:9px}.me-crew-roster{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}.me-crew-member{padding:7px;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:#0a2633;font-size:8px;color:#b9cdd4}.me-crew-member b{display:block;color:#f2d293;font-size:9px}.me-crew-focus{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.me-crew-focus button{flex:1 1 90px;min-height:36px;padding:6px;font-size:8px}.me-crew-focus button.on{border-color:#d6b575;color:#f2d293;background:#173d4c}
@media(max-width:899px){.me-crew-card{margin:9px 0;padding:10px}.me-crew-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.me-crew-actions button{min-height:44px}}
`;
document.head.appendChild(style);

function num(v){return Math.max(0,Math.floor(Number(v)||0))}
function gameState(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function crewInfo(id){
 try{return typeof crewForBoat==="function"?crewForBoat(id):{roles:"Comandante",daily:0,count:1}}catch(_){return {roles:"Comandante",daily:0,count:1}}
}
const ROLE_SETS={
 voyager:[["Comandante","Rotta e sicurezza"]],
 open:[["Comandante","Rotta e sicurezza"],["Marinaio","Ormeggio e coperta"]],
 yacht:[["Comandante","Rotta e sicurezza"],["Marinaio","Coperta e tender"],["Hostess","Ospiti e servizio"]],
 yacht14:[["Comandante","Rotta e sicurezza"],["Marinaio","Coperta e tender"],["Hostess","Ospiti e servizio"]],
 yacht20:[["Comandante","Rotta e sicurezza"],["Marinaio","Coperta e tender"],["Chef","Cambusa e qualità ospiti"],["Hostess","Ospiti e servizio"]],
 yacht30:[["Comandante","Rotta e sicurezza"],["Primo Ufficiale","Operazioni e sicurezza"],["Engineer","Tecnica e manutenzione"],["Chef","Cambusa e qualità ospiti"],["Hostess","Ospiti e servizio"],["Deckhand","Coperta e tender"]],
 luna:[["Comandante","Rotta e sicurezza"],["Primo Ufficiale","Operazioni e sicurezza"],["Engineer","Tecnica e manutenzione"],["Chef","Cambusa e qualità ospiti"],["Chief Steward/ess","Ospiti VIP"],["Deckhand","Coperta e tender"],["Deckhand","Supporto operativo"]]
};
const CANDIDATES=[
 {id:"marco-riva",name:"Marco Riva",role:"Comandante",skill:72,salary:210},
 {id:"elena-conti",name:"Elena Conti",role:"Primo Ufficiale",skill:68,salary:185},
 {id:"luca-ferri",name:"Luca Ferri",role:"Engineer",skill:74,salary:195},
 {id:"sofia-moretti",name:"Sofia Moretti",role:"Hostess",skill:70,salary:165},
 {id:"ana-silva",name:"Ana Silva",role:"Chief Steward/ess",skill:78,salary:215},
 {id:"matteo-gallo",name:"Matteo Gallo",role:"Deckhand",skill:66,salary:145},
 {id:"giulia-romano",name:"Giulia Romano",role:"Chef",skill:73,salary:190},
 {id:"davide-serra",name:"Davide Serra",role:"Marinaio",skill:64,salary:135}
];
const FOCUS={
 balanced:{label:"Bilanciato",icon:"⚓",bonus:.00,text:"Nessuna penalità; rendimento generale stabile."},
 navigation:{label:"Navigazione",icon:"🧭",bonus:.025,text:"Più rendimento sulle missioni di trasferimento e charter."},
 technical:{label:"Tecnica",icon:"🔧",bonus:.02,text:"Morale cala più lentamente e manutenzione più efficiente."},
 hospitality:{label:"Ospiti",icon:"✨",bonus:.03,text:"Ricompense charter e VIP migliori, ma equipaggio più esigente."}
};
function roster(id){return ROLE_SETS[String(id||"voyager")]||ROLE_SETS.voyager}
function defaultRoster(id){
 const roles=roster(id),base=Math.max(0,num(crewInfo(id).daily)),share=roles.length?Math.round(base/roles.length):0;
 return roles.map((r,i)=>({id:"default-"+String(id)+"-"+i,name:r[0],role:r[0],duty:r[1],skill:50,salary:share,default:true}));
}
function ensureRoster(id){
 const s=gameState();if(!s)return defaultRoster(id);
 id=String(id||s.boat||"voyager");
 if(!s.crewRoster||typeof s.crewRoster!=="object")s.crewRoster={};
 if(!Array.isArray(s.crewRoster[id])||!s.crewRoster[id].length)s.crewRoster[id]=defaultRoster(id);
 return s.crewRoster[id];
}
function candidates(id){
 const roles=new Set(roster(id).map(r=>r[0]));
 const day=Math.floor(Date.now()/86400000);
 return CANDIDATES.filter(x=>roles.has(x.role)).sort((a,b)=>((a.id.length+day)%7)-((b.id.length+day)%7)).slice(0,3);
}
function payroll(id){return ensureRoster(id).reduce((n,m)=>n+Math.max(0,num(m.salary)),0)}
function recruit(candidateId){
 const s=gameState();if(!s||s.trip)return;
 const id=String(s.boat||"voyager"),cand=CANDIDATES.find(x=>x.id===candidateId);if(!cand)return;
 const list=ensureRoster(id),slot=list.findIndex(m=>m.role===cand.role);
 if(slot<0)return;
 const fee=900+cand.skill*12;
 if((Number(s.coins)||0)<fee){if(typeof notice==="function")notice("Crediti insufficienti per il reclutamento.");return}
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{
  s.coins-=fee;
  const duty=roster(id).find(r=>r[0]===cand.role)?.[1]||"Operazioni di bordo";
  list[slot]={...cand,duty,default:false,recruitedAt:Date.now()};
  s.crewRoster[id]=list;
 }):false;
 if(!ok)return;
 if(typeof render==="function")render();
 if(typeof notice==="function")notice(cand.name+" ingaggiato come "+cand.role+" · costo "+fee.toLocaleString("it-IT")+" cr");
 draw();
}
function ensureState(){
 const s=gameState();if(!s)return null;
 if(!s.crewProgress||typeof s.crewProgress!=="object")s.crewProgress={};
 const id=String(s.boat||"voyager");
 if(!s.crewProgress[id]||typeof s.crewProgress[id]!=="object")s.crewProgress[id]={xp:0,morale:85,training:0,focus:"balanced"};
 const c=s.crewProgress[id];
 c.xp=num(c.xp);c.morale=Math.max(35,Math.min(100,num(c.morale)||85));c.training=Math.max(0,Math.min(5,num(c.training)));c.focus=FOCUS[c.focus]?c.focus:"balanced";
 return c;
}
function snapshot(id){
 const s=gameState();if(!s)return {unlocked:false,xp:0,morale:0,training:0,bonus:1,level:1};
 id=String(id||s.boat||"voyager");
 const raw=(s.crewProgress&&s.crewProgress[id])||{xp:0,morale:85,training:0,focus:"balanced"};
 const xp=num(raw.xp),morale=Math.max(35,Math.min(100,num(raw.morale)||85)),training=Math.max(0,Math.min(5,num(raw.training))),focus=FOCUS[raw.focus]?raw.focus:"balanced";
 const level=xp>=30?5:xp>=18?4:xp>=10?3:xp>=4?2:1;
 const members=ensureRoster(id),avgSkill=members.length?members.reduce((n,m)=>n+Math.max(0,num(m.skill)),0)/members.length:50;
 const skillBonus=Math.max(0,Math.min(.05,(avgSkill-50)*.0018));
 const xpBonus=Math.min(.06,xp*.002);
 const trainingBonus=training*.012;
 const moraleBonus=morale>=90?.03:morale>=75?.015:morale<55?-.03:0;
 const focusBonus=FOCUS[focus]?.bonus||0;
 return {unlocked:num(s.voyages)>=4||((s.owned||[]).length>=2),xp,morale,training,focus,level,avgSkill:Math.round(avgSkill),payroll:payroll(id),bonus:Math.max(.95,1+xpBonus+trainingBonus+moraleBonus+focusBonus+skillBonus),info:crewInfo(id),roster:members,candidates:candidates(id)};
}
function missionMultiplier(id){return snapshot(id).bonus}
function onMissionComplete(id){
 const s=gameState();if(!s)return;
 id=String(id||s.boat||"voyager");
 if(!s.crewProgress||typeof s.crewProgress!=="object")s.crewProgress={};
 const c=s.crewProgress[id]&&typeof s.crewProgress[id]==="object"?s.crewProgress[id]:{xp:0,morale:85,training:0,focus:"balanced"};
 c.xp=num(c.xp)+1;
 const focus=FOCUS[c.focus]?c.focus:"balanced";
 const drain=focus==="technical"?3:focus==="hospitality"?5:4;
 c.morale=Math.max(35,Math.min(100,(num(c.morale)||85)-drain));
 c.training=Math.max(0,Math.min(5,num(c.training)));
 s.crewProgress[id]=c;
}
function spend(cost,fn,msg){
 const s=gameState();if(!s||s.trip)return;
 if((Number(s.coins)||0)<cost){if(typeof notice==="function")notice("Crediti insufficienti.");return}
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{s.coins-=cost;fn()}):false;
 if(!ok)return;
 if(typeof render==="function")render();
 if(typeof notice==="function")notice(msg);
 window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"crew"}}));
 draw();
}
function rest(){
 const c=ensureState();if(!c)return;
 spend(250,()=>{c.morale=Math.min(100,c.morale+18)},"Equipaggio riposato · morale aumentato");
}
function train(){
 const c=ensureState();if(!c)return;
 if(c.training>=5){if(typeof notice==="function")notice("Addestramento equipaggio già al massimo.");return}
 spend(800,()=>{c.training=Math.min(5,c.training+1);c.morale=Math.min(100,c.morale+5)},"Addestramento completato · efficienza missioni migliorata");
}
function setFocus(key){
 const c=ensureState();if(!c||!FOCUS[key])return;
 if(c.focus===key)return;
 const s=gameState();if(!s||s.trip){if(typeof notice==="function")notice("Cambia assetto equipaggio soltanto in marina.");return}
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{c.focus=key}):false;
 if(!ok)return;
 if(typeof notice==="function")notice("Assetto equipaggio: "+FOCUS[key].label);
 window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"crew-focus"}}));
 draw();
}
let box=null;
function host(){
 return document.getElementById("officeFleet")||document.getElementById("officeActions")||document.querySelector("#office .panel");
}
function ensure(){
 const h=host();if(!h)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("section");box.id="meCrewSystem";box.className="me-crew-card";
 h.insertAdjacentElement("afterend",box);
 return true;
}
function draw(){
 const s=gameState();if(!s?.name||!ensure())return;
 const snap=snapshot();
 if(!snap.unlocked){box.style.display="none";return}
 box.style.display="";
 const pct=Math.round((snap.bonus-1)*100);
 box.innerHTML='<div class="me-crew-head"><div><small>EQUIPAGGIO · '+String(snap.info.count||1)+' PERSONE</small><strong>👥 Equipaggio '+(typeof boat==="function"?(boat(s.boat)?.name||"Yacht"):"Yacht")+'</strong></div><small>LV '+snap.level+'</small></div>'+
 '<div class="me-crew-role">'+snap.info.roles+' · costo operativo '+num(snap.info.daily).toLocaleString("it-IT")+' cr/missione</div>'+
 '<div class="me-crew-grid"><div class="me-crew-stat"><b>'+snap.xp+'</b><span>ESPERIENZA</span></div><div class="me-crew-stat"><b>'+snap.morale+'%</b><span>MORALE</span></div><div class="me-crew-stat"><b>'+snap.training+'/5</b><span>ADDESTRAMENTO</span></div></div>'+
 '<div class="me-crew-roster">'+snap.roster.map((r,i)=>'<div class="me-crew-member"><b>'+(i+1)+'. '+r.name+'</b>'+r.role+' · '+r.duty+'<br>Competenza '+r.skill+' · stipendio '+num(r.salary).toLocaleString("it-IT")+' cr/missione</div>').join('')+'</div>'+
 '<div class="me-crew-bonus">Assetto: <b>'+FOCUS[snap.focus].icon+' '+FOCUS[snap.focus].label+'</b> · '+FOCUS[snap.focus].text+'<br>Competenza media: <b>'+snap.avgSkill+'</b> · stipendi <b>'+snap.payroll.toLocaleString("it-IT")+' cr/missione</b> · bonus efficienza: <b>'+(pct>=0?"+":"")+pct+'%</b>.</div>'+
 '<div class="me-crew-focus">'+Object.entries(FOCUS).map(([k,v])=>'<button type="button" data-crew-focus="'+k+'" class="'+(snap.focus===k?'on':'')+'">'+v.icon+' '+v.label+'</button>').join('')+'</div>'+ '<div class="me-crew-role"><b>RECLUTAMENTO</b> · candidati disponibili oggi</div><div class="me-crew-roster">'+snap.candidates.map(x=>{const fee=900+x.skill*12;return '<div class="me-crew-member"><b>'+x.name+'</b>'+x.role+' · competenza '+x.skill+' · stipendio '+x.salary+' cr<br><button type="button" data-crew-recruit="'+x.id+'">INGAGGIA · '+fee.toLocaleString("it-IT")+' CR</button></div>'}).join('')+'</div>'+
 '<div class="me-crew-actions"><button type="button" data-crew-rest>⚓ RIPOSO · 250 CR</button><button type="button" data-crew-train>🎓 ADDESTRA · 800 CR</button></div>';
 box.querySelector("[data-crew-rest]")?.addEventListener("click",rest);
 box.querySelector("[data-crew-train]")?.addEventListener("click",train);
 box.querySelectorAll("[data-crew-focus]").forEach(b=>b.addEventListener("click",()=>setFocus(b.dataset.crewFocus)));
 box.querySelectorAll("[data-crew-recruit]").forEach(b=>b.addEventListener("click",()=>recruit(b.dataset.crewRecruit)));
}
window.MarinaEmpireCrew={snapshot,missionMultiplier,onMissionComplete,payrollForBoat:payroll,recruit,render:draw};
function boot(){
 if(!ensure()){setTimeout(boot,700);return}
 draw();
 window.addEventListener("marina-empire-updated",()=>setTimeout(draw,60));
 setInterval(draw,30000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();