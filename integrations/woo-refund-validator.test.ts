import { validateFullRefundOrder, type RefundOrder } from "./woo-refund-validator.ts";
const order=():RefundOrder=>({id:123,status:"refunded",currency:"EUR",date_paid:"2026-11-01T10:00:00",refunds:[{id:88}]});
function check(ok:boolean,msg:string){if(!ok)throw new Error(msg);}
function rejects(o:RefundOrder,id=123){let rejected=false;try{validateFullRefundOrder(id,o);}catch{rejected=true;}check(rejected,"Expected rejection");}
Deno.test("verified full refund accepted",()=>{check(validateFullRefundOrder(123,order())==="full_refund","Expected full refund");});
Deno.test("partial or incomplete refund sent to manual review",()=>{check(validateFullRefundOrder(123,{...order(),status:"processing"})==="manual_review","Expected manual review");});
Deno.test("mismatched order rejected",()=>{rejects(order(),124);});
Deno.test("unpaid order rejected",()=>{rejects({...order(),date_paid:null});});
Deno.test("wrong currency rejected",()=>{rejects({...order(),currency:"USD"});});
Deno.test("missing refund record rejected",()=>{rejects({...order(),refunds:[]});});
Deno.test("invalid refund identifier rejected",()=>{rejects({...order(),refunds:[{id:-1}]});});
