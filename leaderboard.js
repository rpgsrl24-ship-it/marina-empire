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
function seasonCountdown(){
 const now=new Date(),end=new Date(now);
 if(mode==="weekly"){
  const day=(now.getUTCDay()+6)%7;
  end.setUTCDate(now.getUTCDate()-day+7);
  end.setUTCHours(0,0,0,0);
 }else{
  end.setUTCMonth(now.getUTCMonth()+1,1);
  end.setUTCHours(0,0,0,0);
 }
 const ms=Math.max(0,end.getTime()-now.getTime());
 const d=Math.floor(ms/86400000),h=Math.floor((ms%86400000)/3600000),m=Math.floor((ms%3600000)/60000);
 return d+"g "+h+"h "+m+"m";
}
function seasonPrize(rank){
 rank=Number(rank)||0;
 if(mode==="weekly"){
  if(rank===1)return "4.000 crediti + 80 prestigio";
  if(rank===2)return "2.500 crediti + 55 prestigio";
  if(rank===3)return "1.500 crediti + 40 prestigio";
  if(rank>0&&rank<=10)return "600 crediti + 18 prestigio";
 }
 if(mode==="monthly"){
  if(rank===1)return "12.000 crediti + 250 prestigio";
  if(rank===2)return "8.000 crediti + 180 prestigio";
  if(rank===3)return "5.000 crediti + 120 prestigio";
  if(rank>0&&rank<=10)return "2.000 crediti + 55 prestigio";
 }
 return "";
}
function seasonTarget(rows,me){
 if(!me)return "";
 const rank=Number(me.rank_position)||0,points=Number(me.season_points)||0;
 const sorted=[...rows].sort((a,b)=>(Number(a.rank_position)||999)-(Number(b.rank_position)||999));
 if(rank>1){
  const ahead=sorted.find(r=>Number(r.rank_position)===rank-1);
  if(ahead){
   const need=Math.max(1,(Number(ahead.season_points)||0)-points+1);
   return "Per salire al #"+(rank-1)+" servono "+need.toLocaleString("it-IT")+" punti";
  }
 }
 if(rank===1)return "Sei al comando della stagione";
 return "";
}
function seasonZone(rank){
 rank=Number(rank)||0;
 if(rank===1)return "🥇 LEADER";
 if(rank<=3&&rank>0)return "🏆 PODIO";
 if(rank<=10&&rank>0)return "🎁 ZONA PREMIO";
 return "FUORI TOP 10";
}
function seasonMilestone(rows,me){
 if(!me)return "";
 const rank=Number(me.rank_position)||0,points=Number(me.season_points)||0;
 const sorted=[...rows].sort((a,b)=>(Number(a.rank_position)||999)-(Number(b.rank_position)||999));
 const targetRank=rank>10?10:rank>3?3:rank>1?1:0;
 if(!targetRank)return "";
 const target=sorted.find(r=>Number(r.rank_position)===targetRank);
 if(!target)return "";
 const need=Math.max(1,(Number(target.season_points)||0)-points+1);
 const label=targetRank===10?"Top 10":targetRank===3?"Podio":"1° posto";
 return "Per "+label+" servono "+need.toLocaleString("it-IT")+" punti";
}
function rankMovement(me,seasonInfo){
 if(!me||!seasonInfo?.season_key)return "";
 const key="me-lb-rank|"+mode+"|"+String(seasonInfo.season_key);
 const current=Number(me.rank_position)||0;
 let previous=0;
 try{previous=Number(localStorage.getItem(key))||0;localStorage.setItem(key,String(current))}catch(_){}
 if(!previous||!current||previous===current)return "";
 const diff=previous-current;
 return diff>0?"📈 +"+diff+" posizioni dall'ultima visita":"📉 "+Math.abs(diff)+" posizioni dall'ultima visita";
}
function seasonRivals(rows,me){
 if(!me)return "";
 const rank=Number(me.rank_position)||0,points=Number(me.season_points)||0;
 const ahead=rows.find(r=>Number(r.rank_position)===rank-1);
 const behind=rows.find(r=>Number(r.rank_position)===rank+1);
 const parts=[];
 if(ahead){
  const gap=Math.max(0,(Number(ahead.season_points)||0)-points);
  parts.push("⬆️ "+esc(ahead.captain_name||"Rivale")+" · "+gap.toLocaleString("it-IT")+" punti avanti");
 }
 if(behind){
  const gap=Math.max(0,points-(Number(behind.season_points)||0));
  parts.push("⬇️ "+esc(behind.captain_name||"Rivale")+" · "+gap.toLocaleString("it-IT")+" punti dietro");
 }
 return parts.join("<br>");
}
function renderRows(rows,seasonInfo){
 if(!box)return;
 const season=mode!=="absolute";
 const me=season?rows.find(r=>r.is_me):null;
 const prize=seasonPrize(me?.rank_position);
 const target=seasonTarget(rows,me);
 const milestone=seasonMilestone(rows,me);
 const movement=rankMovement(me,seasonInfo);
 const rivals=seasonRivals(rows,me);
 const zone=me?seasonZone(me.rank_position):"";
 const center=season?'<div class="me-season-note"><b>Centro Stagione</b> · chiusura tra '+seasonCountdown()+(me?' · posizione #'+esc(me.rank_position)+' · '+Number(me.season_points||0).toLocaleString("it-IT")+' punti · '+zone:' · non ancora classificato')+(prize?' · premio potenziale '+prize:'')+(movement?'<br><b>Trend:</b> '+movement:'')+(target?'<br><b>Prossimo passo:</b> '+target:'')+(milestone?'<br><b>Traguardo:</b> '+milestone:'')+(rivals?'<br><b>Rivali:</b><br>'+rivals:'')+'</div>':'';
 const note=season?center+'<div class="me-season-note">La classifica stagionale misura i <b>punti Empire guadagnati nel periodo</b>, non il totale storico. I nuovi giocatori possono quindi competere subito.'+(seasonInfo?.season_key?' · Periodo '+esc(seasonInfo.season_key):'')+'<div style="margin-top:8px"><button type="button" id="meSeasonClaim">🎁 RISCATTA PREMIO STAGIONE PRECEDENTE</button></div><div id="meSeasonClaimStatus" class="me-leaderboard-status"></div></div>':'';
 if(!rows.length){
  box.innerHTML='<h3>'+title()+'</h3>'+tabs()+note+'<p class="me-leaderboard-status">Nessun giocatore classificato in questo periodo.</p>';
  bindTabs();bindSeasonClaim();return;
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
 bindSeasonClaim();
}
async function claimSeasonReward(){
 if(mode==="absolute"||!client)return;
 const status=box?.querySelector("#meSeasonClaimStatus"),btn=box?.querySelector("#meSeasonClaim");
 if(btn)btn.disabled=true;if(status)status.textContent="Verifica premio stagione…";
 try{
  const res=await client.rpc("me_claim_season_reward",{p_type:mode});
  if(res.error)throw res.error;
  const reward=res.data?.[0];
  const applied=window.MarinaEmpireSeasonRewards?.apply?.(reward)||{ok:false,message:reward?.message||"Premio non disponibile."};
  if(status)status.textContent=applied.message||reward?.message||"";
  if(applied.ok)window.dispatchEvent(new CustomEvent("marina-empire-updated",{detail:{reason:"season-reward"}}));
 }catch(e){
  if(status)status.textContent="Premio stagione non disponibile.";
  console.warn("Marina Empire season reward:",e?.message||e);
 }finally{if(btn)btn.disabled=false}
}
function bindSeasonClaim(){
 const btn=box?.querySelector("#meSeasonClaim");
 if(btn)btn.addEventListener("click",claimSeasonReward);
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
  bindTabs();bindSeasonClaim();
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