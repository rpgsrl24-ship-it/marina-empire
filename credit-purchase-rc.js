(function(){
"use strict";
const CONFIG={
  enabled:true,
  directCheckoutReady:true,
  liveProductIds:[38090],
  supabaseUrl:"https://zrdetqvnjmqkfyajxjgp.supabase.co",
  publishableKey:"sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw",
  packages:[
    {productId:38090,sku:"ME-CREDITS-50000",credits:50000,price:"4,99"},
    {productId:38091,sku:"ME-CREDITS-120000",credits:120000,price:"9,99"},
    {productId:38092,sku:"ME-CREDITS-300000",credits:300000,price:"19,99"},
    {productId:38093,sku:"ME-CREDITS-900000",credits:900000,price:"49,99"},
    {productId:38094,sku:"ME-CREDITS-2000000",credits:2000000,price:"99,99"}
  ]
};
window.MarinaEmpireCreditShopRC=Object.freeze(CONFIG);

const fmt=n=>new Intl.NumberFormat("it-IT").format(Number(n)||0);
let client=null,busy=false,loaderPromise=null;
async function ensureSupabase(){
  if(window.supabase?.createClient)return window.supabase;
  if(loaderPromise)return loaderPromise;
  loaderPromise=new Promise((resolve,reject)=>{
    const sources=[
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.95.0/dist/umd/supabase.min.js",
      "https://unpkg.com/@supabase/supabase-js@2.95.0/dist/umd/supabase.min.js"
    ];
    let i=0;
    const next=()=>{
      if(i>=sources.length){reject(new Error("supabase_unavailable"));return}
      const s=document.createElement("script"),src=sources[i++];
      let done=false;
      const finish=ok=>{
        if(done)return;done=true;clearTimeout(timer);s.onload=s.onerror=null;
        if(ok&&window.supabase?.createClient){resolve(window.supabase);return}
        try{s.remove()}catch(_){}
        next();
      };
      const timer=setTimeout(()=>finish(false),4500);
      s.async=true;s.src=src;s.onload=()=>finish(true);s.onerror=()=>finish(false);
      document.head.appendChild(s);
    };
    next();
  });
  return loaderPromise;
}
async function getClient(){
  if(client)return client;
  const lib=await ensureSupabase();
  client=lib.createClient(CONFIG.supabaseUrl,CONFIG.publishableKey,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  return client;
}
async function currentUser(){
  const c=await getClient();
  const {data,error}=await c.auth.getUser();
  if(error||!data?.user?.id||!data.user.email_confirmed_at)return null;
  return data.user;
}
async function walletBalance(){
  const user=await currentUser();
  if(!user)return null;
  const c=await getClient();
  const {data,error}=await c.from("me_credit_wallets").select("balance").eq("user_id",user.id).maybeSingle();
  if(error)throw error;
  return Number(data?.balance||0);
}
function setStatus(message,isError=false){
  const el=document.getElementById("meCreditPurchaseStatus");
  if(!el)return;
  el.textContent=message;
  el.dataset.error=isError?"1":"0";
}
async function startCheckout(productId){
  if(busy)return;
  if(!CONFIG.enabled||!CONFIG.liveProductIds.includes(Number(productId))){setStatus("Questo pacchetto non è ancora disponibile.",true);return;}
  const user=await currentUser();
  if(!user){setStatus("Per acquistare crediti devi prima accedere con un account Marina Empire verificato.",true);document.querySelector('[data-tab="profile"]')?.click();return;}
  if(typeof window.meCreditCheckoutReady!=="function"){
    setStatus("Controllo sicurezza partita non disponibile. Acquisto bloccato.",true);return;
  }
  setStatus("Verifica della partita online prima del checkout…");
  const ready=await window.meCreditCheckoutReady();
  if(!ready){setStatus("Sincronizza la partita online prima di acquistare crediti.",true);return;}
  busy=true;
  document.querySelectorAll("[data-me-credit-product]").forEach(b=>b.disabled=true);
  setStatus("Preparazione del checkout sicuro RPG Yacht…");
  try{
    const c=await getClient();
    const {data,error}=await c.functions.invoke("marina-direct-checkout",{body:{product_id:Number(productId)}});
    if(error||!data?.checkout_url)throw new Error("checkout_unavailable");
    window.location.assign(data.checkout_url);
  }catch(e){
    console.warn("Marina Empire checkout",e);
    setStatus("Checkout temporaneamente non disponibile. Riprova tra poco.",true);
    busy=false;
    syncButtons();
  }
}
async function syncButtons(){
  const buttons=[...document.querySelectorAll("[data-me-credit-product]")];
  if(!buttons.length)return;
  let user=null;
  try{user=await currentUser()}catch{}
  buttons.forEach(btn=>{
    const live=CONFIG.enabled&&CONFIG.liveProductIds.includes(Number(btn.dataset.meCreditProduct));
    btn.disabled=!live||!user||busy;
    btn.textContent=!live?"PROSSIMAMENTE":user?"ACQUISTA ORA":"ACCEDI PER ACQUISTARE";
  });
  const loginHint=document.getElementById("meCreditLoginHint");
  if(loginHint)loginHint.textContent=user
    ?"Account verificato: il pacchetto acquistato verrà accreditato automaticamente sul tuo saldo Marina Empire."
    :"Accedi o registrati prima dell'acquisto: così i crediti vengono accreditati direttamente al tuo account.";
  try{
    const balance=await walletBalance();
    const balanceEl=document.getElementById("meCreditWalletSummary");
    if(balanceEl)balanceEl.textContent=balance===null
      ?"Saldo crediti acquistati: accedi per visualizzarlo."
      :"Saldo crediti acquistati: "+fmt(balance);
  }catch{}
}
function bind(){
  document.querySelectorAll("[data-me-credit-product]").forEach(btn=>{
    if(btn.dataset.meBound==="1")return;
    btn.dataset.meBound="1";
    btn.addEventListener("click",()=>startCheckout(Number(btn.dataset.meCreditProduct)));
  });
  const url=new URL(window.location.href);
  if(url.searchParams.get("credit_purchase")==="success"){
    setStatus("Ordine ricevuto. Sto verificando l'accredito automatico nella partita.");
    document.querySelector('[data-tab="credits"]')?.click();
  }
  syncButtons();
  window.addEventListener("focus",()=>syncButtons());
  window.addEventListener("marina-empire-updated",()=>syncButtons());
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();
