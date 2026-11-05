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
.me-crew-bonus{margin-top:8px;padding:7px 8px;border-radius:8px;background:rgba(214,181,117,.08);color:#edd29b;font-size:9px}
@media(max-width:740px){.me-crew-card{margin:9px 0;padding:10px}.me-crew-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.me-crew-actions button{min-height:44px}}
`;
document.head.appendChild(style);

function num(v){return Math.max(0,Math.floor(Number(v)||0))}
function gameState(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function crewInfo(id){
 try{return typeof crewForBoat==="function"?crewForBoat(id):{roles:"Comandante",daily:0,count:1}}catch(_){return {roles:"Comandante",daily:0,count:1}}
}
function ensureState(){
 const s=gameState();if(!s)return null;
 if(!s.crewProgress||typeof s.crewProgress!=="object")s.crewProgress={};
 const id=String(s.boat||"voyager");
 if(!s.crewProgress[id]||typeof s.crewProgress[id]!=="object")s.crewProgress[id]={xp:0,morale:85,training:0};
 const c=s.crewProgress[id];
 c.xp=num(c.xp);c.morale=Math.max(35,Math.min(100,num(c.morale)||85));c.training=Math.max(0,Math.min(5,num(c.training)));
 return c;
}
function snapshot(id){
 const s=gameState();if(!s)return {unlocked:false,xp:0,morale:0,training:0,bonus:1,level:1};
 id=String(id||s.boat||"voyager");
 const raw=(s.crewProgress&&s.crewProgress[id])||{xp:0,morale:85,training:0};
 const xp=num(raw.xp),morale=Math.max(35,Math.min(100,num(raw.morale)||85)),training=Math.max(0,Math.min(5,num(raw.training)));
 const level=xp>=30?5:xp>=18?4:xp>=10?3:xp>=4?2:1;
 const xpBonus=Math.min(.06,xp*.002);
 const trainingBonus=training*.012;
 const moraleBonus=morale>=90?.03:morale>=75?.015:morale<55?-.03:0;
 return {unlocked:num(s.voyages)>=4||((s.owned||[]).length>=2),xp,morale,training,level,bonus:Math.max(.95,1+xpBonus+trainingBonus+moraleBonus),info:crewInfo(id)};
}
function missionMultiplier(id){return snapshot(id).bonus}
function onMissionComplete(id){
 const s=gameState();if(!s)return;
 id=String(id||s.boat||"voyager");
 if(!s.crewProgress||typeof s.crewProgress!=="object")s.crewProgress={};
 const c=s.crewProgress[id]&&typeof s.crewProgress[id]==="object"?s.crewProgress[id]:{xp:0,morale:85,training:0};
 c.xp=num(c.xp)+1;
 c.morale=Math.max(35,Math.min(100,(num(c.morale)||85)-4));
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
 '<div class="me-crew-bonus">Bonus efficienza missioni: <b>'+(pct>=0?"+":"")+pct+'%</b>. Esperienza e addestramento aumentano il rendimento; morale basso lo riduce.</div>'+
 '<div class="me-crew-actions"><button type="button" data-crew-rest>⚓ RIPOSO · 250 CR</button><button type="button" data-crew-train>🎓 ADDESTRA · 800 CR</button></div>';
 box.querySelector("[data-crew-rest]")?.addEventListener("click",rest);
 box.querySelector("[data-crew-train]")?.addEventListener("click",train);
}
window.MarinaEmpireCrew={snapshot,missionMultiplier,onMissionComplete,render:draw};
function boot(){
 if(!ensure()){setTimeout(boot,700);return}
 draw();
 window.addEventListener("marina-empire-updated",()=>setTimeout(draw,60));
 setInterval(draw,30000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();