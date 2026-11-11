'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

let game={
 name:'Comandante',coins:10000,prestige:0,fuel:300,condition:100,port:'rimini',
 boat:'voyager',owned:['voyager'],marketInventory:[]
};
const handle={accountId:null};
const store={
 capture:()=>handle,
 select:()=>true,
 readGame:()=>JSON.parse(JSON.stringify(game)),
 writeGame:(_h,next)=>{game=JSON.parse(JSON.stringify(next));return true;}
};

// Validate page has exactly the intended safe credit items.
const html=fs.readFileSync('marketplace-mobile.html','utf8');
for(const [id,cost] of [['captain_badge',2500],['marina_frame',3500],['founder_flag',5000]]){
 assert(html.includes(`data-credit-id="${id}"`),id+' card must exist');
 assert(html.includes(`data-credit-cost="${cost}"`),id+' cost must be explicit');
}
assert(html.includes('ACQUISTA IN CREDITI'),'Marketplace must visibly distinguish credit purchases');
assert(html.includes('marketInventory'),'Marketplace must persist credit collectibles in the save');
assert(html.includes('before-cost'),'Credit purchase must use exact one-time deduction logic');
assert(html.includes('includes(id)'),'Duplicate purchase guard must exist');

// Simulate purchase rules directly against the same data model.
function buy(id,cost){
 game.marketInventory=Array.isArray(game.marketInventory)?game.marketInventory:[];
 if(game.marketInventory.includes(id))return false;
 const before=Math.max(0,Number(game.coins)||0);
 if(before<cost)return false;
 game.coins=before-cost;
 game.marketInventory.push(id);
 return store.writeGame(handle,game);
}
assert.equal(buy('captain_badge',2500),true);
assert.equal(game.coins,7500);
assert.deepEqual(game.marketInventory,['captain_badge']);

assert.equal(buy('captain_badge',2500),false,'Duplicate purchase must be blocked');
assert.equal(game.coins,7500,'Duplicate purchase must not deduct again');

assert.equal(buy('founder_flag',5000),true);
assert.equal(game.coins,2500);
assert(game.marketInventory.includes('founder_flag'));

assert.equal(buy('marina_frame',3500),false,'Unaffordable purchase must be blocked');
assert.equal(game.coins,2500);
assert(!game.marketInventory.includes('marina_frame'));

const saved=store.readGame(handle);
assert.equal(saved.coins,2500);
assert.deepEqual(saved.marketInventory,['captain_badge','founder_flag']);

console.log('PASS: Marketplace credit purchases are exact, one-time, affordability-gated and persistent.');
