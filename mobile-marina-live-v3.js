(()=>{
"use strict";
if(window.__ME_MOBILE_MARINA_LIVE_V3__)return;
window.__ME_MOBILE_MARINA_LIVE_V3__=true;

const st=document.createElement("style");
st.id="me-mobile-marina-live-v3-style";
st.textContent=`
@media(max-width:899px){
 body.me-ml3-active{background:#031725!important}
 body.me-ml3-active .top,
 body.me-ml3-active .stats,
 body.me-ml3-active #meCompactHud,
 body.me-ml3-active>.nav,
 body.me-ml3-active .shell>.nav{display:none!important}
 #marinas.me-ml3-ready{margin:0!important;padding:0 0 98px!important;background:linear-gradient(180deg,#041d2d 0%,#062a3d 48%,#031824 100%)!important}
 #marinas.me-ml3-ready> :not(#meMobileMarinaLivePremium){display:none!important}
 #meMobileMarinaLivePremium{display:flex!important;flex-direction:column;gap:9px;width:100%;margin:0;padding:0;color:#f6f3ea}
 .ml3-brand{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 4px 0;color:#efd18e}
 .ml3-brandmark{min-width:0;text-align:left}.ml3-brandmark b{display:block;font:800 21px Georgia,serif;letter-spacing:.08em;white-space:nowrap}.ml3-brandmark small{display:block;color:#91a9b4;font-size:7px;font-weight:900;letter-spacing:.13em}
 .ml3-level{min-width:112px;text-align:right}.ml3-level span{display:block;color:#f3d690;font-size:9px;font-weight:950}.ml3-xp{height:6px;margin-top:5px;border-radius:99px;background:#163b4d;overflow:hidden}.ml3-xp i{display:block;height:100%;background:linear-gradient(90deg,#ffd760,#b88a3c)}
 .ml3-hud{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.ml3-hud>button,.ml3-hud>div{min-width:0;min-height:54px;padding:7px 4px;border:1px solid rgba(229,185,102,.66);border-radius:11px;background:linear-gradient(145deg,#16536d,#092f47);color:#fff;text-align:center;box-shadow:inset 0 1px #ffffff15,0 4px 14px #0004}.ml3-hud span{display:block;color:#a9bdc5;font-size:7px;font-weight:900;white-space:nowrap}.ml3-hud b{display:block;margin-top:3px;color:#ffd76e;font-size:12px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ml3-hud .ok b{color:#64e28e}
 .ml3-pagehead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:5px 4px}.ml3-title{min-width:0}.ml3-title h2{margin:0;color:#f8f5ee;font:900 25px/1 Georgia,serif;letter-spacing:.02em}.ml3-title h2 span{color:#e5bd6e;font:800 13px system-ui}.ml3-title p{margin:5px 0 0;color:#b6c8ce;font-size:9px}.ml3-pagepill{flex:0 0 auto;padding:6px 8px;border:1px solid #7597a4;border-radius:999px;background:#092b3e;color:#dfecee;font-size:8px;font-weight:900}
 .ml3-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;overflow:hidden;border:1px solid #6d93a3;border-radius:13px;background:linear-gradient(145deg,#123f56,#08283b);box-shadow:0 7px 18px #0005}.ml3-summary>div{min-width:0;padding:9px 4px;text-align:center;border-right:1px solid #ffffff18}.ml3-summary>div:last-child{border-right:0}.ml3-summary span{display:block;color:#a8bdc6;font-size:6.5px;font-weight:900;white-space:nowrap}.ml3-summary b{display:block;margin-top:3px;color:#fff;font-size:11px;font-weight:950;white-space:nowrap}.ml3-summary .live b{color:#68e597}
 .ml3-hero{position:relative;height:245px;overflow:hidden;border:1px solid #d7ac62;border-radius:16px;background:#0b536c;box-shadow:0 10px 28px #0007;isolation:isolate}.ml3-hero:before{content:"";position:absolute;inset:0;z-index:0;background:url("./anteprima/assets/render-2026/marine.jpg") center 55%/cover no-repeat;filter:brightness(1.55) saturate(1.42) contrast(1.03);transform:scale(1.025)}.ml3-hero:after{content:"";position:absolute;z-index:1;inset:50% 0 0;background:linear-gradient(180deg,transparent,#031824aa),repeating-radial-gradient(ellipse at 50% 0,transparent 0 17px,#e4fbff18 19px,transparent 22px,transparent 44px);animation:ml3Water 8s linear infinite;pointer-events:none}@keyframes ml3Water{from{transform:translateX(-2%)}to{transform:translateX(2%)}}
 .ml3-herotop{position:absolute;z-index:3;left:9px;right:9px;top:9px;display:flex;justify-content:space-between;align-items:center;gap:6px}.ml3-livebadge,.ml3-marina{padding:6px 9px;border-radius:999px;background:#032636e8;font-size:8px;font-weight:950}.ml3-livebadge{border:1px solid #65e0a0;color:#e3fff0}.ml3-livebadge i{display:inline-block;width:7px;height:7px;margin-right:5px;border-radius:50%;background:#62e69b;box-shadow:0 0 8px #62e69b}.ml3-marina{max-width:55%;border:1px solid #d2ad676d;color:#f3d69a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .ml3-herobottom{position:absolute;z-index:3;left:9px;right:9px;bottom:9px;display:flex;justify-content:space-between;align-items:end;gap:8px}.ml3-herobottom strong{display:inline-block;padding:7px 9px;border-radius:10px;background:#031f2edf;border:1px solid #86a7b45a;color:#fff3d1;font-size:9px}.ml3-cam{width:38px!important;min-width:38px!important;min-height:38px!important;padding:0!important;border-radius:10px!important;background:#082b3ee8!important}
 .ml3-card{overflow:hidden;border:1px solid rgba(199,159,91,.65);border-radius:14px;background:linear-gradient(145deg,#0d354a,#071f31);box-shadow:0 7px 20px #0004}.ml3-cardhead{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 10px 7px}.ml3-cardhead strong{color:#f6f3ea;font-size:13px}.ml3-cardhead em{font-style:normal;padding:3px 7px;border-radius:999px;background:#ef2f2f;color:white;font-size:7px;font-weight:950}.ml3-cardhead button{min-height:30px!important;padding:4px 8px!important;font-size:7px!important}
 .ml3-row{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:7px;align-items:center;padding:8px 10px;border-top:1px solid #ffffff12}.ml3-row .ico{font-size:15px;text-align:center}.ml3-row b{display:block;color:#eef5f7;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ml3-row small{display:block;margin-top:2px;color:#94adb6;font-size:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ml3-row .eta{color:#f3d37f;font-size:8px;font-weight:950}.ml3-row.arr .ico{color:#59e18d}.ml3-row.dep .ico{color:#ff7373}.ml3-row.mov .ico{color:#70d6ff}
 .ml3-activity .ml3-row{grid-template-columns:26px minmax(0,1fr) auto}.ml3-activity .ico{font-size:17px}
 .ml3-occupancy{display:grid;grid-template-columns:108px minmax(0,1fr);gap:10px;align-items:center;padding:10px}.ml3-ring{--p:70;position:relative;width:92px;height:92px;margin:auto;border-radius:50%;background:conic-gradient(#43e06f calc(var(--p)*1%),#22b9e9 0 100%);display:grid;place-items:center}.ml3-ring:after{content:"";position:absolute;inset:13px;border-radius:50%;background:#082738}.ml3-ring strong{position:relative;z-index:1;color:#fff;font-size:18px}.ml3-ring small{position:absolute;z-index:1;top:53px;color:#cbdbe0;font-size:7px}.ml3-occrows{display:grid;gap:6px}.ml3-occrows div{display:flex;justify-content:space-between;gap:10px;padding-bottom:5px;border-bottom:1px solid #ffffff14;color:#cfe0e5;font-size:9px}.ml3-occrows b{color:#fff}
 .ml3-services{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;padding:8px}.ml3-service{min-width:0!important;min-height:67px!important;padding:7px 3px!important;border:1px solid #ffffff20!important;border-radius:10px!important;background:linear-gradient(145deg,#164b62,#0a3047)!important;color:#f5f0e8!important;font-size:7px!important;font-weight:900!important}.ml3-service b{display:block;margin-bottom:5px;font-size:16px}.ml3-service span{display:block;margin-top:3px;color:#5ee789;font-size:6.5px}
 .ml3-weather{display:grid;grid-template-columns:90px minmax(0,1fr);gap:10px;padding:10px;align-items:center}.ml3-weather-main{text-align:center}.ml3-weather-main b{display:block;font-size:30px}.ml3-weather-main strong{display:block;color:#f3d487;font-size:11px}.ml3-weather-main small{color:#aec1c8;font-size:7px}.ml3-weatherrows{display:grid;gap:5px}.ml3-weatherrows div{display:flex;justify-content:space-between;gap:8px;padding-bottom:5px;border-bottom:1px solid #ffffff13;color:#b9cbd1;font-size:8px}.ml3-weatherrows b{color:#fff;font-size:8px}
 .ml3-bottom{position:fixed;z-index:9000;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;padding:5px max(5px,env(safe-area-inset-left)) calc(5px + env(safe-area-inset-bottom));border-top:1px solid #caa35d75;background:#041827f2;backdrop-filter:blur(14px);box-shadow:0 -7px 22px #0008}.ml3-bottom button{min-width:0!important;min-height:58px!important;padding:5px 2px!important;border:0!important;border-right:1px solid #ffffff10!important;border-radius:0!important;background:transparent!important;color:#dbe7ea!important;font-size:7px!important;font-weight:900!important;box-shadow:none!important}.ml3-bottom button:last-child{border-right:0!important}.ml3-bottom b{display:block;margin-bottom:3px;font-size:19px}.ml3-bottom button.on{border:1px solid #f0c75f!important;border-radius:10px!important;background:linear-gradient(145deg,#7b5b19,#173d4c)!important;color:#ffd96d!important;box-shadow:0 0 14px #e6b94e55!important}
 .ml3-moremenu{display:none;position:fixed;z-index:8999;left:8px;right:8px;bottom:70px;padding:8px;border:1px solid #cba55e88;border-radius:13px;background:#061e2dec;backdrop-filter:blur(14px);box-shadow:0 14px 35px #000a;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.ml3-moremenu.open{display:grid}.ml3-moremenu button{min-height:42px!important;padding:7px!important;font-size:8px!important}
 body.me-ml3-active #meFuelPanel,body.me-ml3-active #meMaintenancePanel{display:none;position:fixed;z-index:12050;left:8px;right:8px;top:auto;bottom:76px;width:auto;max-height:70vh;overflow:auto;padding:12px;border:1px solid #d6ae64;border-radius:15px;background:#051d2bec;box-shadow:0 18px 50px #000c;backdrop-filter:blur(14px)}
 body.me-ml3-active #meFuelPanel.open,body.me-ml3-active #meMaintenancePanel.open{display:block}
 body.me-ml3-active .me-service-head{display:flex;align-items:center;justify-content:space-between}.me-service-close{min-height:34px!important;width:34px!important;padding:0!important}
 @media(max-width:390px){.ml3-hero{height:215px}.ml3-title h2{font-size:22px}.ml3-summary span{font-size:6px}.ml3-summary b{font-size:10px}.ml3-service{font-size:6.5px!important}}
 @media(prefers-reduced-motion:reduce){.ml3-hero:after{animation:none!important}}
}
@media(min-width:900px){#meMobileMarinaLivePremium{display:none!important}}
`;
document.head.appendChild(st);

function w(){return Number(globalThis.innerWidth)||1024}
function sr(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function fmt(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function esc(v){return String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function marinaName(){
 const s=sr();
 try{return typeof port==="function"?(port(s?.port)?.name||"RPG Marina"):"RPG Marina"}catch(_){return"RPG Marina"}
}
function traffic(){try{return window.MarinaEmpireLiveTraffic?.snapshot?.()||null}catch(_){return null}}
function levelInfo(){
 const s=sr()||{},lv=Math.max(1,Math.floor(Number(s.level)||1));
 const xp=Math.max(0,Number(s.xp)||0),need=Math.max(1000,lv*3500);
 return {lv,xp,need,pct:Math.max(5,Math.min(100,Math.round((xp%need)/need*100)))}
}
function berthStats(){
 const root=document.querySelector("#marinaList .me-current-marina-card")||document.querySelector("#marinaList");
 const berths=root?[...root.querySelectorAll(".berth")]:[];
 if(berths.length){
   const occ=berths.filter(x=>x.classList.contains("occupied")||x.classList.contains("reserved")).length;
   return {occ,total:berths.length,free:Math.max(0,berths.length-occ),pct:Math.round(occ/Math.max(1,berths.length)*100)};
 }
 const t=traffic(),total=40,occ=Math.min(total,Math.max(8,Math.round((t?.volume||7)*4)));
 return {occ,total,free:total-occ,pct:Math.round(occ/total*100)};
}
function weatherInfo(){
 const t=traffic(),weather=t?.world?.weather||{};
 return {icon:weather.icon||"🌤️",label:weather.label||"Condizioni stabili",wind:(t?.world?.traffic||1)>1.15?"12 kn":"8 kn",sea:(t?.world?.traffic||1)>1.3?"Mosso":"Poco mosso"};
}
function actionIcon(x){
 const a=String(x?.action||"").toUpperCase();
 if(a.includes("ARRIVO"))return {ico:"➜",cls:"arr"};
 if(a.includes("PARTENZA"))return {ico:"➜",cls:"dep"};
 return {ico:"↻",cls:"mov"};
}
function go(id){try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function noticeText(msg){try{if(typeof notice==="function"){notice(msg);return}}catch(_){}const t=document.getElementById("toast");if(t){t.textContent=msg;t.classList.remove("hide");setTimeout(()=>t.classList.add("hide"),2600)}}
function pageActive(){
 const s=document.getElementById("marinas");
 if(!s||w()>899)return false;
 return !s.classList.contains("hide")&&getComputedStyle(s).display!=="none";
}
function servicesClick(id){
 if(id==="fuel"){const b=document.getElementById("meHudRefuel");if(b){b.click();return}}
 if(id==="maint"){const b=document.getElementById("meHudMaintenance");if(b){b.click();return}}
 noticeText(id==="water"?"Acqua disponibile in marina.":id==="power"?"Colonnine elettriche operative.":id==="assist"?"Assistenza marina disponibile.":"Servizio pulizie operativo.");
}
function vhf(){
 const b=document.querySelector(".me-live-vhf-action");
 if(b){b.click();noticeText("Richiesta VHF inviata a Port Control.");return}
 go("missions");
}
function details(item){noticeText((item?.name||"Unità")+" · "+(item?.action||"movimento")+" · "+(item?.berth||"ormeggio")+" · ETA "+(item?.eta||0)+" min")}
function render(){
 if(w()>899)return;
 const section=document.getElementById("marinas");if(!section)return;
 section.classList.add("me-ml3-ready");
 let host=document.getElementById("meMobileMarinaLivePremium");
 if(!host){host=document.createElement("div");host.id="meMobileMarinaLivePremium";section.prepend(host)}
 const s=sr()||{},t=traffic()||{items:[],volume:0,world:{}},items=t.items||[],b=berthStats(),wi=weatherInfo(),li=levelInfo(),name=marinaName();
 const counts={arr:items.filter(x=>String(x.action).includes("ARRIVO")).length,dep:items.filter(x=>String(x.action).includes("PARTENZA")).length,mov:items.filter(x=>String(x.action).includes("MANOVRA")).length};
 const activity=items.slice(0,4);
 const fuel=Math.max(0,Number(s.fuel)||0),condition=Math.max(0,Math.min(100,Number(s.condition)||100));
 const guestCount=Math.max(12,b.occ*4+Math.max(0,items.length-2)*3);
 host.innerHTML=`
 <div class="ml3-brand"><div class="ml3-brandmark"><b>MARINA EMPIRE</b><small>THE YACHT MANAGEMENT GAME</small></div><div class="ml3-level"><span>★ Livello ${li.lv}</span><div class="ml3-xp"><i style="width:${li.pct}%"></i></div></div></div>
 <div class="ml3-hud">
  <div><span>MONETE</span><b>🪙 ${fmt(s.coins||0)}</b></div>
  <div><span>PRESTIGIO</span><b>◆ ${fmt(s.prestige||0)}</b></div>
  <button type="button" data-ml3-service="fuel"><span>CARBURANTE</span><b>⛽ ${fmt(fuel)} L</b></button>
  <button type="button" class="ok" data-ml3-service="maint"><span>STATO</span><b>● ${Math.round(condition)}%</b></button>
 </div>
 <div class="ml3-pagehead"><div class="ml3-title"><h2>MARINA LIVE <span>(2/12)</span></h2><p>Il cuore operativo della tua marina, in tempo reale.</p></div><div class="ml3-pagepill">Pagina 2 di 12</div></div>
 <div class="ml3-summary">
  <div class="live"><span>MARINA OPERATIVA</span><b>● LIVE</b></div>
  <div><span>OSPITI IN MARINA</span><b>${guestCount}</b></div>
  <div><span>UNITÀ PRESENTI</span><b>${Math.max(items.length,t.volume||0)}</b></div>
  <div><span>ORMEGGI</span><b>${b.occ}/${b.total} · ${b.pct}%</b></div>
 </div>
 <section class="ml3-hero"><div class="ml3-herotop"><span class="ml3-livebadge"><i></i>LIVE · VISTA MARINA</span><span class="ml3-marina">${esc(name)}</span></div><div class="ml3-herobottom"><strong>⚓ ${esc(name)} · mondo vivo</strong><button class="ml3-cam" type="button" data-ml3-camera>📷</button></div></section>
 <section class="ml3-card"><div class="ml3-cardhead"><strong>🛥️ Traffico Marina</strong><em>LIVE</em></div>
  <div class="ml3-row arr"><span class="ico">➜</span><div><b>Arrivi previsti</b><small>unità in avvicinamento</small></div><span class="eta">${counts.arr}</span></div>
  <div class="ml3-row dep"><span class="ico">➜</span><div><b>Partenze previste</b><small>unità in uscita</small></div><span class="eta">${counts.dep}</span></div>
  <div class="ml3-row mov"><span class="ico">↻</span><div><b>In manovra</b><small>operazioni in corso</small></div><span class="eta">${counts.mov}</span></div>
 </section>
 <section class="ml3-card ml3-activity"><div class="ml3-cardhead"><strong>〽️ Attività in tempo reale</strong><button type="button" data-ml3-vhf>📻 VHF 09 · INCARICO</button></div>
  ${activity.length?activity.map((x,i)=>{const ai=actionIcon(x);return '<button type="button" class="ml3-row '+ai.cls+'" data-ml3-detail="'+i+'" style="width:100%;border:0;border-top:1px solid #ffffff12;border-radius:0;background:transparent;box-shadow:none;text-align:left"><span class="ico">'+ai.ico+'</span><div><b>'+esc(x.action)+' · '+esc(x.name)+'</b><small>'+esc(x.kind||"Yacht")+' · '+esc(x.berth||"P1")+'</small></div><span class="eta">'+(Number(x.eta)>0?fmt(x.eta)+' min':"ora")+'</span></button>'}).join(""):'<div class="ml3-row"><span class="ico">⚓</span><div><b>Marina operativa</b><small>Nessun movimento critico</small></div><span class="eta">LIVE</span></div>'}
 </section>
 <section class="ml3-card"><div class="ml3-cardhead"><strong>⚓ Occupazione Ormeggi</strong></div><div class="ml3-occupancy"><div class="ml3-ring" style="--p:${b.pct}"><strong>${b.pct}%</strong><small>Occupati</small></div><div class="ml3-occrows"><div><span>🟢 Occupati</span><b>${b.occ}</b></div><div><span>🔵 Liberi</span><b>${b.free}</b></div><div><span>Totale ormeggi</span><b>${b.total}</b></div></div></div></section>
 <section class="ml3-card"><div class="ml3-cardhead"><strong>▰ Servizi Marina</strong></div><div class="ml3-services">
  <button class="ml3-service" type="button" data-ml3-service="fuel"><b>⛽</b>Rifornimento<span>● Attivo</span></button>
  <button class="ml3-service" type="button" data-ml3-service="water"><b>💧</b>Acqua<span>● Attivo</span></button>
  <button class="ml3-service" type="button" data-ml3-service="power"><b>⚡</b>Elettricità<span>● Attivo</span></button>
  <button class="ml3-service" type="button" data-ml3-service="assist"><b>🔧</b>Assistenza<span>● Attivo</span></button>
  <button class="ml3-service" type="button" data-ml3-service="clean"><b>✨</b>Pulizie<span>● Attivo</span></button>
 </div></section>
 <section class="ml3-card"><div class="ml3-cardhead"><strong>☁️ Meteo & Condizioni Mare</strong></div><div class="ml3-weather"><div class="ml3-weather-main"><b>${esc(wi.icon)}</b><strong>${esc(wi.label)}</strong><small>condizioni operative</small></div><div class="ml3-weatherrows"><div><span>💨 Vento</span><b>${esc(wi.wind)}</b></div><div><span>≋ Mare</span><b>${esc(wi.sea)}</b></div><div><span>◉ Visibilità</span><b>Buona</b></div></div></div></section>
 <nav class="ml3-bottom" aria-label="Navigazione Marina Empire"><button type="button" data-ml3-go="home"><b>⌂</b>Home<br>1/12</button><button type="button" class="on"><b>📡</b>Marina Live<br>2/12</button><button type="button" data-ml3-go="missions"><b>◎</b>Missioni<br>3/12</button><button type="button" data-ml3-go="fleet"><b>🛥</b>Flotta<br>4/12</button><button type="button" data-ml3-more><b>•••</b>Altro</button></nav>
 <div class="ml3-moremenu" id="ml3MoreMenu"><button data-ml3-go="marinas">La tua Marina · 5/12</button><button data-ml3-go="map">Mappa · 6/12</button><button data-ml3-go="refit">Cantiere & Refit · 7/12</button><button data-ml3-go="crew">Equipaggio · 8/12</button><button data-ml3-go="charter">Contratti & Charter · 9/12</button><button data-ml3-go="marketplace">Marketplace · 10/12</button><button data-ml3-go="community">Comunità · 11/12</button><button data-ml3-go="profile">Profilo / Statistiche · 12/12</button></div>`;
 host.querySelectorAll("[data-ml3-service]").forEach(b=>b.onclick=()=>servicesClick(b.dataset.ml3Service));
 host.querySelector("[data-ml3-vhf]")?.addEventListener("click",vhf);
 host.querySelectorAll("[data-ml3-detail]").forEach(b=>b.onclick=()=>details(activity[Number(b.dataset.ml3Detail)||0]));
 host.querySelectorAll("[data-ml3-go]").forEach(b=>b.onclick=()=>{document.getElementById("ml3MoreMenu")?.classList.remove("open");go(b.dataset.ml3Go)});
 host.querySelector("[data-ml3-more]")?.addEventListener("click",()=>document.getElementById("ml3MoreMenu")?.classList.toggle("open"));
 host.querySelector("[data-ml3-camera]")?.addEventListener("click",()=>noticeText("Vista Marina Live · "+name));
}
function syncActive(){
 const active=pageActive();
 document.body.classList.toggle("me-ml3-active",active);
 if(active)render();
}
function boot(){
 if(w()>899)return;
 render();syncActive();
 const section=document.getElementById("marinas");
 if(section)new MutationObserver(()=>setTimeout(syncActive,30)).observe(section,{attributes:true,attributeFilter:["class","style"]});
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{if(pageActive())render()},80));
 window.addEventListener("marina-world-event",()=>setTimeout(()=>{if(pageActive())render()},80));
 window.addEventListener("resize",syncActive);
 setInterval(()=>{if(pageActive())render()},15000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();