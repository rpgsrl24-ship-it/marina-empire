'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let now=Date.UTC(2026,10,27,12),copy=x=>JSON.parse(JSON.stringify(x));
let g={name:'Academy QA',coins:20000,prestige:1000,fuel:400,condition:100,port:'rimini',boat:'voyager',owned:['voyager'],completed:[],voyages:0,trip:null,setupComplete:true,voyageSerial:0,settledVoyages:[]};
const h={accountId:null},store={capture:()=>h,select:()=>true,readGame:()=>copy(g),writeGame:(_,v)=>{g=copy(v);return true}};
class Clock extends Date{static now(){return now}}
const ctx={window:{},Date:Clock,Math,JSON,console,sessionStorage:{getItem:()=>null,setItem(){},removeItem(){}}};
vm.runInNewContext(fs.readFileSync('local-save-context.js','utf8'),ctx);ctx.window.MarinaLocalSaveContext=store;
vm.runInNewContext(fs.readFileSync('mobile-map-lite-v2.js','utf8'),ctx);
const a=ctx.window.MarinaAcademy,nav=ctx.window.MarinaEmpireMapLite;
assert.equal(a.snapshot(g).passed,0);assert.equal(a.claim(g,'navigation').ok,false);
const initial=nav.missionCatalog().find(m=>m.kind==='academy');assert(initial.ready);assert(nav.startMission(initial.id,initial.dest).ok);
function dock({stern=false,assist=false,contacts=0}={}){
 Object.assign(g.trip,{dockingReady:true,dockingDepth:90,dockingOffset:0,dockingHeading:stern?-180:0,dockingOrientation:stern?'stern':'bow',enginePort:0,engineStarboard:0,bowThruster:0,dockingSurge:0,dockingSway:0,dockingYawRate:0,dockingManualMoved:true,dockingAssistUsed:assist,dockingContacts:contacts});
 now+=1000;assert(nav.completeDocking().ok);
}
dock({assist:true});assert.equal(a.snapshot(g).passed,1);assert(a.snapshot(g).tests[0].passed);assert.equal(a.snapshot(g).tests[1].passed,false);
const before=g.coins,p=g.prestige;assert(a.claim(g,'navigation',now).ok);assert.equal(g.coins,before+250);assert.equal(g.prestige,p+10);assert.equal(a.claim(g,'navigation',now).ok,false);
function start(kind){g.fuel=400;g.condition=100;const m=nav.missionCatalog().find(x=>x.kind===kind&&x.ready);assert(m);assert(nav.startMission(m.id,m.dest).ok)}
start('transfer');assert.equal(a.claim(g,'bow').ok,false);dock({contacts:1});assert.equal(a.snapshot(g).passed,1);
start('transfer');dock();assert.equal(a.snapshot(g).passed,2);assert(g.academyEvidence.bow);assert(g.lastArrival.academyNew.includes('bow'));
start('transfer');dock({stern:true});assert.equal(a.snapshot(g).passed,3);assert(g.academyEvidence.stern);
start('rescue');g.trip.eventChoice='coastguard';g.trip.eventResolved=true;dock({assist:true});assert.equal(a.snapshot(g).certified,true);assert(g.academyEvidence.rescue);
g.missionHistory=[];g.lastArrival=null;assert.equal(a.snapshot(g).passed,4,'Permanent evidence survives history truncation');
for(const t of ['bow','stern','rescue']){assert(a.claim(g,t,now).ok);assert.equal(a.claim(g,t,now).ok,false)}
const legacy={completed:['INTRO_RIMINI_CERVIA'],coins:10000,prestige:50};assert.equal(a.snapshot(legacy).passed,1);
const fake={coins:10000,prestige:0,missionHistory:[{id:'DEMO_DOCKING',at:now,voyageId:1,dockingGrade:'PERFETTO',dockingOrientation:'bow',dockingManualBonus:250}]};assert.equal(a.snapshot(fake).passed,0);
const emergency={lastArrival:{emergency:true,at:now,voyageId:1}};assert.equal(a.snapshot(emergency).passed,0);
ctx.window.MarinaDockPreview=true;const practice={};assert.equal(a.recordArrival(practice,{at:now,voyageId:1,dockingGrade:'PERFETTO',dockingOrientation:'bow',dockingManualBonus:250}).length,0);assert.equal(a.snapshot(practice).passed,0);
for(const p of ['academy-mobile.html','mobile-home.html','missions-mobile.html','cabina-mobile.html','profile-mobile.html','evento-mondo.html'])for(const m of fs.readFileSync(p,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi))if(m[1].trim())new vm.Script(m[1],{filename:p});
console.log('PASS: Academy navigation, manual bow/stern, VHF rescue, practice exclusion, permanent proofs and one-time claims.');
