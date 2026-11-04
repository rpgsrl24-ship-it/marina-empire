(()=>{
"use strict";
if(window.__ME_PC_HOME_CLEANUP__)return;
window.__ME_PC_HOME_CLEANUP__=true;
const st=document.createElement("style");
st.id="me-pc-home-cleanup-style";
st.textContent=`
@media(min-width:900px){
  html body #navigation,
  html body header.top,
  html body .top,
  html body .stats,
  html body .me-top-onboarding,
  html body #meMobileNextStep,
  html body .mobile-game-nav,
  html body #meMobileMore,
  html body #meGameGuide,
  html body #meSupportDrawer,
  html body .me-beta-launch-notice,
  html body .me-mobile-home-dashboard{
    display:none!important;
    visibility:hidden!important;
    height:0!important;
    min-height:0!important;
    max-height:0!important;
    margin:0!important;
    padding:0!important;
    border:0!important;
    overflow:hidden!important;
  }

  html body .shell{
    position:relative!important;
    max-width:none!important;
    width:100vw!important;
    height:100vh!important;
    min-height:100vh!important;
    margin:0!important;
    padding:58px 112px 74px!important;
    overflow:hidden!important;
  }

  html body #home.screen{
    top:58px!important;
    left:112px!important;
    right:112px!important;
    bottom:74px!important;
    inset:auto 112px 74px 112px!important;
  }

  html body #home .game-lux-home{
    width:100%!important;
    height:100%!important;
    min-height:0!important;
    margin:0!important;
    padding:0!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
  }

  html body #home .hero{
    width:min(56vw,880px)!important;
    max-width:880px!important;
    aspect-ratio:16/9!important;
    height:auto!important;
    min-height:0!important;
    max-height:calc(100vh - 150px)!important;
    margin:0 auto!important;
  }

  html body.me-pc-panel-open #home .hero{
    width:min(38vw,620px)!important;
    max-width:620px!important;
  }

  html body .me-compact-hud{
    top:8px!important;
    left:160px!important;
    right:160px!important;
  }

  html body .me-command-rail{
    top:66px!important;
    bottom:82px!important;
  }
}
`;
document.head.appendChild(st);
})();