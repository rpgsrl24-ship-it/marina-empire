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
function read(){const x=context();return x?.c.readGame(x.h)||null}
function write(game){const x=context();return !!(x&&x.c.writeGame(x.h,game))}
function safeGame(){return read()||{name:"Comandante",coins:10000,prestige:0,fuel:300,condition:100,port:"rimini",boat:"voyager",owned:["voyager"],fleetFuel:{},fleetCondition:{},fleetPorts:{}}}
function snapshot(){
 const g=safeGame(),owned=Array.isArray(g.owned)?g.owned:["voyager"],active=g.boat||"voyager";
 return {
   game:g,
   boats:boats.map(b=>{
     const isActive=b.id===active,isOwned=owned.includes(b.id);
     const fuel=isActive?Number(g.fuel||0):Number(g.fleetFuel?.[b.id]??b.tank);
     const condition=isActive?Number(g.condition??100):Number(g.fleetCondition?.[b.id]??100);
     const port=isActive?(g.port||"rimini"):(g.fleetPorts?.[b.id]||g.homeMarina||g.port||"rimini");
     return {...b,isActive,isOwned,fuel:Math.max(0,Math.min(b.tank,fuel)),condition:Math.max(0,Math.min(100,condition)),port,portName:portNames[port]||port}
   })
 };
}
function select(id){
 const g=read(); if(!g)return{ok:false,message:"Salvataggio non disponibile"};
 const target=boats.find(b=>b.id===id); if(!target)return{ok:false,message:"Imbarcazione non valida"};
 if(g.trip)return{ok:false,message:"Non puoi cambiare yacht durante una navigazione"};
 g.owned=Array.isArray(g.owned)?g.owned:["voyager"];
 if(!g.owned.includes(id))return{ok:false,message:"Devi prima acquistare questa imbarcazione"};
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
 if((Number(g.coins)||0)<target.price)return{ok:false,message:"Crediti insufficienti"};
 g.coins-=target.price;g.owned.push(id);
 g.fleetFuel=g.fleetFuel&&typeof g.fleetFuel==="object"?g.fleetFuel:{};
 g.fleetCondition=g.fleetCondition&&typeof g.fleetCondition==="object"?g.fleetCondition:{};
 g.fleetPorts=g.fleetPorts&&typeof g.fleetPorts==="object"?g.fleetPorts:{};
 g.fleetFuel[id]=target.tank;g.fleetCondition[id]=100;g.fleetPorts[id]=g.port||"rimini";
 if(!write(g))return{ok:false,message:"Acquisto non salvato"};
 return{ok:true,message:"Acquistata: "+target.name}
}
window.MarinaEmpireFleetLite={snapshot,select,buy,read};
})();