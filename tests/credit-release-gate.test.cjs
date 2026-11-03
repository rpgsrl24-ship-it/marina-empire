'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const shop=fs.readFileSync('credit-purchase-rc.js','utf8');
const index=fs.readFileSync('index.html','utf8');

assert(shop.includes('enabled:true'),'Credit shop must be explicitly enabled after live E2E approval');
assert(!shop.includes('enabled:false'),'Credit shop cannot remain in pre-launch disabled state');
assert(shop.includes('directCheckoutReady:true'),'Direct checkout must declare readiness explicitly');
assert(shop.includes('currentUser()'),'Purchase flow must require an authenticated user check');
assert(shop.includes('email_confirmed_at'),'Purchase flow must require a verified email account');
assert(shop.includes('meCreditCheckoutReady'),'Purchase flow must verify the game/cloud state before checkout');
assert(shop.includes('marina-direct-checkout'),'Purchase flow must use the authenticated Supabase checkout function');
assert(shop.includes('window.location.assign'),'Checkout must use the server-issued RPG Yacht checkout URL');
assert(!shop.includes('window.open('),'Purchase popups are forbidden');

assert(index.includes('window.meCreditCheckoutReady=async function()'),'Game must expose the cloud-sync pre-check');
assert(index.includes('sameGameState(remote.data.game_state,snapshot)'),'Local and cloud state must match before purchase');
assert(index.includes('marina-claim-purchased-credits'),'Return flow must claim purchased credits through the server function');
assert(index.includes('marina_empire_before_credit_merge'),'Return flow must create a local backup before applying purchased credits');
assert(index.includes('window.MarinaEmpireCreditShopRC?.enabled===true'),'Voucher fallback must still depend on the explicit release gate');
assert(index.includes('if(!creditRcEnabled())return;'),'Voucher fallback must fail closed when credits are disabled');

console.log('PASS: real-money credit release is explicitly enabled with authenticated direct-credit safeguards');
