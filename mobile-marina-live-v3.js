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
 body.me-ml3-active .shell>.nav,
 body.me-ml3-active #meMobileSheetBar,
 body.me-ml3-active .mobile-game-nav,
 body.me-ml3-active #meMobileMore{display:none!important}

 #marinas.me-ml3-ready{
  position:fixed!important;inset:0!important;z-index:91000!important;
  overflow-y:auto!important;overflow-x:hidden!important;
  margin:0!important;padding:8px 8px 92px!important;
  background:
   radial-gradient(circle at 50% -10%,rgba(35,123,151,.35),transparent 34%),
   linear-gradient(180deg,#05283b 0%,#073248 46%,#031824 100%)!important;
  overscroll-behavior:contain!important
 }
 #marinas.me-ml3-ready.hide{display:none!important}
 #marinas.me-ml3-ready:not(.hide){display:block!important}
 #marinas.me-ml3-ready> :not(#meMobileMarinaLivePremium){display:none!important}
 #meMobileMarinaLivePremium{display:flex!important;flex-direction:column;gap:9px;width:100%;margin:0;padding:0;color:#f6f3ea}

 .ml3-topbar{display:flex;align-items:center;justify-content:space-between;gap:8px}
 .ml3-brand{min-width:0}.ml3-brand b{display:block;color:#f0ce86;font:800 21px Georgia,serif;letter-spacing:.055em;white-space:nowrap}.ml3-brand small{display:block;margin-top:1px;color:#9eb6c0;font-size:6.8px;font-weight:900;letter-spacing:.12em}
 .ml3-level{flex:0 0 104px;text-align:right}.ml3-level span{display:block;color:#f4d48c;font-size:8.5px;font-weight:950}.ml3-xp{height:6px;margin-top:5px;border-radius:99px;background:#173d50;overflow:hidden}.ml3-xp i{display:block;height:100%;background:linear-gradient(90deg,#ffe07d,#bf8b33)}

 .ml3-hud{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
 .ml3-hud>button,.ml3-hud>div{min-width:0;min-height:54px;padding:7px 4px;border:1px solid rgba(236,191,104,.76);border-radius:11px;background:linear-gradient(145deg,#216c87,#0a3c56 58%,#082c42);color:#fff;text-align:center;box-shadow:inset 0 1px #ffffff18,0 5px 15px #0004}
 .ml3-hud span{display:block;color:#b0c4cc;font-size:6.8px;font-weight:900;white-space:nowrap}.ml3-hud b{display:block;margin-top:3px;color:#ffd873;font-size:11.5px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ml3-hud .ok b{color:#68e491}

 .ml3-titlebar{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;padding:3px 3px 0}
 .ml3-titlebar h2{margin:0;color:#fff5d9;font:900 26px/1 Georgia,serif;text-shadow:0 2px 10px #000}.ml3-titlebar h2 span{color:#e7bf71;font:800 12px system-ui}.ml3-titlebar p{margin:5px 0 0;color:#d8e6e9;font-size:8.5px}
 .ml3-pagepill{flex:0 0 auto;padding:6px 8px;border:1px solid #d6ae62;border-radius:999px;background:#072a3de8;color:#f8dc9a;font-size:7.5px;font-weight:950}

 .ml3-hero{position:relative;height:255px;overflow:hidden;border:1px solid #e0b565;border-radius:16px;background:#0b536c;box-shadow:0 12px 30px #0008;isolation:isolate}
 .ml3-hero:before{content:"";position:absolute;inset:0;background:url("./anteprima/assets/render-2026/marine.jpg") center 55%/cover no-repeat;filter:brightness(1.68) saturate(1.5) contrast(1.03);transform:scale(1.025)}
 .ml3-hero:after{content:"";position:absolute;inset:40% 0 0;background:linear-gradient(180deg,transparent,#021923cc);z-index:1}
 .ml3-herotop{position:absolute;z-index:3;left:9px;right:9px;top:9px;display:flex;justify-content:space-between;gap:6px}
 .ml3-livebadge,.ml3-marina{padding:6px 9px;border-radius:999px;background:#032636e7;font-size:7.5px;font-weight:950}
 .ml3-livebadge{border:1px solid #65e0a0;color:#e3fff0}.ml3-livebadge i{display:inline-block;width:7px;height:7px;margin-right:5px;border-radius:50%;background:#62e69b;box-shadow:0 0 8px #62e69b}
 .ml3-marina{max-width:58%;border:1px solid #d4ad656c;color:#f5d89f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .ml3-herotitle{position:absolute;z-index:3;left:11px;right:11px;bottom:12px}.ml3-herotitle small{display:block;color:#6de4a1;font-size:7px;font-weight:950;letter-spacing:.12em}.ml3-herotitle strong{display:block;margin-top:3px;color:#fff2c7;font:900 20px/1.05 Georgia,serif;text-shadow:0 3px 10px #000}.ml3-herotitle span{display:block;margin-top:4px;color:#e5f0f2;font-size:8px;text-shadow:0 2px 8px #000}

 .ml3-traffic{display:grid;grid-template-columns:auto repeat(3,minmax(0,1fr));gap:0;overflow:hidden;border:1px solid #e0b763;border-radius:12px;background:linear-gradient(145deg,#154f68,#082d43);box-shadow:0 7px 19px #0005}
 .ml3-traffic>div{min-width:0;padding:9px 6px;text-align:center;border-left:1px solid #ffffff14}.ml3-traffic>div:first-child{border-left:0}
 .ml3-traffic .label{display:flex;align-items:center;justify-content:center;padding:9px 8px;color:#f7d991;font-size:7px;font-weight:950;line-height:1.15}
 .ml3-traffic span{display:block;color:#a9c0c8;font-size:6px;font-weight:900}.ml3-traffic b{display:block;margin-top:3px;color:#fff;font-size:11px}.ml3-traffic .arr b{color:#6ce399}.ml3-traffic .dep b{color:#ff7c7c}.ml3-traffic .mov b{color:#6edaff}

 .ml3-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));overflow:hidden;border:1px solid #d9ae60;border-radius:13px;background:linear-gradient(145deg,#174f68,#092e44);box-shadow:0 8px 21px #0005}
 .ml3-kpis>div{min-width:0;padding:10px 5px;text-align:center;border-right:1px solid #ffffff15}.ml3-kpis>div:last-child{border-right:0}
 .ml3-kpis span{display:block;color:#b0c2c9;font-size:6px;font-weight:900;white-space:nowrap}.ml3-kpis b{display:block;margin-top:4px;color:#fff;font-size:11px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ml3-kpis small{display:block;margin-top:3px;color:#63df8e;font-size:6.3px;font-weight:900}

 .ml3-two{display:grid;grid-template-columns:1fr 1.2fr;gap:8px}
 .ml3-card{overflow:hidden;border:1px solid rgba(226,182,98,.72);border-radius:14px;background:linear-gradient(145deg,#124c64,#082b40);box-shadow:0 9px 23px #0005}
 .ml3-liveview{position:relative;min-height:235px;background:url("./anteprima/assets/render-2026/marine.jpg") center/cover no-repeat}
 .ml3-liveview:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#03182318,#03182366)}
 .ml3-play{position:absolute;z-index:2;left:50%;top:50%;transform:translate(-50%,-50%);width:58px!important;min-width:58px!important;height:58px!important;padding:0!important;border:2px solid #fff!important;border-radius:50%!important;background:#032838bc!important;color:#fff!important;font-size:24px!important;box-shadow:0 6px 18px #0008!important}
 .ml3-liveview .live{position:absolute;z-index:2;left:8px;top:8px;padding:5px 8px;border-radius:999px;background:#e83443;color:#fff;font-size:7px;font-weight:950}

 .ml3-activity .head{padding:9px 10px;color:#fff0bd;font:800 15px Georgia,serif;border-bottom:1px solid #ffffff14}
 .ml3-actrow{display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:7px;align-items:center;padding:9px 9px;border-top:1px solid #ffffff0e;background:#071f2e00}
 .ml3-actrow:first-of-type{border-top:0}.ml3-actrow .thumb{width:32px;height:32px;border-radius:7px;background:url("./anteprima/assets/render-2026/flotta.jpg") center/cover}
 .ml3-actrow b{display:block;color:#f6fbfc;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ml3-actrow small{display:block;margin-top:2px;color:#9eb5bd;font-size:6.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ml3-actrow .status{padding:4px 6px;border-radius:999px;background:#15516a;color:#75dcff;font-size:6px;font-weight:950;white-space:nowrap}.ml3-actrow.arr .status{background:#0b593b;color:#7cf0aa}.ml3-actrow.dep .status{background:#6e2830;color:#ff9aa3}

 .ml3-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
 .ml3-action{position:relative;overflow:hidden;min-width:0!important;min-height:104px!important;padding:0!important;border:1px solid #e2b863!important;border-radius:14px!important;background:#092e43!important;color:#fff!important;text-align:left!important;box-shadow:0 8px 22px #0005!important}
 .ml3-action:before{content:"";position:absolute;inset:0;background-size:cover;background-position:center;filter:brightness(1.12) saturate(1.22)}
 .ml3-action:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#02141f05 16%,#02141fdd 84%)}
 .ml3-action.fuel:before{background-image:url("./anteprima/assets/render-2026/hero-yacht.jpg")}.ml3-action.maint:before{background-image:url("./anteprima/assets/render-2026/cantieri.jpg")}.ml3-action.berth:before{background-image:url("./anteprima/assets/render-2026/marine.jpg")}
 .ml3-action b{position:absolute;z-index:2;left:8px;right:8px;bottom:8px;color:#fff0c3;font-size:9px;font-weight:950;text-shadow:0 2px 8px #000}.ml3-action i{position:absolute;z-index:2;left:8px;top:8px;font-style:normal;font-size:20px;text-shadow:0 2px 8px #000}

 .ml3-event{position:relative;overflow:hidden;min-height:145px;border:1px solid #e2b863;border-radius:15px;background:url("./anteprima/assets/render-2026/charter.jpg") center/cover no-repeat;box-shadow:0 9px 24px #0005}
 .ml3-event:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#06263be8 0%,#06263ba6 55%,#06263b33 100%)}
 .ml3-eventcopy{position:relative;z-index:2;width:68%;padding:14px}.ml3-eventcopy small{display:block;color:#f0cd7a;font-size:7px;font-weight:950;letter-spacing:.1em}.ml3-eventcopy strong{display:block;margin-top:4px;color:#fff1c5;font:900 19px Georgia,serif}.ml3-eventcopy span{display:block;margin-top:5px;color:#dce9ec;font-size:8px}.ml3-eventcopy button{min-height:36px!important;margin-top:8px!important;padding:6px 10px!important;background:linear-gradient(135deg,#e9c56f,#b77e31)!important;color:#102432!important;font-size:8px!important;font-weight:950!important}

 .ml3-bottom-wrap{position:fixed;z-index:93000;left:0;right:0;bottom:0;padding:4px 4px calc(4px + env(safe-area-inset-bottom));border-top:1px solid #d2aa60;background:#041827f5;backdrop-filter:blur(14px);box-shadow:0 -8px 24px #0008}
 .ml3-bottom{display:flex;overflow-x:auto;gap:0;scrollbar-width:none}.ml3-bottom::-webkit-scrollbar{display:none}
 .ml3-bottom button{flex:0 0 72px;min-width:72px!important;min-height:62px!important;padding:5px 3px!important;border:0!important;border-right:1px solid #ffffff10!important;border-radius:0!important;background:transparent!important;color:#dce8eb!important;font-size:6.6px!important;font-weight:900!important;box-shadow:none!important;line-height:1.1!important}
 .ml3-bottom button b{display:block;margin-bottom:4px;font-size:18px}.ml3-bottom button small{display:block;margin-top:3px;color:#88a4af;font-size:6px}
 .ml3-bottom button.on{border:1px solid #f0c75f!important;border-radius:10px!important;background:linear-gradient(145deg,#85601d,#173f52)!important;color:#ffd970!important;box-shadow:0 0 14px #e6b94e55!important}

 body.me-ml3-active #meFuelPanel,body.me-ml3-active #meMaintenancePanel{display:none;position:fixed;z-index:94000;left:8px;right:8px;top:auto;bottom:78px;width:auto;max-height:70vh;overflow:auto;padding:12px;border:1px solid #d6ae64;border-radius:15px;background:#051d2bec;box-shadow:0 18px 50px #000c;backdrop-filter:blur(14px)}
 body.me-ml3-active #meFuelPanel.open,body.me-ml3-active #meMaintenancePanel.open{display:block}

 @media(max-width:390px){
  .ml3-hero{height:230px}.ml3-titlebar h2{font-size:23px}.ml3-two{grid-template-columns:1fr}.ml3-liveview{min-height:190px}.ml3-action{min-height:92px!important}.ml3-bottom button{flex-basis:68px;min-width:68px!important}
 }
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
function navButton(id,icon,label,num,on){
 return '<button type="button" '+(on?'class="on"':'data-ml3-go="'+id+'"')+'><b>'+icon+'</b>'+label+'<small>'+num+'/12</small></button>';
}
function eventInfo(){
 try{
  const m=window.MarinaEmpireWorldEvents?.modifiers?.(sr()?.port);
  if(m?.event)return {title:m.event.label||m.event.title||"Evento in Marina",text:m.event.description||"Attività speciale in corso",target:m.event.link||"missions"};
 }catch(_){}
 return {title:"Evento in Marina",text:"Attività speciali, regate e opportunità dal mondo nautico.",target:"missions"};
}
function render(){
 if(w()>899)return;
 const section=document.getElementById("marinas");if(!section)return;
 section.classList.add("me-ml3-ready");
 let host=document.getElementById("meMobileMarinaLivePremium");
 if(!host){host=document.createElement("div");host.id="meMobileMarinaLivePremium";section.prepend(host)}
 const s=sr()||{},t=traffic()||{items:[],volume:0,world:{}},items=t.items||[],b=berthStats(),li=levelInfo(),name=marinaName(),ev=eventInfo();
 const counts={
  arr:items.filter(x=>String(x.action||"").toUpperCase().includes("ARRIVO")).length,
  dep:items.filter(x=>String(x.action||"").toUpperCase().includes("PARTENZA")).length,
  mov:items.filter(x=>String(x.action||"").toUpperCase().includes("MANOVRA")).length
 };
 const activity=items.slice(0,4);
 const fuel=Math.max(0,Number(s.fuel)||0),condition=Math.max(0,Math.min(100,Number(s.condition)||100));
 const guestCount=Math.max(12,b.occ*3+Math.max(0,items.length)*2);
 const earnings=Math.max(0,Number(s.earnings)||0);
 host.innerHTML=`
 <div class="ml3-topbar">
  <div class="ml3-brand"><b>MARINA EMPIRE</b><small>IL GESTIONALE NAUTICO ONLINE</small></div>
  <div class="ml3-level"><span>★ Livello ${li.lv}</span><div class="ml3-xp"><i style="width:${li.pct}%"></i></div></div>
 </div>

 <div class="ml3-hud">
  <div><span>MONETE</span><b>🪙 ${fmt(s.coins||0)}</b></div>
  <div><span>PRESTIGIO</span><b>◆ ${fmt(s.prestige||0)}</b></div>
  <button type="button" data-ml3-service="fuel"><span>CARBURANTE</span><b>⛽ ${fmt(fuel)} L</b></button>
  <button type="button" class="ok" data-ml3-service="maint"><span>STATO</span><b>● ${Math.round(condition)}%</b></button>
 </div>

 <div class="ml3-titlebar">
  <div><h2>MARINA LIVE <span>2/12</span></h2><p>La tua marina, in tempo reale.</p></div>
  <div class="ml3-pagepill">MONDO VIVO</div>
 </div>

 <section class="ml3-hero">
  <div class="ml3-herotop"><span class="ml3-livebadge"><i></i>LIVE · VISTA MARINA</span><span class="ml3-marina">${esc(name)}</span></div>
  <div class="ml3-herotitle"><small>MARINA EMPIRE · PORT CONTROL</small><strong>${esc(name)}</strong><span>Traffico, ospiti, servizi e attività live.</span></div>
 </section>

 <section class="ml3-traffic">
  <div class="label">📡 TRAFFICO<br>MARINA LIVE</div>
  <div class="arr"><span>ARRIVI</span><b>↗ ${counts.arr}</b></div>
  <div class="dep"><span>PARTENZE</span><b>↘ ${counts.dep}</b></div>
  <div class="mov"><span>IN MANOVRA</span><b>🛥 ${counts.mov}</b></div>
 </section>

 <section class="ml3-kpis">
  <div><span>POSTI OCCUPATI</span><b>${b.occ} / ${b.total}</b><small>${b.pct}% utilizzo</small></div>
  <div><span>OSPITI IN MARINA</span><b>${guestCount}</b><small>● attività live</small></div>
  <div><span>INCASSI TOTALI</span><b>${fmt(earnings)}</b><small>crediti gioco</small></div>
  <div><span>CARBURANTE</span><b>${fmt(fuel)} L</b><small>serbatoio yacht</small></div>
 </section>

 <div class="ml3-two">
  <section class="ml3-card ml3-liveview">
   <span class="live">● LIVE</span><button class="ml3-play" type="button" data-ml3-camera>▶</button>
  </section>
  <section class="ml3-card ml3-activity">
   <div class="head">📡 Ultime attività</div>
   ${activity.length?activity.map((x,i)=>{const ai=actionIcon(x);const status=String(x.action||"Movimento").replace(/_/g," ");return '<button type="button" class="ml3-actrow '+ai.cls+'" data-ml3-detail="'+i+'" style="width:100%;border:0;background:transparent;text-align:left"><span class="thumb"></span><span><b>'+esc(x.name||"Unità")+'</b><small>'+esc(x.kind||"Yacht")+' · '+esc(x.berth||"Marina")+'</small></span><span class="status">'+esc(status)+'</span></button>'}).join(""):'<div class="ml3-actrow"><span class="thumb"></span><span><b>Marina operativa</b><small>Nessun movimento critico</small></span><span class="status">LIVE</span></div>'}
  </section>
 </div>

 <section class="ml3-actions">
  <button type="button" class="ml3-action fuel" data-ml3-service="fuel"><i>⛽</i><b>PIENO</b></button>
  <button type="button" class="ml3-action maint" data-ml3-service="maint"><i>🔧</i><b>MANUTENZIONE</b></button>
  <button type="button" class="ml3-action berth" data-ml3-berths><i>⚓</i><b>GESTISCI ORMEGGI</b></button>
 </section>

 <section class="ml3-event">
  <div class="ml3-eventcopy"><small>📅 EVENTO IN MARINA</small><strong>${esc(ev.title)}</strong><span>${esc(ev.text)}</span><button type="button" data-ml3-event>SCOPRI L'EVENTO ›</button></div>
 </section>

 <div class="ml3-bottom-wrap"><nav class="ml3-bottom" aria-label="Pagine Marina Empire">
  ${navButton("home","⌂","Home",1,false)}
  ${navButton("","⚓","Marina Live",2,true)}
  ${navButton("missions","◎","Missioni",3,false)}
  ${navButton("fleet","🛥","Flotta",4,false)}
  ${navButton("office","🏛","La tua Marina",5,false)}
  ${navButton("map","🗺","Mappa",6,false)}
  ${navButton("refit","🏗","Cantiere & Refit",7,false)}
  ${navButton("crew","👥","Equipaggio",8,false)}
  ${navButton("charter","📄","Contratti & Charter",9,false)}
  ${navButton("marketplace","🛒","Marketplace",10,false)}
  ${navButton("community","💬","Community",11,false)}
  ${navButton("profile","👤","Profilo",12,false)}
 </nav></div>`;

 host.querySelectorAll("[data-ml3-service]").forEach(b=>b.onclick=()=>servicesClick(b.dataset.ml3Service));
 host.querySelectorAll("[data-ml3-detail]").forEach(b=>b.onclick=()=>details(activity[Number(b.dataset.ml3Detail)||0]));
 host.querySelectorAll("[data-ml3-go]").forEach(b=>b.onclick=()=>go(b.dataset.ml3Go));
 host.querySelector("[data-ml3-camera]")?.addEventListener("click",()=>noticeText("Marina Live · "+name+" · traffico aggiornato"));
 host.querySelector("[data-ml3-berths]")?.addEventListener("click",()=>{try{if(typeof showTab==="function")showTab("office")}catch(_){}});
 host.querySelector("[data-ml3-event]")?.addEventListener("click",()=>go(ev.target==="weekend-water-toys.html"?"marketplace":ev.target));
}
function syncActive(){
 const active=pageActive();
 document.body.classList.toggle("me-ml3-active",active);
 if(active)render();
}
function boot(){
 if(w()>899)return;
 syncActive();
 const section=document.getElementById("marinas");
 if(section)new MutationObserver(()=>setTimeout(syncActive,30)).observe(section,{attributes:true,attributeFilter:["class","style"]});
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{if(pageActive())render()},80));
 window.addEventListener("marina-world-event",()=>setTimeout(()=>{if(pageActive())render()},80));
 window.addEventListener("resize",syncActive);
 setInterval(()=>{if(pageActive())render()},15000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();