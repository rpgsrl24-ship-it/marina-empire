(function(){
"use strict";
const CONFIG={
  enabled:true,
  directCheckoutReady:true,
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
let client=null,busy=false;
function getClient(){
  if(client)return client;
  if(!window.supabase?.createClient)throw new Error("Servizio account non disponibile");
  client=window.supabase.createClient(CONFIG.supabaseUrl,CONFIG.publishableKey,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  return client;
}
async function currentUser(){
  const c=getClient();
  const {data,error}=await c.auth.getUser();
  if(error||!data?.user?.id||!data.user.email_confirmed_at||data.user.is_anonymous||window.MarinaLocalSaveContext?.capture?.()?.accountId!==data.user.id)return null;
  return data.user;
}
async function walletBalance(){
  const user=await currentUser();
  if(!user)return null;
  const c=getClient();
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
  if(busy||!CONFIG.packages.some(p=>p.productId===Number(productId)))return;
  if(!CONFIG.enabled){setStatus("Acquisti in attivazione finale. Nessun addebito viene avviato.",true);return;}
  busy=true;document.querySelectorAll("[data-me-credit-product]").forEach(b=>b.disabled=true);
  let navigating=false;
  try{
    const user=await currentUser();
    if(!user){setStatus("Accedi con un account Marina Empire verificato.",true);return;}
    if(typeof window.meCreditCheckoutReady!=="function"){setStatus("Controllo sicurezza partita non disponibile. Acquisto bloccato.",true);return;}
    setStatus("Verifica della partita online prima del checkout…");
    if(!await window.meCreditCheckoutReady()){setStatus("Sincronizza la partita online prima di acquistare crediti.",true);return;}
    if(window.MarinaLocalSaveContext?.capture?.()?.accountId!==user.id){setStatus("Account cambiato. Acquisto bloccato.",true);return;}
    setStatus("Preparazione del checkout sicuro RPG Yacht…");
    const {data,error}=await getClient().functions.invoke("marina-direct-checkout",{body:{product_id:Number(productId)}});
    if(error||!data?.checkout_url)throw Error("checkout_unavailable");
    const dest=new window.URL(data.checkout_url);
    if(dest.protocol!=="https:"||!["rpgyacht.com","www.rpgyacht.com"].includes(dest.hostname)||dest.username||dest.password)throw Error("checkout_unavailable");
    window.location.assign(data.checkout_url);navigating=true;
  }catch(e){console.warn("Marina Empire checkout",e);setStatus("Checkout temporaneamente non disponibile. Riprova.",true);}
  finally{if(!navigating){busy=false;syncButtons();}}
}
async function syncButtons(){
  const buttons=[...document.querySelectorAll("[data-me-credit-product]")];
  if(!buttons.length)return;
  let user=null;
  try{user=await currentUser()}catch{}
  buttons.forEach(btn=>{
    btn.disabled=!CONFIG.enabled||!user||busy;
    btn.textContent=!CONFIG.enabled
      ?"ACQUISTA · ATTIVAZIONE FINALE"
      :user?"ACQUISTA ORA":"ACCEDI PER ACQUISTARE";
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
    document.getElementById("creditShop")?.scrollIntoView({block:"start"});
  }
  syncButtons();
  window.addEventListener("focus",()=>syncButtons());
  window.addEventListener("marina-empire-updated",()=>syncButtons());
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();
