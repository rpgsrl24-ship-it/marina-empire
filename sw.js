const CACHE="marina-empire-v20261113-modern10";
const CORE=[
 "./",
 "./index.html",
 "./mobile-home.html?v=20261113-home8",
 "./missions-mobile.html?v=20261111-missions9",
 "./map-mobile.html?v=20261111-map16",
 "./marina-mobile.html?v=20261112-marina5",
 "./fleet-mobile.html?v=20261109-fleet1",
 "./profile-mobile.html?v=20261113-profile3",
 "./account-mobile.html?v=20261113-account5",
 "./marketplace-mobile.html?v=20261112-market14",
 "./community-mobile.html?v=20261112-community5",
 "./alliance-mobile.html?v=20261112-alliance2",
 "./manifest.webmanifest",
 "./app-icon.svg",
 "./local-save-context.js",
 "./commander-ranks-v1.js?v=20261113-rank1",
 "./premium-fx.js?v=20261112-fx1",
 "./marina-fx-v1.js?v=20261112-fx1",
 "./mobile-marina-lite-v1.js?v=20261112-marinalite3",
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