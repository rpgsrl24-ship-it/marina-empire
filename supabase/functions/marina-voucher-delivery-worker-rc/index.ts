// Staging-only email delivery worker for Marina Empire.
// Must be invoked from a trusted scheduler with a server-only bearer token.
// Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ME_DELIVERY_WORKER_TOKEN,
// ME_VOUCHER_ENCRYPTION_KEY, ME_RESEND_API_KEY, ME_FROM_EMAIL.
// Do not deploy until refund handling, stale claim recovery and E2E tests pass.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";
import { decryptVoucher } from "./voucher-crypto.ts";
import { decideRecovery } from "./voucher-recovery-policy.ts";
const env=(key:string)=>Deno.env.get(key)||"";
const readSecretKey=()=>{const raw=env("SUPABASE_SECRET_KEYS");if(raw){try{const parsed=JSON.parse(raw);if(parsed&&typeof parsed.default==="string"&&parsed.default)return parsed.default}catch{}}return env("SUPABASE_SERVICE_ROLE_KEY")};
const respond=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
Deno.serve(async request=>{
 if(request.method!=="POST")return respond({error:"Method not allowed"},405);
 if(env("ME_DELIVERY_ENABLED")!=="true")return respond({error:"Delivery disabled"},503);
 const required=["SUPABASE_URL","ME_DELIVERY_WORKER_TOKEN","ME_VOUCHER_ENCRYPTION_KEY","ME_RESEND_API_KEY","ME_FROM_EMAIL"];
 if(required.some(k=>!env(k))||!readSecretKey())return respond({error:"Server configuration incomplete"},503);
 if(request.headers.get("authorization")!=="Bearer "+env("ME_DELIVERY_WORKER_TOKEN"))return respond({error:"Unauthorized"},401);
 const admin=createClient(env("SUPABASE_URL"),readSecretKey(),{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:due,error:lookupError}=await admin.from("me_voucher_delivery_outbox").select("id,woo_order_id,woo_order_item_id,woo_unit_index,status,attempts,updated_at,provider_message_id")
  .in("status",["pending","retry"]).lte("next_attempt_at",new Date().toISOString()).lt("attempts",8).order("created_at").limit(10);
 if(lookupError)return respond({error:"Queue unavailable"},503);
 let sent=0,failed=0;
 for(const item of due||[]){
  const decision=decideRecovery({
    status:item.status,attempts:item.attempts,
    updatedAt:item.updated_at,providerMessageId:item.provider_message_id
  },new Date());
  if(decision.action!=="retry")continue;
  const {data:claimed,error:claimError}=await admin.rpc("me_claim_voucher_delivery_internal",{p_delivery_id:item.id});
  if(claimError||!claimed?.length)continue;
  const row=claimed[0];
  try{
   const code=await decryptVoucher({ciphertext:row.code_ciphertext,nonce:row.code_nonce,key_version:row.key_version},env("ME_VOUCHER_ENCRYPTION_KEY"));
   const idempotency="me-"+item.woo_order_id+"-"+item.woo_order_item_id+"-"+item.woo_unit_index;
   const response=await fetch("https://api.resend.com/emails",{
    method:"POST",headers:{"authorization":"Bearer "+env("ME_RESEND_API_KEY"),"content-type":"application/json","Idempotency-Key":idempotency},
    body:JSON.stringify({from:env("ME_FROM_EMAIL"),to:[row.recipient_email],subject:"Marina Empire - codice ricarica",
     text:"Il tuo codice di ricarica Marina Empire: "+code+"\nInseriscilo nel tuo account di gioco."})
   });
   if(!response.ok)throw new Error("Email provider rejected delivery");
   const body=await response.json();
   const {error:writeError}=await admin.from("me_voucher_delivery_outbox").update({
    status:"sent",sent_at:new Date().toISOString(),provider_message_id:String(body.id||""),last_error:null,updated_at:new Date().toISOString()
   }).eq("id",row.id).eq("status","sending");
   // Provider accepted the email. Never mark retry if the database acknowledgement fails.
   // Leave status as sending for manual provider reconciliation instead.
   if(writeError){failed++;continue;}
   sent++;
  }catch{
   const delayMinutes=Math.min(1440,Math.pow(2,Math.min(row.attempts,8))*5);
   const {error:retryWriteError}=await admin.from("me_voucher_delivery_outbox").update({
    status:row.attempts>=8?"failed":"retry",
    next_attempt_at:new Date(Date.now()+delayMinutes*60000).toISOString(),
    last_error:"Delivery attempt failed",updated_at:new Date().toISOString()
   }).eq("id",row.id).eq("status","sending");
   if(retryWriteError){failed++;continue;}
   failed++;
  }
 }
 return respond({ok:true,processed:(due||[]).length,sent,failed});
});
