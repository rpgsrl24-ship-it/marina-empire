(()=>{
"use strict";
if(window.__ME_MOBILE_PREMIUM_VISUAL_POLISH_V1__)return;
window.__ME_MOBILE_PREMIUM_VISUAL_POLISH_V1__=true;
const st=document.createElement("style");
st.id="me-mobile-premium-visual-polish-v1";
st.textContent=`
@media(max-width:899px){
  :root{
    --me-premium-navy:#041b2a;
    --me-premium-sea:#0d4a63;
    --me-premium-sea2:#17677e;
    --me-premium-gold:#e9c46f;
    --me-premium-cream:#fff2c9;
  }

  /* Shared brighter premium language, aligned with Home */
  body.me-ml3-active,
  body.me-missions3-active,
  body.me-fleet4-active{
    background:
      radial-gradient(circle at 50% -8%,rgba(50,142,170,.28),transparent 34%),
      linear-gradient(180deg,#06283a 0%,#073247 48%,#031824 100%)!important;
  }

  .ml3-brandmark b,.mm3-brandmark b,.mf4-brandmark b{
    color:#f3d18a!important;
    text-shadow:0 2px 14px #0008;
  }

  .ml3-hud>button,.ml3-hud>div,
  .mm3-hud>button,.mm3-hud>div,
  .mf4-hud>button,.mf4-hud>div{
    background:linear-gradient(145deg,#23728d 0%,#0a3d57 58%,#082a40 100%)!important;
    border-color:rgba(242,198,111,.78)!important;
    box-shadow:inset 0 1px rgba(255,255,255,.12),0 7px 18px rgba(0,0,0,.32)!important;
  }

  .ml3-pagehead,.mm3-pagehead,.mf4-pagehead{
    padding-top:8px!important;padding-bottom:7px!important;
  }
  .ml3-title h2,.mm3-title h2,.mf4-title h2{
    color:#fff6df!important;
    text-shadow:0 2px 12px #0008;
    letter-spacing:.025em!important;
  }

  .ml3-summary,.mm3-summary,.mf4-summary{
    background:linear-gradient(145deg,#1b5c75,#0a344a)!important;
    border-color:rgba(124,207,229,.55)!important;
    box-shadow:0 8px 22px rgba(0,0,0,.34)!important;
  }

  /* More photographic hero treatment, like Home */
  .ml3-hero,.mm3-hero,.mf4-hero{
    min-height:220px!important;
    border-color:#e4bc6a!important;
    box-shadow:0 13px 32px rgba(0,0,0,.52)!important;
  }
  .ml3-hero:before{
    filter:brightness(1.7) saturate(1.55) contrast(1.03)!important;
  }
  .mm3-hero:before,.mf4-hero:before{
    filter:brightness(1.48) saturate(1.36) contrast(1.04)!important;
  }
  .mm3-hero:after,.mf4-hero:after{
    background:linear-gradient(180deg,rgba(1,15,24,.08) 5%,rgba(2,24,36,.12) 38%,rgba(2,20,31,.88) 100%)!important;
  }
  .mm3-herocopy strong,.mf4-herocopy strong{
    max-width:92%!important;
    font-size:22px!important;
    color:#fff1c6!important;
    text-shadow:0 3px 12px #000!important;
  }
  .mm3-herocopy span,.mf4-herocopy span{
    color:#edf7f8!important;
    font-size:9px!important;
    text-shadow:0 2px 8px #000!important;
  }

  /* Marina Live: sections feel like Home cards rather than admin panels */
  .ml3-card{
    border-color:rgba(224,181,99,.72)!important;
    background:
      radial-gradient(circle at 100% 0,rgba(60,155,185,.16),transparent 38%),
      linear-gradient(145deg,#14516a,#082d43)!important;
    box-shadow:0 9px 24px rgba(0,0,0,.36)!important;
  }
  .ml3-cardhead{
    min-height:45px!important;
    background:linear-gradient(90deg,rgba(35,111,139,.48),rgba(7,35,50,.1))!important;
    border-bottom:1px solid rgba(255,255,255,.07)!important;
  }
  .ml3-cardhead strong{color:#fff0bf!important;font-size:14px!important}
  .ml3-row{min-height:52px!important}
  .ml3-row b{font-size:10px!important;color:#f4fbfc!important}
  .ml3-row small{font-size:7.5px!important;color:#a9c0c8!important}
  .ml3-services{gap:7px!important}
  .ml3-service{
    min-height:82px!important;
    border-color:rgba(222,181,102,.5)!important;
    background:
      linear-gradient(180deg,rgba(14,86,112,.5),rgba(4,33,48,.95)),
      url("./anteprima/assets/render-2026/marine.jpg") center/cover!important;
    box-shadow:inset 0 -28px 40px rgba(1,20,30,.5),0 5px 13px rgba(0,0,0,.3)!important;
    text-shadow:0 2px 7px #000!important;
  }
  .ml3-service b{font-size:19px!important}
  .ml3-service span{font-size:7px!important}
  .ml3-weather{
    background:
      linear-gradient(90deg,rgba(5,39,57,.55),rgba(8,49,67,.92)),
      url("./anteprima/assets/render-2026/marine.jpg") center 70%/cover!important;
    border-radius:0 0 13px 13px!important;
  }

  /* Missions: add a photographic strip to every mission card */
  #missions.me-missions3-ready #missionList>.item{
    padding-top:92px!important;
    background:linear-gradient(145deg,#12465d,#08283b)!important;
    border-color:rgba(221,178,98,.72)!important;
    box-shadow:0 9px 22px rgba(0,0,0,.36)!important;
  }
  #missions.me-missions3-ready #missionList>.item:after{
    content:"";
    position:absolute;left:0;right:0;top:0;height:78px;
    background:
      linear-gradient(180deg,rgba(3,25,37,.05) 0%,rgba(3,25,37,.15) 52%,#0d3a4f 100%),
      url("./anteprima/assets/render-2026/charter.jpg") center 48%/cover no-repeat;
    filter:brightness(1.3) saturate(1.25);
    z-index:0;
  }
  #missions.me-missions3-ready #missionList>.item:nth-child(2n):after{
    background:
      linear-gradient(180deg,rgba(3,25,37,.05) 0%,rgba(3,25,37,.15) 52%,#0d3a4f 100%),
      url("./anteprima/assets/render-2026/hero-yacht.jpg") center 52%/cover no-repeat;
  }
  #missions.me-missions3-ready #missionList>.item:nth-child(3n):after{
    background:
      linear-gradient(180deg,rgba(3,25,37,.05) 0%,rgba(3,25,37,.15) 52%,#0d3a4f 100%),
      url("./anteprima/assets/render-2026/flotta.jpg") center 56%/cover no-repeat;
  }
  #missions.me-missions3-ready #missionList>.item>*{position:relative;z-index:2}
  #missions.me-missions3-ready #missionList>.item:before{z-index:4!important;top:8px!important}
  #missions.me-missions3-ready #missionList>.item>b,
  #missions.me-missions3-ready #missionList>.item>strong{
    color:#fff1c6!important;font-size:14px!important;
  }
  #missions.me-missions3-ready #missionList>.item p{
    color:#c8dce1!important;font-size:9px!important;
  }
  #missions.me-missions3-ready #missionList>.item button:not(:disabled){
    background:linear-gradient(135deg,#f0d17d,#c18a38)!important;
    box-shadow:0 6px 14px rgba(0,0,0,.32)!important;
  }
  #missions.me-missions3-ready .me-mission-search{
    padding:8px!important;
    border:1px solid rgba(221,180,99,.5)!important;
    border-radius:12px!important;
    background:linear-gradient(145deg,#12495f,#082b40)!important;
    box-shadow:0 6px 16px rgba(0,0,0,.26)!important;
  }

  /* Fleet: richer yacht cards, closer to Home's photographic tiles */
  #fleet.me-fleet4-ready .yacht-card{
    border-color:rgba(225,182,98,.72)!important;
    background:linear-gradient(145deg,#12495f,#082b40)!important;
    box-shadow:0 10px 26px rgba(0,0,0,.38)!important;
  }
  #fleet.me-fleet4-ready .yacht-visual{
    height:178px!important;
    filter:brightness(1.18) saturate(1.22)!important;
  }
  #fleet.me-fleet4-ready .yacht-detail>b{
    color:#fff1c6!important;
    font:800 18px/1.05 Georgia,serif!important;
  }
  #fleet.me-fleet4-ready .yacht-specs span{
    min-height:38px!important;
    display:flex!important;align-items:center!important;justify-content:center!important;
    background:linear-gradient(145deg,#15516a,#0b3349)!important;
    border-color:rgba(255,255,255,.12)!important;
    color:#eff8fa!important;
  }
  #fleet.me-fleet4-ready .yacht-detail button:not(:disabled){
    background:linear-gradient(135deg,#f0d17d,#c18a38)!important;
    box-shadow:0 6px 14px rgba(0,0,0,.32)!important;
  }
  #fleet.me-fleet4-ready .yacht-card.is-selected{
    border-color:#f3d47f!important;
    box-shadow:0 0 0 2px rgba(243,212,127,.16),0 11px 28px rgba(0,0,0,.42)!important;
  }

  /* Bottom nav becomes visually identical across premium pages */
  .ml3-bottom,.mm3-bottom,.mf4-bottom{
    background:linear-gradient(180deg,rgba(5,31,45,.95),rgba(3,21,33,.98))!important;
    border-top-color:rgba(228,185,102,.7)!important;
    box-shadow:0 -9px 24px rgba(0,0,0,.55)!important;
  }
  .ml3-bottom button.on,.mm3-bottom button.on,.mf4-bottom button.on{
    background:linear-gradient(145deg,#8e6920,#17445a)!important;
    color:#ffe080!important;
  }

  @media(max-width:390px){
    .ml3-hero,.mm3-hero,.mf4-hero{min-height:200px!important}
    #fleet.me-fleet4-ready .yacht-visual{height:155px!important}
  }
}
`;
document.head.appendChild(st);
})();