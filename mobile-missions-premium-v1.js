(()=>{
"use strict";
if(window.__ME_MOBILE_MISSIONS_PREMIUM_V1__)return;
window.__ME_MOBILE_MISSIONS_PREMIUM_V1__=true;

const style=document.createElement("style");
style.id="me-mobile-missions-premium-v1-style";
style.textContent=`
@media(max-width:899px){
 body.me-missions3-active{background:#031725!important}
 body.me-missions3-active #meMobileSheetBar,
 body.me-missions3-active .mobile-game-nav,
 body.me-missions3-active #meMobileMore,
 body.me-missions3-active .top,
 body.me-missions3-active .stats,
 body.me-missions3-active #meCompactHud,
 body.me-missions3-active>.nav,
 body.me-missions3-active .shell>.nav{display:none!important}

 #missions.me-missions3-ready{
   position:fixed!important;inset:0!important;z-index:91500!important;
   overflow-y:auto!important;overflow-x:hidden!important;
   padding:8px 8px 94px!important;
   background:
     radial-gradient(circle at 50% -10%,rgba(37,126,154,.34),transparent 33%),
     linear-gradient(180deg,#05283b 0%,#073248 47%,#031824 100%)!important;
   overscroll-behavior:contain!important
 }
 #missions.me-missions3-ready.hide{
   display:none!important;visibility:hidden!important;pointer-events:none!important;z-index:-1!important
 }
 #missions.me-missions3-ready:not(.hide){display:block!important}
 #missions.me-missions3-ready>.me-lux-page-head{display:none!important}
 #missions.me-missions3-ready>.panel{
   margin:0 0 9px!important;padding:9px!important;
   border:1px solid rgba(219,177,96,.58)!important;border-radius:14px!important;
   background:linear-gradient(145deg,#103f56,#082a3e)!important;
   box-shadow:0 8px 22px #0005!important
 }
 #missions.me-missions3-ready>.panel:not(#firstVoyageGuide)>h2,
 #missions.me-missions3-ready>.panel:not(#firstVoyageGuide)>p.muted{display:none!important}

 #firstVoyageGuide{padding:9px 10px!important}
 #firstVoyageGuide h2{margin:0!important;color:#f4d58d!important;font-size:11px!important}
 #firstVoyageGuide p{display:none!important}
 #firstVoyageLaunch{width:100%!important;min-height:38px!important;margin-top:6px!important;font-size:8px!important}

 #meMissionsPremiumTop{display:flex!important;flex-direction:column;gap:9px;margin-bottom:9px;color:#f7f2e7}
 .mm3-topbar{display:flex;align-items:center;justify-content:space-between;gap:8px}
 .mm3-brand{min-width:0}.mm3-brand b{display:block;color:#f0ce86;font:800 21px Georgia,serif;letter-spacing:.055em;white-space:nowrap}.mm3-brand small{display:block;margin-top:1px;color:#9eb6c0;font-size:6.8px;font-weight:900;letter-spacing:.12em}
 .mm3-level{flex:0 0 104px;text-align:right}.mm3-level span{display:block;color:#f4d48c;font-size:8.5px;font-weight:950}.mm3-xp{height:6px;margin-top:5px;border-radius:99px;background:#173d50;overflow:hidden}.mm3-xp i{display:block;height:100%;background:linear-gradient(90deg,#ffe07d,#bf8b33)}

 .mm3-titlebar{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;padding:3px 3px 0}
 .mm3-titlebar h2{margin:0;color:#fff5d9;font:900 27px/1 Georgia,serif;text-shadow:0 2px 10px #000}.mm3-titlebar h2 span{color:#e7bf71;font:800 12px system-ui}.mm3-titlebar p{margin:5px 0 0;color:#d8e6e9;font-size:8.5px}.mm3-pagepill{flex:0 0 auto;padding:6px 8px;border:1px solid #d6ae62;border-radius:999px;background:#072a3de8;color:#f8dc9a;font-size:7.5px;font-weight:950}

 .mm3-hero{position:relative;height:245px;overflow:hidden;border:1px solid #e1b665;border-radius:16px;background:#0b536c;box-shadow:0 12px 30px #0008;isolation:isolate}
 .mm3-hero:before{content:"";position:absolute;inset:0;background:url("./anteprima/assets/render-2026/charter.jpg") center 53%/cover no-repeat;filter:brightness(1.55) saturate(1.43) contrast(1.04);transform:scale(1.02)}
 .mm3-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#02151f08 12%,#02151f20 45%,#02151fd9 100%)}
 .mm3-herocopy{position:absolute;z-index:2;left:11px;right:11px;bottom:12px}.mm3-herocopy small{display:block;color:#72e3a1;font-size:7px;font-weight:950;letter-spacing:.12em}.mm3-herocopy strong{display:block;margin-top:3px;color:#fff1c5;font:900 21px/1.05 Georgia,serif;text-shadow:0 3px 10px #000}.mm3-herocopy span{display:block;margin-top:5px;color:#e6f0f2;font-size:8px;text-shadow:0 2px 8px #000}.mm3-herobadge{position:absolute;z-index:2;right:9px;top:9px;padding:5px 8px;border:1px solid #d7b267;border-radius:999px;background:#032636df;color:#f6dc9b;font-size:7px;font-weight:950}

 .mm3-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));overflow:hidden;border:1px solid #dfb361;border-radius:13px;background:linear-gradient(145deg,#184f68,#092e44);box-shadow:0 8px 21px #0005}
 .mm3-stats>button,.mm3-stats>div{min-width:0;padding:10px 5px;border:0;border-right:1px solid #ffffff15;background:transparent;color:#fff;text-align:center;box-shadow:none}.mm3-stats>*:last-child{border-right:0}
 .mm3-stats span{display:block;color:#b0c2c9;font-size:6.1px;font-weight:900;white-space:nowrap}.mm3-stats b{display:block;margin-top:4px;color:#fff;font-size:11px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mm3-stats .ok b{color:#68e491}.mm3-stats .gold b{color:#ffd873}

 .mm3-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
 .mm3-tabs button{min-width:0!important;min-height:52px!important;padding:7px 5px!important;border:1px solid #6d8f9e!important;border-radius:12px!important;background:linear-gradient(145deg,#15516a,#092f45)!important;color:#edf6f8!important;font-size:8px!important;font-weight:950!important;box-shadow:0 6px 17px #0004!important}
 .mm3-tabs button b{display:inline-block;margin-right:4px;color:#f1cd78;font-size:14px;vertical-align:-1px}.mm3-tabs button.on{border-color:#ffd169!important;background:linear-gradient(145deg,#9a6c19,#18495e)!important;color:#fff3c9!important;box-shadow:0 0 0 2px #ffd16933,0 7px 18px #0005!important}

 .mm3-trip{display:none;border:1px solid #74abc0;border-radius:12px;background:linear-gradient(145deg,#0b4258,#082b40);padding:10px}.mm3-trip.on{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}.mm3-trip small{display:block;color:#8fb0bc;font-size:6.8px;font-weight:900}.mm3-trip strong{display:block;margin-top:3px;color:#fff0c2;font-size:11px}.mm3-trip button{min-height:38px!important;padding:6px 9px!important;background:linear-gradient(135deg,#f0d17d,#c18a38)!important;color:#102532!important;font-size:8px!important;font-weight:950!important}

 #missions.me-missions3-ready .me-mission-search{
   display:grid!important;grid-template-columns:minmax(0,1fr) 118px!important;gap:7px!important;
   margin:0 0 8px!important;padding:7px!important;border:1px solid rgba(220,179,98,.48)!important;border-radius:12px!important;background:linear-gradient(145deg,#12495f,#082b40)!important
 }
 #meMissionSearch,#meMissionFilter{width:100%!important;min-width:0!important;min-height:40px!important;padding:8px 9px!important;border:1px solid #678694!important;border-radius:9px!important;background:#082a3e!important;color:#eaf2f3!important;font-size:8px!important}
 #meMissionCount{margin:2px 2px 8px!important;color:#a7bcc4!important;font-size:7.5px!important}

 #missionList{display:grid!important;gap:9px!important}
 #missionList>.item{
   position:relative!important;overflow:hidden!important;min-height:158px!important;margin:0!important;
   padding:13px 9px 10px 45%!important;border:1px solid rgba(225,181,96,.72)!important;border-radius:15px!important;
   background:linear-gradient(145deg,#12495f,#082b40)!important;box-shadow:0 9px 23px #0005!important
 }
 #missionList>.item:after{
   content:"";position:absolute;z-index:0;left:0;top:0;bottom:0;width:42%;
   background:
     linear-gradient(180deg,#03162008 5%,#03162035 58%,#031620b5 100%),
     url("./anteprima/assets/render-2026/flotta.jpg") center/cover no-repeat;
   filter:brightness(1.26) saturate(1.25)
 }
 #missionList>.item:nth-child(2n):after{
   background:
     linear-gradient(180deg,#03162008 5%,#03162035 58%,#031620b5 100%),
     url("./anteprima/assets/render-2026/hero-yacht.jpg") center/cover no-repeat
 }
 #missionList>.item:nth-child(3n):after{
   background:
     linear-gradient(180deg,#03162008 5%,#03162035 58%,#031620b5 100%),
     url("./anteprima/assets/render-2026/charter.jpg") center/cover no-repeat
 }
 #missionList>.item:before{
   content:attr(data-mm3-label);position:absolute;z-index:4;left:8px;top:8px;padding:4px 7px;border-radius:999px;
   background:#0a593a;color:#80efac;font-size:6.5px;font-weight:950;letter-spacing:.05em;box-shadow:0 4px 10px #0006
 }
 #missionList>.item[data-mm3-state="locked"]:before{background:#58401c;color:#f1cd78}
 #missionList>.item[data-mm3-state="active"]:before{background:#c72f3c;color:#fff}
 #missionList>.item>*{position:relative;z-index:2}
 #missionList>.item>b,#missionList>.item>strong{display:block!important;padding-right:2px!important;color:#fff1c6!important;font:800 14px/1.08 Georgia,serif!important}
 #missionList>.item p{margin:6px 0 0!important;color:#d0dfe3!important;font-size:8px!important;line-height:1.28!important}
 #missionList>.item p:nth-of-type(2){color:#f0cd78!important;font-weight:900!important}
 #missionList>.item p:nth-of-type(n+4){display:none!important}
 #missionList>.item button{
   width:100%!important;min-height:38px!important;margin-top:9px!important;padding:7px 8px!important;
   border:1px solid #e8c36b!important;border-radius:999px!important;background:linear-gradient(135deg,#47d86d,#15954b)!important;color:#fff!important;
   font-size:7.8px!important;font-weight:950!important;box-shadow:0 6px 14px #0004!important
 }
 #missionList>.item button:disabled{border-color:#536774!important;background:#173746!important;color:#8298a1!important;box-shadow:none!important;opacity:1!important}
 #missionList>.item.hide{display:none!important}

 .mm3-special{position:relative;overflow:hidden;min-height:145px;margin-top:9px;border:1px solid #e1b762;border-radius:15px;background:url("./anteprima/assets/render-2026/marine.jpg") center/cover no-repeat;box-shadow:0 9px 24px #0005}
 .mm3-special:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#06263be8 0%,#06263ba6 55%,#06263b28 100%)}
 .mm3-specialcopy{position:relative;z-index:2;width:69%;padding:14px}.mm3-specialcopy small{display:block;color:#f0cd7a;font-size:7px;font-weight:950;letter-spacing:.1em}.mm3-specialcopy strong{display:block;margin-top:4px;color:#fff1c5;font:900 19px Georgia,serif}.mm3-specialcopy span{display:block;margin-top:5px;color:#dce9ec;font-size:8px}.mm3-specialcopy button{min-height:36px!important;margin-top:8px!important;padding:6px 10px!important;border-radius:999px!important;background:linear-gradient(135deg,#e9c56f,#b77e31)!important;color:#102432!important;font-size:8px!important;font-weight:950!important}

 .mm3-bottom-wrap{position:fixed;z-index:93000;left:0;right:0;bottom:0;padding:4px 4px calc(4px + env(safe-area-inset-bottom));border-top:1px solid #d2aa60;background:#041827f5;backdrop-filter:blur(14px);box-shadow:0 -8px 24px #0008}
 .mm3-bottom{display:flex;overflow-x:auto;gap:0;scrollbar-width:none}.mm3-bottom::-webkit-scrollbar{display:none}
 .mm3-bottom button{flex:0 0 72px;min-width:72px!important;min-height:62px!important;padding:5px 3px!important;border:0!important;border-right:1px solid #ffffff10!important;border-radius:0!important;background:transparent!important;color:#dce8eb!important;font-size:6.6px!important;font-weight:900!important;box-shadow:none!important;line-height:1.1!important}
 .mm3-bottom button b{display:block;margin-bottom:4px;font-size:18px}.mm3-bottom button small{display:block;margin-top:3px;color:#88a4af;font-size:6px}
 .mm3-bottom button.on{border:1px solid #f0c75f!important;border-radius:10px!important;background:linear-gradient(145deg,#85601d,#173f52)!important;color:#ffd970!important;box-shadow:0 0 14px #e6b94e55!important}

 body.me-missions3-active #meFuelPanel,body.me-missions3-active #meMaintenancePanel{display:none;position:fixed;z-index:94000;left:8px;right:8px;top:auto;bottom:78px;width:auto;max-height:70vh;overflow:auto;padding:12px;border:1px solid #d6ae64;border-radius:15px;background:#051d2bec;box-shadow:0 18px 50px #000c;backdrop-filter:blur(14px)}
 body.me-missions3-active #meFuelPanel.open,body.me-missions3-active #meMaintenancePanel.open{display:block}

 @media(max-width:390px){
  .mm3-hero{height:225px}.mm3-titlebar h2{font-size:24px}
  #missionList>.item{min-height:151px!important;padding-left:44%!important}
  #missionList>.item:after{width:41%}.mm3-bottom button{flex-basis:68px;min-width:68px!important}
 }
}
@media(min-width:900px){#meMissionsPremiumTop,#meMissionsPremiumNav,#meMissionsSpecial{display:none!important}}
`;
document.head.appendChild(style);

function width(){return Number(globalThis.innerWidth)||1024}
function game(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function fmt(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function esc(v){return String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function marinaName(id){try{return typeof port==="function"?(port(id)?.name||"Marina"):"Marina"}catch(_){return"Marina"}}
function yachtName(id){try{return typeof boat==="function"?(boat(id)?.name||"Yacht"):"Yacht"}catch(_){return"Yacht"}}
function level(){
 const s=game()||{},lv=Math.max(1,Math.floor(Number(s.level)||1)),xp=Math.max(0,Number(s.xp)||0),need=Math.max(1000,lv*3500);
 return {lv,pct:Math.max(5,Math.min(100,Math.round((xp%need)/need*100)))}
}
function active(){
 const el=document.getElementById("missions");
 if(!el||width()>899)return false;
 return !el.classList.contains("hide")&&getComputedStyle(el).display!=="none";
}
function go(id){try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function service(id){
 const b=document.getElementById(id==="fuel"?"meHudRefuel":"meHudMaintenance");
 if(b)b.click();
}
function navButton(id,icon,label,num,on){
 return '<button type="button" '+(on?'class="on"':'data-mm3-go="'+id+'"')+'><b>'+icon+'</b>'+label+'<small>'+num+'/12</small></button>';
}
function cardState(){
 const cards=[...document.querySelectorAll("#missionList>.item")];
 cards.forEach(card=>{
   const btn=card.querySelector("[data-mission]");
   const text=(card.textContent||"").toUpperCase();
   const isActive=/VIAGGIO IN CORSO|IN CORSO/.test(text);
   const state=isActive?"active":btn&&!btn.disabled?"ready":"locked";
   card.dataset.mm3State=state;
   card.dataset.mm3Label=isActive?"IN CORSO":state==="ready"?"PRONTA":"DA SBLOCCARE";
 });
 return {
   total:cards.length,
   ready:cards.filter(c=>c.dataset.mm3State==="ready"&&!c.classList.contains("hide")).length,
   locked:cards.filter(c=>c.dataset.mm3State==="locked"&&!c.classList.contains("hide")).length
 };
}
function applyVisualTab(mode){
 const cards=[...document.querySelectorAll("#missionList>.item")];
 const select=document.getElementById("meMissionFilter");
 if(mode==="ready"){
   if(select){select.value="ready";select.dispatchEvent(new Event("change",{bubbles:true}))}
 }else if(mode==="all"){
   if(select){select.value="all";select.dispatchEvent(new Event("change",{bubbles:true}))}
 }else if(mode==="active"){
   if(select){select.value="all";select.dispatchEvent(new Event("change",{bubbles:true}))}
   cards.forEach(c=>c.classList.toggle("hide",c.dataset.mm3State!=="active"));
 }
 document.querySelectorAll(".mm3-tabs button").forEach(b=>b.classList.toggle("on",b.dataset.mm3Tab===mode));
}
function ensureChrome(){
 const section=document.getElementById("missions");if(!section)return null;
 section.classList.add("me-missions3-ready");
 let top=document.getElementById("meMissionsPremiumTop");
 if(!top){top=document.createElement("div");top.id="meMissionsPremiumTop";section.prepend(top)}
 let special=document.getElementById("meMissionsSpecial");
 if(!special){special=document.createElement("section");special.id="meMissionsSpecial";special.className="mm3-special";section.appendChild(special)}
 let nav=document.getElementById("meMissionsPremiumNav");
 if(!nav){nav=document.createElement("div");nav.id="meMissionsPremiumNav";nav.className="mm3-bottom-wrap";section.appendChild(nav)}
 return {section,top,special,nav};
}
function render(){
 if(width()>899)return;
 const ui=ensureChrome();if(!ui)return;
 const s=game()||{},l=level(),stats=cardState(),trip=s.trip||null;
 const fuel=Math.max(0,Number(s.fuel)||0),condition=Math.max(0,Math.min(100,Number(s.condition)||100));
 const completed=Array.isArray(s.completed)?s.completed.length:0;

 ui.top.innerHTML=`
  <div class="mm3-topbar">
   <div class="mm3-brand"><b>MARINA EMPIRE</b><small>IL GESTIONALE NAUTICO ONLINE</small></div>
   <div class="mm3-level"><span>★ Livello ${l.lv}</span><div class="mm3-xp"><i style="width:${l.pct}%"></i></div></div>
  </div>

  <div class="mm3-titlebar">
   <div><h2>MISSIONI <span>3/12</span></h2><p>Incarichi, trasporti, servizi e sfide.</p></div>
   <div class="mm3-pagepill">CHARTER DESK</div>
  </div>

  <section class="mm3-hero">
   <span class="mm3-herobadge">${trip?"MISSIONE IN CORSO":"NUOVE OPPORTUNITÀ"}</span>
   <div class="mm3-herocopy"><small>MARINA EMPIRE · MISSION CONTROL</small><strong>${trip?"Rotta verso "+esc(marinaName(trip.dest)):"La prossima missione parte da qui"}</strong><span>${trip?"Segui rotta, consumi e arrivo in tempo reale.":stats.ready+" missioni pronte · "+completed+" completate"}</span></div>
  </section>

  <section class="mm3-stats">
   <div class="gold"><span>LIVELLO</span><b>${l.lv}</b></div>
   <div class="gold"><span>PRESTIGIO</span><b>◆ ${fmt(s.prestige||0)}</b></div>
   <button type="button" data-mm3-service="fuel"><span>CARBURANTE</span><b>⛽ ${fmt(fuel)} L</b></button>
   <button type="button" class="ok" data-mm3-service="maint"><span>USURA / STATO</span><b>${Math.round(100-condition)}% / ${Math.round(condition)}%</b></button>
  </section>

  <section class="mm3-tabs">
   <button type="button" data-mm3-tab="active"><b>◎</b>ATTIVE (${trip?1:0})</button>
   <button type="button" class="on" data-mm3-tab="ready"><b>▣</b>DISPONIBILI (${stats.ready})</button>
   <button type="button" data-mm3-special-jump><b>🏆</b>SPECIALI (1)</button>
  </section>

  <div class="mm3-trip ${trip?"on":""}">
   <div><small>MISSIONE ATTIVA</small><strong>${trip?esc(trip.mission?.name||("Rotta verso "+marinaName(trip.dest))):""}</strong></div>
   <button type="button" data-mm3-go="map">SEGUI ROTTA</button>
  </div>`;

 ui.top.querySelectorAll("[data-mm3-service]").forEach(b=>b.onclick=()=>service(b.dataset.mm3Service));
 ui.top.querySelectorAll("[data-mm3-go]").forEach(b=>b.onclick=()=>go(b.dataset.mm3Go));
 ui.top.querySelectorAll("[data-mm3-tab]").forEach(b=>b.onclick=()=>applyVisualTab(b.dataset.mm3Tab));
 ui.top.querySelector("[data-mm3-special-jump]")?.addEventListener("click",()=>ui.special.scrollIntoView({behavior:"smooth",block:"center"}));

 ui.special.innerHTML='<div class="mm3-specialcopy"><small>🏆 MISSIONE SPECIALE</small><strong>Rotte d’Italia</strong><span>Completa le missioni disponibili e sblocca nuove destinazioni lungo la costa italiana.</span><button type="button" data-mm3-go="map">SCOPRI LE ROTTE ›</button></div>';
 ui.special.querySelector("[data-mm3-go]")?.addEventListener("click",()=>go("map"));

 ui.nav.innerHTML='<nav class="mm3-bottom" aria-label="Pagine Marina Empire">'+
  navButton("home","⌂","Home",1,false)+
  navButton("marinas","⚓","Marina Live",2,false)+
  navButton("","◎","Missioni",3,true)+
  navButton("fleet","🛥","Flotta",4,false)+
  navButton("office","🏛","La tua Marina",5,false)+
  navButton("map","🗺","Mappa",6,false)+
  navButton("refit","🏗","Cantiere & Refit",7,false)+
  navButton("crew","👥","Equipaggio",8,false)+
  navButton("charter","📄","Contratti & Charter",9,false)+
  navButton("marketplace","🛒","Marketplace",10,false)+
  navButton("community","💬","Community",11,false)+
  navButton("profile","👤","Profilo",12,false)+
 '</nav>';
 ui.nav.querySelectorAll("[data-mm3-go]").forEach(b=>b.onclick=()=>go(b.dataset.mm3Go));
}
function sync(){
 const on=active();
 document.body.classList.toggle("me-missions3-active",on);
 if(on)render();
}
function boot(){
 if(width()>899)return;
 sync();
 const section=document.getElementById("missions");
 if(section)new MutationObserver(()=>setTimeout(sync,30)).observe(section,{attributes:true,attributeFilter:["class","style"]});
 const list=document.getElementById("missionList");
 if(list)new MutationObserver(()=>setTimeout(()=>{if(active())cardState()},50)).observe(list,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled","class"]});
 document.getElementById("meMissionSearch")?.addEventListener("input",()=>setTimeout(()=>active()&&cardState(),30));
 document.getElementById("meMissionFilter")?.addEventListener("change",()=>setTimeout(()=>active()&&cardState(),30));
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>active()&&render(),80));
 window.addEventListener("resize",sync);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();