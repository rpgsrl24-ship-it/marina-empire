(()=>{
"use strict";
if(window.__ME_MOBILE_GAME_LOOP_V1__)return;
function meViewportWidth(){return typeof globalThis!=="undefined"&&Number.isFinite(Number(globalThis.innerWidth))?Number(globalThis.innerWidth):1024}
window.__ME_MOBILE_GAME_LOOP_V1__=true;

const style=document.createElement("style");
style.id="me-mobile-game-loop-v1-style";
style.textContent=`
@media(max-width:899px){
  body.me-mobile-home-sheet-open{overflow:hidden!important}
  body.me-mobile-home-sheet-open #home{
    display:block!important;
  }
  .screen.me-mobile-home-sheet{
    display:block!important;
    position:fixed!important;
    inset:0 0 calc(62px + env(safe-area-inset-bottom,0px)) 0!important;
    z-index:90000!important;
    overflow-y:auto!important;
    overscroll-behavior:contain!important;
    padding:58px 8px 24px!important;
    background:
      radial-gradient(circle at 50% -15%,rgba(30,83,105,.55),transparent 36%),
      linear-gradient(180deg,#061d2b,#031622 75%)!important;
  }
  .screen.me-mobile-home-sheet.hide{display:block!important}
  #meMobileSheetBar{
    display:none;
    position:fixed;
    top:0;left:0;right:0;
    z-index:90020;
    min-height:52px;
    padding:7px 9px;
    align-items:center;
    justify-content:space-between;
    gap:8px;
    border-bottom:1px solid #b89253;
    background:rgba(5,28,41,.96);
    backdrop-filter:blur(12px);
  }
  body.me-mobile-home-sheet-open #meMobileSheetBar{display:flex}
  #meMobileSheetBar div{min-width:0}
  #meMobileSheetBar small{
    display:block;color:#8faab5;font-size:7px;font-weight:900;letter-spacing:.13em
  }
  #meMobileSheetBar strong{
    display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    color:#f1d294;font-size:13px;letter-spacing:.04em
  }
  #meMobileSheetClose{
    flex:0 0 auto;min-width:80px!important;min-height:38px!important;padding:7px 10px!important;
    border:1px solid #b89253!important;border-radius:9px!important;
    background:#0b3445!important;color:#f4d59a!important;
    font-size:9px!important;font-weight:950!important
  }

  #meMobileGameLoop{
    order:-25!important;
    display:grid!important;
    grid-template-columns:minmax(0,1fr) auto!important;
    gap:10px!important;
    align-items:center!important;
    padding:12px!important;
    margin:0!important;
    border:1px solid #c5a15d!important;
    border-radius:14px!important;
    background:linear-gradient(140deg,#0a3547,#082536)!important;
    box-shadow:0 9px 22px rgba(0,0,0,.28)!important;
  }
  #meMobileGameLoop small{
    display:block!important;color:#89a9b5!important;font-size:7px!important;
    font-weight:900!important;letter-spacing:.12em!important
  }
  #meMobileGameLoop strong{
    display:block!important;margin-top:3px!important;color:#f5d79d!important;
    font-size:15px!important;line-height:1.08!important
  }
  #meMobileGameLoop span{
    display:block!important;margin-top:4px!important;color:#d3e1e5!important;
    font-size:9px!important;line-height:1.25!important
  }
  #meMobileGameLoopAction{
    min-width:96px!important;min-height:46px!important;padding:8px 10px!important;
    border:1px solid #f0cf8a!important;border-radius:10px!important;
    background:linear-gradient(135deg,#e8c46f,#b98132)!important;color:#102532!important;
    font-size:9px!important;font-weight:950!important;white-space:normal!important
  }
  #meMobileLoopStages{
    grid-column:1/-1!important;
    display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;
    gap:4px!important;margin-top:2px!important
  }
  #meMobileLoopStages i{
    display:block!important;height:3px!important;border-radius:4px!important;background:#1b4a59!important
  }
  #meMobileLoopStages i.on{background:#e3bd6e!important;box-shadow:0 0 8px rgba(227,189,110,.42)!important}

  #meMobileHomeServices{
    order:-15!important;
    display:grid!important;grid-template-columns:1fr 1fr!important;
    gap:7px!important;margin:0!important
  }
  #meMobileHomeServices button{
    min-height:52px!important;padding:7px 8px!important;
    border:1px solid rgba(184,148,82,.52)!important;border-radius:11px!important;
    background:#0a3040!important;color:#ead099!important;
    font-size:9px!important;font-weight:900!important
  }
  #meMobileHomeServices button b{
    display:block!important;margin-top:3px!important;color:#fff1cc!important;font-size:10px!important
  }
  #meMobileHomeServices button:disabled{opacity:.46!important}

  #meMobileConsoleManage{display:none!important}
  #meMobileHomeCommandCenter{
    order:-10!important;
    display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:6px!important;margin:0!important
  }
  #meMobileHomeCommandCenter button{
    min-width:0!important;min-height:66px!important;padding:7px 3px!important;
    border:1px solid rgba(190,153,87,.42)!important;border-radius:11px!important;
    background:#092d3d!important;color:#ecd092!important;
    font-size:8px!important;font-weight:900!important;white-space:normal!important
  }
  #meMobileHomeCommandCenter button span{
    display:block!important;margin-bottom:4px!important;font-size:19px!important
  }
  #meMobileHomeCommandCenter button.me-live-command{
    border-color:#67b7cc!important;color:#bfe8f1!important
  }

  #meMobileHomePulse{
    order:-18!important;display:grid!important;grid-template-columns:auto minmax(0,1fr) auto!important;
    gap:8px!important;align-items:center!important;padding:9px 10px!important;margin:0!important;
    border:1px solid rgba(101,187,204,.45)!important;border-radius:11px!important;
    background:linear-gradient(135deg,#082d3d,#0a3a4c)!important
  }
  #meMobileHomePulse .dot{width:9px;height:9px;border-radius:50%;background:#62e1a0;box-shadow:0 0 0 4px rgba(98,225,160,.13),0 0 12px rgba(98,225,160,.55)}
  #meMobileHomePulse strong{display:block!important;color:#dff6f1!important;font-size:10px!important;line-height:1.2!important}
  #meMobileHomePulse small{display:block!important;margin-top:2px!important;color:#9fc0c9!important;font-size:8px!important}
  #meMobileHomePulse button{min-height:36px!important;padding:6px 9px!important;font-size:8px!important;font-weight:900!important}

  #meMobileCreditsHero{order:-20!important}
  #home .me-mobile-home-goal{order:0!important}

  .me-mobile-console-live{
    cursor:pointer!important
  }
}
@media(min-width:900px){
  #meMobileGameLoop,#meMobileHomeServices,#meMobileHomeCommandCenter,#meMobileSheetBar{display:none!important}
}
`;
document.head.appendChild(style);

let currentPanel=null;

function gameState(){
  try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}
}
function yachtInfo(s){
  try{return typeof boat==="function"&&s?boat(s.boat):null}catch(_){return null}
}
function marinaName(id){
  try{return typeof port==="function"?port(id)?.name||"Marina":"Marina"}catch(_){return "Marina"}
}
function recentArrival(s){
  if(!s||s.trip||!s.lastArrival||!Number.isFinite(Number(s.lastArrival.at)))return false;
  return Date.now()-Number(s.lastArrival.at)<15*60*1000;
}
function lowServiceState(s){
  if(!s||s.trip)return {fuel:false,condition:false};
  const y=yachtInfo(s);
  const tank=Math.max(1,Number(y?.tank)||300);
  return {
    fuel:(Number(s.fuel)||0)<Math.max(60,tank*.25),
    condition:(Number(s.condition)||0)<60
  };
}
function nextAction(){
  const s=gameState();
  if(!s||!s.name)return {stage:0,label:"NUOVA PARTITA",title:"Crea il tuo comandante",desc:"Entra nel gioco e costruisci il tuo impero nautico.",action:"INIZIA",target:"profile"};
  if(!s.setupComplete&&!s.trip&&(Number(s.voyages)||0)===0)return {stage:0,label:"FASE 1 · PARTENZA RAPIDA",title:"RPG Academy 8 + Rimini",desc:"Un tocco e la base demo è pronta. Potrai cambiare yacht e marina più avanti.",action:"PARTI SUBITO",target:"quickSetup"};
  if(s.trip){
    return {stage:2,label:"FASE 3 · NAVIGAZIONE",title:"Rotta verso "+marinaName(s.trip.dest),desc:"Segui viaggio, GPS, carburante e arrivo.",action:"SEGUI ROTTA",target:"map"};
  }
  if(!window.meRegisteredPlayer){
    const voyages=Math.max(0,Number(s.voyages)||0);
    const guestJobs=Math.max(0,Number(s.guestTrialJobsUsed)||0);
    if(voyages>=2){
      return {stage:4,label:"TOUR GRATUITO COMPLETATO",title:"Salva il tuo impero",desc:"Hai provato missioni, navigazione e Marina Live. Registrati gratis per conservare i progressi e continuare la carriera.",action:"REGISTRATI",target:"profile"};
    }
    if(voyages>=1&&guestJobs<1){
      return {stage:3,label:"PROVA ESTESA · MARINA LIVE",title:"Completa un incarico gratuito",desc:"Ora prova la vita della marina: accetta 1 incarico VHF e riscuoti la ricompensa.",action:"MARINA LIVE",target:"marinaLive"};
    }
    if(voyages>=1&&guestJobs>=1){
      return {stage:1,label:"PROVA ESTESA · SECONDA MISSIONE",title:"Ora salpa di nuovo",desc:"Incarico Marina Live completato. Scegli una seconda missione e continua la carriera.",action:"SECONDA MISSIONE",target:"missions"};
    }
  }
  if(recentArrival(s)){
    return {stage:3,label:"FASE 4 · ARRIVO",title:"Sei arrivato a "+marinaName(s.port),desc:"Controlla Marina Live, eventi, VHF e nuove opportunità.",action:"MARINA LIVE",target:"marinas"};
  }
  const service=lowServiceState(s);
  if(service.fuel||service.condition){
    const what=service.fuel&&service.condition?"carburante e manutenzione":service.fuel?"carburante":"manutenzione";
    return {stage:0,label:"PREPARA LO YACHT",title:"Controlla "+what,desc:"Prima della prossima missione prepara lo yacht dalla Home.",action:"SERVIZI",target:"services"};
  }
  return {stage:1,label:"FASE 2 · MISSIONE",title:"Scegli la prossima missione",desc:"Accetta un incarico, salpa e aumenta crediti e prestigio.",action:"MISSIONI",target:"missions"};
}
function titleFor(id){
  return {
    missions:"MISSIONI & CHARTER",map:"NAVIGAZIONE",marinas:"MARINA LIVE",fleet:"GESTIONE FLOTTA",
    office:"DIREZIONE & ECONOMIA",marketplace:"MARKETPLACE",credits:"ACQUISTA CREDITI",
    profile:"COMANDANTE & ACCOUNT",headquarters:"ISOLA DELLE ROSE"
  }[id]||String(id||"PANNELLO").toUpperCase();
}
function ensureSheetBar(){
  let bar=document.getElementById("meMobileSheetBar");
  if(bar)return bar;
  bar=document.createElement("div");
  bar.id="meMobileSheetBar";
  bar.innerHTML='<div><small>HOME · CENTRO DI COMANDO</small><strong id="meMobileSheetTitle">PANNELLO</strong></div><button id="meMobileSheetClose" type="button">← HOME</button>';
  document.body.appendChild(bar);
  bar.querySelector("#meMobileSheetClose").addEventListener("click",closePanel);
  return bar;
}
function clearSheetClasses(){
  document.querySelectorAll(".screen.me-mobile-home-sheet").forEach(el=>el.classList.remove("me-mobile-home-sheet"));
}
function closePanel(){
  if(meViewportWidth()>899)return;
  clearSheetClasses();
  currentPanel=null;
  document.body.classList.remove("me-mobile-home-sheet-open");
  if(typeof showTab==="function")showTab("home");
  sync();
}
function normalizedPanel(id){
  const s=gameState();
  if(id==="missions"&&s?.trip)return "map";
  if(id==="missions"&&s?.name&&!s.setupComplete&&!s.trip&&(Number(s.voyages)||0)===0)return "office";
  return id;
}
function openPanel(id,opts){
  if(meViewportWidth()>899){if(typeof showTab==="function")showTab(id);return}
  id=normalizedPanel(id);
  if(id==="home"){closePanel();return}
  const target=document.getElementById(id);
  const home=document.getElementById("home");
  if(!target||!home)return;
  clearSheetClasses();
  if(typeof showTab==="function")showTab(id);
  home.classList.remove("hide");
  target.classList.remove("hide");
  target.classList.add("me-mobile-home-sheet");
  currentPanel=id;
  document.body.classList.add("me-mobile-home-sheet-open");
  const bar=ensureSheetBar();
  const title=bar.querySelector("#meMobileSheetTitle");
  if(title)title.textContent=titleFor(id);
  target.scrollTop=0;
  if(id==="office"&&opts?.community){
    target.classList.add("me-mobile-expanded");
    setTimeout(()=>document.getElementById("marinaCommunity")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
  }
  if(id==="office"&&opts?.marinaLive){
    target.classList.add("me-mobile-expanded");
    setTimeout(()=>document.getElementById("meMarinaLivePanel")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
  }
  if(id==="map")setTimeout(()=>{try{if(typeof voyageLeafletMap!=="undefined"&&voyageLeafletMap)voyageLeafletMap.invalidateSize()}catch(_){}},180);
}
function runService(which){
  const id=which==="fuel"?"refuel":"repair";
  const button=document.getElementById(id);
  if(button&&!button.disabled)button.click();
  setTimeout(sync,60);
}
function runPrimary(){
  const action=nextAction();
  if(action.target==="quickSetup"){
    try{
      if(typeof confirmSetup==="function"){confirmSetup();return}
    }catch(_){}
    openPanel("office");
    setTimeout(()=>document.getElementById("meQuickStart")?.click(),160);
    return;
  }
  if(action.target==="marinaLive"){openPanel("office",{marinaLive:true});return}
  if(action.target==="services"){
    document.getElementById("meMobileHomeServices")?.scrollIntoView({behavior:"smooth",block:"center"});
    return;
  }
  openPanel(action.target);
}
function ensureHome(){
  if(meViewportWidth()>899)return;
  const home=document.querySelector("#home .me-mobile-home-dashboard");
  if(!home)return;

  if(!document.getElementById("meMobileHomePulse")){
    const pulse=document.createElement("div");
    pulse.id="meMobileHomePulse";
    pulse.innerHTML='<span class="dot" aria-hidden="true"></span><div><strong id="meMobilePulseTitle">Marina operativa</strong><small id="meMobilePulseText">Controllo traffico e richieste in corso…</small></div><button type="button" id="meMobilePulseAction">APRI LIVE</button>';
    pulse.querySelector("#meMobilePulseAction").addEventListener("click",()=>openPanel("marinas"));
    home.prepend(pulse);
  }

  if(!document.getElementById("meMobileGameLoop")){
    const card=document.createElement("section");
    card.id="meMobileGameLoop";
    card.innerHTML='<div><small id="meMobileLoopLabel">PROSSIMO PASSO</small><strong id="meMobileLoopTitle">Preparazione</strong><span id="meMobileLoopDesc">Controllo partita…</span></div><button id="meMobileGameLoopAction" type="button">CONTINUA</button><div id="meMobileLoopStages"><i></i><i></i><i></i><i></i><i></i></div>';
    card.querySelector("#meMobileGameLoopAction").addEventListener("click",runPrimary);
    const credits=document.getElementById("meMobileCreditsHero");
    if(credits)credits.insertAdjacentElement("beforebegin",card);else home.prepend(card);
  }

  if(!document.getElementById("meMobileHomeServices")){
    const services=document.createElement("div");
    services.id="meMobileHomeServices";
    services.innerHTML='<button type="button" data-home-service="fuel">⛽ RIFORNIMENTO<b id="meMobileServiceFuel">—</b></button><button type="button" data-home-service="repair">🔧 MANUTENZIONE<b id="meMobileServiceCondition">—</b></button>';
    services.addEventListener("click",e=>{
      const b=e.target.closest("[data-home-service]");
      if(b)runService(b.dataset.homeService);
    });
    const command=document.getElementById("meMobileHomeCommandCenter");
    if(command)command.insertAdjacentElement("beforebegin",services);
    else {
      const credits=document.getElementById("meMobileCreditsHero");
      if(credits)credits.insertAdjacentElement("afterend",services);else home.append(services);
    }
  }

  if(!document.getElementById("meMobileHomeCommandCenter")){
    const center=document.createElement("div");
    center.id="meMobileHomeCommandCenter";
    center.innerHTML=
      '<button type="button" data-home-panel="missions"><span>🎯</span>MISSIONI</button>'+
      '<button type="button" data-home-panel="map"><span>🧭</span>NAVIGA</button>'+
      '<button type="button" data-home-panel="marinas" class="me-live-command"><span>⚓</span>MARINA LIVE</button>'+
      '<button type="button" data-home-panel="fleet"><span>🛥️</span>FLOTTA</button>'+
      '<button type="button" data-home-section="crew"><span>👥</span>EQUIPAGGIO</button>'+
      '<button type="button" data-home-section="refit"><span>🛠️</span>REFIT</button>'+
      '<button type="button" data-home-panel="office"><span>◈</span>DIREZIONE</button>'+
      '<button type="button" data-home-panel="marketplace"><span>🛒</span>MARKET</button>'+
      '<button type="button" data-home-community="1"><span>💬</span>COMMUNITY</button>'+
      '<button type="button" data-home-panel="profile"><span>👤</span>COMANDANTE</button>'+
      '<button type="button" data-home-panel="headquarters"><span>🏝️</span>BASE RPG</button>';
    center.addEventListener("click",e=>{
      const b=e.target.closest("button");if(!b)return;
      if(b.dataset.homeCommunity)openPanel("office",{community:true});
      else if(b.dataset.homeSection){
        openPanel("office");
        setTimeout(()=>{
          const id=b.dataset.homeSection==="crew"?"meCrewSystem":"meRefitV1";
          document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
        },140);
      }
      else if(b.dataset.homePanel)openPanel(b.dataset.homePanel);
    });
    const goal=home.querySelector(".me-mobile-home-goal");
    if(goal)goal.insertAdjacentElement("beforebegin",center);else home.append(center);
  }

  const live=document.querySelector("#meMobileConsoleHome .me-mobile-console-live");
  if(live&&!live.dataset.homeWired){
    live.dataset.homeWired="1";
    live.setAttribute("role","button");
    live.setAttribute("tabindex","0");
    live.addEventListener("click",()=>openPanel("marinas"));
    live.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openPanel("marinas")}});
  }
}
function sync(){
  if(meViewportWidth()>899)return;
  ensureHome();
  const s=gameState();
  const action=nextAction();
  const label=document.getElementById("meMobileLoopLabel");
  const title=document.getElementById("meMobileLoopTitle");
  const desc=document.getElementById("meMobileLoopDesc");
  const button=document.getElementById("meMobileGameLoopAction");
  if(label)label.textContent=action.label;
  if(title)title.textContent=action.title;
  if(desc)desc.textContent=action.desc;
  if(button)button.textContent=action.action;
  document.querySelectorAll("#meMobileLoopStages i").forEach((el,i)=>el.classList.toggle("on",i<=action.stage));

  const y=yachtInfo(s);
  const tank=Math.max(1,Number(y?.tank)||300);
  const fuel=Math.max(0,Math.round(Number(s?.fuel)||0));
  const condition=Math.max(0,Math.round(Number(s?.condition)||0));
  const fuelText=document.getElementById("meMobileServiceFuel");
  const conditionText=document.getElementById("meMobileServiceCondition");
  if(fuelText)fuelText.textContent=fuel+" / "+Math.round(tank)+" L";
  if(conditionText)conditionText.textContent=condition+"%";
  const pulseTitle=document.getElementById("meMobilePulseTitle");
  const pulseText=document.getElementById("meMobilePulseText");
  try{
    const snap=window.MarinaEmpireLiveTraffic?.snapshot?.();
    const contracts=window.MarinaEmpireLiveTraffic?.contracts?.()||[];
    const count=Math.max(0,Number(snap?.volume)||((snap?.items||[]).length));
    if(pulseTitle)pulseTitle.textContent=(s?.trip?"Navigazione in corso":"Marina Live · "+marinaName(s?.port));
    if(pulseText){
      if(s?.trip)pulseText.textContent="Rotta attiva · segui GPS, carburante e arrivo.";
      else if(contracts.length)pulseText.textContent=count+" unità attive · "+contracts.length+" richieste disponibili.";
      else pulseText.textContent=count+" unità attive · nessuna richiesta urgente.";
    }
  }catch(_){
    if(pulseTitle)pulseTitle.textContent="Marina operativa";
    if(pulseText)pulseText.textContent="Traffico e attività in aggiornamento.";
  }

  const serviceButtons=document.querySelectorAll("#meMobileHomeServices button");
  serviceButtons.forEach(b=>b.disabled=!!s?.trip);
}
function reassertSheet(){
  if(meViewportWidth()>899||!currentPanel)return;
  const target=document.getElementById(currentPanel),home=document.getElementById("home");
  if(!target||!home)return;
  home.classList.remove("hide");
  target.classList.remove("hide");
  target.classList.add("me-mobile-home-sheet");
  document.body.classList.add("me-mobile-home-sheet-open");
}
document.addEventListener("click",e=>{
  if(meViewportWidth()>899)return;

  const mobileTab=e.target.closest("[data-mobile-tab]");
  if(mobileTab){
    const id=mobileTab.dataset.mobileTab;
    e.preventDefault();e.stopImmediatePropagation();
    if(id==="home")closePanel();
    else if(id&&document.getElementById(id))openPanel(id);
    return;
  }

  const mobileMore=e.target.closest("[data-mobile-more-tab]");
  if(mobileMore){
    const id=mobileMore.dataset.mobileMoreTab;
    e.preventDefault();e.stopImmediatePropagation();
    document.getElementById("meMobileMore")?.classList.add("hide");
    document.getElementById("meMobileMoreToggle")?.setAttribute("aria-expanded","false");
    if(id&&document.getElementById(id))openPanel(id);
    return;
  }

  const community=e.target.closest("[data-open-community]");
  if(community){
    e.preventDefault();e.stopImmediatePropagation();
    document.getElementById("meMobileMore")?.classList.add("hide");
    document.getElementById("meMobileMoreToggle")?.setAttribute("aria-expanded","false");
    openPanel("office",{community:true});
    return;
  }

  const panelButton=e.target.closest("#home [data-tab],.me-mobile-home-sheet [data-tab]");
  if(panelButton){
    const id=panelButton.dataset.tab;
    if(id&&document.getElementById(id)){
      e.preventDefault();e.stopImmediatePropagation();openPanel(id);return;
    }
  }

  const consoleButton=e.target.closest("#meMobileConsoleHome [data-console-go]");
  if(consoleButton){
    e.preventDefault();e.stopImmediatePropagation();openPanel(consoleButton.dataset.consoleGo);return;
  }

  const creditButton=e.target.closest("#meMobileCreditsHero button");
  if(creditButton){
    e.preventDefault();e.stopImmediatePropagation();openPanel("credits");return;
  }
},true);

window.addEventListener("marina-empire-updated",()=>{
  if(currentPanel==="missions"&&gameState()?.trip){currentPanel="map";setTimeout(()=>openPanel("map"),40);return}
  setTimeout(()=>{sync();reassertSheet()},30);
});
window.addEventListener("resize",()=>{
  if(meViewportWidth()>899&&currentPanel){
    clearSheetClasses();currentPanel=null;document.body.classList.remove("me-mobile-home-sheet-open");
  }else sync();
});
window.MarinaEmpireMobileHome={open:openPanel,close:closePanel,sync,nextAction};

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{ensureSheetBar();sync()},{once:true});
else {ensureSheetBar();sync()}
setTimeout(sync,350);
setInterval(sync,4000);
})();