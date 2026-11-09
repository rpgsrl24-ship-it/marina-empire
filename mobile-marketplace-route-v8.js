(()=>{"use strict";if(window.__ME_MARKET_ROUTE_V8__)return;window.__ME_MARKET_ROUTE_V8__=true;
function openSell(){
 const tryOpen=()=>{const btn=document.querySelector('[data-mmr4-main="sell"]');if(btn){btn.click();return true}return false};
 let n=0;const tick=()=>{n++;if(!tryOpen()&&n<20)setTimeout(tick,150)};tick();
}
function openMine(){
 const tryOpen=()=>{const btn=document.querySelector('[data-mmr4-main="mine"]');if(btn){btn.click();return true}return false};
 let n=0;const tick=()=>{n++;if(!tryOpen()&&n<20)setTimeout(tick,150)};tick();
}
function route(){
 if(innerWidth>899)return;
 const q=new URLSearchParams(location.search),view=q.get("view"),market=q.get("market");
 if(view!=="marketplace")return;
 setTimeout(()=>{try{if(typeof showTab==="function")showTab("marketplace")}catch(_){}
  if(market==="sell")setTimeout(openSell,220);
  if(market==="mine")setTimeout(openMine,220);
 },650);
}
function relabel(){
 const b=document.getElementById("mms5Submit");if(b)b.textContent="➜ CONTINUA · ANTEPRIMA";
}
function boot(){route();setTimeout(relabel,450);const p=document.getElementById("marketplace");if(p)new MutationObserver(()=>setTimeout(relabel,80)).observe(p,{childList:true,subtree:true})}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();})();