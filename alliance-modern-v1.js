(()=>{"use strict";
const ENDPOINT="https://zrdetqvnjmqkfyajxjgp.supabase.co",KEY="sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw";
const actions=["create","join","leave","checkin"];
const cleanName=s=>String(s??"").trim().replace(/\s+/gu," ");
function validName(s){const n=cleanName(s);return Array.from(n).length>=3&&Array.from(n).length<=32&&/^[\p{L}\p{N} _-]+$/u.test(n)&&/\p{L}/u.test(n)}
const validId=s=>typeof s==="string"&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
function service(client,getHandle){
 async function account(){const id=getHandle()?.accountId;if(!id)return null;const {data,error}=await client.auth.getUser(),u=data?.user;return !error&&u?.id===id&&u.email_confirmed_at&&!u.is_anonymous&&getHandle()?.accountId===id?u:null}
 async function rpc(name,args){const u=await account();if(!u)throw Error("access_required");const r=await client.rpc(name,args);if(getHandle()?.accountId!==u.id)throw Error("access_required");if(r.error)throw r.error;return r.data}
 async function state(search=""){return rpc("me_club_state",{p_search:Array.from(String(search).trim()).slice(0,32).join("")})}
 async function act(action,value){if(!actions.includes(action)||action==="create"&&!validName(value)||action==="join"&&!validId(value))return{ok:false,message:"Operazione non valida"};
 return rpc("me_club_action",{p_action:action,p_name:action==="create"?cleanName(value):null,p_club_id:action==="join"?value:null})}
 return{account,state,act}
}
window.MarinaClubs=Object.freeze({cleanName,validName,validId,service});
if(typeof document==="undefined"||!document.getElementById("clubGate"))return;
const $=id=>document.getElementById(id),ctx=window.MarinaLocalSaveContext;
let svc=null,enabled=false,busy=false,revision=0,snapshot=null,sdkPromise=null;
const handle=()=>ctx?.capture?.()||null;
const node=(tag,value,cls)=>{const n=document.createElement(tag);if(value!=null)n.textContent=value;if(cls)n.className=cls;return n};
const fmt=n=>Math.max(0,Math.floor(Number(n)||0)).toLocaleString("it-IT");
function status(t){$("clubStatus").textContent=t}
function render(){
 const c=snapshot?.my_club,ready=enabled&&!busy&&!!snapshot;
 $("clubGate").hidden=enabled;
 $("clubMine").hidden=!enabled||!c;$("clubCreate").hidden=!enabled||!!c;$("clubDirectory").hidden=!enabled;
 $("clubName").disabled=!ready||!!c;$("clubCreateButton").disabled=!ready||!!c;
 $("clubSearch").disabled=!ready;$("clubSearchButton").disabled=!ready;$("clubRefresh").disabled=!enabled||busy;
 $("clubLeave").disabled=!ready||!c;$("clubCheckin").disabled=!ready||!c||snapshot.checked_today;
 if(c){
 $("myClubName").textContent=c.name;$("myClubCount").textContent=fmt(c.member_count)+" / "+fmt(snapshot.capacity);
 const count=Math.max(0,Number(c.weekly_checkins)||0),goal=Math.max(1,Number(snapshot.week_goal)||7);
 $("clubGoal").textContent=fmt(count)+" / "+fmt(goal);$("clubGoalFill").style.width=Math.min(100,count/goal*100)+"%";
 $("clubGoalBar").setAttribute("aria-valuenow",Math.min(count,goal));$("clubGoalBar").setAttribute("aria-valuemax",goal);
 $("clubGoalNote").textContent=count>=goal?"🏆 Traguardo settimanale raggiunto!": "Presenze condivise · settimana dal "+snapshot.week_start+" (UTC)";
 $("clubCheckin").textContent=snapshot.checked_today?"PRESENZA GIÀ REGISTRATA OGGI":"REGISTRA LA TUA PRESENZA";
 $("clubMembers").replaceChildren(...(Array.isArray(c.members)?c.members:[]).map(m=>{const n=node("div",null,"memberRow");n.append(node("span",m.name||"Comandante"),node("small",m.is_me?"TU":"MEMBRO"));return n}));
 }else{$("myClubName").textContent="";$("clubMembers").replaceChildren();}
 const clubs=Array.isArray(snapshot?.clubs)?snapshot.clubs:[];
 $("clubResults").replaceChildren(...(clubs.length?clubs.map(v=>{const a=node("article",null,"clubResult");
 a.append(node("strong",v.name),node("p",fmt(v.member_count)+" / "+fmt(snapshot.capacity)+" comandanti"));
 const btn=node("button",v.id===c?.id?"IL TUO CLUB":Number(v.member_count)>=Number(snapshot.capacity)?"AL COMPLETO":"ADERISCI","clubButton");btn.type="button";btn.disabled=!ready||!!c||Number(v.member_count)>=Number(snapshot.capacity);btn.dataset.clubJoin=v.id;btn.onclick=()=>run("join",v.id);a.append(btn);return a}):[node("p",enabled?"Nessun club trovato. Puoi fondarne uno gratuitamente.":"Accedi per consultare i club.","clubNote")]));
}
async function load(message){
 if(!enabled||busy||!svc)return;
 const token=++revision;busy=true;render();
 try{const data=await svc.state($("clubSearch").value);if(token!==revision)return;snapshot=data;status(message||"Club aggiornati · dati online");}
 catch(e){if(token===revision){snapshot=null;if(e?.message==="access_required")enabled=false;status("Club non disponibili. Accedi di nuovo o riprova.");}}
 finally{if(token===revision){busy=false;render()}}
}
async function run(action,value){
 if(!enabled||busy||!snapshot)return;
 if(action==="create"&&!validName(value)){status("Nome del club: 3–32 caratteri, lettere, numeri, spazi, trattini.");return}
 if(action==="leave"&&!confirm("Vuoi lasciare il club? Se sei l'ultimo membro, il club verrà chiuso."))return;
 if(action==="join"&&!confirm("Vuoi aderire a questo club?"))return;
 const token=++revision;busy=true;render();
 try{const r=await svc.act(action,value);if(token!==revision)return;status(r?.message||"Operazione non confermata");
 if(r?.ok&&action==="create")$("clubName").value="";
 // Read back from the server after every action, even a rejected one.
 snapshot=await svc.state($("clubSearch").value);
 }catch(e){if(token===revision){snapshot=null;if(e?.message==="access_required")enabled=false;status("Operazione non confermata. Aggiorna per controllare lo stato.");}}
 finally{if(token===revision){busy=false;render()}}
}
function sdk(){if(window.supabase?.createClient)return Promise.resolve(window.supabase);if(sdkPromise)return sdkPromise;sdkPromise=new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/dist/umd/supabase.min.js";s.onload=()=>window.supabase?.createClient?resolve(window.supabase):reject(Error("sdk"));s.onerror=()=>reject(Error("sdk"));document.head.append(s)});return sdkPromise}
async function init(){const token=++revision;enabled=false;snapshot=null;busy=false;render();if(!handle()?.accountId){status("Accedi con un account con email confermata per fondare o unirti a un club.");return}
 status("Verifica account…");try{const lib=await sdk(),client=window.__meClubClient||lib.createClient(ENDPOINT,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});window.__meClubClient=client;svc=service(client,handle);const user=await svc.account();if(token!==revision)return;if(!user){status("Accedi e conferma l'email.");return}enabled=true;await load()}catch(_){if(token===revision){enabled=false;render();status("Servizio club temporaneamente non disponibile.")}}}
$("clubCreateForm").onsubmit=e=>{e.preventDefault();run("create",$("clubName").value)};
$("clubSearchForm").onsubmit=e=>{e.preventDefault();load()};
$("clubRefresh").onclick=()=>load();$("clubLeave").onclick=()=>run("leave");$("clubCheckin").onclick=()=>run("checkin");
const h=handle(),g=h&&ctx.readGame(h);if(g){$("prestige").textContent=fmt(g.prestige);$("voyages").textContent=fmt(g.voyages);$("fleet").textContent=fmt(Array.isArray(g.owned)?g.owned.length:1);$("captain").textContent=g.name||"Comandante"}
window.addEventListener("storage",e=>{if(e.key==="marina_empire_local_context_v1"||e.key?.startsWith("sb-")&&e.key.endsWith("-auth-token")){revision++;enabled=false;busy=false;snapshot=null;render();status("Sessione modificata. Ricarica la pagina.")}});
init();
})();
