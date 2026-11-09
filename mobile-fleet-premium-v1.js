(()=>{
"use strict";
if(window.__ME_MOBILE_FLEET_PREMIUM_V1__)return;
window.__ME_MOBILE_FLEET_PREMIUM_V1__=true;

const style=document.createElement("style");
style.id="me-mobile-fleet-premium-v1-style";
style.textContent=`
@media(max-width:899px){
 body.me-fleet4-active{background:#031725!important}
 body.me-fleet4-active #meMobileSheetBar,
 body.me-fleet4-active .mobile-game-nav,
 body.me-fleet4-active #meMobileMore,
 body.me-fleet4-active .top,
 body.me-fleet4-active .stats,
 body.me-fleet4-active #meCompactHud,
 body.me-fleet4-active>.nav,
 body.me-fleet4-active .shell>.nav{display:none!important}
 #fleet.me-fleet4-ready{
   position:fixed!important;inset:0!important;z-index:91500!important;overflow-y:auto!important;overflow-x:hidden!important;
   padding:8px 8px 96px!important;background:radial-gradient(circle at 50% -12%,rgba(34,91,111,.52),transparent 34%),linear-gradient(180deg,#041d2d,#062a3d 48%,#031824)!important;
   overscroll-behavior:contain!important
 }
 #fleet.me-fleet4-ready.hide{display:none!important}
 #fleet.me-fleet4-ready:not(.hide){display:block!important}
 #fleet.me-fleet4-ready>.me-lux-page-head{display:none!important}
 #fleet.me-fleet4-ready>.panel{margin:0!important;padding:10px!important;border:1px solid rgba(192,153,86,.55)!important;border-radius:14px!important;background:linear-gradient(145deg,#0d354a,#071f31)!important;box-shadow:0 7px 20px #0004!important}
 #fleet.me-fleet4-ready .me-fleet-banner,
 #fleet.me-fleet4-ready .me-fleet-section-title,
 #fleet.me-fleet4-ready .fleet-command-strip,
 #fleet.me-fleet4-ready .me-secondary-details,
 #fleet.me-fleet4-ready .me-fleet-footer{display:none!important}
 #meFleetPremiumTop{display:flex!important;flex-direction:column;gap:9px;margin-bottom:9px;color:#f7f2e7}
 .mf4-brand{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 4px 0;color:#efd18e}
 .mf4-brandmark{min-width:0}.mf4-brandmark b{display:block;font:800 21px Georgia,serif;letter-spacing:.08em;white-space:nowrap}.mf4-brandmark small{display:block;color:#91a9b4;font-size:7px;font-weight:900;letter-spacing:.13em}
 .mf4-level{min-width:112px;text-align:right}.mf4-level span{display:block;color:#f3d690;font-size:9px;font-weight:950}.mf4-xp{height:6px;margin-top:5px;border-radius:99px;background:#163b4d;overflow:hidden}.mf4-xp i{display:block;height:100%;background:linear-gradient(90deg,#ffd760,#b88a3c)}
 .mf4-hud{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.mf4-hud>button,.mf4-hud>div{min-width:0;min-height:54px;padding:7px 4px;border:1px solid rgba(229,185,102,.66);border-radius:11px;background:linear-gradient(145deg,#16536d,#092f47);color:#fff;text-align:center;box-shadow:inset 0 1px #ffffff15,0 4px 14px #0004}.mf4-hud span{display:block;color:#a9bdc5;font-size:7px;font-weight:900;white-space:nowrap}.mf4-hud b{display:block;margin-top:3px;color:#ffd76e;font-size:12px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mf4-hud .ok b{color:#64e28e}
 .mf4-pagehead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 4px}.mf4-title{min-width:0}.mf4-title h2{margin:0;color:#f8f5ee;font:900 25px/1 Georgia,serif}.mf4-title h2 span{color:#e5bd6e;font:800 13px system-ui}.mf4-title p{margin:5px 0 0;color:#b6c8ce;font-size:9px}.mf4-pagepill{flex:0 0 auto;padding:6px 8px;border:1px solid #7597a4;border-radius:999px;background:#092b3e;color:#dfecee;font-size:8px;font-weight:900}
 .mf4-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));overflow:hidden;border:1px solid #6d93a3;border-radius:13px;background:linear-gradient(145deg,#123f56,#08283b);box-shadow:0 7px 18px #0005}.mf4-summary>div{min-width:0;padding:9px 4px;text-align:center;border-right:1px solid #ffffff18}.mf4-summary>div:last-child{border-right:0}.mf4-summary span{display:block;color:#a8bdc6;font-size:6.2px;font-weight:900;white-space:nowrap}.mf4-summary b{display:block;margin-top:3px;color:#fff;font-size:10px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mf4-summary .live b{color:#69e596}
 .mf4-hero{position:relative;height:180px;overflow:hidden;border:1px solid #d7ac62;border-radius:16px;background:#10364b;box-shadow:0 10px 28px #0007;isolation:isolate}.mf4-hero:before{content:"";position:absolute;inset:0;background:url("./anteprima/assets/render-2026/flotta.jpg") center 55%/cover no-repeat;filter:brightness(1.32) saturate(1.2);transform:scale(1.02)}.mf4-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#031b29ca 0%,#0526384a 58%,#0318249a 100%)}.mf4-herocopy{position:absolute;z-index:2;left:12px;right:12px;bottom:11px}.mf4-herocopy small{display:block;color:#78e1a4;font-size:7px;font-weight:950;letter-spacing:.12em}.mf4-herocopy strong{display:block;max-width:80%;margin-top:4px;color:#fff3d1;font:900 19px/1.05 Georgia,serif}.mf4-herocopy span{display:block;margin-top:5px;color:#d2e0e4;font-size:8px}.mf4-herobadge{position:absolute;z-index:2;right:9px;top:9px;padding:5px 8px;border:1px solid #d6b46a;border-radius:999px;background:#032636db;color:#f5d792;font-size:7px;font-weight:950}
 #fleet.me-fleet4-ready #fleetList{display:grid!important;gap:9px!important}
 #fleet.me-fleet4-ready #fleetList .yacht-card{margin:0!important;border:1px solid rgba(195,158,91,.65)!important;border-radius:14px!important;background:linear-gradient(145deg,#103a50,#08283b)!important;box-shadow:0 7px 18px #0004!important;overflow:hidden!important}
 #fleet.me-fleet4-ready #fleetList .yacht-card.is-selected{border-color:#f1ca73!important;box-shadow:0 0 0 1px #f1ca7330,0 8px 24px #0005!important}
 #fleet.me-fleet4-ready .yacht-visual{height:145px!important;background-position:center 52%!important}
 #fleet.me-fleet4-ready .yacht-visual small{top:8px!important;left:8px!important;padding:4px 7px!important;font-size:7px!important;border-radius:999px!important}
 #fleet.me-fleet4-ready .yacht-detail{padding:10px!important}
 #fleet.me-fleet4-ready .yacht-detail>b{font-size:15px!important;line-height:1.1!important;color:#fff1c6!important}
 #fleet.me-fleet4-ready .yacht-specs{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:5px!important;margin-top:8px!important}
 #fleet.me-fleet4-ready .yacht-specs span{min-width:0!important;padding:5px 3px!important;border:1px solid #ffffff14!important;border-radius:8px!important;background:#0a3042!important;color:#d4e4e8!important;font-size:7px!important;text-align:center!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 #fleet.me-fleet4-ready .yacht-detail p{margin:7px 0!important;color:#b8cbd1!important;font-size:8.5px!important;line-height:1.35!important}
 #fleet.me-fleet4-ready .yacht-detail p:nth-of-type(n+3){display:none!important}
 #fleet.me-fleet4-ready .yacht-detail button{width:100%!important;min-height:43px!important;margin-top:8px!important;border:1px solid #e3bd67!important;border-radius:9px!important;background:linear-gradient(135deg,#e8c46f,#b98132)!important;color:#102532!important;font-size:9px!important;font-weight:950!important}
 #fleet.me-fleet4-ready .yacht-detail button:disabled{border-color:#55707d!important;background:#173746!important;color:#95aab2!important;opacity:1!important}
 .mf4-bottom{position:fixed;z-index:92500;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));padding:5px max(5px,env(safe-area-inset-left)) calc(5px + env(safe-area-inset-bottom));border-top:1px solid #caa35d75;background:#041827f2;backdrop-filter:blur(14px);box-shadow:0 -7px 22px #0008}.mf4-bottom button{min-width:0!important;min-height:58px!important;padding:5px 2px!important;border:0!important;border-right:1px solid #ffffff10!important;border-radius:0!important;background:transparent!important;color:#dbe7ea!important;font-size:7px!important;font-weight:900!important;box-shadow:none!important}.mf4-bottom button:last-child{border-right:0!important}.mf4-bottom b{display:block;margin-bottom:3px;font-size:19px}.mf4-bottom button.on{border:1px solid #f0c75f!important;border-radius:10px!important;background:linear-gradient(145deg,#7b5b19,#173d4c)!important;color:#ffd96d!important;box-shadow:0 0 14px #e6b94e55!important}
 .mf4-more{display:none;position:fixed;z-index:92499;left:8px;right:8px;bottom:70px;padding:8px;border:1px solid #cba55e88;border-radius:13px;background:#061e2dec;backdrop-filter:blur(14px);box-shadow:0 14px 35px #000a;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.mf4-more.open{display:grid}.mf4-more button{min-height:42px!important;padding:7px!important;font-size:8px!important}
}
@media(min-width:900px){#meFleetPremiumTop,#meFleetPremiumNav,#meFleetPremiumMore{display:none!important}}
`;
document.head.appendChild(style);

function width(){return Number(globalThis.innerWidth)||1024}
function game(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function fmt(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function esc(v){return String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function marinaName(id){try{return typeof port==="function"?(port(id)?.name||"Marina"):"Marina"}catch(_){return"Marina"}}
function yachtName(id){try{return typeof boat==="function"?(boat(id)?.name||"Yacht"):"Yacht"}catch(_){return"Yacht"}}
function level(){const s=game()||{},lv=Math.max(1,Math.floor(Number(s.level)||1)),xp=Math.max(0,Number(s.xp)||0),need=Math.max(1000,lv*3500);return {lv,pct:Math.max(5,Math.min(100,Math.round((xp%need)/need*100)))}}
function active(){const el=document.getElementById("fleet");if(!el||width()>899)return false;return !el.classList.contains("hide")&&getComputedStyle(el).display!=="none"}
function go(id){document.getElementById("meFleetPremiumMore")?.classList.remove("open");try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function ensure(){
 const section=document.getElementById("fleet");if(!section)return null;section.classList.add("me-fleet4-ready");
 let top=document.getElementById("meFleetPremiumTop");if(!top){top=document.createElement("div");top.id="meFleetPremiumTop";section.prepend(top)}
 let nav=document.getElementById("meFleetPremiumNav");if(!nav){nav=document.createElement("nav");nav.id="meFleetPremiumNav";nav.className="mf4-bottom";section.appendChild(nav)}
 let more=document.getElementById("meFleetPremiumMore");if(!more){more=document.createElement("div");more.id="meFleetPremiumMore";more.className="mf4-more";section.appendChild(more)}
 return {top,nav,more};
}
function render(){
 if(width()>899)return;const ui=ensure();if(!ui)return;const s=game()||{},l=level();const owned=Array.isArray(s.owned)?s.owned.length:0;const fuel=Math.max(0,Number(s.fuel)||0),condition=Math.max(0,Math.min(100,Number(s.condition)||100));
 ui.top.innerHTML=`
 <div class="mf4-brand"><div class="mf4-brandmark"><b>MARINA EMPIRE</b><small>THE YACHT MANAGEMENT GAME</small></div><div class="mf4-level"><span>★ Livello ${l.lv}</span><div class="mf4-xp"><i style="width:${l.pct}%"></i></div></div></div>
 <div class="mf4-hud"><div><span>MONETE</span><b>🪙 ${fmt(s.coins||0)}</b></div><div><span>PRESTIGIO</span><b>◆ ${fmt(s.prestige||0)}</b></div><div><span>CARBURANTE</span><b>⛽ ${fmt(fuel)} L</b></div><div class="ok"><span>STATO</span><b>● ${Math.round(condition)}%</b></div></div>
 <div class="mf4-pagehead"><div class="mf4-title"><h2>FLOTTA <span>(4/12)</span></h2><p>Gestisci yacht, posizione, autonomia e stato.</p></div><div class="mf4-pagepill">Pagina 4 di 12</div></div>
 <div class="mf4-summary"><div class="live"><span>YACHT ATTIVO</span><b>● ${esc(yachtName(s.boat))}</b></div><div><span>FLOTTA</span><b>${owned} unità</b></div><div><span>MARINA</span><b>${esc(marinaName(s.port||"rimini"))}</b></div><div><span>VIAGGIO</span><b>${s.trip?"IN CORSO":"IN PORTO"}</b></div></div>
 <section class="mf4-hero"><span class="mf4-herobadge">${s.trip?"NAVIGAZIONE ATTIVA":"FLOTTA OPERATIVA"}</span><div class="mf4-herocopy"><small>MARINA EMPIRE · FLEET CONTROL</small><strong>${esc(yachtName(s.boat))}</strong><span>${owned} yacht nella tua flotta · ${esc(marinaName(s.port||"rimini"))}</span></div></section>`;
 ui.nav.innerHTML='<button type="button" data-mf4-go="home"><b>⌂</b>Home<br>1/12</button><button type="button" data-mf4-go="marinas"><b>📡</b>Marina Live<br>2/12</button><button type="button" data-mf4-go="missions"><b>◎</b>Missioni<br>3/12</button><button type="button" class="on"><b>🛥</b>Flotta<br>4/12</button><button type="button" data-mf4-more><b>•••</b>Altro</button>';
 ui.more.innerHTML='<button data-mf4-go="marinas">La tua Marina · 5/12</button><button data-mf4-go="map">Mappa · 6/12</button><button data-mf4-go="refit">Cantiere & Refit · 7/12</button><button data-mf4-go="crew">Equipaggio · 8/12</button><button data-mf4-go="charter">Contratti & Charter · 9/12</button><button data-mf4-go="marketplace">Marketplace · 10/12</button><button data-mf4-go="community">Comunità · 11/12</button><button data-mf4-go="profile">Profilo / Statistiche · 12/12</button>';
 ui.nav.querySelectorAll("[data-mf4-go]").forEach(b=>b.onclick=()=>go(b.dataset.mf4Go));ui.more.querySelectorAll("[data-mf4-go]").forEach(b=>b.onclick=()=>go(b.dataset.mf4Go));ui.nav.querySelector("[data-mf4-more]")?.addEventListener("click",()=>ui.more.classList.toggle("open"));
}
function sync(){const on=active();document.body.classList.toggle("me-fleet4-active",on);if(on)render()}
function boot(){if(width()>899)return;sync();const section=document.getElementById("fleet");if(section)new MutationObserver(()=>setTimeout(sync,25)).observe(section,{attributes:true,attributeFilter:["class","style"]});const list=document.getElementById("fleetList");if(list)new MutationObserver(()=>setTimeout(()=>active()&&render(),40)).observe(list,{childList:true,subtree:true,attributes:true});window.addEventListener("marina-empire-updated",()=>setTimeout(()=>active()&&render(),70));window.addEventListener("resize",sync)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();