// Marina Empire: preparatory WooCommerce webhook validation.
// NOT a voucher issuer. It never credits accounts or returns voucher codes.
// Deploy only after configuring server-side secrets and finishing issuance/outbox.
const packages: Record<string, number> = {
  "ME-CREDITS-50000": 50000,
  "ME-CREDITS-120000": 120000,
  "ME-CREDITS-300000": 300000,
  "ME-CREDITS-900000": 900000,
  "ME-CREDITS-2000000": 2000000,
};
const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {status, headers: {"content-type":"application/json","cache-control":"no-store"}});
function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if(a.length !== b.length) return false;
  let diff = 0;
  for(let i=0;i<a.length;i++) diff |= a[i]^b[i];
  return diff===0;
}
async function validSignature(payload: Uint8Array, signature: string, secret: string) {
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const actual=new Uint8Array(await crypto.subtle.sign("HMAC",key,payload));
  const expected=Uint8Array.from(atob(signature),c=>c.charCodeAt(0));
  return constantTimeEqual(actual,expected);
}
Deno.serve(async(req:Request)=>{
  if(req.method!=="POST") return json({error:"Method not allowed"},405);
  const secret=Deno.env.get("ME_WOO_WEBHOOK_SECRET");
  const wooUrl=Deno.env.get("ME_WOO_BASE_URL");
  const wooKey=Deno.env.get("ME_WOO_CONSUMER_KEY");
  const wooSecret=Deno.env.get("ME_WOO_CONSUMER_SECRET");
  if(!secret||!wooUrl||!wooKey||!wooSecret) return json({error:"Not configured"},503);
  const signature=req.headers.get("x-wc-webhook-signature")||"";
  const bytes=new Uint8Array(await req.arrayBuffer());
  if(bytes.length>65536) return json({error:"Payload too large"},413);
  try {
    if(!await validSignature(bytes,signature,secret)) return json({error:"Invalid signature"},401);
  } catch { return json({error:"Invalid signature"},401); }
  let event: {id?:number};
  try {event=JSON.parse(new TextDecoder().decode(bytes));} catch {return json({error:"Invalid JSON"},400);}
  const orderId=Number(event.id);
  if(!Number.isSafeInteger(orderId)||orderId<1) return json({error:"Invalid order"},400);
  const base=new URL(wooUrl);
  if(base.protocol!=="https:" || base.hostname!=="rpgyacht.com" || base.username || base.password || base.port || base.search || base.hash)
    return json({error:"Invalid configuration"},503);
  const url=new URL("/wp-json/wc/v3/orders/"+orderId,base);
  const auth=btoa(wooKey+":"+wooSecret);
  const response=await fetch(url,{headers:{authorization:"Basic "+auth,accept:"application/json"}});
  if(!response.ok) return json({error:"Order verification unavailable"},503);
  const order=await response.json();
  if(Number(order.id)!==orderId || !["processing","completed"].includes(order.status) || !order.date_paid || order.currency!=="EUR")
    return json({accepted:false,reason:"Order not eligible"},200);
  if(!Array.isArray(order.line_items)) return json({error:"Invalid order lines"},503);
  const creditLines=order.line_items.filter((line:{sku?:string}) =>
    Object.hasOwn(packages,line.sku||""));
  if (creditLines.length === 0) return json({accepted:true,issued:0},200);
  const valid=creditLines.every((line:{sku?:string,quantity?:number,total?:string,id?:number}) => {
    const qty=line.quantity;
    const total=Number(line.total);
    return Number.isSafeInteger(line.id) && Number(line.id)>0 &&
      typeof qty==="number" && Number.isSafeInteger(qty) && qty>0 && qty<=100 &&
      typeof line.total==="string" && /^\\d+\\.\\d{2}$/.test(line.total) &&
      Number.isFinite(total) && total>0;
  });
  if(!valid) return json({accepted:false,error:"Invalid credit line"},503);
  const eligible=creditLines;
  // Deliberately fail closed: do not acknowledge successful issuance before
  // atomic voucher creation and encrypted outbox delivery are implemented.
  return json({accepted:false,eligibleLines:eligible.length,error:"Issuance and delivery not enabled"},503);
});
