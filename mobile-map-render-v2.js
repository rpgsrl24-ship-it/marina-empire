(()=>{"use strict";if(window.__ME_MAP_RENDER_V2__)return;window.__ME_MAP_RENDER_V2__=true;
const st=document.createElement("style");st.id="me-map-render-v2-style";st.textContent=`
@media(max-width:899px){
 #meMapPremiumTop .mm5-actions{display:none!important}
 #meMapRenderTabs{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:0 0 9px}
 #meMapRenderTabs button{min-height:50px;padding:5px 3px;border:1px solid #416b7d;border-radius:11px;background:linear-gradient(145deg,#103d53,#082b3e);color:#d9e7eb;font-size:6.7px;font-weight:950}
 #meMapRenderTabs button b{display:block;margin-bottom:3px;font-size:16px}
 #meMapRenderTabs button.on{border-color:#8edcff;background:linear-gradient(180deg,#199bd2,#0f6ea8);color:#fff}
 #meMapRenderStatus{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:0 0 9px}
 #meMapRenderStatus>div{padding:8px 4px;border:1px solid #416b7d;border-radius:10px;background:#0a3042;text-align:center}
 #meMapRenderStatus span{display:block;color:#9fb5be;font-size:6.2px;font-weight:900}#meMapRenderStatus b{display:block;margin-top:3px;color:#f2d28f;font-size:9px}
 #map.me-map5-ready #interactiveMapDisplay{height:56vh!important;min-height:410px!important;border:1px solid #d8b365!important;border-radius:15px!important;box-shadow:0 9px 24px #0006!important}
 #map.me-map5-ready .map-info-bar{margin-top:7px!important;padding:8px!important;border:1px solid #456f80!important;border-radius:11px!important;background:#092f42!important}
 #map.me-map5-ready .map-info-bar button{min-height:40px!important;border-radius:9px!important}
 #map.me-map5-ready #voyageCinema{margin:0!important;border:1px solid #d8b365!important;border-radius:16px!important;box-shadow:0 10px 28px #0008!important}
 #map.me-map5-ready #cinemaDock,#map.me-map5-ready #cinemaSea{height:56vh!important;min-height:410px!important}
 #meMapActiveCard{display:none;margin:0 0 9px;padding:10px;border:1px solid #6dd99b;border-radius:13px;background:linear-gradient(145deg,#0c3e48,#082d3d);color:#eef8f7}
 #meMapActiveCard.on{display:block}
 .mmrv-map-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.mmrv-map-head small{display:block;color:#7ce3a5;font-size:7px;font-weight:950;letter-spacing:.1em}.mmrv-map-head strong{display:block;margin-top:3px;color:#fff1c4;font:800 15px Georgia,serif}.mmrv-map-live{padding:5px 7px;border:1px solid #69dca0;border-radius:999px;color:#baf2d1;font-size:7px;font-weight:950}
 .mmrv-map-progress{height:8px;margin:9px 0 5px;border-radius:99px;background:#173c49;overflow:hidden}.mmrv-map-progress i{display:block;height:100%;background:linear-gradient(90deg,#62db7a,#b6ec5f)}
 .mmrv-map-route{display:flex;justify-content:space-between;gap:8px;color:#c6d9de;font-size:7.5px}.mmrv-map-route b{color:#fff3c1}
 .mmrv-map-tripgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.mmrv-map-tripgrid div{padding:8px 4px;border:1px solid #416b7d;border-radius:10px;background:#092f42;text-align:center}.mmrv-map-tripgrid span{display:block;color:#9fb7bf;font-size:6px}.mmrv-map-tripgrid b{display:block;margin-top:3px;color:#f2d28f;font-size:8.5px}
 #map.me-map5-ready>.grid>.panel:nth-child(2)>#position,#map.me-map5-ready>.grid>.panel:nth-child(2)>#boatName,#map.me-map5-ready>.grid>.panel:nth-child(2)>#chooseMission,#map.me-map5-ready>.grid>.panel:nth-child(2)>.item:not(#tripBox){display:none!important}
 #tripBox{margin:0!important;padding:10px!important;border-radius:12px!important;background:#092f42!important}
}`;document.head.appendChild(st);
function gs(){try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}}
function pname(id){try{return typeof port==="function"?(port(id)?.name||id):id}catch(_){return id||"Marina"}}
function world(){try{return window.MarinaEmpireWorldEvents?.modifiers?.(String(gs()?.port||"rimini"))||{}}catch(_){return{}}}
function ensure(){
 if(innerWidth>899)return null;const map=document.getElementById("map"),top=document.getElementById("meMapPremiumTop");if(!map||!top)return null;
 let tabs=document.getElementById("meMapRenderTabs");if(!tabs){tabs=document.createElement("nav");tabs.id="meMapRenderTabs";tabs.innerHTML='<button class="on" data-mmrv-map="map"><b>🗺️</b>MAPPA</button><button data-mmrv-map="route"><b>〽️</b>ROTTA</button><button data-mmrv-map="marinas"><b>⚓</b>MARINE</button><button data-mmrv-map="weather"><b>🌤️</b>METEO</button><button data-mmrv-map="traffic"><b>📡</b>TRAFFICO</button>';top.insertAdjacentElement("afterend",tabs);tabs.addEventListener("click",e=>{const b=e.target.closest("[data-mmrv-map]");if(!b)return;tabs.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));const mode=b.dataset.mmrvMap;if(mode==="marinas"){try{showTab("marinas")}catch(_){};return}if(mode==="route")document.querySelector(".map-info-bar")?.scrollIntoView({behavior:"smooth",block:"center"});if(mode==="weather"||mode==="traffic")document.getElementById("meMapRenderStatus")?.scrollIntoView({behavior:"smooth",block:"center"})})}
 let status=document.getElementById("meMapRenderStatus");if(!status){status=document.createElement("section");status.id="meMapRenderStatus";tabs.insertAdjacentElement("afterend",status)}
 let active=document.getElementById("meMapActiveCard");if(!active){active=document.createElement("section");active.id="meMapActiveCard";status.insertAdjacentElement("afterend",active)}
 return map;
}
function tripProgress(s){const t=s?.trip;if(!t)return 0;const a=Number(t.startedAt||t.start||0),b=Number(t.endsAt||t.end||0);if(a&&b&&b>a)return Math.max(0,Math.min(100,Math.round((Date.now()-a)/(b-a)*100)));const bar=document.getElementById("tripBar");const w=parseFloat(bar?.style?.width||"0");return Number.isFinite(w)?w:0}
function sync(){
 if(innerWidth>899)return;const map=ensure();if(!map||map.classList.contains("hide"))return;const s=gs()||{},w=world(),weather=w.weather||{},phase=w.phase||{},trip=s.trip||null;
 const status=document.getElementById("meMapRenderStatus");if(status)status.innerHTML='<div><span>METEO SIM.</span><b>'+String(weather.icon||"🌤️")+' '+String(weather.label||"CALMO")+'</b></div><div><span>FASE GIORNO</span><b>'+String(phase.icon||"☀️")+' '+String(phase.label||"GIORNO")+'</b></div><div><span>CARBURANTE</span><b>'+Math.round(Number(s.fuel)||0)+' L</b></div><div><span>STATO YACHT</span><b>'+Math.round(Number(s.condition)||100)+'%</b></div>';
 const card=document.getElementById("meMapActiveCard");if(!card)return;
 if(!trip){card.classList.remove("on");return}const pct=tripProgress(s),from=pname(trip.from||s.port),to=pname(trip.dest||trip.to),dist=Math.round(Number(trip.distance||trip.plan?.distance||0)),fuel=Math.round(Number(s.fuel)||0),cond=Math.round(Number(s.condition)||100);
 card.classList.add("on");card.innerHTML='<div class="mmrv-map-head"><div><small>📡 NAVIGAZIONE ATTIVA</small><strong>'+from+' → '+to+'</strong></div><span class="mmrv-map-live">'+pct+'%</span></div><div class="mmrv-map-progress"><i style="width:'+pct+'%"></i></div><div class="mmrv-map-route"><span>'+from+'</span><b>'+pct+'% COMPLETATO</b><span>'+to+'</span></div><div class="mmrv-map-tripgrid"><div><span>DISTANZA</span><b>'+(dist?dist+" NM":"IN ROTTA")+'</b></div><div><span>CARBURANTE</span><b>'+fuel+' L</b></div><div><span>STATO</span><b>'+cond+'%</b></div><div><span>MARE SIM.</span><b>'+String(weather.sea||"—")+'</b></div></div>';
 const routeText=document.getElementById("mm5RouteText");if(routeText)routeText.textContent="Navigazione attiva · "+from+" → "+to+" · "+pct+"% completato";
}
function boot(){setTimeout(()=>{ensure();sync()},120);const map=document.getElementById("map");if(map)new MutationObserver(()=>setTimeout(sync,40)).observe(map,{attributes:true,attributeFilter:["class"]});addEventListener("marina-empire-updated",()=>setTimeout(sync,60));addEventListener("resize",sync);setInterval(()=>{if(document.body.classList.contains("me-map5-active"))sync()},1000)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();})();