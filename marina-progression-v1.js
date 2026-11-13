(()=>{
"use strict";
if(window.MarinaEmpireMarinaProgression)return;
const PORTS=[
 ["rose","Isola delle Rose"],["rimini","Rimini"],["ancona","Ancona"],["lignano","Lignano"],["cervia","Cervia"],["bari","Bari"],["ravenna","Marina di Ravenna"],["pescara","Marina di Pescara"],["brindisi","Marina di Brindisi"],["salerno","Marina d’Arechi — Salerno"],["nettuno","Marina di Nettuno"],["scarlino","Marina di Scarlino"],["loano","Marina di Loano"],["portocervo","Porto Cervo"],["capodorlando","Capo d’Orlando"]
].map(([id,name])=>Object.freeze({id,name}));
const PORT_IDS=new Set(PORTS.map(p=>p.id));
const MILESTONES=Object.freeze([
 Object.freeze({count:5,label:"ESPLORATORE ADRIATICO",icon:"🧭"}),
 Object.freeze({count:10,label:"NAVIGATORE D’ITALIA",icon:"⚓"}),
 Object.freeze({count:15,label:"COMANDANTE DELLE COSTE",icon:"👑"})
]);
function valid(id){return PORT_IDS.has(String(id||""))}
function visited(game){
 const set=new Set();
 const add=id=>{id=String(id||"");if(valid(id))set.add(id)};
 if(Array.isArray(game?.visitedPorts))game.visitedPorts.forEach(add);
 add(game?.homeMarina);add(game?.port);
 if(game?.trip)add(game.trip.origin);
 if(game?.lastArrival)add(game.lastArrival.destination);
 if(game?.lastDockedBridge){add(game.lastDockedBridge.origin);add(game.lastDockedBridge.destination)}
 for(const id of (Array.isArray(game?.completed)?game.completed:[])){
  const s=String(id||"");
  if(s==="INTRO_RIMINI_CERVIA"){add("rimini");add("cervia");continue}
  const m=s.match(/^R_[^_]+_([^_]+)_([^_]+)$/);
  if(m){add(m[1]);add(m[2])}
 }
 if(set.size===0)add("rimini");
 return set;
}
function passport(game){
 const seen=visited(game),count=seen.size,total=PORTS.length;
 const next=MILESTONES.find(m=>count<m.count)||null;
 return Object.freeze({
  count,total,progress:Math.min(100,Math.round(count/total*100)),next,
  ports:PORTS.map(p=>Object.freeze({...p,visited:seen.has(p.id)})),
  milestones:MILESTONES.map(m=>Object.freeze({...m,unlocked:count>=m.count}))
 });
}
function reputation(game,id){
 const completed=Math.max(0,Math.floor(Number(game?.marinaOperations?.[id]?.completed)||0));
 let label="OSPITE",icon="⚪",min=0,next=1;
 if(completed>=6){label="VIP";icon="👑";min=6;next=null}
 else if(completed>=3){label="FIDATO";icon="⭐";min=3;next=6}
 else if(completed>=1){label="CONOSCIUTO";icon="⚓";min=1;next=3}
 const progress=next===null?100:Math.max(0,Math.min(100,Math.round((completed-min)/(next-min)*100)));
 return Object.freeze({completed,label,icon,min,next,progress,remaining:next===null?0:Math.max(0,next-completed)});
}
function name(id){return PORTS.find(p=>p.id===id)?.name||String(id||"Marina")}
window.MarinaEmpireMarinaProgression=Object.freeze({ports:PORTS,milestones:MILESTONES,visited,passport,reputation,name});
})();