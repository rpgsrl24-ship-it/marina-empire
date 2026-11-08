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
const EVENT_MARKET={
 eventId:"toy_weekend",
 items:new Set(["sup","efoil","seabob","floating_platform"]),
 client:null,
 user:null,
 loading:false,
 listings:[],
 status:"",
 initialized:false
};
function eventMarketActive(){
 const ev=window.MarinaEmpireWorldEvents?.current?.();
 return ev?.id===EVENT_MARKET.eventId;
}
function eventMarketSupabase(){
 if(EVENT_MARKET.client)return EVENT_MARKET.client;
 if(!window.supabase?.createClient)return null;
 EVENT_MARKET.client=window.supabase.createClient(
  "https://zrdetqvnjmqkfyajxjgp.supabase.co",
  "sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw",
  {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
 );
 return EVENT_MARKET.client;
}
async function refreshEventMarket(){
 if(!eventMarketActive()){EVENT_MARKET.listings=[];EVENT_MARKET.status="";return render();}
 const client=eventMarketSupabase();
 if(!client){EVENT_MARKET.status="Mercato evento online non disponibile.";return render();}
 EVENT_MARKET.loading=true;render();
 try{
  const {data:auth,error:authError}=await client.auth.getUser();
  EVENT_MARKET.user=authError?null:auth?.user||null;
  if(!EVENT_MARKET.user){
   EVENT_MARKET.status="Accedi con un account registrato per usare il mercato tra giocatori.";
   EVENT_MARKET.listings=[];
  }else{
   const {data,error}=await client.from("me_event_market_listings")
    .select("id,event_id,seller_id,seller_name,item_id,item_name,quantity,unit_price,status,created_at,expires_at")
    .eq("event_id",EVENT_MARKET.eventId)
    .eq("status","open")
    .gt("expires_at",new Date().toISOString())
    .order("created_at",{ascending:false})
    .limit(50);
   if(error)throw error;
   EVENT_MARKET.listings=data||[];
   EVENT_MARKET.status="";
  }
 }catch(e){EVENT_MARKET.status=e?.message||"Mercato evento non disponibile."}
 finally{EVENT_MARKET.loading=false;render();}
}
function eventMarketHTML(s){
 if(!eventMarketActive())return "";
 const inv=s.inventory||{},eventItems=ITEMS.filter(i=>EVENT_MARKET.items.has(i.id));
 const own=EVENT_MARKET.listings.filter(x=>x.seller_id===EVENT_MARKET.user?.id);
 const others=EVENT_MARKET.listings.filter(x=>x.seller_id!==EVENT_MARKET.user?.id);
 const inventoryRows=eventItems.map(i=>{
  const qty=Math.max(0,Number(inv[i.id])||0),suggest=Math.max(50,Math.round(i.base*1.08));
  return '<article class="me-market-card"><span class="me-market-badge">EVENTO · WATER TOYS</span><h3>'+i.icon+' '+i.name+'</h3><p>Posseduti: '+qty+' · domanda evento elevata</p><div class="me-market-actions"><input type="number" min="50" max="100000" step="50" value="'+suggest+'" data-event-price="'+i.id+'" style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(214,181,117,.35);background:#081f2e;color:#fff"><button type="button" class="gold" data-event-list="'+i.id+'" '+(qty<1||!EVENT_MARKET.user?'disabled':'')+'>METTI IN VENDITA</button></div></article>';
 }).join("");
 const listingRows=others.map(x=>{
  const total=Number(x.unit_price)*Number(x.quantity||1);
  return '<article class="me-market-card"><span class="me-market-badge">VENDITORE · '+String(x.seller_name||"Comandante").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))+'</span><h3>🤝 '+String(x.item_name||x.item_id).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))+'</h3><p>Quantità '+Number(x.quantity||1)+' · prezzo unitario '+money(x.unit_price)+'</p><div class="me-market-price">'+money(total)+' crediti</div><div class="me-market-actions"><button type="button" class="gold" data-event-buy="'+x.id+'" '+(!EVENT_MARKET.user?'disabled':'')+'>ACQUISTA DAL GIOCATORE</button></div></article>';
 }).join("");
 const ownRows=own.map(x=>'<article class="me-market-card"><span class="me-market-badge">TUO ANNUNCIO</span><h3>📣 '+x.item_name+'</h3><p>'+x.quantity+' × '+money(x.unit_price)+' crediti</p><div class="me-market-actions"><button type="button" data-event-cancel="'+x.id+'">RITIRA ANNUNCIO</button></div></article>').join("");
 return '<section class="me-market-card" style="grid-column:1/-1;border-color:#e0b85f"><span class="me-market-badge">🌊 MERCATO EVENTO · WEEKEND WATER TOYS</span><h3>Vendi ai giocatori i prodotti richiesti dall’evento</h3><p>SUP, E-Foil, Seabob e piattaforme hanno una domanda speciale. Gli annunci durano 60 minuti.</p><div class="me-market-actions"><button type="button" class="gold" data-event-refresh>AGGIORNA OFFERTE</button><button type="button" data-event-claim '+(!EVENT_MARKET.user?'disabled':'')+'>RISCUOTI VENDITE</button></div><p class="me-market-status">'+(EVENT_MARKET.loading?"Aggiornamento mercato...":EVENT_MARKET.status||"Mercato evento online attivo.")+'</p><h3>📦 Il tuo inventario evento</h3><div class="me-market-grid">'+inventoryRows+'</div><h3 style="margin-top:14px">🛒 Offerte degli altri giocatori</h3><div class="me-market-grid">'+(listingRows||'<div class="me-market-card"><p>Nessuna offerta pubblicata dagli altri giocatori in questo momento.</p></div>')+'</div>'+(ownRows?'<h3 style="margin-top:14px">📣 I tuoi annunci</h3><div class="me-market-grid">'+ownRows+'</div>':"")+'</section>';
}
async function eventMarketAction(kind,arg){
 const client=eventMarketSupabase();
 if(!client)return setStatus("Mercato evento online non disponibile.");
 const {data:auth,error:authError}=await client.auth.getUser();
 if(authError||!auth?.user)return setStatus("Accedi con un account registrato per usare il mercato evento.");
 try{
  let result;
  if(kind==="list"){
   const input=document.querySelector('[data-event-price="'+arg+'"]');
   const price=Math.max(50,Math.floor(Number(input?.value)||0));
   result=await client.rpc("me_event_market_create_listing",{p_event_id:EVENT_MARKET.eventId,p_item_id:arg,p_unit_price:price,p_quantity:1});
  }else if(kind==="buy"){
   result=await client.rpc("me_event_market_buy_listing",{p_listing_id:arg});
  }else if(kind==="cancel"){
   result=await client.rpc("me_event_market_cancel_listing",{p_listing_id:arg});
  }else if(kind==="claim"){
   result=await client.rpc("me_event_market_claim_payouts");
  }
  if(result?.error)throw result.error;
  const payload=result?.data;
  const row=Array.isArray(payload)?payload[0]:payload;
  if(row?.game_state){
   try{
    const uid=auth.user.id;
    window.MarinaLocalSaveContext?.select(uid);
    const handle=window.MarinaLocalSaveContext?.capture?.();
    if(handle)window.MarinaLocalSaveContext?.writeGame?.(handle,row.game_state);
   }catch(_){}
  }
  if(kind==="claim")setStatus((row?.claimed_amount||0)>0?"Vendite riscosse: +"+money(row.claimed_amount)+" crediti.":"Nessuna vendita da riscuotere.");
  else setStatus(kind==="buy"?"Acquisto completato dal giocatore.":kind==="cancel"?"Annuncio ritirato.":"Annuncio pubblicato nel mercato evento.");
  window.dispatchEvent(new Event("marina-empire-updated"));
  await refreshEventMarket();
 }catch(e){setStatus(e?.message||"Operazione mercato evento non riuscita.");}
}


