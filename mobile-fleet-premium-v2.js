(()=>{
"use strict";
if(window.__ME_MOBILE_FLEET_PREMIUM_V2__)return;
window.__ME_MOBILE_FLEET_PREMIUM_V2__=true;

const style=document.createElement("style");
style.id="me-mobile-fleet-premium-v2-style";
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
   position:fixed!important;inset:0!important;z-index:91500!important;
   overflow-y:auto!important;overflow-x:hidden!important;
   padding:8px 8px 94px!important;
   background:
     radial-gradient(circle at 50% -10%,rgba(37,126,154,.34),transparent 33%),
     linear-gradient(180deg,#05283b 0%,#073248 47%,#031824 100%)!important;
   overscroll-behavior:contain!important
 }
 #fleet.me-fleet4-ready.hide{display:none!important;visibility:hidden!important;pointer-events:none!important;z-index:-1!important}
 #fleet.me-fleet4-ready:not(.hide){display:block!important}
 #fleet.me-fleet4-ready>.me-lux-page-head{display:none!important}
 #fleet.me-fleet4-ready>.panel{
   margin:0!important;padding:9px!important;
   border:1px solid rgba(219,177,96,.58)!important;border-radius:14px!important;
   background:linear-gradient(145deg,#103f56,#082a3e)!important;
   box-shadow:0 8px 22px #0005!important
 }
 #fleet.me-fleet4-ready .me-fleet-banner,
 #fleet.me-fleet4-ready .me-fleet-section-title,
 #fleet.me-fleet4-ready .fleet-command-strip,
 #fleet.me-fleet4-ready .me-secondary-details,
 #fleet.me-fleet4-ready .me-fleet-footer{display:none!important}

 #meFleetPremiumTop{display:flex!important;flex-direction:column;gap:9px;margin-bottom:9px;color:#f7f2e7}

 .mf4-topbar{display:flex;align-items:center;justify-content:space-between;gap:8px}
 .mf4-brand{min-width:0}.mf4-brand b{display:block;color:#f0ce86;font:800 21px Georgia,serif;letter-spacing:.055em;white-space:nowrap}.mf4-brand small{display:block;margin-top:1px;color:#9eb6c0;font-size:6.8px;font-weight:900;letter-spacing:.12em}
 .mf4-level{flex:0 0 104px;text-align:right}.mf4-level span{display:block;color:#f4d48c;font-size:8.5px;font-weight:950}.mf4-xp{height:6px;margin-top:5px;border-radius:99px;background:#173d50;overflow:hidden}.mf4-xp i{display:block;height:100%;background:linear-gradient(90deg,#ffe07d,#bf8b33)}

 .mf4-titlebar{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;padding:3px 3px 0}
 .mf4-titlebar h2{margin:0;color:#fff5d9;font:900 27px/1 Georgia,serif;text-shadow:0 2px 10px #000}.mf4-titlebar h2 span{color:#e7bf71;font:800 12px system-ui}.mf4-titlebar p{margin:5px 0 0;color:#d8e6e9;font-size:8.5px}.mf4-pagepill{flex:0 0 auto;padding:6px 8px;border:1px solid #d6ae62;border-radius:999px;background:#072a3de8;color:#f8dc9a;font-size:7.5px;font-weight:950}

 .mf4-hero{position:relative;height:245px;overflow:hidden;border:1px solid #e1b665;border-radius:16px;background:#0b536c;box-shadow:0 12px 30px #0008;isolation:isolate}
 .mf4-hero:before{content:"";position:absolute;inset:0;background:url("./anteprima/assets/render-2026/flotta.jpg") center 53%/cover no-repeat;filter:brightness(1.55) saturate(1.43) contrast(1.04);transform:scale(1.02)}
 .mf4-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#02151f08 12%,#02151f20 45%,#02151fd9 100%)}
 .mf4-herocopy{position:absolute;z-index:2;left:11px;right:11px;bottom:12px}.mf4-herocopy small{display:block;color:#72e3a1;font-size:7px;font-weight:950;letter-spacing:.12em}.mf4-herocopy strong{display:block;margin-top:3px;color:#fff1c5;font:900 21px/1.05 Georgia,serif;text-shadow:0 3px 10px #000}.mf4-herocopy span{display:block;margin-top:5px;color:#e6f0f2;font-size:8px;text-shadow:0 2px 8px #000}.mf4-herobadge{position:absolute;z-index:2;right:9px;top:9px;padding:5px 8px;border:1px solid #d7b267;border-radius:999px;background:#032636df;color:#f6dc9b;font-size:7px;font-weight:950}

 .mf4-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));overflow:hidden;border:1px solid #dfb361;border-radius:13px;background:linear-gradient(145deg,#184f68,#092e44);box-shadow:0 8px 21px #0005}
 .mf4-stats>div{min-width:0;padding:10px 5px;text-align:center;border-right:1px solid #ffffff15}.mf4-stats>div:last-child{border-right:0}
 .mf4-stats span{display:block;color:#b0c2c9;font-size:6.1px;font-weight:900;white-space:nowrap}.mf4-stats b{display:block;margin-top:4px;color:#fff;font-size:11px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mf4-stats .gold b{color:#ffd873}.mf4-stats .ok b{color:#68e491}

 .mf4-primary{
   overflow:hidden;border:1px solid #e0b662;border-radius:15px;
   background:linear-gradient(145deg,#12495f,#082b40);box-shadow:0 9px 23px #0005
 }
 .mf4-primary-grid{display:grid;grid-template-columns:1.08fr 1fr;min-height:265px}
 .mf4-primary-photo{position:relative;background:url("./anteprima/assets/render-2026/hero-yacht.jpg") center/cover no-repeat;min-height:265px}
 .mf4-primary-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#02151f04 15%,#02151f35 62%,#02151fb8 100%)}
 .mf4-crown{position:absolute;z-index:2;left:9px;top:9px;padding:5px 8px;border-radius:999px;background:#d99f22;color:#142635;font-size:7px;font-weight:950;box-shadow:0 5px 12px #0006}
 .mf4-primary-info{padding:12px}
 .mf4-primary-info h3{margin:0;color:#fff0c2;font:900 19px Georgia,serif}.mf4-primary-info .sub{display:block;margin-top:3px;color:#afc6cf;font-size:8px}
 .mf4-specs{display:grid;gap:6px;margin-top:11px}.mf4-specs div{display:flex;justify-content:space-between;gap:8px;padding-bottom:5px;border-bottom:1px solid #ffffff13;color:#c9d9de;font-size:8px}.mf4-specs b{color:#fff;font-size:8px}
 .mf4-gauges{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px}.mf4-gauge{padding:7px;border:1px solid #ffffff18;border-radius:9px;background:#0a3044}.mf4-gauge span{display:flex;justify-content:space-between;color:#dbe7ea;font-size:7px}.mf4-bar{height:6px;margin-top:5px;border-radius:99px;background:#173949;overflow:hidden}.mf4-bar i{display:block;height:100%;background:linear-gradient(90deg,#65df8d,#d8c75e)}
 .mf4-primary-actions{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:8px;border-top:1px solid #ffffff12}.mf4-primary-actions button{min-width:0!important;min-height:46px!important;padding:6px 4px!important;border:1px solid #dcb462!important;border-radius:9px!important;background:linear-gradient(145deg,#174f68,#0a3248)!important;color:#f4f0e4!important;font-size:6.9px!important;font-weight:950!important;box-shadow:0 5px 12px #0003!important}.mf4-primary-actions button.gold{background:linear-gradient(135deg,#d8a93f,#8d641e)!important;color:#fff4c9!important}

 .mf4-section-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:1px 2px}.mf4-section-head h3{margin:0;color:#fff0bd;font:800 16px Georgia,serif}.mf4-section-head button{min-height:34px!important;padding:5px 8px!important;border-radius:999px!important;background:linear-gradient(135deg,#e3bd67,#a7762c)!important;color:#102532!important;font-size:7px!important;font-weight:950!important}

 #fleet.me-fleet4-ready #fleetList{display:flex!important;gap:8px!important;overflow-x:auto!important;padding:2px 1px 5px!important;scrollbar-width:none!important;scroll-snap-type:x proximity}
 #fleet.me-fleet4-ready #fleetList::-webkit-scrollbar{display:none}
 #fleet.me-fleet4-ready #fleetList .yacht-card{
   flex:0 0 150px!important;scroll-snap-align:start!important;margin:0!important;overflow:hidden!important;
   border:1px solid rgba(225,181,96,.72)!important;border-radius:13px!important;
   background:linear-gradient(145deg,#12495f,#082b40)!important;box-shadow:0 8px 18px #0005!important
 }
 #fleet.me-fleet4-ready #fleetList .yacht-card.is-selected{border-color:#ffe084!important;box-shadow:0 0 0 2px #ffe0842e,0 9px 21px #0006!important}
 #fleet.me-fleet4-ready .yacht-visual{height:95px!important;background-position:center!important;filter:brightness(1.2) saturate(1.2)!important}
 #fleet.me-fleet4-ready .yacht-visual small{top:6px!important;left:6px!important;padding:3px 5px!important;border-radius:999px!important;font-size:5.8px!important}
 #fleet.me-fleet4-ready .yacht-detail{padding:8px!important}
 #fleet.me-fleet4-ready .yacht-detail>b{display:block!important;color:#fff0c2!important;font:800 11px/1.05 Georgia,serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 #fleet.me-fleet4-ready .yacht-specs{grid-template-columns:1fr!important;gap:3px!important;margin-top:6px!important}
 #fleet.me-fleet4-ready .yacht-specs span{padding:3px 4px!important;border:0!important;border-radius:6px!important;background:#0a3042!important;color:#d9e7ea!important;font-size:6.2px!important;text-align:left!important}
 #fleet.me-fleet4-ready .yacht-specs span:nth-child(n+3){display:none!important}
 #fleet.me-fleet4-ready .yacht-detail p{margin:5px 0!important;color:#afc2c8!important;font-size:6.4px!important;line-height:1.2!important}
 #fleet.me-fleet4-ready .yacht-detail p:nth-of-type(n+2){display:none!important}
 #fleet.me-fleet4-ready .yacht-detail button{width:100%!important;min-height:30px!important;margin-top:6px!important;padding:5px 4px!important;border-radius:999px!important;border:1px solid #6ea1b3!important;background:#0e4b63!important;color:#e8f3f5!important;font-size:6.3px!important;font-weight:950!important}
 #fleet.me-fleet4-ready .yacht-detail button:disabled{border-color:#e0b763!important;background:linear-gradient(135deg,#8a641d,#17465b)!important;color:#ffe290!important;opacity:1!important}

 .mf4-upgrade{position:relative;overflow:hidden;min-height:145px;border:1px solid #e1b762;border-radius:15px;background:url("./anteprima/assets/render-2026/cantieri.jpg") center/cover no-repeat;box-shadow:0 9px 24px #0005}
 .mf4-upgrade:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#06263be8 0%,#06263ba6 55%,#06263b28 100%)}
 .mf4-upgradecopy{position:relative;z-index:2;width:69%;padding:14px}.mf4-upgradecopy small{display:block;color:#f0cd7a;font-size:7px;font-weight:950;letter-spacing:.1em}.mf4-upgradecopy strong{display:block;margin-top:4px;color:#fff1c5;font:900 19px Georgia,serif}.mf4-upgradecopy span{display:block;margin-top:5px;color:#dce9ec;font-size:8px}.mf4-upgradecopy button{min-height:36px!important;margin-top:8px!important;padding:6px 10px!important;border-radius:999px!important;background:linear-gradient(135deg,#e9c56f,#b77e31)!important;color:#102432!important;font-size:8px!important;font-weight:950!important}

 .mf4-bottom-wrap{position:fixed;z-index:93000;left:0;right:0;bottom:0;padding:4px 4px calc(4px + env(safe-area-inset-bottom));border-top:1px solid #d2aa60;background:#041827f5;backdrop-filter:blur(14px);box-shadow:0 -8px 24px #0008}
 .mf4-bottom{display:flex;overflow-x:auto;gap:0;scrollbar-width:none}.mf4-bottom::-webkit-scrollbar{display:none}
 .mf4-bottom button{flex:0 0 72px;min-width:72px!important;min-height:62px!important;padding:5px 3px!important;border:0!important;border-right:1px solid #ffffff10!important;border-radius:0!important;background:transparent!important;color:#dce8eb!important;font-size:6.6px!important;font-weight:900!important;box-shadow:none!important;line-height:1.1!important}
 .mf4-bottom button b{display:block;margin-bottom:4px;font-size:18px}.mf4-bottom button small{display:block;margin-top:3px;color:#88a4af;font-size:6px}
 .mf4-bottom button.on{border:1px solid #f0c75f!important;border-radius:10px!important;background:linear-gradient(145deg,#85601d,#173f52)!important;color:#ffd970!important;box-shadow:0 0 14px #e6b94e55!important}

 body.me-fleet4-active #meFuelPanel,body.me-fleet4-active #meMaintenancePanel{display:none;position:fixed;z-index:94000;left:8px;right:8px;top:auto;bottom:78px;width:auto;max-height:70vh;overflow:auto;padding:12px;border:1px solid #d6ae64;border-radius:15px;background:#051d2bec;box-shadow:0 18px 50px #000c;backdrop-filter:blur(14px)}
 body.me-fleet4-active #meFuelPanel.open,body.me-fleet4-active #meMaintenancePanel.open{display:block}

 @media(max-width:390px){
  .mf4-hero{height:225px}.mf4-titlebar h2{font-size:24px}
  .mf4-primary-grid{grid-template-columns:1fr}.mf4-primary-photo{min-height:190px}.mf4-primary-actions{grid-template-columns:repeat(3,minmax(0,1fr))}
  .mf4-primary-actions button:nth-child(n+4){grid-column:span 1}.mf4-bottom button{flex-basis:68px;min-width:68px!important}
 }
}
@media(min-width:900px){#meFleetPremiumTop,#meFleetPremiumUpgrade,#meFleetPremiumNav{display:none!important}}
`;
document.head.appendChild(style);

function width(){return Number(globalThis.innerWidth)||1024}
function game(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function fmt(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function esc(v){return String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function marinaName(id){try{return typeof port==="function"?(port(id)?.name||"Marina"):"Marina"}catch(_){return"Marina"}}
function yacht(id){try{return typeof boat==="function"?boat(id):null}catch(_){return null}}
function yachtName(id){return yacht(id)?.name||"Yacht"}
function active(){const el=document.getElementById("fleet");if(!el||width()>899)return false;return !el.classList.contains("hide")&&getComputedStyle(el).display!=="none"}
function level(){const s=game()||{},lv=Math.max(1,Math.floor(Number(s.level)||1)),xp=Math.max(0,Number(s.xp)||0),need=Math.max(1000,lv*3500);return {lv,pct:Math.max(5,Math.min(100,Math.round((xp%need)/need*100)))}}
function go(id){try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function navButton(id,icon,label,num,on){return '<button type="button" '+(on?'class="on"':'data-mf4-go="'+id+'"')+'><b>'+icon+'</b>'+label+'<small>'+num+'/12</small></button>'}
function service(id){
 const el=document.getElementById(id==="fuel"?"meHudRefuel":"meHudMaintenance");
 if(el){el.click();return}
 const fallback=document.getElementById(id==="fuel"?"officeRefuel":"officeRepair");
 if(fallback)fallback.click();
}
function specsFor(id){
 const m={voyager:["8,00 m","24 nodi","6","1"],open:["7,00 m","32 nodi","4","1"],yacht:["12,00 m","27 nodi","8","2"],yacht14:["14,00 m","25 nodi","10","3"],yacht20:["20,00 m","23 nodi","12","4"],yacht30:["30,00 m","21 nodi","14","5"],luna:["60,00 m","20 nodi","18","8"]};
 return m[id]||["—","—","—","—"];
}
function fleetFuelTotal(){
 const s=game()||{};let total=0;
 (s.owned||[]).forEach(id=>{total+=id===s.boat?Number(s.fuel)||0:Number(s.fleetFuel?.[id]??yacht(id)?.tank??0)||0});
 return total;
}
function maintenanceCount(){
 const s=game()||{};let n=0;
 (s.owned||[]).forEach(id=>{const v=id===s.boat?Number(s.condition)||0:Number(s.fleetCondition?.[id]??100);if(v<70)n++});
 return n;
}
function ensure(){
 const section=document.getElementById("fleet");if(!section)return null;section.classList.add("me-fleet4-ready");
 let top=document.getElementById("meFleetPremiumTop");if(!top){top=document.createElement("div");top.id="meFleetPremiumTop";section.prepend(top)}
 let upgrade=document.getElementById("meFleetPremiumUpgrade");if(!upgrade){upgrade=document.createElement("section");upgrade.id="meFleetPremiumUpgrade";upgrade.className="mf4-upgrade";section.appendChild(upgrade)}
 let nav=document.getElementById("meFleetPremiumNav");if(!nav){nav=document.createElement("div");nav.id="meFleetPremiumNav";nav.className="mf4-bottom-wrap";section.appendChild(nav)}
 return {section,top,upgrade,nav};
}
function render(){
 if(width()>899)return;
 const ui=ensure();if(!ui)return;
 const s=game()||{},l=level(),owned=Array.isArray(s.owned)?s.owned:[],b=yacht(s.boat)||{},sp=specsFor(s.boat);
 const fuel=Math.max(0,Number(s.fuel)||0),condition=Math.max(0,Math.min(100,Number(s.condition)||100));
 const tank=Math.max(1,Number(b.tank)||1),fuelPct=Math.max(0,Math.min(100,Math.round(fuel/tank*100))),wear=Math.max(0,100-Math.round(condition));
 const crewCount=(()=>{try{return typeof crewForBoat==="function"?(Number(crewForBoat(s.boat)?.roles)||0):0}catch(_){return 0}})();

 ui.top.innerHTML=`
  <div class="mf4-topbar">
   <div class="mf4-brand"><b>MARINA EMPIRE</b><small>IL GESTIONALE NAUTICO ONLINE</small></div>
   <div class="mf4-level"><span>★ Livello ${l.lv}</span><div class="mf4-xp"><i style="width:${l.pct}%"></i></div></div>
  </div>

  <div class="mf4-titlebar">
   <div><h2>FLOTTA <span>4/12</span></h2><p>Le tue imbarcazioni, il tuo impero.</p></div>
   <div class="mf4-pagepill">FLEET CONTROL</div>
  </div>

  <section class="mf4-hero">
   <span class="mf4-herobadge">${s.trip?"NAVIGAZIONE ATTIVA":"FLOTTA OPERATIVA"}</span>
   <div class="mf4-herocopy"><small>MARINA EMPIRE · FLEET CONTROL</small><strong>${esc(yachtName(s.boat))}</strong><span>${owned.length} imbarcazioni · ${esc(marinaName(s.port||"rimini"))}</span></div>
  </section>

  <section class="mf4-stats">
   <div class="gold"><span>IMBARCAZIONI</span><b>${owned.length}</b></div>
   <div><span>EQUIPAGGIO RICHIESTO</span><b>${crewCount||"—"}</b></div>
   <div class="${maintenanceCount()?"gold":"ok"}"><span>MANUTENZIONI</span><b>${maintenanceCount()}</b></div>
   <div><span>CARBURANTE FLOTTA</span><b>${fmt(fleetFuelTotal())} L</b></div>
  </section>

  <section class="mf4-primary">
   <div class="mf4-primary-grid">
    <div class="mf4-primary-photo"><span class="mf4-crown">👑 YACHT PRINCIPALE</span></div>
    <div class="mf4-primary-info">
     <h3>★ ${esc(yachtName(s.boat))}</h3><span class="sub">${esc(sp[0])} · ${esc(marinaName((s.fleetPorts||{})[s.boat]||s.port))}</span>
     <div class="mf4-specs">
      <div><span>Velocità max</span><b>${esc(sp[1])}</b></div>
      <div><span>Posti</span><b>${esc(sp[2])}</b></div>
      <div><span>Cabine</span><b>${esc(sp[3])}</b></div>
      <div><span>Serbatoio</span><b>${fmt(tank)} L</b></div>
     </div>
     <div class="mf4-gauges">
      <div class="mf4-gauge"><span><b>⛽ Carburante</b><b>${fuelPct}%</b></span><div class="mf4-bar"><i style="width:${fuelPct}%"></i></div></div>
      <div class="mf4-gauge"><span><b>🔧 Usura</b><b>${wear}%</b></span><div class="mf4-bar"><i style="width:${Math.max(0,100-wear)}%"></i></div></div>
     </div>
    </div>
   </div>
   <div class="mf4-primary-actions">
    <button type="button" class="gold" data-mf4-active>◎ USA BARCA</button>
    <button type="button" data-mf4-service="fuel">⛽ RIFORNISCI</button>
    <button type="button" data-mf4-service="maint">🔧 MANUTENZIONE</button>
    <button type="button" data-mf4-go="refit">📈 UPGRADE</button>
    <button type="button" data-mf4-go="refit">🎨 PERSONALIZZA</button>
   </div>
  </section>

  <div class="mf4-section-head"><h3>🛥 La tua Flotta (${owned.length})</h3><button type="button" data-mf4-go="office">AGGIUNGI IMBARCAZIONE +</button></div>`;

 ui.top.querySelectorAll("[data-mf4-service]").forEach(b=>b.onclick=()=>service(b.dataset.mf4Service));
 ui.top.querySelectorAll("[data-mf4-go]").forEach(b=>b.onclick=()=>go(b.dataset.mf4Go));
 ui.top.querySelector("[data-mf4-active]")?.addEventListener("click",()=>{try{if(typeof notice==="function")notice(yachtName(s.boat)+" è già la barca attiva.")}catch(_){}});

 ui.upgrade.innerHTML='<div class="mf4-upgradecopy"><small>🔧 CANTIERE & REFIT</small><strong>Potenzia la tua Flotta</strong><span>Aumenta prestazioni, comfort e valore delle tue imbarcazioni.</span><button type="button" data-mf4-go="refit">VAI AL CANTIERE & REFIT ›</button></div>';
 ui.upgrade.querySelector("[data-mf4-go]")?.addEventListener("click",()=>go("refit"));

 ui.nav.innerHTML='<nav class="mf4-bottom" aria-label="Pagine Marina Empire">'+
  navButton("home","⌂","Home",1,false)+
  navButton("marinas","⚓","Marina Live",2,false)+
  navButton("missions","◎","Missioni",3,false)+
  navButton("","🛥","Flotta",4,true)+
  navButton("office","🏛","La tua Marina",5,false)+
  navButton("map","🗺","Mappa",6,false)+
  navButton("refit","🏗","Cantiere & Refit",7,false)+
  navButton("crew","👥","Equipaggio",8,false)+
  navButton("charter","📄","Contratti & Charter",9,false)+
  navButton("marketplace","🛒","Marketplace",10,false)+
  navButton("community","💬","Community",11,false)+
  navButton("profile","👤","Profilo",12,false)+
 '</nav>';
 ui.nav.querySelectorAll("[data-mf4-go]").forEach(b=>b.onclick=()=>go(b.dataset.mf4Go));
}
function sync(){
 const on=active();
 document.body.classList.toggle("me-fleet4-active",on);
 if(on)render();
}
function boot(){
 if(width()>899)return;
 sync();
 const section=document.getElementById("fleet");
 if(section)new MutationObserver(()=>setTimeout(sync,30)).observe(section,{attributes:true,attributeFilter:["class","style"]});
 const list=document.getElementById("fleetList");
 if(list)new MutationObserver(()=>setTimeout(()=>{if(active())render()},50)).observe(list,{childList:true,subtree:true,attributes:true});
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>active()&&render(),80));
 window.addEventListener("resize",sync);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();