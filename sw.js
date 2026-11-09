const CACHE="marina-empire-v20261109-map-standalone4";
const CORE=[
 "./",
 "./index.html",
 "./manifest.webmanifest",
 "./app-icon.svg",
 "./credit-purchase-rc.js",
 "./local-save-context.js",
 "./save-state-guard.js"
];

self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).catch(()=>{}));
 self.skipWaiting();
});

self.addEventListener("activate",event=>{
 event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
 );
 self.clients.claim();
});

self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;

 const isFreshAsset=req.mode==="navigate"||/\.(?:html?|js|css)$/i.test(url.pathname);

 if(isFreshAsset){
  event.respondWith(
   fetch(req,{cache:"no-store"}).then(res=>{
    if(res&&res.ok){
     const copy=res.clone();
     caches.open(CACHE).then(cache=>cache.put(req.mode==="navigate"?"./index.html":req,copy)).catch(()=>{});
    }
    return res;
   }).catch(()=>req.mode==="navigate"?caches.match("./index.html"):caches.match(req))
  );
  return;
 }

 event.respondWith(
  caches.match(req).then(cached=>{
   const network=fetch(req).then(res=>{
    if(res&&res.ok){
     const copy=res.clone();
     caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{});
    }
    return res;
   }).catch(()=>cached);
   return cached||network;
  })
 );
});