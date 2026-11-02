const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
for(const token of [
 'localStorage.setItem(KEY,snapshot)',
 'localStorage.getItem(KEY)!==snapshot',
 'JSON.stringify(state)',
 'state={...fresh(),...v}',
 'Array.isArray(v.owned)',
 'Array.isArray(v.completed)',
 'state.settledVoyages=[...settledIds,trip.voyageId].slice(-200)',
 'if(m&&!alreadySettled)',
 'if(state.trip)return notice(',
 'state.coins<total',
])assert(html.includes(token),'Missing save/settlement contract: '+token);
assert(/function persist\(\)\{[\s\S]*?catch\(e\)\{console\.warn\("Marina Empire: salvataggio locale non riuscito"/.test(html),'Missing save failure warning');
console.log('PASS: local save verification, settlement replay and mission-start guards');
