(()=>{
"use strict";
if(window.__ME_COMPACT_HUD__)return;
window.__ME_COMPACT_HUD__=true;
const st=document.createElement("style");
st.id="me-compact-hud-style";
st.textContent=`
.me-compact-hud{display:none}
@media(max-width:740px){
  .top{
    min-height:42px!important;height:auto!important;margin:0 0 4px!important;padding:5px 2px!important;
    display:flex!important;align-items:center!important;justify-content:space-between!important;border-bottom:1px solid rgba(185,149,87,.32)!important
  }
  .top>div:first-child{min-width:0!important}
  .top .brand{font-size:18px!important;line-height:1!important;letter-spacing:.09em!important;margin:0!important}
  .top small{display:none!important}
  .top .row{gap:4px!important}
  #captain{font-size:9px!important;color:#e8d2a3!important;max-width:92px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #menu{display:none!important}
  .stats{display:none!important}
  .me-top-onboarding{display:none!important}
  .me-compact-hud{
    display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin:4px 0 7px;padding:0;
  }
  .me-compact-hud>div{
    min-width:0;padding:6px 4px;border:1px solid rgba(185,149,87,.34);border-radius:9px;background:rgba(5,35,50,.86);
    text-align:center;box-shadow:inset 0 0 16px rgba(0,0,0,.12)
  }
  .me-compact-hud span{display:block;font-size:7px;line-height:1;color:#8daab7;letter-spacing:.06em;white-space:nowrap}
  .me-compact-hud b{display:block;margin-top:4px;color:#f0cd8b;font-size:11px;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .shell{padding-top:4px!important}
  #home .hero{min-height:calc(100svh - 174px)!important;height:calc(100svh - 174px)!important}
  #marinas .me-live-marina{min-height:0!important;height:auto!important}
  #map.me-trip-active #voyageCinema{min-height:calc(100svh - 174px)!important}
}
`;
document.head.appendChild(st);

const top=document.querySelector(".top");
if(top){
 const hud=document.createElement("div");
 hud.className="me-compact-hud";
 hud.id="meCompactHud";
 hud.innerHTML=
 '<div><span>🪙 MONETE</span><b id="meHudCoins">—</b></div>'+
 '<div><span>⭐ PRESTIGIO</span><b id="meHudPrestige">—</b></div>'+
 '<div><span>⛽ CARBURANTE</span><b id="meHudFuel">—</b></div>'+
 '<div><span>🔧 STATO</span><b id="meHudCondition">—</b></div>';
 top.insertAdjacentElement("afterend",hud);
}
function fmt(n){return Math.max(0,Math.floor(Number(n)||0)).toLocaleString("it-IT")}
function sync(){
 const s=typeof state!=="undefined"?state:null;
 const byId=id=>document.getElementById(id);
 const coins=s?fmt(s.coins):(byId("coins")?.textContent||"—");
 const prestige=s?fmt(s.prestige):(byId("prestige")?.textContent||"—");
 const fuel=s?fmt(s.fuel):(byId("fuel")?.textContent||"—");
 const condition=s?Math.max(0,Math.round(Number(s.condition)||0))+"%":(byId("meCondition")?.textContent||"—");
 if(byId("meHudCoins"))byId("meHudCoins").textContent=coins;
 if(byId("meHudPrestige"))byId("meHudPrestige").textContent=prestige;
 if(byId("meHudFuel"))byId("meHudFuel").textContent=fuel+" L";
 if(byId("meHudCondition"))byId("meHudCondition").textContent=condition;
}
window.addEventListener("marina-empire-updated",sync);
setInterval(sync,3000);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
})();