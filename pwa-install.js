(function(){
"use strict";
let deferred=null,installed=window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches;
function buttons(){return [...document.querySelectorAll("[data-pwa-install]")]}
function update(){
 buttons().forEach(b=>{
  if(installed){b.textContent="APP INSTALLATA";b.disabled=true;b.hidden=false;return}
  if(deferred){b.textContent="INSTALLA APP";b.disabled=false;b.hidden=false;return}
  b.textContent="INSTALLA APP";b.disabled=true;b.hidden=true;
 });
}
if("serviceWorker" in navigator){
 window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(e=>console.warn("PWA SW",e)));
}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;update()});
window.addEventListener("appinstalled",()=>{installed=true;deferred=null;update()});
document.addEventListener("click",async e=>{
 const b=e.target.closest?.("[data-pwa-install]");if(!b||!deferred)return;
 b.disabled=true;
 try{await deferred.prompt();await deferred.userChoice}catch(e){console.warn("PWA install",e)}
 deferred=null;update();
});
document.addEventListener("DOMContentLoaded",update);
window.MarinaEmpirePWA=Object.freeze({refresh:update,isInstalled:()=>installed,canInstall:()=>!!deferred});
})();