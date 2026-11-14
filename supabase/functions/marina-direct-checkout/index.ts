import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const PACKS: Record<number,{sku:string;credits:number;priceCents:number}> = {
  38090:{sku:"ME-CREDITS-50000",credits:50000,priceCents:499},
  38091:{sku:"ME-CREDITS-120000",credits:120000,priceCents:999},
  38092:{sku:"ME-CREDITS-300000",credits:300000,priceCents:1999},
  38093:{sku:"ME-CREDITS-900000",credits:900000,priceCents:4999},
  38094:{sku:"ME-CREDITS-2000000",credits:2000000,priceCents:9999}
};
const ORIGIN="https://rpgsrl24-ship-it.github.io";
const LIVE_PRODUCT_IDS=new Set([38090]);
const PUBLIC_KEY="sb_publishable_WwvgUezd01X1Irx-bSaM1A_6BYedCzw";
const env=(k:string)=>Deno.env.get(k)||"";
const readSecretKey=()=>{
  const raw=env("SUPABASE_SECRET_KEYS");
  if(raw){try{const parsed=JSON.parse(raw);if(parsed&&typeof parsed.default==="string"&&parsed.default)return parsed.default}catch{}}
  return env("SUPABASE_SERVICE_ROLE_KEY");
};
const cors={
  "content-type":"application/json",
  "cache-control":"no-store",
  "access-control-allow-origin":ORIGIN,
  "access-control-allow-headers":"authorization,apikey,content-type,x-client-info",
  "access-control-allow-methods":"POST,OPTIONS",
  "vary":"Origin"
};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:cors});
const toHex=(b:Uint8Array)=>Array.from(b,x=>x.toString(16).padStart(2,"0")).join("");
async function sha256(v:string){
  return toHex(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v))));
}

Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(req.method!=="POST")return reply({error:"Method not allowed"},405);
  if(req.headers.get("origin")!==ORIGIN)return reply({error:"Origin not allowed"},403);

  const auth=req.headers.get("authorization")||"";
  if(!auth.startsWith("Bearer "))return reply({error:"Authentication required"},401);

  const url=env("SUPABASE_URL");
  const secret=readSecretKey();
  if(!url||!secret)return reply({error:"Server configuration incomplete"},503);

  const userClient=createClient(url,PUBLIC_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  const token=auth.slice(7);
  const {data:userData,error:userError}=await userClient.auth.getUser(token);
  const user=userData?.user;
  if(userError||!user?.id||!user.email||!user.email_confirmed_at)return reply({error:"Verified account required"},401);

  let body:any;
  try{body=await req.json()}catch{return reply({error:"Invalid request"},400)}
  const productId=Number(body?.product_id);
  const pack=PACKS[productId];
  if(!pack)return reply({error:"Invalid credit package"},422);
  if(!LIVE_PRODUCT_IDS.has(productId))return reply({error:"Credit package not live yet",code:"PACKAGE_NOT_LIVE"},409);

  const rawToken=toHex(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash=await sha256(rawToken);
  const expiresAt=new Date(Date.now()+30*60_000).toISOString();
  const admin=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
  const {error}=await admin.rpc("me_create_checkout_session_internal",{
    p_user_id:user.id,
    p_user_email:user.email,
    p_token_hash:tokenHash,
    p_product_id:productId,
    p_sku:pack.sku,
    p_credits:pack.credits,
    p_price_cents:pack.priceCents,
    p_expires_at:expiresAt
  });
  if(error)return reply({error:"Checkout session unavailable"},503);

  const checkout=new URL("https://rpgyacht.com/");
  checkout.searchParams.set("me_buy","1");
  checkout.searchParams.set("product",String(productId));
  checkout.searchParams.set("session",rawToken);

  return reply({ok:true,checkout_url:checkout.toString(),expires_at:expiresAt,credits:pack.credits});
});