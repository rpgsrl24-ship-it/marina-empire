// Marina Empire release smoke checks. Run: node tests/smoke.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(m=>!/(?:\bsrc\s*=|\btype\s*=\s*["'](?:application\/json|importmap))/i.test(m[1]));
assert(scripts.length>0,'No inline game scripts found');
for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i][2],{filename:'index.html:inline-script-'+(i+1)});
const required=['function launch(id)','function finishVoyage()','function voyageHeartbeat()','function renderMissionChoices()','function renderOfficeMissions()','function showTab(id)','id="cloudEmail"','id="voyageArrivalNotice"'];
for(const token of required)assert(html.includes(token),'Missing game element: '+token);
const gate='!window.meRegisteredPlayer&&(Number(state.voyages)||0)>=1';
assert(html.includes(gate),'Free guest trial gate missing');
assert(html.includes('if(id==="office"&&state.setupComplete){renderOfficeMissions()}'),'Office mission refresh missing');
console.log('PASS: '+scripts.length+' inline scripts parse; '+required.length+' essential elements and guest gate present.');
