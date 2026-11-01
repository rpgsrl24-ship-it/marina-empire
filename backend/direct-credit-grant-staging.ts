// Direct WooCommerce credit grant adapter (STAGING ONLY).
// A trusted server must independently re-fetch the paid Woo order, verify the
// account binding and amount, and call this adapter with the verified result.
// The database RPC must enforce a unique Woo order/item idempotency key.
type VerifiedGrant={orderId:number;itemId:number;accountId:string;credits:number};
type Rpc=(name:string,args:Record<string,unknown>)=>Promise<{data:unknown;error:{message:string}|null}>;
export async function grantVerifiedDirectCreditStaging(grant:VerifiedGrant,rpc:Rpc){
  if(!Number.isSafeInteger(grant.orderId)||grant.orderId<1||
    !Number.isSafeInteger(grant.itemId)||grant.itemId<1||
    !Number.isSafeInteger(grant.credits)||grant.credits<1||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(grant.accountId))
    throw new Error("Invalid verified grant");
  const {data,error}=await rpc("me_grant_direct_order_internal",{
    p_order_id:grant.orderId,p_item_id:grant.itemId,
    p_user_id:grant.accountId,p_credits:grant.credits
  });
  if(error||data===null||data===undefined)
    throw new Error("Direct credit grant unavailable");
  // RPC must return {credited:boolean,balance:string} where credited=false means replay.
  if(typeof data!=="object"||!data||typeof (data as {credited?:unknown}).credited!=="boolean")
    throw new Error("Invalid grant response");
  return data;
}
