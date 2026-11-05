(()=>{
"use strict";
if(window.__ME_MOBILE_SIMPLIFY__)return;
window.__ME_MOBILE_SIMPLIFY__=true;

const style=document.createElement("style");
style.id="me-mobile-simplify-style";
style.textContent=`
@media(max-width:740px){
  /* HOME: guida + 4 scelte chiare */
  #home .me-mobile-home-dashboard{padding-top:0!important}
  #home .me-mobile-home-grid{margin-top:0!important}
  #home .me-mobile-home-goal{margin-top:8px!important}

  /* MAPPA: quando non si naviga mostra solo mappa + azioni essenziali */
  #map:not(.me-trip-active) .grid>.panel:last-child{display:none!important}
  #map:not(.me-trip-active) #voyageCinema{display:none!important}
  #map .visual-banner,
  #map .grid>.panel:first-child>h2,
  #map .grid>.panel:first-child>p.small:first-of-type,
  #map .grid>.panel:first-child>div.panel{display:none!important}
  #map .map-info-bar{margin-top:7px!important}
  #map .map-info-bar button{font-size:11px!important}
  #map.me-trip-active #interactiveMapDisplay,
  #map.me-trip-active .map-info-bar{display:none!important}

  /* MISSIONI: niente spiegoni dopo l'avvio */
  #missions.me-has-voyages #firstVoyageGuide{display:none!important}
  #missions>.panel:last-of-type>h2,
  #missions>.panel:last-of-type>p.muted{display:none!important}

  /* FLOTTA: una sola zona utile, la lista yacht */
  #fleet .me-fleet-banner,
  #fleet .fleet-command-strip,
  #fleet .me-secondary-details,
  #fleet .me-fleet-footer{display:none!important}
  #fleet .me-fleet-premium{padding:10px!important}
  #fleet .me-fleet-section-title{margin:0 0 8px!important}
  #fleet .me-fleet-section-title>div>span,
  #fleet .me-fleet-live{display:none!important}
  #fleet .me-fleet-section-title h3{margin:0!important;font-size:18px!important}

  /* MARINE: prima attività live e lista, tutto il resto secondario */
  #marinas #me-marina-ad-strip,
  #marinas .marinas-feature,
  #marinas .marina-command-center,
  #marinas .me-secondary-details,
  #marinas .me-marina-advertising,
  #marinas #me-online-berths{display:none!important}
  #marinas>.panel{padding:10px!important}
  #marinas>.panel>h2{display:none!important}
  #marinas .marina-list-heading{margin-top:4px!important}
  #marinas .marina-business-heading,
  #marinas .marina-business-heading+p,
  #marinas #businessList{display:none!important}
  #marinas.me-show-business .marina-business-heading,
  #marinas.me-show-business .marina-business-heading+p,
  #marinas.me-show-business #businessList{display:block!important}

  /* DIREZIONE: mobile = configurazione e operatività, economia avanzata dietro le quinte */
  #office>.panel>h2,
  #office>.panel>p:first-of-type{display:none!important}
  #office #meCreditsPreview{display:none!important}
  #office .berth-grid{display:none!important}
  #office .booking-note{display:none!important}
  #office .marina-extra{padding-top:7px!important;margin-top:7px!important}
  #office button:disabled{display:none!important}
  #office #marinaCommunity{margin-top:10px!important}

  /* MARKETPLACE: header compatto */
  #marketplace .me-lux-page-head{min-height:92px!important;padding:12px!important}
  #marketplace .me-lux-page-head p{display:none!important}

  /* CREDITI: riduci testo, lascia pacchetti */
  #credits .me-credits-intro p,
  #credits .me-credits-account p,
  #credits .me-credits-page>p.small.muted:last-child{display:none!important}
  #credits .me-credits-intro{margin-bottom:8px!important}
  #credits .me-credit-packs{margin:9px 0!important}

  /* PROFILO: nasconde gli strumenti tecnici dalla vista normale */
  #profile #save,
  #profile #exportSave,
  #profile #importSave,
  #profile #reset,
  #profile #importSaveFile,
  #profile>.panel>p.small.muted:last-child{display:none!important}
  #profile .cloudBox>p.muted.small:not(#cloudStatus),
  #profile #cloudResend,
  #profile #cloudResetPassword,
  #profile #cloudDownload,
  #profile #cloudUpload,
  #profile #cloudLogout,
  #profile .cloudBox>.item{display:none!important}
  #profile.me-account-ready #cloudUsername,
  #profile.me-account-ready label[for="cloudUsername"],
  #profile.me-account-ready #cloudEmail,
  #profile.me-account-ready label[for="cloudEmail"],
  #profile.me-account-ready #cloudPassword,
  #profile.me-account-ready label[for="cloudPassword"],
  #profile.me-account-ready #cloudPrivacy,
  #profile.me-account-ready label:has(#cloudPrivacy),
  #profile.me-account-ready label:has(#cloudMarketing),
  #profile.me-account-ready #cloudMagicLink,
  #profile.me-account-ready #cloudRegister,
  #profile.me-account-ready #cloudLogin{display:none!important}
  #profile .cloudActions{display:grid!important;grid-template-columns:1fr!important}
  #profile .cloudActions button{width:100%!important}

  /* HQ: una sola azione principale */
  #headquarters .row button:not(:first-child){display:none!important}
  #headquarters .item{display:none!important}

  /* Headers più compatti ovunque */
  .screen>.me-lux-page-head{min-height:92px!important;padding:12px 14px!important;margin-bottom:7px!important}
  .screen>.me-lux-page-head h1{font-size:24px!important;margin:3px 0!important}
  .screen>.me-lux-page-head p{font-size:11px!important;margin:0!important}
}
`;
document.head.appendChild(style);

function compactNpcCards(){
 if(typeof innerWidth!=="undefined"&&innerWidth>740)return;
 const cards=[...document.querySelectorAll(".me-npc-box")];
 const seen=new Set();
 let kept=0;
 for(const card of cards){
   const key=String(card.innerText||"").replace(/\d+[\s.,:]*/g,"").replace(/\s+/g," ").trim().slice(0,180);
   const duplicate=key&&seen.has(key);
   if(key)seen.add(key);
   const hide=duplicate||kept>=5;
   card.style.display=hide?"none":"";
   if(!hide)kept++;
 }
}

function sync(){
 if(typeof state==="undefined")return;
 document.getElementById("map")?.classList.toggle("me-trip-active",!!state.trip);
 document.getElementById("missions")?.classList.toggle("me-has-voyages",(Number(state.voyages)||0)>0);
 document.getElementById("profile")?.classList.toggle("me-account-ready",!!window.meRegisteredPlayer);
 compactNpcCards();
 const marinas=document.getElementById("marinas");
 if(marinas){
   const guide=window.__ME_MOBILE_SHOW_BUSINESS__;
   marinas.classList.toggle("me-show-business",!!guide);
 }
}
window.meShowMarinaBusinesses=function(){
 window.__ME_MOBILE_SHOW_BUSINESS__=true;
 sync();
 if(typeof showTab==="function")showTab("marinas");
 setTimeout(()=>document.querySelector(".marina-business-heading")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
};
window.addEventListener("marina-empire-updated",()=>setTimeout(sync,40));
document.addEventListener("visibilitychange",sync);
setInterval(sync,30000);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
})();