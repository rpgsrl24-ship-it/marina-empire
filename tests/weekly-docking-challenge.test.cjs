'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const engine=fs.readFileSync('mobile-map-lite-v2.js','utf8');
function scenario(){
 let now=Date.UTC(2026,10,25,12,0,0);
 let game={name:'Dock Test',coins:10000,prestige:0,fuel:300,condition:100,port:'rimini',boat:'voyager',owned:['voyager'],completed:[],voyages:0,settledVoyages:[],reservations:[],setupComplete:true,trip:{id:'DOCK_TEST',voyageId:1,dockingVersion:1,dockingReady:true,dockingHeading:0,dockingOffset:0,dockingDepth:0,dockingLastAt:now,dockingStartedAt:now,origin:'rimini',dest:'cervia',legs:['rimini','cervia'],legIndex:0,sec:20,until:now,progressBase:.97,mission:{id:'DOCK_TEST',name:'Test',dest:'cervia',reward:500,prestige:50}}};
 const copy=x=>JSON.parse(JSON.stringify(x)),handle={accountId:null},store={capture:()=>handle,select:()=>true,readGame:()=>copy(game),writeGame:(_,next)=>{game=copy(next);return true}};
 const sandbox={window:{MarinaLocalSaveContext:store},Date:{now:()=>now},console,Math,JSON,sessionStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}}};
 vm.runInNewContext(engine,sandbox);
 const api=sandbox.window.MarinaEmpireMapLite,step=(n=1)=>{for(let i=0;i<n;i++){now+=700;api.pulse()}},trip=()=>api.snapshot().trip;
 return {api,step,trip,get:()=>copy(game),set:g=>{game=copy(g)},now:()=>now,advance:ms=>{now+=ms;}};
}

const s=scenario(),original=s.get().trip;
function seedVoyage(id,{assisted=false,contacts=0,demo=false,elapsed=15000,perfect=false}={}){
 const g=s.get();g.trip={...original,id:demo?"DEMO_DOCKING":"DOCK_TEST_"+id,voyageId:id,dockingReady:true,dockingDepth:perfect?88:84,dockingOffset:0,dockingHeading:0,dockingSurge:0,dockingYawRate:0,dockingManualMoved:true,dockingAssistUsed:assisted,dockingContacts:contacts,dockingStartedAt:s.now()-elapsed,dockingLastAt:s.now()};s.set(g);
}
assert.equal(s.api.weeklyDockStatus(s.get(),s.now()).count,0);
for(let i=1;i<=4;i++){
 seedVoyage(i,{elapsed:16000-i*1000,perfect:i===2});
 const before=s.get().coins,r=s.api.completeDocking();assert(r.ok,r.message);
 const g=s.get(),weekly=s.api.weeklyDockStatus(g,s.now());
 assert.equal(weekly.count,Math.min(3,i));
 assert.equal(g.lastArrival.weeklyDockReward,i===3?1200:0);
 assert.equal(g.lastArrival.weeklyDockPrestige,i===3?60:0);
 assert.equal(g.coins,before+500+r.bonus+(i===3?1200:0));
 assert.equal(weekly.bestMs,16000-i*1000);
 assert.equal(weekly.claimed,i>=3);
}
const settled=s.get().coins;seedVoyage(3);assert(s.api.completeDocking().ok);assert.equal(s.get().coins,settled,'already settled voyage cannot pay weekly again');
s.advance(7*86400000);
assert.equal(s.api.weeklyDockStatus(s.get(),s.now()).count,0,'new week');
seedVoyage(5,{assisted:true});assert(s.api.completeDocking().ok);
seedVoyage(6,{contacts:1});assert(s.api.completeDocking().ok);
seedVoyage(7,{demo:true});assert(s.api.completeDocking().ok);
assert.equal(s.api.weeklyDockStatus(s.get(),s.now()).count,0,'assisted, contacts and demo do not qualify');
seedVoyage(8);assert(s.api.completeDocking().ok);
assert.equal(s.api.weeklyDockStatus(s.get(),s.now()).count,1);
s.advance(-7*86400000);seedVoyage(9);assert(s.api.completeDocking().ok);
assert.equal(s.get().lastArrival.weeklyDockReward,0);assert(s.api.weeklyDockStatus(s.get(),s.now()).clockMismatch);
console.log('PASS: weekly clean docking reward once, personal time, reset, no demo or assisted awards, clock rewind guard');
