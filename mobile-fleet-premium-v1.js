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
 #fleet.me-fleet4-ready>.me-fleet-premium{
  margin:0!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important
 }
 #fleet.me-fleet4-ready .me-fleet-banner,
 #fleet.me-fleet4-ready .me-fleet-section-title,
 #fleet.me-fleet4-ready .fleet-command-strip,
 #fleet.me-fleet4-ready .me-secondary-details,
 #fleet.me-fleet4-ready .me-fleet-footer{display:none!important}

 #meFleetPremiumTop{display:flex;flex-direction:column;gap:9px;margin-bottom:9px;color:#f7f2e7}
 .mf4-topbar{display:flex;align-items:center;justify-content:space-between;gap:8px}
 .mf4-brand{min-width:0}.mf4-brand b{display:block;color:#f0ce86;font:800 21px Georgia,serif;letter-spacing:.055em;white-space:nowrap}.mf4-brand small{display:block;margin-top:1px;color:#9eb6c0;font-size:6.8px;font-weight:900;letter-spacing:.12em}
 .mf4-level{flex:0 0 104px;text-align:right}.mf4-level span{display:block;color:#f4d48c;font-size:8.5px;font-weight:950}.mf4-xp{height:6px;margin-top:5px;border-radius:99px;background:#173d50;overflow:hidden}.mf4-xp i{display:block;height:100%;background:linear-gradient(90deg,#ffe07d,#bf8b33)}

 .mf4-titlebar{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;padding:3px 3px 0}
 .mf4-titlebar h2{margin:0;color:#fff5d9;font:900 27px/1 Georgia,serif;text-shadow:0 2px 10px #000}.mf4-titlebar h2 span{color:#e7bf71;font:800 12px system-ui}.mf4-titlebar p{margin:5px 0 0;color:#d8e6e9;font-size:8.5px}.mf4-pagepill{flex:0 0 auto;padding:6px 8px;border:1px solid #d6ae62;border-radius:999px;background:#072a3de8;color:#f8dc9a;font-size:7.5px;font-weight:950}

 .mf4-hero{position:relative;height:238px;overflow:hidden;border:1px solid #e1b665;border-radius:16px;background:#0b536c;box-shadow:0 12px 30px #0008;isolation:isolate}
 .mf4-hero:before{content:"";position:absolute;inset:0;background:url("./anteprima/assets/render-2026/flotta.jpg") center 54%/cover no-repeat;filter:brightness(1.48) saturate(1.4) contrast(1.04);transform:scale(1.02)}
 .mf4-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#02151f08 15%,#02151f30 52%,#02151fe6 100%)}
 .mf4-herocopy{position:absolute;z-index:2;left:11px;right:11px;bottom:12px}.mf4-herocopy small{display:block;color:#72e3a1;font-size:7px;font-weight:950;letter-spacing:.12em}.mf4-herocopy strong{display:block;margin-top:3px;color:#fff1c5;font:900 21px/1.05 Georgia,serif;text-shadow:0 3px 10px #000}.mf4-herocopy span{display:block;margin-top:5px;color:#e6f0f2;font-size:8px;text-shadow:0 2px 8px #000}.mf4-herobadge{position:absolute;z-index:2;right:9px;top:9px;padding:5px 8px;border:1px solid #d7b267;border-radius:999px;background:#032636df;color:#f6dc9b;font-size:7px;font-weight:950}

 .mf4-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));overflow:hidden;border:1px solid #dfb361;border-radius:13px;background:linear-gradient(145deg,#184f68,#092e44);box-shadow:0 8px 21px #0005}
 .mf4-stats>div{min-width:0;padding:10px 4px;border-right:1px solid #ffffff15;text-align:center}.mf4-stats>div:last-child{border-right:0}
 .mf4-stats span{display:block;color:#b0c2c9;font-size:6.1px;font-weight:900;white-space:nowrap}.mf4-stats b{display:block;margin-top:4px;color:#fff;font-size:10.5px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mf4-stats .ok b{color:#68e491}.mf4-stats .goldv b{color:#ffd873}

 .mf4-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
 .mf4-actions button{min-width:0!important;min-height:52px!important;padding:7px 5px!important;border:1px solid #6d8f9e!important;border-radius:12px!important;background:linear-gradient(145deg,#15516a,#092f45)!important;color:#edf6f8!important;font-size:7.8px!important;font-weight:950!important;box-shadow:0 6px 17px #0004!important}
 .mf4-actions button b{display:inline-block;margin-right:4px;color:#f1cd78;font-size:15px;vertical-align:-1px}.mf4-actions button.primary{border-color:#ffd169!important;background:linear-gradient(145deg,#9a6c19,#18495e)!important;color:#fff3c9!important}

 .mf4-section{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;padding:4px 3px 0}.mf4-section small{display:block;color:#8daab5;font-size:6.7px;font-weight:950;letter-spacing:.1em}.mf4-section strong{display:block;margin-top:2px;color:#f3d58d;font:800 16px Georgia,serif}.mf4-section span{padding:4px 7px;border-radius:999px;background:#0a593a;color:#79eaa6;font-size:6.4px;font-weight:950}

 #fleet.me-fleet4-ready #fleetList{display:grid!important;gap:9px!important}
 #fleet.me-fleet4-ready #fleetList .yacht-card{
  position:relative!important;display:grid!important;grid-template-columns:42% minmax(0,1fr)!important;
  min-height:178px!important;margin:0!important;padding:0!important;overflow:hidden!important;
  border:1px solid rgba(225,181,96,.72)!important;border-radius:15px!important;
  background:linear-gradient(145deg,#12495f,#082b40)!important;box-shadow:0 9px 23px #0005!important
 }
 #fleet.me-fleet4-ready #fleetList .yacht-card.is-selected{border-color:#77e4a1!important;box-shadow:0 0 0 2px #63df9440,0 9px 23px #0006!important}
 #fleet.me-fleet4-ready #fleetList .yacht-visual{
  height:auto!important;min-height:178px!important;border-radius:0!important;background:
   linear-gradient(180deg,#03162005 5%,#03162025 52%,#031620b5 100%),
   url("./anteprima/assets/render-2026/flotta.jpg") center/cover no-repeat!important;
  filter:brightness(1.22) saturate(1.25)
 }
 #fleet.me-fleet4-ready #fleetList .yacht-card:nth-child(2n) .yacht-visual{background-image:linear-gradient(180deg,#03162005,#031620b0),url("./anteprima/assets/render-2026/hero-yacht.jpg")!important}
 #fleet.me-fleet4-ready #fleetList .yacht-card:nth-child(3n) .yacht-visual{background-image:linear-gradient(180deg,#03162005,#031620b0),url("./anteprima/assets/render-2026/charter.jpg")!important}
 #fleet.me-fleet4-ready #fleetList .yacht-visual small{top:8px!important;left:8px!important;padding:4px 7px!important;border:0!important;border-radius:999px!important;background:#6b4b1c!important;color:#ffe29c!important;font-size:6.4px!important;box-shadow:0 4px 10px #0007!important}
 #fleet.me-fleet4-ready #fleetList .is-selected .yacht-visual small{background:#0a593a!important;color:#80efac!important}
 #fleet.me-fleet4-ready #fleetList .yacht-detail{display:flex!important;flex-direction:column!important;justify-content:center!important;padding:11px 9px!important;min-width:0!important}
 #fleet.me-fleet4-ready #fleetList .yacht-detail>b{color:#fff1c6!important;font:800 15px/1.08 Georgia,serif!important}
 #fleet.me-fleet4-ready #fleetList .yacht-specs{display:grid!important;grid-template-columns:1fr 1fr!important;gap:5px 6px!important;margin-top:8px!important;color:#d4e2e6!important;font-size:7.7px!important}
 #fleet.me-fleet4-ready #fleetList .yacht-detail p{margin:7px 0 0!important;color:#c4d6db!important;font-size:7.6px!important;line-height:1.28!important}
 #fleet.me-fleet4-ready #fleetList .yacht-detail p:nth-of-type(2){display:none!important}
 #fleet.me-fleet4-ready #fleetList .yacht-detail button{
  width:100%!important;min-height:38px!important;margin-top:9px!important;padding:7px 8px!important;
  border:1px solid #e8c36b!important;border-radius:999px!important;background:linear-gradient(135deg,#47d86d,#15954b)!important;color:#fff!important;
  font-size:7.8px!important;font-weight:950!important;box-shadow:0 6px 14px #0004!important
 }
 #fleet.me-fleet4-ready #fleetList .yacht-detail button:disabled{border-color:#536774!important;background:#173746!important;color:#93a8b0!important;box-shadow:none!important;opacity:1!important}

 .mf4-bottom{position:fixed;z-index:93000;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));padding:5px max(5px,env(safe-area-inset-left)) calc(5px + env(safe-area-inset-bottom));border-top:1px solid #caa35d75;background:#041827f2;backdrop-filter:blur(14px);box-shadow:0 -7px 22px #0008}
 .mf4-bottom button{min-width:0!important;min-height:58px!important;padding:5px 2px!important;border:0!important;border-right:1px solid #ffffff10!important;border-radius:0!important;background:transparent!important;color:#dbe7ea!important;font-size:6.8px!important;font-weight:900!important;box-shadow:none!important}.mf4-bottom button:last-child{border-right:0!important}.mf4-bottom b{display:block;margin-bottom:4px;font-size:18px}.mf4-bottom .on{border:1px solid #f0c75f!important;border-radius:10px!important;background:linear-gradient(145deg,#85601d,#173f52)!important;color:#ffd970!important}
 @media(max-width:390px){.mf4-hero{height:220px}.mf4-titlebar h2{font-size:23px}#fleet.me-fleet4-ready #fleetList .yacht-card{grid-template-columns:39% minmax(0,1fr)!important}.mf4-actions button{font-size:7.1px!important}}
}
@media(min-width:900px){#meFleetPremiumTop,.mf4-bottom{display:none!important}}
`;
document.head.appendChild(style);

function w(){return Number(globalThis.innerWidth)||1024}
function sr(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function go(id){try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function fmt(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function boatName(){
 try{
  const s=sr()||{};
  if(typeof boats!=="undefined"){const b=boats.find(x=>x.id===s.boat);if(b)return b.name}
 }catch(_){}
 return "Yacht scuola"
}
function marinaName(){
 try{
  const s=sr()||{};
  return typeof port==="function"?(port(s.port)?.name||"Marina"):"Marina"
 }catch(_){return"Marina"}
}
function level(){
 const s=sr()||{},lv=Math.max(1,Math.floor(Number(s.level)||1)),xp=Math.max(0,Number(s.xp)||0),need=Math.max(1000,lv*3500);
 return {lv,pct:Math.max(5,Math.min(100,Math.round((xp%need)/need*100)))}
}
function ensure(){
 if(w()>899)return null;
 const fleet=document.getElementById("fleet"),panel=fleet?.querySelector(".me-fleet-premium");if(!fleet||!panel)return null;
 fleet.classList.add("me-fleet4-ready");
 let top=document.getElementById("meFleetPremiumTop");
 if(!top){
  top=document.createElement("section");top.id="meFleetPremiumTop";
  top.innerHTML=
   '<div class="mf4-topbar"><div class="mf4-brand"><b>⚓ MARINA EMPIRE</b><small>IL GESTIONALE NAUTICO ONLINE</small></div><div class="mf4-level"><span id="mf4Level">LIVELLO 1</span><div class="mf4-xp"><i id="mf4Xp"></i></div></div></div>'+
   '<div class="mf4-titlebar"><div><h2>LA TUA <span>FLOTTA</span></h2><p>Gestisci gli yacht e prepara la prossima rotta.</p></div><div class="mf4-pagepill">4 / 12</div></div>'+
   '<div class="mf4-hero"><div class="mf4-herobadge" id="mf4HeroBadge">YACHT ATTIVO</div><div class="mf4-herocopy"><small>HANGAR NAUTICO</small><strong id="mf4HeroBoat">La tua imbarcazione</strong><span id="mf4HeroText">Pronta per il prossimo incarico.</span></div></div>'+
   '<div class="mf4-stats"><div><span>YACHT</span><b id="mf4BoatCount">1</b></div><div class="goldv"><span>MONETE</span><b id="mf4Coins">—</b></div><div class="ok"><span>CARBURANTE</span><b id="mf4Fuel">—</b></div><div><span>CONDIZIONI</span><b id="mf4Condition">—</b></div></div>'+
   '<div class="mf4-actions"><button type="button" class="primary" data-mf4-go="map"><b>🧭</b>PIANIFICA ROTTA</button><button type="button" data-mf4-go="missions"><b>🎯</b>CERCA MISSIONE</button><button type="button" data-mf4-go="office"><b>＋</b>ESPANDI FLOTTA</button></div>'+
   '<div class="mf4-section"><div><small>IMBARCAZIONI DISPONIBILI</small><strong>Il tuo hangar</strong></div><span>● DATI LIVE</span></div>';
  panel.insertBefore(top,panel.firstChild);
 }
 let bottom=document.getElementById("mf4Bottom");
 if(!bottom){
  bottom=document.createElement("nav");bottom.id="mf4Bottom";bottom.className="mf4-bottom";bottom.setAttribute("aria-label","Navigazione Marina Empire");
  bottom.innerHTML=
   '<button type="button" data-mf4-go="home"><b>⌂</b>HOME</button>'+
   '<button type="button" class="on" data-mf4-go="fleet"><b>🛥️</b>FLOTTA</button>'+
   '<button type="button" data-mf4-go="missions"><b>🎯</b>MISSIONI</button>'+
   '<button type="button" data-mf4-go="marinas"><b>⚓</b>MARINA</button>'+
   '<button type="button" data-mf4-go="map"><b>🗺️</b>MAPPA</button>';
  fleet.appendChild(bottom);
 }
 if(!fleet.dataset.mf4Bound){
  fleet.dataset.mf4Bound="1";
  fleet.addEventListener("click",e=>{
   const b=e.target.closest("[data-mf4-go]");if(!b)return;
   e.preventDefault();go(b.dataset.mf4Go);
  });
 }
 return fleet;
}
function sync(){
 if(w()>899){document.body.classList.remove("me-fleet4-active");return}
 const fleet=ensure();if(!fleet)return;
 const active=!fleet.classList.contains("hide");
 document.body.classList.toggle("me-fleet4-active",active);
 if(!active)return;
 const s=sr()||{},lv=level();
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
 set("mf4Level","LIVELLO "+lv.lv);const xp=document.getElementById("mf4Xp");if(xp)xp.style.width=lv.pct+"%";
 const name=boatName();set("mf4HeroBoat",name);set("mf4HeroText",marinaName()+" · pronto alla navigazione");
 set("mf4HeroBadge",s.trip?"IN NAVIGAZIONE":"YACHT ATTIVO");
 set("mf4BoatCount",Array.isArray(s.owned)?s.owned.length:1);set("mf4Coins",fmt(s.coins??s.credits??0));
 set("mf4Fuel",fmt(s.fuel??0)+" L");set("mf4Condition",Math.max(0,Math.round(Number(s.condition)||0))+"%");
}
function boot(){
 ensure();sync();
 const fleet=document.getElementById("fleet");
 if(fleet)new MutationObserver(sync).observe(fleet,{attributes:true,attributeFilter:["class"],childList:true,subtree:false});
 window.addEventListener("resize",sync);window.addEventListener("marina-empire-updated",()=>setTimeout(sync,0));
 document.addEventListener("click",e=>{if(e.target.closest("#fleet [data-boat]"))setTimeout(sync,80)});
 setInterval(()=>{if(document.body.classList.contains("me-fleet4-active"))sync()},1500);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();