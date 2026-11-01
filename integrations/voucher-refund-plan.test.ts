import { planVerifiedRefund, type RefundRow } from "./voucher-refund-plan.ts";
const base:RefundRow={deliveryId:"d1",voucherId:"v1",orderId:123,redeemed:false,delivery:{
 status:"pending",attempts:0,updatedAt:"2026-11-01T10:00:00Z",providerMessageId:null
}};
function check(ok:boolean,message:string){if(!ok)throw new Error(message);}
Deno.test("verified refund plans cancellation and revocation",()=>{
 const plan=planVerifiedRefund(123,true,[base]);
 check(plan.cancelDeliveryIds[0]==="d1"&&plan.revokeVoucherIds[0]==="v1","Expected both actions");
});
Deno.test("unverified refund is rejected",()=>{
 let rejected=false;try{planVerifiedRefund(123,false,[base]);}catch{rejected=true;}
 check(rejected,"Unverified refund accepted");
});
Deno.test("redeemed voucher requires manual review",()=>{
 const plan=planVerifiedRefund(123,true,[{...base,redeemed:true}]);
 check(plan.manualReview.length===1&&plan.revokeVoucherIds.length===0,"Redeemed voucher must not auto revoke");
});
Deno.test("already sent voucher requires manual review",()=>{
 const plan=planVerifiedRefund(123,true,[{...base,delivery:{...base.delivery,status:"sent"}}]);
 check(plan.manualReview.length===1&&plan.cancelDeliveryIds.length===0,"Sent voucher must be reviewed");
});
Deno.test("mixed order rows rejected",()=>{
 let rejected=false;try{planVerifiedRefund(123,true,[{...base,orderId:456}]);}catch{rejected=true;}
 check(rejected,"Mixed order accepted");
});
Deno.test("duplicate deliveries rejected",()=>{
 let rejected=false;try{planVerifiedRefund(123,true,[base,base]);}catch{rejected=true;}
 check(rejected,"Duplicate accepted");
});
