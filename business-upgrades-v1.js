(()=>{
"use strict";
if(window.__ME_BUSINESS_UPGRADES_V1__)return;
window.__ME_BUSINESS_UPGRADES_V1__=true;

const style=document.createElement("style");
style.textContent=`
.me-business-upgrades{margin:12px 0;padding:12px;border:1px solid rgba(214,181,117,.35);border-radius:12px;background:#082735}
.me-business-upgrades h3{margin:0 0 6px;color:#f2d293}.me-business-upgrade{padding:9px;margin:7px 0;border:1px solid rgba(255,255,255,.08);border-radius:9px;background:#0a3040}
.me-business-upgrade strong{color:#f0d29d}.me-business-upgrade small{display:block;color:#9db4bd;margin-top:4px}.me-business-upgrade button{margin-top:7px;min-height:40px}
@media(max-width:740px){.me-business-upgrades{padding:9px}.me-business-upgrade button{width:100%;min-height:44px}}
`;
document.head.appendChild(style);

function sref(){try{return typeof state!=="undefined"?state:null}catch(_){return null}}
function money(v){try{return Math.round(Number(v)||0).toLocaleString("it-IT")}catch(_){return String(v||0)}}
function levelFor(key){
 const s=sref();if(!s)return 1;
 s.businessLevels=s.businessLevels&&typeof s.businessLevels==="object"?s.businessLevels:{};
 return Math.max(1,Math.min(3,Math.floor(Number(s.businessLevels[key])||1)));
}
function multiplier(key){return 1+(levelFor(key)-1)*.35}
function cost(key,basePrice){
 const lv=levelFor(key);
 if(lv>=3)return 0;
 return Math.max(3000,Math.round((Number(basePrice)||10000)*(lv===1?.45:.75)));
}
function upgrade(key,basePrice,label){
 const s=sref();if(!s||s.trip)return false;
 const lv=levelFor(key),price=cost(key,basePrice);
 if(lv>=3){if(typeof notice==="function")notice(label+" già al livello massimo.");return false}
 if((Number(s.coins)||0)<price){if(typeof notice==="function")notice("Crediti insufficienti per migliorare l'attività.");return false}
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{
  s.coins-=price;
  s.businessLevels=s.businessLevels&&typeof s.businessLevels==="object"?s.businessLevels:{};
  s.businessLevels[key]=lv+1;
 }):false;
 if(!ok)return false;
 if(typeof notice==="function")notice(label+" migliorata a livello "+(lv+1));
 if(typeof render==="function")render();
 window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"business-upgrade"}}));
 draw();
 return true;
}
let box=null;
function draw(){
 const s=sref();if(!s?.name)return;
 const host=document.getElementById("businessList")||document.getElementById("officeActions");
 if(!host)return;
 if(!box||!box.isConnected){box=document.createElement("section");box.id="meBusinessUpgradesV1";box.className="me-business-upgrades";host.insertAdjacentElement("afterend",box)}
 const owned=Object.entries(s.businesses||{}).filter(([,v])=>!!v);
 if(!owned.length){box.style.display="none";return}
 box.style.display="";
 const defs=Array.isArray(window.MarinaEmpireBusinessCatalog)?window.MarinaEmpireBusinessCatalog:[];
 box.innerHTML='<h3>🏢 SVILUPPO ATTIVITÀ</h3><p class="small muted">Reinvesti nelle attività già acquistate per aumentare il rendimento giornaliero.</p>'+owned.map(([key])=>{
  const id=key.split(":").pop(),def=defs.find(x=>x.id===id)||{name:id,price:10000,income:0},lv=levelFor(key),mult=multiplier(key),price=cost(key,def.price);
  return '<div class="me-business-upgrade"><strong>'+def.name+' · LV '+lv+'/3</strong><small>Rendimento: '+Math.round((mult-1)*100)+'% bonus · '+money((Number(def.income)||0)*mult)+' cr/24h</small><button type="button" data-business-upgrade="'+key+'" '+(lv>=3||s.trip||s.coins<price?'disabled':'')+'>'+(lv>=3?'LIVELLO MASSIMO':'MIGLIORA · '+money(price)+' CR')+'</button></div>';
 }).join("");
 box.querySelectorAll("[data-business-upgrade]").forEach(b=>b.addEventListener("click",()=>{
  const key=b.dataset.businessUpgrade,id=key.split(":").pop(),def=defs.find(x=>x.id===id)||{name:id,price:10000};
  upgrade(key,def.price,def.name);
 }));
}
window.MarinaEmpireBusinessUpgrades={levelFor,multiplier,cost,upgrade,render:draw};
function boot(){draw();window.addEventListener("marina-empire-updated",()=>setTimeout(draw,80));setInterval(draw,30000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();