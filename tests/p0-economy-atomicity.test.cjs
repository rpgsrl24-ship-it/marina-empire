'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');
const helperStart=html.indexOf('function persist(){');
const helperEnd=html.indexOf('let meToastTimer=',helperStart);
assert(helperStart>=0&&helperEnd>helperStart,'persist/economy helper section exists');
const helper=html.slice(helperStart,helperEnd);

function game(){
 return {name:'Economy P0',coins:10000,prestige:0,fuel:300,condition:100,port:'rimini',boat:'voyager',owned:['voyager'],completed:[],trip:null,marinas:{},reservations:[],voyages:0,earnings:0,voyageSerial:0,settledVoyages:[]};
}
function harness({failWrite=false,initial=game()}={}){
 const storage=new Map([['save',JSON.stringify(initial)]]),messages=[];
 const ctx={state:JSON.parse(JSON.stringify(initial)),KEY:'save',JSON,Number,Math,Array,Object,Error,console:{warn(){}},
  window:{},boat:()=>({tank:400}),notice:m=>messages.push(m),
  localStorage:{getItem:k=>storage.get(k)??null,setItem(k,v){if(failWrite)throw Error('QuotaExceeded');storage.set(k,String(v))}}
 };
 vm.createContext(ctx);vm.runInContext(helper,ctx);
 return {ctx,storage,messages,run:code=>vm.runInContext(code,ctx)};
}

test('failed economic write rolls back credits, fuel and ownership exactly',()=>{
 const h=harness({failWrite:true});
 const before=JSON.stringify(h.ctx.state);
 assert.equal(h.run("meAtomicPersist(()=>{state.coins-=900;state.fuel-=65;state.owned.push('open')})"),false);
 assert.equal(JSON.stringify(h.ctx.state),before);
 assert.equal(h.ctx.state.coins,10000);
 assert.equal(h.ctx.state.fuel,300);
 assert.deepEqual(Array.from(h.ctx.state.owned),['voyager']);
});

test('unsafe or negative virtual credit balances are rejected before storage',()=>{
 const h=harness();const stored=h.storage.get('save');
 assert.equal(h.run('meAtomicPersist(()=>{state.coins=-1})'),false);
 assert.equal(h.ctx.state.coins,10000);assert.equal(h.storage.get('save'),stored);
 assert.equal(h.run('meAtomicPersist(()=>{state.coins=Number.MAX_SAFE_INTEGER+1})'),false);
 assert.equal(h.ctx.state.coins,10000);
});

test('successful atomic mutation persists the exact committed balance',()=>{
 const h=harness();
 assert.equal(h.run("meAtomicPersist(()=>{state.coins-=350;state.reservations.push({marina:'rimini',slot:'A-01',date:'2026-11-02'})})"),true);
 const saved=JSON.parse(h.storage.get('save'));
 assert.equal(saved.coins,9650);assert.equal(saved.reservations.length,1);assert.equal(h.ctx.state.coins,9650);
});

test('mission arrival cannot award credits when persistence fails',()=>{
 const start=html.indexOf('function finishVoyage(){'),end=html.indexOf('// Legacy tick delegates',start);
 assert(start>=0&&end>start,'finishVoyage exists');
 const mission={id:'INTRO_RIMINI_CERVIA',dest:'cervia',boat:'voyager',reward:500,prestige:50,name:'Rimini-Cervia'};
 const initial={...game(),trip:{voyageId:42,id:mission.id,origin:'rimini',dest:'cervia',legs:['rimini','cervia'],legIndex:0,mission},setupComplete:true};
 const h=harness({failWrite:true,initial});
 Object.assign(h.ctx,{ports:[{id:'rimini',name:'Rimini'},{id:'cervia',name:'Cervia'}],missions:[mission],$:()=>null,render(){},showTab(){},voyageHeartbeat(){},money:String,awardCareerMilestones(){},seaMiles:()=>10,window:{MarinaEmpireTraffic:{track(){}}},console:{warn(){},error(){}}});
 vm.runInContext(html.slice(start,end)+';finishVoyage()',h.ctx);
 assert.equal(h.ctx.state.coins,10000);assert.equal(h.ctx.state.voyages,0);assert.equal(h.ctx.state.trip.voyageId,42);assert.equal(h.ctx.state.port,'rimini');
});

test('economy-sensitive UI paths use atomic persistence',()=>{
 for(const marker of ['Rifornimento annullato: salvataggio non confermato.','Manutenzione annullata: salvataggio non confermato.','Partenza annullata: salvataggio non confermato.','Operazione yacht annullata: salvataggio non confermato.','Acquisto attività annullato: salvataggio non confermato.','Miglioramento annullato: salvataggio non confermato.','Acquisto marina annullato: salvataggio non confermato.','Arrivo non registrato: salvataggio non confermato.']) assert(html.includes(marker),'Missing atomic economy guard: '+marker);
});

console.log('P0 economy atomicity tests loaded');