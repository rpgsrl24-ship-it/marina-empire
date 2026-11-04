(()=>{
"use strict";
if(window.__ME_PRESTIGE_RANKS__)return;
window.__ME_PRESTIGE_RANKS__=true;
const RANKS=[
{id:"silver",title:"AMMIRAGLIO D'ARGENTO",icon:"⚓",score:25000,voyages:75,reward:15000,prestige:250},
{id:"gold",title:"AMMIRAGLIO D'ORO",icon:"⭐",score:40000,voyages:100,reward:25000,prestige:400},
{id:"admiral",title:"GRANDE AMMIRAGLIO",icon:"🎖️",score:65000,voyages:140,reward:40000,prestige:650},
{id:"dynasty",title:"DINASTIA MARITTIMA",icon:"👑",score:100000,voyages:200,reward:70000,prestige:1000},
{id:"legend",title:"LEGGENDA DEL MEDITERRANEO",icon:"🌊",score:160000,voyages:300,reward:120000,prestige:1800}
];
const style=document.createElement("style");style.id="me-prestige-ranks-style";style.textContent=`
.me-prestige-ranks{margin:14px 0;padding:14px;border:1px solid rgba(214,181,117,.42);border-radius:15px;background:linear-gradient(135deg,#0b2837,#102f3d)}
.me-prestige-ranks h3{margin:0;color:#f2d49a}.me-prestige-ranks>p{margin:5px 0 10px;color:#aac0c8;font-size:10px}
.me-prestige-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}.me-prestige-card{padding:10px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:#09232f;min-width:0}
.me-prestige-card strong{display:block;color:#e8edf0;font-size:9px;line-height:1.25}.me-prestige-card p{margin:5px 0;font-size:8.5px;color:#9fb7c1}.me-prestige-card progress{width:100%;height:6px;accent-color:#d6b575}
.me-prestige-card button{width:100%;margin-top:6px;padding:7px;border-radius:8px;border:1px solid rgba(214,181,117,.45);background:#17465a;color:#fff;font-size:8.5px}.me-prestige-card.done{border-color:rgba(95,210,160,.35);background:#0b302f}.me-prestige-card.done strong{color:#bcebd7}
.me-prestige-card.next{border-color:rgba(214,181,117,.7);box-shadow:0 0 0 1px rgba(214,181,117,.12)}.me-prestige-summary{margin-top:10px;padding:8px 10px;border-radius:9px;background:#081f2a;font-size:9px;color:#b9ccd3}
@media(max-width:740px){.me-prestige-grid{display:flex;overflow-x:auto;gap:7px;padding-bottom:4px}.me-prestige-card{flex:0 0 170px}.me-prestige-ranks{padding:11px}}`;document.head.appendChild(style);
let box=null;
function score(){try{return typeof empireScore==="function"?Math.max(0,Math.floor(Number(empireScore())||0)):0}catch(_){return 0}}
function voyages(){try{return Math.max(0,Math.floor(Number(state?.voyages)||0))}catch(_){return 0}}
function claimed(){try{return new Set(Array.isArray(state?.prestigeRanksClaimed)?state.prestigeRanksClaimed:[])}catch(_){return new Set()}}
function ensure(){const host=document.getElementById("careerPanel")||document.getElementById("meProgressionHub");if(!host)return false;if(box&&box.isConnected)return true;box=document.createElement("section");box.className="me-prestige-ranks";box.id="mePrestigeRanks";host.appendChild(box);return true}
function claim(id){if(typeof state==="undefined"||!state)return;const rank=RANKS.find(r=>r.id===id);if(!rank)return;const c=claimed();if(c.has(id)||score()<rank.score||voyages()<rank.voyages)return;state.prestigeRanksClaimed=[...c,id];state.coins=Math.max(0,Number(state.coins)||0)+rank.reward;state.prestige=Math.max(0,Number(state.prestige)||0)+rank.prestige;state.publicTitle=rank.title;try{if(typeof persist==="function")persist();if(typeof render==="function")render();if(typeof tick==="function")tick()}catch(_){}window.dispatchEvent(new CustomEvent("marina-empire-updated"));setTimeout(draw,250)}
function draw(){if(!ensure()||typeof state==="undefined"||!state)return;const s=score(),v=voyages(),c=claimed(),next=RANKS.find(r=>!c.has(r.id))||null;box.innerHTML='<h3>🌊 PRESTIGIO DELL’IMPERO</h3><p>Dopo MARINA EMPIRE la carriera continua. Costruisci una dinastia nautica e conquista ranghi permanenti.</p><div class="me-prestige-grid">'+RANKS.map(r=>{const done=c.has(r.id),ready=s>=r.score&&v>=r.voyages,pct=Math.min(100,Math.round(Math.min(s/r.score,v/r.voyages)*100));return '<article class="me-prestige-card '+(done?'done':'')+' '+(next?.id===r.id?'next':'')+'"><strong>'+r.icon+' '+r.title+'</strong><p>Empire Score '+s.toLocaleString("it-IT")+' / '+r.score.toLocaleString("it-IT")+'<br>Viaggi '+v+' / '+r.voyages+'</p><progress max="100" value="'+pct+'"></progress><p>Premio '+r.reward.toLocaleString("it-IT")+' crediti · prestigio +'+r.prestige+'</p><button type="button" data-rank="'+r.id+'" '+(!ready||done?'disabled':'')+'>'+(done?'OTTENUTO':ready?'RISCATTA RANGO':'IN CORSO')+'</button></article>'}).join("")+'</div><div class="me-prestige-summary">'+(next?'Prossimo obiettivo: <b>'+next.title+'</b>.':'Hai raggiunto il rango massimo attuale. Nuovi ranghi arriveranno con le prossime espansioni.')+'</div>';box.querySelectorAll("[data-rank]").forEach(b=>b.addEventListener("click",()=>claim(b.dataset.rank)))}
function boot(){draw();window.addEventListener("marina-empire-updated",()=>setTimeout(draw,80));setInterval(draw,60000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();