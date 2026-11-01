// Offline, payment-free E2E simulation of the voucher lifecycle.
// No WooCommerce, Supabase, email provider or network access.
import { validatePaidWooOrder, type WooOrder } from "./woo-order-validator.ts";
import { generateVoucherCode, hashVoucher, encryptVoucher, decryptVoucher } from "./voucher-crypto.ts";
import { decideRecovery, decideRefundDeliveryAction } from "./voucher-recovery-policy.ts";
import { planVerifiedRefund } from "./voucher-refund-plan.ts";

function assert(ok:unknown,msg:string):asserts ok{if(!ok)throw new Error(msg);}
const order=():WooOrder=>({
 id:20261101,status:"processing",currency:"EUR",date_paid:"2026-11-01T12:00:00Z",
 billing:{email:"test@example.invalid"},refunds:[],
 line_items:[{id:42,product_id:38090,sku:"ME-CREDITS-50000",quantity:2,total:"9.98",subtotal:"9.98"}]
});
Deno.test("offline paid-order to encrypted delivery and replay",async()=>{
 const units=validatePaidWooOrder(order());
 const key="AB".repeat(32);
 const issued=new Map<string,{hash:string;ciphertext:string;nonce:string;key_version:number}>();
 for(const unit of [...units,...units]){
  const id=[unit.orderId,unit.itemId,unit.unitIndex].join(":");
  if(issued.has(id))continue;
  const code=generateVoucherCode();
  const encrypted=await encryptVoucher(code,key);
  issued.set(id,{hash:await hashVoucher(code),...encrypted});
 }
 assert(issued.size===2,"Duplicate webhook generated duplicate vouchers");
 for(const item of issued.values()){
  const code=await decryptVoucher(item,key);
  assert(await hashVoucher(code)===item.hash,"Stored hash mismatch");
 }
 const sending={status:"sending" as const,attempts:1,updatedAt:"2026-11-01T10:00:00Z",providerMessageId:null};
 assert(decideRecovery(sending,new Date("2026-11-01T12:00:00Z")).action==="manual_provider_reconciliation","Stale delivery retried");
});
Deno.test("offline refunded order protects redeemed and already-sent vouchers",()=>{
 const delivery={status:"pending" as const,attempts:0,updatedAt:"2026-11-01T12:00:00Z",providerMessageId:null};
 const rows=[
  {deliveryId:"d1",voucherId:"v1",orderId:123,redeemed:false,delivery},
  {deliveryId:"d2",voucherId:"v2",orderId:123,redeemed:true,delivery},
  {deliveryId:"d3",voucherId:"v3",orderId:123,redeemed:false,delivery:{...delivery,status:"sent" as const}}
 ];
 const plan=planVerifiedRefund(123,true,rows);
 assert(plan.cancelDeliveryIds.length===1&&plan.revokeVoucherIds[0]==="v1","Wrong cancellation plan");
 assert(plan.manualReview.length===2,"Missing manual review cases");
 assert(decideRefundDeliveryAction(delivery,true,true).action==="manual_provider_reconciliation","Redeemed voucher revoked");
});
