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

  /* FINAL OVERRIDE: keep the bridge/command console visible */
  #home .me-live-home-loc{
    left:12px!important;
    top:12px!important;
    width:170px!important;
    padding:7px 9px!important;
    font-size:10px!important;
    background:rgba(4,31,44,.68)!important;
  }

  #home .me-live-home-vhf{
    top:12px!important;
    right:12px!important;
    left:auto!important;
    transform:none!important;
    width:220px!important;
    padding:8px 10px!important;
    background:rgba(4,31,44,.68)!important;
  }

  #home .me-live-home-traffic{
    left:12px!important;
    right:auto!important;
    top:82px!important;
    bottom:auto!important;
    width:185px!important;
    display:flex!important;
    flex-direction:column!important;
    gap:6px!important;
  }

  #home .me-live-home-traffic>div{
    padding:6px 8px!important;
    font-size:8px!important;
    background:rgba(3,28,41,.62)!important;
  }

  #home .me-live-home-traffic>div:nth-child(n+3){
    display:none!important;
  }

  #home .me-live-home-contract{
    left:12px!important;
    right:auto!important;
    bottom:12px!important;
    transform:none!important;
    width:310px!important;
    max-width:calc(100% - 24px)!important;
    padding:8px 10px!important;
    background:rgba(4,29,43,.72)!important;
  }
}
`;
document.head.appendChild(st);
})();