// Staging-only voucher material preparation. Never expose the plaintext code in logs.
// The caller must store the encrypted payload and voucher hash in one database transaction.
export async function prepareVoucher(keyBytes: Uint8Array) {
  if(keyBytes.byteLength!==32) throw new Error("AES-256 key required");
  const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const chars: string[]=[];
  while(chars.length<24){
    const random=crypto.getRandomValues(new Uint8Array(32));
    for(const n of random){
      if(n>=Math.floor(256/alphabet.length)*alphabet.length) continue;
      chars.push(alphabet[n%alphabet.length]);
      if(chars.length===24) break;
    }
  }
  const segments=[chars.slice(0,8).join(""),chars.slice(8,16).join(""),chars.slice(16,24).join("")];
  const code="ME-"+segments.join("-");
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(code)));
  const hash=Array.from(digest,b=>b.toString(16).padStart(2,"0")).join("");
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await crypto.subtle.importKey("raw",keyBytes,{name:"AES-GCM"},false,["encrypt"]);
  const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(code)));
  const base64=(a:Uint8Array)=>btoa(Array.from(a,b=>String.fromCharCode(b)).join(""));
  return {codeHash:hash,codeCiphertext:base64(encrypted),codeNonce:base64(iv),keyVersion:1};
}
