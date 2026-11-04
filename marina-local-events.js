(()=>{
"use strict";
if(window.__ME_MARINA_LOCAL_EVENTS__)return;
window.__ME_MARINA_LOCAL_EVENTS__=true;

const FALLBACK=[
 {id:"service_window",icon:"⚓",title:"Finestra servizi marina",text:"Più richieste operative concentrate in banchina.",traffic:1.08,demand:1.06,contracts:{arrival:1.25,fuel:1.15,tech:1.1}},
 {id:"quiet_shift",icon:"🌊",title:"Turno tranquillo",text:"Traffico regolare e domanda distribuita.",traffic:.92,demand:.96,contracts:{broker:1.15,provisioning:1.05}}
];

const EVENTS={
 rose:[
  {id:"rpg_demo",icon:"🏝️",title:"Demo operativa RPG Yacht",text:"Movimenti dimostrativi, toys e assistenza alla flotta RPG Yacht.",traffic:1.1,demand:1.12,contracts:{toys:1.55,tech:1.25,arrival:1.2}},
  {id:"rpg_fleet",icon:"🛥️",title:"Rotazione flotta RPG",text:"La base coordina arrivi, partenze e preparazione mezzi.",traffic:1.18,demand:1.1,contracts:{arrival:1.35,fuel:1.2,provisioning:1.15}}
 ],
 rimini:[
  {id:"rimini_toys",icon:"🏄",title:"Weekend water toys",text:"Forte richiesta di toys, charter giornalieri e servizi ospiti.",traffic:1.2,demand:1.18,contracts:{toys:1.7,charter:1.35,provisioning:1.2}},
  {id:"rimini_charter",icon:"🛥️",title:"Giornata charter",text:"Turnaround ravvicinati e nuove partenze charter.",traffic:1.15,demand:1.16,contracts:{charter:1.6,arrival:1.25,transfer:1.25}}
 ],
 ancona:[
  {id:"ancona_ferry",icon:"🚢",title:"Finestra traghetti",text:"Movimenti commerciali e coordinamento banchina più intensi.",traffic:1.3,demand:1.1,contracts:{arrival:1.45,fuel:1.25,security:1.3},vessels:{commercial:1.7,port:1.35}},
  {id:"ancona_tech",icon:"🔧",title:"Picco assistenza tecnica",text:"Aumentano gli interventi su impianti e mezzi in transito.",traffic:1.08,demand:1.2,contracts:{tech:1.75,fuel:1.2}}
 ],
 lignano:[
  {id:"lignano_family",icon:"☀️",title:"Partenze family charter",text:"Diporto e charter leisure concentrati nelle prossime ore.",traffic:1.16,demand:1.14,contracts:{charter:1.45,provisioning:1.3,transfer:1.15}},
  {id:"lignano_toys",icon:"🌊",title:"Domanda attività acquatiche",text:"SUP, e-foil e toys sono richiesti dagli equipaggi leisure.",traffic:1.08,demand:1.15,contracts:{toys:1.65,provisioning:1.2}}
 ],
 cervia:[
  {id:"cervia_regatta",icon:"⛵",title:"Regata costiera simulata",text:"Più vela, supporto logistico e assistenza agli equipaggi.",traffic:1.2,demand:1.14,contracts:{arrival:1.2,toys:1.3,security:1.25},vessels:{regatta:1.8}},
  {id:"cervia_sailing",icon:"🌬️",title:"Sessione sailing",text:"Movimenti vela e preparazione tecnica aumentano.",traffic:1.1,demand:1.1,contracts:{tech:1.25,provisioning:1.15},vessels:{regatta:1.5}}
 ],
 bari:[
  {id:"bari_transit",icon:"🧭",title:"Ondata transiti Adriatico",text:"Più unità in transito richiedono ormeggio e servizi.",traffic:1.25,demand:1.14,contracts:{arrival:1.45,fuel:1.35,tech:1.2},vessels:{commercial:1.35}},
  {id:"bari_charter",icon:"🛥️",title:"Arrivi charter",text:"Nuovi charter e ospiti alimentano servizi e transfer.",traffic:1.12,demand:1.16,contracts:{charter:1.45,transfer:1.35,provisioning:1.25}}
 ],
 ravenna:[
  {id:"ravenna_yard",icon:"🔧",title:"Turno cantiere",text:"Aumentano diagnosi, manutenzioni e assistenza tecnica.",traffic:1.08,demand:1.22,contracts:{tech:1.85,fuel:1.2},vessels:{service:1.4}},
  {id:"ravenna_workboat",icon:"⚙️",title:"Movimenti workboat",text:"Mezzi di servizio e traffico operativo intensificano le manovre.",traffic:1.28,demand:1.08,contracts:{arrival:1.35,security:1.25},vessels:{commercial:1.55,port:1.45}}
 ],
 pescara:[
  {id:"pescara_charter",icon:"☀️",title:"Charter costiero",text:"Richieste leisure e partenze giornaliere aumentano.",traffic:1.12,demand:1.14,contracts:{charter:1.5,toys:1.3,provisioning:1.2}},
  {id:"pescara_service",icon:"⚓",title:"Rientri costieri",text:"Più rientri generano fuel, ormeggio e piccoli interventi.",traffic:1.15,demand:1.1,contracts:{arrival:1.35,fuel:1.3,tech:1.15}}
 ],
 brindisi:[
  {id:"brindisi_transit",icon:"🚢",title:"Ondata transiti",text:"Il porto riceve più unità in transito e richieste di assistenza.",traffic:1.3,demand:1.13,contracts:{arrival:1.5,fuel:1.4,security:1.25},vessels:{commercial:1.55}},
  {id:"brindisi_fuel",icon:"⛽",title:"Fuel dock sotto pressione",text:"Rifornimenti e soste tecniche si concentrano nella stessa finestra.",traffic:1.18,demand:1.16,contracts:{fuel:1.75,tech:1.3}}
 ],
 salerno:[
  {id:"salerno_amalfi",icon:"🛥️",title:"Charter Costiera simulato",text:"Charter premium e provisioning aumentano prima delle partenze.",traffic:1.22,demand:1.2,contracts:{charter:1.7,provisioning:1.45,transfer:1.35}},
  {id:"salerno_vip",icon:"✨",title:"Arrivi VIP",text:"Superyacht e ospiti premium richiedono concierge e security.",traffic:1.25,demand:1.22,contracts:{vip:1.75,security:1.5,transfer:1.55},vessels:{superyacht:1.5}}
 ],
 nettuno:[
  {id:"nettuno_service",icon:"🔧",title:"Yacht service day",text:"Manutenzione, fuel e turnaround yacht aumentano.",traffic:1.12,demand:1.15,contracts:{tech:1.55,fuel:1.3,arrival:1.2}},
  {id:"nettuno_broker",icon:"💼",title:"Visite broker",text:"Più sea trial e richieste commerciali sugli yacht.",traffic:1.03,demand:1.12,contracts:{broker:1.7,charter:1.15}}
 ],
 scarlino:[
  {id:"scarlino_regatta",icon:"⛵",title:"Weekend regata simulato",text:"Equipaggi vela e supporto hospitality animano la marina.",traffic:1.2,demand:1.16,contracts:{arrival:1.25,provisioning:1.3,security:1.2},vessels:{regatta:1.75}},
  {id:"scarlino_premium",icon:"✨",title:"Sailing premium",text:"Yacht e vela premium alimentano concierge e servizi ospiti.",traffic:1.1,demand:1.14,contracts:{vip:1.35,provisioning:1.3,toys:1.25}}
 ],
 loano:[
  {id:"loano_tech",icon:"🔧",title:"Finestra yacht service",text:"Interventi tecnici e preparazione yacht aumentano.",traffic:1.12,demand:1.18,contracts:{tech:1.65,fuel:1.25}},
  {id:"loano_arrivals",icon:"🛥️",title:"Arrivi yacht premium",text:"Più yacht richiedono ormeggio, concierge e provisioning.",traffic:1.18,demand:1.16,contracts:{arrival:1.35,vip:1.35,provisioning:1.3},vessels:{superyacht:1.25}}
 ],
 portocervo:[
  {id:"cervo_megayacht",icon:"🛥️",title:"Arrivi megayacht simulati",text:"Superyacht e tender generano forte domanda di servizi premium.",traffic:1.3,demand:1.25,contracts:{vip:1.85,provisioning:1.65,toys:1.5,security:1.55},vessels:{superyacht:1.9}},
  {id:"cervo_vip",icon:"✨",title:"Serata VIP simulata",text:"Concierge, transfer e security diventano prioritari.",traffic:1.18,demand:1.24,contracts:{vip:1.8,transfer:1.7,security:1.65}}
 ],
 capodorlando:[
  {id:"orlando_eolie",icon:"🧭",title:"Partenze Eolie simulate",text:"Charter e vela si preparano a nuove rotte insulari.",traffic:1.2,demand:1.18,contracts:{charter:1.65,provisioning:1.4,fuel:1.2},vessels:{charter:1.5,regatta:1.25}},
  {id:"orlando_sailing",icon:"⛵",title:"Arrivi sailing",text:"Vela e cruising generano ormeggio, toys e servizi equipaggio.",traffic:1.14,demand:1.14,contracts:{arrival:1.35,toys:1.35,provisioning:1.25},vessels:{regatta:1.5}}
 ]
};

function slot(){return Math.floor(Date.now()/5400000)}
function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function eventFor(port,offset=0){
 const key=String(port||"rimini").toLowerCase(),s=slot()+offset,pool=EVENTS[key]||FALLBACK,e=pool[hash(key+"|local|"+s)%pool.length];
 return {...e,port:key,slot:s,until:(s+1)*5400000,simulated:true};
}
function contractWeight(contract,port){
 const e=eventFor(port),id=String(contract?.id||"");
 return Math.max(.05,Number(e.contracts?.[id])||1);
}
function vesselWeight(vessel,port){
 const e=eventFor(port),key=String(vessel?.profile||"service");
 return Math.max(.05,Number(e.vessels?.[key])||1);
}
function modifiers(port){
 const e=eventFor(port);
 return {event:e,traffic:Math.max(.7,Math.min(1.4,Number(e.traffic)||1)),demand:Math.max(.8,Math.min(1.35,Number(e.demand)||1))};
}

window.MarinaEmpireLocalEvents={eventFor,modifiers,contractWeight,vesselWeight,slot};
})();