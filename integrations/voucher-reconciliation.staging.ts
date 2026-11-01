// Read-only reconciliation helper for voucher deliveries stuck in "sending".
// Never auto-retry these: the email provider may have accepted the message.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";
import { findStaleDeliveries } from "./voucher-reconciliation-policy.ts";
const env=(name:string)=>Deno.env.get(name)||"";
const json=(value:unknown,status=200)=>new Response(JSON.stringify(value),{
  status,headers:{"content-type":"application/json","cache-control":"no-store"}
});
Deno.serve(async request=>{
  if(request.method!=="POST")return json({error:"Method not allowed"},405);
  if(env("ME_RECONCILIATION_ENABLED")!=="true")return json({error:"Disabled"},503);
  if(!env("ME_RECONCILIATION_TOKEN")||!env("SUPABASE_URL")||!env("SUPABASE_SERVICE_ROLE_KEY"))return json({error:"Configuration incomplete"},503);
  if(request.headers.get("authorization")!=="Bearer "+env("ME_RECONCILIATION_TOKEN"))return json({error:"Unauthorized"},401);
  const admin=createClient(env("SUPABASE_URL"),env("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await admin.from("me_voucher_delivery_outbox")
    .select("id,woo_order_id,status,attempts,updated_at,provider_message_id")
    .eq("status","sending").order("updated_at",{ascending:true}).limit(100);
  if(error)return json({error:"Reconciliation query failed"},503);
  const records=findStaleDeliveries((data||[]).map(row=>({
    id:row.id,woo_order_id:row.woo_order_id,status:row.status,
    attempts:row.attempts,updatedAt:row.updated_at,
    providerMessageId:row.provider_message_id
  })),new Date());
  // No plaintext codes, recipient emails, encrypted data or service secrets in response.
  return json({ok:true,stale_count:records.length,records});
});
