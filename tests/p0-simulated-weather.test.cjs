'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('const simulatedWeather=[');
const end=html.indexOf('// Simulated sea-corridor graph',start);
assert(start>=0&&end>start,'production simulated weather block exists');
const context=vm.createContext({Math,Number,String});
vm.runInContext(html.slice(start,end),context);

test('weather catalogue is finite, bounded and game-only',()=>{
 const profiles=vm.runInContext('simulatedWeather.map(x=>({...x}))',context);
 assert.equal(profiles.length,4);
 assert.equal(JSON.stringify(profiles.map(x=>x.id).sort()),JSON.stringify(['breeze','calm','rain','rough']));
 for(const p of profiles){
  assert(Number.isFinite(p.duration)&&p.duration>=1&&p.duration<=1.12,p.id+' duration');
  assert(Number.isInteger(p.wear)&&p.wear>=3&&p.wear<=5,p.id+' wear');
 }
});

test('weather selection is deterministic and can produce every profile',()=>{
 const first=vm.runInContext('simulatedWeatherFor("INTRO_RIMINI_CERVIA",42).id',context);
 const second=vm.runInContext('simulatedWeatherFor("INTRO_RIMINI_CERVIA",42).id',context);
 assert.equal(first,second);
 const seen=new Set();
 for(let i=1;i<=40;i++){context.serial=i;seen.add(vm.runInContext('simulatedWeatherFor("MISSION-"+serial,serial).id',context));}
 assert.equal(seen.size,4);
});

test('weather changes duration and wear but never route or fuel formula',()=>{
 assert(html.includes('missionDuration=Number(m.sec)*(worldWeather?.duration||weather.duration)'));
 assert(html.includes('const worldWear=Number(trip.weatherWear)||weather.wear'));
 assert(html.includes('appliedWear=Math.max(0,worldWear*refitWear)'));
 assert(html.includes('state.condition=Math.max(0,state.condition-appliedWear)'));
 assert(html.includes('weather:weather.id'));
 assert(!html.includes('fuelRate:burn*weather'));
 assert(!html.includes('planSeaTrip(state.port,m.dest,boat(m.boat).tank,burn*weather'));
});

test('UI labels simulated weather as not a real nautical forecast',()=>{
 assert(html.includes('Meteo simulato di gioco · non previsione nautica reale.'));
 assert(html.includes('id="meBridgeWeather"'));
 assert(html.includes('METEO SIMULATO'));
});
