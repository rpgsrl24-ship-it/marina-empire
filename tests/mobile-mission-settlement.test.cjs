'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

function sandboxWith(game){
  let state=JSON.parse(JSON.stringify(game));
  const handle={accountId:null};
  const store={
    capture:()=>handle,
    select:()=>true,
    readGame:()=>JSON.parse(JSON.stringify(state)),
    writeGame:(_h,next)=>{state=JSON.parse(JSON.stringify(next));return true;}
  };
  const session=new Map();
  const now={value:1000000};
  const DateMock={now:()=>now.value};
  const sandbox={
    window:{MarinaLocalSaveContext:store},
    sessionStorage:{
      getItem:k=>session.has(k)?session.get(k):null,
      setItem:(k,v)=>session.set(k,String(v)),
      removeItem:k=>session.delete(k)
    },
    console,Math,JSON,Date:DateMock
  };
  sandbox.window.window=sandbox.window;
  sandbox.window.sessionStorage=sandbox.sessionStorage;
  vm.runInNewContext(fs.readFileSync('mobile-map-lite-v2.js','utf8'),sandbox,{filename:'mobile-map-lite-v2.js'});
  return {api:sandbox.window.MarinaEmpireMapLite,get:()=>JSON.parse(JSON.stringify(state)),set:v=>{state=JSON.parse(JSON.stringify(v));},now};
}

const base={
  name:'Comandante',coins:20000,prestige:50,fuel:400,condition:100,port:'cervia',
  boat:'voyager',owned:['voyager'],completed:['INTRO_RIMINI_CERVIA'],trip:null,
  reservations:[],voyages:1,setupComplete:true,voyageSerial:1,settledVoyages:[1]
};

const {api,get,set,now}=sandboxWith(base);
const m=api.missionCatalog().find(x=>x.dest==='ancona');
assert(m&&m.ready,'Cervia -> Ancona deve essere disponibile');

let r=api.startMission(m.id,'ancona');
assert.equal(r.ok,true,'primo avvio valido');
let g=get();
const firstVoyage=g.trip.voyageId;
assert(firstVoyage>1,'voyageId deve avanzare');
const coinsAfterStart=g.coins;
now.value=g.trip.until+1;
api.pulse();
g=get();
assert.equal(g.port,'ancona');
assert.equal(g.coins,coinsAfterStart+m.reward,'premio primo viaggio');
assert(g.settledVoyages.includes(firstVoyage),'primo viaggio liquidato');

const paidCoins=g.coins;
api.pulse();
assert.equal(get().coins,paidCoins,'nessun doppio accredito sullo stesso viaggio');

// Riporta il comandante a Cervia con risorse sufficienti e rifai la stessa rotta.
g=get();
g.port='cervia';g.trip=null;g.fuel=400;g.coins=Math.max(g.coins,20000);g.condition=100;
set(g);
const again=api.missionCatalog().find(x=>x.dest==='ancona');
assert(again&&again.ready,'stessa rotta deve poter essere rifatta');
r=api.startMission(again.id,'ancona');
assert.equal(r.ok,true,'secondo viaggio stessa missione valido');
g=get();
const secondVoyage=g.trip.voyageId;
assert.notEqual(secondVoyage,firstVoyage,'nuovo voyageId per la stessa rotta');
const secondStartCoins=g.coins;
now.value=g.trip.until+1;
api.pulse();
g=get();
assert.equal(g.coins,secondStartCoins+again.reward,'stessa rotta paga nel nuovo viaggio');
assert(g.settledVoyages.includes(secondVoyage),'secondo viaggio liquidato');
console.log('PASS mobile settlement: no doppio premio sullo stesso viaggio, stessa rotta ripetibile.');
