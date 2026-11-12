(()=>{
"use strict";
if(window.MarinaEmpireFX)return;
const css=`
:root{--mefx-gold:#f5c84f;--mefx-blue:#159df3;--mefx-navy:#06243a}
html{scroll-behavior:smooth}body{opacity:0;transition:opacity .28s ease}body.mefx-ready{opacity:1}
a,button,.tile,.card,.service,.event,.boat{transition:transform .14s ease,box-shadow .18s ease,filter .18s ease}
a:active,button:active,.tile:active,.service:active{transform:scale(.965)}
.mefx-pulse{animation:mefxPulse 1.65s ease-in-out infinite}
@keyframes mefxPulse{0%,100%{box-shadow:0 0 0 0 rgba(245,200,79,.08)}50%{box-shadow:0 0 0 7px rgba(245,200,79,.14),0 0 22px rgba(245,200,79,.28)}}
.mefx-reward{position:fixed;z-index:9999;inset:0;display:flex;align-items:center;justify-content:center;padding:18px;background:radial-gradient(circle at 50% 35%,rgba(18,114,171,.28),rgba(2,19,31,.84));backdrop-filter:blur(7px);animation:mefxFade .2s ease}
.mefx-reward-card{position:relative;width:min(390px,94vw);overflow:hidden;border:1px solid rgba(255,218,103,.72);border-radius:28px;padding:26px 20px 20px;background:linear-gradient(160deg,#073b61 0%,#075f91 48%,#08283f 100%);color:#fff;text-align:center;box-shadow:0 22px 70px rgba(0,20,34,.48),0 0 32px rgba(245,200,79,.2);animation:mefxPop .36s cubic-bezier(.2,.9,.25,1.15)}
.mefx-reward-card:before{content:"";position:absolute;inset:-45% -20% auto;height:180px;background:radial-gradient(circle,rgba(255,224,119,.23),transparent 65%);pointer-events:none}
.mefx-crown{font-size:46px;filter:drop-shadow(0 6px 12px rgba(0,0,0,.25));animation:mefxFloat 1.8s ease-in-out infinite}
.mefx-kicker{margin-top:7px;color:#9be9ff;font-size:9px;font-weight:950;letter-spacing:.17em}
.mefx-title{margin-top:5px;font:800 27px Georgia,serif;letter-spacing:.02em}
.mefx-sub{margin:7px auto 0;max-width:280px;color:#d8f3ff;font-size:10px;line-height:1.4}
.mefx-rewards{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:18px 0 14px}
.mefx-stat{padding:12px 8px;border:1px solid rgba(143,225,255,.38);border-radius:16px;background:rgba(3,47,76,.62)}
.mefx-stat span{display:block;color:#aeefff;font-size:8px;font-weight:900}.mefx-stat b{display:block;margin-top:4px;font-size:20px;color:#fff0a7}
.mefx-close{width:100%;min-height:48px;border:1px solid #ffe08a;border-radius:14px;background:linear-gradient(180deg,#ffdc69,#dca31e);color:#16324c;font-size:10px;font-weight:950;box-shadow:0 8px 20px rgba(0,0,0,.2)}
.mefx-spark{position:absolute;width:7px;height:7px;border-radius:50%;background:#ffe47e;box-shadow:0 0 10px #ffe47e;animation:mefxSpark 1.8s ease-in-out infinite}
.mefx-spark.s1{left:10%;top:19%}.mefx-spark.s2{right:12%;top:26%;animation-delay:.35s}.mefx-spark.s3{left:18%;bottom:24%;animation-delay:.7s}.mefx-spark.s4{right:16%;bottom:19%;animation-delay:1s}
@keyframes mefxFade{from{opacity:0}to{opacity:1}}@keyframes mefxPop{from{transform:scale(.87) translateY(14px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}@keyframes mefxFloat{50%{transform:translateY(-5px)}}@keyframes mefxSpark{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.5)}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.001ms!important}}
`;
const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
requestAnimationFrame(()=>document.body?.classList.add("mefx-ready"));
function reward(o={}){
 const title=o.title||"MISSIONE COMPLETATA",subtitle=o.subtitle||"Ottimo lavoro, Comandante.",credits=Number(o.credits??o.coins??0)||0,prestige=Number(o.prestige||0)||0,icon=o.icon||"⚓",button=o.button||"CONTINUA",key=o.key||"";
 if(key){try{if(sessionStorage.getItem("mefx_reward_"+key))return;sessionStorage.setItem("mefx_reward_"+key,"1")}catch(_){}}
 const wrap=document.createElement("div");wrap.className="mefx-reward";
 wrap.innerHTML='<div class="mefx-reward-card"><i class="mefx-spark s1"></i><i class="mefx-spark s2"></i><i class="mefx-spark s3"></i><i class="mefx-spark s4"></i><div class="mefx-crown">'+icon+'</div><div class="mefx-kicker">MARINA EMPIRE</div><div class="mefx-title">'+String(title)+'</div><div class="mefx-sub">'+String(subtitle)+'</div><div class="mefx-rewards"><div class="mefx-stat"><span>🪙 CREDITI</span><b>+'+credits.toLocaleString("it-IT")+'</b></div><div class="mefx-stat"><span>⭐ PRESTIGIO</span><b>+'+prestige.toLocaleString("it-IT")+'</b></div></div><button class="mefx-close" type="button">'+String(button)+'</button></div>';
 document.body.appendChild(wrap);
 const close=()=>{wrap.style.opacity="0";wrap.style.transition="opacity .18s";setTimeout(()=>wrap.remove(),180)};
 wrap.querySelector(".mefx-close").onclick=close;wrap.addEventListener("click",e=>{if(e.target===wrap)close()});
 try{navigator.vibrate?.([35,30,55])}catch(_){}
}
function highlight(selector){document.querySelector(selector)?.classList.add("mefx-pulse")}
window.MarinaEmpireFX={reward,highlight};
})();