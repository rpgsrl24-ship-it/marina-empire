(()=>{"use strict";
if(window.__ME_LIVING_WORLD_V2__)return;window.__ME_LIVING_WORLD_V2__=true;

const CONTRACTS=[
 {id:"vip_transfer",icon:"✨",name:"Transfer ospiti VIP",min:2,cost:180,reward:900,prestige:12,target:"marinas",text:"Coordina tender, transfer e assistenza ospiti."},
 {id:"fuel_support",icon:"⛽",name:"Supporto Fuel Dock",min:3,cost:240,reward:1250,prestige:15,target:"marinas",text:"Gestisci una finestra di rifornimenti ad alta intensità."},
 {id:"water_toys",icon:"🌊",name:"Water Toys Concierge",min:4,cost:320,reward:1750,prestige:22,target:"weekend-water-toys",text:"Prepara SUP, e-foil e toys per un charter premium."},
 {id:"tech_call",icon:"🔧",name:"Assistenza tecnica rapida",min:5,cost:420,reward:2400,prestige:28,target:"office",text:"Coordina diagnosi e intervento tecnico in marina."},
 {id:"regatta",icon:"⛵",name:"Supporto equipaggio regata",min:4,cost:300,reward:1900,prestige:24,target:"marinas",text:"Rifornisci equipaggio e supporto logistico pre-regata."},
 {id:"provisioning",icon:"📦",name:"Provisioning charter",min:3,cost:260,reward:1450,prestige:18,target:"missions",text:"Completa cambusa e preparazione yacht prima della partenza."},
 {id:"berth_ops",icon:"⚓",name:"Operazione ormeggi",min:2,cost:140,reward:800,prestige:10,target:"marinas",text:"Gestisci arrivi ravvicinati e assegnazione banchine."},
 {id:"broker_view",icon:"💼",name:"Sea Trial Broker",min:6,cost:550,reward:3100,prestige:35,target:"marketplace",text:"Prepara yacht e documentazione per un sea trial commerciale."}
];
const VESSELS=["Aurora","Blue Wave","Marea","Riva 56","Solemar","Adriatica","Liberty","Azzurra","Sea Star","Dolce Vita","RPG One","Oceanis","Luna Blu","Maestrale"];
const MOVES=["IN ARRIVO","IN PARTENZA","ORMEGGIO","FUEL DOCK","ASSISTENZA","CHARTER READY"];

const style=document.createElement("style");
style.id="me-living-world-v2-style";
style.textContent=`
.me-lw-box{margin:9px 0;padding:10px;border:1px solid rgba(224,183,99,.58);border-radius:13px;background:linear-gradient(145deg,#0e4055,#082738);box-shadow:0 8px 22px #0004;color:#edf6f6}
.me-lw-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.me-lw-head small{display:block;color:#91b1bb;font-size:7px;font-weight:950;letter-spacing:.12em}.me-lw-head strong{display:block;margin-top:2px;color:#f3d391;font:800 14px Georgia,serif}.me-lw-timer{flex:0 0 auto;color:#87e9ab;font-size:8px;font-weight:950}
.me-lw-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:8px}.me-lw-card{padding:9px;border:1px solid #3d6a79;border-radius:11px;background:#092f42}.me-lw-card b{display:block;color:#f1d28e;font-size:10px}.me-lw-card p{min-height:31px;margin:4px 0;color:#bcd0d6;font-size:7.5px;line-height:1.3}.me-lw-meta{display:flex;justify-content:space-between;gap:4px;color:#74dfa2;font-size:7px;font-weight:900}.me-lw-card button{width:100%;min-height:36px;margin-top:6px;padding:6px;border:1px solid #d8b365;border-radius:9px;background:#123b4e;color:#f7dca4;font-size:7.5px;font-weight:950}.me-lw-card button.gold{background:linear-gradient(180deg,#e5c374,#b98232);color:#082333}
.me-lw-active{margin-top:8px;padding:9px;border:1px solid #67cda1;border-radius:11px;background:#0b3c3c}.me-lw-active strong{color:#dffff0}.me-lw-progress{height:6px;margin-top:7px;border-radius:99px;overflow:hidden;background:#173844}.me-lw-progress i{display:block;height:100%;background:linear-gradient(90deg,#65dba4,#e4c56f)}
.me-lw-traffic{overflow:hidden;margin:8px 0;border:1px solid #4a95ae;border-radius:10px;background:#082e43}.me-lw-track{display:flex;width:max-content;gap:26px;padding:8px 12px;white-space:nowrap;color:#eaf7f8;font-size:8px;font-weight:900;animation:meLwTicker 26s linear infinite}.me-lw-track b{color:#72e6a1}.me-lw-track .out{color:#ffd46e}.me-lw-track .svc{color:#78d9ff}@keyframes meLwTicker{to{transform:translateX(-50%)}}
.me-lw-career{margin:9px 0;padding:10px;border:1px solid rgba(224,183,99,.58);border-radius:13px;background:linear-gradient(145deg,#123f53,#082738)}.me-lw-career-top{display:flex;justify-content:space-between;gap:8px}.me-lw-career strong{color:#f2d390;font:800 14px Georgia,serif}.me-lw-career span{color:#d9e8eb;font-size:8px;font-weight:900}.me-lw-bar{height:7px;margin:8px 0 5px;border-radius:99px;overflow:hidden;background:#173a48}.me-lw-bar i{display:block;height:100%;background:linear-gradient(90deg,#e7bf69,#fff0a8)}.me-lw-career p{margin:3px 0;color:#a9c1c8;font-size:7.5px}.me-lw-reward{width:100%;min-height:36px;margin-top:7px;border:1px solid #e2bd6c;border-radius:9px;background:#153f51;color:#f5d99c;font-size:8px;font-weight:950}
@media(max-width:899px){.me-lw-grid{grid-template-columns:1fr}.me-lw-card p{min-height:0}.me-lw-box,.me-lw-career{margin:8px 0}.me-lw-track{font-size:7.5px}}
`;
document.head.appendChild(style);

function s(){try{return typeof state!=="undefined"&&state?state:null}catch(_){return null}}
function save(){try{if(typeof persist==="function")persist()}catch(_){};try{window.dispatchEvent(new Event("marina-empire-updated"))}catch(_){}}
function hash(str){let h=2166136261;for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function slot(){return Math.floor(Date.now()/900000)}
function portId(){return String(s()?.port||"rimini")}
function marina(){try{return typeof port==="function"?(port(portId())?.name||"Marina"):"Marina"}catch(_){return"Marina"}}
function rankData(){
 const st=s()||{},voy=Math.max(0,Number(st.voyages)||0),prest=Math.max(0,Number(st.prestige)||0),boats=Array.isArray(st.owned)?new Set(st.owned).size:1;
 const marinas=st.marinas&&typeof st.marinas==="object"?Object.keys(st.marinas).filter(k=>k!=="rose").length:0;
 const vhf=st.marinaOperations&&typeof st.marinaOperations==="object"?Object.values(st.marinaOperations).reduce((n,x)=>n+Math.max(0,Number(x?.completed)||0),0):0;
 const score=Math.floor(prest+voy*120+boats*250+marinas*650+vhf*35);
 const rank=Math.max(1,Math.min(30,1+Math.floor(score/650))),base=(rank-1)*650,next=rank*650,pct=rank>=30?100:Math.max(2,Math.min(100,Math.round((score-base)/(next-base)*100)));
 const titles=["Mozzo","Skipper","Comandante","Capitano Charter","Harbour Master","Fleet Manager","Marina Operator","Yacht Manager","Port Director","Empire Builder"];
 return {score,rank,pct,title:titles[Math.min(titles.length-1,Math.floor((rank-1)/3))],next:rank>=30?score:next};
}
function offers(){
 const seed=hash(portId()+"|"+slot()+"|"+rankData().rank),out=[];
 for(let i=0;i<3;i++){const base=CONTRACTS[(seed+i*3)%CONTRACTS.length],mult=1+Math.min(1.8,(rankData().rank-1)*.035);out.push({...base,uid:base.id+"-"+slot()+"-"+i,reward:Math.round(base.reward*mult),cost:Math.round(base.cost*(1+Math.min(.7,(rankData().rank-1)*.018))),prestige:Math.round(base.prestige*(1+Math.min(1,(rankData().rank-1)*.02)))})}
 return out;
}
function active(){return s()?.livingContract||null}
function start(c){
 const st=s();if(!st||st.trip)return alertMsg("Completa prima la navigazione in corso.");
 if(active()&&Number(active().until)>Date.now())return alertMsg("Hai già un contratto operativo in corso.");
 if((Number(st.coins)||0)<c.cost)return alertMsg("Crediti insufficienti per avviare il contratto.");
 st.coins=Math.max(0,(Number(st.coins)||0)-c.cost);
 st.livingContract={...c,start:Date.now(),until:Date.now()+c.min*60000,port:portId(),claimed:false};save();draw();
}
function claim(){
 const st=s(),a=active();if(!st||!a)return;if(Date.now()<Number(a.until))return alertMsg("Contratto ancora in corso.");
 if(a.claimed)return;
 st.coins=Math.max(0,(Number(st.coins)||0)+Math.max(0,Number(a.reward)||0));st.prestige=Math.max(0,(Number(st.prestige)||0)+Math.max(0,Number(a.prestige)||0));
 st.livingContractsDone=Math.max(0,Number(st.livingContractsDone)||0)+1;st.livingContract=null;save();draw();alertMsg("Contratto completato: +"+a.reward.toLocaleString("it-IT")+" crediti · +"+a.prestige+" prestigio");
}
function alertMsg(t){try{if(typeof notice==="function")notice(t);else alert(t)}catch(_){alert(t)}}
function left(ms){const sec=Math.max(0,Math.ceil((ms-Date.now())/1000));return sec>=60?Math.floor(sec/60)+"m "+String(sec%60).padStart(2,"0")+"s":sec+"s"}
function trafficItems(){
 const seed=hash(portId()+"|"+Math.floor(Date.now()/30000)),arr=[];
 for(let i=0;i<7;i++){const name=VESSELS[(seed+i*5)%VESSELS.length],move=MOVES[(seed+i*7)%MOVES.length];arr.push('<span class="'+(/PARTENZA/.test(move)?"out":/FUEL|ASSISTENZA/.test(move)?"svc":"")+'">'+name+' · <b>'+move+'</b></span>')}
 const all=arr.join("");return all+all;
}
function ensureTraffic(){
 const hosts=[document.querySelector("#mePremiumHome .meph-traffic-ticker"),document.querySelector("#meMobileMarinaLivePremium .ml3-hero")].filter(Boolean);
 hosts.forEach((host,idx)=>{let el=host.querySelector(".me-lw-traffic");if(idx===0&&host.classList.contains("meph-traffic-ticker"))return;if(!el){el=document.createElement("div");el.className="me-lw-traffic";el.innerHTML='<div class="me-lw-track"></div>';host.insertAdjacentElement("afterend",el)}el.querySelector(".me-lw-track").innerHTML=trafficItems()});
}
function ensureContracts(){
 const page=document.getElementById("missions");if(!page)return null;let box=document.getElementById("meLivingContracts");if(!box){box=document.createElement("section");box.id="meLivingContracts";box.className="me-lw-box";const panel=page.querySelector(".panel")||page;panel.insertBefore(box,panel.firstChild)}return box;
}
function ensureCareer(){
 const home=document.getElementById("mePremiumHome")||document.querySelector("#home .me-mobile-home-dashboard");if(!home)return null;let box=document.getElementById("meLivingCareer");if(!box){box=document.createElement("section");box.id="meLivingCareer";box.className="me-lw-career";const anchor=home.querySelector(".meph-live")||home.firstElementChild;if(anchor)anchor.insertAdjacentElement("afterend",box);else home.prepend(box)}return box;
}
function rewardAvailable(rank){
 const milestone=Math.floor(rank/5)*5;if(milestone<5)return 0;const claims=s()?.livingMilestoneClaims||[];return claims.includes(milestone)?0:milestone;
}
function claimMilestone(m){
 const st=s();if(!st||!m)return;st.livingMilestoneClaims=Array.isArray(st.livingMilestoneClaims)?st.livingMilestoneClaims:[];if(st.livingMilestoneClaims.includes(m))return;
 const reward=m*5000;st.coins=Math.max(0,(Number(st.coins)||0)+reward);st.livingMilestoneClaims.push(m);save();draw();alertMsg("Traguardo livello "+m+": +"+reward.toLocaleString("it-IT")+" crediti");
}
function drawContracts(){
 const box=ensureContracts();if(!box)return;const a=active(),o=offers(),next=(slot()+1)*900000;
 let body='<div class="me-lw-head"><div><small>CONTRATTI DINAMICI · '+marina().toUpperCase()+'</small><strong>Opportunità operative in rotazione</strong></div><span class="me-lw-timer">NUOVI TRA '+left(next)+'</span></div>';
 if(a){
  const done=Date.now()>=Number(a.until),pct=Math.max(3,Math.min(100,Math.round((Date.now()-Number(a.start))/(Number(a.until)-Number(a.start))*100)));
  body+='<div class="me-lw-active"><strong>'+a.icon+' '+a.name+'</strong><div style="font-size:8px;margin-top:4px">'+(done?"OPERAZIONE COMPLETATA":"Tempo restante: "+left(Number(a.until)))+'</div><div class="me-lw-progress"><i style="width:'+pct+'%"></i></div><button class="me-lw-reward" data-lw-claim '+(done?"":"disabled")+'>'+(done?"RISCUOTI · +"+Number(a.reward).toLocaleString("it-IT")+" CREDITI":"IN CORSO")+'</button></div>';
 }else{
  body+='<div class="me-lw-grid">'+o.map(c=>'<article class="me-lw-card"><b>'+c.icon+' '+c.name+'</b><p>'+c.text+'</p><div class="me-lw-meta"><span>Costo '+c.cost.toLocaleString("it-IT")+'</span><span>+'+c.reward.toLocaleString("it-IT")+' · +'+c.prestige+' PREST.</span></div><button class="gold" data-lw-start="'+c.uid+'">AVVIA · '+c.min+' MIN</button></article>').join("")+'</div>';
 }
 box.innerHTML=body;box.querySelector("[data-lw-claim]")?.addEventListener("click",claim);box.querySelectorAll("[data-lw-start]").forEach(b=>b.addEventListener("click",()=>{const c=o.find(x=>x.uid===b.dataset.lwStart);if(c)start(c)}));
}
function drawCareer(){
 const box=ensureCareer();if(!box)return;const r=rankData(),m=rewardAvailable(r.rank),need=r.rank>=30?"LIVELLO MASSIMO":(r.next-r.score).toLocaleString("it-IT")+" punti al prossimo livello";
 box.innerHTML='<div class="me-lw-career-top"><div><small style="display:block;color:#91b1bb;font-size:7px;font-weight:950;letter-spacing:.12em">CARRIERA MARINA EMPIRE · 30 LIVELLI</small><strong>Livello '+r.rank+' · '+r.title+'</strong></div><span>'+r.score.toLocaleString("it-IT")+' PTS</span></div><div class="me-lw-bar"><i style="width:'+r.pct+'%"></i></div><p>'+need+' · Cresci con missioni, prestigio, flotta, marine e incarichi.</p>'+(m?'<button class="me-lw-reward" data-lw-milestone="'+m+'">🎁 RISCUOTI TRAGUARDO LIVELLO '+m+'</button>':'');
 box.querySelector("[data-lw-milestone]")?.addEventListener("click",e=>claimMilestone(Number(e.currentTarget.dataset.lwMilestone)));
}
function draw(){drawContracts();drawCareer();ensureTraffic()}
function visible(){const m=document.getElementById("missions");return !document.hidden&&m&&!m.classList.contains("hide")} function boot(){draw();setInterval(()=>{if(visible())draw()},10000);window.addEventListener("marina-empire-updated",()=>{if(visible())setTimeout(draw,120)});document.addEventListener("click",e=>{if(e.target.closest("[data-tab='missions'],[data-mobile-tab='missions'],[data-mm5-go='missions'],[data-mf4-go='missions']"))setTimeout(draw,120)})}
window.MarinaEmpireLivingWorld={offers,rank:rankData,active};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();