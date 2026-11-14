(()=>{
"use strict";
if(window.MarinaEmpireDailyObjective)return;
const REWARD=Object.freeze({credits:800,prestige:35});
const REQUIRED=2;
const STREAK_MILESTONES=Object.freeze([
 Object.freeze({days:3,label:"TRE GIORNI IN MARE",credits:200,prestige:10,icon:"🔥"}),
 Object.freeze({days:7,label:"SETTIMANA DA COMANDANTE",credits:500,prestige:20,icon:"⚓"}),
 Object.freeze({days:14,label:"ROTTA COSTANTE",credits:1000,prestige:35,icon:"🧭"}),
 Object.freeze({days:30,label:"LEGGENDA DEL MARE",credits:2500,prestige:75,icon:"👑"})
]);
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
function dayNumber(key){
 const p=String(key||"").split("-").map(Number);if(p.length!==3||p.some(x=>!Number.isFinite(x)))return NaN;
 return Math.floor(Date.UTC(p[0],p[1]-1,p[2])/86400000);
}
function streakFromGame(game,nowKey=dayKey()){
 const raw=game?.dailyStreak||{},last=String(raw.lastClaimDate||""),stored=Math.max(0,Math.floor(Number(raw.current)||0)),best=Math.max(stored,Math.floor(Number(raw.best)||0)),diff=dayNumber(nowKey)-dayNumber(last);
 const active=last&&Number.isFinite(diff)&&(diff===0||diff===1)?stored:0;
 const next=STREAK_MILESTONES.find(m=>m.days>active)||null;
 return Object.freeze({current:active,storedCurrent:stored,best,lastClaimDate:last,next,milestones:STREAK_MILESTONES});
}
function advanceStreak(game,today){
 const raw=game.dailyStreak||{},last=String(raw.lastClaimDate||""),diff=dayNumber(today)-dayNumber(last);
 let current=Math.max(0,Math.floor(Number(raw.current)||0));
 if(!last||!Number.isFinite(diff)||diff>1||diff<0)current=1;else if(diff===1)current+=1;else if(diff===0)current=Math.max(1,current);
 const claimedMilestones=Array.isArray(raw.claimedMilestones)?raw.claimedMilestones.map(Number).filter(Number.isFinite):[];
 const milestone=STREAK_MILESTONES.find(m=>m.days===current&&!claimedMilestones.includes(m.days))||null;
 if(milestone)claimedMilestones.push(milestone.days);
 game.dailyStreak={current,best:Math.max(current,Math.floor(Number(raw.best)||0)),lastClaimDate:today,claimedMilestones,updatedAt:Date.now()};
 return{streak:streakFromGame(game,today),milestone};
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
 const streakResult=advanceStreak(game,d.date),milestone=streakResult.milestone;
 const bonusCredits=milestone?Math.max(0,Number(milestone.credits)||0):0,bonusPrestige=milestone?Math.max(0,Number(milestone.prestige)||0):0;
 game.coins=beforeCoins+REWARD.credits+bonusCredits;game.prestige=beforePrestige+REWARD.prestige+bonusPrestige;
 game.dailyObjectivesCompleted=Math.max(0,Number(game.dailyObjectivesCompleted)||0)+1;
 game.lastDailyReward={date:d.date,credits:REWARD.credits,prestige:REWARD.prestige,bonusCredits,bonusPrestige,streak:streakResult.streak.current,milestone:milestone?.days||0,at:d.claimedAt};
 if(!write(game))return{ok:false,message:"Salvataggio premio giornaliero non riuscito"};
 const saved=read(),st=saved&&statusFromGame(saved);
 if(!saved||!st?.claimed)return{ok:false,message:"Premio giornaliero non confermato"};
 const savedStreak=streakFromGame(saved);return{ok:true,message:"Obiettivo giornaliero completato",credits:REWARD.credits,prestige:REWARD.prestige,bonusCredits,bonusPrestige,milestone:milestone||null,streak:savedStreak,coins:saved.coins,totalPrestige:saved.prestige,status:st};
}
window.MarinaEmpireDailyObjective=Object.freeze({tasks:TASKS,reward:REWARD,required:REQUIRED,streakMilestones:STREAK_MILESTONES,dayKey,current,statusFromGame,streakFromGame,record,claim});
})();