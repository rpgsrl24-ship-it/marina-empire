'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');

const html=fs.readFileSync('direction-mobile.html','utf8');

assert(html.includes('function renderDirection()'),'Direction must expose a reusable balance renderer');
assert(html.includes('window.addEventListener("pageshow",renderDirection)'),'Direction must refresh after browser back/forward cache restores');
assert(html.includes('visibilitychange'),'Direction must refresh when returning to the tab');

for(const id of ['coins','mCoins','bCoins']){
  const pattern=new RegExp(id+'\\.textContent=fmt\\(g\\.coins\\)');
  assert(pattern.test(html),id+' must render the current saved coin balance');
}
assert(!/coins\.textContent\s*=\s*["']?10000/.test(html),'Direction must not hard-code 10,000 coins');
assert(!/mCoins\.textContent\s*=\s*["']?10000/.test(html),'Direction capital must not be hard-coded');
assert(!/bCoins\.textContent\s*=\s*["']?10000/.test(html),'Direction balance must not be hard-coded');

console.log('PASS: Direction always renders current saved coins and refreshes on page return.');
