(()=>{
"use strict";
if(window.__ME_MOBILE_CONSOLE_HOME_V1__)return;
function meViewportWidth(){return typeof globalThis!=="undefined"&&Number.isFinite(Number(globalThis.innerWidth))?Number(globalThis.innerWidth):1024}
window.__ME_MOBILE_CONSOLE_HOME_V1__=true;

const style=document.createElement("style");
style.id="me-mobile-console-home-v1-style";
style.textContent=`
@media(max-width:740px){
  html body .top small{display:none!important}
  html body #meBetaHelp{display:none!important}

  #home .me-mobile-home-continue,
  #home .me-mobile-home-grid,
  #home #meMobileHomeSectionTitle,
  #home #meMobileEmpireActions,
  #home #meMobileMarinaLiveCard{display:none!important}

  #home .me-mobile-home-dashboard{
    display:flex!important;
    flex-direction:column!important;
    gap:10px!important;
    padding:4px 0 96px!important;
  }

  #meMobileConsoleHome{
    order:-30!important;
    position:relative!important;
    min-height:46svh!important;
    max-height:470px!important;
    overflow:hidden!important;
    border:1px solid #c39b5a!important;
    border-radius:18px!important;
    background:
      linear-gradient(180deg,rgba(0,12,21,.16) 0%,rgba(0,12,21,.03) 42%,rgba(0,12,21,.82) 100%),
      var(--me-bridge-bg),
      url('./anteprima/assets/render-2026/hero-yacht.jpg') center/cover no-repeat!important;
    background-size:cover!important;
    background-position:center center!important;
    box-shadow:0 14px 34px rgba(0,0,0,.45)!important;
  }
  #meMobileConsoleHome:after{
    content:"";
    position:absolute;inset:0;
    background:linear-gradient(90deg,rgba(1,20,30,.12),transparent 48%,rgba(1,20,30,.12));
    pointer-events:none;
  }
  .me-mobile-console-live{
    position:absolute;z-index:2;top:10px;left:10px;right:10px;
    display:flex;align-items:center;justify-content:space-between;gap:8px;
    padding:8px 10px;border:1px solid rgba(225,190,119,.55);border-radius:11px;
    background:rgba(3,27,39,.76);backdrop-filter:blur(7px);
  }
  .me-mobile-console-live span{
    color:#e5c783;font-size:9px;font-weight:950;letter-spacing:.1em
  }
  .me-mobile-console-live strong{
    min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    color:#fff3d0;font-size:10px;text-align:right
  }
  .me-mobile-console-foot{
    position:absolute;z-index:2;left:10px;right:10px;bottom:10px;
    display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:end;
    padding:10px;border:1px solid rgba(222,181,105,.5);border-radius:13px;
    background:rgba(3,24,35,.84);backdrop-filter:blur(8px)
  }
  .me-mobile-console-copy small{
    display:block;color:#9eb8c1;font-size:8px;font-weight:800;letter-spacing:.08em
  }
  .me-mobile-console-copy strong{
    display:block;margin-top:2px;color:#f6d798;font-size:16px;line-height:1.05
  }
  .me-mobile-console-copy span{
    display:block;margin-top:4px;color:#d7e5e9;font-size:9px;line-height:1.2
  }
  .me-mobile-console-actions{
    display:grid;grid-template-columns:1fr 1fr;gap:6px
  }
  .me-mobile-console-actions button{
    min-width:76px!important;min-height:44px!important;padding:7px 8px!important;
    border:1px solid #d2ac63!important;border-radius:10px!important;
    background:#0c3a4d!important;color:#f7d99d!important;
    font-size:9px!important;font-weight:950!important
  }
  .me-mobile-console-actions button:last-child{
    background:linear-gradient(135deg,#c99a44,#9f6e2e)!important;
    color:#102532!important
  }

  #meMobileCreditsHero{
    order:-20!important;
    grid-template-columns:minmax(0,1fr) auto!important;
    padding:11px 12px!important;
    border-radius:14px!important
  }
  #meMobileCreditsHero strong{font-size:15px!important}
  #meMobileCreditsHero span{font-size:9px!important}
  #meMobileCreditsHero button{min-height:43px!important}

  #meMobileConsoleManage{
    order:-10!important;
    display:grid!important;
    grid-template-columns:repeat(4,minmax(0,1fr))!important;
    gap:6px!important
  }
  #meMobileConsoleManage button{
    min-width:0!important;min-height:64px!important;padding:8px 3px!important;
    border:1px solid rgba(193,156,92,.45)!important;border-radius:11px!important;
    background:#092d3d!important;color:#ecd092!important;
    font-size:8.5px!important;font-weight:900!important;white-space:normal!important
  }
  #meMobileConsoleManage button span{
    display:block!important;margin-bottom:4px!important;font-size:19px!important
  }

  #home .me-mobile-home-goal{
    order:0!important;
    margin:0!important;
    padding:11px!important;
    border-radius:13px!important
  }
  #home .me-mobile-home-goal-copy strong{font-size:10px!important}
  #home .me-mobile-home-goal-copy small,#home .me-mobile-goal-foot{font-size:8.5px!important}

  html body .mobile-game-nav{
    box-shadow:0 -8px 26px rgba(0,0,0,.36)!important
  }
}
@media(min-width:741px){
  #meMobileConsoleHome,#meMobileConsoleManage{display:none!important}
}
`;
document.head.appendChild(style);

function go(id){if(typeof showTab==="function")showTab(id)}
function safeText(value,fallback){const s=String(value??"").trim();return s||fallback}
function liveSummary(){
  try{
    const p=typeof port==="function"&&typeof state!=="undefined"?port(state.port):null;
    const b=typeof boat==="function"&&typeof state!=="undefined"?boat(state.boat):null;
    const marina=safeText(p?.name,"Marina");
    const yacht=safeText(b?.name,"Yacht");
    const trip=typeof state!=="undefined"?state.trip:null;
    if(trip){
      const d=typeof port==="function"?port(trip.dest):null;
      return {live:marina+" · IN NAVIGAZIONE",title:yacht,sub:"Rotta verso "+safeText(d?.name,"destinazione")};
    }
    return {live:marina+" · MARINA LIVE",title:yacht,sub:"Pronto per la prossima missione"};
  }catch(_){
    return {live:"MARINA LIVE",title:"Il tuo yacht",sub:"Pronto a navigare"};
  }
}
function sync(){
  const data=liveSummary();
  const l=document.getElementById("meMobileConsoleLiveText");
  const t=document.getElementById("meMobileConsoleYacht");
  const s=document.getElementById("meMobileConsoleSub");
  if(l)l.textContent=data.live;
  if(t)t.textContent=data.title;
  if(s)s.textContent=data.sub;
}
function ensure(){
  if(meViewportWidth()>740)return;
  const home=document.querySelector("#home .me-mobile-home-dashboard");
  if(!home)return;

  if(!document.getElementById("meMobileConsoleHome")){
    const consoleHome=document.createElement("article");
    consoleHome.id="meMobileConsoleHome";
    consoleHome.innerHTML=
      '<div class="me-mobile-console-live"><span>⚓ MARINA LIVE</span><strong id="meMobileConsoleLiveText">MARINA LIVE</strong></div>'+
      '<div class="me-mobile-console-foot">'+
        '<div class="me-mobile-console-copy"><small>POSTO DI COMANDO</small><strong id="meMobileConsoleYacht">Il tuo yacht</strong><span id="meMobileConsoleSub">Pronto a navigare</span></div>'+
        '<div class="me-mobile-console-actions"><button type="button" data-console-go="missions">🎯 MISSIONE</button><button type="button" data-console-go="map">🧭 NAVIGA</button></div>'+
      '</div>';
    consoleHome.addEventListener("click",e=>{
      const b=e.target.closest("[data-console-go]");
      if(b)go(b.dataset.consoleGo);
    });
    home.prepend(consoleHome);
  }

  if(!document.getElementById("meMobileConsoleManage")){
    const manage=document.createElement("div");
    manage.id="meMobileConsoleManage";
    manage.innerHTML=
      '<button type="button" data-console-manage="office"><span>◈</span>DIREZIONE</button>'+
      '<button type="button" data-console-manage="marinas"><span>⚓</span>MARINE</button>'+
      '<button type="button" data-console-manage="marketplace"><span>🛒</span>MARKET</button>'+
      '<button type="button" data-console-community="1"><span>💬</span>COMMUNITY</button>';
    manage.addEventListener("click",e=>{
      const b=e.target.closest("button");if(!b)return;
      if(b.dataset.consoleCommunity){
        go("office");
        setTimeout(()=>document.getElementById("marinaCommunity")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
      }else if(b.dataset.consoleManage)go(b.dataset.consoleManage);
    });
    const credits=document.getElementById("meMobileCreditsHero");
    if(credits)credits.insertAdjacentElement("afterend",manage);
    else home.append(manage);
  }
  sync();
}
window.addEventListener("resize",ensure);
window.addEventListener("marina-empire-updated",()=>{ensure();sync()});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensure,{once:true});else ensure();
setTimeout(ensure,250);
setInterval(sync,4000);
})();