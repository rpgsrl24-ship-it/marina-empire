import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const PACKS: Record<number,{sku:string;credits:number;priceCents:number}> = {
  38090:{sku:"ME-CREDITS-50000",credits:50000,priceCents:499},
  38091:{sku:"ME-CREDITS-120000",credits:120000,priceCents:999},
  38092:{sku:"ME-CREDITS-300000",credits:300000,priceCents:1999},
  38093:{sku:"ME-CREDITS-900000",credits:900000,priceCents:4999},
  38094:{sku:"ME-CREDITS-2000000",credits:2000000,priceCents:9999}
};
const env=(k:string)=>Deno.env.get(k)||"";
const readSecretKey=()=>{const raw=env("SUPABASE_SECRET_KEYS");if(raw){try{const parsed=JSON.parse(raw);if(parsed&&typeof parsed.default==="string"&&parsed.default)return parsed.default}catch{}}return env("SUPABASE_SERVICE_ROLE_KEY")};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
const cents=(v:unknown)=>{const s=String(v??"");return /^\d+\.\d{2}$/.test(s)?Number(s.replace(".","")):NaN;};
const hex=(b:Uint8Array)=>Array.from(b,x=>x.toString(16).padStart(2,"0")).join("");
const b64=(b:Uint8Array)=>btoa(String.fromCharCode(...b));
function code(){const b=crypto.getRandomValues(new Uint8Array(12));const h=Array.from(b,x=>x.toString(16).toUpperCase().padStart(2,"0")).join("");return "ME-"+h.slice(0,8)+"-"+h.slice(8,16)+"-"+h.slice(16,24);}
async function hash(v:string){return hex(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v))));}
async function encrypt(v:string,keyHex:string){
 if(!/^[a-fA-F0-9]{64}$/.test(keyHex))throw new Error("Invalid encryption key");
 const raw=Uint8Array.from(keyHex.match(/.{2}/g)!,x=>parseInt(x,16));
 const key=await crypto.subtle.importKey("raw",raw,{name:"AES-GCM"},false,["encrypt"]);
 const nonce=crypto.getRandomValues(new Uint8Array(12));
 const out=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:nonce},key,new TextEncoder().encode(v)));
 return {ciphertext:b64(out),nonce:b64(nonce),key_version:1};
}
async function validSignature(raw:string,provided:string,secret:string){
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const expected=new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(raw)));
 let actual:Uint8Array;try{actual=Uint8Array.from(atob(provided),c=>c.charCodeAt(0));}catch{return false;}
 if(expected.length!==actual.length)return false;let diff=0;for(let i=0;i<expected.length;i++)diff|=expected[i]^actual[i];return diff===0;
}

Deno.serve(async req=>{
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 if(env("ME_WOO_CREDIT_WEBHOOK_ENABLED")!=="true"||env("ME_ISSUE_ENABLED")!=="true"||env("ME_RECOVERABLE_DELIVERY_READY")!=="true")
   return reply({error:"Credit webhook disabled"},503);
 const required=["ME_WOO_WEBHOOK_SECRET","ME_WOO_API_KEY","ME_WOO_API_SECRET","ME_WOO_BASE_URL","ME_VOUCHER_ENCRYPTION_KEY","SUPABASE_URL"];
 if(required.some(k=>!env(k))||!readSecretKey())return reply({error:"Server configuration incomplete"},503);
 const raw=await req.text();if(raw.length>200000)return reply({error:"Payload too large"},413);
 if(!await validSignature(raw,req.headers.get("x-wc-webhook-signature")||"",env("ME_WOO_WEBHOOK_SECRET")))return reply({error:"Invalid webhook signature"},401);
 let payload:{id?:number};try{payload=JSON.parse(raw);}catch{return reply({error:"Invalid payload"},400);}
 if(!Number.isSafeInteger(payload.id)||!payload.id||payload.id<1)return reply({error:"Invalid order ID"},400);
 let base:URL;try{base=new URL(env("ME_WOO_BASE_URL"));}catch{return reply({error:"Invalid store configuration"},503);}
 if(base.protocol!=="https:"||!["rpgyacht.com","www.rpgyacht.com"].includes(base.hostname)||base.username||base.password||base.port||base.search||base.hash)
   return reply({error:"Invalid store configuration"},503);
 const auth=btoa(env("ME_WOO_API_KEY")+":"+env("ME_WOO_API_SECRET"));
 const response=await fetch(new URL("/wp-json/wc/v3/orders/"+payload.id,base),{headers:{authorization:"Basic "+auth,accept:"application/json"}});
 if(!response.ok)return reply({error:"Order lookup failed"},502);
 const order=await response.json();
 if(Number(order.id)!==payload.id||!["processing","completed"].includes(order.status)||!order.date_paid||order.currency!=="EUR"||!Array.isArray(order.line_items)||!Array.isArray(order.refunds)||order.refunds.length)
   return reply({error:"Order ineligible for automatic issuance"},422);
 const email=String(order.billing?.email||"").trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254)return reply({error:"Invalid recipient"},422);
 const units:Array<{itemId:number;unitIndex:number;credits:number}>=[];
 for(const line of order.line_items){
   const pack=PACKS[Number(line.product_id)];if(!pack)continue;
   const qty=Number(line.quantity),gross=cents(line.total)+cents(line.total_tax??"0.00"),subGross=cents(line.subtotal)+cents(line.subtotal_tax??"0.00");
   if(line.sku!==pack.sku||!Number.isSafeInteger(line.id)||line.id<1||!Number.isSafeInteger(qty)||qty<1||qty>100||gross!==pack.priceCents*qty||subGross!==pack.priceCents*qty)
     return reply({error:"Credit line failed validation"},422);
   for(let i=0;i<qty;i++)units.push({itemId:line.id,unitIndex:i,credits:pack.credits});
 }
 if(units.length===0)return reply({ok:true,queued:0,duplicate:0});
 if(units.length>100)return reply({error:"Too many credit units"},422);
 const admin=createClient(env("SUPABASE_URL"),readSecretKey(),{auth:{persistSession:false,autoRefreshToken:false}});
 let queued=0,duplicate=0;
 for(const unit of units){
   const voucherCode=code(),codeHash=await hash(voucherCode),encrypted=await encrypt(voucherCode,env("ME_VOUCHER_ENCRYPTION_KEY"));
   const {data:voucherId,error}=await admin.rpc("me_issue_voucher_with_outbox_internal",{
     p_code_hash:codeHash,p_credits:unit.credits,p_order_id:order.id,p_item_id:unit.itemId,p_unit_index:unit.unitIndex,
     p_recipient_email:email,p_ciphertext:encrypted.ciphertext,p_nonce:encrypted.nonce,p_key_version:encrypted.key_version
   });
   if(error||!voucherId)return reply({error:"Voucher issuance unavailable",queued,duplicate},503);
   const {data:stored,error:lookupError}=await admin.from("me_credit_vouchers").select("code_hash").eq("id",voucherId).single();
   if(lookupError||!stored)return reply({error:"Voucher verification unavailable",queued,duplicate},503);
   if(stored.code_hash===codeHash)queued++;else duplicate++;
 }
 return reply({ok:true,queued,duplicate});
});