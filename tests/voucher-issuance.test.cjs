const fs=require('node:fs');
const assert=require('node:assert/strict');
const src=fs.readFileSync('backend/voucher-issuance-staging.ts','utf8');
for(const name of ['prepareVoucher','me_issue_voucher_with_outbox_internal','p_order_id','p_item_id','p_unit_index','p_recipient_email','p_ciphertext','p_nonce','p_key_version','Number.isSafeInteger','Voucher already issued for this order item and unit']) assert(src.includes(name),'Missing staging issuance contract: '+name);
assert(src.includes(String.raw`[^\\s@]`)===false,'Email regex must not contain literal double-escaped whitespace');
assert(src.includes(String.raw`[^\s@]`),'Email regex should exclude whitespace');
console.log('PASS: voucher issuance staging contract');