function econ(){return window.MarinaEmpireMarketplaceEconomy}
function snap(){return econ()?.snapshot?.()||{coins:0,owned:[],inventory:{},registered:false,port:"rimini"}}
function specializationMarketBonus(){
 const s=window.MarinaEmpireSpecialization?.get?.();
 return s?.key==="broker"?1.08:1;
}
function brokerInfo(){
 const npc=window.MarinaEmpireNpcEconomy;
 const rep=npc?.reputation?.().broker||0;
 const level=npc?.sectorLevel?.("broker")||1;
 return {rep,level};
}
function marinaProfile(port){
 const profiles={
  rimini:{label:"Rimini",boat:.99,toys:.98,tech:1.02,note:"Mercato equilibrato · charter e accessori"},
  ancona:{label:"Ancona",boat:.96,toys:1.01,tech:.97,note:"Buona disponibilità tecnica"},
  lignano:{label:"Lignano",boat:1.02,toys:.95,tech:1.01,note:"Forte domanda water toys"},
  cervia:{label:"Cervia",boat:.97,toys:.96,tech:1.03,note:"Occasioni su piccole unità"},
  bari:{label:"Bari",boat:1.04,toys:1.02,tech:.98,note:"Domanda elevata su yacht e tecnica"},
  ravenna:{label:"Ravenna",boat:.95,toys:1.01,tech:.96,note:"Mercato tecnico e refit"},
  pescara:{label:"Pescara",boat:.98,toys:.99,tech:1.00,note:"Mercato stabile"},
  brindisi:{label:"Brindisi",boat:1.01,toys:1.00,tech:.97,note:"Buona offerta tecnica"},
  salerno:{label:"Salerno",boat:1.05,toys:1.03,tech:1.01,note:"Mercato premium"},
  nettuno:{label:"Nettuno",boat:1.00,toys:.98,tech:1.00,note:"Mercato equilibrato"},
  scarlino:{label:"Scarlino",boat:1.06,toys:1.03,tech:1.02,note:"Yacht premium e charter"},
  loano:{label:"Loano",boat:1.03,toys:1.01,tech:.99,note:"Usato di fascia medio-alta"},
  portocervo:{label:"Porto Cervo",boat:1.12,toys:1.08,tech:1.04,note:"Mercato luxury · prezzi elevati"},
  capodorlando:{label:"Capo d’Orlando",boat:.99,toys:.97,tech:1.00,note:"Buone occasioni stagionali"},
  rose:{label:"Isola delle Rose",boat:1.00,toys:1.00,tech:1.00,note:"Base RPG Yacht · mercato osservato"}
 };
 return profiles[port]||{label:port||"Marina",boat:1,toys:1,tech:1,note:"Mercato locale"};
}function money(n){return Math.round(Number(n)||0).toLocaleString("it-IT")}
function factor(key,min=.82,max=1.12){
 let h=seed;
 for(const ch of String(key))h=(h*31+ch.charCodeAt(0))>>>0;
 return min+((h%1000)/1000)*(max-min);
}
function boatOffer(b,s){
 const world=window.MarinaEmpireWorldEvents?.modifiers?.(s?.port)||{boats:1,toys:1,tech:1,demand:1};
 const k=Math.abs(Math.floor(factor("class-"+b.id,0,300)));
 const marketType=k<100?"Nuovo":k<220?"Usato":"Occasione";
 const range=marketType==="Nuovo"?[.98,1.08]:marketType==="Usato"?[.72,.91]:[.55,.70];
 const profile=marinaProfile(s?.port);
 const broker=brokerInfo();
 const brokerDiscount=Math.max(.94,1-(broker.level-1)*.012);
 const price=Math.max(1000,Math.round((b.price||0)*factor("boat-"+b.id+"-"+(s?.port||""),range[0],range[1])*profile.boat*brokerDiscount*world.boats));
 const condition=marketType==="Nuovo"?100:marketType==="Usato"?Math.round(78+factor("cond-"+b.id,0,16)):Math.round(62+factor("cond-"+b.id,0,15));
 return {...b,marketPrice:price,marketType,condition,marina:profile.label,brokerLevel:broker.level};
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
function itemOffer(i,s){
 const world=window.MarinaEmpireWorldEvents?.modifiers?.(s?.port)||{boats:1,toys:1,tech:1,demand:1};
 const profile=marinaProfile(s?.port);
 const catFactor=i.cat==="Water Toys"?profile.toys:(i.cat==="Tecnica"||i.cat==="Elettronica")?profile.tech:1;
 const broker=brokerInfo();
 const brokerDiscount=Math.max(.95,1-(broker.level-1)*.01);
 const eventFactor=i.cat==="Water Toys"?world.toys:(i.cat==="Tecnica"||i.cat==="Elettronica")?world.tech:1;
 const buy=Math.max(50,Math.round(i.base*factor("item-"+i.id+"-"+(s?.port||""),.88,1.08)*catFactor*brokerDiscount*eventFactor));
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
 const p=marinaProfile(s.port),b=brokerInfo();
 return '<div class="me-market-summary"><div><div class="me-market-balance">Saldo: '+money(s.coins)+' crediti</div><div class="me-market-chip">⚓ '+p.label+' · '+p.note+'</div><div class="me-market-chip">💼 Broker Lv '+b.level+' · rep '+b.rep+'</div><div class="me-market-inventory">'+(inv||'<span class="me-market-chip">Inventario vuoto</span>')+'</div></div><div class="me-market-tabs"><button type="button" data-market-mode="boats" class="'+(mode==="boats"?"on":"")+'">🛥️ IMBARCAZIONI</button><button type="button" data-market-mode="items" class="'+(mode==="items"?"on":"")+'">🧰 ACCESSORI & TOYS</button></div></div>'+(mode==="boats"?'<div class="me-market-filters"><button type="button" data-market-filter="all" class="'+(marketFilter==="all"?"on":"")+'">TUTTE</button><button type="button" data-market-filter="Nuovo" class="'+(marketFilter==="Nuovo"?"on":"")+'">NUOVO</button><button type="button" data-market-filter="Usato" class="'+(marketFilter==="Usato"?"on":"")+'">USATO</button><button type="button" data-market-filter="Occasione" class="'+(marketFilter==="Occasione"?"on":"")+'">OCCASIONI</button></div>':'')+'<div class="me-market-status" role="status"></div>';
}
function boatsHTML(s){
 const boats=econ()?.boats?.()||[];
 const exclusive=exclusiveBrokerDeal(s);
 const list=boats.filter(b=>b.id!=="voyager").map(b=>boatOffer(b,s));
 if(exclusive){const i=list.findIndex(x=>x.id===exclusive.id);if(i>=0)list[i]=exclusive;}
 return '<div class="me-market-grid">'+list.filter(b=>b.id!=="voyager").map(b=>boatOffer(b,s)).filter(o=>marketFilter==="all"||o.marketType===marketFilter).map(o=>{ const b=o;
  const owned=s.owned.includes(b.id),sell=Math.round(o.marketPrice*.72);
  const hist=priceHistory("boat-"+b.id,b.price,o.marketType==="Nuovo"?.98:o.marketType==="Usato"?.72:.55,o.marketType==="Nuovo"?1.08:o.marketType==="Usato"?.91:.70);
  return '<article class="me-market-card"><span class="me-market-badge">'+(o.exclusive?'⭐ OFFERTA BROKER ESCLUSIVA · ':o.marketType.toUpperCase()+' NPC · ')+o.marina+' · stato '+o.condition+'%</span><h3>🛥️ '+b.name+'</h3><p>Serbatoio '+money(b.tank)+' L · consumo '+b.burn+' / NM</p><div class="me-market-price">'+money(o.marketPrice)+' crediti</div>'+historyHTML(hist)+'<p>'+(owned?'Già nella tua flotta':'Disponibile nella marina attuale')+'</p><div class="me-market-actions">'+(owned?'<button type="button" data-sell-boat="'+b.id+'" data-price="'+sell+'">VENDI · '+money(sell)+'</button>':'<button type="button" class="gold" data-buy-boat="'+b.id+'" data-price="'+o.marketPrice+'">COMPRA</button>')+'</div></article>';
 }).join("")+'</div>';
}
function itemsHTML(s){
 return '<div class="me-market-grid">'+ITEMS.map(i=>{
  const o=itemOffer(i,s),qty=Math.max(0,Number(s.inventory?.[i.id])||0);
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
 root.querySelectorAll("[data-event-refresh]").forEach(b=>b.addEventListener("click",()=>refreshEventMarket()));
 root.querySelectorAll("[data-event-list]").forEach(b=>b.addEventListener("click",()=>eventMarketAction("list",b.dataset.eventList)));
 root.querySelectorAll("[data-event-buy]").forEach(b=>b.addEventListener("click",()=>eventMarketAction("buy",b.dataset.eventBuy)));
 root.querySelectorAll("[data-event-cancel]").forEach(b=>b.addEventListener("click",()=>eventMarketAction("cancel",b.dataset.eventCancel)));
 root.querySelectorAll("[data-event-claim]").forEach(b=>b.addEventListener("click",()=>eventMarketAction("claim")));
 root.querySelectorAll("[data-fulfill-demand]").forEach(b=>b.addEventListener("click",()=>{
  const demand={id:b.dataset.fulfillDemand,kind:b.dataset.kind,targetId:b.dataset.target,value:Number(b.dataset.value),repGain:Number(b.dataset.rep)};
  const r=econ()?.fulfillDemand?.(demand);setStatus(r?.message);if(r?.ok)setTimeout(render,500);
 }));
}
function exclusiveBrokerDeal(s){
 const b=brokerInfo();if(b.level<3)return null;
 const boats=econ()?.boats?.()||[];
 const candidates=boats.filter(x=>x.id!=="voyager"&&!s.owned.includes(x.id));
 if(!candidates.length)return null;
 const pick=candidates[Math.abs(Math.floor(factor("exclusive-"+s.port,0,candidates.length)))%candidates.length];
 const base=boatOffer(pick,s);
 const discount=b.level>=5?.84:b.level>=4?.88:.92;
 return {...base,marketPrice:Math.round(base.marketPrice*discount),exclusive:true};
}
function demandOffers(s){
 const b=brokerInfo(),p=marinaProfile(s.port);
 const offers=[];
 const inv=Object.entries(s.inventory||{}).filter(([,q])=>Number(q)>0);
 if(inv.length){
  const [id]=inv[Math.abs(Math.floor(factor("demand-item-"+s.port,0,inv.length)))%inv.length];
  const item=ITEMS.find(x=>x.id===id);
  if(item){
   const premium=1.08+(b.level-1)*.025;
   const demandBoost=window.MarinaEmpireWorldEvents?.modifiers?.(s.port)?.demand||1;
   const value=Math.round(itemOffer(item,s).buy*premium*demandBoost*specializationMarketBonus());
   offers.push({id:"demand-item-"+s.port+"-"+id+"-"+seed,kind:"item",targetId:id,title:"Cliente cerca "+item.name,detail:"Richiesta urgente a "+p.label,value,repGain:4+b.level});
  }
 }
 const sellable=(econ()?.boats?.()||[]).filter(x=>x.id!=="voyager"&&s.owned.includes(x.id)&&x.id!==s.boat);
 if(sellable.length){
  const boat=sellable[Math.abs(Math.floor(factor("demand-boat-"+s.port,0,sellable.length)))%sellable.length];
  const offer=boatOffer(boat,s);
  const demandBoost=window.MarinaEmpireWorldEvents?.modifiers?.(s.port)?.demand||1;
  const value=Math.round(offer.marketPrice*(1.03+b.level*.02)*demandBoost*specializationMarketBonus());
  offers.push({id:"demand-boat-"+s.port+"-"+boat.id+"-"+seed,kind:"boat",targetId:boat.id,title:"Armatore cerca "+boat.name,detail:"Acquisto diretto tramite broker locale",value,repGain:7+b.level});
 }
 return offers;
}
function demandHTML(s){
 const offers=demandOffers(s);
 if(!offers.length)return '<div class="me-market-card"><span class="me-market-badge">DOMANDA NPC</span><h3>🤝 Richieste clienti</h3><p>Nessuna richiesta compatibile con il tuo inventario in questo momento.</p></div>';
 return '<div class="me-market-grid">'+offers.map(o=>'<article class="me-market-card"><span class="me-market-badge">DOMANDA NPC · '+marinaProfile(s.port).label+'</span><h3>🤝 '+o.title+'</h3><p>'+o.detail+'</p><div class="me-market-price">'+money(o.value)+' crediti</div><p>Bonus reputazione Broker +'+o.repGain+'</p><div class="me-market-actions"><button type="button" class="gold" data-fulfill-demand="'+o.id+'" data-kind="'+o.kind+'" data-target="'+o.targetId+'" data-value="'+o.value+'" data-rep="'+o.repGain+'">CONCLUDI AFFARE</button></div></article>').join('')+'</div>';
}
function marketPulseHTML(s){
 const p=marinaProfile(s.port),b=brokerInfo();
 const world=window.MarinaEmpireWorldEvents?.current?.();
 const events=[
  "Arrivo yacht in conto vendita",
  "Cantiere locale libera stock ricambi",
  "Charter vende attrezzatura stagionale",
  "Dealer cerca liquidità immediata",
  "Nuova richiesta di acquisto da armatore"
 ];
 const idx=Math.abs(Math.floor(factor("pulse-"+s.port,0,events.length)))%events.length;
 const spec=window.MarinaEmpireSpecialization?.get?.();
 const edge=(spec?.key==="broker"?"🎯 Broker Nautico attivo · domanda NPC +8%. ":"")+(b.level>=5?"Broker Lv 5: sconti massimi e mandati top.":b.level>=4?"Broker Lv 4: offerte esclusive migliorate.":b.level>=3?"Broker Lv 3: accesso alle occasioni esclusive attivo.":"Aumenta la reputazione Broker per ricevere condizioni migliori.");
 return '<div class="me-market-card"><span class="me-market-badge">MERCATO LIVE</span><h3>📈 '+p.label+'</h3><p>'+(world?(world.icon+" "+world.title+" · "+world.text):events[idx])+'</p><p>'+edge+'</p></div>';
}
function render(){
 const root=document.getElementById("meMarketplaceApp");
 if(!root)return;
 const s=snap();
 root.innerHTML=headerHTML(s)+eventMarketHTML(s)+marketPulseHTML(s)+demandHTML(s)+(mode==="boats"?boatsHTML(s):itemsHTML(s));
 bind(root);
}
function boot(){
 render();
 document.querySelectorAll('[data-tab="marketplace"],[data-mobile-more-tab="marketplace"]').forEach(b=>b.addEventListener("click",()=>setTimeout(render,50)));
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,50));
 window.addEventListener("marina-world-event",()=>{setTimeout(render,50);setTimeout(refreshEventMarket,100)});
 if(eventMarketActive())setTimeout(refreshEventMarket,250);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();