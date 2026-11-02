const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const missionBlock=html.match(/const missions=\[([\s\S]*?)\];/);
assert(missionBlock,'Missing mission configuration');
const expected={S001:{reward:3000,cost:250},S002:{reward:6500,cost:900},S003:{reward:9500,cost:1900}};
for(const [id,values] of Object.entries(expected)){
 const match=missionBlock[1].match(new RegExp('id:"'+id+'"[^}]*reward:(\\d+),cost:(\\d+)'));
 assert(match,'Missing starter mission '+id);
 assert.equal(Number(match[1]),values.reward,'Incorrect reward for '+id);
 assert.equal(Number(match[2]),values.cost,'Unexpected cost change for '+id);
 assert(values.reward>values.cost,'Starter mission must have positive base margin');
}
assert(html.includes('settledIds.includes(trip.voyageId)'),'Missing duplicate voyage settlement guard');
assert(html.includes('if(m&&!alreadySettled)'),'Missing guarded mission payout');
assert(html.includes('state.coins<total'),'Missing mission affordability check');
console.log('PASS: starter mission balance, affordability, and settlement guards');
