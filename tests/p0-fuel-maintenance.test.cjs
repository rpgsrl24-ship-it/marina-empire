'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');
const boatsLine=html.split('\n').find(l=>l.startsWith('const boats=['));
const burnLine=html.split('\n').find(l=>l.startsWith('function fuelBurnPerNm('));
assert(boatsLine,'Missing boats declaration');
assert(burnLine,'Missing fuelBurnPerNm');
const context=vm.createContext({Number,Math,Object,Array,Set,String,window:{MarinaEmpireRefit:{snapshot:()=>null}}});
vm.runInContext(boatsLine,context);
vm.runInContext(burnLine,context);

test('every vessel has a finite positive and distinct fuel profile',()=>{
 const profiles=vm.runInContext('boats.map(b=>({id:b.id,tank:b.tank,burn:fuelBurnPerNm(b.id)}))',context);
 assert.equal(profiles.length,7);
 assert.equal(new Set(profiles.map(x=>x.burn)).size,profiles.length);
 for(const p of profiles){
  assert(Number.isFinite(p.burn)&&p.burn>0,p.id+' burn');
  assert(Number.isFinite(p.tank)&&p.tank>0,p.id+' tank');
 }
});

test('academy keeps the historical beta baseline while larger vessels differ',()=>{
 assert.equal(vm.runInContext('fuelBurnPerNm("voyager")',context),0.85);
 assert.notEqual(vm.runInContext('fuelBurnPerNm("open")',context),vm.runInContext('fuelBurnPerNm("yacht30")',context));
 assert(vm.runInContext('fuelBurnPerNm("luna")',context)>vm.runInContext('fuelBurnPerNm("voyager")',context));
});

test('planning, launch, budget and stop all consume the vessel rate',()=>{
 for(const marker of [
  'planSeaTrip(from,to,tank,burnRate=0.85)',
  'Math.ceil(miles*rate)+reserve>capacity',
  'Math.ceil(seaMiles(plan.legs[i],plan.legs[i+1])*burn)',
  'planSeaTrip(state.port,m.dest,boat(m.boat).tank,burn)',
  'first=Math.ceil(seaMiles(plan.legs[0],plan.legs[1])*burn)',
  'fuelRate:burn',
  'trip.fuelRate'
 ]) assert(html.includes(marker),'Missing shared vessel fuel rule: '+marker);
});

test('fuel reserve and service guards remain active',()=>{
 assert(html.includes('reserve=Math.ceil(capacity*.15)'));
 assert(html.includes('reserve=Math.ceil(tank*.15)'));
 assert(html.includes('Rifornimento disponibile solo in marina'));
 assert(html.includes('Manutenzione non disponibile durante la navigazione'));
 assert(html.includes('Math.max(0,Math.min(100,boat(state.boat).tank-state.fuel))'));
 assert(html.includes('state.condition=Math.min(100,state.condition+15)'));
 assert(html.includes('const worldWear=Number(trip.weatherWear)||weather.wear'));
 assert(html.includes('researchWear=window.MarinaEmpireResearchEffects?.wearMultiplier?.()||1'));
 assert(html.includes('appliedWear=Math.max(0,worldWear*refitWear*researchWear)'));
 assert(html.includes('state.condition=Math.max(0,state.condition-appliedWear)'));
 assert(html.includes('wear:3')&&html.includes('wear:4')&&html.includes('wear:5'),'Simulated weather wear must remain bounded to 3-5%');
});

test('maintenance cost still scales by vessel acquisition class',()=>{
 assert(html.includes('Math.round(1000*(1+boat(state.boat).price/100000))'));
});

console.log('P0 vessel fuel and maintenance tests loaded');