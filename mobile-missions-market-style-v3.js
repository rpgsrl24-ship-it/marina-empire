(()=>{"use strict";
if(window.__ME_MISSIONS_MARKET_STYLE_V3__)return;
window.__ME_MISSIONS_MARKET_STYLE_V3__=true;
const st=document.createElement("style");
st.id="me-missions-market-style-v3";
st.textContent=`
@media(max-width:899px){
 body.me-missions3-active{background:#eaf6fb!important;color:#0a2940!important}
 #missions.me-missions3-ready{
   background:linear-gradient(180deg,#073d68 0,#0b73aa 22%,#eaf6fb 22%,#f8fcfe 100%)!important;
   color:#0a2940!important;
   padding:8px 8px 94px!important
 }
 #missions.me-missions3-ready>.panel{
   border:1px solid #bad5e4!important;
   background:#fff!important;
   box-shadow:0 4px 14px #0d487020!important
 }
 #meMissionsPremiumTop{color:#0a2940!important}
 .mm3-topbar{
   padding:10px 10px 8px!important;
   border-radius:15px!important;
   background:linear-gradient(180deg,#003d6e99,#005e9dcc),url("./anteprima/assets/render-2026/marine.jpg") center/cover!important;
   box-shadow:0 7px 18px #00365f33!important
 }
 .mm3-brand b{color:#fff!important;text-shadow:0 2px 8px #00335688!important}
 .mm3-brand small{color:#d9f3ff!important}
 .mm3-level span{color:#fff3bf!important}
 .mm3-xp{background:#0a4b78!important;border:1px solid #76c3ee!important}
 .mm3-xp i{background:linear-gradient(90deg,#f9d45f,#c7911b)!important}
 .mm3-titlebar{padding:5px 7px 0!important}
 .mm3-titlebar h2{color:#0a2940!important;text-shadow:none!important;font-family:Inter,system-ui,sans-serif!important;font-size:30px!important}
 .mm3-titlebar h2 span{color:#0d5fb8!important}
 .mm3-titlebar p{color:#506d7c!important;font-size:9px!important}
 .mm3-pagepill{border:1px solid #8fc8e8!important;background:#fff!important;color:#0d5fb8!important}
 .mm3-hero{
   height:220px!important;
   border:1px solid #bad5e4!important;
   box-shadow:0 5px 18px #0d48702b!important
 }
 .mm3-hero:before{filter:brightness(1.2) saturate(1.2)!important}
 .mm3-hero:after{background:linear-gradient(180deg,#0011 10%,#00224c22 48%,#002949d8 100%)!important}
 .mm3-herobadge{
   border:1px solid #ffde78!important;background:linear-gradient(180deg,#f9d45f,#c7911b)!important;
   color:#4d3300!important;box-shadow:0 3px 10px #3d2b0030!important
 }
 .mm3-herocopy small{color:#dff8ff!important}
 .mm3-herocopy strong{color:#fff!important;text-shadow:0 2px 8px #003356!important}
 .mm3-herocopy span{color:#eaf8ff!important}
 .mm3-stats{
   border:1px solid #76c3ee!important;
   background:#0a4b78e6!important;
   box-shadow:0 4px 12px #0d487020!important
 }
 .mm3-stats>button,.mm3-stats>div{border-right:1px solid #76c3ee!important;color:#fff!important}
 .mm3-stats span{color:#d8f3ff!important}
 .mm3-stats b,.mm3-stats .gold b{color:#fff!important}
 .mm3-stats .ok b{color:#8fffb2!important}
 #meMissionRepBanner{
   border:1px solid #abcde0!important;
   background:linear-gradient(#fff,#e8f4f9)!important;
   box-shadow:0 4px 14px #0d487020!important
 }
 #meMissionRepBanner strong{color:#0a2940!important}
 #meMissionRepBanner small{color:#506d7c!important}
 #meMissionRepBanner .lv{color:#0d5fb8!important}
 #meMissionRepBanner .bar{background:#d7e9f2!important}
 #meMissionRepBanner .bar i{background:linear-gradient(90deg,#1ccaff,#0768f3)!important}
 #meMissionsCategoryBar button{
   border:1px solid #abcde0!important;
   background:linear-gradient(#fff,#e8f4f9)!important;
   color:#0b2b42!important;
   box-shadow:0 3px 10px #0d487018!important
 }
 #meMissionsCategoryBar button.on{
   border-color:#71cff3!important;
   background:linear-gradient(180deg,#159df3,#0869da)!important;
   color:#fff!important;
   box-shadow:0 0 14px #50d8ff55!important
 }
 #mmrv2-standard>.panel{
   border:1px solid #bad5e4!important;
   background:#fff!important
 }
 #missions.me-missions3-ready .me-mission-search{
   border:1px solid #abcde0!important;
   background:linear-gradient(#fff,#e8f4f9)!important;
   box-shadow:0 4px 14px #0d487018!important
 }
 #meMissionSearch,#meMissionFilter{
   border:2px solid #8fc8e8!important;
   background:#fff!important;color:#123!important;font-size:16px!important
 }
 #meMissionCount{color:#506d7c!important}
 #missionList{gap:8px!important}
 #missionList>.item{
   min-height:145px!important;
   border:1px solid #bad5e4!important;
   background:#fff!important;
   box-shadow:0 4px 14px #0d487020!important;
   color:#0a2940!important
 }
 #missionList>.item:after{
   filter:brightness(1.08) saturate(1.12)!important
 }
 #missionList>.item:before{
   background:#0d5fb8!important;color:#fff!important;box-shadow:0 3px 8px #0d487030!important
 }
 #missionList>.item[data-mm3-state="locked"]:before{background:#d79c27!important;color:#fff!important}
 #missionList>.item[data-mm3-state="active"]:before{background:#d73931!important;color:#fff!important}
 #missionList>.item>b,#missionList>.item>strong{
   color:#0a2940!important;
   font-family:Inter,system-ui,sans-serif!important;
   font-weight:950!important
 }
 #missionList>.item p{color:#506d7c!important}
 #missionList>.item p:nth-of-type(2){color:#0c3193!important}
 #missionList>.item button{
   border:1px solid #71cff3!important;
   background:linear-gradient(180deg,#159df3,#0869da)!important;
   color:#fff!important;
   box-shadow:0 3px 10px #0d487030!important
 }
 #missionList>.item button:disabled{
   border-color:#cbdde7!important;background:#e8f0f4!important;color:#78909b!important
 }
 .mm3-trip{
   border:1px solid #abcde0!important;background:linear-gradient(#fff,#e8f4f9)!important
 }
 .mm3-trip small{color:#506d7c!important}.mm3-trip strong{color:#0a2940!important}
 .mm3-special{
   border:1px solid #bad5e4!important;
   box-shadow:0 4px 14px #0d487020!important
 }
 .mm3-special:after{background:linear-gradient(90deg,#003d6ee8 0%,#005e9db5 58%,#005e9d2d 100%)!important}
 .mm3-specialcopy strong{color:#fff!important}.mm3-specialcopy span{color:#eaf8ff!important}
 .mm3-specialcopy button{background:linear-gradient(180deg,#f9d45f,#c7911b)!important;color:#4d3300!important}
 .mm3-bottom-wrap{
   border-top:1px solid #58c1eb!important;background:#06243af5!important;box-shadow:0 -8px 24px #0005!important
 }
 .mm3-bottom button{color:#fff!important}
 .mm3-bottom button small{color:#bfeaff!important}
 .mm3-bottom button.on{
   border:1px solid #58c1eb!important;
   background:linear-gradient(180deg,#1ccaff,#0768f3)!important;
   color:#fff!important;
   box-shadow:0 0 12px #4addff!important
 }
 .mmrv2-sheet{
   border:1px solid #bad5e4!important;
   background:#fff!important;color:#0a2940!important
 }
 .mmrv2-sheet-body p{color:#506d7c!important}
 .mmrv2-sheet-meta div{border:1px solid #abcde0!important;background:#f4fafd!important}
 .mmrv2-sheet-meta span{color:#506d7c!important}
 .mmrv2-sheet-meta b{color:#0c3193!important}
 .mmrv2-sheet-actions .close{border:1px solid #abcde0!important;background:#eaf6fb!important;color:#0a2940!important}
}
`;
document.head.appendChild(st);
})();