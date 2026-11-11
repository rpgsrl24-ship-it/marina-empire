'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

let game={
 name:'Comandante',coins:100000,prestige:0,fuel:300,condition:92,port:'rimini',
 boat:'voyager',owned:['voyager'],fleetFuel:{},fleetCondition:{},fleetPorts:{},
 completed:[],trip:null,voyages:0,setupComplete:true,voyageSerial:0
};
const handle={accountId:null};
const store={
 capture:()=>handle,
 select:()=>true,
 readGame:()=>JSON.parse(JSON.stringify(game)),
 writeGame:(_h,next)=>{game=JSON.parse(JSON.stringify(next));return true;}
};
const sandbox={window:{MarinaLocalSaveContext:store},console};
sandbox.window.window=sandbox.window;
vm.runInNewContext(fs.readFileSync('mobile-fleet-lite-v1.js','utf8'),sandbox,{filename:'mobile-fleet-lite-v1.js'});
const api=sandbox.window.MarinaEmpireFleetLite;
assert(api,'Fleet API must exist');

let snap=api.snapshot();
assert.equal(snap.game.boat,'voyager');
assert.equal(snap.boats.find(b=>b.id==='voyager').fuel,300);
assert.equal(snap.boats.find(b=>b.id==='voyager').condition,92);

const buy=api.buy('open');
assert.equal(buy.ok,true,'RPG Open 7 purchase must succeed with 100k credits');
assert.equal(game.coins,20000,'Buying Open 7 must deduct exactly 80k credits');
assert(game.owned.includes('open'),'Open 7 must become owned');
assert.equal(game.fleetFuel.open,300,'New Open 7 must initialize with full 300 L');
assert.equal(game.fleetCondition.open,100,'New Open 7 must initialize at 100% condition');
assert.equal(game.fleetPorts.open,'rimini','New Open 7 must initialize at current marina');

const selectOpen=api.select('open');
assert.equal(selectOpen.ok,true,'Selecting Open 7 must succeed');
assert.equal(game.boat,'open');
assert.equal(game.fuel,300);
assert.equal(game.condition,100);
assert.equal(game.port,'rimini');
assert.equal(game.fleetFuel.voyager,300,'Academy fuel must be preserved before switch');
assert.equal(game.fleetCondition.voyager,92,'Academy condition must be preserved before switch');
assert.equal(game.fleetPorts.voyager,'rimini','Academy port must be preserved before switch');

// Simulate use of Open 7, then switch back.
game.fuel=180; game.condition=88; game.port='cervia';
store.writeGame(handle,game);
const back=api.select('voyager');
assert.equal(back.ok,true,'Switching back to Academy must succeed');
assert.equal(game.boat,'voyager');
assert.equal(game.fuel,300,'Academy original fuel must restore');
assert.equal(game.condition,92,'Academy original condition must restore');
assert.equal(game.port,'rimini','Academy original marina must restore');
assert.equal(game.fleetFuel.open,180,'Open 7 used fuel must be preserved');
assert.equal(game.fleetCondition.open,88,'Open 7 used condition must be preserved');
assert.equal(game.fleetPorts.open,'cervia','Open 7 marina must be preserved');

const backOpen=api.select('open');
assert.equal(backOpen.ok,true);
assert.equal(game.fuel,180);
assert.equal(game.condition,88);
assert.equal(game.port,'cervia');

console.log('PASS: multi-boat purchase, switching, and per-boat fuel/condition/port persistence are correct.');
