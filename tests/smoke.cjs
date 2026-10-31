// Marina Empire release smoke checks. Run: node tests/smoke.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(m=>!/(?:\bsrc\s*=|\btype\s*=\s*["'](?:application\/json|importmap))/i.test(m[1]));
assert(scripts.length>0,'No inline game scripts found');
for(let i=0;i<scripts.length;i++)new vm.Script(scripts[i][2],{filename:'index.html:inline-script-'+(i+1)});
for(const match of html.matchAll(/<script\\b[^>]*\\bsrc=["'](\\.\\/[^"']+\\.js)["'][^>]*><\\/script>/gi)){
  const path=match[1].slice(2);
  assert(fs.existsSync(path),'Missing local script: '+path);
  new vm.Script(fs.readFileSync(path,'utf8'),{filename:path});
}
const required=['function launch(id)','function finishVoyage()','function voyageHeartbeat()','function renderMissionChoices()','function renderOfficeMissions()','function showTab(id)','id="cloudEmail"','id="voyageArrivalNotice"'];
for(const token of required)assert(html.includes(token),'Missing game element: '+token);
const gate='!window.meRegisteredPlayer&&(Number(state.voyages)||0)>=1';
assert(html.includes(gate),'Free guest trial gate missing');
assert(html.includes('if(id==="office"&&state.setupComplete){renderOfficeMissions()}'),'Office mission refresh missing');
assert(html.includes('if(id==="missions"&&state.setupComplete){renderMissionChoices()}'),'Mission tab refresh missing');
assert(html.includes('if(!window.meRegisteredPlayer&&(Number(state.voyages)||0)>=1){showTab("profile");'),'Guest mission launch guard missing');
assert(html.includes('window.meRegisteredPlayer=!!account?.email_confirmed_at'),'Verified account check missing');
assert(html.includes('if(id==="profile"&&!window.meRegisteredPlayer'),'Registration focus missing');
for(const id of ['cloudEmail','voyageArrivalNotice','missionList','officeMissions']){
  const occurrences=[...html.matchAll(new RegExp('\\bid=["\\x27]'+id+'["\\x27]','g'))].length;
  assert.equal(occurrences,1,'Expected one element with id='+id+', found '+occurrences);
}

console.log('PASS: '+scripts.length+' inline scripts parse; '+required.length+' essential elements and guest gate present.');
