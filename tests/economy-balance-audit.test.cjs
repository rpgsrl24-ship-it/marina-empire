'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const html=fs.readFileSync('index.html','utf8');
const shop=fs.readFileSync('credit-purchase-rc.js','utf8');

assert(html.includes('coins:10000'),'Starting balance must remain 10,000');
assert(html.includes('id:"open",name:"RPG Open 7",price:80000'),'Open 7 price changed');
assert(html.includes('id:"yacht",name:"RPG Cruiser 12",price:350000'),'Cruiser 12 price changed');
assert(html.includes('id:"sup",name:"Noleggio SUP e kayak",price:12000,income:300'),'Starter business changed');
assert(html.includes('reward:500,cost:0'),'Intro mission must remain free and reward 500');

const missionBlock=html.match(/const missions=\[([\s\S]*?)\];/);
assert(missionBlock,'Mission catalog missing');
for(const [id,reward,cost] of [['S001',3000,250],['S002',6500,900],['S003',9500,1900]]){
  const m=missionBlock[1].match(new RegExp('id:"'+id+'"[^}]*reward:(\\d+),cost:(\\d+)'));
  assert(m,'Missing mission '+id);
  assert.equal(Number(m[1]),reward,'Reward changed for '+id);
  assert.equal(Number(m[2]),cost,'Cost changed for '+id);
  assert(reward>cost,id+' must remain profitable before optional operating costs');
}

for(const token of [
  'at:3,credits:1500','at:6,credits:3000','at:10,credits:6000','at:20,credits:10000',
  'credits:50000,price:"4,99"','credits:120000,price:"9,99"',
  'credits:300000,price:"19,99"','credits:900000,price:"49,99"',
  'credits:2000000,price:"99,99"'
]) assert((html+shop).includes(token),'Economic baseline changed: '+token);

const starting=10000,openPrice=80000;
assert(starting+50000<openPrice,'€4.99 pack must not buy Open 7 immediately from a fresh account');
assert(starting+120000>=openPrice,'€9.99 pack relationship to Open 7 changed');
assert(starting+300000<350000,'300k pack must remain below Cruiser 12 from a fresh account');

console.log('PASS: free progression and approved paid-pack relationships remain unchanged');
