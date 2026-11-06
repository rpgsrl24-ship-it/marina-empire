(()=>{
"use strict";
if(window.__ME_CAREER_PATH__)return;
window.__ME_CAREER_PATH__=true;

const STAGES=[
 {id:"commander",level:1,title:"COMANDANTE",icon:"🧭",focus:"Impara a navigare, completa missioni e costruisci prestigio.",requirements:[]},
 {id:"owner",level:2,title:"ARMATORE",icon:"🛥️",focus:"Espandi la flotta e fai lavorare più imbarcazioni.",requirements:[
  {key:"voyages",label:"6 viaggi completati",target:6,tab:"missions"},
  {key:"boats",label:"2 yacht in flotta",target:2,tab:"fleet"},
  {key:"prestige",label:"1.000 prestigio",target:1000,tab:"missions"}
 ]},
 {id:"operator",level:3,title:"OPERATORE NAUTICO",icon:"💼",focus:"Trasforma la navigazione in un'attività economica.",requirements:[
  {key:"voyages",label:"15 viaggi completati",target:15,tab:"missions"},
  {key:"businesses",label:"1 attività nautica",target:1,tab:"office"},
  {key:"npcJobs",label:"5 lavori marina",target:5,tab:"marinas"},
  {key:"sectorRep",label:"40 reputazione in un settore",target:40,tab:"profile"}
 ]},
 {id:"manager",level:4,title:"MARINA MANAGER",icon:"⚓",focus:"Gestisci una vera rete portuale e le sue attività.",requirements:[
  {key:"voyages",label:"30 viaggi completati",target:30,tab:"missions"},
  {key:"marinas",label:"1 marina posseduta",target:1,tab:"marinas"},
  {key:"businesses",label:"3 attività nautiche",target:3,tab:"office"},
  {key:"boats",label:"3 yacht in flotta",target:3,tab:"fleet"},
  {key:"serviceChains",label:"2 catene operative completate",target:2,tab:"marinas"},
  {key:"empireScore",label:"5.000 Empire Score",target:5000,tab:"profile"}
 ]},
 {id:"empire",level:5,title:"MARINA EMPIRE",icon:"👑",focus:"Costruisci un impero nautico multi-marina pronto all'espansione internazionale.",requirements:[
  {key:"voyages",label:"60 viaggi completati",target:60,tab:"missions"},
  {key:"marinas",label:"3 marine possedute",target:3,tab:"marinas"},
  {key:"businesses",label:"5 attività nautiche",target:5,tab:"office"},
  {key:"boats",label:"5 yacht in flotta",target:5,tab:"fleet"},
  {key:"serviceChains",label:"6 catene operative completate",target:6,tab:"marinas"},
  {key:"empireScore",label:"20.000 Empire Score",target:20000,tab:"profile"}
 ]}
];

const style=document.createElement("style");
style.id="me-career-path-style";
style.textContent=`
.me-career-path{margin:14px 0;padding:15px;border:1px solid rgba(214,181,117,.42);border-radius:15px;background:linear-gradient(135deg,#0a2a39,#102f3e)}
.me-career-path-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.me-career-path-head h2{margin:3px 0 5px}.me-career-path-head p{margin:0;color:#b8cbd3;font-size:12px}
.me-career-path-current{flex:0 0 auto;padding:8px 11px;border:1px solid rgba(214,181,117,.42);border-radius:999px;color:#f1d292;font-size:10px;font-weight:800}
.me-career-road{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin-top:12px}
.me-career-stage{position:relative;padding:10px;border:1px solid rgba(255,255,255,.11);border-radius:11px;background:#0a2430;min-width:0}
.me-career-stage strong{display:block;color:#dce8ec;font-size:10px}.me-career-stage span{display:block;margin-top:4px;color:#829faa;font-size:8.5px}
.me-career-stage.done{border-color:rgba(83,207,158,.34)}.me-career-stage.done strong{color:#bcebd7}
.me-career-stage.current{border-color:rgba(214,181,117,.7);background:#113646}.me-career-stage.current strong{color:#f3d69d}
.me-career-next{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:10px;margin-top:10px}
.me-career-panel{padding:11px;border:1px solid rgba(214,181,117,.2);border-radius:11px;background:#092530}
.me-career-panel strong{color:#f0d296}.me-career-panel p{margin:5px 0;font-size:10px;color:#bfd0d6}
.me-career-requirements{display:grid;gap:5px;margin-top:7px}
.me-career-requirement{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;font-size:9px;color:#b9cbd2}
.me-career-requirement b{color:#dce7ea;font-size:9px}.me-career-requirement.ok b{color:#9fe1c4}
.me-career-bar{grid-column:1/-1;height:5px;border-radius:99px;background:#173846;overflow:hidden}.me-career-bar span{display:block;height:100%;background:#caa96a}
.me-career-action{width:100%;margin-top:9px;padding:9px 11px;border:1px solid rgba(214,181,117,.52);border-radius:9px;background:#17475a;color:#fff;font-size:10px;font-weight:800}
@media(max-width:899px){
 .me-career-path{margin:10px 0;padding:11px}
 .me-career-road{display:flex;gap:5px;overflow:hidden}
 .me-career-stage{display:none;flex:1;padding:8px}.me-career-stage.current,.me-career-stage.current + .me-career-stage{display:block}
 .me-career-next{grid-template-columns:1fr}.me-career-panel.secondary{display:none}
 .me-career-path-head p{font-size:10px}.me-career-path-head h2{font-size:18px}
}
`;
document.head.appendChild(style);

let box=null,timer=null;

function countTruthy(obj){
 if(!obj||typeof obj!=="object")return 0;
 return Object.values(obj).filter(Boolean).length;
}
function metrics(){
 if(typeof state==="undefined"||!state)return {voyages:0,boats:0,prestige:0,businesses:0,npcJobs:0,sectorRep:0,marinas:0,serviceChains:0,empireScore:0};
 const reps=state.sectorReputation&&typeof state.sectorReputation==="object"?Object.values(state.sectorReputation):[];
 return {
  voyages:Math.max(0,Math.floor(Number(state.voyages)||0)),
  boats:Array.isArray(state.owned)?new Set(state.owned).size:0,
  prestige:Math.max(0,Math.floor(Number(state.prestige)||0)),
  businesses:countTruthy(state.businesses),
  npcJobs:Math.max(0,Math.floor(Number(state.npcJobsCompleted)||0)),
  sectorRep:reps.reduce((m,v)=>Math.max(m,Math.max(0,Math.floor(Number(v)||0))),0),
  marinas:Object.entries(state.marinas||{}).filter(([id,v])=>id!=="rose"&&v&&Number.isFinite(Number(v.lastReward))).length,
  serviceChains:Math.max(0,Math.floor(Number(state.serviceChainsCompleted)||0)),
  empireScore:typeof empireScore==="function"?Math.max(0,Math.floor(Number(empireScore())||0)):0
 };
}
function requirementStatus(r,m){
 const value=Math.max(0,Number(m[r.key])||0),target=Math.max(1,Number(r.target)||1);
 return {...r,value,target,done:value>=target,pct:Math.max(0,Math.min(100,Math.round(value/target*100)))};
}
function stageStatus(stage,m){
 const requirements=stage.requirements.map(r=>requirementStatus(r,m));
 return {...stage,requirements,done:requirements.every(r=>r.done)};
}
function snapshot(){
 const m=metrics(),statuses=STAGES.map(s=>stageStatus(s,m));
 let current=statuses[0];
 for(const st of statuses){if(st.done)current=st;else break}
 const next=statuses.find(st=>st.level>current.level&&!st.done)||null;
 const missing=next?next.requirements.filter(r=>!r.done):[];
 return {metrics:m,stages:statuses,current,next,missing};
}
function ensure(){
 const anchor=document.getElementById("meProgressionHub");
 if(!anchor)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("section");
 box.className="me-career-path";
 box.id="meLongTermCareer";
 box.setAttribute("aria-label","Percorso carriera Marina Empire");
 anchor.parentNode.insertBefore(box,anchor);
 return true;
}
function fmt(n){return Math.max(0,Math.floor(Number(n)||0)).toLocaleString("it-IT")}
function render(){
 if(!ensure()||typeof state==="undefined"||!state?.name)return;
 const s=snapshot(),next=s.next,missing=s.missing;
 const roadmap=s.stages.map(st=>'<div class="me-career-stage '+(st.done?"done ":"")+(st.level===s.current.level?"current":"")+'"><strong>'+st.icon+' '+st.title+'</strong><span>'+(st.done?"RAGGIUNTO":st.level===s.current.level?"FASE ATTUALE":"OBIETTIVO")+'</span></div>').join("");
 const reqs=next?next.requirements.map(r=>'<div class="me-career-requirement '+(r.done?"ok":"")+'"><span>'+(r.done?"✓ ":"○ ")+r.label+'</span><b>'+fmt(r.value)+' / '+fmt(r.target)+'</b><div class="me-career-bar"><span style="width:'+r.pct+'%"></span></div></div>').join(""):'<p>Hai completato tutte le fasi strategiche attualmente disponibili.</p>';
 const action=missing[0]||null;
 box.innerHTML='<div class="me-career-path-head"><div><span class="home-eyebrow">PERCORSO A LUNGO TERMINE</span><h2>'+s.current.icon+' '+s.current.title+'</h2><p>'+s.current.focus+'</p></div><div class="me-career-path-current">FASE '+s.current.level+' / '+STAGES.length+'</div></div><div class="me-career-road">'+roadmap+'</div><div class="me-career-next"><div class="me-career-panel"><strong>'+(next?('PROSSIMA FASE · '+next.icon+' '+next.title):'GRADO MASSIMO ATTUALE')+'</strong><p>'+(next?next.focus:'Continua a far crescere flotta, marine, reputazione e attività in attesa dell’espansione internazionale.')+'</p><div class="me-career-requirements">'+reqs+'</div>'+(action?'<button type="button" class="me-career-action" data-career-go="'+action.tab+'">VAI AL PROSSIMO OBIETTIVO · '+action.label+'</button>':'')+'</div><div class="me-career-panel secondary"><strong>IL TUO IMPERO OGGI</strong><p>Viaggi '+fmt(s.metrics.voyages)+' · Yacht '+fmt(s.metrics.boats)+' · Marine '+fmt(s.metrics.marinas)+' · Attività '+fmt(s.metrics.businesses)+'</p><p>Catene operative '+fmt(s.metrics.serviceChains)+' · Prestigio '+fmt(s.metrics.prestige)+' · Migliore reputazione settore '+fmt(s.metrics.sectorRep)+' · Empire Score '+fmt(s.metrics.empireScore)+'</p></div></div>';
 box.querySelector("[data-career-go]")?.addEventListener("click",e=>{
  const tab=e.currentTarget.dataset.careerGo;
  const target=document.querySelector('[data-tab="'+tab+'"]');
  if(target){target.click();return}
  if(typeof showTab==="function")showTab(tab);
 });
}
window.MarinaEmpireCareerPath={snapshot,metrics,stages:STAGES.map(s=>({...s}))};

function boot(){
 if(!ensure()){setTimeout(boot,700);return}
 render();
 window.addEventListener("marina-empire-updated",()=>setTimeout(render,70));
 window.addEventListener("marina-world-event",()=>setTimeout(render,70));
 clearInterval(timer);timer=setInterval(render,60000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();