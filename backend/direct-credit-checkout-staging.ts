// Server-only direct credit checkout contract. Payments and crediting are disabled by default.
// Never trust a browser-supplied price, Woo order status, or account identifier.
export const CREDIT_PRODUCTS = Object.freeze({
  "ME-CREDITS-50000":{productId:38090,credits:50000,priceCents:499},
  "ME-CREDITS-120000":{productId:38091,credits:120000,priceCents:999},
  "ME-CREDITS-300000":{productId:38092,credits:300000,priceCents:1999},
  "ME-CREDITS-900000":{productId:38093,credits:900000,priceCents:4999},
  "ME-CREDITS-2000000":{productId:38094,credits:2000000,priceCents:9999}
});
export function planDirectCheckout(sku:string,quantity:number,accountId:string){
  if(!Object.hasOwn(CREDIT_PRODUCTS,sku) || !Number.isSafeInteger(quantity) ||
    quantity<1 || quantity>10 || typeof accountId!=="string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(accountId))
    throw new Error("Invalid checkout request");
  const pack=CREDIT_PRODUCTS[sku as keyof typeof CREDIT_PRODUCTS];
  return {productId:pack.productId,quantity,expectedCredits:pack.credits*quantity,
    expectedPriceCents:pack.priceCents*quantity,accountId};
}
export function verifyPaidDirectOrder(order:{
  id:number;status:string;date_paid:string|null;currency:string;
  line_items:Array<{id:number;product_id:number;quantity:number;total:string;total_tax?:string}>;
  meta_data:Array<{key:string;value:unknown}>;
},expected:{orderId:number;productId:number;quantity:number;accountId:string}){
  if(!Number.isSafeInteger(order?.id)||order.id!==expected.orderId ||
    !["processing","completed"].includes(order.status)||!order.date_paid||
    order.currency!=="EUR"||!Array.isArray(order.line_items)||
    order.line_items.length!==1||!Array.isArray(order.meta_data))
    throw new Error("Order not eligible");
  const item=order.line_items[0];
  const product=Object.values(CREDIT_PRODUCTS).find(p=>p.productId===expected.productId);
  if(!product||item.product_id!==expected.productId||item.quantity!==expected.quantity||
    !Number.isSafeInteger(item.id)||item.id<1)
    throw new Error("Product mismatch");
  // Coupon discounts are not supported in the initial direct-credit release.
  // Compare integer cents; reject refunds separately before granting credits.
  if(!/^\d+\.\d{2}$/.test(item.total) ||
    Number(item.total.replace(".",""))!==product.priceCents*item.quantity)
    throw new Error("Unexpected order amount");
  const accounts=order.meta_data.filter(m=>m.key==="_me_account_id");
  if(accounts.length!==1||accounts[0].value!==expected.accountId)
    throw new Error("Account mismatch");
  return {orderId:order.id,itemId:item.id,accountId:expected.accountId,
    credits:product.credits*item.quantity};
}
