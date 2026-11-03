(()=>{
"use strict";
if(window.__ME_MARKETPLACE__)return;
window.__ME_MARKETPLACE__=true;

const ITEMS=[
 {id:"fender_set",name:"Set parabordi premium",cat:"Attrezzature",base:950,icon:"⚓"},
 {id:"vhf_pro",name:"VHF professionale",cat:"Elettronica",base:1350,icon:"📡"},
 {id:"gps_plotter",name:"Chartplotter GPS",cat:"Elettronica",base:4200,icon:"🗺️"},
 {id:"safety_kit",name:"Kit sicurezza offshore",cat:"Sicurezza",base:2800,icon:"🦺"},
 {id:"seabob",name:"Seabob",cat:"Water Toys",base:11500,icon:"🌊"},
 {id:"efoil",name:"E-Foil",cat:"Water Toys",base:8900,icon:"🏄"},
 {id:"sup",name:"SUP premium",cat:"Water Toys",base:1100,icon:"🛶"},
 {id:"floating_platform",name:"Piattaforma galleggiante",cat:"Water Toys",base:6500,icon:"🟫"},
 {id:"generator",name:"Generatore marino",cat:"Tecnica",base:7800,icon:"⚙️"},
 {id:"battery_bank",name:"Banco batterie",cat:"Tecnica",base:5200,icon:"🔋"}
];

const style=document.createElement("style");
style.textContent=`
#meMarketplaceApp{display:grid;gap:12px}
.me-market-summary{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.me-market-balance{font-size:14px;font-weight:700;color:#f2d79e}
.me-market-tabs{display:flex;gap:6px;flex-wrap:wrap}
.me-market-tabs button{padding:8px 10px;border-radius:9px;border:1px solid rgba(214,181,117,.35);background:#0a2d3e;color:#dce9ed;cursor:pointer}
.me-market-tabs button.on{background:#173f53;color:#ffe1a1;border-color:#d6b575}
.me-market-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}
.me-market-card{border:1px solid rgba(214,181,117,.28);border-radius:13px;padding:12px;background:linear-gradient(180deg,#0d3041,#092333)}
.me-market-card h3{margin:4px 0 6px;font-size:15px}
.me-market-card p{margin:4px 0;font-size:11px;color:#c8d6dc}
.me-market-price{font-size:16px;font-weight:800;color:#f1cd82;margin:8px 0}
.me-market-badge{display:inline-block;font-size:9px;padding:3px 6px;border-radius:999px;background:#153d50;color:#bcd2db}
.me-market-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.me-market-actions button{flex:1 1 90px;padding:8px;border-radius:9px;border:1px solid rgba(214,181,117,.4);background:#12394d;color:#fff;cursor:pointer}
.me-market-actions button.gold{background:#c49a55;color:#061a25;font-weight:800}
.me-market-actions button:disabled{opacity:.45;cursor:not-allowed}
.me-market-status{font-size:11px;min-height:18px;color:#d9e5e9}
.me-market-inventory{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px}
.me-market-chip{font-size:9px;padding:4px 7px;border-radius:999px;background:#102f41;color:#cbdde4}
.me-market-filters{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0}
.me-market-filters button{padding:6px 9px;border-radius:999px;border:1px solid rgba(214,181,117,.3);background:#0b2d3d;color:#c9d9df;font-size:9px;cursor:pointer}
.me-market-filters button.on{border-color:#d6b575;color:#ffe1a1}
.me-market-history{height:44px;display:flex;align-items:end;gap:3px;margin-top:8px}
.me-market-history span{display:block;width:12px;background:#b99758;border-radius:3px 3px 0 0;opacity:.85}
.me-market-history-label{font-size:8px;color:#87a5b2;margin-top:3px}
@media(max-width:740px){.me-market-grid{grid-template-columns:1fr}.me-market-card{padding:10px}}
`;
document.head.appendChild(style);

let mode="boats",marketFilter="all",seed=Math.floor(Date.now()/3600000);

function econ(){return window.MarinaEmpireMarketplaceEconomy}
function snap(){return econ()?.snapshot?.()||{coins:0,owned:[],inventory:{},registered:false}}
function money(n){return Math.round(Number(n)||0).toLocaleString("it-IT")}
function factor(key,min=.82,max=1.12){
 let h=seed;
 for(const ch of String(key))h=(h*31+ch.charCodeAt(0))>>>0;
 return min+((h%1000)/1000)*(max-min);
}
function boatOffer(b){
 const k=Math.abs(Math.floor(factor("class-"+b.id,0,300)));
 const marketType=k<100?"Nuovo":k<220?"Usato":"Occasione";
 const range=marketType==="Nuovo"?[.98,1.08]:marketType==="Usato"?[.72,.91]:[.55,.70];
 const price=Math.max(1000,Math.round((b.price||0)*factor("boat-"+b.id,range[0],range[1])));
 const condition=marketType==="Nuovo"?100:marketType==="Usato"?Math.round(78+factor("cond-"+b.id,0,16)):Math.round(62+factor("cond-"+b.id,0,15));
 return {...b,marketPrice:price,marketType,condition};
}
function priceHistory(key,base,min,max){
 const rows=[];
 for(let i=5;i>=0;i--){
  const oldSeed=seed-i;
  let h=oldSeed;
  for(const ch of String(key))h=(h*31+ch.charCodeAt(0))>>>0;
  const f=min+((h%1000)/1000)*(max-min);
  rows.push(Math.max(1,Math.round(base*f)));
 }
 return rows;
}
function historyHTML(values){
 const min=Math.min(...values),max=Math.max(...values),spread=Math.max(1,max-min);
 return '<div class="me-market-history">'+values.map((v,i)=>'<span title="'+money(v)+'" style="height:'+(12+Math.round(((v-min)/spread)*28))+'px"></span>').join('')+'</div><div class="me-market-history-label">Andamento ultime 6 ore · '+money(values[0])+' → '+money(values[values.length-1])+'</div>';
}
function itemOffer(i){
 const buy=Math.max(50,Math.round(i.base*factor("item-"+i.id,.88,1.08)));
 return {...i,buy,sell:Math.round(buy*.62)};
}
function setStatus(msg){
 const el=document.querySelector("#meMarketplaceApp .me-market-status");
 if(el)el.textContent=msg||"";
}
function headerHTML(s){
 const inv=Object.entries(s.inventory||{}).filter(([,q])=>q>0).map(([id,q])=>{
  const i=ITEMS.find(x=>x.id===id);return i?'<span class="me-market-chip">'+i.icon+' '+i.name+' × '+q+'</span>':"";
 }).join("");
 return '<div class="me-market-summary"><div><div class="me-market-balance">Saldo: '+money(s.coins)+' crediti</div><div class="me-market-inventory">'+(inv||'<span class="me-market-chip">Inventario vuoto</span>')+'</div></div><div class="me-market-tabs"><button type="button" data-market-mode="boats" class="'+(mode==="boats"?"on":"")+'">🛥️ IMBARCAZIONI</button><button type="button" data-market-mode="items" class="'+(mode==="items"?"on":"")+'">🧰 ACCESSORI & TOYS</button></div></div>'+(mode==="boats"?'<div class="me-market-filters"><button type="button" data-market-filter="all" class="'+(marketFilter==="all"?"on":"")+'">TUTTE</button><button type="button" data-market-filter="Nuovo" class="'+(marketFilter==="Nuovo"?"on":"")+'">NUOVO</button><button type="button" data-market-filter="Usato" class="'+(marketFilter==="Usato"?"on":"")+'">USATO</button><button type="button" data-market-filter="Occasione" class="'+(marketFilter==="Occasione"?"on":"")+'">OCCASIONI</button></div>':'')+'<div class="me-market-status" role="status"></div>';
}
function boatsHTML(s){
 const boats=econ()?.boats?.()||[];
 return '<div class="me-market-grid">'+boats.filter(b=>b.id!=="voyager").map(b=>boatOffer(b)).filter(o=>marketFilter==="all"||o.marketType===marketFilter).map(o=>{ const b=o;
  const owned=s.owned.includes(b.id),sell=Math.round(o.marketPrice*.72);
  const hist=priceHistory("boat-"+b.id,b.price,o.marketType==="Nuovo"?.98:o.marketType==="Usato"?.72:.55,o.marketType==="Nuovo"?1.08:o.marketType==="Usato"?.91:.70);
  return '<article class="me-market-card"><span class="me-market-badge">'+o.marketType.toUpperCase()+' NPC · stato '+o.condition+'%</span><h3>🛥️ '+b.name+'</h3><p>Serbatoio '+money(b.tank)+' L · consumo '+b.burn+' / NM</p><div class="me-market-price">'+money(o.marketPrice)+' crediti</div>'+historyHTML(hist)+'<p>'+(owned?'Già nella tua flotta':'Disponibile nella marina attuale')+'</p><div class="me-market-actions">'+(owned?'<button type="button" data-sell-boat="'+b.id+'" data-price="'+sell+'">VENDI · '+money(sell)+'</button>':'<button type="button" class="gold" data-buy-boat="'+b.id+'" data-price="'+o.marketPrice+'">COMPRA</button>')+'</div></article>';
 }).join("")+'</div>';
}
function itemsHTML(s){
 return '<div class="me-market-grid">'+ITEMS.map(i=>{
  const o=itemOffer(i),qty=Math.max(0,Number(s.inventory?.[i.id])||0);
  return '<article class="me-market-card"><span class="me-market-badge">'+i.cat+'</span><h3>'+i.icon+' '+i.name+'</h3><div class="me-market-price">'+money(o.buy)+' crediti</div><p>Posseduti: '+qty+' · Valore rivendita: '+money(o.sell)+'</p><div class="me-market-actions"><button type="button" class="gold" data-buy-item="'+i.id+'" data-price="'+o.buy+'">COMPRA</button><button type="button" data-sell-item="'+i.id+'" data-price="'+o.sell+'" '+(qty<1?'disabled':'')+'>VENDI</button></div></article>';
 }).join("")+'</div>';
}
function bind(root){
 root.querySelectorAll("[data-market-mode]").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.marketMode;render();}));
 root.querySelectorAll("[data-market-filter]").forEach(b=>b.addEventListener("click",()=>{marketFilter=b.dataset.marketFilter;render();}));
 root.querySelectorAll("[data-buy-boat]").forEach(b=>b.addEventListener("click",()=>{
  const r=econ()?.buyBoat?.(b.dataset.buyBoat,Number(b.dataset.price));setStatus(r?.message);if(r?.ok)setTimeout(render,500);
 }));
 root.querySelectorAll("[data-sell-boat]").forEach(b=>b.addEventListener("click",()=>{
  const r=econ()?.sellBoat?.(b.dataset.sellBoat,Number(b.dataset.price));setStatus(r?.message);if(r?.ok)setTimeout(render,500);
 }));
 root.querySelectorAll("[data-buy-item]").forEach(b=>b.addEventListener("click",()=>{
  const i=ITEMS.find(x=>x.id===b.dataset.buyItem);const r=econ()?.buyItem?.(i,Number(b.dataset.price));setStatus(r?.message);if(r?.ok)setTimeout(render,500);
 }));
 root.querySelectorAll("[data-sell-item]").forEach(b=>b.addEventListener("click",()=>{
  const i=ITEMS.find(x=>x.id===b.dataset.sellItem);const r=econ()?.sellItem?.(i,Number(b.dataset.price));setStatus(r?.message);if(r?.ok)setTimeout(render,500);
 }));
}
function render(){
 const root=document.getElementById("meMarketplaceApp");
 if(!root)return;
 const s=snap();
 root.innerHTML=headerHTML(s)+(mode==="boats"?boatsHTML(s):itemsHTML(s));
 bind(root);
}
function boot(){
 render();
 document.querySelectorAll('[data-tab="marketplace"],[data-mobile-more-tab="marketplace"]').forEach(b=>b.addEventListener("click",()=>setTimeout(render,50)));
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,50));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();