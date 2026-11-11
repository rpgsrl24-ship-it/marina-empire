const CACHE="marina-empire-v20261111-modern1";
const CORE=[
 "./",
 "./index.html",
 "./mobile-home.html?v=20261110-fast3",
 "./missions-mobile.html?v=20261110-missions7",
 "./map-mobile.html?v=20261110-map14",
 "./marina-mobile.html?v=20261110-marina3",
 "./fleet-mobile.html?v=20261109-fleet1",
 "./profile-mobile.html?v=20261110-profile1",
 "./account-mobile.html",
 "./marketplace-mobile.html?v=20261110-market13",
 "./manifest.webmanifest",
 "./app-icon.svg",
 "./local-save-context.js",
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
   }).catch(async()=>await caches.match(req)||await caches.match("./mobile-home.html?v=20261110-fast3")||await caches.match("./index.html"))
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