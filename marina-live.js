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
  .me-live-intensity{margin:0 10px 8px;display:flex;justify-content:space-between;gap:8px;align-items:center;padding:6px 8px;border:1px solid rgba(194,154,96,.2);border-radius:9px;background:#0a2d3b;font-size:9px;color:#d6e2e6}
  .me-live-intensity span{font-weight:800;color:#f0d29d}.me-live-intensity small{font-size:9px;color:#91afba}
  .me-live-vhf{margin:0 10px 8px;padding:7px 8px;border-left:2px solid #7eb9cf;background:rgba(10,48,62,.72);font-size:9px;color:#bfd1d7}
  .me-live-vhf b{color:#9dd7ea;margin-right:5px}.me-live-vhf-text{display:inline}
  .me-live-vhf-action{margin-top:6px;padding:5px 8px;min-height:0;border-radius:8px;font-size:9px;background:#123b4b;border-color:#5d91a4}
  .me-live-vhf-career{margin-top:6px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-size:8.5px;color:#9fb8c2}
  .me-live-vhf-career b{color:#f0d29d}
  .me-live-vhf-preview{margin-top:5px;padding:5px 6px;border-radius:7px;background:rgba(255,255,255,.03);font-size:8.5px;color:#b9cdd4}
  .me-live-vhf-preview.rare{border:1px solid rgba(240,210,157,.35);background:rgba(240,210,157,.08);color:#f6ddb1;font-weight:700}
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

  let timer=null, feedRows=[], host=null,communityObserver=null,vhfUiTimer=null;

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
  function marinaIntensity(){
    const tf=Math.max(.45,Math.min(1.6,trafficFactor()));
    const players=activeCommunityCount();
    const score=tf+(players>0?Math.min(.45,players*.08):0);
    if(score>=1.35)return {label:"INTENSA",icon:"🔥",arrivals:4,departures:3};
    if(score>=.9)return {label:"ATTIVA",icon:"⚓",arrivals:3,departures:2};
    return {label:"TRANQUILLA",icon:"🌊",arrivals:1,departures:1};
  }
  function updateMarinaPulse(){
    if(!host)return;
    const intensity=marinaIntensity();
    const box=host.querySelector(".me-live-intensity");
    if(!box)return;
    const jitter=Math.floor(Date.now()/30000)%2;
    box.innerHTML='<span>'+intensity.icon+' '+intensity.label+'</span><small>arrivi '+(intensity.arrivals+jitter)+' · partenze '+intensity.departures+'</small>';
  }
  function vhfMessage(){
    const intensity=marinaIntensity();
    const key=marinaKey();
    const names=namesFor(key);
    const phase=phaseInfo();
    const pool=[
      "Port Control: canale 09 operativo · mantenere ascolto in ingresso",
      names[0]+": autorizzato ingresso · procedere a velocita ridotta",
      names[1]+": attesa breve al distributore carburante",
      "Marina Staff: assistenza ormeggio disponibile sul pontile centrale",
      "Port Control: traffico "+intensity.label.toLowerCase()+" · precedenza alle unita in manovra",
      "VHF Meteo: fase "+phase.label.toLowerCase()+" · verificare condizioni prima della partenza",
      "Marina Service: tecnico disponibile per interventi rapidi a bordo",
      names[2]+": richiesta spazio di manovra in uscita"
    ];
    const idx=Math.floor(Date.now()/18000)%pool.length;
    return pool[idx];
  }
  function updateVhf(){
    if(!host)return;
    const box=host.querySelector(".me-live-vhf-text");
    if(box)box.textContent=vhfMessage();
    const preview=host.querySelector(".me-live-vhf-preview");
    if(preview&&typeof state!=="undefined"){
      const job=vhfJob();
      preview.textContent=(job.rare?(job.badge+" · "):"")+job.label+" · "+job.reward.toLocaleString("it-IT")+" cr · "+job.prestige+" prest.";
      preview.classList.toggle("rare",!!job.rare);
    }
    const action=host.querySelector(".me-live-vhf-action");
    if(!action||typeof state==="undefined")return;
    const nowTs=Date.now();
    const active=state.vhfActiveJob&&typeof state.vhfActiveJob==="object"?state.vhfActiveJob:null;
    const cooldown=Math.max(0,Math.ceil(((Number(state.vhfCooldownUntil)||0)-nowTs)/1000));
    if(state.trip){action.textContent="IN NAVIGAZIONE";action.disabled=true;return}
    if(active){
      const remain=Math.max(0,Math.ceil((Number(active.endsAt||0)-nowTs)/1000));
      action.textContent=remain>0?"IN CORSO · "+remain+"s":"RISCUOTI INCARICO";
      action.disabled=remain>0;
      return;
    }
    if(cooldown>0){action.textContent="NUOVO INCARICO TRA "+cooldown+"s";action.disabled=true;return}
    action.textContent="PRENDI INCARICO";action.disabled=false;
  }
  function vhfLevel(){
    const done=Array.isArray(state?.vhfJobs)?state.vhfJobs.length:0;
    if(done>=40)return {level:5,label:"Port Control Master",bonus:.25,next:0};
    if(done>=25)return {level:4,label:"Senior Operator",bonus:.18,next:40-done};
    if(done>=12)return {level:3,label:"VHF Specialist",bonus:.12,next:25-done};
    if(done>=5)return {level:2,label:"Port Assistant",bonus:.06,next:12-done};
    return {level:1,label:"VHF Cadet",bonus:0,next:5-done};
  }
  function marinaTrust(key=marinaKey()){
    const map=state&&state.vhfMarinaReputation&&typeof state.vhfMarinaReputation==="object"?state.vhfMarinaReputation:{};
    const points=Math.max(0,Math.floor(Number(map[key])||0));
    if(points>=60)return {level:5,label:"FIDUCIA MASSIMA",bonus:.15,points,next:0};
    if(points>=30)return {level:4,label:"PARTNER PORTUALE",bonus:.10,points,next:60-points};
    if(points>=15)return {level:3,label:"OPERATORE FIDATO",bonus:.07,points,next:30-points};
    if(points>=5)return {level:2,label:"CONOSCIUTO",bonus:.03,points,next:15-points};
    return {level:1,label:"NUOVO OPERATORE",bonus:0,points,next:5-points};
  }
  function updateVhfCareer(){
    if(!host||typeof state==="undefined")return;
    const box=host.querySelector(".me-live-vhf-career");
    if(!box)return;
    const lv=vhfLevel();
    const trust=marinaTrust();
    const done=Array.isArray(state.vhfJobs)?state.vhfJobs.length:0;
    box.innerHTML='<b>Lv.'+lv.level+' '+lv.label+'</b><span>'+done+' incarichi'+(lv.next>0?' · '+lv.next+' al prossimo livello':' · livello massimo')+'</span><b>Marina Lv.'+trust.level+' · '+trust.label+'</b><span>'+trust.points+' reputazione'+(trust.next>0?' · '+trust.next+' al prossimo livello':' · massimo')+'</span>';
  }
  function rareVhfJob(level,intensity,key){
    const rare=[
      {min:3,id:"vip",label:"Priorita VIP in ingresso",reward:520,prestige:7,duration:45,badge:"PRIORITA"},
      {min:4,id:"storm",label:"Coordinamento traffico meteo",reward:760,prestige:10,duration:55,badge:"URGENTE"},
      {min:5,id:"superyacht",label:"Assistenza Superyacht Port Control",reward:1100,prestige:15,duration:65,badge:"ELITE"}
    ].filter(x=>level>=x.min);
    if(!rare.length)return null;
    const slot=Math.floor(Date.now()/60000)%5;
    if(slot!==0)return null;
    const item=rare[Math.floor(Date.now()/300000)%rare.length];
    const trafficBonus=intensity.label==="INTENSA"?1.15:1;
    return {...item,marina:key,reward:Math.round(item.reward*trafficBonus),rare:true};
  }
  function vhfJob(){
    const intensity=marinaIntensity();
    const key=marinaKey();
    const options=[
      {id:"berth",label:"Assistenza ormeggio",reward:180+intensity.arrivals*35,prestige:2,duration:28},
      {id:"fuel",label:"Supporto rifornimento",reward:160+intensity.departures*30,prestige:2,duration:24},
      {id:"tech",label:"Assistenza tecnica rapida",reward:220+(intensity.label==="INTENSA"?90:30),prestige:3,duration:38},
      {id:"traffic",label:"Supporto Port Control",reward:200+intensity.arrivals*25,prestige:3,duration:32}
    ];
    const idx=Math.floor(Date.now()/30000)%options.length;
    const lv=vhfLevel();
    const special=rareVhfJob(lv.level,intensity,key);
    const trust=marinaTrust(key);
    if(special)return {...special,reward:Math.round(special.reward*(1+lv.bonus)*(1+trust.bonus)),careerLevel:lv.level,marinaLevel:trust.level};
    const base=options[idx];
    return {...base,marina:key,reward:Math.round(base.reward*(1+lv.bonus)*(1+trust.bonus)),careerLevel:lv.level,marinaLevel:trust.level,rare:false};
  }
  function completeVhfJob(){
    if(typeof state==="undefined"||typeof meAtomicPersist!=="function")return false;
    const active=state.vhfActiveJob&&typeof state.vhfActiveJob==="object"?state.vhfActiveJob:null;
    if(!active||Date.now()<Number(active.endsAt||0))return false;
    const completedAt=Date.now();
    const ok=meAtomicPersist(()=>{
      state.vhfJobs=Array.isArray(state.vhfJobs)?state.vhfJobs:[];
      state.vhfJobs.push({id:active.id,marina:active.marina,at:completedAt,reward:active.reward,prestige:active.prestige,duration:active.duration});
      state.vhfJobs=state.vhfJobs.slice(-40);
      state.coins=(Number(state.coins)||0)+(Number(active.reward)||0);
      state.prestige=(Number(state.prestige)||0)+(Number(active.prestige)||0);
      state.earnings=(Number(state.earnings)||0)+(Number(active.reward)||0);
      state.vhfMarinaReputation=state.vhfMarinaReputation&&typeof state.vhfMarinaReputation==="object"?state.vhfMarinaReputation:{};
      const repKey=String(active.marina||marinaKey());
      state.vhfMarinaReputation[repKey]=(Number(state.vhfMarinaReputation[repKey])||0)+(active.rare?3:1);
      state.vhfActiveJob=null;
      state.vhfCooldownUntil=completedAt+45000;
    });
    if(!ok)return false;
    if(typeof render==="function")render();
    if(typeof notice==="function")notice(active.label+" completato · +"+Number(active.reward||0).toLocaleString("it-IT")+" crediti · prestigio +"+Number(active.prestige||0));
    window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"vhf-job-complete"}}));
    updateVhf();
    updateVhfCareer();
    return true;
  }
  function runVhfJob(){
    if(typeof state==="undefined")return;
    if(state.trip){if(typeof notice==="function")notice("Completa prima la navigazione in corso.");return}
    if(!window.meRegisteredPlayer){if(typeof notice==="function")notice("Registrati per accettare incarichi VHF.");return}
    const nowTs=Date.now();
    const active=state.vhfActiveJob&&typeof state.vhfActiveJob==="object"?state.vhfActiveJob:null;
    if(active){
      if(nowTs>=Number(active.endsAt||0)){completeVhfJob();return}
      const remain=Math.max(1,Math.ceil((Number(active.endsAt||0)-nowTs)/1000));
      if(typeof notice==="function")notice(active.label+" in corso · "+remain+"s rimanenti");
      return;
    }
    const cooldown=Math.max(0,Math.ceil(((Number(state.vhfCooldownUntil)||0)-nowTs)/1000));
    if(cooldown>0){if(typeof notice==="function")notice("Port Control: nuovo incarico tra "+cooldown+"s.");return}
    const job=vhfJob();
    const started=Date.now();
    const endsAt=started+Math.max(15000,Number(job.duration||30)*1000);
    if(typeof meAtomicPersist!=="function")return;
    const ok=meAtomicPersist(()=>{
      state.vhfActiveJob={id:job.id,label:job.label,marina:job.marina,startedAt:started,endsAt,reward:job.reward,prestige:job.prestige,duration:job.duration,rare:!!job.rare,badge:job.badge||""};
    });
    if(!ok){if(typeof notice==="function")notice("Incarico VHF non salvato.");return}
    if(typeof render==="function")render();
    if(typeof notice==="function")notice(job.label+" accettato · durata "+job.duration+"s");
    updateVhf();
    updateVhfCareer();
    window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"vhf-job-start"}}));
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
      <div class="me-live-intensity"></div>
      <div class="me-live-vhf"><b>VHF 09</b><span class="me-live-vhf-text"></span><div class="me-live-vhf-preview"></div><div><button type="button" class="me-live-vhf-action">PRENDI INCARICO</button></div><div class="me-live-vhf-career"></div></div>
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
    updateMarinaPulse();
    updateVhf();
    updateVhfCareer();
    host.querySelector(".me-live-vhf-action")?.addEventListener("click",runVhfJob);
    return true;
  }
  function schedule(){
    clearTimeout(timer);
    if(document.hidden){ timer=setTimeout(schedule,15000); return; }
    build();
    if(host){addFeed(eventText(marinaKey()));updateMarinaPulse();updateVhf();}
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
    clearInterval(vhfUiTimer);
    vhfUiTimer=setInterval(()=>{updateVhf();if(typeof state!=="undefined"&&state.vhfActiveJob&&Date.now()>=Number(state.vhfActiveJob.endsAt||0))updateVhf()},1000);
    const list=document.getElementById("marinaList");
    if(list) new MutationObserver(()=>setTimeout(build,50)).observe(list,{childList:true,subtree:true});
    const community=document.getElementById("communityMessages");
    if(community&&!communityObserver){
      communityObserver=new MutationObserver(()=>setTimeout(()=>{mirrorCommunity();updateLiveStatus();updateMarinaPulse();updateVhf()},40));
      communityObserver.observe(community,{childList:true,subtree:true});
    }
    window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{build();updateLiveStatus()},60));
    window.addEventListener("marina-world-event",()=>setTimeout(()=>{build();updateMarinaPulse();updateVhf();schedule();},80));
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)schedule();});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();