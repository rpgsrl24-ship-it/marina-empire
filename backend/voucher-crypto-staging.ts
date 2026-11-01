// Staging-only voucher material preparation. Never expose the plaintext code in logs.
// The caller must store the encrypted payload and voucher hash in one database transaction.
export async function prepareVoucher(keyBytes: Uint8Array) {
  if(keyBytes.byteLength!==32) throw new Error("AES-256 key required");
  const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const raw=crypto.getRandomValues(new Uint8Array(24));
  const segments=Array.from({length:3},(_,i)=>
    Array.from(raw.slice(i*8,i*8+8),n=>alphabet[n%alphabet.length]).join(""));
  const code="ME-"+segments.join("-");
  const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(code)));
  const hash=Array.from(digest,b=>b.toString(16).padStart(2,"0")).join("");
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await crypto.subtle.importKey("raw",keyBytes,{name:"AES-GCM"},false,["encrypt"]);
  const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(code)));
  const base64=(a:Uint8Array)=>btoa(Array.from(a,b=>String.fromCharCode(b)).join(""));
  return {codeHash:hash,codeCiphertext:base64(encrypted),codeNonce:base64(iv),keyVersion:1};
}
