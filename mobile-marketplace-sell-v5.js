(()=>{"use strict";if(window.__ME_MARKET_SELL_V5__)return;window.__ME_MARKET_SELL_V5__=true;
const css=document.createElement("style");css.id="me-market-sell-v5-style";css.textContent=`
@media(max-width:899px){
 #meMarketSellV5{display:none;position:fixed;inset:0;z-index:97500;overflow-y:auto;padding:8px 8px 96px;background:radial-gradient(circle at 50% -10%,rgba(37,126,154,.34),transparent 33%),linear-gradient(180deg,#05283b 0%,#073248 48%,#031824 100%);color:#f7f2e7}
 #meMarketSellV5.on{display:block}
 .mms5-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.mms5-top button{width:42px;height:42px;border:1px solid #416b7d;border-radius:10px;background:#0a3042;color:#fff;font-size:18px}.mms5-top b{color:#f0ce86;font:800 19px Georgia,serif}
 .mms5-title{margin-top:8px}.mms5-title h2{margin:0;color:#fff5d9;font:900 26px/1 Georgia,serif}.mms5-title p{margin:5px 0 0;color:#d7e5e8;font-size:8.5px}
 .mms5-hero{min-height:165px;margin-top:8px;padding:12px;display:flex;align-items:flex-end;border:1px solid #deb566;border-radius:15px;background:linear-gradient(180deg,#0001,#001d),url("./anteprima/assets/render-2026/marine.jpg") center/cover;box-shadow:0 10px 28px #0007}.mms5-hero small{display:block;color:#f2d08c;font-size:7px;font-weight:950}.mms5-hero strong{display:block;margin-top:3px;color:#fff;font:800 18px Georgia,serif}
 .mms5-card{margin-top:9px;padding:10px;border:1px solid #456f80;border-radius:13px;background:#0a3042}.mms5-card h3{margin:0 0 8px;color:#f2d18d;font-size:12px}
 .mms5-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.mms5-cats button{min-height:58px;padding:5px 2px;border:1px solid #456f80;border-radius:10px;background:#0b3246;color:#d9e7eb;font-size:6.4px;font-weight:950}.mms5-cats button b{display:block;margin-bottom:3px;font-size:17px}.mms5-cats button.on{border-color:#8edcff;background:linear-gradient(180deg,#199bd2,#0f6ea8);color:#fff}
 .mms5-type{display:grid;grid-template-columns:1fr 1fr;gap:6px}.mms5-type button{min-height:44px;border:1px solid #456f80;border-radius:10px;background:#0b3246;color:#d9e7eb;font-size:7px;font-weight:950}.mms5-type button.on{border-color:#8edcff;background:linear-gradient(180deg,#199bd2,#0f6ea8);color:#fff}
 .mms5-form{display:grid;gap:7px}.mms5-form label{font-size:7px;color:#a9c0c8;font-weight:900}.mms5-form input,.mms5-form textarea,.mms5-form select{width:100%;min-height:42px;padding:8px 10px;border:1px solid #5b7d8c;border-radius:10px;background:#092c3f;color:#fff;font-size:16px}.mms5-form textarea{min-height:100px;resize:vertical}.mms5-two{display:grid;grid-template-columns:1fr 1fr;gap:7px}.mms5-submit{width:100%;min-height:46px;margin-top:9px;border:1px solid #8edcff;border-radius:11px;background:linear-gradient(180deg,#159cd8,#0d70af);color:#fff;font-size:8.5px;font-weight:950}
 .mms5-note{margin-top:7px;color:#9db6bf;font-size:7.2px;line-height:1.4}.mms5-status{margin-top:7px;color:#f2d18d;font-size:7.5px;font-weight:900}
}`;document.head.appendChild(css);
let cat="Imbarcazione",kind="real";
function ensure(){
 if(innerWidth>899)return null;let box=document.getElementById("meMarketSellV5");if(box)return box;
 box=document.createElement("section");box.id="meMarketSellV5";box.innerHTML='<div class="mms5-top"><button type="button" id="mms5Back">←</button><b>⚓ MARINA EMPIRE</b><span></span></div><div class="mms5-title"><h2>VENDI IL TUO ANNUNCIO</h2><p>Barche, water toys, accessori, servizi e altro.</p></div><div class="mms5-hero"><div><small>MARKETPLACE NAUTICO</small><strong>Pubblica in modo semplice e chiaro</strong></div></div><div class="mms5-card"><h3>1 · Categoria</h3><div class="mms5-cats"><button class="on" data-mms5-cat="Imbarcazione"><b>🛥️</b>IMBARCAZIONE</button><button data-mms5-cat="Water Toys"><b>🏄</b>WATER TOYS</button><button data-mms5-cat="Accessori"><b>⚓</b>ACCESSORI</button><button data-mms5-cat="Servizi"><b>🔧</b>SERVIZI</button></div></div><div class="mms5-card"><h3>2 · Tipo annuncio</h3><div class="mms5-type"><button class="on" data-mms5-kind="real">€ ANNUNCIO REALE</button><button data-mms5-kind="game">🪙 ANNUNCIO DI GIOCO</button></div><div class="mms5-note">Annuncio reale = prezzo in euro e contatto tra utenti. Annuncio di gioco = scambio interno con crediti virtuali.</div></div><div class="mms5-card"><h3>3 · Dati annuncio</h3><div class="mms5-form"><label>Titolo<input id="mms5Title" maxlength="80" placeholder="Es. Prestige 42 · Ottime condizioni"></label><label>Descrizione<textarea id="mms5Desc" maxlength="1200" placeholder="Descrivi prodotto, condizioni, dotazioni e consegna…"></textarea></label><div class="mms5-two"><label>Prezzo<input id="mms5Price" type="number" min="1" step="0.01" placeholder="0"></label><label>Località<input id="mms5Location" maxlength="80" placeholder="Rimini"></label></div><div id="mms5ContactWrap"><label>Contatto<input id="mms5Contact" maxlength="160" placeholder="Email, telefono o WhatsApp"></label></div><button class="mms5-submit" type="button" id="mms5Submit">➤ PUBBLICA ANNUNCIO</button><div class="mms5-status" id="mms5Status"></div></div></div>';
 document.body.appendChild(box);
 box.querySelector("#mms5Back").onclick=()=>box.classList.remove("on");
 box.querySelectorAll("[data-mms5-cat]").forEach(b=>b.onclick=()=>{cat=b.dataset.mms5Cat;box.querySelectorAll("[data-mms5-cat]").forEach(x=>x.classList.toggle("on",x===b))});
 box.querySelectorAll("[data-mms5-kind]").forEach(b=>b.onclick=()=>{kind=b.dataset.mms5Kind;box.querySelectorAll("[data-mms5-kind]").forEach(x=>x.classList.toggle("on",x===b));syncKind()});
 box.querySelector("#mms5Submit").onclick=submit;
 return box;
}
function syncKind(){const w=document.getElementById("mms5ContactWrap");if(w)w.style.display=kind==="real"?"block":"none";const p=document.getElementById("mms5Price");if(p)p.placeholder=kind==="real"?"€":"crediti"}
function open(){const b=ensure();if(!b)return;b.classList.add("on");syncKind()}
async function submit(){
 const title=document.getElementById("mms5Title")?.value.trim(),desc=document.getElementById("mms5Desc")?.value.trim(),price=Number(document.getElementById("mms5Price")?.value||0),location=document.getElementById("mms5Location")?.value.trim(),contact=document.getElementById("mms5Contact")?.value.trim(),status=document.getElementById("mms5Status");
 if(!title||!desc||!price||!location){status.textContent="Compila titolo, descrizione, prezzo e località.";return}
 if(kind==="real"){
   const titleEl=document.getElementById("meRealTitle"),catEl=document.getElementById("meRealCategory"),priceEl=document.getElementById("meRealPrice"),locEl=document.getElementById("meRealLocation"),descEl=document.getElementById("meRealDescription"),contactEl=document.getElementById("meRealContact");
   if(!titleEl){status.textContent="Apri la sezione Annunci reali e attiva il pass venditore per pubblicare.";return}
   titleEl.value=title;if(catEl)catEl.value=[...catEl.options].some(o=>o.value===cat)?cat:"Altro";if(priceEl)priceEl.value=price;if(locEl)locEl.value=location;if(descEl)descEl.value=desc;if(contactEl)contactEl.value=contact;
   document.querySelector("[data-real-create]")?.click();status.textContent="Invio annuncio reale…";setTimeout(()=>document.getElementById("meMarketSellV5")?.classList.remove("on"),700);return;
 }
 const gameForm=document.querySelector("#meMarketplaceApp [data-event-list],#meMarketplaceApp .me-market-card button.gold");
 if(gameForm){status.textContent="Per gli annunci di gioco usa il mercato tra giocatori/evento disponibile nella pagina Marketplace.";setTimeout(()=>document.getElementById("meMarketSellV5")?.classList.remove("on"),1200)}else status.textContent="Mercato di gioco non disponibile in questo momento.";
}
function bind(){
 ensure();document.querySelectorAll('[data-mmr4-main="sell"]').forEach(b=>{if(b.dataset.mms5Bound)return;b.dataset.mms5Bound="1";b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();open()},{capture:true})});
}
function boot(){setTimeout(bind,200);addEventListener("marina-empire-updated",()=>setTimeout(bind,120));const p=document.getElementById("marketplace");if(p)new MutationObserver(()=>setTimeout(bind,100)).observe(p,{childList:true,subtree:true})}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();})();