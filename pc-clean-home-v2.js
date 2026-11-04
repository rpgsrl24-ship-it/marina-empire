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
    display:grid!important;
    grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
    grid-template-rows:38px minmax(0,1fr)!important;
    gap:14px!important;
    align-items:stretch!important;
    justify-content:stretch!important;
  }

  #home .hero{
    grid-column:1!important;
    grid-row:2!important;
    width:100%!important;
    max-width:none!important;
    aspect-ratio:auto!important;
    height:100%!important;
    min-height:0!important;
    max-height:none!important;
    margin:0!important;
  }

  #home #meLongTermCareer{
    grid-column:2!important;
    grid-row:2!important;
    width:100%!important;
    height:100%!important;
    min-height:0!important;
    margin:0!important;
    overflow:auto!important;
  }

  #home .me-pc-live-ticker{
    grid-column:1 / -1!important;
    grid-row:1!important;
    display:grid!important;
    grid-template-columns:auto minmax(0,1fr)!important;
    align-items:center!important;
    gap:10px!important;
    min-width:0!important;
    height:38px!important;
    border:1px solid rgba(201,164,98,.55)!important;
    border-radius:11px!important;
    background:rgba(5,27,40,.94)!important;
    overflow:hidden!important;
    box-shadow:0 6px 18px rgba(0,0,0,.28)!important;
  }
  #home .me-pc-live-ticker-label{
    align-self:stretch!important;
    display:flex!important;
    align-items:center!important;
    padding:0 12px!important;
    border-right:1px solid rgba(201,164,98,.42)!important;
    color:#f0d29d!important;
    font-size:9px!important;
    font-weight:900!important;
    letter-spacing:.08em!important;
    white-space:nowrap!important;
    background:#0b3041!important;
  }
  #home .me-pc-live-ticker-window{
    min-width:0!important;
    overflow:hidden!important;
    white-space:nowrap!important;
  }
  #home .me-pc-live-ticker-track{
    display:flex!important;
    width:max-content!important;
    animation:mePcLiveTicker 32s linear infinite!important;
    will-change:transform!important;
  }
  #home .me-pc-live-ticker-copy{
    display:flex!important;
    align-items:center!important;
    flex-shrink:0!important;
  }
  #home .me-pc-live-ticker-item{
    padding:0 14px!important;
    color:#dce8ec!important;
    font-size:10px!important;
    font-weight:700!important;
  }
  #home .me-pc-live-ticker-sep{
    color:#caa96a!important;
    font-size:8px!important;
  }

  @keyframes mePcLiveTicker{
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
  }

  body.me-pc-panel-open #home .game-lux-home{
    grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)!important;
  }
  body.me-pc-panel-open #home .hero{
    width:100%!important;
    max-width:none!important;
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

  /* PC: all live messages live in the ticker, never over the command deck */
  #home .me-live-home-loc,
  #home .me-live-home-vhf,
  #home .me-live-home-traffic,
  #home .me-live-home-contract{
    display:none!important;
  }
}
`;
document.head.appendChild(st);
})();