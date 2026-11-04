(()=>{
"use strict";
if(window.__ME_GAME_GUIDE__)return;
window.__ME_GAME_GUIDE__=true;

const style=document.createElement("style");
style.id="me-game-guide-style";
style.textContent=`
.me-game-guide{margin:10px 0 14px;padding:13px 14px;border:1px solid rgba(214,181,117,.55);border-radius:14px;background:linear-gradient(135deg,#0a3142,#0b2432);box-shadow:0 8px 20px rgba(0,0,0,.18)}
.me-game-guide-top{display:flex;align-items:center;gap:8px;margin-bottom:5px;color:#e5c47f;font-size:10px;font-weight:900;letter-spacing:.12em}
.me-game-guide-main{display:flex;align-items:center;justify-content:space-between;gap:12px}
.me-game-guide-copy{min-width:0}.me-game-guide-copy strong{display:block;color:#fff2cc;font-size:17px;line-height:1.15}.me-game-guide-copy p{margin:4px 0 0;color:#c6d8dd;font-size:11px;line-height:1.35}
.me-game-guide button{flex:0 0 auto;min-width:118px;min-height:44px;padding:10px 12px;border-color:#d7ad62;background:linear-gradient(135deg,#d9b465,#a8792e);color:#10202b;font-weight:900}
.me-guide-flash{animation:meGuideFlash 1.2s ease}
@keyframes meGuideFlash{0%,100%{box-shadow:0 0 0 0 rgba(235,199,126,0)}40%{box-shadow:0 0 0 5px rgba(235,199,126,.28)}}
@media(max-width:740px){
 .me-game-guide{margin:7px 0 10px;padding:11px 12px;border-radius:12px}
 .me-game-guide-main{gap:8px}.me-game-guide-copy strong{font-size:15px}.me-game-guide-copy p{font-size:10px}
 .me-game-guide button{min-width:96px;max-width:120px;min-height:42px;padding:8px 9px;font-size:10px;white-space:normal}
 #meMobileNextStep{display:none!important}
 #home .me-mobile-home-continue{display:none!important}
}
`;
document.head.appendChild(style);

const configs={
 map:{icon:"🗺️",title:"Scegli una missione prima di partire",desc:"La mappa serve per seguire la rotta. Prima seleziona un incarico.",label:"VAI ALLE MISSIONI",tab:"missions"},
 missions:{icon:"🎯",title:"Scegli una missione disponibile",desc:"Apri una missione con PARTI ORA. Se è bloccata, il gioco ti indica cosa manca.",label:"VEDI MISSIONI",target:"#missionList"},
 fleet:{icon:"🛥️",title:"Controlla lo yacht attivo",desc:"Verifica barca, carburante e stato. Poi scegli una missione.",label:"GESTISCI FLOTTA",target:"#fleetList"},
 marinas:{icon:"⚓",title:"Guarda cosa succede nella marina",desc:"Traffico, clienti, VHF e incarichi live cambiano continuamente.",label:"ATTIVITÀ LIVE",target:".me-live-marina"},
 office:{icon:"🏢",title:"Gestisci il tuo impero",desc:"Qui configuri yacht, attività nautiche, finanze e investimenti.",label:"GESTISCI",target:"#officeActions"},
 marketplace:{icon:"🛒",title:"Compra o vendi nel mercato nautico",desc:"Consulta le offerte disponibili e scegli solo ciò che serve alla crescita.",label:"APRI MERCATO",target:"#meMarketplaceApp"},
 credits:{icon:"💳",title:"Crediti opzionali",desc:"Puoi comprare crediti oppure continuare a guadagnarli giocando.",label:"VEDI PACCHETTI",target:".me-credit-packs"},
 profile:{icon:"👤",title:"Gestisci account e carriera",desc:"Qui salvi i progressi online e controlli il livello del comandante.",label:"APRI ACCOUNT",target:"#meRegistrationArea"},
 headquarters:{icon:"🏝️",title:"Quartier generale RPG Yacht",desc:"Consulta la situazione e poi torna alle missioni per far crescere l’impero.",label:"MISSIONI",tab:"missions"},
 home:{icon:"⚓",title:"Scegli cosa fare adesso",desc:"Il gioco ti porta sempre alla prossima azione utile.",label:"CONTINUA",tab:"missions"}
};

let guide=null,currentAction=null;

function activeScreen(){
 return document.querySelector(".screen:not(.hide)");
}
function pctFuel(){
 try{
  const id=state?.boat,boatsArr=typeof boats!=="undefined"?boats:[],b=boatsArr.find(x=>x.id===id);
  const tank=Number(b?.tank)||400;
  return Math.max(0,Math.min(1,(Number(state?.fuel)||0)/tank));
 }catch(_){return 1}
}
function homeConfig(){
 if(typeof state==="undefined"||!state)return configs.home;
 if(!state.setupComplete&&(Number(state.voyages)||0)===0)return {icon:"⚙️",title:"Prepara il tuo primo yacht",desc:"Configura base, barca e partenza. È il primo passo.",label:"CONFIGURA",tab:"office",target:"#setupDashboard"};
 if(state.trip)return {icon:"🧭",title:"La tua barca è in navigazione",desc:"Segui rotta, carburante e arrivo.",label:"SEGUI ROTTA",tab:"map",target:"#voyageCinema"};
 if((Number(state.condition)||100)<70)return {icon:"🔧",title:"Fai manutenzione prima di ripartire",desc:"Lo yacht è usurato. Riparalo prima della prossima missione.",label:"RIPARA",tab:"office",target:"#officeActions"};
 if(pctFuel()<.22)return {icon:"⛽",title:"Fai rifornimento prima di ripartire",desc:"Il carburante è basso per affrontare nuove rotte.",label:"RIFORNISCI",tab:"office",target:"#officeActions"};
 const voyages=Number(state.voyages)||0;
 const businesses=state.businesses&&typeof state.businesses==="object"?Object.values(state.businesses).filter(Boolean).length:0;
 if(voyages<3)return {icon:"🎯",title:"Completa la prossima missione",desc:"Guadagna crediti e sblocca nuove attività nautiche.",label:"MISSIONI",tab:"missions"};
 if(businesses===0)return {icon:"🏪",title:"Apri la tua prima attività nautica",desc:"Hai sbloccato la parte gestionale: ora costruisci una fonte di reddito.",label:"ATTIVITÀ",tab:"office",target:"#officeActions"};
 return {icon:"🎯",title:"Continua a far crescere l’impero",desc:"Missioni, clienti e attività fanno salire crediti e prestigio.",label:"GIOCA",tab:"missions"};
}
function configFor(id){
 if(id==="home")return homeConfig();
 if(id==="map"&&typeof state!=="undefined"&&state?.trip)return {icon:"🧭",title:"Segui la navigazione in corso",desc:"Controlla rotta, carburante e arrivo alla marina.",label:"SEGUI ROTTA",target:"#voyageCinema"};
 if(id==="missions"&&typeof state!=="undefined"&&!state?.setupComplete&&(Number(state?.voyages)||0)===0)return {icon:"⚙️",title:"Prima configura il tuo yacht",desc:"Scegli barca e marina di partenza, poi torna qui.",label:"CONFIGURA",tab:"office",target:"#setupDashboard"};
 if(id==="office"&&typeof state!=="undefined"&&!state?.setupComplete&&(Number(state?.voyages)||0)===0)return {icon:"⚙️",title:"Completa la configurazione iniziale",desc:"Scegli base operativa e yacht. Poi potrai partire.",label:"CONFIGURA",target:"#setupDashboard"};
 if(id==="profile"&&window.meRegisteredPlayer)return {icon:"👑",title:"Controlla la tua carriera",desc:"Qui trovi prestigio, progressione e salvataggio del comandante.",label:"CARRIERA",target:"#careerPanel"};
 if(id==="credits"&&!window.meRegisteredPlayer)return {icon:"👤",title:"Prima accedi al tuo account",desc:"L’account serve per associare correttamente eventuali crediti acquistati.",label:"ACCEDI",tab:"profile",target:"#meRegistrationArea"};
 return configs[id]||configs.home;
}
function placeGuide(screen){
 if(!guide){
  guide=document.createElement("div");
  guide.className="me-game-guide";
  guide.id="meGameGuide";
  guide.setAttribute("role","region");
  guide.setAttribute("aria-label","Cosa fare ora");
 }
 const head=screen.querySelector(":scope > .me-lux-page-head");
 if(head)head.insertAdjacentElement("afterend",guide);
 else screen.prepend(guide);
}
function flashTarget(el){
 if(!el)return;
 el.classList.remove("me-guide-flash");void el.offsetWidth;el.classList.add("me-guide-flash");
 setTimeout(()=>el.classList.remove("me-guide-flash"),1500);
}
function runAction(cfg){
 if(cfg.tab&&typeof showTab==="function")showTab(cfg.tab);
 setTimeout(()=>{
  const el=cfg.target?document.querySelector(cfg.target):null;
  if(el){el.scrollIntoView({behavior:"smooth",block:"start"});flashTarget(el)}
 },140);
}
function render(){
 const screen=activeScreen();if(!screen)return;
 placeGuide(screen);
 const cfg=configFor(screen.id);
 currentAction=cfg;
 guide.innerHTML='<div class="me-game-guide-top"><span>'+cfg.icon+'</span><span>COSA FARE ORA</span></div><div class="me-game-guide-main"><div class="me-game-guide-copy"><strong>'+cfg.title+'</strong><p>'+cfg.desc+'</p></div><button type="button">'+cfg.label+'</button></div>';
 guide.querySelector("button").addEventListener("click",()=>runAction(cfg));
}
function boot(){
 render();
 document.querySelectorAll(".screen").forEach(s=>new MutationObserver(()=>{if(!s.classList.contains("hide"))setTimeout(render,30)}).observe(s,{attributes:true,attributeFilter:["class"]}));
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,80));
 window.addEventListener("resize",render);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();