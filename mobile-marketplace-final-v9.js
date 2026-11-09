(()=>{"use strict";if(window.__ME_MARKET_FINAL_V9__)return;window.__ME_MARKET_FINAL_V9__=true;
const css=document.createElement("style");css.id="me-market-final-v9-style";css.textContent=`
@media(max-width:899px){
#marketplace.me-market-v2-ready>#meMarketV2Top,
#marketplace.me-market-v2-ready>#meMarketRenderV4,
#marketplace.me-market-v2-ready>#meMarketRenderV3,
#marketplace.me-market-v2-ready>:scope>.panel,
#marketplace.me-market-v2-ready>#mmr4Bottom,
#marketplace.me-market-v2-ready>#mmv2Bottom{display:none!important}
#meMarketFinalV9{display:flex;flex-direction:column;gap:9px;color:#f7f2e7}
.mfv9-head{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.mfv9-brand b{display:block;color:#f0ce86;font:800 22px Georgia,serif;letter-spacing:.05em}.mfv9-brand small{display:block;color:#9fb7c0;font-size:6.5px;font-weight:900;letter-spacing:.11em}.mfv9-balance{padding:7px 9px;border:1px solid #d7af64;border-radius:999px;background:#082c40;color:#ffe0a2;font-size:8px;font-weight:950}
.mfv9-title h2{margin:0;color:#fff5d9;font:900 28px/1 Georgia,serif}.mfv9-title p{margin:5px 0 0;color:#d7e5e8;font-size:8.5px}
.mfv9-search{display:grid;grid-template-columns:1fr auto;gap:6px}.mfv9-search input{min-width:0;min-height:44px;padding:9px 11px;border:1px solid #557b8b;border-radius:12px;background:#0a3042;color:#fff;font-size:16px}.mfv9-search button{width:46px;border:1px solid #557b8b;border-radius:12px;background:#0a3042;color:#fff;font-size:16px}
.mfv9-cats{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none}.mfv9-cats::-webkit-scrollbar{display:none}.mfv9-cat{flex:0 0 92px;min-height:78px;padding:6px 4px;border:1px solid #456f80;border-radius:13px;background:linear-gradient(145deg,#123f55,#082c3f);color:#dce8ec;font-size:6.7px;font-weight:950}.mfv9-cat b{display:block;font-size:23px;margin-bottom:5px}.mfv9-cat.on{border-color:#7fdfff;background:linear-gradient(180deg,#199bd2,#0d6fab);color:#fff}
.mfv9-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.mfv9-tabs button{min-height:42px;border:1px solid #456f80;border-radius:10px;background:#0a3042;color:#dce8ec;font-size:6.4px;font-weight:950}.mfv9-tabs button.on{border-color:#d5ac5e;background:linear-gradient(180deg,#e4c276,#b98734);color:#082536}
.mfv9-sec-head{display:flex;justify-content:space-between;align-items:end;margin-top:1px}.mfv9-sec-head strong{color:#f2d18d;font:800 16px Georgia,serif}.mfv9-sec-head button{border:0;background:transparent;color:#83dfff;font-size:7px;font-weight:950}
.mfv9-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.mfv9-card{overflow:hidden;border:1px solid #b9cad2;border-radius:14px;background:#f4f8fb;color:#071b2b;box-shadow:0 8px 22px #0006}.mfv9-img{height:128px;background:linear-gradient(180deg,#0000,#0018),url("./anteprima/assets/render-2026/hero-yacht.jpg") center/cover}.mfv9-card:nth-child(2n) .mfv9-img{background-image:linear-gradient(180deg,#0000,#0018),url("./anteprima/assets/render-2026/flotta.jpg")}.mfv9-card:nth-child(3n) .mfv9-img{background-image:linear-gradient(180deg,#0000,#0018),url("./anteprima/assets/render-2026/charter.jpg")}.mfv9-card:nth-child(4n) .mfv9-img{background-image:linear-gradient(180deg,#0000,#0018),url("./anteprima/assets/render-2026/marine.jpg")}
.mfv9-body{padding:9px}.mfv9-badge{display:inline-block;margin-bottom:4px;padding:3px 6px;border-radius:999px;background:#e6f2f7;color:#2d5265;font-size:5.8px;font-weight:950}.mfv9-card h3{margin:0;color:#0a2030;font-size:11px;line-height:1.2}.mfv9-price{margin-top:4px;color:#0d2f85;font-size:14px;font-weight:950}.mfv9-meta{margin-top:4px;color:#566f7b;font-size:6.6px;line-height:1.35}.mfv9-actions{display:grid;grid-template-columns:1fr;gap:5px;margin-top:7px}.mfv9-actions button,.mfv9-actions a{min-height:35px;border:1px solid #4ba8d2;border-radius:9px;background:#0d8dcb;color:#fff;font-size:7px;font-weight:950;display:flex;align-items:center;justify-content:center;text-decoration:none;text-align:center}
.mfv9-empty{padding:13px;border:1px solid #456f80;border-radius:12px;background:#0a3042;color:#c5d7dc;font-size:8px}
.mfv9-note{padding:8px 9px;border:1px solid #456f80;border-radius:10px;background:#092f42;color:#bcd0d6;font-size:7px;line-height:1.4}
.mfv9-bottom{position:fixed;left:7px;right:7px;bottom:7px;z-index:91690;display:grid;grid-template-columns:repeat(6,1fr);gap:3px;padding:5px;border:1px solid #ba9655;border-radius:16px;background:#061f2df5;box-shadow:0 10px 30px #0009}.mfv9-bottom button{min-height:50px;border:0;border-radius:9px;background:transparent;color:#a9c0c7;font-size:5.8px;font-weight:900}.mfv9-bottom button b{display:block;margin-bottom:3px;font-size:16px}.mfv9-bottom button.on{background:#123e52;color:#f0cf88}
#marketplace.me-market-v2-ready{padding-bottom:92px!important}
@media(max-width:390px){.mfv9-grid{grid-template-columns:1fr}}
}`;document.head.appendChild(css);
let currentMode="all",cat="all",query="";
function p(){return document.getElementById("marketplace")}
function gs(){try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}}
function go(id){try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function originalCards(){return [...document.querySelectorAll("#meMarketplaceApp .me-market-card")].filter(c=>c.tagName!=="SECTION")}
function classify(card){
 const t=(card.textContent||"").toLowerCase();
 if(/rpg yacht|venditore ufficiale/.test(t))return"official";
 if(/€|euro|annuncio reale|venditore/.test(t))return"real";
 return"game";
}
function category(card){
 const t=(card.textContent||"").toLowerCase();
 if(/yacht|barca|imbarc|tender|cruiser/.test(t))return"boats";
 if(/seabob|foil|sup|water|piattaforma|piscina/.test(t))return"toys";
 if(/vhf|gps|elettron/.test(t))return"electronics";
 if(/ricamb|batter|generatore|tecnica/.test(t))return"parts";
 if(/serviz|charter|assistenza/.test(t))return"services";
 return"accessories";
}
function info(card){
 const title=(card.querySelector("h3")?.textContent||"Prodotto").replace(/^[^A-Za-zÀ-ÿ0-9]+/,"").trim();
 const price=(card.querySelector(".me-market-price")?.textContent||"").trim()||"Disponibile";
 const badge=(card.querySelector(".me-market-badge")?.textContent||classify(card)).trim();
 const desc=[...card.querySelectorAll("p")].map(x=>x.textContent.trim()).filter(Boolean).join(" · ");
 const action=card.querySelector(".me-market-actions a,.me-market-actions button");
 return{title,price,badge,desc,action,mode:classify(card),cat:category(card)};
}
function visibleInfos(){
 return originalCards().map(info).filter(x=>{
   if(currentMode!=="all"&&x.mode!==currentMode)return false;
   if(cat!=="all"&&x.cat!==cat)return false;
   if(query&&!((x.title+" "+x.desc+" "+x.badge).toLowerCase().includes(query)))return false;
   return true;
 });
}
function renderCards(host,items){
 host.innerHTML=items.length?items.slice(0,12).map((x,i)=>'<article class="mfv9-card" data-mfv9-i="'+i+'"><div class="mfv9-img"></div><div class="mfv9-body"><span class="mfv9-badge">'+x.badge+'</span><h3>'+x.title+'</h3><div class="mfv9-price">'+x.price+'</div><div class="mfv9-meta">'+(x.desc||"Marketplace Marina Empire").slice(0,115)+'</div><div class="mfv9-actions"><button type="button" data-mfv9-open="'+i+'">VEDI DETTAGLI</button></div></div></article>').join(""):'<div class="mfv9-empty">Nessun articolo corrisponde ai filtri selezionati.</div>';
 host.querySelectorAll("[data-mfv9-open]").forEach(b=>b.onclick=()=>openDetail(items[Number(b.dataset.mfv9Open)]));
}
function openDetail(x){
 if(!x)return;const orig=originalCards().map(info).find(y=>y.title===x.title&&y.price===x.price);
 const existing=document.getElementById("meMarketDetailV3");
 if(existing){
   const card=originalCards().find(c=>{const z=info(c);return z.title===x.title&&z.price===x.price});
   if(card){card.dispatchEvent(new MouseEvent("click",{bubbles:true}));return}
 }
 orig?.action?.click?.();
}
function render(){
 const root=document.getElementById("meMarketFinalV9");if(!root)return;
 const items=visibleInfos(),featured=items.slice(0,4),nearby=items.slice(4,10);
 root.querySelector("#mfv9Balance").textContent=(Number(gs()?.coins)||0).toLocaleString("it-IT")+" cr";
 renderCards(root.querySelector("#mfv9Featured"),featured);
 renderCards(root.querySelector("#mfv9Nearby"),nearby.length?nearby:items.slice(0,6));
}
function ensure(){
 if(innerWidth>899)return null;const page=p();if(!page)return null;let root=document.getElementById("meMarketFinalV9");if(root)return root;
 root=document.createElement("section");root.id="meMarketFinalV9";root.innerHTML='<div class="mfv9-head"><div class="mfv9-brand"><b>⚓ MARINA EMPIRE</b><small>THE NAUTICAL BUSINESS GAME</small></div><div class="mfv9-balance" id="mfv9Balance">0 cr</div></div><div class="mfv9-title"><h2>MARKETPLACE NAUTICO</h2><p>Compra, vendi e scopri il meglio della nautica.</p></div><div class="mfv9-search"><input id="mfv9Search" placeholder="Cerca barche, accessori, servizi…" aria-label="Cerca"><button type="button">⚙</button></div><div class="mfv9-cats"><button class="mfv9-cat on" data-mfv9-cat="all"><b>◉</b>TUTTO</button><button class="mfv9-cat" data-mfv9-cat="boats"><b>🛥️</b>IMBARCAZIONI</button><button class="mfv9-cat" data-mfv9-cat="toys"><b>🏄</b>WATER TOYS</button><button class="mfv9-cat" data-mfv9-cat="accessories"><b>⚓</b>ACCESSORI</button><button class="mfv9-cat" data-mfv9-cat="electronics"><b>📡</b>ELETTRONICA</button><button class="mfv9-cat" data-mfv9-cat="parts"><b>🔧</b>RICAMBI</button><button class="mfv9-cat" data-mfv9-cat="services"><b>🧰</b>SERVIZI</button></div><div class="mfv9-tabs"><button class="on" data-mfv9-mode="all">TUTTI</button><button data-mfv9-mode="real">€ REALI</button><button data-mfv9-mode="official">RPG YACHT</button><button data-mfv9-mode="game">🪙 GIOCO</button></div><div class="mfv9-sec-head"><strong>⭐ In evidenza</strong><button type="button">VEDI TUTTI</button></div><div class="mfv9-grid" id="mfv9Featured"></div><div class="mfv9-sec-head"><strong>⚓ Vicino alla tua marina</strong><button type="button">VEDI TUTTI</button></div><div class="mfv9-grid" id="mfv9Nearby"></div><div class="mfv9-note">€ = annunci/acquisti reali. 🪙 = mercato virtuale del gioco. I prodotti RPG Yacht sono identificati come venditore ufficiale.</div><nav class="mfv9-bottom"><button data-mfv9-go="home"><b>⌂</b>HOME</button><button data-mfv9-go="marinas"><b>⚓</b>MARINE</button><button class="on"><b>🛒</b>MARKET</button><button data-mfv9-sell><b>＋</b>VENDI</button><button data-mfv9-go="community"><b>💬</b>MESSAGGI</button><button data-mfv9-go="profile"><b>👤</b>PROFILO</button></nav>';
 page.insertBefore(root,page.firstChild);
 root.querySelector("#mfv9Search").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();render()});
 root.querySelectorAll("[data-mfv9-cat]").forEach(b=>b.onclick=()=>{cat=b.dataset.mfv9Cat;root.querySelectorAll("[data-mfv9-cat]").forEach(x=>x.classList.toggle("on",x===b));render()});
 root.querySelectorAll("[data-mfv9-mode]").forEach(b=>b.onclick=()=>{currentMode=b.dataset.mfv9Mode;root.querySelectorAll("[data-mfv9-mode]").forEach(x=>x.classList.toggle("on",x===b));render()});
 root.querySelectorAll("[data-mfv9-go]").forEach(b=>b.onclick=()=>go(b.dataset.mfv9Go));
 root.querySelector("[data-mfv9-sell]").onclick=()=>document.querySelector('[data-mmr4-main="sell"]')?.click();
 render();return root;
}
function sync(){if(innerWidth>899)return;const page=p();if(!page||page.classList.contains("hide"))return;ensure();render()}
function boot(){setTimeout(()=>{ensure();sync()},300);const page=p();if(page)new MutationObserver(()=>setTimeout(sync,120)).observe(page,{attributes:true,childList:true,subtree:true,attributeFilter:["class"]});addEventListener("resize",sync);addEventListener("marina-empire-updated",()=>setTimeout(sync,100))}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();})();