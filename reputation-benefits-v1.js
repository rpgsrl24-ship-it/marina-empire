(()=>{"use strict";if(window.__ME_REP_BENEFITS_V1__)return;window.__ME_REP_BENEFITS_V1__=true;
const css=document.createElement("style");css.id="me-rep-benefits-v1-style";css.textContent=`
.me-rb-box{margin:9px 0;padding:10px;border:1px solid rgba(222,181,98,.55);border-radius:13px;background:linear-gradient(145deg,#103f52,#08293a);box-shadow:0 8px 22px #0004;color:#eef6f7}
.me-rb-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.me-rb-head small{display:block;color:#93b0ba;font-size:7px;font-weight:950;letter-spacing:.12em}.me-rb-head strong{display:block;margin-top:2px;color:#f2d28f;font:800 14px Georgia,serif}.me-rb-pill{padding:5px 7px;border:1px solid #d4aa61;border-radius:999px;color:#f5d897;font-size:7px;font-weight:950}
.me-rb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:8px}.me-rb-card{padding:9px;border:1px solid #3f6b7b;border-radius:11px;background:#0a3042}.me-rb-card.on{border-color:#60ca97;background:#0c3b3b}.me-rb-card b{display:block;color:#f0d08c;font-size:9px}.me-rb-card p{margin:4px 0;color:#b9cdd3;font-size:7.5px;line-height:1.3}.me-rb-card span{display:block;color:#7ddfa5;font-size:7px;font-weight:900}
.me-rb-vip{margin-top:8px;padding:9px;border:1px solid #d4ad63;border-radius:11px;background:linear-gradient(145deg,#143e50,#342d1d)}.me-rb-vip strong{color:#ffe1a1}.me-rb-vip p{margin:4px 0;color:#d9e4e7;font-size:7.5px}.me-rb-vip button{width:100%;min-height:36px;margin-top:6px;border:1px solid #e1bd6c;border-radius:9px;background:linear-gradient(180deg,#e5c374,#b98232);color:#082333;font-size:7.5px;font-weight:950}
@media(max-width:899px){.me-rb-grid{grid-template-columns:1fr}}
`;document.head.appendChild(css);
function s(){try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}}
function save(){try{if(typeof persist==="function")persist()}catch(_){};try{window.dispatchEvent(new Event("marina-empire-updated"))}catch(_){}}
function msg(t){try{if(typeof notice==="function")notice(t);else alert(t)}catch(_){alert(t)}}
function pid(){return String(s()?.port||"rimini")}
function rep(){return Math.max(0,Number(s()?.portReputation?.[pid()])||0)}
function level(){return Math.max(1,Math.min(10,1+Math.floor(rep()/100)))}
function benefits(l=level()){return{
 fuel:l>=3?Math.min(20,(l-2)*3):0,
 mission:l>=4?Math.min(25,(l-3)*4):0,
 service:l>=5,
 vip:l>=7,
 elite:l>=9
}}
function portName(){try{return typeof port==="function"?(port(pid())?.name||pid()):pid()}catch(_){return pid()}}
function ensure(){
 const marinas=document.getElementById("marinas");if(!marinas)return null;let box=document.getElementById("meRepBenefits");if(!box){box=document.createElement("section");box.id="meRepBenefits";box.className="me-rb-box";const p=marinas.querySelector(".panel")||marinas;p.insertBefore(box,p.firstChild)}return box
}
function draw(){
 const box=ensure();if(!box)return;const l=level(),b=benefits(l);
 const cards=[
  ["⛽ Sconto carburante","Riduce il costo dei rifornimenti nella marina.",b.fuel?b.fuel+"% ATTIVO":"Sblocca al livello 3",!!b.fuel],
  ["🎯 Bonus missioni","Aumenta le ricompense delle missioni collegate alla marina.",b.mission?b.mission+"% ATTIVO":"Sblocca al livello 4",!!b.mission],
  ["🛎️ Servizi premium","Accesso prioritario a concierge e assistenza marina.",b.service?"ATTIVO":"Sblocca al livello 5",!!b.service],
  ["✨ Contratti VIP","Sblocca incarichi premium con ricompense maggiori.",b.vip?"ATTIVO":"Sblocca al livello 7",!!b.vip]
 ];
 box.innerHTML='<div class="me-rb-head"><div><small>VANTAGGI REPUTAZIONE · '+portName().toUpperCase()+'</small><strong>Più sei conosciuto, più la marina ti premia</strong></div><span class="me-rb-pill">LV '+l+'/10</span></div><div class="me-rb-grid">'+cards.map(c=>'<article class="me-rb-card '+(c[3]?"on":"")+'"><b>'+c[0]+'</b><p>'+c[1]+'</p><span>'+c[2]+'</span></article>').join("")+'</div>'+(b.vip?'<div class="me-rb-vip"><strong>✨ Contratto VIP disponibile</strong><p>Organizza un servizio premium per un superyacht in '+portName()+'.</p><button type="button" data-rb-vip>AVVIA CONTRATTO VIP · 5 MIN</button></div>':'');
 box.querySelector("[data-rb-vip]")?.addEventListener("click",startVip);
}
function startVip(){
 const st=s(),b=benefits();if(!st||!b.vip)return;if(st.livingContract&&Number(st.livingContract.until)>Date.now())return msg("Hai già un contratto operativo in corso.");
 const cost=900,reward=Math.round(6500*(1+b.mission/100));if((Number(st.coins)||0)<cost)return msg("Crediti insufficienti.");
 st.coins-=cost;st.livingContract={id:"vip_rep",uid:"vip_rep-"+Date.now(),icon:"✨",name:"Servizio VIP Marina",text:"Concierge e assistenza premium superyacht.",cost,reward,prestige:75,start:Date.now(),until:Date.now()+300000,port:pid(),claimed:false};save();msg("Contratto VIP avviato.");
}
function wrapRefuel(){
 if(typeof window.__ME_ORIGINAL_REFUEL__==="function")return;
 try{
  if(typeof refuel!=="function")return;
  window.__ME_ORIGINAL_REFUEL__=refuel;
  window.refuel=function(...args){
   const st=s(),before=Number(st?.coins)||0,b=benefits(),res=window.__ME_ORIGINAL_REFUEL__(...args),after=Number(st?.coins)||0;
   if(st&&b.fuel>0&&after<before){
    const spent=before-after,refund=Math.round(spent*b.fuel/100);
    if(refund>0){st.coins+=refund;save();msg("Sconto reputazione carburante: +"+refund.toLocaleString("it-IT")+" crediti rimborsati");}
   }
   return res;
  }
 }catch(_){}
}
function missionBonus(){
 const st=s();if(!st||!Array.isArray(st.completed)||!st.completed.length)return;
 if(!st.repMissionBonus||typeof st.repMissionBonus!=="object")st.repMissionBonus={};
 const b=benefits();if(!b.mission)return;
 const last=st.completed[st.completed.length-1],key=String(last?.id||last||"")+"|"+st.completed.length+"|"+pid();
 if(st.repMissionBonus[key])return;
 const base=Math.max(0,Number(last?.reward)||0);if(!base)return;
 const bonus=Math.round(base*b.mission/100);if(bonus<=0)return;
 st.coins=(Number(st.coins)||0)+bonus;st.repMissionBonus[key]=bonus;save();msg("Bonus reputazione missione: +"+bonus.toLocaleString("it-IT")+" crediti");
}
function visible(){const m=document.getElementById("marinas");return !document.hidden&&m&&!m.classList.contains("hide")} function boot(){draw();wrapRefuel();setInterval(()=>{wrapRefuel();missionBonus();if(visible())draw()},15000);window.addEventListener("marina-empire-updated",()=>{if(visible())setTimeout(draw,150)})}
window.MarinaEmpireReputationBenefits={benefits,level,rep};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();