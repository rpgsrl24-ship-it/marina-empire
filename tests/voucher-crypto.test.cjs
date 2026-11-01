// Contract checks for voucher crypto. Does not issue or redeem real credits.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync('backend/voucher-crypto-staging.ts','utf8');
for(const marker of ['crypto.getRandomValues','crypto.subtle.digest','SHA-256','AES-GCM','codeHash','codeCiphertext','codeNonce','keyVersion','chars.length<24']) assert(src.includes(marker),'Missing voucher protection: '+marker);
assert(!src.includes('Math.random'),'Voucher codes must not use Math.random');
assert(!src.includes('console.log'),'Voucher material must not be logged');
console.log('PASS: voucher cryptography staging contract');
