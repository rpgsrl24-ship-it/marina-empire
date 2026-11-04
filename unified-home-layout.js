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
    width:74px;height:68px;min-height:68px;padding:4px 2px;border:0;border-radius:12px;
    display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:transparent;
    font-size:25px;color:#e7edf0;box-shadow:none
  }
  .me-command-rail button::after{
    content:attr(title);display:block;max-width:68px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
    font-size:8px;line-height:1;color:#b9cad1;font-weight:800;letter-spacing:.03em
  }
  .me-command-rail button.on{background:#23485a;color:#f4d796;box-shadow:inset 0 0 0 1px rgba(214,181,117,.6)}
  .me-command-rail button.on::after{color:#f4d796}
  .me-command-drawer{
    position:fixed;top:78px;right:112px;z-index:9998;width:300px;
    padding:10px;background:#071f2df2;border:1px solid #b89458;border-radius:14px;
    box-shadow:0 12px 28px rgba(0,0,0,.55);backdrop-filter:blur(12px)
  }
  .me-command-drawer.open{display:grid!important;gap:7px}
  .me-command-drawer button{min-height:45px;text-align:left;padding:10px 12px;background:#0b3141;border:1px solid rgba(184,148,82,.35);color:#f5e4bc;font-size:11px;font-weight:800}
  .me-command-bottom{
    position:fixed;left:50%;right:auto;bottom:12px;z-index:9997;transform:translateX(-50%);
    width:min(54vw,800px);
    display:grid!important;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;
    padding:9px 11px;background:rgba(6,29,43,.96);border:1px solid #b89458;border-radius:14px;
    box-shadow:0 7px 24px rgba(0,0,0,.48);backdrop-filter:blur(12px)
  }
  .me-command-bottom small{font-size:9px!important}.me-command-bottom strong{font-size:13px!important}
  .me-command-bottom button{min-height:43px;padding:9px 15px!important;font-size:10px!important}

  #home .game-lux-home{display:flex!important;height:100%!important;align-items:center!important;justify-content:center!important}
  #home .cards,#home #meProgressionHub,#home .luxury-mini-map,#home .hero-copy{display:none!important}
  #home .hero{
    position:relative!important;overflow:hidden!important;
    width:min(46vw,740px)!important;max-width:740px!important;
    aspect-ratio:16/9!important;height:auto!important;min-height:0!important;max-height:calc(100vh - 102px)!important;
    margin:0 auto!important;
    border:1px solid #b99557!important;border-radius:18px!important;
    background-image:linear-gradient(180deg,rgba(2,16,27,.05),rgba(2,16,27,.10)),var(--me-bridge-bg)!important;
    background-size:cover!important;background-position:center center!important;background-repeat:no-repeat!important;
    box-shadow:0 14px 36px rgba(0,0,0,.42),0 0 0 10px rgba(4,23,34,.55),0 0 0 11px rgba(185,149,87,.28)!important
  }
  #home .hero:before,#home .hero:after{display:none!important}
  .me-live-home-overlay{display:block!important;position:absolute!important;inset:0!important;z-index:5!important;pointer-events:none}
  .me-live-home-loc{
    position:absolute!important;left:12px!important;top:12px!important;width:170px!important;padding:7px 9px!important;
    border:1px solid rgba(214,181,117,.58)!important;border-radius:10px!important;background:rgba(4,31,44,.72)!important;
    backdrop-filter:blur(8px)!important;font-size:10px!important;color:#dce7eb!important
  }
  .me-live-home-loc b{display:block!important;color:#f3d595!important;font-size:14px!important}
  .me-live-home-vhf{
    position:absolute!important;top:12px!important;right:12px!important;left:auto!important;transform:none!important;width:220px!important;
    padding:8px 10px!important;border:1px solid rgba(214,181,117,.56)!important;border-radius:11px!important;
    background:rgba(4,31,44,.72)!important;backdrop-filter:blur(9px)!important;pointer-events:auto!important
  }
  .me-live-home-vhf small{font-size:9px!important}.me-live-home-vhf strong{font-size:14px!important}
  .me-live-home-traffic{
    position:absolute!important;left:12px!important;right:auto!important;top:76px!important;bottom:auto!important;width:185px!important;
    display:flex!important;flex-direction:column!important;gap:6px!important
  }
  .me-live-home-traffic>div:nth-child(n+3){display:none!important}
  .me-live-home-traffic>div{
    padding:8px 10px!important;border-radius:10px!important;background:rgba(3,28,41,.72)!important;
    border:1px solid rgba(255,255,255,.1)!important;backdrop-filter:blur(7px)!important;font-size:9px!important;color:#b8ccd3!important
  }
  .me-live-home-traffic b{font-size:10px!important}
  .me-live-home-contract{
    position:absolute!important;left:12px!important;bottom:12px!important;transform:none!important;width:320px!important;max-width:calc(100% - 24px)!important;
    padding:8px 10px!important;border-radius:12px!important;border:1px solid #c29a60!important;background:rgba(4,29,43,.78)!important;
    backdrop-filter:blur(9px)!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:8px!important;
    align-items:center!important;pointer-events:auto!important
  }
  .me-live-home-contract small{font-size:9px!important}.me-live-home-contract strong{font-size:13px!important}
  .me-live-home-contract button{min-height:43px!important;padding:9px 14px!important;font-size:10px!important}
  .me-live-home-boat{font-size:28px!important}
  body.me-pc-panel-open #home .game-lux-home{justify-content:flex-start!important}
  body.me-pc-panel-open #home .hero{
    width:min(40vw,650px)!important;
    margin-left:0!important;margin-right:auto!important
  }
  body.me-pc-panel-open .me-command-bottom{
    left:calc(112px + min(20vw,325px))!important;
    width:min(36vw,590px)!important
  }
}
@media(min-width:900px) and (max-width:1199px){
  body.me-pc-panel-open #home .hero{width:36vw!important}
  body.me-pc-panel-open .me-command-bottom{
    left:calc(112px + 18vw)!important;
    width:32vw!important
  }
}
`;
document.head.appendChild(st);
})();