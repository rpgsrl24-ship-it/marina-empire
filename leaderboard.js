(()=>{
"use strict";
if(window.__ME_LEADERBOARD__)return;
window.__ME_LEADERBOARD__=true;

const URL="https://zrdetqvnjmqkfyajxjgp.supabase.co";
const KEY="sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw";

const style=document.createElement("style");
style.textContent=".me-leaderboard{margin:14px 0;padding:12px;border:1px solid rgba(214,181,117,.38);border-radius:13px;background:#0b2835}.me-leaderboard h3{margin:0 0 8px;color:#f0d296}.me-leaderboard-list{display:grid;gap:7px}.me-leaderboard-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:8px;align-items:center;padding:9px 10px;border:1px solid rgba(214,181,117,.2);border-radius:10px;background:#0e3140}.me-leaderboard-rank{font-size:18px;font-weight:900;color:#f0d296;text-align:center}.me-leaderboard-name{font-weight:800}.me-leaderboard-meta{font-size:9px;color:#a9bec6}.me-leaderboard-score{font-weight:900;color:#fff;white-space:nowrap}.me-leaderboard-status{font-size:10px;color:#9fb7c0;margin-top:8px}@media(max-width:740px){.me-leaderboard{padding:10px}.me-leaderboard-row{grid-template-columns:34px minmax(0,1fr)}.me-leaderboard-score{grid-column:2}}";
document.head.appendChild(style);

let client=null,box=null,loading=false;

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
function renderRows(rows){
 if(!box)return;
 if(!rows.length){
  box.innerHTML='<h3>🏆 Classifica Empire</h3><p class="me-leaderboard-status">La classifica si popolerà con i giocatori registrati che hanno un salvataggio online.</p>';
  return;
 }
 box.innerHTML='<h3>🏆 Classifica Empire · giocatori reali</h3><div class="me-leaderboard-list">'+rows.map(r=>{
   const name=r.active_title?(String(r.active_title)+" · "+String(r.captain_name||"Comandante")):String(r.captain_name||"Comandante");
   return '<article class="me-leaderboard-row"><div class="me-leaderboard-rank">#'+esc(r.rank_position)+'</div><div><div class="me-leaderboard-name">'+esc(name)+'</div><div class="me-leaderboard-meta">'+esc(r.empire_tier)+(r.specialization?' · '+esc(specLabel(r.specialization)):'')+' · '+esc(r.voyages)+' viaggi</div></div><div class="me-leaderboard-score">'+Number(r.empire_score||0).toLocaleString("it-IT")+' pts</div></article>';
 }).join("")+'</div><div class="me-leaderboard-status">Solo dati di gioco pubblici. Nessuna email o informazione privata viene mostrata.</div>';
}
async function load(){
 if(loading||!ensure()||!window.supabase?.createClient)return;
 loading=true;
 box.innerHTML='<h3>🏆 Classifica Empire</h3><p class="me-leaderboard-status">Caricamento classifica…</p>';
 try{
  if(!client)client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const auth=await client.auth.getUser();
  if(!auth?.data?.user){
   box.innerHTML='<h3>🏆 Classifica Empire</h3><p class="me-leaderboard-status">Accedi con un account registrato per vedere la classifica reale dei comandanti.</p>';
   return;
  }
  const res=await client.rpc("me_leaderboard_top",{p_limit:25});
  if(res.error)throw res.error;
  renderRows(res.data||[]);
 }catch(e){
  box.innerHTML='<h3>🏆 Classifica Empire</h3><p class="me-leaderboard-status">Classifica momentaneamente non disponibile.</p>';
  console.warn("Marina Empire leaderboard:",e?.message||e);
 }finally{loading=false}
}
function boot(){
 if(!ensure()){setTimeout(boot,800);return}
 load();
 window.addEventListener("marina-empire-updated",()=>setTimeout(()=>{box=null;ensure();load()},120));
 setInterval(load,120000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();