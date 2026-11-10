'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

function makeSandbox(){
 let game={
  name:'Comandante',coins:20000,prestige:50,fuel:400,condition:97,port:'cervia',
  boat:'voyager',owned:['voyager'],completed:['INTRO_RIMINI_CERVIA'],trip:null,
  reservations:[],voyages:1,setupComplete:true,voyageSerial:1
 };
 const handle={accountId:null};
 const store={
  capture:()=>handle,
  select:()=>true,
  readGame:()=>JSON.parse(JSON.stringify(game)),
  writeGame:(_h,next)=>{game=JSON.parse(JSON.stringify(next));return true;}
 };
 const session=new Map();
 const sandbox={
  window:{MarinaLocalSaveContext:store},
  sessionStorage:{
   getItem:k=>session.has(k)?session.get(k):null,
   setItem:(k,v)=>session.set(k,String(v)),
   removeItem:k=>session.delete(k)
  },
  console,Date,Math,JSON
 };
 sandbox.window.window=sandbox.window;
 sandbox.window.sessionStorage=sandbox.sessionStorage;
 vm.runInNewContext(fs.readFileSync('mobile-map-lite-v2.js','utf8'),sandbox,{filename:'mobile-map-lite-v2.js'});
 return {api:sandbox.window.MarinaEmpireMapLite,getGame:()=>game,setGame:g=>{game=JSON.parse(JSON.stringify(g));}};
}

const {api,getGame,setGame}=makeSandbox();
const catalog=api.missionCatalog();
const ancona=catalog.find(m=>m.dest==='ancona');
assert(ancona,'Cervia catalog must contain a direct mission to Ancona');
assert.equal(ancona.ready,true,'Cervia->Ancona must be ready with sufficient fuel/coins/condition');

let r=api.startMission(ancona.id,'ancona');
assert.equal(r.ok,true,'Starting the exact Ancona mission must succeed');
assert.equal(getGame().trip.dest,'ancona','Accepted Ancona mission must create a trip to Ancona');
assert.equal(getGame().trip.id,ancona.id,'Trip must keep the exact selected mission id');

const clean={...getGame(),trip:null,coins:20000,fuel:400,condition:97,port:'cervia'};
setGame(clean);
r=api.startMission(ancona.id,'ravenna');
assert.equal(r.ok,false,'A mismatched expected destination must be rejected');
assert.equal(getGame().trip,null,'Rejected mismatched mission must not create a trip');

console.log('PASS: Cervia->Ancona selection is deterministic and destination-validated.');
