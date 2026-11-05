(()=>{
"use strict";
if(window.__ME_MOBILE_TIMED_CONTRACTS_V1__)return;
window.__ME_MOBILE_TIMED_CONTRACTS_V1__=true;

const CONTRACTS=[
 {id:"mission",metric:"voyages",title:"Charter urgente",desc:"Completa 1 missione entro la scadenza.",target:1,reward:1400,prestige:16,icon:"🧭",panel:"missions"},
 {id:"marina",metric:"npcJobs",title:"Supporto al marina",desc:"Completa 1 lavoro marina entro la scadenza.",target:1,reward:1100,prestige:14,icon:"⚓",panel:"marinas"},
 {id:"market",metric:"marketDeals",title:"Affare rapido",desc:"Concludi 1 operazione Marketplace.",target:1,reward:950,prestige:12,icon:"💼",panel:"marketplace"},
 {id:"emergency",metric:"emergencies",title:"Intervento prioritario",desc:"Gestisci 1 emergenza prima che scada.",target:1,reward:1700,prestige:20,icon:"🆘",panel:"marinas"},
 {id:"chain",metric:"chains",title:"Servizio premium",desc:"Completa 1 catena operativa.",target:1,reward:1900,prestige:24,icon:"🎯",panel:"marinas"}
];
const SLOT_MS=2*60*60*1000;
const DURATION_MS=35*60*1000;

const style=document.createElement("style");
style.id="me-mobile-timed-contracts-v1-style";
style.textContent=`
@media(max-width:740px){
 #meMobileFlashContract{
   order:-11!important;margin:0!important;padding:11px!important;
   border:1px solid rgba(93,185,205,.55)!important;border-radius:14px!important;
   background:linear-gradient(145deg,#0b3040,#082534)!important;
   box-shadow:0 8px 22px rgba(0,0,0,.22)!important
 }
 #meMobileFlashHead{
   display:flex!important;align-items:flex-start!important;justify-content:space-between!important;
   gap:8px!important
 }
 #meMobileFlashHead small{
   display:block!important;color:#8eb0bc!important;font-size:7px!important;
   font-weight:950!important;letter-spacing:.12em!important
 }
 #meMobileFlashHead strong{
   display:block!important;margin-top:2px!important;color:#f1d395!important;
   font-size:14px!important;line-height:1.05!important
 }
 #meMobileFlashTimer{
   flex:0 0 auto!important;padding:6px 8px!important;border:1px solid rgba(94,185,205,.45)!important;
   border-radius:999px!important;background:#123b4a!important;color:#bce8f2!important;
   font-size:8px!important;font-weight:950!important
 }
 #meMobileFlashContract p{
   margin:7px 0 0!important;color:#c7d9df!important;font-size:9px!important;line-height:1.3!important
 }
 #meMobileFlashProgress{
   display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;
   gap:8px!important;align-items:center!important;margin-top:9px!important
 }
 #meMobileFlashBar{
   height:5px!important;border-radius:99px!important;background:#173b49!important;overflow:hidden!important
 }
 #meMobileFlashBar i{
   display:block!important;height:100%!important;background:#6fc2d7!important;border-radius:99px!important
 }
 #meMobileFlashMeta{
   margin-top:5px!important;color:#8faab5!important;font-size:8px!important
 }
 #meMobileFlashAction{
   min-width:92px!important;min-height:42px!important;padding:7px 9px!important;
   border:1px solid #e4c170!important;border-radius:9px!important;
   background:#123b4b!important;color:#f3d69b!important;font-size:8.5px!important;font-weight:950!important
 }
 #meMobileFlashAction.claim{
   background:linear-gradient(135deg,#e3bd67,#a7752d)!important;color:#102532!important
 }
 #meMobileFlashAction:disabled{opacity:.48!important}
 #meMobileFlashStreak{
   margin-top:8px!important;padding:7px 8px!important;border-radius:9px!important;
   background:rgba(255,255,255,.035)!important;color:#a8c0c9!important;font-size:8px!important
 }
 #meMobileFlashStreak b{color:#f2d495!important}
}
@media(min-width:741px){#meMobileFlashContract{display:none!important}}
`;
document.head.appendChild(style);

function metrics(){
 const a=window.MarinaEmpireObjectives;
 return a?.metrics?.()||{voyages:0,npcJobs:0,emergencies:0,marketDeals:0,chains:0};
}
function slotKey(){
 const slot=Math.floor(Date.now()/SLOT_MS);
 return String(slot);
}
function hash(str){
 let h=2166136261;
 for(const ch of String(str)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
 return h>>>0;
}
function pick(slot){
 return CONTRACTS[hash("flash|"+slot)%CONTRACTS.length];
}
function ensureState(){
 const slot=slotKey();
 const existing=state.flashContract&&typeof state.flashContract==="object"?state.flashContract:null;
 if(existing?.slot===slot)return existing;
 const c=pick(slot),base=metrics(),startedAt=Date.now();
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{
   state.flashContract={
    slot,id:c.id,metric:c.metric,target:c.target,reward:c.reward,prestige:c.prestige,
    title:c.title,desc:c.desc,icon:c.icon,panel:c.panel,
    base:Number(base[c.metric])||0,startedAt,expiresAt:startedAt+DURATION_MS,claimed:false
   };
 }):false;
 return ok?state.flashContract:null;
}
function current(){
 if(typeof state==="undefined"||!state?.name)return null;
 return ensureState();
}
function progress(c){
 const m=metrics(),now=Number(m[c.metric])||0;
 return Math.max(0,now-(Number(c.base)||0));
}
function streak(){
 const s=state.flashContractStreak&&typeof state.flashContractStreak==="object"?state.flashContractStreak:{count:0,lastSlot:""};
 return {count:Math.max(0,Math.floor(Number(s.count)||0)),lastSlot:String(s.lastSlot||"")};
}
function openPanel(id){
 if(window.MarinaEmpireMobileHome?.open){window.MarinaEmpireMobileHome.open(id);return}
 if(typeof showTab==="function")showTab(id);
}
function claim(){
 const c=current();if(!c)return;
 const p=progress(c),expired=Date.now()>Number(c.expiresAt||0);
 if(c.claimed)return;
 if(expired){try{if(typeof notice==="function")notice("Contratto scaduto. Ne arriverà uno nuovo.",4500)}catch(_){};return}
 if(p<c.target){openPanel(c.panel);return}
 const prev=streak();
 const slotNum=Number(c.slot)||0,prevNum=Number(prev.lastSlot)||0;
 const consecutive=prev.lastSlot&&slotNum-prevNum===1;
 const nextCount=consecutive?Math.min(10,prev.count+1):1;
 const comboBonus=nextCount>=3?Math.round(c.reward*(0.15*Math.min(4,nextCount-2))):0;
 const ok=typeof meAtomicPersist==="function"?meAtomicPersist(()=>{
   state.flashContract.claimed=true;
   state.flashContract.claimedAt=Date.now();
   state.flashContractStreak={count:nextCount,lastSlot:c.slot};
   state.coins+=c.reward+comboBonus;
   state.prestige=(Number(state.prestige)||0)+c.prestige;
   state.earnings=(Number(state.earnings)||0)+c.reward+comboBonus;
   state.lastFlashContractReward={id:c.id,reward:c.reward,bonus:comboBonus,prestige:c.prestige,at:Date.now()};
 }):false;
 if(ok){
   try{if(typeof render==="function")render()}catch(_){}
   try{if(typeof notice==="function")notice("Contratto completato: +"+(c.reward+comboBonus).toLocaleString("it-IT")+" crediti · prestigio +"+c.prestige+(comboBonus?" · bonus serie +"+comboBonus:""),6000)}catch(_){}
   window.dispatchEvent(new Event("marina-empire-updated"));
   setTimeout(renderCard,80);
 }
}
function ensure(){
 if(innerWidth>740)return null;
 const home=document.querySelector("#home .me-mobile-home-dashboard");if(!home)return null;
 let box=document.getElementById("meMobileFlashContract");if(box)return box;
 box=document.createElement("section");box.id="meMobileFlashContract";
 const daily=document.getElementById("meMobileDailyOps");
 if(daily)daily.insertAdjacentElement("afterend",box);
 else {
   const center=document.getElementById("meMobileHomeCommandCenter");
   if(center)center.insertAdjacentElement("beforebegin",box);else home.append(box);
 }
 box.addEventListener("click",e=>{if(e.target.closest("#meMobileFlashAction"))claim()});
 return box;
}
function fmtTime(ms){
 const s=Math.max(0,Math.floor(ms/1000));
 const m=Math.floor(s/60),sec=s%60;
 return String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");
}
function renderCard(){
 if(innerWidth>740||typeof state==="undefined"||!state?.name)return;
 const box=ensure(),c=current();if(!box||!c)return;
 const p=progress(c),done=p>=c.target,expired=Date.now()>Number(c.expiresAt||0),remain=Number(c.expiresAt||0)-Date.now();
 const st=streak(),pct=Math.max(0,Math.min(100,Math.round(p/c.target*100)));
 const bonusPreview=st.count>=2?Math.round(c.reward*(0.15*Math.min(4,st.count-1))):0;
 let action="VAI",cls="";
 if(c.claimed){action="RISCOSSO"}
 else if(expired){action="SCADUTO"}
 else if(done){action="RISCATTA";cls="claim"}
 box.innerHTML=
  '<div id="meMobileFlashHead"><div><small>CONTRATTO LAMPO</small><strong>'+c.icon+' '+c.title+'</strong></div><span id="meMobileFlashTimer">'+(expired?"SCADUTO":fmtTime(remain))+'</span></div>'+
  '<p>'+c.desc+'</p>'+
  '<div id="meMobileFlashProgress"><div><div id="meMobileFlashBar"><i style="width:'+pct+'%"></i></div><div id="meMobileFlashMeta">'+Math.min(p,c.target)+' / '+c.target+' · '+c.reward.toLocaleString("it-IT")+' cr · +'+c.prestige+' prest.</div></div><button type="button" id="meMobileFlashAction" class="'+cls+'" '+((c.claimed||expired)?"disabled":"")+'>'+action+'</button></div>'+
  '<div id="meMobileFlashStreak">🔥 Serie contratti: <b>'+st.count+'</b>'+(bonusPreview?' · prossimo bonus stimato +'+bonusPreview.toLocaleString("it-IT")+' cr':' · completa 3 consecutivi per il bonus serie')+'</div>';
}
window.MarinaEmpireTimedContracts={current,progress,claim,render:renderCard,streak};

function boot(){
 if(!ensure()){setTimeout(boot,500);return}
 renderCard();
 window.addEventListener("marina-empire-updated",()=>setTimeout(renderCard,70));
 setInterval(renderCard,1000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();