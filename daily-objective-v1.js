(()=>{
"use strict";
if(window.MarinaEmpireDailyObjective)return;
const REWARD=Object.freeze({credits:800,prestige:35});
const REQUIRED=2;
const TASKS=Object.freeze([
 Object.freeze({id:"voyage",icon:"🧭",label:"Completa 1 viaggio"}),
 Object.freeze({id:"vhf",icon:"📻",label:"Completa 1 intervento VHF"}),
 Object.freeze({id:"marina",icon:"⚓",label:"Completa 1 incarico Marina Live"})
]);
function ctx(){const c=window.MarinaLocalSaveContext;if(!c)return null;let h=c.capture();if(!h){c.select(null);h=c.capture()}return h?{c,h}:null}
function read(){const x=ctx();return x?.c?.readGame?.(x.h)||null}
function write(g){const x=ctx();return !!(x&&x.c.writeGame(x.h,g))}
function dayKey(now=Date.now()){
 try{return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(now))}
 catch(_){return new Date(now).toISOString().slice(0,10)}
}
function normalize(game){
 const date=dayKey(),raw=(game?.dailyObjective&&game.dailyObjective.date===date)?game.dailyObjective:null;
 const tasks={voyage:!!raw?.tasks?.voyage,vhf:!!raw?.tasks?.vhf,marina:!!raw?.tasks?.marina};
 return{date,tasks,claimed:!!raw?.claimed,claimedAt:Number(raw?.claimedAt)||0};
}
function apply(game,data){
 game.dailyObjective={date:data.date,tasks:{...data.tasks},claimed:!!data.claimed,claimedAt:Number(data.claimedAt)||0};
 return game.dailyObjective;
}
function statusFromGame(game){
 const d=normalize(game),done=TASKS.filter(t=>d.tasks[t.id]).length;
 return Object.freeze({
  date:d.date,tasks:TASKS.map(t=>Object.freeze({...t,done:!!d.tasks[t.id]})),
  completed:done,required:REQUIRED,total:TASKS.length,ready:done>=REQUIRED&&!d.claimed,claimed:d.claimed,
  reward:REWARD,progress:Math.round(done/TASKS.length*100)
 });
}
function current(){const g=read();return g?statusFromGame(g):null}
function record(game,type){
 if(!game||!TASKS.some(t=>t.id===type))return null;
 const d=normalize(game);
 if(!d.tasks[type])d.tasks[type]=true;
 apply(game,d);
 return statusFromGame(game);
}
function claim(){
 const game=read();if(!game)return{ok:false,message:"Salvataggio non disponibile"};
 const d=normalize(game),done=TASKS.filter(t=>d.tasks[t.id]).length;
 if(d.claimed)return{ok:false,message:"Obiettivo giornaliero già riscosso",status:statusFromGame(game)};
 if(done<REQUIRED)return{ok:false,message:"Completa almeno "+REQUIRED+" attività giornaliere",status:statusFromGame(game)};
 const beforeCoins=Math.max(0,Number(game.coins)||0),beforePrestige=Math.max(0,Number(game.prestige)||0);
 d.claimed=true;d.claimedAt=Date.now();apply(game,d);
 game.coins=beforeCoins+REWARD.credits;game.prestige=beforePrestige+REWARD.prestige;
 game.dailyObjectivesCompleted=Math.max(0,Number(game.dailyObjectivesCompleted)||0)+1;
 game.lastDailyReward={date:d.date,credits:REWARD.credits,prestige:REWARD.prestige,at:d.claimedAt};
 if(!write(game))return{ok:false,message:"Salvataggio premio giornaliero non riuscito"};
 const saved=read(),st=saved&&statusFromGame(saved);
 if(!saved||!st?.claimed)return{ok:false,message:"Premio giornaliero non confermato"};
 return{ok:true,message:"Obiettivo giornaliero completato",credits:REWARD.credits,prestige:REWARD.prestige,coins:saved.coins,totalPrestige:saved.prestige,status:st};
}
window.MarinaEmpireDailyObjective=Object.freeze({tasks:TASKS,reward:REWARD,required:REQUIRED,dayKey,current,statusFromGame,record,claim});
})();