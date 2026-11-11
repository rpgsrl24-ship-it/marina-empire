'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const sw=fs.readFileSync('sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const manifestAlias=JSON.parse(fs.readFileSync('manifest.json','utf8'));

for(const path of [
 './mobile-home.html?v=20261110-fast3',
 './missions-mobile.html?v=20261110-missions7',
 './map-mobile.html?v=20261110-map14',
 './marina-mobile.html?v=20261110-marina3',
 './fleet-mobile.html?v=20261109-fleet1',
 './profile-mobile.html?v=20261110-profile1',
 './account-mobile.html',
 './marketplace-mobile.html?v=20261110-market13',
 './cloud-sync-modern.js?v=20261111-cloud1',
 './pwa-install.js?v=20261111-pwa1'
]) assert(sw.includes(JSON.stringify(path)), 'Offline core missing '+path);

assert(sw.includes('fetch(req,{cache:"no-store"})'),'Navigation and fresh assets must prefer network');
assert(sw.includes('caches.match("./mobile-home.html?v=20261110-fast3")'),'Offline navigation must fall back to modern Home');
assert(!sw.includes('mobileLegacy'),'Service worker must never reference legacy mode');
assert(!sw.includes('home-old'),'Service worker must never reference old Home');

assert.equal(manifest.start_url,'./mobile-home.html?v=20261110-fast3');
assert.equal(manifest.display,'standalone');
assert.equal(manifest.scope,'./');
assert.deepEqual(manifestAlias,manifest,'manifest.json compatibility alias must match manifest.webmanifest exactly');

for(const page of ['mobile-home.html','profile-mobile.html','account-mobile.html']){
 const html=fs.readFileSync(page,'utf8');
 assert(html.includes('rel="manifest" href="./manifest.webmanifest"'),page+' must link the manifest');
 assert(html.includes('apple-mobile-web-app-capable'),page+' must expose iOS standalone metadata');
}
console.log('PASS: PWA offline core, modern fallback, manifests and iOS metadata are consistent.');
