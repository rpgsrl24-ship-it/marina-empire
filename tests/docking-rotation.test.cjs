'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const engine=fs.readFileSync('mobile-map-lite-v2.js','utf8');
function scenario(){
 let now=1000000;
 let game={name:'Dock Test',coins:10000,prestige:0,fuel:300,condition:100,port:'rimini',boat:'voyager',owned:['voyager'],completed:[],voyages:0,settledVoyages:[],reservations:[],setupComplete:true,trip:{id:'DOCK_TEST',voyageId:1,dockingVersion:1,dockingReady:true,dockingHeading:0,dockingOffset:0,dockingDepth:0,dockingLastAt:now,origin:'rimini',dest:'cervia',legs:['rimini','cervia'],legIndex:0,sec:20,until:now,progressBase:.97,mission:{id:'DOCK_TEST',name:'Test',dest:'cervia',reward:500,prestige:50}}};
 const copy=x=>JSON.parse(JSON.stringify(x)),handle={accountId:null},store={capture:()=>handle,select:()=>true,readGame:()=>copy(game),writeGame:(_,next)=>{game=copy(next);return true}};
 const sandbox={window:{MarinaLocalSaveContext:store},Date:{now:()=>now},console,Math,JSON,sessionStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}}};
 vm.runInNewContext(engine,sandbox);
 const api=sandbox.window.MarinaEmpireMapLite,step=(n=1)=>{for(let i=0;i<n;i++){now+=700;api.pulse()}},trip=()=>api.snapshot().trip;
 return {api,step,trip,get:()=>copy(game),set:g=>{game=copy(g)}};
}
function engines(s,v){assert(s.api.setDockEngine('port',v).ok);assert(s.api.setDockEngine('starboard',v).ok)}
function manualDock(s,v){
 engines(s,v);
 for(let i=0;i<25&&s.trip().dockingDepth<72;i++)s.step();
 assert(s.trip().dockingDepth>=70,'manual approach advances into berth');
 engines(s,0);s.step(8);
 const result=s.api.completeDocking();assert(result.ok,result.message);return result;
}
let s=scenario();
assert.equal(s.api.rotateDock90(1).ok,true);
assert.equal(s.api.rotateDock90(1).ok,false,'cannot stack turns');
s.step(5);assert.equal(s.trip().dockingHeading,90);
assert.equal(s.trip().dockingTurning,false);
engines(s,1);s.step(1);assert(s.trip().dockingDepth<.01,'perpendicular thrust must not advance into berth');engines(s,0);
s=scenario();
assert(s.api.setDockOrientation('stern').ok);
assert(s.api.rotateDock90(1).ok);s.step(5);assert.equal(s.trip().dockingHeading,90);
assert(s.api.rotateDock90(1).ok);s.step(5);assert.equal(s.trip().dockingHeading,-180);assert.equal(s.trip().dockingHeadingError,0);
let result=manualDock(s,-1);
assert.equal(result.orientation,'stern');assert.equal(result.manualBonus,250);assert.equal(result.manualPrestige,20);
assert.equal(s.get().coins,10000+500+result.bonus);
assert.equal(s.get().prestige,50+result.prestige);
assert.equal(s.get().lastArrival.dockingManualBonus,250);
const coins=s.get().coins;assert.equal(s.api.completeDocking().ok,false);s.step(3);assert.equal(s.get().coins,coins);
s=scenario();result=manualDock(s,1);assert.equal(result.orientation,'bow');assert.equal(result.manualBonus,250);
s=scenario();assert(s.api.setDockOrientation('stern').ok);assert(s.api.setDockAssist(true).ok);s.step(25);result=s.api.completeDocking();assert(result.ok,result.message);assert.equal(result.orientation,'stern');assert.equal(result.manualBonus,0);
s=scenario();assert(s.api.setDockAssist(true).ok);s.step(1);assert(s.api.setDockAssist(false).ok);result=manualDock(s,1);assert.equal(result.manualBonus,0,'assistance history prevents clean reward');
s=scenario();let g=s.get();g.trip.dockingDepth=75;g.trip.dockingHeading=90;g.trip.dockingManualMoved=true;s.set(g);assert.equal(s.api.completeDocking().ok,false);assert.equal(s.api.rotateDock90(1).ok,false);assert.equal(s.api.setDockOrientation('stern').ok,false);
s=scenario();g=s.get();g.trip.dockingDepth=84;g.trip.dockingContacts=1;g.trip.dockingManualMoved=true;s.set(g);result=s.api.completeDocking();assert(result.ok);assert.equal(result.manualBonus,0);
console.log('PASS: quarter turns, bow/stern propulsion, safe completion, manual bonus and no double payout');
