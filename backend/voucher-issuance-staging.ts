// Server-side staging adapter for atomic voucher/outbox issuance.
// Caller must independently verify a paid WooCommerce order and supply a trusted line.
import { prepareVoucher } from "./voucher-crypto-staging.ts";

type PaidLine = {orderId:number;itemId:number;unitIndex:number;credits:number;recipientEmail:string};
type RpcResult = {data: string|null;error: {message:string}|null};
type Rpc = (name:string,args:Record<string,unknown>)=>Promise<RpcResult>;

export async function issuePaidLineStaging(line:PaidLine,key:Uint8Array,rpc:Rpc) {
  if(!Number.isSafeInteger(line.orderId)||line.orderId<1 ||
     !Number.isSafeInteger(line.itemId)||line.itemId<1 ||
     !Number.isSafeInteger(line.unitIndex)||line.unitIndex<0||line.unitIndex>=100 ||
     ![50000,120000,300000,900000,2000000].includes(line.credits) ||
     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line.recipientEmail) ||
     line.recipientEmail.length>254) throw new Error("Invalid paid line");
  const voucher=await prepareVoucher(key);
  const {data,error}=await rpc("me_issue_voucher_with_outbox_internal",{
    p_code_hash:voucher.codeHash,
    p_credits:line.credits,
    p_order_id:line.orderId,
    p_item_id:line.itemId,
    p_unit_index:line.unitIndex,
    p_recipient_email:line.recipientEmail,
    p_ciphertext:voucher.codeCiphertext,
    p_nonce:voucher.codeNonce,
    p_key_version:voucher.keyVersion
  });
  if(error){
    if(/duplicate key|unique constraint|23505/i.test(error.message))
      throw new Error("Voucher already issued for this order item and unit");
    throw new Error("Voucher issuance unavailable");
  }
  if(!data) throw new Error("Voucher issuance unavailable");
  return {voucherId:data};
}
