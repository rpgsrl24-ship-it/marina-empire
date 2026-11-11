'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const account=fs.readFileSync('account-mobile.html','utf8');
const pwa=fs.readFileSync('pwa-install.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const home=fs.readFileSync('mobile-home.html','utf8');
const profile=fs.readFileSync('profile-mobile.html','utf8');

for(const token of [
 'signInWithPassword({email:e,password:p})',
 'signUp({email:e,password:p',
 'resetPasswordForEmail(e,{redirectTo:location.origin+location.pathname})',
 'signOut({scope:"local"})',
 'attachLocalAccount(u)',
 'window.MarinaLocalSaveContext?.select(null)'
]) assert(account.includes(token),'Missing modern account feature: '+token);

assert(account.includes('rel="manifest"'),'Account page must expose PWA manifest');
assert(home.includes('rel="manifest"'),'Home must expose PWA manifest');
assert(profile.includes('rel="manifest"'),'Profile must expose PWA manifest');
assert(home.includes('data-pwa-install'),'Home must expose conditional install control');
assert(profile.includes('data-pwa-install'),'Profile must expose conditional install control');
assert(account.includes('data-pwa-install'),'Account must expose conditional install control');

assert(pwa.includes('navigator.serviceWorker.register("./sw.js")'),'PWA helper must register the service worker');
assert(pwa.includes('beforeinstallprompt'),'PWA helper must capture install prompt');
assert(pwa.includes('appinstalled'),'PWA helper must react to successful installation');

assert(sw.includes('marina-empire-v20261111-modern1'),'Service worker must use the modern cache version');
assert(sw.includes('./mobile-home.html?v=20261110-fast3'),'Offline core must include modern Home');
assert(sw.includes('./account-mobile.html'),'Offline core must include Account');
assert(!sw.includes('cache.put(req.mode==="navigate"?"./index.html"'),'Navigation cache must not collapse every page into index.html');

console.log('PASS: modern Account and PWA contracts are present and legacy navigation caching is absent.');
