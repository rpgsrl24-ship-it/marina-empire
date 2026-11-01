// Marina Empire: WooCommerce -> Supabase voucher issuer (staging implementation).
// Never embed any secret in GitHub Pages. Deploy only after configuring secrets and mail delivery.
// Required secrets: ME_ISSUE_ENABLED, ME_WOO_WEBHOOK_SECRET, ME_WOO_API_KEY,
// ME_WOO_API_SECRET, ME_WOO_BASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// ME_RESEND_API_KEY, ME_FROM_EMAIL.
// WooCommerce webhook topic: order.updated; endpoint must be HTTPS.
// Code format matches marina-redeem-credit: ME-XXXXXXXX-XXXXXXXX-XXXXXXXX.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const packs: Record<string,number> = {
  "ME-CREDITS-50000":50000, "ME-CREDITS-120000":120000,
  "ME-CREDITS-300000":300000, "ME-CREDITS-900000":900000,
  "ME-CREDITS-2000000":2000000
};
const env=(name:string)=>Deno.env.get(name)||"";
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
const hex=(b:Uint8Array)=>Array.from(b).map(x=>x.toString(16).padStart(2,"0")).join("");
async function sha256(v:string){return hex(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v))));}
function newCode(){
  const b=crypto.getRandomValues(new Uint8Array(12));
  const s=Array.from(b).map(x=>x.toString(36).toUpperCase().padStart(2,"0").slice(-2)).join("");
  return "ME-"+s.slice(0,8)+"-"+s.slice(8,16)+"-"+s.slice(16,24);
}
async function validHmac(raw:string,provided:string,secret:string){
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const expected=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(raw)));
  const received=Uint8Array.from(atob(provided),c=>c.charCodeAt(0));
  if(expected.length!==received.length)return false;
  let mismatch=0;for(let i=0;i<expected.length;i++)mismatch|=expected[i]^received[i];
  return mismatch===0;
}
Deno.serve(async(req)=>{
  if(req.method!=="POST")return json({error:"Method not allowed"},405);
  if(env("ME_ISSUE_ENABLED")!=="true")return json({error:"Issuance disabled"},503);
  const needed=["ME_WOO_WEBHOOK_SECRET","ME_WOO_API_KEY","ME_WOO_API_SECRET","ME_WOO_BASE_URL","SUPABASE_URL","SUPABASE_SERVICE_ROLE_KEY","ME_RESEND_API_KEY","ME_FROM_EMAIL"];
  if(needed.some(k=>!env(k)))return json({error:"Server not configured"},503);
  const raw=await req.text();
  if(raw.length>200000)return json({error:"Payload too large"},413);
  const signature=req.headers.get("x-wc-webhook-signature")||"";
  try{if(!await validHmac(raw,signature,env("ME_WOO_WEBHOOK_SECRET")))return json({error:"Invalid signature"},401);}
  catch{return json({error:"Invalid signature"},401);}
  let event:{id?:number};try{event=JSON.parse(raw);}catch{return json({error:"Invalid JSON"},400);}
  const orderId=Number(event.id);
  if(!Number.isSafeInteger(orderId)||orderId<1)return json({error:"Invalid order"},400);
  const base=env("ME_WOO_BASE_URL").replace(/\/$/,"");
  if(!/^https:\/\//.test(base))return json({error:"Invalid store URL"},503);
  const auth=btoa(env("ME_WOO_API_KEY")+":"+env("ME_WOO_API_SECRET"));
  const orderResponse=await fetch(base+"/wp-json/wc/v3/orders/"+orderId,{headers:{authorization:"Basic "+auth}});
  if(!orderResponse.ok)return json({error:"Order verification failed"},502);
  const order=await orderResponse.json();
  if(!["processing","completed"].includes(order.status)||!order.date_paid)return json({ok:true,issued:0,reason:"Not paid"});
  if(!order.billing?.email)return json({error:"Missing billing email"},422);
  const supabase=createClient(env("SUPABASE_URL"),env("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false,autoRefreshToken:false}});
  let issued=0;
  for(const item of order.line_items||[]){
    const sku=String(item.sku||"");
    const credits=packs[sku];if(!credits)continue;
    const qty=Number(item.quantity);
    if(!Number.isSafeInteger(qty)||qty<1||qty>100)return json({error:"Invalid quantity"},422);
    for(let unit=0;unit<qty;unit++){
      const {data:existing,error:lookupError}=await supabase.from("me_credit_vouchers").select("id").eq("woo_order_id",orderId).eq("woo_order_item_id",item.id).eq("woo_unit_index",unit).maybeSingle();
      if(lookupError)return json({error:"Voucher lookup failed"},502);
      if(existing)continue;
      const code=newCode();
      const {error:insertError}=await supabase.from("me_credit_vouchers").insert({code_hash:await sha256(code),credits,woo_order_id:orderId,woo_order_item_id:item.id,woo_unit_index:unit,status:"issued"});
      if(insertError){
        // Never generate or email a second code for a duplicate order/item/unit.
        if(insertError.code==="23505")continue;
        return json({error:"Voucher insertion failed"},502);
      }
      // IMPORTANT: mail failure requires manual recovery. Do not reissue an unknown code.
      const mail=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"authorization":"Bearer "+env("ME_RESEND_API_KEY"),"content-type":"application/json","Idempotency-Key":"me-"+orderId+"-"+item.id+"-"+unit},body:JSON.stringify({from:env("ME_FROM_EMAIL"),to:[order.billing.email],subject:"Marina Empire - codice ricarica",text:"Il tuo codice Marina Empire: "+code+"\nRiscattalo dal tuo account di gioco.\nOrdine #"+orderId})});
      if(!mail.ok)return json({error:"Voucher stored but delivery failed; manual support required",order_id:orderId},502);
      issued++;
    }
  }
  return json({ok:true,issued});
});
