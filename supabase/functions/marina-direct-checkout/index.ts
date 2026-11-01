// Supabase Edge Function: marina-direct-checkout
// Real WooCommerce order creation path, hard-disabled until server configuration and QA.
// Required server secrets: SUPABASE_URL, SUPABASE_ANON_KEY, WOO_CONSUMER_KEY,
// WOO_CONSUMER_SECRET. Optional ME_CHECKOUT_ENABLED (default false).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
const packs:Record<string,{productId:number;price:string}>={
  "ME-CREDITS-50000":{productId:38090,price:"4.99"},
  "ME-CREDITS-120000":{productId:38091,price:"9.99"},
  "ME-CREDITS-300000":{productId:38092,price:"19.99"},
  "ME-CREDITS-900000":{productId:38093,price:"49.99"},
  "ME-CREDITS-2000000":{productId:38094,price:"99.99"}
};
const headers={"content-type":"application/json","access-control-allow-origin":"https://rpgsrl24-ship-it.github.io","vary":"Origin"};
Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:{...headers,"access-control-allow-headers":"authorization,content-type,apikey","access-control-allow-methods":"POST,OPTIONS"}});
  if(req.method!=="POST")return Response.json({error:"Method not allowed"},{status:405,headers});
  if(Deno.env.get("ME_CHECKOUT_ENABLED")!=="true")
    return Response.json({error:"Checkout not yet enabled"},{status:503,headers});
  try{
    const token=req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
    if(!token) return Response.json({error:"Authentication required"},{status:401,headers});
    const supabase=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_ANON_KEY")!,{auth:{persistSession:false}});
    const {data:{user},error}=await supabase.auth.getUser(token);
    if(error||!user||!user.email||user.is_anonymous)
      return Response.json({error:"Registered player required"},{status:401,headers});
    const body=await req.json();
    if(!body||typeof body!=="object"||Object.keys(body).some(k=>k!=="sku")||
      typeof body.sku!=="string"||!Object.hasOwn(packs,body.sku))
      return Response.json({error:"Invalid package"},{status:400,headers});
    const product=packs[body.sku];
    const key=Deno.env.get("WOO_CONSUMER_KEY"),secret=Deno.env.get("WOO_CONSUMER_SECRET");
    if(!key||!secret)throw new Error("WooCommerce credentials not configured");
    // Never use browser-submitted identity, price, order ID or return URL.
    // Quantity fixed at 1 until complete refund and mixed-cart handling is tested.
    const auth="Basic "+btoa(key+":"+secret);
    const response=await fetch("https://rpgyacht.com/wp-json/wc/v3/orders",{
      method:"POST",headers:{"authorization":auth,"content-type":"application/json"},
      body:JSON.stringify({status:"pending",currency:"EUR",set_paid:false,
        billing:{email:user.email},line_items:[{product_id:product.productId,quantity:1}],
        meta_data:[{key:"_me_account_id",value:user.id},{key:"_me_credit_sku",value:body.sku}]})
    });
    if(!response.ok)throw new Error("WooCommerce order creation failed");
    const order=await response.json();
    if(!Number.isSafeInteger(order.id)||!/^wc_order_[a-zA-Z0-9]+$/.test(order.order_key||""))
      throw new Error("WooCommerce order response invalid");
    const url=new URL("/checkout/order-pay/"+order.id+"/","https://rpgyacht.com");
    url.searchParams.set("pay_for_order","true");
    url.searchParams.set("key",order.order_key);
    return Response.json({checkout_url:url.toString(),order_id:order.id},{headers});
  }catch(_error){
    return Response.json({error:"Checkout temporarily unavailable"},{status:503,headers});
  }
});
