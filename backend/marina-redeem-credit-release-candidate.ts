// Marina Empire voucher redemption release candidate.
// NOT DEPLOYED by this file alone. Production remains OFF until ME_VOUCHERS_ENABLED=true.
const corsHeaders={
  "content-type":"application/json",
  "cache-control":"no-store",
  "access-control-allow-origin":"https://rpgsrl24-ship-it.github.io",
  "access-control-allow-headers":"authorization,apikey,content-type,x-client-info",
  "access-control-allow-methods":"POST,OPTIONS",
  "vary":"Origin"
};
const respond=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...corsHeaders,...extra}});
const env=name=>Deno.env.get(name)||"";
function readNamedKey(jsonName,legacyName){
  const raw=env(jsonName);
  if(raw){
    try{const parsed=JSON.parse(raw);if(parsed&&typeof parsed.default==="string"&&parsed.default)return parsed.default;}catch{}
  }
  return env(legacyName);
}
async function sha256(value){
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,"0")).join("");
}
Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders});
  if(req.method!=="POST")return respond({error:"Method not allowed"},405,{allow:"POST, OPTIONS"});
  if(env("ME_VOUCHERS_ENABLED")!=="true")return respond({error:"Ricariche non ancora attive",code:"VOUCHERS_DISABLED"},503);
  if(req.headers.get("origin")!=="https://rpgsrl24-ship-it.github.io")return respond({error:"Origin not allowed"},403);

  const authorization=req.headers.get("authorization")||"";
  if(!authorization.startsWith("Bearer "))return respond({error:"Accesso richiesto"},401);
  const token=authorization.slice(7).trim();
  if(!token)return respond({error:"Accesso richiesto"},401);

  const url=env("SUPABASE_URL").replace(/\/$/,"");
  const publishable=readNamedKey("SUPABASE_PUBLISHABLE_KEYS","SUPABASE_ANON_KEY");
  const secret=readNamedKey("SUPABASE_SECRET_KEYS","SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!publishable||!secret)return respond({error:"Configurazione incompleta"},503);

  const authResponse=await fetch(url+"/auth/v1/user",{headers:{apikey:publishable,authorization:"Bearer "+token}});
  if(!authResponse.ok)return respond({error:"Account verificato richiesto"},401);
  const user=await authResponse.json();
  if(!user?.id||user.is_anonymous||!user.email_confirmed_at)return respond({error:"Account verificato richiesto"},401);

  const raw=await req.text();
  if(raw.length>2048)return respond({error:"Richiesta troppo grande"},413);
  let body;try{body=JSON.parse(raw)}catch{return respond({error:"Richiesta non valida"},400)}
  const code=String(body?.code||"").trim().toUpperCase();
  if(!/^ME-[A-Z0-9]{8}-[A-Z0-9]{8}-[A-Z0-9]{8}$/.test(code))return respond({error:"Formato codice non valido"},400);

  const rpcHeaders={apikey:secret,"content-type":"application/json","prefer":"return=representation"};
  if(!secret.startsWith("sb_secret_"))rpcHeaders.authorization="Bearer "+secret;
  const rpcResponse=await fetch(url+"/rest/v1/rpc/me_redeem_voucher_internal",{
    method:"POST",headers:rpcHeaders,
    body:JSON.stringify({p_user_id:user.id,p_code_hash:await sha256(code)})
  });
  if(!rpcResponse.ok)return respond({error:"Codice non valido o già utilizzato"},400);
  const balance=Number(await rpcResponse.json());
  if(!Number.isSafeInteger(balance)||balance<0)return respond({error:"Saldo non disponibile"},503);
  return respond({ok:true,balance});
});