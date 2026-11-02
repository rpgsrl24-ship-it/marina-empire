'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');

test('hidden 3D marina iframe is not eagerly loaded',()=>{
 const tag=html.match(/<iframe id="cinemaMarina"[^>]*>/)?.[0]||'';
 assert(tag.includes('loading="lazy"'));
 assert(tag.includes('fetchpriority="low"'));
 assert(!tag.includes('loading="eager"'));
});

test('Leaflet stylesheet does not block the first render',()=>{
 assert(html.includes('rel="preload" as="style" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"'));
 assert(html.includes("onload=\"this.onload=null;this.rel='stylesheet'\""));
 assert(html.includes('<noscript><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"></noscript>'));
});

test('interactive marina map starts on idle but opens immediately on explicit map navigation',()=>{
 assert(html.includes('requestIdleCallback(startMap,{timeout:1500})'));
 assert(html.includes('else setTimeout(startMap,650)'));
 assert(html.includes('if(b.dataset?.tab==="map")startMap()'));
});

console.log('P0 loading/transition contracts loaded');