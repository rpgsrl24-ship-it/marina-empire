(()=>{"use strict";if(window.__ME_MISSIONS_RENDER_V2__)return;window.__ME_MISSIONS_RENDER_V2__=true;
const st=document.createElement("style");st.id="me-missions-render-v2-style";st.textContent=`
@media(max-width:899px){
 #missions .mm3-tabs{display:none!important}
 #meMissionsCategoryBar{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;margin:0 0 9px}
 #meMissionsCategoryBar button{min-width:0;min-height:54px;padding:6px 3px;border:1px solid #416a7b;border-radius:11px;background:linear-gradient(145deg,#103d53,#082b3e);color:#d9e7eb;font-size:6.6px;font-weight:950;line-height:1.08}
 #meMissionsCategoryBar button b{display:block;margin-bottom:3px;font-size:16px}
 #meMissionsCategoryBar button.on{border-color:#8edcff;background:linear-gradient(180deg,#199bd2,#0f6ea8);color:#fff;box-shadow:0 0 0 1px #7dd7ff55,0 6px 16px #0005}
 #meMissionRepBanner{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:8px;align-items:center;margin:0 0 9px;padding:9px 10px;border:1px solid #d2ad66;border-radius:12px;background:linear-gradient(145deg,#123f54,#082d41)}
 #meMissionRepBanner .icon{font-size:21px}#meMissionRepBanner strong{display:block;color:#f3d28d;font-size:9px}#meMissionRepBanner small{display:block;margin-top:2px;color:#a5bdc5;font-size:7px}#meMissionRepBanner .lv{color:#79e7a6;font-size:8px;font-weight:950;text-align:right}
 #meMissionRepBanner .bar{height:6px;margin-top:5px;border-radius:99px;background:#173b49;overflow:hidden}#meMissionRepBanner .bar i{display:block;height:100%;background:linear-gradient(90deg,#58d5ff,#8ae7ff)}
 .mmrv2-pane{display:none!important}.mmrv2-pane.on{display:block!important}
 #mmrv2-standard>.panel{margin:0!important;padding:9px!important;border:1px solid rgba(219,177,96,.58)!important;border-radius:14px!important;background:linear-gradient(145deg,#103f56,#082a3e)!important}
 #mmrv2-standard>.panel>h2,#mmrv2-standard>.panel>p.muted{display:none!important}
 #mmrv2-contracts>#meLivingContracts,#mmrv2-chain>#meChainMission,#mmrv2-daily>#meDailyOps,#mmrv2-weekly>#meWeeklyGoals{display:block!important;margin:0!important}
 #meMissionDetailV2{display:none;position:fixed;inset:0;z-index:97000;background:#02121dcc;padding:10px;align-items:flex-end}
 #meMissionDetailV2.on{display:flex}
 .mmrv2-sheet{width:100%;max-height:88vh;overflow-y:auto;border:1px solid #d6ae62;border-radius:18px 18px 12px 12px;background:linear-gradient(180deg,#0d3a52,#061f31);box-shadow:0 -10px 40px #000b;color:#edf6f7}
 .mmrv2-sheet-hero{min-height:190px;padding:12px;display:flex;align-items:flex-end;background:linear-gradient(180deg,#0010,#001d),url("./anteprima/assets/render-2026/hero-yacht.jpg") center/cover;border-radius:18px 18px 0 0}
 .mmrv2-sheet-hero small{display:inline-block;padding:5px 7px;border:1px solid #ffd36c;border-radius:999px;background:#62430f;color:#ffe5a6;font-size:7px;font-weight:950}.mmrv2-sheet-hero strong{display:block;margin-top:6px;color:#fff;font:900 22px Georgia,serif}
 .mmrv2-sheet-body{padding:11px}.mmrv2-sheet-body p{font-size:8.5px;line-height:1.45;color:#c9d9de}.mmrv2-sheet-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:9px 0}.mmrv2-sheet-meta div{padding:9px 5px;border:1px solid #416b7d;border-radius:11px;background:#092f43;text-align:center}.mmrv2-sheet-meta span{display:block;color:#9db6bf;font-size:6.5px}.mmrv2-sheet-meta b{display:block;margin-top:3px;color:#f2d28f;font-size:10px}
 .mmrv2-sheet-actions{display:grid;gap:6px}.mmrv2-sheet-actions button{min-height:44px;border-radius:11px;font-size:8px;font-weight:950}.mmrv2-sheet-actions .go{border:1px solid #7ed8ff;background:linear-gradient(180deg,#149bd7,#0a6fb1);color:#fff}.mmrv2-sheet-actions .close{border:1px solid #507080;background:#0b3042;color:#dce9ec}
 #firstVoyageGuide{display:none!important}
}
`;document.head.appendChild(st);

function gs(){try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}}
function rep(){const s=gs(),id=String(s?.port||"rimini"),r=Math.max(0,Number(s?.portReputation?.[id])||0),lv=Math.max(1,Math.min(10,1+Math.floor(r/100)));return{r,lv,pct:lv>=10?100:r%100}}
function marina(){try{return typeof port==="function"?(port(gs()?.port)?.name||"Marina"):"Marina"}catch(_){return"Marina"}}
function ensure(){
 const m=document.getElementById("missions");if(!m||innerWidth>899)return null;
 let repb=document.getElementById("meMissionRepBanner");if(!repb){repb=document.createElement("section");repb.id="meMissionRepBanner";const top=document.getElementById("meMissionsPremiumTop");top?.insertAdjacentElement("afterend",repb)}
 let tabs=document.getElementById("meMissionsCategoryBar");if(!tabs){tabs=document.createElement("nav");tabs.id="meMissionsCategoryBar";tabs.innerHTML='<button class="on" data-mmrv2="all"><b>▦</b>TUTTE</button><button data-mmrv2="contracts"><b>🤝</b>CONTRATTI</button><button data-mmrv2="chain"><b>🔗</b>CATENE</button><button data-mmrv2="daily"><b>📅</b>GIORNALIERE</button><button data-mmrv2="weekly"><b>★</b>SETTIMANALI</button>';repb.insertAdjacentElement("afterend",tabs);tabs.addEventListener("click",e=>{const b=e.target.closest("[data-mmrv2]");if(b)setPane(b.dataset.mmrv2)})}
 let wrap=document.getElementById("mmrv2Wrap");if(!wrap){wrap=document.createElement("div");wrap.id="mmrv2Wrap";wrap.innerHTML='<section id="mmrv2-standard" class="mmrv2-pane on"></section><section id="mmrv2-contracts" class="mmrv2-pane"></section><section id="mmrv2-chain" class="mmrv2-pane"></section><section id="mmrv2-daily" class="mmrv2-pane"></section><section id="mmrv2-weekly" class="mmrv2-pane"></section>';tabs.insertAdjacentElement("afterend",wrap)}
 const standard=document.getElementById("mmrv2-standard");
 [...m.children].filter(x=>x.classList?.contains("panel")&&x.id!=="firstVoyageGuide").forEach(x=>{if(!x.closest("#mmrv2Wrap"))standard.appendChild(x)});
 const move=(id,pane)=>{const el=document.getElementById(id),host=document.getElementById(pane);if(el&&host&&el.parentNode!==host)host.appendChild(el)};
 move("meLivingContracts","mmrv2-contracts");move("meChainMission","mmrv2-chain");move("meDailyOps","mmrv2-daily");move("meWeeklyGoals","mmrv2-weekly");
 let modal=document.getElementById("meMissionDetailV2");if(!modal){modal=document.createElement("div");modal.id="meMissionDetailV2";modal.innerHTML='<div class="mmrv2-sheet"><div class="mmrv2-sheet-hero"><div><small>MISSIONE</small><strong id="mmrv2DetailTitle">Missione</strong></div></div><div class="mmrv2-sheet-body"><p id="mmrv2DetailText"></p><div class="mmrv2-sheet-meta"><div><span>PARTENZA</span><b id="mmrv2DetailPort">—</b></div><div><span>REPUTAZIONE</span><b id="mmrv2DetailRep">—</b></div><div><span>STATO</span><b id="mmrv2DetailState">—</b></div></div><div class="mmrv2-sheet-actions"><button class="go" type="button" id="mmrv2DetailGo">ACCETTA / AVVIA</button><button class="close" type="button" id="mmrv2DetailClose">CHIUDI</button></div></div></div>';document.body.appendChild(modal);modal.querySelector("#mmrv2DetailClose").onclick=()=>modal.classList.remove("on");modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("on")})}
 bindCards();drawRep();return m;
}
function setPane(name){
 const map={all:"mmrv2-standard",contracts:"mmrv2-contracts",chain:"mmrv2-chain",daily:"mmrv2-daily",weekly:"mmrv2-weekly"};
 document.querySelectorAll(".mmrv2-pane").forEach(x=>x.classList.toggle("on",x.id===map[name]));document.querySelectorAll("#meMissionsCategoryBar button").forEach(x=>x.classList.toggle("on",x.dataset.mmrv2===name));
}
function drawRep(){const b=document.getElementById("meMissionRepBanner");if(!b)return;const x=rep();b.innerHTML='<div class="icon">⚓</div><div><strong>Reputazione · '+marina()+'</strong><small>'+x.r+' punti reputazione</small><div class="bar"><i style="width:'+x.pct+'%"></i></div></div><div class="lv">LIV. '+x.lv+'</div>'}
let chosen=null;
function openDetail(card){
 const modal=document.getElementById("meMissionDetailV2");if(!modal)return;chosen=card;const title=(card.querySelector("b,strong")?.textContent||"Missione").trim();const ps=[...card.querySelectorAll("p")].map(p=>p.textContent.trim()).filter(Boolean);document.getElementById("mmrv2DetailTitle").textContent=title;document.getElementById("mmrv2DetailText").textContent=ps.join(" · ");document.getElementById("mmrv2DetailPort").textContent=marina();document.getElementById("mmrv2DetailRep").textContent="Liv. "+rep().lv;const btn=card.querySelector("button[data-mission],button");document.getElementById("mmrv2DetailState").textContent=btn?.disabled?"BLOCCATA":"DISPONIBILE";const go=document.getElementById("mmrv2DetailGo");go.disabled=!!btn?.disabled;go.textContent=btn?.disabled?"MISSIONE BLOCCATA":"ACCETTA / AVVIA";go.onclick=()=>{modal.classList.remove("on");btn?.click()};modal.classList.add("on");
}
function bindCards(){document.querySelectorAll("#missionList>.item").forEach(card=>{if(card.dataset.mmrv2Bound)return;card.dataset.mmrv2Bound="1";card.style.cursor="pointer";card.addEventListener("click",e=>{if(e.target.closest("button,input,select,a"))return;openDetail(card)})})}
function sync(){if(innerWidth>899)return;const m=document.getElementById("missions");if(!m||m.classList.contains("hide"))return;ensure();drawRep();bindCards()}
function boot(){ensure();sync();const m=document.getElementById("missions");if(m)new MutationObserver(()=>setTimeout(sync,40)).observe(m,{attributes:true,childList:true,subtree:true,attributeFilter:["class"]});addEventListener("marina-empire-updated",()=>setTimeout(sync,60));addEventListener("resize",sync)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,120),{once:true}):setTimeout(boot,120);})();