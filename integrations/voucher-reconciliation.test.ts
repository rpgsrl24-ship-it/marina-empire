import { findStaleDeliveries, type ReconciliationRow } from "./voucher-reconciliation-policy.ts";
const now=new Date("2026-11-01T12:00:00Z");
const base:ReconciliationRow={
 id:"delivery-1",woo_order_id:123,status:"sending",attempts:1,
 updatedAt:"2026-11-01T11:00:00Z",providerMessageId:null
};
function check(ok:boolean,message:string){if(!ok)throw new Error(message);}
Deno.test("stale sending delivery appears for review",()=>{
 const result=findStaleDeliveries([base],now);
 check(result.length===1,"Expected one review item");
 check(result[0].age_minutes===60,"Expected 60 minutes");
});
Deno.test("recent sending delivery is excluded",()=>{
 check(findStaleDeliveries([{...base,updatedAt:"2026-11-01T11:45:00Z"}],now).length===0,"Unexpected review");
});
Deno.test("completed and retry deliveries are excluded",()=>{
 check(findStaleDeliveries([{...base,status:"sent"},{...base,status:"retry"}],now).length===0,"Unexpected review");
});
Deno.test("review output contains no customer address or voucher code",()=>{
 const record={...base,recipient_email:"customer@example.com",code_ciphertext:"secret"};
 const result=findStaleDeliveries([record],now);
 check(!JSON.stringify(result).includes("customer@example.com"),"Leaked email");
 check(!JSON.stringify(result).includes("secret"),"Leaked ciphertext");
});
Deno.test("invalid result limit is rejected",()=>{
 let rejected=false;try{findStaleDeliveries([base],now,101);}catch{rejected=true;}
 check(rejected,"Expected limit validation");
});
