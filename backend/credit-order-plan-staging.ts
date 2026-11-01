// Deterministic, server-only issuance plan. No network calls or voucher creation.
export type VerifiedCreditLine = {id:number;sku:string;quantity:number};
export type VoucherUnit = {orderId:number;itemId:number;unitIndex:number;credits:number;recipientEmail:string};
const packages:Record<string,number>={
  "ME-CREDITS-50000":50000,"ME-CREDITS-120000":120000,
  "ME-CREDITS-300000":300000,"ME-CREDITS-900000":900000,
  "ME-CREDITS-2000000":2000000
};
export function planVerifiedCreditOrder(orderId:number,email:string,lines:VerifiedCreditLine[]):VoucherUnit[]{
  if(!Number.isSafeInteger(orderId)||orderId<1||typeof email!=="string"||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||
    !Array.isArray(lines)) throw new Error("Invalid verified order");
  const result:VoucherUnit[]=[];
  const seen=new Set<number>();
  for(const line of lines){
    if(!Number.isSafeInteger(line.id)||line.id<1||seen.has(line.id)||
      !Object.hasOwn(packages,line.sku)||!Number.isSafeInteger(line.quantity)||
      line.quantity<1||line.quantity>100) throw new Error("Invalid credit line");
    seen.add(line.id);
    for(let i=0;i<line.quantity;i++){
      if(result.length>=100) throw new Error("Too many credit units");
      result.push({orderId,itemId:line.id,unitIndex:i,credits:packages[line.sku],recipientEmail:email});
    }
  }
  return result;
}
