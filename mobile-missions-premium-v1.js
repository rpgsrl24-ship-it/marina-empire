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
   display:block!important;position:fixed!important;inset:0!important;z-index:91000!important;
   overflow-y:auto!important;overflow-x:hidden!important;padding:8px 8px 96px!important;
   background:radial-gradient(circle at 50% -12%,rgba(32,91,113,.52),transparent 34%),linear-gradient(180deg,#041d2d,#062a3d 48%,#031824)!important;
   overscroll-behavior:contain!important
 }
 #missions.me-missions3-ready>.me-lux-page-head{display:none!important}
 #missions.me-missions3-ready>.panel{margin:0 0 9px!important;border:1px solid rgba(192,153,86,.55)!important;border-radius:14px!important;background:linear-gradient(145deg,#0d354a,#071f31)!important;box-shadow:0 7px 20px #0004!important}
 #missions.me-missions3-ready>#firstVoyageGuide{padding:10px 11px!important}
 #missions.me-missions3-ready>#firstVoyageGuide h2{margin:0 0 5px!important;color:#f3d48e!important;font-size:12px!important}
 #missions.me-missions3-ready>#firstVoyageGuide p{display:none!important}
 #missions.me-missions3-ready>#firstVoyageGuide #firstVoyageLaunch{width:100%!important;min-height:40px!important;margin-top:4px!important;font-size:9px!important}
 #missions.me-missions3-ready>.panel:not(#firstVoyageGuide){padding:10px!important}
 #missions.me-missions3-ready>.panel:not(#firstVoyageGuide)>h2,
 #missions.me-missions3-ready>.panel:not(#firstVoyageGuide)>p.muted{display:none!important}

 #meMissionsPremiumTop{display:flex!important;flex-direction:column;gap:9px;margin-bottom:9px;color:#f7f2e7}
 .mm3-brand{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 4px 0;color:#efd18e}
 .mm3-brandmark{min-width:0}.mm3-brandmark b{display:block;font:800 21px Georgia,serif;letter-spacing:.08em;white-space:nowrap}.mm3-brandmark small{display:block;color:#91a9b4;font-size:7px;font-weight:900;letter-spacing:.13em}
 .mm3-level{min-width:112px;text-align:right}.mm3-level span{display:block;color:#f3d690;font-size:9px;font-weight:950}.mm3-xp{height:6px;margin-top:5px;border-radius:99px;background:#163b4d;overflow:hidden}.mm3-xp i{display:block;height:100%;background:linear-gradient(90deg,#ffd760,#b88a3c)}
 .mm3-hud{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.mm3-hud>button,.mm3-hud>div{min-width:0;min-height:54px;padding:7px 4px;border:1px solid rgba(229,185,102,.66);border-radius:11px;background:linear-gradient(145deg,#16536d,#092f47);color:#fff;text-align:center;box-shadow:inset 0 1px #ffffff15,0 4px 14px #0004}.mm3-hud span{display:block;color:#a9bdc5;font-size:7px;font-weight:900;white-space:nowrap}.mm3-hud b{display:block;margin-top:3px;color:#ffd76e;font-size:12px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mm3-hud .ok b{color:#64e28e}
 .mm3-pagehead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 4px}.mm3-title{min-width:0}.mm3-title h2{margin:0;color:#f8f5ee;font:900 25px/1 Georgia,serif}.mm3-title h2 span{color:#e5bd6e;font:800 13px system-ui}.mm3-title p{margin:5px 0 0;color:#b6c8ce;font-size:9px}.mm3-pagepill{flex:0 0 auto;padding:6px 8px;border:1px solid #7597a4;border-radius:999px;background:#092b3e;color:#dfecee;font-size:8px;font-weight:900}
 .mm3-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));overflow:hidden;border:1px solid #6d93a3;border-radius:13px;background:linear-gradient(145deg,#123f56,#08283b);box-shadow:0 7px 18px #0005}.mm3-summary>div{min-width:0;padding:9px 4px;text-align:center;border-right:1px solid #ffffff18}.mm3-summary>div:last-child{border-right:0}.mm3-summary span{display:block;color:#a8bdc6;font-size:6.4px;font-weight:900;white-space:nowrap}.mm3-summary b{display:block;margin-top:3px;color:#fff;font-size:10px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mm3-summary .live b{color:#69e596}
 .mm3-hero{position:relative;height:178px;overflow:hidden;border:1px solid #d7ac62;border-radius:16px;background:#10364b;box-shadow:0 10px 28px #0007;isolation:isolate}.mm3-hero:before{content:"";position:absolute;inset:0;background:url("./anteprima/assets/render-2026/charter.jpg") center 48%/cover no-repeat;filter:brightness(1.28) saturate(1.2);transform:scale(1.02)}.mm3-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#031b29cc 0%,#05263854 56%,#03182499 100%)}.mm3-herocopy{position:absolute;z-index:2;left:12px;right:12px;bottom:11px}.mm3-herocopy small{display:block;color:#76e0a1;font-size:7px;font-weight:950;letter-spacing:.12em}.mm3-herocopy strong{display:block;max-width:78%;margin-top:4px;color:#fff3d1;font:900 19px/1.05 Georgia,serif}.mm3-herocopy span{display:block;margin-top:5px;color:#d2e0e4;font-size:8px}.mm3-herobadge{position:absolute;z-index:2;right:9px;top:9px;padding:5px 8px;border:1px solid #d6b46a;border-radius:999px;background:#032636db;color:#f5d792;font-size:7px;font-weight:950}

 #missions.me-missions3-ready .me-mission-search{display:grid!important;grid-template-columns:minmax(0,1fr) 126px!important;gap:7px!important;margin:0 0 8px!important}
 #missions.me-missions3-ready #meMissionSearch,
 #missions.me-missions3-ready #meMissionFilter{width:100%!important;min-width:0!important;min-height:42px!important;padding:8px 9px!important;border:1px solid #678694!important;border-radius:10px!important;background:#092b3e!important;color:#eaf2f3!important;font-size:9px!important}
 #missions.me-missions3-ready #meMissionCount{margin:2px 2px 8px!important;color:#9fb5bd!important;font-size:8px!important}
 #missions.me-missions3-ready #missionList{display:grid!important;gap:8px!important}
 #missions.me-missions3-ready #missionList>.item{
   position:relative!important;overflow:hidden!important;margin:0!important;padding:13px 10px 10px!important;
   border:1px solid rgba(193,157,94,.6)!important;border-radius:13px!important;background:linear-gradient(145deg,#103a50,#08283b)!important;
   box-shadow:0 6px 18px #0004!important
 }
 #missions.me-missions3-ready #missionList>.item:before{
   content:attr(data-mm3-label);position:absolute;top:8px;right:8px;padding:3px 6px;border-radius:999px;
   background:#0a4a3a;color:#7ef0ae;font-size:6.5px;font-weight:950;letter-spacing:.06em
 }
 #missions.me-missions3-ready #missionList>.item[data-mm3-state="locked"]:before{background:#47351c;color:#f0c66f}
 #missions.me-missions3-ready #missionList>.item[data-mm3-state="active"]:before{background:#174760;color:#72dbff}
 #missions.me-missions3-ready #missionList>.item>b,
 #missions.me-missions3-ready #missionList>.item>strong{display:block!important;padding-right:76px!important;color:#fff4d0!important;font-size:13px!important;line-height:1.18!important}
 #missions.me-missions3-ready #missionList>.item p{margin:6px 0 0!important;color:#b9cbd1!important;font-size:8.5px!important;line-height:1.35!important}
 #missions.me-missions3-ready #missionList>.item p:nth-of-type(n+5){display:none!important}
 #missions.me-missions3-ready #missionList>.item button{
   width:100%!important;min-height:43px!important;margin-top:9px!important;padding:8px 10px!important;
   border:1px solid #e5bf69!important;border-radius:9px!important;background:linear-gradient(135deg,#e8c46f,#b98132)!important;color:#102532!important;
   font-size:9px!important;font-weight:950!important
 }
 #missions.me-missions3-ready #missionList>.item button:disabled{border-color:#536774!important;background:#173746!important;color:#8298a1!important;opacity:1!important}
 #missions.me-missions3-ready .hide{display:none!important}

 .mm3-trip{display:none;border:1px solid #6aa9c1;border-radius:12px;background:#082f43;padding:10px}.mm3-trip.on{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}.mm3-trip small{display:block;color:#85a8b7;font-size:7px;font-weight:900}.mm3-trip strong{display:block;margin-top:3px;color:#eaf4f5;font-size:11px}.mm3-trip button{min-height:38px!important;padding:6px 9px!important;font-size:8px!important}
 .mm3-bottom{position:fixed;z-index:92000;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));padding:5px max(5px,env(safe-area-inset-left)) calc(5px + env(safe-area-inset-bottom));border-top:1px solid #caa35d75;background:#041827f2;backdrop-filter:blur(14px);box-shadow:0 -7px 22px #0008}.mm3-bottom button{min-width:0!important;min-height:58px!important;padding:5px 2px!important;border:0!important;border-right:1px solid #ffffff10!important;border-radius:0!important;background:transparent!important;color:#dbe7ea!important;font-size:7px!important;font-weight:900!important;box-shadow:none!important}.mm3-bottom button:last-child{border-right:0!important}.mm3-bottom b{display:block;margin-bottom:3px;font-size:19px}.mm3-bottom button.on{border:1px solid #f0c75f!important;border-radius:10px!important;background:linear-gradient(145deg,#7b5b19,#173d4c)!important;color:#ffd96d!important;box-shadow:0 0 14px #e6b94e55!important}
 .mm3-more{display:none;position:fixed;z-index:91999;left:8px;right:8px;bottom:70px;padding:8px;border:1px solid #cba55e88;border-radius:13px;background:#061e2dec;backdrop-filter:blur(14px);box-shadow:0 14px 35px #000a;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.mm3-more.open{display:grid}.mm3-more button{min-height:42px!important;padding:7px!important;font-size:8px!important}

 body.me-missions3-active #meFuelPanel,body.me-missions3-active #meMaintenancePanel{display:none;position:fixed;z-index:93000;left:8px;right:8px;top:auto;bottom:76px;width:auto;max-height:70vh;overflow:auto;padding:12px;border:1px solid #d6ae64;border-radius:15px;background:#051d2bec;box-shadow:0 18px 50px #000c;backdrop-filter:blur(14px)}
 body.me-missions3-active #meFuelPanel.open,body.me-missions3-active #meMaintenancePanel.open{display:block}
 @media(max-width:390px){.mm3-hero{height:160px}.mm3-title h2{font-size:22px}.mm3-summary span{font-size:5.9px}.mm3-summary b{font-size:9px}}
}
@media(min-width:900px){#meMissionsPremiumTop,#meMissionsPremiumNav,#meMissionsPremiumMore{display:none!important}}
`;
document.head.appendChild(style);

function width(){return Number(globalThis.innerWidth)||1024}
function game(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function fmt(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function esc(v){return String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function marinaName(id){try{return typeof port==="function"?(port(id)?.name||"Marina"):"Marina"}catch(_){return"Marina"}}
function yachtName(id){try{return typeof boat==="function"?(boat(id)?.name||"Yacht"):"Yacht"}catch(_){return"Yacht"}}
function active(){
 const el=document.getElementById("missions");
 if(!el||width()>899)return false;
 return !el.classList.contains("hide")&&getComputedStyle(el).display!=="none";
}
function level(){
 const s=game()||{},lv=Math.max(1,Math.floor(Number(s.level)||1)),xp=Math.max(0,Number(s.xp)||0),need=Math.max(1000,lv*3500);
 return {lv,pct:Math.max(5,Math.min(100,Math.round((xp%need)/need*100)))}
}
function clearMobileSheet(){
 document.querySelectorAll(".screen.me-mobile-home-sheet").forEach(el=>el.classList.remove("me-mobile-home-sheet"));
 document.body.classList.remove("me-mobile-home-sheet-open");
}
function go(id){
 clearMobileSheet();
 document.getElementById("meMissionsPremiumMore")?.classList.remove("open");
 try{if(typeof showTab==="function")showTab(id)}catch(_){}
}
function service(id){
 const b=document.getElementById(id==="fuel"?"meHudRefuel":"meHudMaintenance");
 if(b)b.click();
}
function cardState(){
 const cards=[...document.querySelectorAll("#missionList>.item")];
 cards.forEach(card=>{
   const btn=card.querySelector("[data-mission]");
   const text=(card.textContent||"").toUpperCase();
   const isActive=/VIAGGIO IN CORSO|IN CORSO/.test(text);
   const state=isActive?"active":btn&&!btn.disabled?"ready":"locked";
   card.dataset.mm3State=state;
   card.dataset.mm3Label=isActive?"IN CORSO":state==="ready"?"DISPONIBILE":"BLOCCATA";
 });
 return {
   total:cards.length,
   ready:cards.filter(c=>c.dataset.mm3State==="ready"&&!c.classList.contains("hide")).length,
   visible:cards.filter(c=>!c.classList.contains("hide")).length
 };
}
function ensureChrome(){
 const section=document.getElementById("missions");if(!section)return null;
 section.classList.add("me-missions3-ready");
 let top=document.getElementById("meMissionsPremiumTop");
 if(!top){top=document.createElement("div");top.id="meMissionsPremiumTop";section.prepend(top)}
 let nav=document.getElementById("meMissionsPremiumNav");
 if(!nav){nav=document.createElement("nav");nav.id="meMissionsPremiumNav";nav.className="mm3-bottom";section.appendChild(nav)}
 let more=document.getElementById("meMissionsPremiumMore");
 if(!more){more=document.createElement("div");more.id="meMissionsPremiumMore";more.className="mm3-more";section.appendChild(more)}
 return {section,top,nav,more};
}
function render(){
 if(width()>899)return;
 const ui=ensureChrome();if(!ui)return;
 const s=game()||{},l=level(),stats=cardState();
 const fuel=Math.max(0,Number(s.fuel)||0),condition=Math.max(0,Math.min(100,Number(s.condition)||100));
 const completed=Array.isArray(s.completed)?s.completed.length:0;
 const trip=s.trip||null;
 ui.top.innerHTML=`
  <div class="mm3-brand"><div class="mm3-brandmark"><b>MARINA EMPIRE</b><small>THE YACHT MANAGEMENT GAME</small></div><div class="mm3-level"><span>★ Livello ${l.lv}</span><div class="mm3-xp"><i style="width:${l.pct}%"></i></div></div></div>
  <div class="mm3-hud"><div><span>MONETE</span><b>🪙 ${fmt(s.coins||0)}</b></div><div><span>PRESTIGIO</span><b>◆ ${fmt(s.prestige||0)}</b></div><button type="button" data-mm3-service="fuel"><span>CARBURANTE</span><b>⛽ ${fmt(fuel)} L</b></button><button type="button" class="ok" data-mm3-service="maint"><span>STATO</span><b>● ${Math.round(condition)}%</b></button></div>
  <div class="mm3-pagehead"><div class="mm3-title"><h2>MISSIONI <span>(3/12)</span></h2><p>Scegli l'incarico, prepara lo yacht e salpa.</p></div><div class="mm3-pagepill">Pagina 3 di 12</div></div>
  <div class="mm3-summary"><div class="live"><span>DISPONIBILI</span><b>● ${stats.ready}</b></div><div><span>COMPLETATE</span><b>${completed}</b></div><div><span>MARINA</span><b>${esc(marinaName(s.port||"rimini"))}</b></div><div><span>YACHT</span><b>${esc(yachtName(s.boat))}</b></div></div>
  <section class="mm3-hero"><span class="mm3-herobadge">${trip?"VIAGGIO ATTIVO":"CONTRATTI APERTI"}</span><div class="mm3-herocopy"><small>MARINA EMPIRE · CHARTER DESK</small><strong>${trip?"Rotta verso "+esc(marinaName(trip.dest)):"La prossima missione parte da qui"}</strong><span>${trip?"Segui navigazione e arrivo in tempo reale.":stats.ready+" missioni pronte · "+stats.total+" opportunità caricate"}</span></div></section>
  <div class="mm3-trip ${trip?"on":""}"><div><small>MISSIONE IN CORSO</small><strong>${trip?esc(trip.mission?.name||("Rotta verso "+marinaName(trip.dest))):""}</strong></div><button type="button" data-mm3-go="map">SEGUI ROTTA</button></div>`;
 ui.top.querySelectorAll("[data-mm3-service]").forEach(b=>b.onclick=()=>service(b.dataset.mm3Service));
 ui.top.querySelectorAll("[data-mm3-go]").forEach(b=>b.onclick=()=>go(b.dataset.mm3Go));

 ui.nav.innerHTML='<button type="button" data-mm3-go="home"><b>⌂</b>Home<br>1/12</button><button type="button" data-mm3-go="marinas"><b>📡</b>Marina Live<br>2/12</button><button type="button" class="on"><b>◎</b>Missioni<br>3/12</button><button type="button" data-mm3-go="fleet"><b>🛥</b>Flotta<br>4/12</button><button type="button" data-mm3-more><b>•••</b>Altro</button>';
 ui.more.innerHTML='<button data-mm3-go="marinas">La tua Marina · 5/12</button><button data-mm3-go="map">Mappa · 6/12</button><button data-mm3-go="refit">Cantiere & Refit · 7/12</button><button data-mm3-go="crew">Equipaggio · 8/12</button><button data-mm3-go="charter">Contratti & Charter · 9/12</button><button data-mm3-go="marketplace">Marketplace · 10/12</button><button data-mm3-go="community">Comunità · 11/12</button><button data-mm3-go="profile">Profilo / Statistiche · 12/12</button>';
 ui.nav.querySelectorAll("[data-mm3-go]").forEach(b=>b.onclick=()=>go(b.dataset.mm3Go));
 ui.more.querySelectorAll("[data-mm3-go]").forEach(b=>b.onclick=()=>go(b.dataset.mm3Go));
 ui.nav.querySelector("[data-mm3-more]")?.addEventListener("click",()=>ui.more.classList.toggle("open"));
}
function sync(){
 const on=active();
 document.body.classList.toggle("me-missions3-active",on);
 if(on)render();
}
function boot(){
 if(width()>899)return;
 render();sync();
 const section=document.getElementById("missions");
 if(section)new MutationObserver(()=>setTimeout(sync,25)).observe(section,{attributes:true,attributeFilter:["class","style"]});
 const list=document.getElementById("missionList");
 if(list)new MutationObserver(()=>setTimeout(()=>{if(active())render()},40)).observe(list,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled","class"]});
 document.getElementById("meMissionSearch")?.addEventListener("input",()=>setTimeout(()=>active()&&render(),20));
 document.getElementById("meMissionFilter")?.addEventListener("change",()=>setTimeout(()=>active()&&render(),20));
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>active()&&render(),70));
 window.addEventListener("resize",sync);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();