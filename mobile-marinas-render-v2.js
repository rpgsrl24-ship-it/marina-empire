(()=>{"use strict";if(window.__ME_MARINAS_RENDER_V2__)return;window.__ME_MARINAS_RENDER_V2__=true;
let mode="directory",filter="all",query="";
const css=document.createElement("style");css.id="me-marinas-render-v2-style";css.textContent=`
@media(max-width:899px){
 #meMobileMarinaLivePremium>.ml3-topbar{order:0}
 #meMarinasRenderSwitch{order:1;display:grid;grid-template-columns:1fr 1fr;gap:6px}
 #meMarinasRenderSwitch button{min-height:44px;border:1px solid #416b7d;border-radius:11px;background:#0a3042;color:#d8e6ea;font-size:7.5px;font-weight:950}
 #meMarinasRenderSwitch button.on{border-color:#8edcff;background:linear-gradient(180deg,#199bd2,#0f6ea8);color:#fff}
 #meMarinasDirectory{order:2;display:none;flex-direction:column;gap:8px}
 #meMarinasDirectory.on{display:flex}
 #meMobileMarinaLivePremium.me-mrv2-directory>.ml3-hud,
 #meMobileMarinaLivePremium.me-mrv2-directory>.ml3-titlebar,
 #meMobileMarinaLivePremium.me-mrv2-directory>.ml3-hero,
 #meMobileMarinaLivePremium.me-mrv2-directory>.ml3-traffic,
 #meMobileMarinaLivePremium.me-mrv2-directory>.ml3-kpis,
 #meMobileMarinaLivePremium.me-mrv2-directory>.ml3-two,
 #meMobileMarinaLivePremium.me-mrv2-directory>.ml3-actions,
 #meMobileMarinaLivePremium.me-mrv2-directory>.ml3-event{display:none!important}
 .mrv2-title h2{margin:0;color:#fff5d9;font:900 27px/1 Georgia,serif}.mrv2-title h2 span{color:#e7bf71;font:800 12px system-ui}.mrv2-title p{margin:5px 0 0;color:#d8e6e9;font-size:8.5px}
 .mrv2-hero{height:190px;border:1px solid #e1b665;border-radius:16px;background:linear-gradient(180deg,#0001,#001b),url("./anteprima/assets/render-2026/marine.jpg") center/cover;display:flex;align-items:flex-end;padding:12px;box-shadow:0 12px 30px #0008}.mrv2-hero small{display:block;color:#f1d590;font-size:7px;font-weight:900}.mrv2-hero strong{display:block;color:#fff;font:800 20px Georgia,serif}.mrv2-hero span{display:block;margin-top:4px;color:#dce8eb;font-size:8px}
 .mrv2-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.mrv2-tabs button{min-height:46px;padding:5px 3px;border:1px solid #416a7b;border-radius:11px;background:#0a3042;color:#d8e6ea;font-size:6.7px;font-weight:950}.mrv2-tabs button b{display:block;margin-bottom:3px;font-size:15px}.mrv2-tabs button.on{border-color:#8edcff;background:linear-gradient(180deg,#199bd2,#0f6ea8);color:#fff}
 .mrv2-search{display:grid;grid-template-columns:1fr auto;gap:6px}.mrv2-search input{min-width:0;min-height:42px;padding:8px 10px;border:1px solid #5b7d8c;border-radius:10px;background:#092c3f;color:#fff;font-size:16px}.mrv2-search button{min-width:46px;border:1px solid #5b7d8c;border-radius:10px;background:#0a3042;color:#fff}
 .mrv2-list{display:grid;gap:8px}.mrv2-card{display:grid;grid-template-columns:36% minmax(0,1fr);min-height:120px;overflow:hidden;border:1px solid #5a8798;border-radius:14px;background:#dcecf5;color:#071b2b;box-shadow:0 8px 20px #0005;cursor:pointer}.mrv2-card.current{border:2px solid #e2b84f;box-shadow:0 0 0 2px #e2b84f33,0 8px 20px #0005}.mrv2-photo{position:relative;background:linear-gradient(180deg,#0000,#0015),url("./anteprima/assets/render-2026/marine.jpg") center/cover}.mrv2-card:nth-child(2n) .mrv2-photo{background-image:linear-gradient(180deg,#0000,#0015),url("./anteprima/assets/render-2026/charter.jpg")}.mrv2-card:nth-child(3n) .mrv2-photo{background-image:linear-gradient(180deg,#0000,#0015),url("./anteprima/assets/render-2026/flotta.jpg")}
 .mrv2-card .flag{position:absolute;left:7px;top:7px;padding:4px 6px;border-radius:999px;background:#0b593a;color:#dffff0;font-size:6.2px;font-weight:950}.mrv2-card .flag.other{background:#173f55;color:#bde8f3}
 .mrv2-body{padding:9px;min-width:0}.mrv2-body strong{display:block;color:#071b2b;font:900 14px Georgia,serif}.mrv2-body small{display:block;margin-top:3px;color:#405a68;font-size:7px}.mrv2-berths{display:grid;grid-template-columns:1fr auto;gap:6px;align-items:center;margin-top:7px}.mrv2-berths span{font-size:7.2px;font-weight:900}.mrv2-bar{height:8px;border-radius:99px;background:#9fb9c5;overflow:hidden}.mrv2-bar i{display:block;height:100%;background:linear-gradient(90deg,#51d36f,#9eea61)}.mrv2-meta{display:flex;justify-content:space-between;gap:6px;margin-top:5px;font-size:6.5px;color:#4f6875}.mrv2-meta b{color:#a26b0d}
 .mrv2-empty{padding:13px;border:1px solid #416b7d;border-radius:11px;background:#0a3042;color:#c6d8dd;font-size:8px}
 #meMobileMarinaLivePremium.me-mrv2-live #meMarinasDirectory{display:none!important}
 #meMobileMarinaLivePremium.me-mrv2-live>.ml3-hud,#meMobileMarinaLivePremium.me-mrv2-live>.ml3-titlebar,#meMobileMarinaLivePremium.me-mrv2-live>.ml3-hero,#meMobileMarinaLivePremium.me-mrv2-live>.ml3-traffic,#meMobileMarinaLivePremium.me-mrv2-live>.ml3-kpis,#meMobileMarinaLivePremium.me-mrv2-live>.ml3-two,#meMobileMarinaLivePremium.me-mrv2-live>.ml3-actions,#meMobileMarinaLivePremium.me-mrv2-live>.ml3-event{display:grid}
 #meMobileMarinaLivePremium.me-mrv2-live>.ml3-hero,#meMobileMarinaLivePremium.me-mrv2-live>.ml3-event{display:block}
 .ml3-live-tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.ml3-live-tabs button{min-height:43px;padding:5px 2px;border:1px solid #416b7d;border-radius:10px;background:#0a3042;color:#d9e7eb;font-size:6.2px;font-weight:950}.ml3-live-tabs button.on{border-color:#8edcff;background:linear-gradient(180deg,#199bd2,#0f6ea8);color:#fff}
}`;document.head.appendChild(css);
function s(){try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}}
function portsList(){try{return typeof ports!=="undefined"&&Array.isArray(ports)?ports:[]}catch(_){return[]}}
function pName(id){try{return typeof port==="function"?(port(id)?.name||id):id}catch(_){return id||"Marina"}}
function stats(id){
 try{if(typeof marinaBerthSummary==="function"){const x=marinaBerthSummary(id)||{};const built=Math.max(1,Number(x.built)||1),occ=Math.max(0,Math.min(built,Number(x.occupied)||0));return{built,occ,free:built-occ,pct:Math.round(occ/built*100)}}}catch(_){}
 return{built:0,occ:0,free:0,pct:0};
}
function owned(id){try{return !!s()?.marinas?.[id]}catch(_){return false}}
function ensure(){
 if(innerWidth>899)return null;const host=document.getElementById("meMobileMarinaLivePremium");if(!host)return null;
 let sw=document.getElementById("meMarinasRenderSwitch");if(!sw){sw=document.createElement("nav");sw.id="meMarinasRenderSwitch";sw.innerHTML='<button data-mrv2-mode="directory">⚓ MARINE & DARSENE</button><button data-mrv2-mode="live">📡 MARINA LIVE</button>';host.insertBefore(sw,host.children[1]||null);sw.addEventListener("click",e=>{const b=e.target.closest("[data-mrv2-mode]");if(b){mode=b.dataset.mrv2Mode;draw()}})}
 let dir=document.getElementById("meMarinasDirectory");if(!dir){dir=document.createElement("section");dir.id="meMarinasDirectory";dir.innerHTML='<div class="mrv2-title"><h2>MARINE <span>& DARSENE</span></h2><p>Scopri, gestisci e investi nelle marine del gioco.</p></div><div class="mrv2-hero"><div><small>RETE PORTUALE · MARINA EMPIRE</small><strong>Il Mediterraneo è la tua mappa</strong><span>Esplora porti, servizi e opportunità dalla posizione reale della tua flotta.</span></div></div><div class="mrv2-tabs"><button class="on" data-mrv2-filter="all"><b>🏙️</b>TUTTE</button><button data-mrv2-filter="mine"><b>⭐</b>LE MIE</button><button data-mrv2-filter="invest"><b>🪙</b>INVESTI</button><button data-mrv2-filter="services"><b>🔧</b>SERVIZI</button></div><div class="mrv2-search"><input id="mrv2Search" placeholder="Cerca marina o città…" aria-label="Cerca marina"><button type="button">⌕</button></div><div id="mrv2List" class="mrv2-list"></div>';host.insertBefore(dir,sw.nextSibling);dir.addEventListener("click",e=>{const f=e.target.closest("[data-mrv2-filter]");if(f){filter=f.dataset.mrv2Filter;dir.querySelectorAll("[data-mrv2-filter]").forEach(x=>x.classList.toggle("on",x===f));renderList()}const c=e.target.closest("[data-mrv2-port]");if(c){const id=c.dataset.mrv2Port;if(id===String(s()?.port||"")){mode="live";draw()}else{const sel=document.getElementById("me-online-marina");if(sel){sel.value=id;sel.dispatchEvent(new Event("change",{bubbles:true}))}try{if(typeof showTab==="function")showTab("map")}catch(_){}}}});dir.querySelector("#mrv2Search").addEventListener("input",e=>{query=e.target.value||"";renderList()})}
 let liveTabs=document.getElementById("ml3LiveTabs");if(!liveTabs){liveTabs=document.createElement("nav");liveTabs.id="ml3LiveTabs";liveTabs.className="ml3-live-tabs";liveTabs.innerHTML='<button class="on">ℹ PANORAMICA</button><button>⚓ ORMEGGI</button><button>🔧 SERVIZI</button><button>📈 ECONOMIA</button><button>📅 EVENTI</button>';const hero=host.querySelector(".ml3-hero");if(hero)hero.insertAdjacentElement("afterend",liveTabs);liveTabs.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;liveTabs.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));const i=[...liveTabs.children].indexOf(b);if(i===1)host.querySelector(".ml3-actions")?.scrollIntoView({behavior:"smooth",block:"center"});if(i===2)host.querySelector(".ml3-actions")?.scrollIntoView({behavior:"smooth",block:"center"});if(i===3){try{showTab("office")}catch(_){}}if(i===4)host.querySelector(".ml3-event")?.scrollIntoView({behavior:"smooth",block:"center"})})}
 return host;
}
function renderList(){
 const list=document.getElementById("mrv2List");if(!list)return;const cur=String(s()?.port||"rimini"),q=query.trim().toLowerCase();
 let arr=portsList().filter(p=>p.id!=="rose"||true);
 if(filter==="mine")arr=arr.filter(p=>owned(p.id)||p.id===cur);
 if(filter==="invest")arr=arr.filter(p=>p.id!=="rose"&&!owned(p.id));
 if(filter==="services")arr=arr.filter(p=>p.id===cur||owned(p.id));
 if(q)arr=arr.filter(p=>String(p.name||"").toLowerCase().includes(q)||String(p.id||"").toLowerCase().includes(q));
 list.innerHTML=arr.length?arr.map((p,i)=>{const x=stats(p.id),has=x.built>0,pct=has?x.pct:0,current=p.id===cur;return '<article class="mrv2-card '+(current?"current":"")+'" data-mrv2-port="'+p.id+'"><div class="mrv2-photo"><span class="flag '+(current?"":"other")+'">'+(current?"● POSIZIONE ATTUALE":owned(p.id)?"★ TUA MARINA":"ESPLORA")+'</span></div><div class="mrv2-body"><strong>'+String(p.name||p.id)+'</strong><small>⚓ Marina Empire · rete italiana</small><div class="mrv2-berths"><div class="mrv2-bar"><i style="width:'+pct+'%"></i></div><span>'+(has?pct+"%":"—")+'</span></div><div class="mrv2-meta"><span>'+(has?x.occ+"/"+x.built+" posti occupati":"Dati ormeggi non disponibili")+'</span><b>'+(current?"MARINA LIVE ›":"MAPPA ›")+'</b></div></div></article>'}).join(""):'<div class="mrv2-empty">Nessuna marina corrisponde al filtro selezionato.</div>';
}
function draw(){
 const host=ensure();if(!host)return;host.classList.toggle("me-mrv2-directory",mode==="directory");host.classList.toggle("me-mrv2-live",mode==="live");const sw=document.getElementById("meMarinasRenderSwitch");sw?.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.mrv2Mode===mode));if(mode==="directory")renderList();
}
function boot(){setTimeout(draw,180);const sec=document.getElementById("marinas");if(sec)new MutationObserver(()=>setTimeout(draw,70)).observe(sec,{attributes:true,attributeFilter:["class"]});addEventListener("marina-empire-updated",()=>setTimeout(draw,80));addEventListener("resize",draw);setInterval(()=>{if(document.body.classList.contains("me-ml3-active"))draw()},3000)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();})();