(()=>{
"use strict";
const ports=[
["rose","Isola delle Rose"],["rimini","Rimini"],["ancona","Ancona"],["lignano","Lignano"],["cervia","Cervia"],["bari","Bari"],["ravenna","Marina di Ravenna"],["pescara","Marina di Pescara"],["brindisi","Marina di Brindisi"],["salerno","Marina d’Arechi — Salerno"],["nettuno","Marina di Nettuno"],["scarlino","Marina di Scarlino"],["loano","Marina di Loano"],["portocervo","Marina di Porto Cervo"],["capodorlando","Marina di Capo d’Orlando"]
].map(([id,name])=>({id,name}));
const economy={rimini:{price:8000000,income:80000},ancona:{price:11000000,income:110000},lignano:{price:12000000,income:120000},cervia:{price:6500000,income:65000},bari:{price:18000000,income:180000},ravenna:{price:9500000,income:95000},pescara:{price:9000000,income:90000},brindisi:{price:14000000,income:140000},salerno:{price:22000000,income:220000},nettuno:{price:16000000,income:160000},scarlino:{price:28000000,income:280000},loano:{price:26000000,income:260000},portocervo:{price:85000000,income:850000},capodorlando:{price:24000000,income:240000}};
const boats={voyager:{name:"RPG Academy 8",tank:400,price:0},open:{name:"RPG Open 7",tank:300,price:80000},yacht:{name:"RPG Cruiser 12",tank:550,price:350000},yacht14:{name:"RPG Prestige 14",tank:700,price:650000},yacht20:{name:"RPG Elite 20",tank:1100,price:1800000},yacht30:{name:"RPG Majesty 30",tank:1700,price:6000000},luna:{name:"RPG Imperial 60",tank:900,price:45000000}};
function context(){const c=window.MarinaLocalSaveContext;if(!c)return null;let h=c.capture();if(!h){c.select(null);h=c.capture()}return h?{c,h}:null}
function defaultGame(){return{name:"Comandante",coins:10000,prestige:0,fuel:300,condition:100,port:"rimini",boat:"voyager",owned:["voyager"],completed:[],trip:null,reservations:[],voyages:0,setupComplete:true,voyageSerial:0,marinas:{}}}
function read(){const x=context();if(!x)return null;let g=x.c.readGame(x.h);if(g)return g;const fresh=defaultGame();if(x.c.writeGame(x.h,fresh))g=x.c.readGame(x.h);return g||fresh}
function write(game){const x=context();return !!(x&&x.c.writeGame(x.h,game))}
function portName(id){return ports.find(p=>p.id===id)?.name||id||"Rimini"}
function selectedId(game){let id=null;try{id=sessionStorage.getItem("marina_empire_selected_marina")}catch(_){};const current=String(game?.port||"");const arrivedAt=Number(game?.lastArrival?.at)||0;const selectedAt=Number(sessionStorage.getItem("marina_empire_selected_marina_at")||0);if(current&&arrivedAt&&arrivedAt>=selectedAt)id=current;id=id||game?.investmentMarina||game?.homeMarina||current||"rimini";return ports.some(p=>p.id===id)?id:"rimini"}
function op(id,game){const raw=game?.marinaOperations?.[id]||{};const completed=Math.max(0,Math.floor(Number(raw.completed)||0));const level=completed>=20?5:completed>=10?4:completed>=5?3:completed>=2?2:1;const next=level===1?2:level===2?5:level===3?10:level===4?20:20;const label=["","Operatività Base","Marina Attiva","Marina Consolidata","Alta Operatività","Hub d’Eccellenza"][level];const service=["","Servizi Standard","Fuel Dock Prioritario","Assistenza Tecnica Prioritaria","Concierge VIP","Centro Superyacht"][level];return{completed,level,next,label,service}}
function layout(id){const x=context();if(!x)return null;return x.c.readLayout(x.h,id)||null}
// Marina investments are game-local virtual assets, never real port ownership.
const DAY_MS=86400000,RESERVE=2000,MAX_PONTOONS=30,MAX_LEVEL=5;
function isOwned(g,id){return Object.hasOwn(economy,id)&&Number.isFinite(Number(g?.marinas?.[id]?.lastReward))&&Number(g.marinas[id].lastReward)>0}
function marinaFinance(g,id){
 const info=Object.hasOwn(economy,id)?economy[id]:null,owned=isOwned(g,id),record=owned?g.marinas[id]:{},oper=op(id,g);
 const lay=layout(id)||{},built=Math.max(1,Math.min(MAX_PONTOONS,Math.floor(Number(record.financeVersion===1?record.built:(record.built??lay.built))||1)));
 const level=owned?Math.max(1,Math.min(MAX_LEVEL,Math.floor(Number(record.level)||1))):1,capacity=built*6;
 // Occupancy is a simulated estimate, not a real berth booking feed.
 const occupied=Math.round(capacity*.7),available=capacity-occupied;
 const baseIncome=owned?Math.floor(info.income*(1+(level-1)*.08)*(1+(oper.level-1)*.03)):0;
 const extra=built-1;
 const staff=owned?Math.round(info.price*.0015)+extra*2200:0;
 const maintenance=owned?Math.round(info.price*.001)+2200+extra*1100:0;
 const utilities=owned?Math.round(info.price*.0005)+1300+extra*600:0;
 const berth=owned?Math.floor(capacity*Math.max(1200,Math.round(info.price/5000))*.70*(1+(level-1)*.08)):0;
 const net=Math.max(0,baseIncome+berth-staff-maintenance-utilities);
 const pontoonCost=info?Math.round(info.price*.035/1000)*1000:0;
 const upgradeCost=info?Math.round(info.price*.06*level/1000)*1000:0;
 return {id,name:portName(id),owned,info,oper,built,capacity,occupied,available,level,baseIncome,staff,maintenance,utilities,berth,net,pontoonCost,upgradeCost};
}
function accrual(g,id,now=Date.now(),f=marinaFinance(g,id)){
 if(!f.owned)return{due:0,bank:0,claimAt:0,cursor:0,clockMismatch:false,nextAt:0};
 const r=g.marinas[id],modern=r.financeVersion===1,claimAt=modern?Number(r.lastReward):Math.max(Number(r.lastReward)||0,Number(r.berthLastReward)||0);
 const cursor=modern?Math.max(claimAt,Number(r.incomeCursor)||claimAt):claimAt;
 const bank=modern?Math.max(0,Number(r.incomeBank)||0):0;
 const rate=modern&&Number.isFinite(Number(r.incomeRate))?Math.max(0,Number(r.incomeRate)):f.net;
 const clockMismatch=!Number.isFinite(now)||now<cursor||now<claimAt;
 const end=clockMismatch?cursor:Math.max(cursor,Math.min(now,claimAt+7*DAY_MS));
 const total=bank+Math.max(0,end-cursor)*rate/DAY_MS;
 return{claimAt,cursor:end,bank:total,due:!clockMismatch&&now-claimAt>=DAY_MS?Math.floor(total):0,clockMismatch,nextAt:claimAt+DAY_MS};
}
function updateAccrual(g,id,now,f=marinaFinance(g,id)){
 const a=accrual(g,id,now,f);if(a.clockMismatch)return false;
 const r=g.marinas[id];r.financeVersion=1;r.built=f.built;r.level=f.level;r.lastReward=a.claimAt;r.berthLastReward=a.claimAt;r.incomeCursor=a.cursor;r.incomeBank=a.bank;r.incomeRate=f.net;return true;
}
function propertyState(g,id,now=Date.now()){
 const f=marinaFinance(g,id),a=accrual(g,id,now,f),credits=Math.max(0,Number(g.coins)||0);
 const reason=!f.info?"La base RPG non è acquistabile":g.trip?"Termina prima la missione e l'ormeggio":a.clockMismatch?"Controlla la data del dispositivo":"";
 const affordable=cost=>!reason&&credits>=cost+RESERVE;
 return{...f,...a,reason,canBuy:!!f.info&&!f.owned&&affordable(f.info.price),canBuild:f.owned&&f.built<MAX_PONTOONS&&affordable(f.pontoonCost),canUpgrade:f.owned&&f.level<MAX_LEVEL&&affordable(f.upgradeCost),canCollect:f.owned&&!reason&&a.due>0};
}
function portfolioSnapshot(game,now=Date.now()){
 const g=game||read()||defaultGame(),items=ports.filter(p=>isOwned(g,p.id)).map(p=>propertyState(g,p.id,now));
 return{items,owned:items.length,dailyNet:items.reduce((sum,p)=>sum+p.net,0),due:items.reduce((sum,p)=>sum+(p.canCollect?p.due:0),0),pontoonCount:items.reduce((sum,p)=>sum+p.built,0),berths:items.reduce((sum,p)=>sum+p.capacity,0)};
}
function snapshot(){
 const game=read()||defaultGame(),id=selectedId(game),p=propertyState(game,id),boat=boats[game.boat]||boats.voyager;
 return{game,...p,boat};
}
function financeLog(g,kind,id,amount,now){
 const history=Array.isArray(g.economyHistory)?g.economyHistory:[];
 g.economyHistory=history.concat([{kind,id,amount,at:now}]).slice(-300);
}
function propertyAction(action,id,now=Date.now()){
 const x=context(),g=x?.c.readGame(x.h);if(!g)return{ok:false,message:"Salvataggio non disponibile"};
 if(!Object.hasOwn(economy,id))return{ok:false,message:"Marina non acquistabile: la base RPG resta esclusa"};
 const p=propertyState(g,id,now);
 if(p.reason)return{ok:false,message:p.reason};
 let cost=0,label="";
 if(action==="buy"){if(p.owned)return{ok:false,message:"Marina già di tua proprietà"};cost=p.info.price;label="Marina acquistata"}
 else if(action==="pontoon"){if(!p.owned||p.built>=MAX_PONTOONS)return{ok:false,message:"Acquista la marina o verifica il limite pontili"};cost=p.pontoonCost;label="Nuovo pontile costruito"}
 else if(action==="upgrade"){if(!p.owned||p.level>=MAX_LEVEL)return{ok:false,message:"Acquista la marina o verifica il livello massimo"};cost=p.upgradeCost;label="Marina potenziata"}
 else return{ok:false,message:"Operazione non valida"};
 if(!Number.isSafeInteger(cost)||cost<=0||!Number.isSafeInteger(g.coins)||g.coins-cost<RESERVE)return{ok:false,message:"Crediti insufficienti: mantieni 2.000 crediti di riserva"};
 g.marinas=asRecord(g.marinas);
 if(action==="buy"){g.marinas[id]={lastReward:now,berthLastReward:now,level:1,built:1,financeVersion:1,incomeCursor:now,incomeBank:0,incomeRate:0}}
 else{if(!updateAccrual(g,id,now,p))return{ok:false,message:"Controlla la data del dispositivo"};const r=g.marinas[id];if(action==="pontoon")r.built=p.built+1;else r.level=p.level+1;}
 g.marinas[id].incomeRate=marinaFinance(g,id).net;
 g.coins-=cost;financeLog(g,action==="buy"?"marina_buy":action==="pontoon"?"pontoon_build":"marina_upgrade",id,-cost,now);
 if(!x.c.writeGame(x.h,g))return{ok:false,message:"Salvataggio non confermato: nessun investimento registrato"};
 return{ok:true,cost,message:label+" · "+portName(id)+" · -"+cost.toLocaleString("it-IT")+" crediti"};
}
function collectMarina(id=null,now=Date.now()){
 const x=context(),g=x?.c.readGame(x.h);if(!g)return{ok:false,message:"Salvataggio non disponibile"};
 if(g.trip)return{ok:false,message:"Termina prima la missione"};
 const items=(id===null?portfolioSnapshot(g,now).items:[propertyState(g,id,now)]).filter(p=>p.canCollect);
 const total=items.reduce((sum,p)=>sum+p.due,0);
 if(!total)return{ok:false,message:"Nessuna rendita disponibile: maturazione ogni 24 ore"};
 if(!Number.isSafeInteger(g.coins+total)||!Number.isSafeInteger(Math.max(0,Number(g.earnings)||0)+total))return{ok:false,message:"Saldo non valido"};
 for(const p of items){const r=g.marinas[p.id];r.financeVersion=1;r.built=p.built;r.level=p.level;r.lastReward=now;r.berthLastReward=now;r.incomeCursor=now;r.incomeBank=0;r.incomeRate=p.net;financeLog(g,"marina_income",p.id,p.due,now);}
 g.coins+=total;g.earnings=Math.max(0,Number(g.earnings)||0)+total;
 if(!x.c.writeGame(x.h,g))return{ok:false,message:"Salvataggio non confermato: riprova"};
 return{ok:true,amount:total,message:"Rendite riscosse · +"+total.toLocaleString("it-IT")+" crediti"};
}
function setSelected(id){if(!ports.some(p=>p.id===id))return false;try{sessionStorage.setItem("marina_empire_selected_marina",id);sessionStorage.setItem("marina_empire_selected_marina_at",String(Date.now()))}catch(_){};const game=read();if(!game)return true;game.investmentMarina=id;write(game);return true}
function prepareMarinaService(game){
 if(!game?.trip)return{ok:true,recovered:false};
 const trip=game.trip;
 if(trip.dockingReady)return{ok:false,recovered:false,needsDocking:true,message:"Completa l'ormeggio dalla Cabina prima di usare i servizi Marina"};
 const fuel=Math.max(0,Number(game.fuel)||0);
 if(fuel>0)return{ok:false,recovered:false,message:"Servizio disponibile dopo l'arrivo e l'ormeggio"};
 const origin=String(trip.origin||game.port||"rimini");
 game.port=origin;game.trip=null;
 game.lastEmergencyRecovery={port:origin,reason:"fuel_empty",at:Date.now(),mission:String(trip.mission?.name||trip.id||"Missione")};
 return{ok:true,recovered:true,port:origin,message:"Recupero d'emergenza a "+portName(origin)};
}
function refuel(){
 const game=read();if(!game)return{ok:false,message:"Salvataggio non disponibile"};
 const prep=prepareMarinaService(game);if(!prep.ok)return prep;
 const id=game.port||"rimini";try{sessionStorage.setItem("marina_empire_selected_marina",id)}catch(_){}
 const b=boats[game.boat]||boats.voyager,currentFuel=Math.max(0,Math.min(b.tank,Number(game.fuel)||0)),need=Math.max(0,b.tank-currentFuel);
 if(need<=0){if(prep.recovered)write(game);return{ok:false,message:"Serbatoio già pieno"}}
 const beforeCoins=Math.max(0,Number(game.coins)||0),fullCost=Math.round(need*3);
 if(beforeCoins<fullCost){if(prep.recovered)write(game);return{ok:false,recovered:prep.recovered,message:(prep.recovered?prep.message+" · ":"")+"Crediti insufficienti per il pieno"}}
 const nextCoins=beforeCoins-fullCost;if(!Number.isFinite(nextCoins)||nextCoins<0)return{ok:false,message:"Costo rifornimento non valido"};
 game.coins=nextCoins;game.fuel=b.tank;
 if(!write(game))return{ok:false,message:"Salvataggio non confermato"};
 const saved=read();if(!saved||Number(saved.coins)!==nextCoins||Number(saved.fuel)!==b.tank||saved.trip)return{ok:false,message:"Rifornimento non confermato"};
 return{ok:true,cost:fullCost,beforeCoins,afterCoins:nextCoins,recovered:prep.recovered,message:(prep.recovered?prep.message+" · ":"")+"Rifornimento completato · -"+fullCost.toLocaleString("it-IT")+" crediti"};
}
function repair(){
 const game=read();if(!game)return{ok:false,message:"Salvataggio non disponibile"};
 const prep=prepareMarinaService(game);if(!prep.ok)return prep;
 const id=game.port||"rimini";try{sessionStorage.setItem("marina_empire_selected_marina",id)}catch(_){}
 const b=boats[game.boat]||boats.voyager,condition=Math.max(0,Math.min(100,Number(game.condition??100)));
 if(condition>=100){if(prep.recovered)write(game);return{ok:false,message:"Yacht già al 100%"}}
 const full=Math.round(1000*(1+b.price/100000)),cost=Math.max(100,Math.round(full*((100-condition)/100))),beforeCoins=Math.max(0,Number(game.coins)||0);
 if(beforeCoins<cost){if(prep.recovered)write(game);return{ok:false,recovered:prep.recovered,message:(prep.recovered?prep.message+" · ":"")+"Crediti insufficienti"}}
 const nextCoins=beforeCoins-cost;if(!Number.isFinite(nextCoins)||nextCoins<0)return{ok:false,message:"Costo manutenzione non valido"};
 game.coins=nextCoins;game.condition=100;
 if(!write(game))return{ok:false,message:"Salvataggio non confermato"};
 const saved=read();if(!saved||Number(saved.coins)!==nextCoins||Number(saved.condition)!==100||saved.trip)return{ok:false,message:"Manutenzione non confermata"};
 return{ok:true,cost,beforeCoins,afterCoins:nextCoins,recovered:prep.recovered,message:(prep.recovered?prep.message+" · ":"")+"Manutenzione completata · -"+cost.toLocaleString("it-IT")+" crediti"};
}
// Daily Marina Live activities. The calendar is local to the device.
const dayKey=ms=>{const d=new Date(ms);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const previousDay=ms=>{const d=new Date(ms);d.setDate(d.getDate()-1);return dayKey(d.getTime())};
const validDay=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:"";
const asRecord=v=>v&&typeof v==="object"&&!Array.isArray(v)?v:{};
const num=v=>Math.max(0,Math.floor(Number(v)||0));
const JOB_LIMIT=3;
const jobTemplates=[
 {key:"dock",title:"Assistenza ormeggio",request:"Un comandante chiede assistenza all'arrivo. Come prepari il posto barca?",options:["Preparo cime e parabordi e confermo il posto libero","Faccio entrare lo yacht senza controlli","Invito lo yacht a entrare a piena velocità"],correct:0,reward:250,prestige:10},
 {key:"pontoon",title:"Controllo pontili",request:"Durante il giro trovi una cima allentata. Cosa fai?",options:["Ignoro la segnalazione","Metto in sicurezza la cima e segnalo l'anomalia","Rimuovo tutte le cime del pontile"],correct:1,reward:220,prestige:10},
 {key:"service",title:"Assistenza servizi di bordo",request:"Un ospite chiede acqua e corrente alla banchina. Qual è la priorità?",options:["Collego senza verifiche","Apro tutti i servizi insieme","Verifico disponibilità e collegamenti prima del servizio"],correct:2,reward:260,prestige:12},
 {key:"welcome",title:"Accoglienza charter",request:"Arrivano ospiti per un charter. Quale accoglienza organizzi?",options:["Confermo prenotazione, accessi e informazioni di sicurezza","Li lascio cercare lo yacht da soli","Salto la verifica della prenotazione"],correct:0,reward:280,prestige:14},
 {key:"sup",title:"Preparazione water toys",request:"Un cliente vuole usare un SUP. Quale controllo fai prima della consegna?",options:["Consegno senza verificare","Controllo gonfiaggio, dotazioni e condizioni del mare","Gonfio oltre la pressione indicata"],correct:1,reward:230,prestige:11},
 {key:"weather",title:"Assistenza meteo",request:"È previsto vento forte. Quale servizio organizzi per gli armatori?",options:["Ignoro l'avviso","Rimuovo i parabordi","Avviso i clienti e verifico ormeggi e protezioni"],correct:2,reward:300,prestige:15}
];
function dailyState(game,now=Date.now()){
 const day=dayKey(now),r=asRecord(game?.retention),old=asRecord(r.daily),d=asRecord(r.dailyV2);
 const modern=Object.hasOwn(r,"dailyV2");
 const loginDay=modern?validDay(d.loginDay):validDay(old.day),missionDay=modern?validDay(d.missionDay):old.missionClaimed?validDay(old.day):"";
 const lastSeen=validDay(d.lastSeen),clockMismatch=[loginDay,missionDay,lastSeen,validDay(game?.marinaDailyJobs?.day)].some(x=>x>day);
 const streak=Math.min(7,num(modern?d.streak:old.streak)),priorStreak=loginDay===previousDay(now)?streak:0;
 const arrived=entry=>{const at=Number(entry?.at);return Number.isFinite(at)&&at>0&&at<=now&&dayKey(at)===day&&!entry.emergency&&String(entry.id||"")!=="DEMO_DOCKING"};
 const todayMission=(Array.isArray(game?.missionHistory)&&game.missionHistory.some(arrived))||arrived(game?.lastArrival);
 return {day,loginDay,missionDay,clockMismatch,streak:loginDay===day?streak:priorStreak,loginClaimed:loginDay===day,missionClaimed:missionDay===day,missionDone:!!todayMission,loginReward:Math.min(600,300+priorStreak*50),missionReward:500,missionPrestige:10};
}
function claimDaily(kind,now=Date.now()){
 if(!["login","mission"].includes(kind))return{ok:false,message:"Premio non valido"};
 const x=context(),game=x?.c.readGame(x.h);if(!game)return{ok:false,message:"Salvataggio non disponibile"};
 const s=dailyState(game,now);
 if(s.clockMismatch)return{ok:false,message:"Controlla la data del dispositivo"};
 if(kind==="login"&&s.loginClaimed||kind==="mission"&&s.missionClaimed)return{ok:false,message:"Premio già riscosso"};
 if(kind==="mission"&&!s.missionDone)return{ok:false,message:"Completa una missione oggi"};
 const reward=kind==="login"?s.loginReward:s.missionReward,prestige=kind==="mission"?s.missionPrestige:0;
 game.retention=asRecord(game.retention);
 const next={loginDay:s.loginDay,missionDay:s.missionDay,streak:s.streak,lastSeen:s.day};
 if(kind==="login"){next.loginDay=s.day;next.streak=Math.min(7,s.streak+1)}else next.missionDay=s.day;
 game.retention.dailyV2=next;
 game.retention.daily={...asRecord(game.retention.daily),day:next.loginDay,streak:next.streak,missionClaimed:next.loginDay===s.day&&next.missionDay===s.day,baseVoyages:num(game.voyages)};
 game.coins=Math.max(0,Number(game.coins)||0)+reward;game.prestige=Math.max(0,Number(game.prestige)||0)+prestige;
 if(!x.c.writeGame(x.h,game))return{ok:false,message:"Salvataggio non confermato. Riprova."};
 return{ok:true,reward,prestige,message:"Premio riscosso · +"+reward+" crediti"+(prestige?" · +"+prestige+" prestigio":"")};
}
function dailyJobCatalog(game,now=Date.now(),id=game?.port||"rimini"){
 const day=dayKey(now),old=asRecord(game?.marinaDailyJobs),clockMismatch=validDay(old.day)>day||dailyState(game,now).clockMismatch;
 const same=old.day===day,done=same&&Array.isArray(old.done)?old.done.filter(x=>typeof x==="string"):[],count=same?Math.min(JOB_LIMIT,Math.max(done.length,num(old.count))):0;
 const legacy=game?.lastNpcJob,legacyToday=!old.day&&num(game?.guestTrialJobsUsed)>0&&Number(legacy?.at)>0&&dayKey(Number(legacy.at))===day;
 const used=Math.max(count,legacyToday?1:0);
 const tutorial=same?!!old.tutorial:num(game?.guestTrialJobsUsed)===0||legacyToday;
 let reason="";
 if(clockMismatch)reason="Controlla la data del dispositivo.";
 else if(game?.trip)reason=game.trip.dockingReady?"Completa l'ormeggio dalla Cabina.":"Completa prima la navigazione in corso.";
 else if(game?.port!==id)reason="Raggiungi "+portName(id)+" per svolgere gli incarichi locali.";
 else if(num(game?.voyages)<1)reason="Completa prima la missione iniziale Rimini → Cervia.";
 else if(used>=JOB_LIMIT)reason="Tutti gli incarichi di oggi sono completati. Torna domani!";
 const seed=Array.from(day+"|"+id).reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,0);
 const first=tutorial?0:seed%jobTemplates.length;
 const jobs=[0,1,2].map((_,i)=>{
   const t=jobTemplates[(first+i)%jobTemplates.length],jobId=day+"|"+id+"|"+t.key;
   const completed=done.includes(jobId)||(legacyToday&&t.key==="dock"&&legacy?.port===id);
   return {id:jobId,key:t.key,title:t.title,request:t.request,options:t.options.slice(),reward:t.reward,prestige:t.prestige,completed,available:!reason&&!completed};
 });
 return {day,port:id,limit:JOB_LIMIT,count:used,tutorial,jobs,available:jobs.some(j=>j.available),message:reason||"Scegli un incarico di "+portName(id)+". Risolvi la richiesta per ottenere il premio.",clockMismatch};
}
function jobStatus(now=Date.now()){
 const game=read();if(!game)return{ok:false,available:false,count:0,limit:JOB_LIMIT,jobs:[],message:"Salvataggio non disponibile"};
 return {ok:true,...dailyJobCatalog(game,now,selectedId(game))};
}
function completeJob(id,choice,now=Date.now()){
 const x=context(),game=x?.c.readGame(x.h);if(!game)return{ok:false,message:"Salvataggio non disponibile"};
 const status=dailyJobCatalog(game,now,selectedId(game)),job=status.jobs.find(j=>j.id===id);
 if(!job?.available)return{ok:false,message:status.message||"Incarico non disponibile"};
 const template=jobTemplates.find(t=>t.key===job.key);
 if(!Number.isInteger(choice)||choice!==template.correct)return{ok:false,message:"Scelta non corretta. Rileggi la richiesta e riprova."};
 const old=asRecord(game.marinaDailyJobs),done=old.day===status.day&&Array.isArray(old.done)?old.done.slice():[];
 for(const j of status.jobs)if(j.completed&&!done.includes(j.id))done.push(j.id);
 done.push(id);game.marinaDailyJobs={day:status.day,count:status.count+1,tutorial:status.tutorial,done};
 game.coins=Math.max(0,Number(game.coins)||0)+job.reward;game.prestige=Math.max(0,Number(game.prestige)||0)+job.prestige;
 game.guestTrialJobsUsed=Math.max(1,num(game.guestTrialJobsUsed));game.npcJobsCompleted=num(game.npcJobsCompleted)+1;
 const ownPort=isOwned(game,status.port);
 if(ownPort&&!updateAccrual(game,status.port,now))return{ok:false,message:"Controlla la data del dispositivo"};
 game.marinaOperations=asRecord(game.marinaOperations);const ops=asRecord(game.marinaOperations[status.port]);game.marinaOperations[status.port]={...ops,completed:num(ops.completed)+1};
 if(ownPort)game.marinas[status.port].incomeRate=marinaFinance(game,status.port).net;
 game.lastNpcJob={id,type:job.title,reward:job.reward,cost:0,prestige:job.prestige,reputation:5,sector:"marina",port:status.port,at:now};
 if(!x.c.writeGame(x.h,game))return{ok:false,message:"Salvataggio incarico non confermato. Riprova."};
 return{ok:true,message:"Incarico completato · +"+job.reward+" crediti · +"+job.prestige+" prestigio",reward:job.reward,prestige:job.prestige};
}
window.MarinaEmpireMarinaLite={ports,snapshot,setSelected,refuel,repair,read,jobStatus,dailyJobCatalog,completeJob,dailyState,claimDaily,propertyState,portfolioSnapshot,buyMarina:(id,now)=>propertyAction('buy',id,now),buildPontoon:(id,now)=>propertyAction('pontoon',id,now),upgradeMarina:(id,now)=>propertyAction('upgrade',id,now),collectMarina};
})();