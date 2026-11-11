'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

let now=1_700_000_000_000;
let game={
 name:'Comandante',coins:40000,prestige:0,fuel:300,condition:100,port:'rimini',
 boat:'voyager',owned:['voyager'],research:{},trip:null,voyages:0
};
const handle={accountId:null};
const store={
 capture:()=>handle,
 select:()=>true,
 readGame:()=>JSON.parse(JSON.stringify(game)),
 writeGame:(_h,next)=>{game=JSON.parse(JSON.stringify(next));return true;}
};
class FakeDate extends Date{
 static now(){return now}
}
const sandbox={window:{MarinaLocalSaveContext:store},console,Date:FakeDate,Math,JSON};
sandbox.window.window=sandbox.window;
vm.runInNewContext(fs.readFileSync('mobile-research-lite-v1.js','utf8'),sandbox,{filename:'mobile-research-lite-v1.js'});
const api=sandbox.window.MarinaEmpireResearchLite;
assert(api,'Research API must exist');

let snap=api.snapshot();
let efficient=snap.projects.find(p=>p.id==='efficient_engines');
let hull=snap.projects.find(p=>p.id==='reinforced_hull');
assert.equal(efficient.state,'available','Efficient engines should be initially available');
assert.equal(hull.state,'locked','Reinforced hull must be locked before prerequisite completion');

const start=api.start('efficient_engines');
assert.equal(start.ok,true,'Affordable first research must start');
assert.equal(game.coins,10000,'Starting research must deduct exactly 30,000 credits');
assert.equal(game.research.efficient_engines.status,'active');

const again=api.start('efficient_engines');
assert.equal(again.ok,false,'Same research cannot be purchased twice while active');
assert.equal(game.coins,10000,'Second start attempt must not deduct coins');

const locked=api.start('reinforced_hull');
assert.equal(locked.ok,false,'Dependent research must remain blocked while prerequisite is active');
assert.equal(game.coins,10000,'Blocked research must not deduct coins');

now += 2_700_001;
snap=api.snapshot();
efficient=snap.projects.find(p=>p.id==='efficient_engines');
hull=snap.projects.find(p=>p.id==='reinforced_hull');
assert.equal(efficient.state,'complete','Efficient engines must settle to complete after duration');
assert.equal(hull.state,'available','Reinforced hull must unlock after prerequisite completion');

const unaffordable=api.start('reinforced_hull');
assert.equal(unaffordable.ok,false,'Unaffordable unlocked research must be blocked');
assert.equal(game.coins,10000,'Unaffordable research must not deduct coins');

console.log('PASS: research costs, single-purchase behavior, prerequisites and affordability are correct.');
