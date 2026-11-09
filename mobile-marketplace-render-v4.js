(()=>{"use strict";if(window.__ME_MARKET_RENDER_V4__)return;window.__ME_MARKET_RENDER_V4__=true;
let topMode="buy";
const css=document.createElement("style");css.id="me-market-render-v4-style";css.textContent=`
@media(max-width:899px){
 #meMarketRenderV4{display:flex;flex-direction:column;gap:7px;margin:0 0 8px}
 .mmr4-main{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.mmr4-main button{min-height:44px;border:1px solid #416b7d;border-radius:11px;background:#0a3042;color:#d9e7eb;font-size:7px;font-weight:950}.mmr4-main button.on{border-color:#8edcff;background:linear-gradient(180deg,#199bd2,#0f6ea8);color:#fff}
 .mmr4-filters{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.mmr4-filters::-webkit-scrollbar{display:none}.mmr4-filters button{flex:0 0 auto;min-height:36px;padding:6px 10px;border:1px solid #557887;border-radius:999px;background:#0b3042;color:#d6e5e9;font-size:6.8px;font-weight:900}
 .mmr4-section-label{display:flex;justify-content:space-between;align-items:center;margin-top:3px;color:#a8c0c8;font-size:7px}.mmr4-section-label strong{color:#f2d18d;font:800 14px Georgia,serif}
 #marketplace.me-mmr4-own #meMarketplaceApp .me-market-card{display:none!important}
 #marketplace.me-mmr4-own #meMarketplaceApp .me-market-card:has(.me-market-badge){display:none!important}
 #marketplace.me-mmr4-own #meMarketplaceApp .me-market-card:has(.me-market-badge:nth-child(1)){display:none!important}
 #marketplace.me-mmr4-own #meMarketplaceApp .me-market-card.mmr4-own-card{display:block!important}
 #marketplace.me-mmr4-sell #meMarketplaceApp .me-market-card{display:none!important}
 #marketplace.me-mmr4-sell #meMarketplaceApp .me-market-card.mmr4-sell-card{display:block!important}
 .mmr4-bottom{position:fixed;left:7px;right:7px;bottom:7px;z-index:91650;display:grid;grid-template-columns:repeat(6,1fr);gap:3px;padding:5px;border:1px solid #ba9655;border-radius:16px;background:#061f2df5;box-shadow:0 10px 30px #0009}.mmr4-bottom button{min-height:48px;border:0;border-radius:9px;background:transparent;color:#a9c0c7;font-size:5.9px;font-weight:900}.mmr4-bottom button b{display:block;margin-bottom:2px;font-size:15px}.mmr4-bottom button.on{background:#123e52;color:#f0cf88}
 #mmv2Bottom{display:none!important}
}`;document.head.appendChild(css);
function page(){return document.getElementById("marketplace")}
function go(id){try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function setMode(name){
 topMode=name;const p=page();if(!p)return;p.classList.remove("me-mmr4-own","me-mmr4-sell");
 document.querySelectorAll("[data-mmr4-main]").forEach(b=>b.classList.toggle("on",b.dataset.mmr4Main===name));
 if(name==="buy"){document.querySelector('[data-mmr3-mode="game"]')?.click();scrollToApp()}
 if(name==="sell"){p.classList.add("me-mmr4-sell");document.querySelector('[data-mmr3-mode="real"]')?.click();setTimeout(markCards,80)}
 if(name==="mine"){p.classList.add("me-mmr4-own");document.querySelector('[data-mmr3-mode="real"]')?.click();setTimeout(markCards,80)}
}
function scrollToApp(){document.getElementById("meMarketplaceApp")?.scrollIntoView({behavior:"smooth",block:"start"})}
function markCards(){
 document.querySelectorAll("#meMarketplaceApp .me-market-card").forEach(card=>{
   const txt=(card.textContent||"").toUpperCase();
   card.classList.toggle("mmr4-own-card",/TUO ANNUNCIO|I TUOI ANNUNCI/.test(txt));
   card.classList.toggle("mmr4-sell-card",/NUOVO ANNUNCIO REALE|VENDITORE REALE|PUBBLICA PRODOTTI/.test(txt));
 });
}
function applyTextFilter(kind){
 const app=document.getElementById("meMarketplaceApp");if(!app)return;
 const cards=[...app.querySelectorAll(".me-market-card")].filter(c=>c.tagName!=="SECTION");
 const priceVals=cards.map(c=>{const m=(c.querySelector(".me-market-price")?.textContent||"").replace(/\./g,"").replace(",",".").match(/[0-9]+(?:\.[0-9]+)?/);return m?Number(m[0]):0}).filter(Boolean);
 const med=priceVals.length?priceVals.sort((a,b)=>a-b)[Math.floor(priceVals.length/2)]:0;
 cards.forEach(c=>{const t=(c.textContent||"").toLowerCase();let ok=true;
   if(kind==="boats")ok=/barca|yacht|imbarc|tender|cruiser/.test(t);
   if(kind==="toys")ok=/seabob|foil|sup|water|piattaforma|piscina/.test(t);
   if(kind==="near")ok=/rimini|ancona|cervia|lignano|marina/.test(t);
   if(kind==="low") {const m=(c.querySelector(".me-market-price")?.textContent||"").replace(/\./g,"").replace(",",".").match(/[0-9]+(?:\.[0-9]+)?/);ok=m?Number(m[0])<=med:true}
   c.style.display=ok?"":"none";
 });
}
function ensure(){
 if(innerWidth>899)return null;const p=page(),head=document.getElementById("meMarketRenderV3");if(!p||!head)return null;
 let v4=document.getElementById("meMarketRenderV4");if(!v4){v4=document.createElement("section");v4.id="meMarketRenderV4";v4.innerHTML='<div class="mmr4-main"><button class="on" data-mmr4-main="buy">🛒 COMPRA</button><button data-mmr4-main="sell">🏷️ VENDI</button><button data-mmr4-main="mine">☰ I MIEI ANNUNCI</button></div><div class="mmr4-filters"><button data-mmr4-filter="boats">Imbarcazioni</button><button data-mmr4-filter="toys">Water Toys</button><button data-mmr4-filter="near">Vicino alla marina</button><button data-mmr4-filter="low">Prezzo</button><button data-mmr4-filter="all">Azzera filtri</button></div><div class="mmr4-section-label"><strong>Marketplace Nautico</strong><span>Compra, vendi e scambia</span></div>';head.insertAdjacentElement("beforebegin",v4);v4.addEventListener("click",e=>{const m=e.target.closest("[data-mmr4-main]");if(m)setMode(m.dataset.mmr4Main);const f=e.target.closest("[data-mmr4-filter]");if(f){if(f.dataset.mmr4Filter==="all"){document.querySelectorAll("#meMarketplaceApp .me-market-card").forEach(c=>c.style.display="")}else applyTextFilter(f.dataset.mmr4Filter)}})}
 let nav=document.getElementById("mmr4Bottom");if(!nav){nav=document.createElement("nav");nav.id="mmr4Bottom";nav.className="mmr4-bottom";nav.innerHTML='<button data-mmr4-go="home"><b>⌂</b>HOME</button><button data-mmr4-go="marinas"><b>⚓</b>MARINE</button><button class="on" data-mmr4-main="buy"><b>🛒</b>MARKET</button><button data-mmr4-main="sell"><b>＋</b>VENDI</button><button data-mmr4-go="community"><b>💬</b>MESSAGGI</button><button data-mmr4-go="profile"><b>👤</b>PROFILO</button>';p.appendChild(nav);nav.addEventListener("click",e=>{const g=e.target.closest("[data-mmr4-go]");if(g)go(g.dataset.mmr4Go);const m=e.target.closest("[data-mmr4-main]");if(m)setMode(m.dataset.mmr4Main)})}
 markCards();return p;
}
function sync(){if(innerWidth>899)return;const p=page();if(!p||p.classList.contains("hide"))return;ensure();markCards();if(topMode==="sell")p.classList.add("me-mmr4-sell");if(topMode==="mine")p.classList.add("me-mmr4-own")}
function boot(){setTimeout(()=>{ensure();sync()},150);const p=page();if(p)new MutationObserver(()=>setTimeout(sync,90)).observe(p,{attributes:true,childList:true,subtree:true,attributeFilter:["class"]});addEventListener("resize",sync);addEventListener("marina-empire-updated",()=>setTimeout(sync,80))}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();})();