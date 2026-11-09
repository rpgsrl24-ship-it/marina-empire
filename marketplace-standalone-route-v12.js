(()=>{"use strict";if(window.__ME_MARKET_STANDALONE_ROUTE__)return;window.__ME_MARKET_STANDALONE_ROUTE__=true;
const target="./marketplace-mobile.html?v=20261109-market12";
function mobile(){return innerWidth<=1200}
function isMarketUrl(){const q=new URLSearchParams(location.search);return q.get("view")==="marketplace"}
function redirect(){if(mobile()&&isMarketUrl()&&!location.pathname.endsWith("/marketplace-mobile.html"))location.replace(target)}
document.addEventListener("click",e=>{
 if(!mobile())return;
 const b=e.target.closest('[data-tab="marketplace"],[data-mobile-tab="marketplace"],a[href*="view=marketplace"]');
 if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();location.href=target;
},{capture:true});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(redirect,50),{once:true});else setTimeout(redirect,50);
})();