// Server-only checkout ownership binding. Staging: no payment creation.
export type CheckoutIntent={
  id:string;userId:string;sku:string;quantity:number;expiresAt:number;
};
export function verifyCheckoutIntent(
  intent:CheckoutIntent,
  verifiedUserId:string,
  sku:string,
  quantity:number,
  now:number
){
  if(!intent||typeof intent.id!=="string"||
     !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(intent.id)||
     intent.userId!==verifiedUserId||
     typeof verifiedUserId!=="string"||
     !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(verifiedUserId)||
     intent.sku!==sku||intent.quantity!==quantity||
     !Number.isSafeInteger(now)||!Number.isSafeInteger(intent.expiresAt)||
     intent.expiresAt<=now||intent.expiresAt>now+15*60*1000)
    throw new Error("Checkout intent invalid or expired");
  return {intentId:intent.id,userId:verifiedUserId,sku,quantity};
}
// Production integration requirements:
// - Authenticate JWT server-side and derive verifiedUserId from auth.getUser.
// - Store intent in server-controlled database; never trust a client-created intent.
// - Associate Woo order with a single immutable intent ID in server-only order meta.
// - Re-fetch Woo order and intent server-side; verify exact product, price and owner.
// - Atomically mark intent fulfilled with the wallet grant, rejecting replays.
// - Reject old, cancelled, refunded and ambiguous orders.
// - Never use billing email or editable Woo order metadata as sole proof of identity.
