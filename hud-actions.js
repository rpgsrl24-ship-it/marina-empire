(()=>{
"use strict";
if(window.__ME_HUD_ACTIONS__)return;
window.__ME_HUD_ACTIONS__=true;

const FUEL_PRICE=4;
const JOBS=[
 {id:"service",icon:"🔧",name:"Tagliando motore",cost:1200,condition:20,desc:"Controllo motore, filtri e fluidi."},
 {id:"antifouling",icon:"🎨",name:"Antivegetativa",cost:850,condition:10,desc:"Trattamento carena e protezione stagionale."},
 {id:"transmission",icon:"⚙️",name:"Revisione trasmissione",cost:1000,condition:15,desc:"Controllo trasmissione e organi meccanici."},
 {id:"battery",icon:"🔋",name:"Batterie e impianto",cost:650,condition:8,desc:"Controllo batterie e impianto elettrico."},
 {id:"safety",icon:"🛟",name:"Dotazioni di sicurezza",cost:500,condition:6,desc:"Revisione dotazioni e dispositivi di bordo."},
 {id:"detailing",icon:"✨",name:"Pulizia e detailing",cost:400,condition:5,prestige:5,desc:"Ripristino estetico e piccolo bonus prestigio."},
 {id:"full",icon:"🛠️",name:"Manutenzione completa",cost:3200,full:true,desc:"Ripristina lo stato dello yacht al 100%."}
];

const st=document.createElement("style");
st.id="me-hud-actions-style";
st.textContent=`
@media(min-width:900px){
 .me-compact-hud{grid-template-columns:1fr 1fr 1fr auto 1fr auto auto!important;gap:7px!important}
 .me-hud-action{min-width:94px!important;height:auto!important;min-height:48px!important;padding:7px 10px!important;border:1px solid rgba(201,164,98,.55)!important;border-radius:11px!important;background:#0b3041!important;color:#f3d69d!important;font-size:9px!important;font-weight:900!important;white-space:nowrap!important}
 .me-hud-action:hover{filter:brightness(1.12)}
 #meHudExit{min-width:72px!important}
 #meMaintenancePanel,#meFuelPanel{display:none;position:fixed;z-index:12000;top:78px;right:150px;width:min(520px,40vw);max-height:calc(100vh - 110px);overflow:auto;padding:14px;border:1px solid rgba(218,179,105,.8);border-radius:16px;background:rgba(4,24,36,.985);box-shadow:0 20px 55px rgba(0,0,0,.58)}
 #meMaintenancePanel.open,#meFuelPanel.open{display:block}
 .me-service-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
 .me-service-head h3{margin:0;color:#f1d292}
 .me-service-close{width:34px!important;height:34px!important;min-height:34px!important;padding:0!important;border-radius:50%!important}
 .me-service-grid{display:grid;gap:8px}
 .me-service-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px;border:1px solid rgba(255,255,255,.09);border-radius:11px;background:#0a2d3b}
 .me-service-row strong{display:block;color:#fff;font-size:11px}
 .me-service-row small{display:block;margin-top:3px;color:#afc4cc;font-size:9px;line-height:1.3}
 .me-service-row button{min-height:38px!important;padding:7px 10px!important;font-size:9px!important}
 .me-service-summary{padding:11px;border:1px solid rgba(201,164,98,.28);border-radius:11px;background:#092530;margin-bottom:10px;color:#dce8ec;font-size:11px}
}
@media(max-width:899px){
 #meHudRefuel,#meHudMaintenance,#meHudExit{display:none!important}
}
`;
document.head.appendChild(st);

function fmt(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function currentBoat(){
 try{return typeof boat==="function"?boat(state.boat):null}catch(_){return null}
}
function saveChange(mutator){
 if(typeof state==="undefined"||!state)return false;
 if(typeof meAtomicPersist==="function"){
   const ok=meAtomicPersist(mutator);
   if(ok){window.dispatchEvent(new Event("marina-empire-updated"));if(typeof render==="function")render();}
   return ok;
 }
 const before=JSON.parse(JSON.stringify(state));
 try{
   mutator();
   if(typeof persist==="function"&&persist()){window.dispatchEvent(new Event("marina-empire-updated"));if(typeof render==="function")render();return true;}
 }catch(_){}
 Object.assign(state,before); return false;
}
function noticeText(msg){
 try{if(typeof notice==="function"){notice(msg,5000);return}}catch(_){}
 const toast=document.getElementById("toast");if(toast){toast.textContent=msg;toast.classList.remove("hide");setTimeout(()=>toast.classList.add("hide"),4000);}
}
function ensurePanels(){
 if(!document.getElementById("meFuelPanel")){
   const p=document.createElement("section");p.id="meFuelPanel";
   p.innerHTML='<div class="me-service-head"><h3>⛽ RIFORNIMENTO</h3><button type="button" class="me-service-close" data-close-service>×</button></div><div id="meFuelBody"></div>';
   document.body.appendChild(p);
 }
 if(!document.getElementById("meMaintenancePanel")){
   const p=document.createElement("section");p.id="meMaintenancePanel";
   p.innerHTML='<div class="me-service-head"><h3>🔧 MANUTENZIONE YACHT</h3><button type="button" class="me-service-close" data-close-service>×</button></div><div id="meMaintenanceBody"></div>';
   document.body.appendChild(p);
 }
 document.querySelectorAll("[data-close-service]").forEach(b=>b.onclick=()=>closePanels());
}
function closePanels(){
 document.getElementById("meFuelPanel")?.classList.remove("open");
 document.getElementById("meMaintenancePanel")?.classList.remove("open");
}
function renderFuel(){
 ensurePanels();
 const b=currentBoat(),tank=Math.max(1,Number(b?.tank)||400),fuel=Math.max(0,Number(state?.fuel)||0),missing=Math.max(0,Math.ceil(tank-fuel)),cost=missing*FUEL_PRICE;
 const body=document.getElementById("meFuelBody");
 body.innerHTML='<div class="me-service-summary">Yacht: <strong>'+(b?.name||"Yacht")+'</strong><br>Serbatoio: '+fmt(fuel)+' / '+fmt(tank)+' L<br>Prezzo marina: '+FUEL_PRICE+' cr/L<br><strong>Da rifornire: '+fmt(missing)+' L · Costo '+fmt(cost)+' cr</strong></div><button type="button" id="meDoRefuel" '+(!missing||Number(state?.coins||0)<cost?'disabled':'')+'>⛽ FAI IL PIENO · '+fmt(cost)+' cr</button>';
 document.getElementById("meDoRefuel")?.addEventListener("click",()=>{
   if(!missing)return;
   if(Number(state.coins||0)<cost){noticeText("Crediti insufficienti per il pieno.");return}
   if(saveChange(()=>{state.coins=Math.max(0,Math.floor(Number(state.coins)||0)-cost);state.fuel=tank;})){
     noticeText("Pieno completato: "+fmt(tank)+" L.");renderFuel();
   }
 });
}
function openFuel(){closePanels();renderFuel();document.getElementById("meFuelPanel")?.classList.add("open")}
function maintenanceMarkup(){
 const b=currentBoat(),condition=Math.max(0,Math.min(100,Math.round(Number(state?.condition)||0)));
 const rows=JOBS.map(j=>{
   const effect=j.full?"Stato yacht → 100%":"Stato +"+j.condition+"%"+(j.prestige?" · Prestigio +"+j.prestige:"");
   const disabled=Number(state?.coins||0)<j.cost || (condition>=100&&!j.prestige);
   return '<div class="me-service-row"><div><strong>'+j.icon+' '+j.name+'</strong><small>'+j.desc+'<br>'+effect+' · <b>'+fmt(j.cost)+' cr</b></small></div><button type="button" data-maint-job="'+j.id+'" '+(disabled?'disabled':'')+'>ESEGUI</button></div>';
 }).join("");
 return '<div class="me-service-summary">Yacht: <strong>'+(b?.name||"Yacht")+'</strong><br>Stato attuale: <strong>'+condition+'%</strong> · Crediti: '+fmt(state?.coins||0)+'</div><div class="me-service-grid">'+rows+'</div>';
}
function renderMaintenance(){
 ensurePanels();
 const body=document.getElementById("meMaintenanceBody");body.innerHTML=maintenanceMarkup();
 body.querySelectorAll("[data-maint-job]").forEach(btn=>btn.onclick=()=>{
   const job=JOBS.find(x=>x.id===btn.dataset.maintJob);if(!job)return;
   if(Number(state.coins||0)<job.cost){noticeText("Crediti insufficienti.");return}
   const ok=saveChange(()=>{
     state.coins=Math.max(0,Math.floor(Number(state.coins)||0)-job.cost);
     state.condition=job.full?100:Math.min(100,Math.round(Number(state.condition)||0)+job.condition);
     if(job.prestige)state.prestige=Math.max(0,Math.floor(Number(state.prestige)||0)+job.prestige);
     if(!state.maintenanceLog||typeof state.maintenanceLog!=="object")state.maintenanceLog={};
     state.maintenanceLog[job.id]=Date.now();
   });
   if(ok){noticeText(job.name+" completato.");renderMaintenance();}
 });
}
function openMaintenance(){closePanels();renderMaintenance();document.getElementById("meMaintenancePanel")?.classList.add("open")}
function exitGame(){
 closePanels();
 const logout=document.getElementById("cloudLogout");
 if(logout && !logout.disabled){logout.click();noticeText("Account disconnesso. La partita locale resta salvata.");return}
 if(typeof showTab==="function")showTab("profile");
 noticeText("Apri Account per uscire dalla sessione. La partita locale resta salvata.");
}
function mount(){
 const hud=document.getElementById("meCompactHud");if(!hud)return false;
 if(!document.getElementById("meHudRefuel")){
   const fuel=document.createElement("button");fuel.id="meHudRefuel";fuel.className="me-hud-action";fuel.type="button";fuel.textContent="⛽ FAI IL PIENO";fuel.onclick=openFuel;
   const maint=document.createElement("button");maint.id="meHudMaintenance";maint.className="me-hud-action";maint.type="button";maint.textContent="🔧 MANUTENZIONE";maint.onclick=openMaintenance;
   const exit=document.createElement("button");exit.id="meHudExit";exit.className="me-hud-action";exit.type="button";exit.textContent="🚪 ESCI";exit.onclick=exitGame;
   const fuelCard=document.getElementById("meHudFuel")?.parentElement;
   const condCard=document.getElementById("meHudCondition")?.parentElement;
   if(fuelCard)fuelCard.insertAdjacentElement("afterend",fuel);else hud.appendChild(fuel);
   if(condCard)condCard.insertAdjacentElement("afterend",maint);else hud.appendChild(maint);
   hud.appendChild(exit);
 }
 ensurePanels(); return true;
}
function boot(){if(mount())return;let n=0;const t=setInterval(()=>{n++;if(mount()||n>20)clearInterval(t)},250)}
window.addEventListener("marina-empire-updated",()=>setTimeout(mount,20));
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();