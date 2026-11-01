import { decideRefundDeliveryAction, type DeliveryRecord } from "./voucher-recovery-policy.ts";
export type RefundRow = { deliveryId:string; voucherId:string; orderId:number; redeemed:boolean; delivery:DeliveryRecord };
export type RefundPlan = { cancelDeliveryIds:string[]; revokeVoucherIds:string[]; manualReview:{deliveryId:string;reason:string}[] };
export function planVerifiedRefund(orderId:number,verified:boolean,rows:RefundRow[]):RefundPlan {
 if(!Number.isSafeInteger(orderId)||orderId<=0)throw new Error("Invalid order ID");
 if(!verified)throw new Error("Refund not independently verified");
 const plan:RefundPlan={cancelDeliveryIds:[],revokeVoucherIds:[],manualReview:[]};
 const seen=new Set<string>();
 for(const row of rows){
  if(row.orderId!==orderId)throw new Error("Mixed orders");
  if(seen.has(row.deliveryId))throw new Error("Duplicate delivery");
  seen.add(row.deliveryId);
  const action=decideRefundDeliveryAction(row.delivery,row.redeemed,true);
  if(action.action==="cancel"){plan.cancelDeliveryIds.push(row.deliveryId);plan.revokeVoucherIds.push(row.voucherId);}
  else if(action.action==="manual_provider_reconciliation")plan.manualReview.push({deliveryId:row.deliveryId,reason:action.reason});
 }
 // This is a plan only: cancellation and revocation require one atomic server-side transaction.
 return plan;
}
