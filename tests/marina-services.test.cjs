'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

let game={
 name:'Comandante',coins:10000,prestige:0,fuel:300,condition:97,port:'rimini',
 boat:'voyager',owned:['voyager'],completed:[],trip:null,voyages:1,marinas:{}
};
const handle={accountId:null};
const store={
 capture:()=>handle,
 select:()=>true,
 readGame:()=>JSON.parse(JSON.stringify(game)),
 writeGame:(_h,next)=>{game=JSON.parse(JSON.stringify(next));return true;},
 readLayout:()=>null
};
const session=new Map();
const sandbox={
 window:{MarinaLocalSaveContext:store},
 sessionStorage:{
  getItem:k=>session.has(k)?session.get(k):null,
  setItem:(k,v)=>{session.set(k,String(v));},
  removeItem:k=>session.delete(k)
 },
 console
};
sandbox.window.window=sandbox.window;
sandbox.window.sessionStorage=sandbox.sessionStorage;

vm.runInNewContext(fs.readFileSync('mobile-marina-lite-v1.js','utf8'),sandbox,{filename:'mobile-marina-lite-v1.js'});
const api=sandbox.window.MarinaEmpireMarinaLite;
assert(api,'Marina standalone API must exist');

// 400 L tank, starting at 300 L => 100 L missing => 300 credits.
const refuel=api.refuel();
assert.equal(refuel.ok,true,'Refuel must succeed for a fresh guest save');
assert.equal(refuel.cost,300,'Refuel cost must be exactly 3 credits per missing liter');
assert.equal(game.coins,9700,'Refuel must deduct exactly 300 credits');
assert.equal(game.fuel,400,'Refuel must fill the tank to 400 L');

// 97% condition, Academy boat price 0 => max service 1000, 3% wear => min charge 100.
const repair=api.repair();
assert.equal(repair.ok,true,'Maintenance must succeed while docked');
assert.equal(repair.cost,100,'Maintenance minimum charge must be 100 credits at 97% condition');
assert.equal(game.coins,9600,'Maintenance must deduct exactly 100 credits');
assert.equal(game.condition,100,'Maintenance must restore condition to 100%');

// Persisted state must be returned by the same API.
const snap=api.snapshot();
assert.equal(snap.game.coins,9600,'Persisted coins must match after services');
assert.equal(snap.game.fuel,400,'Persisted fuel must remain full');
assert.equal(snap.game.condition,100,'Persisted condition must remain 100%');

console.log('PASS: Marina refuel and maintenance costs/state are atomic and persistent.');
