import { validateFullRefundOrder, type RefundOrder } from "./woo-refund-validator.ts";
// Staging only: WooCommerce full-refund webhook to atomic Supabase cancellation.
// Disabled by default. Never deploy with ME_REFUND_ENABLED=true before E2E tests.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";
const env=(k:string)=>Deno.env.get(k)||"";
const readSecretKey=()=>{const raw=env("SUPABASE_SECRET_KEYS");if(raw){try{const parsed=JSON.parse(raw);if(parsed&&typeof parsed.default==="string"&&parsed.default)return parsed.default}catch{}}return env("SUPABASE_SERVICE_ROLE_KEY")};
const json=(x:unknown,status=200)=>new Response(JSON.stringify(x),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
async function verify(raw:string,sig:string,secret:string){
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const expected=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(raw)));
 let actual:Uint8Array;try{actual=Uint8Array.from(atob(sig),c=>c.charCodeAt(0));}catch{return false;}
 if(actual.length!==expected.length)return false;
 let diff=0;for(let i=0;i<actual.length;i++)diff|=actual[i]^expected[i];
 return diff===0;
}
Deno.serve(async request=>{
 if(request.method!=="POST")return json({error:"Method not allowed"},405);
 if(env("ME_REFUND_ENABLED")!=="true")return json({error:"Refund automation disabled"},503);
 const required=["ME_WOO_WEBHOOK_SECRET","ME_WOO_API_KEY","ME_WOO_API_SECRET","ME_WOO_BASE_URL","SUPABASE_URL"];
 if(required.some(k=>!env(k))||!readSecretKey())return json({error:"Configuration incomplete"},503);
 const raw=await request.text();
 if(raw.length>200000)return json({error:"Payload too large"},413);
 if(!await verify(raw,request.headers.get("x-wc-webhook-signature")||"",env("ME_WOO_WEBHOOK_SECRET")))return json({error:"Invalid signature"},401);
 let payload:{id?:number};try{payload=JSON.parse(raw);}catch{return json({error:"Invalid JSON"},400);}
 if(!Number.isSafeInteger(payload.id)||!payload.id||payload.id<1)return json({error:"Invalid order"},400);
 const store=env("ME_WOO_BASE_URL").replace(/\/$/,"");
 if(!/^https:\/\//.test(store))return json({error:"Invalid store URL"},503);
 const auth=btoa(env("ME_WOO_API_KEY")+":"+env("ME_WOO_API_SECRET"));
 const res=await fetch(store+"/wp-json/wc/v3/orders/"+payload.id,{headers:{authorization:"Basic "+auth}});
 if(!res.ok)return json({error:"Order lookup failed"},502);
 const order=await res.json() as RefundOrder;
 let decision:"full_refund"|"manual_review";
 try{decision=validateFullRefundOrder(payload.id,order);}catch{return json({error:"Refund order verification failed"},422);}
 if(decision!=="full_refund")return json({ok:true,action:"manual_review_or_no_full_refund"});
 const admin=createClient(env("SUPABASE_URL"),readSecretKey(),{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await admin.rpc("me_cancel_refunded_order_internal",{p_order_id:order.id});
 if(error)return json({error:"Atomic cancellation failed"},503);
 return json({ok:true,result:data});
});
