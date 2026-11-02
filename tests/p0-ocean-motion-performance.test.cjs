'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');

test('approved helm photo stays fixed while dedicated water layers animate',()=>{
 assert(html.includes('<style id="me-helm-ocean-motion-v4">'));
 assert(html.includes('animation:none!important;transform:none!important;will-change:auto!important;'));
 assert(html.includes('@keyframes meWaveTravel'));
 assert(html.includes('@keyframes meWakeFlow'));
 assert(html.includes('.me-water-motion::before,.me-water-motion::after'));
 assert(html.includes('.me-wake:before,.me-wake:after'));
});

test('duplicate sea-reflection layer is static to avoid extra paint work',()=>{
 assert(html.includes('.me-sea-motion::before'));
 assert(html.includes('.me-sea-motion::after'));
 assert(html.includes('contain:paint'));
 assert(!html.includes('@keyframes meOceanBob'),'full bridge bob animation must stay removed');
 assert(!html.includes('@keyframes meOceanDrift'),'duplicate sea drift animation must stay removed');
});

test('mobile water is lighter than desktop',()=>{
 assert(html.includes('@media(max-width:740px)'));
 assert(html.includes('.me-water-motion::after,.me-wake::after{display:none!important}'));
 assert(html.includes('.me-water-motion{opacity:.5!important}'));
 assert(html.includes('.me-wake{opacity:.38!important}'));
});

test('reduced motion disables water and wake animation layers',()=>{
 assert(html.includes('@media(prefers-reduced-motion:reduce)'));
 assert(html.includes('.me-water-motion::before'));
 assert(html.includes('.me-wake::before'));
 assert(html.includes('animation:none!important;transition:none!important;transform:none!important;will-change:auto!important'));
});

console.log('P0 ocean motion/performance contracts loaded');