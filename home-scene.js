(()=>{
"use strict";
if(window.__ME_HOME_SCENE__)return;
window.__ME_HOME_SCENE__=true;
const st=document.createElement("style");
st.id="me-home-scene-style";
st.textContent=`
@media(max-width:740px){
  #home>.me-beta-launch-notice{display:none!important}
  #home .me-mobile-home-dashboard{display:none!important}
  #home .game-lux-home{display:block!important}
  #home .hero{
    min-height:calc(100svh - 245px)!important;
    height:calc(100svh - 245px)!important;
    margin:4px 0 8px!important;border:1px solid #b99557!important;border-radius:18px!important;
    overflow:hidden!important;position:relative!important;
    background:
      linear-gradient(180deg,rgba(2,16,27,.12) 0 30%,rgba(4,44,60,.1) 44%,rgba(3,44,61,.8) 75%,#052d41 100%),
      radial-gradient(circle at 70% 18%,rgba(243,210,143,.3),transparent 18%),
      linear-gradient(180deg,#70b7ca 0 30%,#96ccd7 31% 38%,#1e7289 39% 72%,#053a51 100%)!important;
    box-shadow:0 12px 30px rgba(0,0,0,.35)!important
  }
  #home .hero:before{
    content:"";position:absolute;left:-5%;right:-5%;top:24%;height:34%;z-index:1;
    background:
      repeating-linear-gradient(90deg,transparent 0 26px,rgba(8,35,43,.94) 27px 31px,transparent 32px 58px),
      linear-gradient(180deg,transparent 0 55%,rgba(8,39,48,.94) 56% 67%,rgba(5,28,36,.98) 68%);
    clip-path:polygon(0 65%,10% 52%,19% 60%,30% 42%,42% 57%,53% 45%,65% 59%,76% 43%,87% 56%,100% 48%,100% 100%,0 100%);
    filter:drop-shadow(0 5px 8px rgba(0,0,0,.28))
  }
  #home .hero:after{
    content:"";position:absolute;left:-10%;right:-10%;top:55%;bottom:-15%;z-index:1;
    background:repeating-radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.1) 0 1px,transparent 2px 16px);
    animation:meHomeSea 7s linear infinite
  }
  #home .luxury-mini-map{display:none!important}
  #home .hero-copy{
    position:absolute!important;z-index:4!important;left:10px!important;right:10px!important;bottom:10px!important;
    padding:10px 11px!important;border:1px solid rgba(214,181,117,.45)!important;border-radius:12px!important;
    background:rgba(3,27,40,.78)!important;backdrop-filter:blur(10px)!important
  }
  #home .hero-copy .tag{font-size:8px!important;letter-spacing:.12em!important}
  #home .hero-copy h1{font-size:22px!important;line-height:1.05!important;margin:4px 0!important}
  #home .hero-copy p{font-size:10px!important;margin:4px 0 8px!important}
  #home .hero-copy button{display:none!important}
  #home .cards,#home #meProgressionHub{display:none!important}
  #home .me-home-vessel{
    position:absolute;z-index:3;left:50%;top:58%;transform:translate(-50%,-50%);
    font-size:72px;filter:drop-shadow(0 8px 5px rgba(0,0,0,.38));animation:meHomeBoat 3.6s ease-in-out infinite
  }
  #home .me-home-vessel small{
    display:block;margin-top:-2px;text-align:center;font-size:9px;color:#fff;background:rgba(3,26,36,.72);
    border:1px solid rgba(214,181,117,.35);border-radius:999px;padding:3px 7px;white-space:nowrap
  }
  #home .me-home-status{
    position:absolute;z-index:4;top:10px;left:10px;right:10px;display:flex;justify-content:space-between;gap:8px;
    padding:7px 9px;border:1px solid rgba(214,181,117,.4);border-radius:10px;background:rgba(3,29,42,.72);backdrop-filter:blur(8px);
    font-size:8px;color:#dce8ec
  }
  #home .me-home-status b{color:#f0d29d}
}
@keyframes meHomeSea{0%,100%{transform:translateX(-1%)}50%{transform:translateX(1.5%) translateY(1%)}}
@keyframes meHomeBoat{0%,100%{transform:translate(-50%,-50%) rotate(-1deg)}50%{transform:translate(-50%,-53%) rotate(1deg)}}
`;
document.head.appendChild(st);

function boatName(){
 try{
   const b=(typeof boats!=="undefined"&&Array.isArray(boats))?boats.find(x=>x.id===state?.boat):null;
   return b?.name||"RPG Academy 8";
 }catch(_){return"RPG Academy 8"}
}
function marinaName(){
 try{
   if(typeof port==="function")return port(state?.port||"rimini")?.name||"Marina di Rimini";
 }catch(_){}
 return String(state?.port||"Rimini");
}
function sync(){
 const hero=document.querySelector("#home .hero");if(!hero||typeof state==="undefined")return;
 let vessel=hero.querySelector(".me-home-vessel");
 if(!vessel){vessel=document.createElement("div");vessel.className="me-home-vessel";hero.appendChild(vessel)}
 vessel.innerHTML='🛥️<small>'+boatName()+'</small>';
 let status=hero.querySelector(".me-home-status");
 if(!status){status=document.createElement("div");status.className="me-home-status";hero.appendChild(status)}
 const trip=!!state?.trip;
 status.innerHTML='<span><b>'+marinaName()+'</b><br>'+(trip?'IN NAVIGAZIONE':'ORMEGGIATO')+'</span><span>⛽ '+Math.round(Number(state?.fuel)||0)+' L<br>🔧 '+Math.round(Number(state?.condition)||0)+'%</span>';
}
window.addEventListener("marina-empire-updated",sync);
document.querySelectorAll(".screen").forEach(s=>new MutationObserver(()=>{if(s.id==="home"&&!s.classList.contains("hide"))setTimeout(sync,50)}).observe(s,{attributes:true,attributeFilter:["class"]}));
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});else sync();
})();