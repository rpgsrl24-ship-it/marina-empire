(()=>{
"use strict";
if(window.__ME_ACHIEVEMENTS__)return;
window.__ME_ACHIEVEMENTS__=true;

const style=document.createElement("style");
style.textContent=".me-achievements{margin:14px 0}.me-achievements-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.me-achievement{padding:10px;border:1px solid rgba(214,181,117,.25);border-radius:10px;background:#0c2b38}.me-achievement.done{border-color:rgba(214,181,117,.65)}.me-achievement strong{color:#f2d495}.me-achievement p{margin:4px 0;font-size:10px}.me-achievement progress{width:100%;accent-color:#d6b575}.me-achievement button{margin-top:7px;padding:7px 9px;border-radius:8px;border:1px solid rgba(214,181,117,.45);background:#1b4758;color:#fff}.me-title-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.me-title-row button{padding:6px 8px;border-radius:999px;border:1px solid rgba(214,181,117,.4);background:#113746;color:#fff}.me-title-row button.on{background:#70562c}@media(max-width:740px){.me-achievements-grid{grid-template-columns:1fr}}";
document.head.appendChild(style);

function host(){return document.getElementById("careerPanel")}
function render(){
 const h=host(),api=window.MarinaEmpireAchievements;if(!h||!api)return;
 let box=document.getElementById("meAchievements");
 if(!box){box=document.createElement("section");box.id="meAchievements";box.className="me-achievements";h.appendChild(box);}
 const list=api.unlocked(),titles=[...(new Set((window.MarinaEmpireAchievements?.unlocked?.()||[]).filter(a=>a.claimed).map(a=>a.title)))];
 const active=api.activeTitle?.()||"";
 box.innerHTML='<h3>🏆 Trofei e titoli</h3><div class="me-achievements-grid">'+list.map(a=>'<article class="me-achievement '+(a.claimed?'done':'')+'"><strong>'+a.icon+' '+a.title+'</strong><p>'+a.desc+'</p><p>'+Math.min(a.progress,a.target)+' / '+a.target+' · '+a.reward.toLocaleString("it-IT")+' crediti · prestigio +'+a.prestige+'</p><progress max="'+a.target+'" value="'+Math.min(a.progress,a.target)+'"></progress><button type="button" data-ach="'+a.id+'" '+(!a.unlocked||a.claimed?'disabled':'')+'>'+(a.claimed?'TROFEO OTTENUTO':a.unlocked?'RISCATTA TROFEO':'IN CORSO')+'</button></article>').join("")+'</div><div class="item" style="margin-top:10px"><strong>🎖️ Titolo pubblico</strong><p>Scegli uno dei titoli ottenuti da mostrare nel tuo profilo.</p><div class="me-title-row">'+(titles.length?titles.map(t=>'<button type="button" data-title="'+String(t).replace(/"/g,"&quot;")+'" class="'+(active===t?'on':'')+'">'+t+'</button>').join(""):'<span class="small muted">Nessun titolo ancora sbloccato.</span>')+'</div><div id="meAchievementStatus" class="small muted" style="margin-top:6px"></div></div>';
 box.querySelectorAll("[data-ach]").forEach(b=>b.addEventListener("click",()=>{const r=api.claim(b.dataset.ach);const s=box.querySelector("#meAchievementStatus");if(s)s.textContent=r?.message||"";if(r?.ok)setTimeout(render,300);}));
 box.querySelectorAll("[data-title]").forEach(b=>b.addEventListener("click",()=>{const r=api.setTitle(b.dataset.title);const s=box.querySelector("#meAchievementStatus");if(s)s.textContent=r?.message||"";if(r?.ok)setTimeout(render,200);}));
}
function boot(){render();window.addEventListener("marina-empire-updated",()=>setTimeout(render,80));setInterval(render,60000)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();