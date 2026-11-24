'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('mobile-map-lite-v2.js','utf8');
function sandbox(prestige=50){
 let now=1000000,game={name:'Test',coins:20000,prestige,fuel:400,condition:100,port:'cervia',boat:'voyager',owned:['voyager'],completed:['INTRO_RIMINI_CERVIA'],trip:null,reservations:[],voyages:1,voyageSerial:1,settledVoyages:[1]};
 const clone=x=>JSON.parse(JSON.stringify(x)),handle={accountId:null};
 const store={capture:()=>handle,select:()=>true,readGame:()=>clone(game),writeGame:(_,g)=>{game=clone(g);return true}};
 const context={window:{MarinaLocalSaveContext:store},Math,JSON,Date:{now:()=>now},console,sessionStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}}};vm.runInNewContext(source,context);
 const api=context.window.MarinaEmpireMapLite;
 return {api,get:()=>clone(game),set:g=>{game=clone(g)},step:(n=1)=>{for(let i=0;i<n;i++){now+=700;api.pulse()}}};
}

let s=sandbox(),catalog=s.api.missionCatalog();
assert(catalog.some(m=>m.kind==='rescue'&&m.ready));
assert(catalog.some(m=>m.kind==='transfer'&&m.ready));
for(const k of ['charter','cargo','recovery'])assert(catalog.some(m=>m.kind===k&&!m.ready));
assert.equal(s.api.startMission(catalog.find(m=>m.kind==='charter').id).ok,false);
s=sandbox(250);catalog=s.api.missionCatalog();
for(const k of ['charter','cargo'])assert(catalog.some(m=>m.kind===k&&m.ready));
assert(catalog.some(m=>m.kind==='recovery'&&!m.ready));
s=sandbox(1000);assert(s.api.missionCatalog().some(m=>m.kind==='recovery'&&m.ready));
for(const [kind,event,choice,bonus,extraPrestige] of [['rescue','rescue','coastguard',180,20],['charter','vip','vipComfort',250,25],['cargo','cargo','cargoSecure',220,15],['recovery','seabob','seabobRecover',300,25]]){
 s=sandbox(1000);const m=s.api.missionCatalog().find(x=>x.kind===kind);
 assert(m?.ready,kind+' ready');assert(s.api.startMission(m.id,m.dest).ok);
 assert.equal(s.api.snapshot().trip.eventKey,event);assert.equal(s.api.snapshot().trip.missionKind,kind);
 assert.equal(s.api.applyVoyageDecision(choice).ok,false,'no event before departure');
 for(let i=0;i<120&&s.api.snapshot().trip.progress<.30;i++)s.step();
 assert(s.api.snapshot().trip.progress>=.24);
 assert.equal(s.api.applyVoyageDecision(event==='rescue'?'vipComfort':'coastguard').ok,false,'event mismatch rejected');
 const result=s.api.applyVoyageDecision(choice);assert(result.ok,kind);assert.equal(s.api.applyVoyageDecision(choice).ok,false,'no repeat event');
 assert.equal(s.api.snapshot().trip.objectiveDone,true);
 let g=s.get();g.trip.dockingReady=true;g.trip.dockingDepth=84;g.trip.dockingOffset=0;g.trip.dockingHeading=0;g.trip.enginePort=0;g.trip.engineStarboard=0;g.trip.dockingAssistUsed=true;s.set(g);
 const before=s.get().coins;assert(s.api.completeDocking().ok);
 g=s.get();assert.equal(g.lastArrival.objectiveBonus,bonus);assert.equal(g.lastArrival.objectivePrestige,extraPrestige);
 assert.equal(g.coins,before+m.reward+result.bonus+140+bonus);
 assert.equal(g.missionHistory.length,1);assert.equal(g.missionHistory[0].kind,kind);
 const after=g.coins;assert.equal(s.api.completeDocking().ok,false);assert.equal(s.get().coins,after);
}
s=sandbox(250);const m=s.api.missionCatalog().find(x=>x.kind==='cargo');assert(s.api.startMission(m.id,m.dest).ok);
let g=s.get();g.trip.dockingReady=true;g.trip.dockingDepth=84;g.trip.dockingOffset=0;g.trip.dockingHeading=0;s.set(g);
assert(s.api.completeDocking().ok);assert.equal(s.get().lastArrival.objectiveBonus,0,'skipped objective preserves base but no bonus');
console.log('PASS: actual contract types, unlocks, event validation, conditional bonus and mission history');
