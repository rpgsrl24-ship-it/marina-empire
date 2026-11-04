(()=>{
"use strict";
if(window.__ME_PC_CLEAN_HOME_V2__)return;
window.__ME_PC_CLEAN_HOME_V2__=true;
const st=document.createElement("style");
st.id="me-pc-clean-home-v2-style";
st.textContent=`
@media(min-width:900px){
  #navigation,
  .top,
  .stats,
  .me-top-onboarding,
  #meMobileNextStep,
  .mobile-game-nav,
  #meMobileMore,
  #meGameGuide,
  .me-mobile-home-dashboard,
  .me-beta-launch-notice,
  .me-utility-drawer{
    display:none!important;
    visibility:hidden!important;
    height:0!important;
    min-height:0!important;
    margin:0!important;
    padding:0!important;
    overflow:hidden!important;
  }

  .shell{
    position:relative!important;
    width:100vw!important;
    max-width:none!important;
    height:100vh!important;
    margin:0!important;
    padding:58px 112px 10px!important;
    overflow:hidden!important;
  }

  #home.screen{
    position:fixed!important;
    inset:58px 112px 10px!important;
    margin:0!important;
    padding:0!important;
    overflow:hidden!important;
  }

  #home .game-lux-home{
    width:100%!important;
    height:100%!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
  }

  #home .hero{
    width:min(46vw,740px)!important;
    max-width:740px!important;
    aspect-ratio:16/9!important;
    height:auto!important;
    min-height:0!important;
    max-height:calc(100vh - 116px)!important;
    margin:0 auto!important;
  }

  body.me-pc-panel-open #home .hero{
    width:min(34vw,540px)!important;
    max-width:540px!important;
  }

  .me-compact-hud{
    top:8px!important;
    left:160px!important;
    right:160px!important;
  }

  .me-command-rail{
    top:66px!important;
    bottom:22px!important;
  }

  .me-command-bottom{
    bottom:10px!important;
    width:min(46vw,740px)!important;
  }
}
`;
document.head.appendChild(st);
})();