(()=>{
"use strict";
if(window.__ME_UNIFIED_HOME_LAYOUT__)return;
window.__ME_UNIFIED_HOME_LAYOUT__=true;
const st=document.createElement("style");
st.id="me-unified-home-layout-style";
st.textContent=`
/* Same command-deck concept on desktop/tablet */
@media(min-width:900px){
  body{padding-bottom:0!important}
  #navigation,.mobile-game-nav,#meMobileMore,#meGameGuide,.me-mobile-home-dashboard,.me-beta-launch-notice{display:none!important}
  .top{display:none!important}
  .stats{display:none!important}
  .me-compact-hud{
    display:grid!important;position:fixed;top:8px;left:150px;right:150px;z-index:9997;
    grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:0!important
  }
  .me-compact-hud>div{
    padding:8px 10px!important;border:1px solid rgba(185,149,87,.45)!important;border-radius:11px!important;
    background:rgba(5,35,50,.90)!important;backdrop-filter:blur(10px)!important
  }
  .me-compact-hud span{font-size:9px!important}.me-compact-hud b{font-size:14px!important}

  .shell{max-width:none!important;padding:58px 118px 10px!important}
  .me-command-rail{
    position:fixed;top:72px;bottom:28px;z-index:9996;
    display:flex!important;flex-direction:column;gap:11px;justify-content:center;
    width:92px;padding:8px;background:rgba(3,20,32,.91);
    border:1px solid rgba(194,154,96,.48);backdrop-filter:blur(12px);
    box-shadow:0 10px 28px rgba(0,0,0,.38)
  }
  .me-command-rail.left{left:12px;border-radius:16px}
  .me-command-rail.right{right:12px;border-radius:16px}
  .me-command-rail button{
    width:74px;height:68px;min-height:68px;padding:0;border:0;border-radius:12px;
    display:flex!important;align-items:center;justify-content:center;background:transparent;
    font-size:27px;color:#e7edf0;box-shadow:none
  }
  .me-command-rail button.on{background:#23485a;color:#f4d796;box-shadow:inset 0 0 0 1px rgba(214,181,117,.6)}
  .me-command-drawer{
    position:fixed;top:78px;right:112px;z-index:9998;width:300px;
    padding:10px;background:#071f2df2;border:1px solid #b89458;border-radius:14px;
    box-shadow:0 12px 28px rgba(0,0,0,.55);backdrop-filter:blur(12px)
  }
  .me-command-drawer.open{display:grid!important;gap:7px}
  .me-command-drawer button{min-height:45px;text-align:left;padding:10px 12px;background:#0b3141;border:1px solid rgba(184,148,82,.35);color:#f5e4bc;font-size:11px;font-weight:800}
  .me-command-bottom{
    position:fixed;left:250px;right:250px;bottom:12px;z-index:9997;
    display:grid!important;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;
    padding:10px 12px;background:rgba(6,29,43,.96);border:1px solid #b89458;border-radius:14px;
    box-shadow:0 7px 24px rgba(0,0,0,.48);backdrop-filter:blur(12px)
  }
  .me-command-bottom small{font-size:9px!important}.me-command-bottom strong{font-size:13px!important}
  .me-command-bottom button{min-height:43px;padding:9px 15px!important;font-size:10px!important}

  #home .game-lux-home{display:block!important}
  #home .cards,#home #meProgressionHub,#home .luxury-mini-map,#home .hero-copy{display:none!important}
  #home .hero{
    position:relative!important;overflow:hidden!important;
    height:calc(100vh - 78px)!important;min-height:560px!important;margin:0!important;
    border:1px solid #b99557!important;border-radius:18px!important;
    background-image:linear-gradient(180deg,rgba(2,16,27,.05),rgba(2,16,27,.10)),var(--me-bridge-bg)!important;
    background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;
    box-shadow:0 14px 36px rgba(0,0,0,.42)!important
  }
  #home .hero:before,#home .hero:after{display:none!important}
  .me-live-home-overlay{display:block!important;position:absolute!important;inset:0!important;z-index:5!important;pointer-events:none}
  .me-live-home-loc{
    position:absolute!important;left:20px!important;top:22px!important;padding:9px 12px!important;
    border:1px solid rgba(214,181,117,.58)!important;border-radius:11px!important;background:rgba(4,31,44,.80)!important;
    backdrop-filter:blur(9px)!important;font-size:11px!important;color:#dce7eb!important
  }
  .me-live-home-loc b{display:block!important;color:#f3d595!important;font-size:14px!important}
  .me-live-home-vhf{
    position:absolute!important;top:22px!important;left:50%!important;transform:translateX(-50%)!important;width:min(46%,620px)!important;
    padding:11px 13px!important;border:1px solid rgba(214,181,117,.56)!important;border-radius:13px!important;
    background:rgba(4,31,44,.82)!important;backdrop-filter:blur(11px)!important;pointer-events:auto!important
  }
  .me-live-home-vhf small{font-size:9px!important}.me-live-home-vhf strong{font-size:14px!important}
  .me-live-home-traffic{
    position:absolute!important;left:22px!important;right:22px!important;bottom:102px!important;
    display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important
  }
  .me-live-home-traffic>div{
    padding:8px 10px!important;border-radius:10px!important;background:rgba(3,28,41,.72)!important;
    border:1px solid rgba(255,255,255,.1)!important;backdrop-filter:blur(7px)!important;font-size:9px!important;color:#b8ccd3!important
  }
  .me-live-home-traffic b{font-size:10px!important}
  .me-live-home-contract{
    position:absolute!important;left:50%!important;bottom:18px!important;transform:translateX(-50%)!important;width:min(72%,900px)!important;
    padding:11px 13px!important;border-radius:14px!important;border:1px solid #c29a60!important;background:rgba(4,29,43,.92)!important;
    backdrop-filter:blur(11px)!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:10px!important;
    align-items:center!important;pointer-events:auto!important
  }
  .me-live-home-contract small{font-size:9px!important}.me-live-home-contract strong{font-size:13px!important}
  .me-live-home-contract button{min-height:43px!important;padding:9px 14px!important;font-size:10px!important}
  .me-live-home-boat{font-size:28px!important}
}
`;
document.head.appendChild(st);
})();