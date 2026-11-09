(()=>{"use strict";if(window.__ME_MARKET_FORCE_V10__)return;window.__ME_MARKET_FORCE_V10__=true;
const style=document.createElement("style");style.id="me-market-force-v10-style";style.textContent=`
@media(max-width:1200px){
 body.me-market-final-active #marketplace>*:not(#meMarketFinalV9){display:none!important}
 body.me-market-final-active #marketplace #meMarketFinalV9{display:flex!important}
 body.me-market-final-active .me-pc-final,
 body.me-market-final-active #mePcFinalTicker,
 body.me-market-final-active .mobile-rail,
 body.me-market-final-active #mobileLeftRail,
 body.me-market-final-active #mobileRightRail,
 body.me-market-final-active #meMobileBottomAction,
 body.me-market-final-active .me-mobile-bottom-action{display:none!important}
 body.me-market-final-active #marketplace{display:block!important;position:relative!important;inset:auto!important;width:100%!important;max-width:none!important;margin:0!important;padding:10px 8px 92px!important;background:radial-gradient(circle at 50% -12%,rgba(36,127,159,.28),transparent 34%),linear-gradient(180deg,#05283b,#073248 48%,#031824)!important;overflow:visible!important}
 body.me-market-final-active #meMarketFinalV9{width:100%!important;max-width:620px!important;margin:0 auto!important}
}
`;document.head.appendChild(style);
function active(){const page=document.getElementById("marketplace");return !!page&&!page.classList.contains("hide")}
function apply(){
 const page=document.getElementById("marketplace"),root=document.getElementById("meMarketFinalV9");
 if(!page)return;
 const should=innerWidth<=1200&&active();
 document.body.classList.toggle("me-market-final-active",should);
 if(should){
  if(root)root.style.setProperty("display","flex","important");
  window.scrollTo({top:0,behavior:"instant"});
 }
}
function ensureThenApply(){
 let n=0;const t=()=>{n++;const root=document.getElementById("meMarketFinalV9");if(root){apply();return}if(n<30)setTimeout(t,120)};t();
}
function boot(){
 ensureThenApply();
 const page=document.getElementById("marketplace");
 if(page)new MutationObserver(()=>setTimeout(apply,50)).observe(page,{attributes:true,attributeFilter:["class"],childList:true});
 addEventListener("resize",apply,{passive:true});
 addEventListener("popstate",()=>setTimeout(apply,50));
 document.addEventListener("click",()=>setTimeout(apply,80),true);
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();})();