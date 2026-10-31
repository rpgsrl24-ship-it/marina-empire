// Esegue la funzione REALE finishVoyage estratta da index.html con dipendenze simulate.
// Non usa browser e non sostituisce un test completo di navigazione.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const start=html.indexOf('function finishVoyage(){');
const end=html.indexOf('// Legacy tick delegates',start);
assert.ok(start>=0&&end>start,'finishVoyage deve esistere');
const code=html.slice(start,end);
const mission={id:'INTRO_RIMINI_CERVIA',dest:'cervia',boat:'voyager',reward:500,prestige:50,name:'Rimini-Cervia'};
function run(alreadySettled=false){
 const state={port:'rimini',coins:10000,prestige:0,voyages:0,earnings:0,condition:100,completed:[],settledVoyages:alreadySettled?[42]:[],trip:{voyageId:42,id:mission.id,origin:'rimini',dest:'cervia',legs:['rimini','cervia'],legIndex:0,mission}};
 let saved=null;
 const sandbox={state,ports:[{id:'rimini',name:'Rimini'},{id:'cervia',name:'Cervia'}],missions:[mission],
   $:()=>null,persist:()=>{saved=JSON.parse(JSON.stringify(state))},render:()=>{},showTab:()=>{},notice:()=>{},money:String,
   awardCareerMilestones:()=>{},window:{MarinaEmpireTraffic:{track:()=>{}}},console};
 vm.createContext(sandbox);vm.runInContext(code+';finishVoyage();',sandbox);
 assert.equal(state.port,'cervia','la barca deve arrivare a Cervia');
 assert.equal(state.trip,null,'viaggio concluso');
 assert.equal(saved.port,'cervia','il porto deve essere salvato');
 assert.equal(saved.trip,null,'nessun viaggio in corso dopo il salvataggio');
 assert.equal(state.coins,alreadySettled?10000:10500,'premio una sola volta');
 assert.equal(state.voyages,alreadySettled?0:1,'conteggio viaggi una sola volta');
 assert.equal(state.prestige,alreadySettled?0:50,'prestigio una sola volta');
 assert.equal(state.settledVoyages.filter(v=>v===42).length,1,'identificatore viaggio non duplicato');
 return state;
}
run(false);console.log('PASS Arrivo Rimini-Cervia, premio, salvataggio');
run(true);console.log('PASS Ripristino posizione senza doppio premio');
// Verify that a voyage already marked settled cannot pay a second time.
const settledMission={id:'INTRO_RIMINI_CERVIA',dest:'cervia',reward:500,prestige:50,name:'Rimini-Cervia'};
const settledState={port:'rimini',coins:10000,prestige:0,voyages:0,earnings:0,condition:100,completed:[],settledVoyages:[],trip:{voyageId:43,id:settledMission.id,origin:'rimini',dest:'cervia',legs:['rimini','cervia'],legIndex:0,mission:settledMission,settled:true}};
const settledSandbox={state:settledState,ports:[{id:'cervia'}],missions:[settledMission],$:()=>null,persist:()=>{},render:()=>{},showTab:()=>{},notice:()=>{},money:String,awardCareerMilestones:()=>{},window:{MarinaEmpireTraffic:{track:()=>{}}},console};
vm.createContext(settledSandbox);vm.runInContext(code+';finishVoyage();',settledSandbox);
assert.equal(settledState.port,'cervia');assert.equal(settledState.trip,null);assert.equal(settledState.coins,10000);assert.equal(settledState.voyages,0);assert.equal(settledState.prestige,0);
console.log('PASS Viaggio gia liquidato senza doppio premio');
