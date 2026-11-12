(()=>{
"use strict";
if(window.MarinaEmpireFX)return;
const css=`
:root{--me-gold:#f5c84b;--me-blue:#0b83c8;--me-deep:#06243a}
html{scroll-behavior:smooth}
body.me-ready main,body.me-ready .page,body.me-ready .app{animation:mePageIn .38s ease-out both}
@keyframes mePageIn{from{opacity:.35;transform:translateY(5px)}to{opacity:1;transform:none}}
a,button,.tile,.card,.service,.post,.boat{transition:transform .16s ease,box-shadow .2s ease,filter .2s ease}
a:active,button:active,.tile:active,.service:active{transform:scale(.965)!important}
.me-ripple{position:relative;overflow:hidden}
.me-ripple:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--rx,50%) var(--ry,50%),#fff8 0 7%,transparent 8%);opacity:0;pointer-events:none}
.me-ripple.me-hit:after{animation:meRipple .42s ease-out}
@keyframes meRipple{0%{opacity:.9;transform:scale(.35)}100%{opacity:0;transform:scale(2.2)}}
.me-live-pulse{animation:meLive 1.9s ease-in-out infinite}
@keyframes meLive{50%{box-shadow:0 0 0 5px #62dc9f22,0 0 18px #62dc9f88}}
.me-next-glow{position:relative;overflow:hidden;border-color:#f5c84b!important;box-shadow:0 8px 22px #d39b2330!important}
.me-next-glow:before{content:"";position:absolute;inset:-2px;background:linear-gradient(115deg,transparent 20%,#fff8 42%,transparent 62%);transform:translateX(-130%);animation:meSweep 4.2s ease-in-out infinite;pointer-events:none}
@keyframes meSweep{0%,58%{transform:translateX(-130%)}78%,100%{transform:translateX(130%)}}
.me-reward{position:fixed;z-index:9999;inset:0;display:grid;place-items:center;padding:22px;background:#021623cc;backdrop-filter:blur(10px);animation:meFade .2s ease-out}
.me-reward-card{position:relative;width:min(420px,94vw);overflow:hidden;padding:22px 18px 18px;border:1px solid #ffe38d;border-radius:26px;background:linear-gradient(160deg,#073d68 0%,#0a78ad 56%,#06304f 100%);color:#fff;text-align:center;box-shadow:0 25px 70px #0009,0 0 35px #e9ba3944;animation:mePop .42s cubic-bezier(.2,.9,.25,1.2)}
.me-reward-card:before{content:"";position:absolute;inset:-45%;background:conic-gradient(from 0deg,transparent,#ffd95c33,transparent,#5cddff33,transparent);animation:meSpin 8s linear infinite}
.me-reward-card>*{position:relative;z-index:1}
.me-crown{font-size:42px;filter:drop-shadow(0 4px 10px #0005);animation:meFloat 1.6s ease-in-out infinite}
.me-reward h2{margin:5px 0 2px;font:800 24px Georgia,serif;letter-spacing:.03em}
.me-reward .me-sub{font-size:9px;color:#d9f3ff;font-weight:900;letter-spacing:.12em}
.me-reward-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0 12px}
.me-reward-stat{padding:12px;border:1px solid #8ee1ff66;border-radius:16px;background:#042d49aa}
.me-reward-stat span{display:block;font-size:7px;color:#caefff;font-weight:900}
.me-reward-stat b{display:block;margin-top:4px;font-size:22px;color:#ffe070}
.me-reward button{width:100%;min-height:48px;border:1px solid #ffe48b;border-radius:15px;background:linear-gradient(180deg,#ffe06a,#dba41d);color:#16334e;font-size:10px;font-weight:950}
.me-particle{position:fixed;z-index:10000;left:50%;top:48%;width:8px;height:8px;border-radius:50%;background:#ffd95c;pointer-events:none;animation:meBurst .9s ease-out forwards}
@keyframes meBurst{to{transform:translate(var(--dx),var(--dy)) scale(.1);opacity:0}}
@keyframes meFade{from{opacity:0}to{opacity:1}}
@keyframes mePop{from{opacity:0;transform:scale(.82) translateY(12px)}to{opacity:1;transform:none}}
@keyframes meFloat{50%{transform:translateY(-5px)}}
@keyframes meSpin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}
`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
function burst(){
  for(let i=0;i<18;i++){
    const p=document.createElement("i");p.className="me-particle";
    const a=(Math.PI*2*i)/18, d=70+Math.random()*90;
    p.style.setProperty("--dx",Math.cos(a)*d+"px");
    p.style.setProperty("--dy",Math.sin(a)*d+"px");
    p.style.background=i%3===0?"#63dfff":i%3===1?"#ffd95c":"#ffffff";
    document.body.appendChild(p);setTimeout(()=>p.remove(),950);
  }
}
function reward({title="MISSIONE COMPLETATA",subtitle="RICOMPENSA ACCREDITATA",coins=0,prestige=0,button="CONTINUA",onClose}={}){
  const o=document.createElement("div");o.className="me-reward";
  o.innerHTML='<div class="me-reward-card"><div class="me-crown">⚓</div><div class="me-sub">'+subtitle+'</div><h2>'+title+'</h2><div class="me-reward-grid"><div class="me-reward-stat"><span>🪙 CREDITI</span><b>+'+Number(coins||0).toLocaleString("it-IT")+'</b></div><div class="me-reward-stat"><span>⭐ PRESTIGIO</span><b>+'+Number(prestige||0).toLocaleString("it-IT")+'</b></div></div><button type="button">'+button+'</button></div>';
  o.querySelector("button").onclick=()=>{o.remove();try{onClose&&onClose()}catch(_){}};
  document.body.appendChild(o);burst();
}
function init(){
 document.body.classList.add("me-ready");
 document.querySelectorAll("a,button,.tile,.service,.card").forEach(el=>{
   if(el.disabled)return;el.classList.add("me-ripple");
   el.addEventListener("pointerdown",e=>{const r=el.getBoundingClientRect();el.style.setProperty("--rx",(e.clientX-r.left)+"px");el.style.setProperty("--ry",(e.clientY-r.top)+"px");el.classList.remove("me-hit");void el.offsetWidth;el.classList.add("me-hit")},{passive:true});
 });
 document.querySelectorAll(".badge,.dot,[class*=live]").forEach(el=>{if((el.textContent||"").toUpperCase().includes("LIVE")||el.classList.contains("dot"))el.classList.add("me-live-pulse")});
 document.getElementById("nextStepCard")?.classList.add("me-next-glow");
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init,{once:true}):init();
window.MarinaEmpireFX={reward,burst,init};
})();