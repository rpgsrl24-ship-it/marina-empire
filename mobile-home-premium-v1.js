(()=>{
"use strict";
if(window.__ME_MOBILE_HOME_PREMIUM_V1__)return;
window.__ME_MOBILE_HOME_PREMIUM_V1__=true;

const st=document.createElement("style");
st.id="me-mobile-home-premium-v1-style";
st.textContent='@media(max-width:899px){'+
'body.me-premium-home-active .top,body.me-premium-home-active #meCompactHud,body.me-premium-home-active #meMobileMarinaLiveCard,body.me-premium-home-active .stats,body.me-premium-home-active .me-top-onboarding,body.me-premium-home-active #meMobileNextStep,body.me-premium-home-active #home>.me-beta-launch-notice,body:has(#mePremiumHome) .top,body:has(#mePremiumHome) #meCompactHud,body:has(#mePremiumHome) #meMobileMarinaLiveCard,body:has(#mePremiumHome) .stats,body:has(#mePremiumHome) .me-top-onboarding,body:has(#mePremiumHome) #meMobileNextStep,body:has(#mePremiumHome) #home>.me-beta-launch-notice{display:none!important}'+
'body.me-premium-home-active .shell{padding-top:4px!important}'+
'#home .me-mobile-home-dashboard{display:flex!important;flex-direction:column!important;gap:9px!important;padding:0 0 104px!important}'+
'#home .me-mobile-home-dashboard>*:not(#mePremiumHome){display:none!important}'+
'#mePremiumHome{display:flex!important;flex-direction:column!important;gap:9px!important;width:100%!important;margin:0!important;padding:0!important;background:linear-gradient(180deg,#041d2d 0%,#05283a 55%,#031825 100%)!important}'+
'.meph-brand{text-align:center;color:#efd18e;padding:3px 0 1px}.meph-brand b{font:800 22px Georgia,serif;letter-spacing:.08em}.meph-brand small{display:block;margin-top:2px;color:#96afba;font-size:7px;font-weight:900;letter-spacing:.14em}'+
'.meph-hud{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.meph-hud>div,.meph-hud>button{min-width:0;padding:8px 4px;border:1px solid rgba(232,188,103,.72);border-radius:11px;background:linear-gradient(145deg,#1b6580,#0a3550);text-align:center;box-shadow:inset 0 1px #ffffff18,0 3px 12px #0004}.meph-hud button{border:1px solid rgba(232,188,103,.72);border-radius:11px;background:linear-gradient(145deg,#1b6580,#0a3550);color:inherit;box-shadow:inset 0 1px #ffffff18,0 3px 12px #0004}.meph-hud span{display:block;color:#a5bbc4;font-size:7px;font-weight:900;white-space:nowrap}.meph-hud b{display:block;margin-top:4px;color:#ffd66f;font-size:13px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.meph-hud .ok b{color:#69e48f}'+
'.meph-live{overflow:hidden;border:1px solid #d8ad63;border-radius:16px;background:#062635;box-shadow:0 10px 28px #0007}'+
'.meph-scene{position:relative;height:230px;overflow:hidden;background:#0c5975;isolation:isolate}.meph-scene:before{content:"";position:absolute;z-index:0;inset:0;background:url("./anteprima/assets/render-2026/marine.jpg") center 56%/cover no-repeat;filter:brightness(1.72) saturate(1.5) contrast(1.03);transform:scale(1.035)}'+
'.meph-scene:after{content:"";position:absolute;z-index:1;inset:55% 0 0;background:repeating-radial-gradient(ellipse at 50% 0,transparent 0 17px,#e0f9ff18 19px,transparent 22px,transparent 44px);animation:mephWater 8s linear infinite;pointer-events:none}'+
'@keyframes mephWater{from{transform:translateX(-2%)}to{transform:translateX(2%)}}'+
'.meph-head{position:absolute;z-index:8;left:8px;right:8px;top:8px;display:flex;justify-content:space-between;align-items:center;pointer-events:none}'+
'.meph-livebadge,.meph-day{padding:6px 9px;border-radius:999px;background:#042a36e8;font-size:9px;font-weight:950}.meph-livebadge{border:1px solid #62dc9f;color:#ddfff0}.meph-day{border:1px solid #d6b57566;color:#ecd29c}'+
'.meph-dot{display:inline-block;width:8px;height:8px;margin-right:5px;border-radius:50%;background:#65e3a1;box-shadow:0 0 9px #65e3a1}'+
'.meph-vessel{display:none!important}'+
'.meph-traffic-ticker{position:relative;z-index:2;overflow:hidden;border:1px solid rgba(105,221,255,.85);border-radius:10px;background:linear-gradient(90deg,#0b3d55,#0f5972,#0b3d55);box-shadow:0 5px 14px #0005}.meph-traffic-ticker:before{content:"TRAFFICO LIVE";position:absolute;left:0;top:0;bottom:0;z-index:3;display:flex;align-items:center;padding:0 9px;background:#0a2b40;color:#85e7ff;font-size:7px;font-weight:950;letter-spacing:.08em;border-right:1px solid #4db9d6}.meph-traffic-track{display:flex;width:max-content;gap:26px;padding:8px 12px 8px 88px;animation:mephTicker 22s linear infinite;color:#ecf7f8;font-size:8px;font-weight:900;white-space:nowrap}.meph-traffic-track b{color:#7cff9f}.meph-traffic-track .out{color:#ffda67}.meph-traffic-track .move{color:#72d6ff}@keyframes mephTicker{to{transform:translateX(-50%)}}'+
'.meph-vessel:nth-child(1){top:43%;animation:mephBoat1 18s linear -4s infinite}.meph-vessel:nth-child(2){top:60%;animation:mephBoat2 23s linear -11s infinite}.meph-vessel:nth-child(3){top:72%;animation:mephBoat3 28s linear -19s infinite}'+
'@keyframes mephBoat1{0%{transform:translateX(-80px) translateY(8px) scale(.84)}45%{transform:translateX(52vw) translateY(-13px) scale(.96)}100%{transform:translateX(calc(100vw + 45px)) translateY(2px) scale(.86)}}'+
'@keyframes mephBoat2{0%{transform:translateX(-110px) translateY(-5px) scale(.72)}50%{transform:translateX(48vw) translateY(12px) scale(.86)}100%{transform:translateX(calc(100vw + 55px)) translateY(-8px) scale(.74)}}'+
'@keyframes mephBoat3{0%{transform:translateX(-140px) translateY(10px) scale(.64)}48%{transform:translateX(46vw) translateY(-7px) scale(.76)}100%{transform:translateX(calc(100vw + 60px)) translateY(8px) scale(.66)}}'+
'.meph-shape{position:absolute;left:18px;top:7px;width:58px;height:26px;filter:drop-shadow(0 4px 5px #0008)}.meph-shape:before{content:"";position:absolute;left:0;right:0;bottom:2px;height:12px;background:linear-gradient(#f8fbfd,#bdd7e0);clip-path:polygon(0 18%,100% 0,82% 100%,17% 100%);border-radius:0 0 10px 10px}.meph-shape:after{content:"";position:absolute;left:20px;bottom:12px;width:27px;height:10px;border-radius:12px 14px 2px 2px;background:#f7fbfd;box-shadow:-8px 5px 0 -4px #0f5872}'+
'.meph-vessel.sail .meph-shape:after{left:28px;bottom:12px;width:3px;height:27px;background:#eef7fa;box-shadow:none}.meph-sail{display:none}.meph-vessel.sail .meph-sail{display:block;position:absolute;left:31px;top:-7px;width:25px;height:25px;background:linear-gradient(135deg,#fff 0 48%,#4a97c2 49%);clip-path:polygon(0 100%,0 0,100% 100%)}'+
'.meph-wake{position:absolute;left:-18px;top:27px;width:50px;height:7px;border-top:2px solid #e0fbff99;border-radius:50%}.meph-vlabel{position:absolute;left:3px;top:34px;max-width:90px;padding:2px 5px;border-radius:6px;background:#031c28cc;color:#eef7f8;font-size:7px;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
'.meph-livefoot{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:8px 9px;background:linear-gradient(#11516a,#0a3850)}.meph-livefoot small{display:block;color:#86a3af;font-size:7px;font-weight:900;letter-spacing:.1em}.meph-livefoot strong{display:block;margin-top:2px;color:#f5dfab;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.meph-livefoot button{min-height:39px!important;padding:7px 10px!important;background:linear-gradient(135deg,#e8c66f,#b98738)!important;color:#102734!important;font-size:9px!important;font-weight:950!important}'+
'.meph-alert{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:9px;align-items:center;padding:10px 11px;border:1px solid #d3ab606f;border-radius:13px;background:linear-gradient(145deg,#124c64,#0a3148)}.meph-alert.em{border-color:#ff5e5e77;background:linear-gradient(145deg,#5b1724,#153f53)}.meph-alert .ico{font-size:20px}.meph-alert small{display:block;color:#d6b66f;font-size:8px;font-weight:950}.meph-alert.em small{color:#ffd0b7}.meph-alert strong{display:block;margin-top:2px;color:#eef5f6;font-size:10px}.meph-alert span{display:block;margin-top:2px;color:#9bb1b9;font-size:8px}.meph-alert button{width:38px!important;min-width:38px!important;min-height:38px!important;padding:0!important}'+
'.meph-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.meph-actions button{position:relative;min-width:0!important;min-height:78px!important;padding:16px 4px 8px!important;border:1px solid #d4ae657f!important;border-radius:12px!important;background:linear-gradient(145deg,#16536c,#0a3147)!important;color:#f2d69d!important;font-size:8px!important;font-weight:950!important;line-height:1.15!important}.meph-actions button.ready{border-color:#ffd167!important;box-shadow:0 0 0 2px #ffd16733,0 7px 18px #0004!important}.meph-actions b{display:block;margin-bottom:5px;font-size:19px}.meph-step{position:absolute;top:5px;left:6px;display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;border-radius:999px;background:#e5b14c;color:#062437;font-size:10px;font-weight:950;box-shadow:0 2px 6px #0007}'+
'.meph-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.meph-tile{position:relative;overflow:hidden;min-width:0!important;min-height:82px!important;padding:0!important;border:1px solid #c79f5b7a!important;border-radius:12px!important;background:linear-gradient(145deg,#15556f,#082d43)!important;text-align:left!important}.meph-tile:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#02141f00 18%,#02141f55 52%,#02141fe8 88%);z-index:1}.meph-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.98;filter:brightness(1.22) saturate(1.22)}.meph-tile .i{position:absolute;z-index:2;left:7px;top:7px;font-size:18px}.meph-tile .l{position:absolute;z-index:2;left:7px;right:5px;bottom:7px;color:#fff0c9;font-size:7.5px;font-weight:950;line-height:1.1;text-shadow:0 2px 5px #000}.meph-tile.plain{background:linear-gradient(145deg,#175f79,#0a344d)!important}'+
'.meph-progress{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:10px 11px;border:1px solid #cda6605c;border-radius:13px;background:#082735}.meph-progress small{display:block;color:#8ea8b2;font-size:7px;font-weight:950}.meph-progress strong{display:block;margin-top:2px;color:#f1d293;font-size:10px}.meph-progress span{display:block;margin-top:3px;color:#9fb4bc;font-size:8px}.meph-progress button{min-height:38px!important;padding:6px 9px!important;font-size:8px!important;font-weight:950!important}'+
'#mePremiumMore{display:none;gap:7px;padding:9px;border:1px solid #cda66047;border-radius:12px;background:#061f2d}#mePremiumMore.open{display:grid}.meph-more{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px;border:1px solid #ffffff10;border-radius:9px;background:#0a2a38}.meph-more b{color:#e9d09a;font-size:9px}.meph-more small{display:block;margin-top:2px;color:#91a8b1;font-size:8px}.meph-more button{min-height:36px!important;padding:6px 8px!important;font-size:8px!important}'+
'.meph-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}.meph-actions{grid-template-columns:repeat(4,minmax(0,1fr))!important}'+
'@media(prefers-reduced-motion:reduce){.meph-vessel,.meph-scene:after{animation:none!important}.meph-vessel:nth-child(1){left:12%;top:48%}.meph-vessel:nth-child(2){left:43%;top:62%}.meph-vessel:nth-child(3){left:68%;top:72%}}'+
'}@media(min-width:900px){#mePremiumHome{display:none!important}}';
document.head.appendChild(st);

function w(){return Number(globalThis.innerWidth)||1024}
function sref(){try{return typeof state!=="undefined"?state:null}catch(e){return null}}
function go(id){if(typeof showTab==="function")showTab(id)}
function marina(id){try{return typeof port==="function"?port(id)?.name||"Marina":"Marina"}catch(e){return"Marina"}}
function scrollOffice(id){go("office");setTimeout(function(){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"})},140)}
function live(){try{return window.MarinaEmpireLiveTraffic?.snapshot?.()||null}catch(e){return null}}
function world(){try{return window.MarinaEmpireWorldEvents?.modifiers?.(sref()?.port)||null}catch(e){return null}}
function esc(v){return String(v??"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function milestone(){try{return window.MarinaEmpireMobileProgression?.milestone?.()||null}catch(e){return null}}
function vhfButton(){return document.querySelector(".me-live-vhf-action")}
function emergency(){
 const box=[...document.querySelectorAll(".me-emergency-box")].find(function(x){return x.querySelector("strong")});
 if(!box)return null;
 return {title:(box.querySelector("strong")?.textContent||"").replace(/^.*EMERGENZA LIVE\s*·\s*/i,"").trim(),text:(box.querySelector("p")?.textContent||"").trim()}
}

function ensure(){
 if(w()>899)return null;
 const home=document.querySelector("#home .me-mobile-home-dashboard");if(!home)return null;
 let root=document.getElementById("mePremiumHome");if(root)return root;
 root=document.createElement("section");root.id="mePremiumHome";
 root.innerHTML=
 '<div class="meph-brand"><b>⚓ MARINA EMPIRE</b><small>IL GESTIONALE NAUTICO ONLINE</small></div>'+
 '<div class="meph-hud"><div><span>🪙 MONETE</span><b id="mephCoins">—</b></div><div><span>⭐ PRESTIGIO</span><b id="mephPrestige">—</b></div><button type="button" class="meph-hud-action" data-hud-action="fuel"><span>⛽ CARBURANTE</span><b id="mephFuel">—</b></button><button type="button" class="meph-hud-action ok" data-hud-action="repair"><span>🔧 STATO</span><b id="mephCondition">—</b></button></div>'+
 '<div class="meph-traffic-ticker"><div class="meph-traffic-track" id="mephTrafficTrack"></div></div><section class="meph-live"><div class="meph-scene" id="mephScene" role="button" tabindex="0"><div class="meph-head"><div class="meph-livebadge"><i class="meph-dot"></i>MARINA LIVE</div><div class="meph-day" id="mephDay">☀️ GIORNO</div></div><div id="mephVessels"></div></div><div class="meph-livefoot"><div><small>TRAFFICO ATTIVO</small><strong id="mephLiveText">Marina · mondo vivo</strong></div><button type="button" id="mephOpenLive">APRI ›</button></div></section>'+
 '<section class="meph-alert"><div class="ico">🌍</div><div><small>EVENTO MONDO</small><strong id="mephWorldTitle">Attività ordinaria</strong><span id="mephWorldText">Marina operativa</span></div><button type="button" id="mephWorldAction">›</button></section>'+
 '<section class="meph-alert em"><div class="ico">🚨</div><div><small>EMERGENZA LIVE</small><strong id="mephEmergencyTitle">Intervento disponibile</strong><span id="mephEmergencyText">Controlla le richieste operative.</span></div><button type="button" data-go="marinas">›</button></section>'+
 '<div class="meph-actions"><button type="button" id="mephJob"><span class="meph-step">1</span><b>📋</b><span id="mephJobLabel">NUOVO INCARICO</span></button><button type="button" data-go="missions"><span class="meph-step">2</span><b>🎯</b>NUOVA<br>MISSIONE</button><button type="button" data-go="charter"><span class="meph-step">3</span><b>🤝</b>CONTRATTI<br>& CHARTER</button><button type="button" data-go="refit"><span class="meph-step">4</span><b>🛠️</b>CANTIERE<br>& REFIT</button></div>'+
 '<div class="meph-grid">'+
 '<button class="meph-tile" data-go="fleet"><img alt="" src="./anteprima/assets/render-2026/flotta.jpg"><span class="i">🛥️</span><span class="l">FLOTTA</span></button>'+
 '<button class="meph-tile" data-go="marinas"><img alt="" src="./anteprima/assets/render-2026/marine.jpg"><span class="i">⚓</span><span class="l">LA TUA MARINA</span></button>'+
 '<button class="meph-tile" data-go="map"><img alt="" src="./assets/italia-nautica.jpg"><span class="i">🗺️</span><span class="l">MAPPA</span></button>'+
 '<button class="meph-tile" data-go="crew"><img alt="" src="./anteprima/assets/render-2026/hero-yacht.jpg"><span class="i">👥</span><span class="l">EQUIPAGGIO</span></button>'+
 '<button class="meph-tile" data-go="charter"><img alt="" src="./anteprima/assets/render-2026/charter.jpg"><span class="i">🤝</span><span class="l">CONTRATTI / CHARTER</span></button>'+
 '<button class="meph-tile" data-go="marketplace"><img alt="" src="./anteprima/assets/render-2026/cantieri.jpg"><span class="i">🛒</span><span class="l">MARKETPLACE</span></button>'+
 '<button class="meph-tile" data-go="community"><img alt="" src="./anteprima/assets/render-2026/marine.jpg"><span class="i">💬</span><span class="l">COMMUNITY</span></button>'+
 '<button class="meph-tile" data-go="profile"><img alt="" src="./anteprima/assets/render-2026/economia.jpg"><span class="i">📊</span><span class="l">PROFILO / STAT.</span></button>'+
 '<button class="meph-tile" data-go="credits"><img alt="" src="./anteprima/assets/render-2026/hero-yacht.jpg"><span class="i">💳</span><span class="l">STORE / CREDITI</span></button>'+
 '<button class="meph-tile" data-go="refit"><img alt="" src="./anteprima/assets/render-2026/cantieri.jpg"><span class="i">🔧</span><span class="l">CANTIERE / REFIT</span></button>'+
 '<button class="meph-tile" data-go="office"><img alt="" src="./anteprima/assets/render-2026/economia.jpg"><span class="i">◈</span><span class="l">DIREZIONE</span></button>'+
 '<button class="meph-tile" data-go="headquarters"><img alt="" src="./anteprima/assets/render-2026/marine.jpg"><span class="i">🏝️</span><span class="l">BASE RPG</span></button>'+
 '</div>'+
 '<section class="meph-progress"><div><small>PROGRESSIONE & OBIETTIVI</small><strong id="mephProgressTitle">Continua il tuo impero</strong><span id="mephProgressText">Obiettivi, diario e servizi rapidi</span></div><button type="button" id="mephMore">DATI</button></section><div id="mePremiumMore"></div>';
 home.prepend(root);
 root.addEventListener("click",click);
 root.querySelectorAll("[data-hud-action]").forEach(function(btn){
   btn.addEventListener("click",function(ev){
     ev.stopPropagation();
     const action=btn.dataset.hudAction;
     if(action==="fuel"){
       const refuel=document.getElementById("refuel")||document.getElementById("officeRefuel");
       if(refuel&&!refuel.disabled){refuel.click();return}
       go("office");
       setTimeout(function(){
         const x=document.getElementById("refuel")||document.getElementById("officeRefuel")||document.getElementById("officeActions");
         x?.scrollIntoView({behavior:"smooth",block:"center"});
       },120);
       return;
     }
     if(action==="repair"){
       go("office");
       setTimeout(function(){
         const x=document.getElementById("maintenanceCard")||document.getElementById("repair")||document.getElementById("officeRepair")||document.getElementById("officeActions");
         x?.scrollIntoView({behavior:"smooth",block:"center"});
       },120);
     }
   });
 });
 document.getElementById("mephScene")?.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go("marinas")}});
 return root
}

function click(e){
 if(e.target.closest(".meph-vessel")||e.target.closest("#mephScene")||e.target.closest("#mephOpenLive")){go("marinas");return}
 if(e.target.closest("#mephJob")){
   const b=vhfButton();
   if(b&&!b.disabled){b.click();setTimeout(render,80);return}
   go("marinas");setTimeout(function(){document.querySelector(".me-live-vhf")?.scrollIntoView({behavior:"smooth",block:"center"})},140);return
 }
 if(e.target.closest("#mephMore")){
   const box=document.getElementById("mePremiumMore");const open=box.classList.toggle("open");e.target.textContent=open?"CHIUDI":"DATI";renderMore();return
 }
 const b=e.target.closest("[data-go]");if(!b)return;
 const id=b.dataset.go;
 if(id==="crew"){scrollOffice("meCrewSystem");return}
 if(id==="refit"){scrollOffice("meRefitV1");return}
 if(id==="community"){go("community");return}
 if(id==="charter"){go("missions");setTimeout(function(){document.getElementById("missionList")?.scrollIntoView({behavior:"smooth",block:"start"})},100);return}
 go(id)
}

function renderVessels(){
 const t=live();const list=(t?.items||[]).slice(0,5);
 const arr=list.length?list:[{name:"Riva 56",action:"in arrivo"},{name:"Blue Runner",action:"in manovra"},{name:"Adriatica",action:"in uscita"}];
 const track=document.getElementById("mephTrafficTrack");if(!track)return;
 const one=arr.map(function(v){
   const a=String(v.action||"in movimento").toLowerCase();
   const cls=/uscita|partenza/.test(a)?"out":/manovra/.test(a)?"move":"";
   const icon=/uscita|partenza/.test(a)?"↑":/arrivo/.test(a)?"↓":"↻";
   return '<span>⚓ '+esc(v.name)+' · <b class="'+cls+'">'+icon+' '+esc(a)+'</b></span>'
 }).join('<span>•</span>');
 track.innerHTML=one+one;
}
function renderMore(){
 const box=document.getElementById("mePremiumMore");if(!box||!box.classList.contains("open"))return;
 const s=sref();const m=milestone();const diary=window.MarinaEmpireCaptainsLog?.rows?.()?.[0];
 let daily="Obiettivi disponibili";
 try{const k=window.MarinaEmpireMobileDailyOps?.dayKey?.()||new Date().toISOString().slice(0,10);const api=window.MarinaEmpireObjectives;api?.ensure?.("daily",k);const stat=api?.status?.("daily",k);const items=window.MarinaEmpireMobileDailyOps?.selected?.()||[];if(stat&&items.length)daily=(stat.claimed||[]).length+" / "+items.length+" premi giornalieri riscossi"}catch(e){}
 let tank=0;try{tank=typeof boat==="function"?Number(boat(s?.boat)?.tank)||0:0}catch(e){}
 box.innerHTML=
 '<div class="meph-more"><div><b>🏁 OBIETTIVI DI OGGI</b><small>'+esc(daily)+'</small></div><button type="button" data-more="streak">PREMIO</button></div>'+
 '<div class="meph-more"><div><b>🧭 DIARIO DEL COMANDANTE</b><small>'+esc(diary?.title||m?.title||"Costruisci il tuo impero")+'</small></div><button type="button" data-more="profile">APRI</button></div>'+
 '<div class="meph-more"><div><b>⛽ CARBURANTE</b><small>'+Math.round(Number(s?.fuel)||0)+" / "+Math.round(tank||Number(s?.fuel)||0)+' L</small></div><button type="button" data-more="fuel">PIENO</button></div>'+
 '<div class="meph-more"><div><b>🔧 MANUTENZIONE</b><small>Stato yacht '+Math.round(Number(s?.condition)||0)+'%</small></div><button type="button" data-more="repair">GESTISCI</button></div>';
 box.querySelectorAll("[data-more]").forEach(function(b){b.addEventListener("click",function(ev){ev.stopPropagation();const a=b.dataset.more;
  if(a==="streak"){try{const k=window.MarinaEmpireMobileDailyOps?.dayKey?.()||new Date().toISOString().slice(0,10);const r=window.MarinaEmpireObjectives?.checkIn?.(k);if(r?.message&&typeof notice==="function")notice(r.message,5000)}catch(e){}setTimeout(renderMore,80);return}
  if(a==="profile"){go("profile");return}
  if(a==="fuel"){const f=document.getElementById("refuel")||document.getElementById("officeRefuel");if(f&&!f.disabled){f.click();return}go("office");return}
  if(a==="repair"){go("office");setTimeout(function(){document.getElementById("officeActions")?.scrollIntoView({behavior:"smooth",block:"center"})},120)}
 })})
}

function syncActive(){
 const home=document.getElementById("home");
 const active=w()<=899&&!!home&&!home.classList.contains("hide")&&!!document.getElementById("mePremiumHome");
 document.body.classList.toggle("me-premium-home-active",active);
 [".top","#meCompactHud","#meMobileMarinaLiveCard",".stats",".me-top-onboarding","#meMobileNextStep","#home>.me-beta-launch-notice"].forEach(function(sel){
   document.querySelectorAll(sel).forEach(function(el){
     if(active)el.style.setProperty("display","none","important");
     else el.style.removeProperty("display");
   });
 });
}
function render(){
 syncActive();
 if(!ensure())return;
 const s=sref(),t=live(),wld=world(),m=milestone(),em=emergency();
 const cv=document.getElementById("mephCoins"),pv=document.getElementById("mephPrestige"),fv=document.getElementById("mephFuel"),sv=document.getElementById("mephCondition");
 if(cv)cv.textContent=Math.max(0,Math.floor(Number(s?.coins)||0)).toLocaleString("it-IT");
 if(pv)pv.textContent=Math.max(0,Math.floor(Number(s?.prestige)||0)).toLocaleString("it-IT");
 if(fv)fv.textContent=Math.max(0,Math.floor(Number(s?.fuel)||0)).toLocaleString("it-IT")+" L";
 if(sv)sv.textContent=Math.max(0,Math.round(Number(s?.condition)||0))+"%";
 renderVessels();
 const phase=wld?.phase||window.MarinaEmpireWorldEvents?.dayPhase?.();const d=document.getElementById("mephDay");if(d)d.textContent=(phase?.icon||"☀️")+" "+String(phase?.label||"GIORNO");
 const lt=document.getElementById("mephLiveText");if(lt)lt.textContent=marina(s?.port)+" · "+Math.max(0,Number(t?.volume)||0)+" unità · "+(t?.items?.[0]?.name||"traffico attivo");
 const wt=document.getElementById("mephWorldTitle"),wx=document.getElementById("mephWorldText"),wa=document.getElementById("mephWorldAction");if(wt)wt.textContent=wld?.event?.title||"Attività ordinaria";if(wx)wx.textContent=(wld?.weather?.icon||"☀️")+" "+(wld?.weather?.label||"CALMO")+" · "+(wld?.weather?.sea||"Mare regolare");if(wa){const toy=wld?.event?.id==="toy_weekend";wa.textContent=toy?"APRI ›":"›";wa.style.width=toy?"58px":"";}
 const et=document.getElementById("mephEmergencyTitle"),ex=document.getElementById("mephEmergencyText");if(et)et.textContent=em?.title||"Intervento disponibile";if(ex)ex.textContent=em?.text||"Apri Marina Live per vedere richieste e priorità.";
 const vb=vhfButton();const txt=(vb?.textContent||"").trim();const jl=document.getElementById("mephJobLabel"),jb=document.getElementById("mephJob");if(jl)jl.textContent=txt||"INCARICO VHF";if(jb)jb.classList.toggle("ready",/RISCUOTI|PRENDI/.test(txt));
 const pt=document.getElementById("mephProgressTitle"),px=document.getElementById("mephProgressText");if(pt)pt.textContent=m?.title||"Continua il tuo impero";if(px)px.textContent=m?.label||"Obiettivi, diario e servizi rapidi";
 renderMore()
}

function boot(){
 syncActive();
 if(!ensure()){setTimeout(boot,500);return}
 render();
 const home=document.getElementById("home");
 if(home)new MutationObserver(function(){syncActive();setTimeout(render,30)}).observe(home,{attributes:true,attributeFilter:["class"]});
 window.addEventListener("marina-empire-updated",function(){setTimeout(render,80)});
 window.addEventListener("marina-world-event",function(){setTimeout(render,80)});
 window.addEventListener("resize",function(){setTimeout(render,60)});
 document.addEventListener("visibilitychange",function(){if(!document.hidden)render()});
 setInterval(render,15000)
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot()
})();