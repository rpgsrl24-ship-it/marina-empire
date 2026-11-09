(()=>{"use strict";if(window.__ME_MARKET_RENDER11__)return;window.__ME_MARKET_RENDER11__=true;
const css=document.createElement("style");css.id="me-market-render11-style";css.textContent=`
@media(max-width:1200px){
 body.me-mkt11-active{background:#06283a!important}
 body.me-mkt11-active #marketplace>*:not(#meMarketplaceRender11){display:none!important}
 body.me-mkt11-active .me-pc-final,
 body.me-mkt11-active #mePcFinalTicker,
 body.me-mkt11-active #mobileLeftRail,
 body.me-mkt11-active #mobileRightRail,
 body.me-mkt11-active #meMobileBottomAction,
 body.me-mkt11-active .mobile-rail,
 body.me-mkt11-active .me-mobile-bottom-action{display:none!important}
 body.me-mkt11-active #marketplace{display:block!important;position:relative!important;inset:auto!important;width:100%!important;max-width:none!important;margin:0!important;padding:0 0 92px!important;background:#eaf6fb!important;color:#08273b!important;overflow:visible!important}
 #meMarketplaceRender11{display:block!important;max-width:620px;margin:0 auto;background:linear-gradient(180deg,#062f49 0,#0c6fa8 23%,#eaf6fb 23%,#f6fbfd 100%);min-height:1000px;color:#09273b}
 .mk11-hero{padding:10px 10px 14px;background:linear-gradient(180deg,#003d6eaa,#005e9dcc),url("./anteprima/assets/render-2026/marine.jpg") center/cover;color:#fff}
 .mk11-top{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center}.mk11-avatar{width:54px;height:54px;border-radius:50%;border:3px solid #fff;background:linear-gradient(#123a55,#061e2b);display:grid;place-items:center;font-size:26px}.mk11-brand{text-align:center}.mk11-brand b{font:800 21px Georgia,serif;letter-spacing:.05em}.mk11-brand small{display:block;font-size:6px;font-weight:900;letter-spacing:.1em}.mk11-menu{font-size:27px}
 .mk11-stats{display:grid;grid-template-columns:repeat(4,1fr);margin:8px auto 6px;max-width:480px;border:1px solid #72b6df;border-radius:999px;overflow:hidden;background:#0d4771dd}.mk11-stats div{padding:7px 5px;text-align:center;border-right:1px solid #72b6df;font-size:7px;font-weight:900}.mk11-stats div:last-child{border-right:0}.mk11-stats b{font-size:12px}
 .mk11-title{text-align:center}.mk11-title h1{margin:3px 0 0;font-size:30px;line-height:1}.mk11-title p{margin:5px 0 0;font-size:9px}
 .mk11-tabs{display:grid;grid-template-columns:1.3fr 1.1fr .9fr 1fr;gap:6px;margin-top:10px}.mk11-tabs button{min-height:44px;border:1px solid #65c8ef;border-radius:999px;background:#0b4e78;color:#fff;font-size:8px;font-weight:950}.mk11-tabs .on{background:linear-gradient(180deg,#159df3,#0969d6);box-shadow:0 0 12px #52d9ff}.mk11-tabs .sell{background:linear-gradient(180deg,#f8d15e,#c8921a);color:#4b3200;border-color:#ffd970}
 .mk11-main{padding:10px}.mk11-search{display:grid;grid-template-columns:1fr 52px;gap:7px}.mk11-search input{min-height:48px;padding:10px 14px;border:2px solid #91c6e8;border-radius:16px;background:#fff;color:#123;font-size:16px}.mk11-filter{border:2px solid #91c6e8;border-radius:16px;background:#fff;font-size:20px}
 .mk11-cats{display:flex;gap:7px;overflow-x:auto;margin-top:8px;padding-bottom:2px;scrollbar-width:none}.mk11-cats::-webkit-scrollbar{display:none}.mk11-cat{flex:0 0 90px;min-height:76px;border:1px solid #a9cce2;border-radius:14px;background:linear-gradient(#fff,#e7f3f8);color:#0b2a40;font-size:7px;font-weight:950}.mk11-cat b{display:block;font-size:22px;margin-bottom:4px}
 .mk11-sec{margin-top:10px}.mk11-sec-h{display:flex;align-items:center;justify-content:space-between;padding:7px 9px;border-radius:12px;background:linear-gradient(90deg,#f9d45f,#fff1bf 70%,transparent);font-size:8px}.mk11-sec-h strong{font-size:15px}.mk11-sec-h span{font-weight:900;color:#174a8e}
 .mk11-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:7px}.mk11-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:7px}.mk11-card{overflow:hidden;border:1px solid #b9d4e2;border-radius:14px;background:#fff;box-shadow:0 4px 14px #0d487020}.mk11-img{height:108px;background:url("./anteprima/assets/render-2026/hero-yacht.jpg") center/cover}.mk11-card:nth-child(2) .mk11-img{background-image:url("./anteprima/assets/render-2026/charter.jpg")}.mk11-card:nth-child(3) .mk11-img{background-image:url("./anteprima/assets/render-2026/flotta.jpg")}.mk11-card:nth-child(4) .mk11-img{background-image:url("./anteprima/assets/render-2026/marine.jpg")}
 .mk11-body{padding:7px}.mk11-tag{display:inline-block;margin-bottom:4px;padding:3px 6px;border-radius:7px;background:#0c5fb8;color:#fff;font-size:5.5px;font-weight:950}.mk11-tag.used{background:#d5362f}.mk11-card h3{margin:0;font-size:10px;line-height:1.25}.mk11-price{margin-top:4px;color:#0d3191;font-size:14px;font-weight:950}.mk11-meta{margin-top:3px;color:#4d6876;font-size:6.5px}
 .mk11-banner-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.mk11-banner{min-height:104px;padding:12px;border-radius:15px;color:#fff;display:flex;align-items:flex-end;background:linear-gradient(90deg,#002d52aa,#002d5244),url("./anteprima/assets/render-2026/charter.jpg") center/cover}.mk11-banner:nth-child(2){background-image:linear-gradient(90deg,#002d52aa,#002d5244),url("./anteprima/assets/render-2026/marine.jpg")}.mk11-banner strong{font-size:18px;display:block}.mk11-banner small{font-size:7px}
 .mk11-bottom{position:fixed;left:7px;right:7px;bottom:7px;z-index:99999;display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:5px;border-radius:16px;background:#06243af5;border:1px solid #56bce8}.mk11-bottom button{min-height:52px;border:0;border-radius:10px;background:transparent;color:#fff;font-size:5.8px;font-weight:900}.mk11-bottom button b{display:block;font-size:17px;margin-bottom:3px}.mk11-bottom .on{background:linear-gradient(180deg,#1bc8ff,#0668f2);box-shadow:0 0 12px #49d8ff}
 @media(max-width:430px){.mk11-grid4{grid-template-columns:repeat(2,1fr)}.mk11-grid3{grid-template-columns:1fr}.mk11-tabs{grid-template-columns:1fr 1fr}.mk11-stats{grid-template-columns:repeat(2,1fr);border-radius:14px}.mk11-stats div:nth-child(2){border-right:0}.mk11-banner-row{grid-template-columns:1fr}.mk11-title h1{font-size:27px}}
}`;document.head.appendChild(css);

function nav(id){try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function openSell(){document.querySelector('[data-mmr4-main="sell"]')?.click()}
function openMine(){document.querySelector('[data-mmr4-main="mine"]')?.click()}
function ensure(){
 const page=document.getElementById("marketplace");if(!page||innerWidth>1200)return null;
 let root=document.getElementById("meMarketplaceRender11");if(root)return root;
 root=document.createElement("section");root.id="meMarketplaceRender11";root.innerHTML=`
 <div class="mk11-hero">
  <div class="mk11-top"><div class="mk11-avatar">👨‍✈️</div><div class="mk11-brand"><b>MARINA EMPIRE®</b><small>THE NAUTICAL BUSINESS GAME</small></div><div class="mk11-menu">☰</div></div>
  <div class="mk11-stats"><div>🪙 <b id="mk11Coins">10.000</b></div><div>⭐ <b id="mk11Prestige">0</b></div><div>⛽ <b id="mk11Fuel">100%</b></div><div>🛠 <b id="mk11State">100%</b></div></div>
  <div class="mk11-title"><h1>🛒 Marketplace</h1><p>Compra · Vendi · Scambia · Equipaggia la tua flotta</p></div>
  <div class="mk11-tabs"><button class="on">🛒 Marketplace</button><button id="mk11Mine">🏷 I miei annunci</button><button class="sell" id="mk11Sell">＋ Vendi</button><button>♡ Preferiti</button></div>
 </div>
 <div class="mk11-main">
  <div class="mk11-search"><input id="mk11Search" placeholder="Cerca barche, accessori, water toys…"><button class="mk11-filter">☷</button></div>
  <div class="mk11-cats">
   <button class="mk11-cat"><b>🛥️</b>IMBARCAZIONI</button><button class="mk11-cat"><b>🚤</b>PWC</button><button class="mk11-cat"><b>🏄</b>EFOIL</button><button class="mk11-cat"><b>🛟</b>WATER TOYS</button><button class="mk11-cat"><b>⚙️</b>ACCESSORI</button><button class="mk11-cat"><b>⚓</b>POSTI BARCA</button><button class="mk11-cat"><b>🏷️</b>OFFERTE</button>
  </div>
  <section class="mk11-sec"><div class="mk11-sec-h"><strong>⭐ In evidenza</strong><span>Vedi tutti ›</span></div><div class="mk11-grid3">
   <article class="mk11-card"><div class="mk11-img"></div><div class="mk11-body"><span class="mk11-tag">RPG Yacht</span><h3>Piattaforma YachtBeach 4 × 3 m con piscina</h3><div class="mk11-price">€ 3.000</div><div class="mk11-meta">Nuovo</div></div></article>
   <article class="mk11-card"><div class="mk11-img"></div><div class="mk11-body"><span class="mk11-tag used">Usato</span><h3>eFoil – Ottime condizioni</h3><div class="mk11-price">€ 4.990</div><div class="mk11-meta">Usato</div></div></article>
   <article class="mk11-card"><div class="mk11-img"></div><div class="mk11-body"><span class="mk11-tag">RPG Yacht</span><h3>Seabob F5 S</h3><div class="mk11-price">€ 11.900</div><div class="mk11-meta">Nuovo</div></div></article>
  </div></section>
  <section class="mk11-sec"><div class="mk11-sec-h"><strong>📍 Annunci vicino alla tua marina</strong><span>Rimini – Darsena ›</span></div><div class="mk11-grid4">
   <article class="mk11-card"><div class="mk11-img"></div><div class="mk11-body"><h3>Prestige 42</h3><div class="mk11-price">€ 320.000</div><div class="mk11-meta">📍 Rimini (RN)</div></div></article>
   <article class="mk11-card"><div class="mk11-img"></div><div class="mk11-body"><h3>PWC GTX 300</h3><div class="mk11-price">€ 15.900</div><div class="mk11-meta">📍 Rimini (RN)</div></div></article>
   <article class="mk11-card"><div class="mk11-img"></div><div class="mk11-body"><h3>Passerella inox</h3><div class="mk11-price">€ 1.450</div><div class="mk11-meta">📍 Rimini (RN)</div></div></article>
   <article class="mk11-card"><div class="mk11-img"></div><div class="mk11-body"><h3>Bicchieri Silwy (set 4)</h3><div class="mk11-price">€ 59,90</div><div class="mk11-meta">📍 Rimini (RN)</div></div></article>
  </div></section>
  <div class="mk11-banner-row"><div class="mk11-banner"><div><strong>Weekend Water Toys</strong><small>Le migliori offerte per il tuo divertimento in mare</small></div></div><div class="mk11-banner"><div><strong>Eventi dal mondo</strong><small>Fiere, regate, novità e lanci dal settore nautico</small></div></div></div>
 </div>
 <nav class="mk11-bottom"><button data-go="home"><b>⌂</b>HOME</button><button data-go="marinas"><b>⚓</b>MARINE</button><button data-go="missions"><b>🎯</b>MISSIONI</button><button class="on"><b>🛒</b>MARKET</button><button data-go="fleet"><b>🛥️</b>FLOTTA</button><button data-go="community"><b>👥</b>COMMUNITY</button><button data-go="profile"><b>👤</b>PROFILO</button></nav>`;
 page.appendChild(root);
 root.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>nav(b.dataset.go));
 root.querySelector("#mk11Sell").onclick=openSell;root.querySelector("#mk11Mine").onclick=openMine;
 root.querySelectorAll(".mk11-banner")[0].onclick=()=>location.href="./weekend-water-toys.html";
 root.querySelectorAll(".mk11-banner")[1].onclick=()=>location.href="./evento-mondo.html";
 return root;
}
function syncStats(){
 try{if(typeof state==="undefined")return;const root=document.getElementById("meMarketplaceRender11");if(!root)return;
  root.querySelector("#mk11Coins").textContent=Number(state.coins||0).toLocaleString("it-IT");
  root.querySelector("#mk11Prestige").textContent=Number(state.prestige||0).toLocaleString("it-IT");
  const tank=Number(state.tank||state.fuelMax||300),fuel=Number(state.fuel||0);root.querySelector("#mk11Fuel").textContent=Math.max(0,Math.min(100,Math.round(tank?fuel/tank*100:0)))+"%";
  root.querySelector("#mk11State").textContent=Math.max(0,Math.min(100,Math.round(Number(state.condition??100))))+"%";
 }catch(_){}
}
function apply(){
 const page=document.getElementById("marketplace");if(!page||innerWidth>1200)return;
 const active=!page.classList.contains("hide");
 document.body.classList.toggle("me-mkt11-active",active);
 if(active){ensure();syncStats();window.scrollTo({top:0,behavior:"instant"})}
}
function boot(){
 ensure();apply();setInterval(syncStats,1000);
 const page=document.getElementById("marketplace");if(page)new MutationObserver(()=>setTimeout(apply,40)).observe(page,{attributes:true,attributeFilter:["class"],childList:true});
 document.addEventListener("click",()=>setTimeout(apply,50),true);addEventListener("resize",apply,{passive:true});
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();})();