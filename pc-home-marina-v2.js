(()=>{
"use strict";
if(window.__ME_HOME_MARINA_V2__)return;
window.__ME_HOME_MARINA_V2__=true;

const MARINAS=[
["rimini","Marina di Rimini"],["cervia","Marina di Cervia"],["ravenna","Marina di Ravenna"],
["ancona","Marina di Ancona"],["pescara","Marina di Pescara"],["bari","Marina di Bari"],
["brindisi","Marina di Brindisi"],["salerno","Marina di Salerno"],["nettuno","Marina di Nettuno"],
["scarlino","Marina di Scarlino"],["loano","Marina di Loano"],["portocervo","Porto Cervo"],["lignano","Marina di Lignano"]
];
let idx=0;

const st=document.createElement("style");
st.textContent=`
@media(min-width:900px){
 #meHomeMarinaV2{display:grid!important;grid-template-columns:1fr 1fr!important;gap:14px!important;height:100%!important;min-height:0!important}
 #meHomeMarinaCard,#meHomeCareerCard{min-width:0!important;min-height:0!important;height:100%!important;border:1px solid rgba(201,164,98,.55)!important;border-radius:16px!important;background:#061f2d!important;overflow:hidden!important}
 #meHomeMarinaCard{display:block!important;position:relative!important}
 #meHomeMarinaHead{display:none!important}
 #meHomeMarinaFrame{display:block!important;width:100%!important;height:100%!important;min-height:100%!important;border:0!important;background:#062838!important}
 #meHomeMarinaControls{display:none!important}
 #meHomeMarinaControls button{height:36px!important;min-height:36px!important;padding:6px 10px!important;font-size:10px!important}
 #meHomeMarinaLabel{text-align:center!important;color:#f1d292!important;font-weight:900!important;font-size:12px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 #meHomeCareerCard{overflow:auto!important}
 #meHomeCareerCard #meLongTermCareer{display:block!important;width:100%!important;height:100%!important;margin:0!important;border:0!important;border-radius:0!important}
}
`;
document.head.appendChild(st);

function selectedId(){
 try{return typeof state!=="undefined"&&state?.port?String(state.port):"rimini"}catch(_){return"rimini"}
}
function chooseInitial(){
 const found=MARINAS.findIndex(x=>x[0]===selectedId());
 if(found>=0)idx=found;
}
function renderMarina(){
 const frame=document.getElementById("meHomeMarinaFrame"),label=document.getElementById("meHomeMarinaLabel");
 if(!frame)return;
 const m=MARINAS[idx];
 const src="./marine-deluxe-originali.html?marina="+encodeURIComponent(m[0])+"&home=1&v=2";
 if(frame.getAttribute("src")!==src)frame.setAttribute("src",src);
 if(label)label.textContent="⚓ "+m[1];
}
function build(){
 if(innerWidth<900)return false;
 const home=document.querySelector("#home .game-lux-home");
 const career=document.getElementById("meLongTermCareer");
 if(!home||!career)return false;

 chooseInitial();
 let wrap=document.getElementById("meHomeMarinaV2");
 if(!wrap){
   wrap=document.createElement("div");
   wrap.id="meHomeMarinaV2";
   wrap.innerHTML='<section id="meHomeMarinaCard"><div id="meHomeMarinaHead"><strong>⚓ MARINA ATTUALE</strong><span>MONDO VIVO</span></div><iframe id="meHomeMarinaFrame" title="Marina viva selezionata" loading="eager"></iframe><div id="meHomeMarinaControls"><button type="button" id="meHomePrev">‹</button><div id="meHomeMarinaLabel">Marina</div><button type="button" id="meHomeNext">›</button><button type="button" id="meHomeEnter">ENTRA NELLA MARINA</button></div></section><section id="meHomeCareerCard"></section>';
   const panels=document.getElementById("mePcFinalPanels");
   if(panels){panels.replaceWith(wrap)}
   else{
     const final=document.getElementById("mePcFinalHome");
     if(final)final.appendChild(wrap);
     else home.appendChild(wrap);
   }
 }
 document.getElementById("meHomeCareerCard")?.appendChild(career);
 renderMarina();

 const prev=document.getElementById("meHomePrev"),next=document.getElementById("meHomeNext"),enter=document.getElementById("meHomeEnter");
 if(prev&&!prev.dataset.bound){prev.dataset.bound="1";prev.onclick=()=>{idx=(idx-1+MARINAS.length)%MARINAS.length;renderMarina();};}
 if(next&&!next.dataset.bound){next.dataset.bound="1";next.onclick=()=>{idx=(idx+1)%MARINAS.length;renderMarina();};}
 if(enter&&!enter.dataset.bound){enter.dataset.bound="1";enter.onclick=()=>{location.href="./marine-deluxe-originali.html?marina="+encodeURIComponent(MARINAS[idx][0]);};}

 const old=document.getElementById("mePcCommandPanel");
 if(old)old.remove();
 return true;
}
function boot(){
 if(build())return;
 let tries=0;
 const timer=setInterval(()=>{tries++;if(build()||tries>20)clearInterval(timer)},250);
}
window.addEventListener("marina-empire-updated",()=>setTimeout(build,80));
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();