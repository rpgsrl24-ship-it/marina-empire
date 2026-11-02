'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');

function functionSource(name){
 const start=html.indexOf('function '+name+'(');assert(start>=0,'Missing '+name);
 let depth=0,quote=null,esc=false;
 for(let i=html.indexOf('{',start);i<html.length;i++){
  const ch=html[i];
  if(quote){if(esc)esc=false;else if(ch==='\\\\')esc=true;else if(ch===quote)quote=null;continue}
  if(ch==='\"'||ch===\"'\"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++; if(ch==='}'&&--depth===0)return html.slice(start,i+1);
 }
 throw Error('Unterminated '+name);
}
function declaration(name){const line=html.split('\\n').find(l=>l.startsWith('const '+name+'='));assert(line,'Missing '+name);return line}

const context=vm.createContext({Number,Math,Object,Array,Set,String});
vm.runInContext(declaration('boats'),context);
vm.runInContext(functionSource('fuelBurnPerNm'),context);

test('every vessel has a finite positive and distinct fuel profile',()=>{
 const profiles=vm.runInContext('boats.map(b=>({id:b.id,tank:b.tank,burn:fuelBurnPerNm(b.id)}))',context);
 assert.equal(profiles.length,7);
 assert.equal(new Set(profiles.map(x=>x.burn)).size,profiles.length);
 for(const p of profiles){assert(Number.isFinite(p.burn)&&p.burn>0,p.id+' burn');assert(Number.isFinite(p.tank)&&p.tank>0,p.id+' tank')}
});

test('academy keeps the historical beta baseline while larger vessels differ',()=>{
 assert.equal(vm.runInContext('fuelBurnPerNm(\"voyager\")',context),0.85);
 assert.notEqual(vm.runInContext('fuelBurnPerNm(\"open\")',context),vm.runInContext('fuelBurnPerNm(\"yacht30\")',context));
 assert(vm.runInContext('fuelBurnPerNm(\"luna\")',context)>vm.runInContext('fuelBurnPerNm(\"voyager\")',context));
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
 assert(html.includes('state.condition=Math.max(0,state.condition-3)'));
});

test('maintenance cost still scales by vessel acquisition class',()=>{
 assert(html.includes('Math.round(1000*(1+boat(state.boat).price/100000))'));
});

console.log('P0 vessel fuel and maintenance tests loaded');