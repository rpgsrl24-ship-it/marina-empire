// Pure safety gate for WooCommerce refund processing.
// Always use the authoritative order retrieved from the WooCommerce API.
export type RefundOrder = {
 id:number;
 status:string;
 currency:string;
 date_paid:string|null;
 refunds?:Array<{id:number}>;
};
export function validateFullRefundOrder(expectedId:number,order:RefundOrder):"full_refund"|"manual_review" {
 if(!Number.isSafeInteger(expectedId)||expectedId<=0||order.id!==expectedId)throw new Error("Order mismatch");
 if(order.currency!=="EUR")throw new Error("Unexpected currency");
 if(!order.date_paid)throw new Error("Order was never paid");
 if(order.status!=="refunded")return "manual_review";
 if(!Array.isArray(order.refunds)||order.refunds.length===0)throw new Error("Refund record missing");
 if(order.refunds.some(refund=>!Number.isSafeInteger(refund.id)||refund.id<=0))throw new Error("Invalid refund record");
 return "full_refund";
}
