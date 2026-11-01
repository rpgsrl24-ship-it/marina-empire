// Marina Empire beta mobile/navigation regression checks.
// Run: node tests/mobile-navigation.test.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>!/\bsrc\s*=|\btype\s*=\s*["'](?:application\/json|importmap)/i.test(m[1]));
assert(scripts.length>0,'No game script found');
scripts.forEach((s,i)=>new vm.Script(s[2],{filename:'inline-'+i}));
const mustHave=['function launch(id)','function finishVoyage()','function voyageHeartbeat()','id="voyageArrivalNotice"','function showTab(id)','function renderMissionChoices()'];
for(const token of mustHave)assert(html.includes(token),'Missing navigation contract: '+token);
for(const id of ['voyageArrivalNotice','missionList','officeMissions']){
 const count=[...html.matchAll(new RegExp('\\bid=["\\x27]'+id+'["\\x27]','g'))].length;
 assert.equal(count,1,'Expected unique '+id);
}
assert(/name=["']viewport["']/i.test(html),'Missing mobile viewport');
console.log('PASS: navigation contracts, unique anchors, mobile viewport, and inline JS syntax');
// This is a static regression test, not a substitute for visual mobile testing.
