(()=>{
"use strict";
if(window.__ME_HOME_COMMAND_CENTER_PREP__)return;
window.__ME_HOME_COMMAND_CENTER_PREP__=true;

const ITEMS=[
 {id:"missions",icon:"🎯",title:"MISSIONI",sub:"Incarichi e charter"},
 {id:"map",icon:"🧭",title:"ROTTA",sub:"Pianifica e parti"},
 {id:"fleet",icon:"🛥️",title:"FLOTTA",sub:"Yacht e gestione"},
 {id:"marinas",icon:"⚓",title:"MARINE",sub:"Porti e proprietà"},
 {id:"office",icon:"🏢",title:"ECONOMIA",sub:"Attività e charter"},
 {id:"marketplace",icon:"🛒",title:"MARKETPLACE",sub:"Compra e vendi"},
 {id:"credits",icon:"💎",title:"CREDITI",sub:"Pacchetti Marina Empire"},
 {id:"community",icon:"💬",title:"COMMUNITY",sub:"Chat e comandanti"},
 {id:"profile",icon:"👤",title:"COMANDANTE",sub:"Profilo e account"},
 {id:"headquarters",icon:"🏝️",title:"ISOLA DELLE ROSE",sub:"Quartier generale RPG Yacht"}
];

const style=document.createElement("style");
style.textContent=`
#meHomeCommandCenterPrep{margin:12px 0 18px;padding:13px;border:1px solid rgba(201,164,98,.42);border-radius:15px;background:linear-gradient(145deg,#082635,#0b3141)}
.me-hcc-head{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:9px}
.me-hcc-head h3{margin:2px 0;color:#f1d292}.me-hcc-head small{color:#9fb7c0}
.me-hcc-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}
.me-hcc-btn{min-width:0;padding:9px 7px!important;min-height:64px!important;text-align:left!important;border:1px solid rgba(255,255,255,.1)!important;background:#0b2c3a!important}
.me-hcc-btn span{font-size:18px}.me-hcc-btn strong{display:block;margin-top:3px;font-size:9px;color:#f1d49b}.me-hcc-btn small{display:block;margin-top:2px;font-size:8px;color:#9fb7c0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(max-width:1100px){.me-hcc-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media(max-width:899px){#meHomeCommandCenterPrep{display:none}}
`;
document.head.appendChild(style);

function go(id){
 if(id==="community"){
   if(typeof showTab==="function")showTab("office");
   setTimeout(()=>document.getElementById("marinaCommunity")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
   return;
 }
 const btn=document.querySelector('[data-tab="'+id+'"]');
 if(btn){btn.click();return}
 if(typeof showTab==="function")showTab(id);
}

function mount(){
 if(innerWidth<900)return;
 if(document.getElementById("meHomeCommandCenterPrep"))return;
 const host=document.getElementById("meHomeMarinaV2")||document.getElementById("mePcFinalPanels")||document.querySelector("#home .game-lux-home");
 if(!host)return;
 const box=document.createElement("section");
 box.id="meHomeCommandCenterPrep";
 box.innerHTML='<div class="me-hcc-head"><div><small>CENTRO OPERATIVO</small><h3>TUTTO IL TUO IMPERO DALLA HOME</h3></div><small>azioni rapide</small></div><div class="me-hcc-grid">'+ITEMS.map(x=>'<button type="button" class="me-hcc-btn" data-hcc="'+x.id+'"><span>'+x.icon+'</span><strong>'+x.title+'</strong><small>'+x.sub+'</small></button>').join("")+'</div>';
 host.insertAdjacentElement("afterend",box);
 box.querySelectorAll("[data-hcc]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.hcc)));
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.addEventListener("marina-empire-updated",()=>setTimeout(mount,60));
})();