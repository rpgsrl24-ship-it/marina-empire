(()=>{
"use strict";
if(window.__ME_LEADERBOARD__)return;
window.__ME_LEADERBOARD__=true;

const URL="https://zrdetqvnjmqkfyajxjgp.supabase.co";
const KEY="sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw";

const style=document.createElement("style");
style.textContent=".me-leaderboard{margin:14px 0;padding:12px;border:1px solid rgba(214,181,117,.38);border-radius:13px;background:#0b2835}.me-leaderboard h3{margin:0 0 8px;color:#f0d296}.me-lb-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 10px}.me-lb-tabs button{padding:7px 10px;border-radius:999px;border:1px solid rgba(214,181,117,.35);background:#123847;color:#dce7ea}.me-lb-tabs button.on{background:#6b532b;color:#fff}.me-leaderboard-list{display:grid;gap:7px}.me-leaderboard-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:8px;align-items:center;padding:9px 10px;border:1px solid rgba(214,181,117,.2);border-radius:10px;background:#0e3140}.me-leaderboard-row.me-lb-me{outline:1px solid rgba(214,181,117,.75)}.me-leaderboard-rank{font-size:18px;font-weight:900;color:#f0d296;text-align:center}.me-leaderboard-name{font-weight:800}.me-leaderboard-meta{font-size:9px;color:#a9bec6}.me-leaderboard-score{font-weight:900;color:#fff;white-space:nowrap}.me-leaderboard-status{font-size:10px;color:#9fb7c0;margin-top:8px}.me-season-note{padding:8px 10px;margin:8px 0;border:1px solid rgba(214,181,117,.22);border-radius:9px;background:#102f3d;font-size:10px;color:#c9d9de}@media(max-width:740px){.me-leaderboard{padding:10px}.me-leaderboard-row{grid-template-columns:34px minmax(0,1fr)}.me-leaderboard-score{grid-column:2}}";
document.head.appendChild(style);

let client=null,box=null,loading=false,mode="absolute";

function host(){return document.getElementById("careerPanel")}
function ensure(){
 const h=host();if(!h)return false;
 if(box&&box.isConnected)return true;
 box=document.createElement("section");
 box.className="me-leaderboard";
 box.id="meEmpireLeaderboard";
 h.appendChild(box);
 return true;
}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function specLabel(k){
 const map={charter:"🛥️ Charter Operator",broker:"💼 Broker Nautico",tecnica:"🔧 Tecnico",marina:"⚓ Marina Manager",servizi:"✨ Concierge"};
 return map[k]||"";
}
function tabs(){
 return '<div class="me-lb-tabs"><button type="button" data-lb-mode="absolute" class="'+(mode==="absolute"?"on":"")+'">ASSOLUTA</button><button type="button" data-lb-mode="weekly" class="'+(mode==="weekly"?"on":"")+'">SETTIMANA</button><button type="button" data-lb-mode="monthly" class="'+(mode==="monthly"?"on":"")+'">MESE</button></div>';
}
function title(){
 return mode==="weekly"?"🏁 Classifica Settimanale":mode==="monthly"?"📅 Classifica Mensile":"🏆 Classifica Empire";
}
function renderRows(rows,seasonInfo){
 if(!box)return;
 const season=mode!=="absolute";
 const note=season?'<div class="me-season-note">La classifica stagionale misura i <b>punti Empire guadagnati nel periodo</b>, non il totale storico. I nuovi giocatori possono quindi competere subito.'+(seasonInfo?.season_key?' · Periodo '+esc(seasonInfo.season_key):'')+'</div>':'';
 if(!rows.length){
  box.innerHTML='<h3>'+title()+'</h3>'+tabs()+note+'<p class="me-leaderboard-status">Nessun giocatore classificato in questo periodo.</p>';
  bindTabs();return;
 }
 box.innerHTML='<h3>'+title()+' · giocatori reali</h3>'+tabs()+note+'<div class="me-leaderboard-list">'+rows.map(r=>{
   const name=r.active_title?(String(r.active_title)+" · "+String(r.captain_name||"Comandante")):String(r.captain_name||"Comandante");
   const score=season?Number(r.season_points||0):Number(r.empire_score||0);
   const suffix=season?" punti stagione":" pts";
   const voyages=season?Number(r.voyages_delta||0):Number(r.voyages||0);
   const voyageLabel=season?" viaggi nel periodo":" viaggi";
   return '<article class="me-leaderboard-row '+(r.is_me?'me-lb-me':'')+'"><div class="me-leaderboard-rank">#'+esc(r.rank_position)+'</div><div><div class="me-leaderboard-name">'+esc(name)+'</div><div class="me-leaderboard-meta">'+esc(r.empire_tier)+(r.specialization?' · '+esc(specLabel(r.specialization)):'')+' · '+voyages+voyageLabel+'</div></div><div class="me-leaderboard-score">'+score.toLocaleString("it-IT")+suffix+'</div></article>';
 }).join("")+'</div><div class="me-leaderboard-status">Solo dati di gioco pubblici. Nessuna email o informazione privata viene mostrata.</div>';
 bindTabs();
}
function bindTabs(){
 box?.querySelectorAll("[data-lb-mode]").forEach(b=>b.addEventListener("click",()=>{if(mode===b.dataset.lbMode)return;mode=b.dataset.lbMode;load(true)}));
}
async function ensureClient(){
 if(!client)client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 return client;
}
async function load(force=false){
 if((loading&&!force)||!ensure()||!window.supabase?.createClient)return;
 loading=true;
 box.innerHTML='<h3>'+title()+'</h3>'+tabs()+'<p class="me-leaderboard-status">Caricamento classifica…</p>';
 bindTabs();
 try{
  const c=await ensureClient();
  const auth=await c.auth.getUser();
  if(!auth?.data?.user){
   box.innerHTML='<h3>'+title()+'</h3>'+tabs()+'<p class="me-leaderboard-status">Accedi con un account registrato per vedere le classifiche reali dei comandanti.</p>';
   bindTabs();return;
  }
  if(mode==="absolute"){
   const res=await c.rpc("me_leaderboard_top",{p_limit:25});
   if(res.error)throw res.error;
   renderRows(res.data||[],null);
  }else{
   const sync=await c.rpc("me_season_sync",{p_type:mode});
   if(sync.error)throw sync.error;
   const res=await c.rpc("me_season_leaderboard",{p_type:mode,p_limit:25});
   if(res.error)throw res.error;
   renderRows(res.data||[],sync.data?.[0]||null);
  }
 }catch(e){
  box.innerHTML='<h3>'+title()+'</h3>'+tabs()+'<p class="me-leaderboard-status">Classifica momentaneamente non disponibile.</p>';
  bindTabs();
  console.warn("Marina Empire leaderboard:",e?.message||e);
 }finally{loading=false}
}
function boot(){
 if(!ensure()){setTimeout(boot,800);return}
 load();
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;ensure();load()},180));
 setInterval(load,180000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();