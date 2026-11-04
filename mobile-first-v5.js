(()=>{
"use strict";
if(window.__ME_MOBILE_FIRST_V5__)return;
window.__ME_MOBILE_FIRST_V5__=true;

const style=document.createElement("style");
style.id="me-mobile-first-v5-style";
style.textContent=`
@media(max-width:740px){
  /* Mobile-first cleanup: one HUD, one credit CTA, no desktop service panels */
  html body .stats{display:none!important}
  html body #meFuelPanel,
  html body #meMaintenancePanel{display:none!important}
  html body .me-buy-credits-top{display:none!important}

  #home .game-lux-home{display:none!important}
  #home .me-beta-launch-notice{margin-bottom:7px!important;padding:9px 10px!important;font-size:10px!important}
  #home .me-mobile-home-dashboard{
    display:flex!important;flex-direction:column!important;gap:9px!important;
    padding:0 0 102px!important;margin:0!important
  }

  #meMobileCreditsHero{
    order:-20!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;
    align-items:center!important;gap:10px!important;width:100%!important;
    padding:12px 13px!important;margin:0!important;
    border:1px solid #e2bb68!important;border-radius:14px!important;
    background:linear-gradient(135deg,#c99a44,#f0cf84 55%,#b47a26)!important;
    box-shadow:0 9px 24px rgba(0,0,0,.34)!important;color:#122733!important
  }
  #meMobileCreditsHero small{
    display:block!important;font-size:8px!important;font-weight:900!important;
    letter-spacing:.12em!important;color:#4d3921!important
  }
  #meMobileCreditsHero strong{
    display:block!important;margin-top:3px!important;font-size:17px!important;
    line-height:1.05!important;color:#102733!important
  }
  #meMobileCreditsHero span{
    display:block!important;margin-top:4px!important;font-size:10px!important;
    line-height:1.25!important;color:#3e3428!important
  }
  #meMobileCreditsHero button{
    min-height:46px!important;padding:9px 12px!important;border:1px solid #102d3b!important;
    border-radius:10px!important;background:#092b3b!important;color:#ffe1a5!important;
    font-size:10px!important;font-weight:950!important;white-space:nowrap!important
  }

  #meMobileMarinaLiveCard{order:-15!important;margin:0!important}
  #home .me-mobile-home-continue{
    order:-10!important;margin:0!important;padding:13px!important;border-radius:14px!important;
    border:1px solid rgba(202,164,95,.62)!important;background:linear-gradient(145deg,#0a2b3b,#0d3a4c)!important
  }
  #home .me-mobile-home-continue h2{font-size:21px!important;margin:2px 0!important}
  #home .me-mobile-home-continue p{font-size:10px!important;margin:2px 0!important}
  #home .me-mobile-home-continue button{min-height:44px!important}

  #home .me-mobile-home-grid{
    order:0!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:8px!important;margin:0!important
  }
  #home .me-mobile-home-tile{
    min-height:96px!important;padding:11px!important;border-radius:13px!important;text-align:left!important
  }
  #home .me-mobile-home-tile strong{font-size:11px!important;line-height:1.15!important;overflow-wrap:normal!important;word-break:normal!important}
  #home .me-mobile-home-tile small{font-size:9px!important;line-height:1.2!important}
  #home .me-mobile-home-tile[data-tab="map"] strong{font-size:10px!important;letter-spacing:0!important}
  #home .me-mobile-home-icon{font-size:21px!important}

  #meMobileEmpireActions{
    order:5!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
    gap:7px!important;margin:0!important
  }
  #meMobileEmpireActions button{
    min-height:65px!important;padding:8px 4px!important;border:1px solid rgba(190,153,87,.45)!important;
    border-radius:11px!important;background:#092b3b!important;color:#efd39a!important;
    font-size:9px!important;font-weight:900!important;white-space:normal!important
  }
  #meMobileEmpireActions button span{display:block!important;font-size:20px!important;margin-bottom:4px!important}

  #home .me-mobile-home-goal{order:10!important;margin:0!important;padding:11px!important}
  #home .me-mobile-home-goal-copy strong{font-size:11px!important}
  #home .me-mobile-home-goal-copy small,#home .me-mobile-goal-foot{font-size:9px!important}

  #meMobileHomeSectionTitle{
    order:-1!important;display:flex!important;align-items:center!important;justify-content:space-between!important;
    margin:0!important;padding:2px 2px 0!important;color:#f0cf8c!important;
    font-size:9px!important;font-weight:900!important;letter-spacing:.11em!important
  }
}
@media(min-width:741px){
  #meMobileCreditsHero,#meMobileEmpireActions,#meMobileHomeSectionTitle{display:none!important}
}
`;
document.head.appendChild(style);

function go(id){
  if(typeof showTab==="function")showTab(id);
}

function ensure(){
  if(innerWidth>740)return;
  const home=document.querySelector("#home .me-mobile-home-dashboard");
  if(!home)return;

  if(!document.getElementById("meMobileCreditsHero")){
    const hero=document.createElement("div");
    hero.id="meMobileCreditsHero";
    hero.innerHTML='<div><small>MARINA EMPIRE STORE</small><strong>💳 ACQUISTA CREDITI</strong><span>Potenzia flotta, attività e crescita del tuo impero.</span></div><button type="button">APRI STORE</button>';
    hero.querySelector("button").addEventListener("click",()=>go("credits"));
    home.prepend(hero);
  }

  if(!document.getElementById("meMobileHomeSectionTitle")){
    const title=document.createElement("div");
    title.id="meMobileHomeSectionTitle";
    title.innerHTML="<span>COMANDI RAPIDI</span><span>TOCCA PER APRIRE</span>";
    const grid=home.querySelector(".me-mobile-home-grid");
    if(grid)grid.insertAdjacentElement("beforebegin",title);
  }

  if(!document.getElementById("meMobileEmpireActions")){
    const actions=document.createElement("div");
    actions.id="meMobileEmpireActions";
    actions.innerHTML=
      '<button type="button" data-go="marinas"><span>⚓</span>MARINE</button>'+
      '<button type="button" data-go="marketplace"><span>🛒</span>MARKETPLACE</button>'+
      '<button type="button" data-go="profile"><span>👤</span>COMANDANTE</button>'+
      '<button type="button" data-go="office"><span>◈</span>DIREZIONE</button>'+
      '<button type="button" data-go="headquarters"><span>🏝️</span>ISOLA DELLE ROSE</button>'+
      '<button type="button" data-community="1"><span>💬</span>COMMUNITY</button>';
    actions.addEventListener("click",e=>{
      const b=e.target.closest("button");if(!b)return;
      if(b.dataset.community){
        go("office");
        setTimeout(()=>document.getElementById("marinaCommunity")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
        return;
      }
      if(b.dataset.go)go(b.dataset.go);
    });
    const goal=home.querySelector(".me-mobile-home-goal");
    if(goal)goal.insertAdjacentElement("beforebegin",actions);
    else home.append(actions);
  }
}
window.addEventListener("resize",ensure);
window.addEventListener("marina-empire-updated",ensure);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensure,{once:true});else ensure();
setTimeout(ensure,300);
})();