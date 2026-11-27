const CACHE="marina-empire-v20261127-market1";
const CORE=[
 "./",
 "./index.html",
 "./mobile-home.html?v=20261111-home6",
 "./missions-mobile.html?v=20261125-missions13",
 "./map-mobile.html?v=20261124-map20",
 "./cabina-mobile.html?v=20261126-cabin48",
 "./marina-mobile.html?v=20261123-marina5",
 "./marina-mobile.html?v=20261125-marina6",
 "./marina-mobile.html?v=20261126-marina9",
 "./mobile-marina-lite-v1.js?v=20261126-marinalite5",
 "./fleet-mobile.html?v=20261109-fleet1",
 "./mobile-fleet-lite-v1.js?v=20261109-fleetlite1",
 "./marketplace-mobile.html",
 "./profile-mobile.html?v=20261110-profile1",
 "./account-mobile.html",
 "./crew-mobile.html",
 "./academy-mobile.html",
 "./evento-mondo.html",
 "./weekend-water-toys.html",
 "./research-mobile.html?v=20261109-research1",
 "./mobile-research-lite-v1.js?v=20261109-researchlite1",
 "./direction-mobile.html?v=20261126-direction3",
 "./activities-mobile.html?v=20261110-activities1",
 "./marketplace-mobile.html?v=20261110-market13",
 "./manifest.webmanifest",
 "./app-icon.svg",
 "./local-save-context.js",
 "./player-tracker-v2.js?v=20261126-tracker5",
 "./docking-ranking.html?v=20261125-cup1",
 "./mobile-map-lite-v2.js?v=20261126-engine28",
 "./cloud-sync-modern.js?v=20261111-cloud1",
 "./pwa-install.js?v=20261111-pwa1"
];

self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).catch(()=>{}));
 self.skipWaiting();
});

self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
 self.clients.claim();
});

self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;

 if(req.mode==="navigate"){
  event.respondWith(
   fetch(req,{cache:"no-store"}).then(res=>{
    if(res&&res.ok)caches.open(CACHE).then(cache=>cache.put(req,res.clone())).catch(()=>{});
    return res;
   }).catch(async()=>await caches.match(req)||await caches.match("./mobile-home.html?v=20261111-home6")||await caches.match("./index.html"))
  );
  return;
 }

 const fresh=/\.(?:html?|js|css)$/i.test(url.pathname);
 if(fresh){
  event.respondWith(
   fetch(req,{cache:"no-store"}).then(res=>{
    if(res&&res.ok)caches.open(CACHE).then(cache=>cache.put(req,res.clone())).catch(()=>{});
    return res;
   }).catch(()=>caches.match(req))
  );
  return;
 }

 event.respondWith(caches.match(req).then(cached=>{
  const network=fetch(req).then(res=>{
   if(res&&res.ok)caches.open(CACHE).then(cache=>cache.put(req,res.clone())).catch(()=>{});
   return res;
  }).catch(()=>cached);
  return cached||network;
 }));
});