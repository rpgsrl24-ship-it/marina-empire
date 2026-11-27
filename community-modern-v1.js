(()=>{"use strict";
const ENDPOINT="https://zrdetqvnjmqkfyajxjgp.supabase.co",KEY="sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw";
const ports={rose:"Isola delle Rose",rimini:"Rimini",ancona:"Ancona",lignano:"Lignano",cervia:"Cervia",bari:"Bari",ravenna:"Ravenna",pescara:"Pescara",brindisi:"Brindisi",salerno:"Salerno",nettuno:"Nettuno",scarlino:"Scarlino",loano:"Loano",portocervo:"Porto Cervo",capodorlando:"Capo d'Orlando"};
const reasons=["Spam o pubblicità indesiderata","Insulti o molestie","Dati personali","Contenuto inappropriato"];
function roomFor(mode,port){return mode==="marina"&&Object.hasOwn(ports,port)?"marina-"+port:"global"}
function validRoom(room){return room==="global"||Object.keys(ports).some(p=>room==="marina-"+p)}
function verified(u,id){return !!(u?.id&&u.id===id&&u.email_confirmed_at&&!u.is_anonymous)}
function messageText(value){return Array.from(String(value??"").trim()).slice(0,240).join("")}
function reportPayload(m,room,reason){
 if(!m||!validRoom(room)||!reasons.includes(reason)||!m.body||!m.captain_name)return null;
 return{marina_id:room,reported_name:Array.from(String(m.captain_name)).slice(0,40).join(""),message_excerpt:messageText(m.body),reason,status:"pending"};
}
function service(client,getHandle){
 async function account(){const h=getHandle();if(!h?.accountId)return null;const {data,error}=await client.auth.getUser();if(error||!verified(data?.user,h.accountId)||getHandle()?.accountId!==h.accountId)return null;return data.user}
 async function list(room){if(!validRoom(room)||!await account())throw Error("access_required");
 const r=await client.from("me_community_messages").select("id,created_at,captain_name,body,room").eq("room",room).eq("status","active").order("id",{ascending:false}).limit(40);
 if(r.error)throw r.error;return (r.data||[]).slice().reverse()}
 async function send(room,body){const text=messageText(body);if(!validRoom(room)||!text||!await account())throw Error("access_required");
 // The existing database trigger supplies the authoritative captain name and user id.
 const r=await client.from("me_community_messages").insert({room,body:text});if(r.error)throw r.error}
 async function report(m,room,reason){const payload=reportPayload(m,room,reason);if(!payload||!await account())throw Error("access_required");
 const r=await client.from("me_chat_reports").insert(payload);if(r.error)throw r.error}
 return{account,list,send,report}
}
window.MarinaCommunity=Object.freeze({ports,reasons,roomFor,validRoom,verified,messageText,reportPayload,service});
if(typeof document==="undefined"||!document.getElementById("communityChat"))return;
const $=id=>document.getElementById(id),ctx=window.MarinaLocalSaveContext;
let svc=null,enabled=false,busy=false,loading=false,room="global",generation=0,nextSend=0,rows=[],sdkPromise=null;
const fmt=n=>Math.max(0,Math.round(Number(n)||0)).toLocaleString("it-IT");
function getHandle(){return ctx?.capture?.()||null}
function game(){const h=getHandle();return h&&ctx.readGame(h)}
function node(tag,txt,cls){const n=document.createElement(tag);if(txt!=null)n.textContent=txt;if(cls)n.className=cls;return n}
function setStatus(text){$("chatStatus").textContent=text}
function setEnabled(ok){enabled=ok;$("chatBody").disabled=!ok||busy;$("chatSend").disabled=!ok||busy;$("chatRoom").disabled=!ok;$("chatRefresh").disabled=!ok||loading;$("chatGate").hidden=ok;}
function render(){
 const feed=$("chatMessages");
 if(!enabled){feed.replaceChildren(node("p","Accedi con un account verificato per leggere e scrivere nella chat.","chatNote"));return}
 if(!rows.length){feed.replaceChildren(node("p","Nessun messaggio in questa stanza. Puoi iniziare la conversazione.","chatNote"));return}
 feed.replaceChildren(...rows.map(m=>{const card=node("article",null,"chatMessage");const header=node("div",null,"chatMessageHead");
 const name=node("strong",m.captain_name||"Comandante"),date=new Date(m.created_at);
 header.append(name,node("small",Number.isFinite(date.getTime())?date.toLocaleString("it-IT",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):""));
 const body=node("p",m.body||"");
 const b=node("button","SEGNALA","chatReport");b.type="button";b.dataset.communityReport=String(m.id);b.onclick=()=>openReport(m);card.append(header,body,b);return card}));
}
function openReport(m){
 if(!enabled||busy)return;
 const panel=$("reportPanel");panel.hidden=false;$("reportExcerpt").textContent=m.body;$("reportReason").value=reasons[0];
 $("reportSubmit").onclick=async()=>{if(busy||!enabled)return;busy=true;setEnabled(true);$("reportSubmit").disabled=true;
 try{await svc.report(m,m.room,$("reportReason").value);panel.hidden=true;setStatus("Segnalazione inviata per la revisione dell'amministratore.")}
 catch(_){setStatus("Segnalazione non inviata. Verifica l'accesso e riprova.")}
 finally{busy=false;$("reportSubmit").disabled=false;setEnabled(enabled)}};
 panel.scrollIntoView({block:"nearest"});
}
function refreshRoom(){
 const g=game(),port=Object.hasOwn(ports,g?.port)?g.port:"rimini";
 $("roomMarinaName").textContent="⚓ "+ports[port]+" · marina di gioco";
 room=roomFor($("chatRoom").value,port);generation++;rows=[];render();
}
async function load(){
 if(!svc||!enabled||loading||document.hidden)return;loading=true;const token=generation,target=room;
 $("chatRefresh").disabled=true;
 try{const data=await svc.list(target);if(token===generation&&enabled){rows=data;render();setStatus("Stanza aggiornata · "+rows.length+" ultimi messaggi");}}
 catch(_){if(token===generation){rows=[];render();setStatus("Chat non disponibile o sessione scaduta. Riprova o accedi di nuovo.");}}
 finally{loading=false;$("chatRefresh").disabled=!enabled;if(token!==generation&&enabled)load()}
}
function sdk(){
 if(window.supabase?.createClient)return Promise.resolve(window.supabase);
 if(sdkPromise)return sdkPromise;
 sdkPromise=new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/dist/umd/supabase.min.js";s.onload=()=>window.supabase?.createClient?resolve(window.supabase):reject(Error("sdk"));s.onerror=()=>reject(Error("sdk"));document.head.append(s)});
 return sdkPromise
}
async function init(){
 const h=getHandle();setEnabled(false);rows=[];render();refreshRoom();
 if(!h?.accountId){setStatus("Community riservata agli account con email confermata.");return}
 setStatus("Verifica account…");
 try{const lib=await sdk(),client=window.__meCommunityClient||lib.createClient(ENDPOINT,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});window.__meCommunityClient=client;
 svc=service(client,getHandle);const user=await svc.account();if(!user){setStatus("Accedi e conferma l'email per partecipare.");return}
 setEnabled(true);await load();
 }catch(_){setEnabled(false);setStatus("Servizio Community non disponibile. Riprova dall'account.");}
}
$("chatRoom").onchange=()=>{refreshRoom();$("reportPanel").hidden=true;load()};
$("chatRefresh").onclick=()=>load();$("reportCancel").onclick=()=>$("reportPanel").hidden=true;
$("chatForm").onsubmit=async e=>{e.preventDefault();if(!enabled||busy||Date.now()<nextSend)return;const body=messageText($("chatBody").value);if(!body){setStatus("Scrivi un messaggio.");return}
 if(/https?:\/\/|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(body)){setStatus("Non condividere link o indirizzi email nella chat.");return}
 busy=true;setEnabled(true);const target=room;
 try{await svc.send(target,body);$("chatBody").value="";nextSend=Date.now()+2500;setStatus("Messaggio inviato.");await load()}
 catch(_){setStatus("Invio non riuscito. Verifica l'account e attendi qualche secondo.")}
 finally{busy=false;setEnabled(enabled)}
};
const g=game();if(g){$("coins").textContent=fmt(g.coins);$("prestige").textContent=fmt(g.prestige);$("pPrestige").textContent=fmt(g.prestige);$("captain").textContent=g.name||"Comandante";$("voyages").textContent=fmt(g.voyages);$("fleet").textContent=Array.isArray(g.owned)?g.owned.length:1;$("level").textContent="LIV. "+(1+Math.floor(Math.max(0,Number(g.prestige)||0)/200));$("marina").textContent=ports[g.port]||"Marina di gioco"}
for(const reason of reasons){const o=node("option",reason);o.value=reason;$("reportReason").append(o)}
const world=window.MarinaWorldLive?.current();if(world){$("communityEventTitle").textContent=world.icon+" "+world.title;$("communityEventText").textContent=world.bonus+" · "+world.detail}
init();setInterval(()=>{if(enabled&&!busy&&!document.hidden){const h=getHandle();if(!h?.accountId){setEnabled(false);rows=[];render();return}load()}},15000);
window.addEventListener("storage",e=>{if(e.key==="marina_empire_local_context_v1"||e.key?.startsWith("sb-")&&e.key.endsWith("-auth-token")){generation++;setEnabled(false);rows=[];render();setStatus("Sessione modificata: ricarica la Community.");}});
})();
