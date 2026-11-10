// Marina Empire modern mobile release smoke checks. Run: node tests/smoke.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

const read=p=>fs.readFileSync(p,'utf8');
const index=read('index.html');

// Root is now a minimal compatibility router, never the old game shell.
assert(index.includes('mobile-home.html?v=20261110-fast3'),'Root router must target the current Home');
assert(index.includes('missions-mobile.html?v=20261110-missions7'),'Root router must preserve Missioni aliases');
assert(index.includes('map-mobile.html?v=20261110-map14'),'Root router must preserve Mappa aliases');
assert(index.includes('marina-mobile.html?v=20261110-marina3'),'Root router must preserve Marina aliases');
assert(index.includes('marketplace-mobile.html?v=20261110-market13'),'Root router must preserve Marketplace aliases');
assert(!index.includes('function launch(id)'),'Legacy monolithic game shell must not return');
assert(!index.includes('mobileLegacy'),'Root router must not expose legacy mode');

// Parse every inline router script.
for(const [i,m] of [...index.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].entries()){
  if(!/\bsrc\s*=/i.test(m[1]))new vm.Script(m[2],{filename:'index.html:inline-'+(i+1)});
}

const pages=[
 'mobile-home.html','missions-mobile.html','map-mobile.html','marina-mobile.html',
 'fleet-mobile.html','marketplace-mobile.html','community-mobile.html','profile-mobile.html',
 'direction-mobile.html','ranking-mobile.html','alliance-mobile.html','research-mobile.html',
 'activities-mobile.html','office-mobile.html'
];
for(const p of pages)assert(fs.existsSync(p),'Missing modern page: '+p);

// Verify all local script references used by modern pages exist and parse.
for(const p of pages){
 const html=read(p);
 for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']\.\/([^"'?]+\.js)(?:\?[^"']*)?["'][^>]*><\/script>/gi)){
   assert(fs.existsSync(m[1]),p+' references missing script '+m[1]);
   new vm.Script(read(m[1]),{filename:m[1]});
 }
}

// Mission and map flow must use only the standalone engine.
const missions=read('missions-mobile.html');
const map=read('map-mobile.html');
const engine=read('mobile-map-lite-v2.js');
assert(missions.includes('mobile-map-lite-v2.js'),'Missioni must load the standalone map/mission engine');
assert(map.includes('mobile-map-lite-v2.js'),'Mappa must load the standalone map/mission engine');
assert(!map.includes('mobileLegacy'),'Mappa must not call legacy mode');
assert(!map.includes('id="mapEngine"'),'Mappa must not embed the legacy engine iframe');
for(const token of ['function missionCatalog()','function startMission(id,expectedDest)','function pulse()','lastArrival']){
 assert(engine.includes(token),'Standalone engine missing '+token);
}

// Core modern pages and safe commerce guard.
assert(read('marina-mobile.html').includes('mobile-marina-lite-v1.js'),'Marina must use the standalone marina engine');
assert(read('fleet-mobile.html').includes('mobile-fleet-lite-v1.js'),'Flotta must use the standalone fleet engine');
assert(read('research-mobile.html').includes('mobile-research-lite-v1.js'),'Ricerca must use the standalone research engine');
assert(read('marketplace-mobile.html').includes('credit-sync-guard.js'),'Marketplace must load modern credit safeguards');
assert(read('credit-purchase-rc.js').includes('typeof window.meCreditCheckoutReady!=="function"'),'Checkout must fail closed without the sync guard');

// Explicitly reject the old UI bundles that caused stale pages.
const obsolete=[
 'mobile-home-clean-v4.js','mobile-home-premium-v1.js','mobile-first-v5.js',
 'mobile-marina-live-v2.js','mobile-marina-live-v3.js','mobile-map-premium-v1.js',
 'mobile-marinas-premium-v1.js','mobile-missions-premium-v1.js','mobile-missions-new-v1.js',
 'mobile-community-premium-v2.js','mobile-office-premium-v2.js','mobile-profile-headquarters-premium-v1.js',
 'mobile-marketplace-premium-v2.js','mobile-marketplace-final-v9.js','marketplace-standalone-route-v12.js'
];
for(const p of obsolete)assert(!fs.existsSync(p),'Obsolete legacy UI file still present: '+p);

console.log('PASS: modern standalone mobile architecture is complete and legacy shell/UI bundles are absent.');
