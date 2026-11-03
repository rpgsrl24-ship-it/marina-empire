(()=>{
  "use strict";
  if(window.__ME_MARINA_LIVE__) return;
  window.__ME_MARINA_LIVE__ = true;

  const MARINAS = {
    rimini:["M/Y Adriatica","Blue Runner","Riva 44","Tender 07","S/Y Bora"],
    venezia:["Laguna One","M/Y Serenissima","Tender 12","S/Y Levante","Riva 38"],
    genova:["M/Y Portofino","Liguria Star","Tender 21","S/Y Maestrale","Pilot 4"],
    napoli:["M/Y Vesuvio","Capri Express","Tender 15","S/Y Partenope","Riva 52"],
    cagliari:["M/Y Sardinia","Sirocco","Tender 09","S/Y Mistral","Pilot 2"],
    palermo:["M/Y Trinacria","Eolie Runner","Tender 18","S/Y Libeccio","Riva 46"],
    bari:["M/Y Levante","Adriatic Star","Tender 11","S/Y Grecale","Pilot 7"],
    ancona:["M/Y Conero","Marche One","Tender 06","S/Y Bora","Riva 40"],
    trieste:["M/Y Miramare","Gulf Runner","Tender 03","S/Y Bora II","Pilot 1"],
    livorno:["M/Y Tirreno","Tuscan Star","Tender 14","S/Y Ponente","Riva 48"]
  };

  const EVENT_TEMPLATES = [
    n=>`${n} in ingresso · assegnazione ormeggio`,
    n=>`${n} in uscita dal porto`,
    n=>`${n} al distributore carburante`,
    n=>`${n} completa rifornimento acqua`,
    n=>`${n} richiede assistenza tecnica`,
    n=>`${n} movimentato dal marina staff`,
    n=>`${n} pronto per nuova partenza`,
    n=>`${n} effettua manovra di ormeggio`
  ];

  const css = `
  .me-live-marina{margin:10px 0 12px;border:1px solid rgba(194,154,96,.48);border-radius:14px;overflow:hidden;background:linear-gradient(180deg,#08283a,#061b29);box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
  .me-live-marina-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;font-size:11px;letter-spacing:.06em;color:#d9c39e}
  .me-live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#4ce1a1;box-shadow:0 0 8px #4ce1a1;margin-right:6px;animation:meLivePulse 1.8s ease-in-out infinite}
  .me-live-water{position:relative;height:74px;overflow:hidden;background:
    radial-gradient(circle at 20% 30%,rgba(89,190,220,.12),transparent 24%),
    repeating-linear-gradient(170deg,rgba(255,255,255,.055) 0 2px,transparent 2px 14px),
    linear-gradient(180deg,#0a5268,#063a50)}
  .me-live-water:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);transform:translateX(-100%);animation:meWaterShine 8s linear infinite}
  .me-live-boat{position:absolute;left:-64px;display:flex;align-items:center;gap:5px;font-size:18px;filter:drop-shadow(0 3px 2px rgba(0,0,0,.35));animation:meBoatCross var(--dur) linear var(--delay) infinite}
  .me-live-boat small{font-size:9px;color:#fff;background:rgba(0,0,0,.45);border-radius:8px;padding:2px 5px;white-space:nowrap}
  .me-live-boat:nth-child(1){top:10px;--dur:22s;--delay:-4s}
  .me-live-boat:nth-child(2){top:34px;--dur:29s;--delay:-15s}
  .me-live-boat:nth-child(3){top:53px;--dur:25s;--delay:-9s}
  .me-live-feed{padding:8px 10px 10px;display:grid;gap:4px;font-size:10px;color:#c9d9df}
  .me-live-feed-row{display:flex;gap:7px;align-items:flex-start}
  .me-live-feed-time{color:#7fa4b3;min-width:38px}
  .me-live-feed strong{color:#f0d29d;font-weight:600}
  .me-live-marina[data-phase="night"] .me-live-water{filter:brightness(.62) saturate(.82)}
  .me-live-marina[data-phase="dawn"] .me-live-water{filter:brightness(.88) sepia(.08)}
  .me-live-marina[data-phase="sunset"] .me-live-water{filter:brightness(.82) sepia(.16) saturate(1.15)}
  .me-live-phase{font-size:9px;color:#9fb9c4}
  .me-live-player-status{margin:0 10px 7px;display:inline-flex;align-items:center;gap:5px;padding:4px 7px;border:1px solid rgba(76,225,161,.28);border-radius:999px;background:rgba(76,225,161,.06);font-size:9px;color:#bcebd7}
  .me-live-community{padding:8px 10px 10px;border-top:1px solid rgba(194,154,96,.18);background:#082431}
  .me-live-community-head{font-size:9px;letter-spacing:.06em;color:#d9c39e;margin-bottom:5px}
  .me-live-community-row{display:grid;grid-template-columns:38px minmax(70px,auto) 1fr;gap:6px;align-items:start;font-size:9px;color:#b9cdd4;padding:3px 0}
  .me-live-community-row span{color:#789eac}.me-live-community-row b{color:#f0d29d}.me-live-community-row em{font-style:normal;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .me-live-community-empty{font-size:9px;color:#87a7b2}
  @keyframes meBoatCross{0%{transform:translateX(0)}100%{transform:translateX(calc(100vw + 220px))}}
  @keyframes meWaterShine{to{transform:translateX(100%)}}
  @keyframes meLivePulse{50%{opacity:.35;transform:scale(.8)}}
  @media (prefers-reduced-motion:reduce){.me-live-boat,.me-live-water:after,.me-live-dot{animation:none!important}.me-live-boat{left:12%!important}}
  @media (max-width:740px){.me-live-marina{margin:8px 0 10px}.me-live-water{height:64px}.me-live-marina-head{font-size:10px}.me-live-feed{font-size:9.5px}}
  `;
  const style=document.createElement("style");
  style.id="me-marina-live-style";
  style.textContent=css;
  document.head.appendChild(style);

  let timer=null, feedRows=[], host=null,communityObserver=null;

  function marinaKey(){
    try{
      if(typeof state!=="undefined" && state && state.port) return String(state.port).toLowerCase();
    }catch(_){}
    return "rimini";
  }
  function namesFor(key){
    return MARINAS[key] || MARINAS.rimini;
  }
  function currentCard(){
    const list=document.getElementById("marinaList");
    if(!list) return null;
    const key=marinaKey();
    return list.querySelector(`[data-marina-card="${CSS.escape(key)}"]`) ||
           list.querySelector(".me-current-marina-card") ||
           list.firstElementChild;
  }
  function now(){
    return new Date().toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"});
  }
  function phaseInfo(){
    return window.MarinaEmpireWorldEvents?.dayPhase?.()||{id:"day",label:"GIORNO",icon:"☀️",traffic:1};
  }
  function trafficFactor(){
    return window.MarinaEmpireWorldEvents?.modifiers?.(marinaKey())?.traffic||1;
  }
  function eventText(key){
    const names=namesFor(key);
    const n=names[Math.floor(Math.random()*names.length)];
    const f=EVENT_TEMPLATES[Math.floor(Math.random()*EVENT_TEMPLATES.length)];
    return f(n);
  }
  function addFeed(text){
    if(!host) return;
    const feed=host.querySelector(".me-live-feed");
    if(!feed) return;
    feedRows.unshift({t:now(),text});
    feedRows=feedRows.slice(0,3);
    feed.innerHTML=feedRows.map((r,i)=>`<div class="me-live-feed-row"><span class="me-live-feed-time">${r.t}</span><span>${i===0?"<strong>LIVE</strong> · ":""}${r.text}</span></div>`).join("");
  }
  function activeCommunityCount(){
    const source=document.getElementById("communityMessages");
    if(!source)return 0;
    const names=[...source.querySelectorAll(".me-community-message strong")]
      .map(x=>(x.textContent||"").trim())
      .filter(Boolean);
    return new Set(names).size;
  }
  function updateLiveStatus(){
    if(!host)return;
    const badge=host.querySelector(".me-live-player-status");
    if(!badge)return;
    const count=activeCommunityCount();
    badge.textContent=count?count+" comandanti attivi":"community in ascolto";
  }
  function mirrorCommunity(){
    if(!host)return;
    let box=host.querySelector(".me-live-community");
    if(!box){
      box=document.createElement("div");
      box.className="me-live-community";
      host.appendChild(box);
    }
    const source=document.getElementById("communityMessages");
    if(!source){box.innerHTML='<div class="me-live-community-head">👥 COMMUNITY LIVE</div><div class="me-live-community-empty">Accedi per vedere l’attività dei comandanti.</div>';return}
    const items=[...source.querySelectorAll(".me-community-message")].slice(-3).reverse();
    box.innerHTML='<div class="me-live-community-head">👥 COMMUNITY LIVE</div>'+(items.length?items.map(item=>{
      const name=item.querySelector("strong")?.textContent||"Comandante";
      const when=item.querySelector(".me-community-message-head span")?.textContent||"";
      const body=item.querySelector(".me-community-message-body")?.textContent||item.querySelector("p")?.textContent||"";
      return '<div class="me-live-community-row"><span>'+when+'</span><b>'+name+'</b><em>'+body.slice(0,90)+'</em></div>';
    }).join(""):'<div class="me-live-community-empty">Nessun messaggio recente nella community.</div>');
  }
  function build(){
    const card=currentCard();
    if(!card) return false;
    const key=marinaKey();
    if(host && host.parentNode===card && host.dataset.mar==key) return true;
    if(host) host.remove();
    host=document.createElement("div");
    host.className="me-live-marina";
    host.dataset.mar=key;
    const phase=phaseInfo();
    host.dataset.phase=phase.id;
    host.setAttribute("aria-label","Attività live della marina");
    const names=namesFor(key);
    host.innerHTML=`
      <div class="me-live-marina-head"><span><i class="me-live-dot"></i>MARINA LIVE · TRAFFICO ATTIVO</span><span class="me-live-phase">${phase.icon} ${phase.label}</span></div>
      <div class="me-live-player-status">community in ascolto</div>
      <div class="me-live-water" aria-hidden="true">
        <div class="me-live-boat">🛥️<small>${names[0]}</small></div>
        <div class="me-live-boat">⛵<small>${names[1]}</small></div>
        <div class="me-live-boat">🚤<small>${names[2]}</small></div>
      </div>
      <div class="me-live-feed"></div>
      <div class="me-live-community"></div>`;
    card.insertBefore(host,card.firstChild);
    feedRows=[];
    addFeed(eventText(key));
    addFeed(eventText(key));
    addFeed(eventText(key));
    mirrorCommunity();
    updateLiveStatus();
    return true;
  }
  function schedule(){
    clearTimeout(timer);
    if(document.hidden){ timer=setTimeout(schedule,15000); return; }
    build();
    if(host) addFeed(eventText(marinaKey()));
    const tf=Math.max(.45,Math.min(1.6,trafficFactor()));
    const base=Math.round(15000/tf);
    timer=setTimeout(schedule,Math.max(6500,base+Math.floor(Math.random()*7000)));
  }
  function boot(){
    if(!build()){
      setTimeout(boot,800);
      return;
    }
    schedule();
    const list=document.getElementById("marinaList");
    if(list) new MutationObserver(()=>setTimeout(build,50)).observe(list,{childList:true,subtree:true});
    const community=document.getElementById("communityMessages");
    if(community&&!communityObserver){
      communityObserver=new MutationObserver(()=>setTimeout(()=>{mirrorCommunity();updateLiveStatus()},40));
      communityObserver.observe(community,{childList:true,subtree:true});
    }
    window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{build();updateLiveStatus()},60));
    window.addEventListener("marina-world-event",()=>setTimeout(()=>{build();schedule();},80));
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)schedule();});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();