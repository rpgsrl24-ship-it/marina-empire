'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const shop=fs.readFileSync('credit-purchase-rc.js','utf8');
const guard=fs.readFileSync('credit-sync-guard.js','utf8');
const marketplace=fs.readFileSync('marketplace-mobile.html','utf8');
const index=fs.readFileSync('index.html','utf8');

assert(shop.includes('enabled:true'),'Credit shop must be explicitly enabled after live E2E approval');
assert(!shop.includes('enabled:false'),'Credit shop cannot remain in pre-launch disabled state');
assert(shop.includes('directCheckoutReady:true'),'Direct checkout must declare readiness explicitly');
assert(shop.includes('currentUser()'),'Purchase flow must require an authenticated user check');
assert(shop.includes('email_confirmed_at'),'Purchase flow must require a verified email account');
assert(shop.includes('typeof window.meCreditCheckoutReady!=="function"'),'Checkout must fail closed when the sync guard is missing');
assert(shop.includes('marina-direct-checkout'),'Purchase flow must use the authenticated Supabase checkout function');
assert(shop.includes('window.location.assign'),'Checkout must use the server-issued RPG Yacht checkout URL');
assert(!shop.includes('window.open('),'Purchase popups are forbidden');

assert(guard.includes('window.meCreditCheckoutReady=async function()'),'Modern game must expose the cloud-sync pre-check');
assert(guard.includes('sameGameState(remote.data.game_state,snapshot)'),'Local and cloud state must match before purchase');
assert(guard.includes('marina-claim-purchased-credits'),'Return flow must claim purchased credits through the server function');
assert(guard.includes('marina_empire_before_credit_merge'),'Return flow must create a local backup before applying purchased credits');
assert(guard.includes('local.c.writeGame(local.h,data.game_state)'),'Purchased credits must merge through the current local-save context');
assert(marketplace.includes('credit-sync-guard.js'),'Modern Marketplace must load the credit sync guard');
assert(marketplace.includes('credit-purchase-rc.js'),'Modern Marketplace must load the credit checkout module');
assert(index.includes('credit_purchase')&&index.includes('marketplace-mobile.html'),'Root router must preserve successful credit returns into the modern Marketplace');

console.log('PASS: real-money credit release uses the modern mobile sync guard and fail-closed checkout');
