'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const html=fs.readFileSync('index.html','utf8');

const missionMatch=html.match(/const missions=\[([\s\S]*?)\];/);
assert(missionMatch,'Mission catalog missing');
const rows=[...missionMatch[1].matchAll(/\{id:"(S\d+)",name:"[^"]+",dest:"[^"]+",boat:"([^"]+)",reward:(\d+),cost:(\d+),fuel:(\d+),prestige:(\d+),sec:(\d+)\}/g)]
  .map(m=>({id:m[1],boat:m[2],reward:+m[3],cost:+m[4],fuel:+m[5],prestige:+m[6],sec:+m[7]}));
assert.equal(rows.length,5,'Expected five configured benchmark missions');
for(let i=1;i<rows.length;i++){
  assert(rows[i].reward>rows[i-1].reward,'Rewards must rise across benchmark difficulty');
  assert(rows[i].cost>rows[i-1].cost,'Costs must rise across benchmark difficulty');
  assert(rows[i].prestige>rows[i-1].prestige,'Prestige must rise across benchmark difficulty');
  assert(rows[i].sec>rows[i-1].sec,'Duration must rise across benchmark difficulty');
}
assert.equal(rows[0].boat,'voyager');
assert.equal(rows[3].boat,'yacht');
assert.equal(rows[4].boat,'luna');

const boatsLine=html.split('\n').find(l=>l.startsWith('const boats=['));
assert(boatsLine,'Boat catalog missing');
for(const token of [
  'id:"voyager",name:"RPG Academy 8",price:0',
  'id:"open",name:"RPG Open 7",price:80000',
  'id:"yacht",name:"RPG Cruiser 12",price:350000',
  'id:"yacht14",name:"RPG Prestige 14",price:650000',
  'id:"yacht20",name:"RPG Elite 20",price:1800000',
  'id:"yacht30",name:"RPG Majesty 30",price:6000000',
  'id:"luna",name:"RPG Imperial 60",price:45000000'
]) assert(boatsLine.includes(token),'Boat progression changed: '+token);

for(const token of [
  'PRIMA MISSIONE · RPG Academy 8 · Rimini - Cervia',
  'reward:500,cost:0',
  'activeBoat==="luna"?2.7',
  'activeBoat==="yacht30"?2.55',
  'activeBoat==="yacht20"?2.3',
  'activeBoat==="yacht14"?2.05',
  'activeBoat==="yacht"?1.9',
  'activeBoat==="open"?1.3:1',
  'sec:Math.max(25,Math.min(120,Math.round(plan.distance*.55)))',
  'crewForBoat(activeBoat).daily',
  'if(!state.owned.includes(m.boat))return notice("Imbarcazione richiesta non disponibile")',
  'if(state.condition<30)return notice("Manutenzione necessaria',
  'if(first+reserve>tank)return notice("Autonomia insufficiente")',
  'if(state.coins<m.cost)return notice("Crediti insufficienti")'
]) assert(html.includes(token),'Missing difficulty/progression guard: '+token);

assert(html.includes('voyager:{roles:"Comandante",daily:0,count:1}'),'Academy must remain accessible without crew cost');
assert(html.includes('open:{roles:"Comandante e marinaio",daily:160,count:2}'),'Open crew step missing');
assert(html.includes('yacht:{roles:"Comandante, marinaio e hostess",daily:420,count:3}'),'Cruiser crew step missing');
assert(html.includes('luna:{roles:"Comandante, primo ufficiale, chef, hostess e marinai",daily:1500,count:7}'),'Imperial crew step missing');

console.log('PASS: mission difficulty grows through distance, duration, cost, crew, prestige and yacht class while the first mission stays accessible');
