(()=>{
"use strict";
const PROJECTS=[
{id:"efficient_engines",category:"technology",icon:"⚙️",name:"Motori Efficienti",desc:"Riduce il consumo di carburante del 10%.",cost:30000,duration:2700000,benefit:"Consumi -10%",requires:[]},
{id:"reinforced_hull",category:"ships",icon:"🛥️",name:"Scafo Rinforzato",desc:"Riduce l'usura dello yacht del 20%.",cost:75000,duration:9600000,benefit:"Usura -20%",requires:["efficient_engines"]},
{id:"smart_pontoon",category:"marina",icon:"⚓",name:"Pontile Smart",desc:"Aumenta la capacità economica degli ormeggi del 20%.",cost:150000,duration:15600000,benefit:"Ormeggi +20%",requires:["efficient_engines"]},
{id:"sustainable_energy",category:"services",icon:"☀️",name:"Energia Sostenibile",desc:"Riduce i costi operativi della Marina del 15%.",cost:500000,duration:21600000,benefit:"Costi Marina -15%",requires:["smart_pontoon"]},
{id:"advanced_solar",category:"specialization",icon:"💡",name:"Pannelli Solari Avanzati",desc:"Porta la riduzione totale dei costi Marina al 25%.",cost:900000,duration:28800000,benefit:"Costi Marina -25%",requires:["sustainable_energy"]}
];
function context(){const c=window.MarinaLocalSaveContext;if(!c)return null;let h=c.capture();if(!h){c.select(null);h=c.capture()}return h?{c,h}:null}
function read(){const x=context();return x?.c.readGame(x.h)||null}
function write(g){const x=context();return !!(x&&x.c.writeGame(x.h,g))}
function ensure(g){if(!g.research||typeof g.research!=="object"||Array.isArray(g.research))g.research={};return g.research}
function settle(g){
 const all=ensure(g);let changed=false;
 for(const p of PROJECTS){const r=all[p.id];if(r?.status==="active"&&Number(r.completesAt)>0&&Number(r.completesAt)<=Date.now()){r.status="complete";r.completedAt=Number(r.completesAt);changed=true}}
 if(changed)write(g);
 return changed;
}
function status(g,p){
 const all=ensure(g),r=all[p.id]||null;
 if(r?.status==="complete")return{state:"complete",progress:100,remaining:0};
 if(r?.status==="active"){
  const start=Number(r.startedAt)||Date.now(),end=Number(r.completesAt)||start+p.duration,now=Date.now();
  if(end<=now)return{state:"complete",progress:100,remaining:0};
  const progress=Math.max(0,Math.min(99,Math.round((now-start)/(end-start)*100)));
  return{state:"active",progress,remaining:Math.max(0,end-now)};
 }
 const unlocked=p.requires.every(id=>all[id]?.status==="complete"||(all[id]?.status==="active"&&Number(all[id].completesAt)<=Date.now()));
 return{state:unlocked?"available":"locked",progress:0,remaining:0};
}
function snapshot(){
 const g=read()||{name:"Comandante",coins:10000,prestige:0,fuel:300,condition:100,research:{}};
 if(read())settle(g);
 const projects=PROJECTS.map(p=>({...p,...status(g,p)}));
 const complete=projects.filter(p=>p.state==="complete").length,active=projects.find(p=>p.state==="active")||null;
 const level=Math.max(1,Math.min(5,1+complete));
 const labProgress=active?active.progress:Math.min(100,complete/PROJECTS.length*100);
 return{game:g,projects,complete,active,level,labProgress};
}
function start(id){
 const g=read();if(!g)return{ok:false,message:"Salvataggio non disponibile"};
 settle(g);
 const p=PROJECTS.find(x=>x.id===id);if(!p)return{ok:false,message:"Ricerca non valida"};
 const s=status(g,p);if(s.state==="complete")return{ok:false,message:"Ricerca già completata"};
 if(s.state==="locked")return{ok:false,message:"Completa prima le ricerche richieste"};
 const all=ensure(g);
 const running=PROJECTS.find(x=>status(g,x).state==="active");
 if(running)return{ok:false,message:"Ricerca già in corso: "+running.name};
 if((Number(g.coins)||0)<p.cost)return{ok:false,message:"Crediti insufficienti"};
 g.coins-=p.cost;
 all[p.id]={status:"active",startedAt:Date.now(),completesAt:Date.now()+p.duration,cost:p.cost};
 if(!write(g))return{ok:false,message:"Avvio ricerca non salvato"};
 return{ok:true,message:"Ricerca avviata: "+p.name};
}
function formatDuration(ms){const m=Math.max(0,Math.ceil(ms/60000)),h=Math.floor(m/60),min=m%60;return h? h+" h "+String(min).padStart(2,"0")+" min":m+" min"}
window.MarinaEmpireResearchLite=Object.freeze({projects:PROJECTS,snapshot,start,formatDuration,read});
})();