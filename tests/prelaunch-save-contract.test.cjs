const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const protection=fs.readFileSync('save-state-guard.js','utf8');
for(const token of [
 'localStorage.setItem(KEY,snapshot)',
 'localStorage.getItem(KEY)!==snapshot',
 'JSON.stringify(state)',
 'src="./save-state-guard.js"',
 'state=meReadProtectedLocalState()',
 'window.meCanWriteLocalSave&&!window.meCanWriteLocalSave()',
 'state.settledVoyages=[...settledIds,trip.voyageId].slice(-200)',
 'if(m&&!alreadySettled)',
 'if(state.trip)return notice(',
 'state.coins<total',
])assert(html.includes(token),'Missing save/settlement contract: '+token);
for(const token of ['const state={...fresh(),...data}','Array.isArray(value.owned)','Array.isArray(value.completed)','if(!valid(data))','if(!protection||protection.blocked)return false'])assert(protection.includes(token),'Missing save protection contract: '+token);
assert(/function persist\(\)\{[\s\S]*?catch\(e\)\{console\.warn\("Marina Empire: salvataggio locale non riuscito"/.test(html),'Missing save failure warning');
console.log('PASS: protected local save verification, settlement replay and mission-start guards');
