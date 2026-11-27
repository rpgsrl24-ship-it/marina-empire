(()=>{
"use strict";
const boats=[
{id:"voyager",name:"RPG Academy 8",type:"Day cruiser scuola",price:0,tank:400},
{id:"open",name:"RPG Open 7",type:"Open sportivo",price:80000,tank:300},
{id:"yacht",name:"RPG Cruiser 12",type:"Yacht a motore",price:350000,tank:550},
{id:"yacht14",name:"RPG Prestige 14",type:"Yacht premium",price:650000,tank:700},
{id:"yacht20",name:"RPG Elite 20",type:"Motor yacht",price:1800000,tank:1100},
{id:"yacht30",name:"RPG Majesty 30",type:"Superyacht",price:6000000,tank:1700},
{id:"luna",name:"RPG Imperial 60",type:"Flagship",price:45000000,tank:900}
];
const portNames={rose:"Isola delle Rose",rimini:"Rimini",ancona:"Ancona",lignano:"Lignano",cervia:"Cervia",bari:"Bari",ravenna:"Marina di Ravenna",pescara:"Marina di Pescara",brindisi:"Marina di Brindisi",salerno:"Marina d’Arechi — Salerno",nettuno:"Marina di Nettuno",scarlino:"Marina di Scarlino",loano:"Marina di Loano",portocervo:"Marina di Porto Cervo",capodorlando:"Marina di Capo d’Orlando"};
function context(){const c=window.MarinaLocalSaveContext;if(!c)return null;let h=c.capture();if(!h){c.select(null);h=c.capture()}return h?{c,h}:null}
function defaultGame(){return{name:"Comandante",coins:10000,prestige:0,fuel:300,condition:100,port:"rimini",boat:"voyager",owned:["voyager"],fleetFuel:{},fleetCondition:{},fleetPorts:{},completed:[],trip:null,voyages:0,setupComplete:true,voyageSerial:0}}
function read(){const x=context();if(!x)return null;let g=x.c.readGame(x.h);if(g)return g;const fresh=defaultGame();if(x.c.writeGame(x.h,fresh))g=x.c.readGame(x.h);return g||fresh}
function write(game){const x=context();return !!(x&&x.c.writeGame(x.h,game))}
function safeGame(){return read()||defaultGame()}
const record=x=>x&&typeof x==="object"&&!Array.isArray(x)?x:{};
const RESERVE=2000;
function listing(g,id){const p=record(g?.virtualBoatListings)[id];return p&&p.status==="open"&&p.boat===id?p:null}
function quote(g,id){
 const b=boats.find(x=>x.id===id);
 if(!b||!b.price||!Array.isArray(g?.owned)||!g.owned.includes(id))return 0;
 const condition=Math.max(0,Math.min(100,Number(g.boat===id?g.condition??100:g.fleetCondition?.[id]??100)||0));
 return Math.floor(b.price*(.45+.25*condition/100)/100)*100;
}
function sellReason(g,id){
 if(!g||!boats.some(b=>b.id===id&&b.price>0)||!Array.isArray(g.owned)||!g.owned.includes(id))return "Imbarcazione non vendibile";
 if(g.trip)return "Termina prima la navigazione e l'ormeggio";
 if(g.boat===id)return "Seleziona un'altra barca prima di vendere";
 if(g.owned.length<=1)return "Mantieni almeno un'imbarcazione";
 return "";
}
function marketSnapshot(){
 const s=snapshot(),g=s.game;
 return {...s,boats:s.boats.map(b=>({...b,quote:quote(g,b.id),listing:listing(g,b.id),sellReason:sellReason(g,b.id),canBuy:!g.trip&&!b.isOwned&&b.price>0&&Number(g.coins)>=b.price+RESERVE})),
  favorites:(Array.isArray(g.marketFavorites)?g.marketFavorites:[]).filter(id=>typeof id==="string"),
  history:(Array.isArray(g.virtualBoatSales)?g.virtualBoatSales:[]).slice(-30).reverse()};
}
function marketAction(action,id,now=Date.now()){
 const x=context(),g=x?.c.readGame(x.h);if(!g)return{ok:false,message:"Salvataggio non disponibile"};
 const b=boats.find(v=>v.id===id);
 const listings=record(g.virtualBoatListings);
 if(action==="favorite"){
  if(!b&&!["store-rpg","store-float","store-fix","captain_badge","marina_frame","founder_flag"].includes(id))return{ok:false,message:"Preferito non valido"};
  const f=(Array.isArray(g.marketFavorites)?g.marketFavorites:[]).filter(v=>typeof v==="string");
  g.marketFavorites=f.includes(id)?f.filter(v=>v!==id):[...f,id].slice(-20);
 }else if(action==="cancel"){
  if(!listing(g,id))return{ok:false,message:"Annuncio non disponibile"};
  delete listings[id];g.virtualBoatListings=listings;
 }else if(action==="list"||action==="sell"){
  const reason=sellReason(g,id);if(reason)return{ok:false,message:reason};
  const amount=quote(g,id);if(!Number.isSafeInteger(amount)||amount<=0)return{ok:false,message:"Valutazione non disponibile"};
  if(action==="list"){
   if(listing(g,id))return{ok:false,message:"Annuncio già presente"};
   listings[id]={boat:id,status:"open",quote:amount,createdAt:now};g.virtualBoatListings=listings;
  }else{
   const p=listing(g,id);if(!p)return{ok:false,message:"Pubblica prima un annuncio"};
   const proceeds=Math.min(amount,Math.floor(Number(p.quote)||0));
   if(proceeds<=0||!Number.isSafeInteger(g.coins+proceeds))return{ok:false,message:"Valutazione non valida"};
   const port=g.fleetPorts?.[id]||g.homeMarina||g.port||"rimini";
   g.coins+=proceeds;g.owned=g.owned.filter(v=>v!==id);delete listings[id];g.virtualBoatListings=listings;
   // Sold boats leave the fleet together with their vessel-specific state.
   for(const key of ["fleetFuel","fleetCondition","fleetPorts","crewRoster","crewProgress"]){const r=record(g[key]);delete r[id];g[key]=r;}
   g.virtualBoatSales=(Array.isArray(g.virtualBoatSales)?g.virtualBoatSales:[]).concat([{boat:id,name:b.name,amount:proceeds,port,at:now}]).slice(-30);
   g.economyHistory=(Array.isArray(g.economyHistory)?g.economyHistory:[]).concat([{kind:"boat_sale",id,amount:proceeds,at:now}]).slice(-300);
   if(!x.c.writeGame(x.h,g))return{ok:false,message:"Vendita non salvata: riprova"};
   return{ok:true,amount:proceeds,message:"Venduta al broker simulato · +"+proceeds.toLocaleString("it-IT")+" crediti"};
  }
 }else if(action==="buy"){
  if(!b||!b.price||g.trip||g.owned?.includes(id))return{ok:false,message:"Acquisto non disponibile"};
  if(!Number.isSafeInteger(g.coins)||g.coins-b.price<RESERVE)return{ok:false,message:"Mantieni 2.000 crediti di riserva"};
  return buy(id);
 }else return{ok:false,message:"Operazione non valida"};
 if(!x.c.writeGame(x.h,g))return{ok:false,message:"Operazione non salvata: riprova"};
 return{ok:true,message:action==="favorite"?"Preferiti aggiornati":action==="cancel"?"Annuncio ritirato":"Annuncio virtuale pubblicato · offerta broker disponibile"};
}
function snapshot(){
 const g=safeGame(),owned=Array.isArray(g.owned)?g.owned:["voyager"],active=g.boat||"voyager";
 return {
   game:g,
   boats:boats.map(b=>{
     const isActive=b.id===active,isOwned=owned.includes(b.id);
     const fuel=isActive?Number(g.fuel||0):Number(g.fleetFuel?.[b.id]??b.tank);
     const condition=isActive?Number(g.condition??100):Number(g.fleetCondition?.[b.id]??100);
     const port=isActive?(g.port||"rimini"):(g.fleetPorts?.[b.id]||g.homeMarina||g.port||"rimini");
     return {...b,isActive,isOwned,isListed:!!listing(g,b.id),fuel:Math.max(0,Math.min(b.tank,fuel)),condition:Math.max(0,Math.min(100,condition)),port,portName:portNames[port]||port}
   })
 };
}
function select(id){
 const g=read(); if(!g)return{ok:false,message:"Salvataggio non disponibile"};
 const target=boats.find(b=>b.id===id); if(!target)return{ok:false,message:"Imbarcazione non valida"};
 if(g.trip)return{ok:false,message:"Non puoi cambiare yacht durante una navigazione"};
 g.owned=Array.isArray(g.owned)?g.owned:["voyager"];
 if(!g.owned.includes(id))return{ok:false,message:"Devi prima acquistare questa imbarcazione"};
 if(listing(g,id))return{ok:false,message:"Ritira l’annuncio dal Marketplace prima di utilizzare questa barca"};
 const current=boats.find(b=>b.id===g.boat)||boats[0];
 g.fleetFuel=g.fleetFuel&&typeof g.fleetFuel==="object"?g.fleetFuel:{};
 g.fleetCondition=g.fleetCondition&&typeof g.fleetCondition==="object"?g.fleetCondition:{};
 g.fleetPorts=g.fleetPorts&&typeof g.fleetPorts==="object"?g.fleetPorts:{};
 g.fleetFuel[current.id]=Math.max(0,Math.min(current.tank,Number(g.fuel)||0));
 g.fleetCondition[current.id]=Math.max(0,Math.min(100,Number(g.condition??100)));
 g.fleetPorts[current.id]=g.port||"rimini";
 g.boat=id;
 g.port=g.fleetPorts[id]||g.port||"rimini";
 g.fuel=Number.isFinite(Number(g.fleetFuel[id]))?Math.max(0,Math.min(target.tank,Number(g.fleetFuel[id]))):target.tank;
 g.condition=Number.isFinite(Number(g.fleetCondition[id]))?Math.max(0,Math.min(100,Number(g.fleetCondition[id]))):100;
 if(!write(g))return{ok:false,message:"Cambio yacht non salvato"};
 return{ok:true,message:"Yacht selezionato: "+target.name}
}
function buy(id){
 const g=read(); if(!g)return{ok:false,message:"Salvataggio non disponibile"};
 const target=boats.find(b=>b.id===id);if(!target)return{ok:false,message:"Imbarcazione non valida"};
 if(g.trip)return{ok:false,message:"Non puoi acquistare durante una navigazione"};
 g.owned=Array.isArray(g.owned)?g.owned:["voyager"];
 if(g.owned.includes(id))return select(id);
 if((Number(g.coins)||0)<target.price+RESERVE)return{ok:false,message:"Crediti insufficienti: mantieni 2.000 crediti di riserva"};
 g.coins-=target.price;g.owned.push(id);
 g.fleetFuel=g.fleetFuel&&typeof g.fleetFuel==="object"?g.fleetFuel:{};
 g.fleetCondition=g.fleetCondition&&typeof g.fleetCondition==="object"?g.fleetCondition:{};
 g.fleetPorts=g.fleetPorts&&typeof g.fleetPorts==="object"?g.fleetPorts:{};
 g.fleetFuel[id]=target.tank;g.fleetCondition[id]=100;g.fleetPorts[id]=g.port||"rimini";
 if(!write(g))return{ok:false,message:"Acquisto non salvato"};
 return{ok:true,message:"Acquistata: "+target.name}
}
window.MarinaEmpireFleetLite={snapshot,select,buy,read,marketSnapshot,marketAction};
})();