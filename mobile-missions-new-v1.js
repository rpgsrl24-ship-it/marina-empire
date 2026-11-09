(()=>{"use strict";
if(window.__ME_MOBILE_MISSIONS_NEW_V1__)return;
window.__ME_MOBILE_MISSIONS_NEW_V1__=true;

const st=document.createElement("style");
st.id="me-mobile-missions-new-v1-style";
st.textContent=`
@media(max-width:899px){
 body.me-new-missions-active{background:#eaf6fb!important;color:#0a2940!important;overflow:hidden!important}
 body.me-new-missions-active .top,
 body.me-new-missions-active .stats,
 body.me-new-missions-active #navigation,
 body.me-new-missions-active #meCompactHud,
 body.me-new-missions-active #meMobileSheetBar,
 body.me-new-missions-active .mobile-game-nav,
 body.me-new-missions-active #meMobileMore{display:none!important}
 #missions.me-new-missions-host{position:fixed!important;inset:0!important;z-index:98000!important;overflow:hidden!important;padding:0!important;margin:0!important;background:#eaf6fb!important}
 #missions.me-new-missions-host.hide{display:none!important}
 #missions.me-new-missions-host:not(.hide){display:block!important}
 #missions.me-new-missions-host>*:not(#meNewMissions){position:absolute!important;left:-10000px!important;top:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important}
 #meNewMissions{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;padding:0 8px 92px;background:linear-gradient(180deg,#0b9fe1 0,#65d2f0 19%,#dff6fd 19%,#f8fcfe 100%);font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#082a4a}
 .mn-head{margin:0 -8px;padding:9px 10px 15px;background:linear-gradient(180deg,#007fc4cc,#149bd5cc),url("./anteprima/assets/render-2026/marine.jpg") center/cover;color:#fff;box-shadow:0 5px 20px #0b5f8b44}
 .mn-top{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:8px}.mn-menu{width:45px;height:45px;border:2px solid #bcecff;border-radius:50%;display:grid;place-items:center;background:#096b9fdd;color:#fff;font-size:23px}.mn-brand{text-align:center}.mn-brand b{font:800 22px Georgia,serif;letter-spacing:.04em}.mn-brand small{display:block;margin-top:2px;font-size:6.5px;font-weight:900;letter-spacing:.13em}.mn-avatar{width:45px;height:45px;border:2px solid #fff;border-radius:50%;display:grid;place-items:center;background:#075d8b;font-size:22px}
 .mn-hud{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:9px}.mn-hud div{padding:7px 4px;border:1px solid #8ee1ff;border-radius:13px;background:#075b8fdd;text-align:center;color:#fff;box-shadow:inset 0 1px #ffffff33}.mn-hud span{display:block;font-size:6.3px;font-weight:900}.mn-hud b{display:block;margin-top:3px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mn-title{display:flex;align-items:center;gap:11px;margin-top:12px}.mn-title i{font-style:normal;font-size:38px}.mn-title h1{margin:0;font-size:31px;line-height:1}.mn-title p{margin:5px 0 0;font-size:9px;line-height:1.3}
 .mn-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}.mn-tabs button{position:relative;min-height:52px;border:1px solid #a8d4e8;border-radius:15px;background:#fff;color:#0c4772;font-size:9px;font-weight:950;box-shadow:0 4px 12px #0d487018}.mn-tabs button.on{border-color:#ffda67;background:linear-gradient(180deg,#ffdb66,#e5a61d);color:#15314a;box-shadow:0 0 14px #ffc83d77}.mn-tabs em{position:absolute;right:7px;top:-7px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#e92e2e;color:#fff;font-style:normal;font-size:10px;display:grid;place-items:center}
 .mn-list{display:grid;gap:9px;margin-top:11px}.mn-card{display:grid;grid-template-columns:105px minmax(0,1fr);gap:10px;min-height:145px;padding:8px;border:1px solid #add7e8;border-radius:18px;background:#fff;box-shadow:0 5px 16px #0d48701f;overflow:hidden}.mn-photo{position:relative;overflow:hidden;border-radius:14px;background:#d9edf5}.mn-photo img{width:100%;height:100%;object-fit:cover}.mn-state{position:absolute;left:6px;top:6px;padding:4px 6px;border-radius:999px;background:#0b85c8;color:#fff;font-size:6px;font-weight:950}.mn-state.lock{background:#d79c27}.mn-state.active{background:#26a85b}.mn-copy{min-width:0;padding:3px 3px 2px}.mn-copy h3{margin:0;color:#082a4a;font-size:15px;line-height:1.08}.mn-desc{margin:5px 0;color:#4b6878;font-size:8px;line-height:1.3}.mn-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}.mn-tag{padding:4px 6px;border-radius:999px;background:#e8f4f9;color:#0c5d8e;font-size:6.4px;font-weight:950}.mn-tag.gold{background:#fff1bd;color:#8a6200}.mn-reward{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;color:#0c3193;font-size:8px;font-weight:950}.mn-action{display:grid;grid-template-columns:1fr auto;gap:7px;align-items:center;margin-top:8px}.mn-action small{color:#607c8b;font-size:6.5px}.mn-action button{min-height:36px;padding:6px 12px;border:1px solid #ffcb3d;border-radius:999px;background:linear-gradient(180deg,#ffd85c,#e79d16);color:#14304a;font-size:8px;font-weight:950;box-shadow:0 3px 9px #a66d002b}.mn-action button:disabled{border-color:#c8dce5;background:#eaf1f5;color:#8aa0aa;box-shadow:none}
 .mn-empty{margin-top:12px;padding:20px;border:1px solid #acd5e6;border-radius:16px;background:#fff;text-align:center;color:#45677a}.mn-empty b{display:block;color:#0a4770;font-size:16px}.mn-empty span{display:block;margin-top:5px;font-size:9px}
 .mn-status{display:grid;grid-template-columns:1.2fr .8fr .8fr auto;gap:6px;align-items:center;margin-top:11px;padding:10px;border:1px solid #add7e8;border-radius:16px;background:#fff;box-shadow:0 4px 14px #0d487018}.mn-status div{min-width:0}.mn-status span{display:block;color:#607a88;font-size:6px;font-weight:900}.mn-status b{display:block;margin-top:3px;color:#087a3c;font-size:11px}.mn-status strong{font-size:10px;color:#0b3454}.mn-status button{min-height:38px;padding:6px 10px;border:1px solid #71cff3;border-radius:10px;background:linear-gradient(180deg,#159df3,#0869da);color:#fff;font-size:7px;font-weight:950}
 .mn-bottom{position:fixed;z-index:98500;left:6px;right:6px;bottom:6px;max-width:608px;margin:auto;display:grid;grid-template-columns:repeat(5,1fr);gap:3px;padding:5px;border:1px solid #58c1eb;border-radius:18px;background:#f8fcfef5;box-shadow:0 8px 26px #00395855;backdrop-filter:blur(12px)}.mn-bottom button{min-width:0;min-height:58px;border:0;border-radius:12px;background:transparent;color:#0a456f;font-size:6px;font-weight:950}.mn-bottom button b{display:block;margin-bottom:3px;font-size:20px}.mn-bottom button.on{background:linear-gradient(180deg,#ffd85c,#e79d16);color:#16334e;box-shadow:0 3px 10px #b77c2440}
 @media(max-width:390px){.mn-card{grid-template-columns:94px minmax(0,1fr)}.mn-title h1{font-size:28px}.mn-hud b{font-size:11px}}
}
@media(min-width:900px){#meNewMissions{display:none!important}}
`;
document.head.appendChild(st);

function mobile(){return innerWidth<=899}
function gs(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function fmt(n){return Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT")}
function oldCards(){return [...document.querySelectorAll("#missionList>.item")]}
function cardData(card,i){
 const btn=card.querySelector("button[data-mission]");
 const title=(card.querySelector("b,strong")?.textContent||"Missione").trim();
 const ps=[...card.querySelectorAll("p")].map(x=>x.textContent.trim()).filter(Boolean);
 const id=btn?.dataset.mission||"";
 const locked=!!btn?.disabled;
 const text=(card.textContent||"").toUpperCase();
 const active=/IN CORSO|VIAGGIO IN CORSO/.test(text);
 const imgs=["./anteprima/assets/render-2026/marine.jpg","./anteprima/assets/render-2026/charter.jpg","./anteprima/assets/render-2026/flotta.jpg","./anteprima/assets/render-2026/hero-yacht.jpg"];
 return {card,btn,id,title,desc:ps[0]||"Missione nautica disponibile.",reward:ps[1]||"",locked,active,img:imgs[i%imgs.length]};
}
function ensure(){
 if(!mobile())return null;
 const host=document.getElementById("missions");if(!host)return null;
 host.classList.add("me-new-missions-host");
 let root=document.getElementById("meNewMissions");
 if(!root){root=document.createElement("section");root.id="meNewMissions";host.appendChild(root)}
 return {host,root};
}
let tab="available";
function nav(id){try{if(typeof showTab==="function")showTab(id)}catch(_){}}
function render(){
 if(!mobile())return;
 const ui=ensure();if(!ui)return;
 const s=gs()||{},cards=oldCards().map(cardData),trip=s.trip||null;
 const completed=Array.isArray(s.completed)?s.completed:[];
 const fuel=Math.max(0,Number(s.fuel)||0),tank=Math.max(1,Number((typeof boat==="function"&&boat(s.boat)?.tank)||300));
 const fuelPct=Math.max(0,Math.min(100,Math.round(fuel/tank*100))),cond=Math.max(0,Math.min(100,Math.round(Number(s.condition??100))));
 const activeCount=trip?1:0;
 const available=cards.filter(x=>!x.active);
 let content="";
 if(tab==="available"){
   content=available.map((x,i)=>`<article class="mn-card"><div class="mn-photo"><img src="${x.img}" alt=""><span class="mn-state ${x.locked?"lock":""}">${x.locked?"DA SBLOCCARE":"DISPONIBILE"}</span></div><div class="mn-copy"><h3>${x.title}</h3><div class="mn-tags"><span class="mn-tag">⚓ MISSIONE</span><span class="mn-tag gold">${x.locked?"REQUISITI":"PRONTA"}</span></div><p class="mn-desc">${x.desc}</p><div class="mn-reward"><span>🪙 ${x.reward||"Ricompensa variabile"}</span></div><div class="mn-action"><small>${x.locked?"Controlla yacht, carburante e crediti":"Pronta alla partenza"}</small><button type="button" data-new-mission="${x.id}" ${x.locked?"disabled":""}>${x.locked?"BLOCCATA":"ACCETTA"}</button></div></div></article>`).join("");
 }else if(tab==="active"){
   content=trip?`<article class="mn-card"><div class="mn-photo"><img src="./anteprima/assets/render-2026/hero-yacht.jpg" alt=""><span class="mn-state active">IN CORSO</span></div><div class="mn-copy"><h3>${trip.mission?.name||"Missione in navigazione"}</h3><p class="mn-desc">La tua imbarcazione è attualmente impegnata nella missione.</p><div class="mn-reward"><span>🧭 Rotta attiva</span></div><div class="mn-action"><small>Segui navigazione e arrivo</small><button type="button" data-new-go="map">APRI MAPPA</button></div></div></article>`:'<div class="mn-empty"><b>Nessuna missione attiva</b><span>Scegli una missione disponibile per iniziare.</span></div>';
 }else{
   content=completed.length?completed.slice(-8).reverse().map((id,i)=>`<article class="mn-card"><div class="mn-photo"><img src="./anteprima/assets/render-2026/marine.jpg" alt=""><span class="mn-state active">COMPLETATA</span></div><div class="mn-copy"><h3>Missione completata</h3><p class="mn-desc">Codice missione: ${String(id).replace(/[<>]/g,"")}</p><div class="mn-reward"><span>✓ Ricompensa accreditata</span></div></div></article>`).join(""):'<div class="mn-empty"><b>Nessuna missione completata</b><span>Le missioni concluse appariranno qui.</span></div>';
 }
 ui.root.innerHTML=`<header class="mn-head"><div class="mn-top"><button class="mn-menu" type="button" data-new-go="home">☰</button><div class="mn-brand"><b>⚓ MARINA EMPIRE</b><small>IL GESTIONALE NAUTICO ONLINE</small></div><div class="mn-avatar">👨‍✈️</div></div><div class="mn-hud"><div><span>🪙 MONETE</span><b>${fmt(s.coins||0)}</b></div><div><span>⭐ PRESTIGIO</span><b>${fmt(s.prestige||0)}</b></div><div><span>⛽ CARBURANTE</span><b>${fuelPct}%</b></div><div><span>🔧 STATO</span><b>${cond}%</b></div></div><div class="mn-title"><i>📋</i><div><h1>Missioni</h1><p>Completa incarichi in mare e nel porto per ottenere crediti, prestigio e nuove opportunità.</p></div></div></header><nav class="mn-tabs"><button class="${tab==="available"?"on":""}" data-new-tab="available">🎯 Disponibili<em>${available.length}</em></button><button class="${tab==="active"?"on":""}" data-new-tab="active">⚓ Attive${activeCount?'<em>'+activeCount+'</em>':""}</button><button class="${tab==="completed"?"on":""}" data-new-tab="completed">✓ Completate</button></nav><section class="mn-list">${content}</section><section class="mn-status"><div><strong>🛥 Stato operativo</strong></div><div><span>CARBURANTE</span><b>${fuelPct}%</b></div><div><span>STATO BARCA</span><b>${cond}%</b></div><button type="button" data-new-go="map">APRI MAPPA</button></section><nav class="mn-bottom"><button type="button" data-new-go="home"><b>⌂</b>HOME</button><button type="button" data-new-market><b>🛒</b>MARKET</button><button type="button" class="on"><b>📋</b>MISSIONI</button><button type="button" data-new-go="fleet"><b>🛥️</b>FLOTTA</button><button type="button" data-new-go="marinas"><b>⚓</b>MARINA</button></nav>`;
 ui.root.querySelectorAll("[data-new-tab]").forEach(b=>b.onclick=()=>{tab=b.dataset.newTab;render()});
 ui.root.querySelectorAll("[data-new-go]").forEach(b=>b.onclick=()=>nav(b.dataset.newGo));
 ui.root.querySelector("[data-new-market]")?.addEventListener("click",()=>location.assign("./marketplace-mobile.html?v=20261109-market12"));
 ui.root.querySelectorAll("[data-new-mission]").forEach(b=>b.onclick=()=>{
   const src=document.querySelector('#missionList [data-mission="'+CSS.escape(b.dataset.newMission)+'"]');
   if(src&&!src.disabled)src.click();
 });
}
function sync(){
 const host=document.getElementById("missions"),on=mobile()&&host&&!host.classList.contains("hide");
 document.body.classList.toggle("me-new-missions-active",!!on);
 if(on)requestAnimationFrame(render);
}
function boot(){
 if(!mobile())return;
 ensure();sync();
 const host=document.getElementById("missions");
 if(host)new MutationObserver(()=>setTimeout(sync,30)).observe(host,{attributes:true,attributeFilter:["class","style"]});
 const list=document.getElementById("missionList");
 if(list)new MutationObserver(()=>setTimeout(()=>{if(document.body.classList.contains("me-new-missions-active"))render()},40)).observe(list,{childList:true,subtree:true,attributes:true});
 addEventListener("marina-empire-updated",()=>setTimeout(sync,60));
 addEventListener("resize",sync);
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,80),{once:true}):setTimeout(boot,80);
})();