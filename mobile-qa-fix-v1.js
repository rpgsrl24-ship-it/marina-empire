(()=>{"use strict";if(window.__ME_MOBILE_QA_FIX_V1__)return;window.__ME_MOBILE_QA_FIX_V1__=true;
const st=document.createElement("style");st.id="me-mobile-qa-fix-v1";st.textContent=`
@media(max-width:899px){
html,body{overflow-x:hidden!important}
.screen{max-width:100vw!important}
.me-sec-ready,.me-map5-ready,.me-marinas6-ready,.me-fleet4-ready,.me-missions3-ready{overscroll-behavior:contain!important}
#missions button,#marketplace button,#marinas button,#office button,#credits button,#community button{min-height:42px}
#missions #missionList button,.me-market-actions button,.me-market-tabs button,.me-market-filters button,#marinas [id*="job"] button,#marinas button{font-size:8px!important}
#missions #missionList .item{overflow:visible!important}
#marketplace .me-market-price{overflow-wrap:anywhere!important;word-break:break-word!important}
#marketplace .me-market-tabs button,#marketplace .me-market-filters button{min-width:max-content!important;padding:9px 11px!important}
#office,#office *{max-width:100%!important;box-sizing:border-box!important}
#office .row,#office .me-marina-live-stats,#office .cloudActions,#office [style*="display:flex"]{flex-wrap:wrap!important}
#office table{display:block!important;max-width:100%!important;overflow-x:auto!important}
#map select,#marinas select{width:100%!important;max-width:100%!important;min-width:0!important}
#map input[type="number"],#map input[type="text"],#map select{font-size:16px!important}
#map .map-info-bar button,#marinas button{white-space:normal!important}#marinas .me-marina-advertising{display:none!important}#marinas .marina-business-heading,#marinas #businessList{display:none!important}
#meMobileMore{z-index:99999!important}
body.me-missions3-active .mobile-game-nav,body.me-fleet4-active .mobile-game-nav,body.me-map5-active .mobile-game-nav,body.me-marinas6-active .mobile-game-nav,body.me-sec-active .mobile-game-nav{display:none!important}
body.me-missions3-active #navigation,body.me-fleet4-active #navigation,body.me-map5-active #navigation,body.me-marinas6-active #navigation,body.me-sec-active #navigation{display:none!important}
}`;document.head.appendChild(st);
function dedupeMarinas(){
 const root=document.getElementById("marinas");if(!root)return;
 const seen=new Set();
 [...root.querySelectorAll("button")].forEach(b=>{
   const key=(b.textContent||"").trim()+"|"+(b.dataset?.marina||b.dataset?.port||"")+"|"+(b.closest(".item,.marina-card")?.textContent?.slice(0,80)||"");
   if(/VEDI SULLA MAPPA|VISUALIZZA ORMEGGI/.test(key)){
     if(seen.has(key))b.style.display="none";else seen.add(key);
   }
 });
}
function numericInputs(){
 const map=document.getElementById("map");if(!map)return;
 [...map.querySelectorAll('input[type="text"]')].forEach(i=>{
   if(/speed|veloc|knots|nodi/i.test((i.id||"")+" "+(i.name||"")+" "+(i.placeholder||"")))i.setAttribute("inputmode","numeric");
 });
}
function boot(){dedupeMarinas();numericInputs();setTimeout(dedupeMarinas,800);setTimeout(dedupeMarinas,2500)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
window.addEventListener("marina-empire-updated",()=>setTimeout(dedupeMarinas,50));
})();