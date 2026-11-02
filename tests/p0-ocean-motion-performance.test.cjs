'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');

test('approved helm photo stays fixed while sea layers animate',()=>{
 assert(html.includes('<style id="me-helm-ocean-motion-v3">'));
 assert(html.includes('#meHelmWindow{'));
 assert(html.includes('animation:none!important;transform:none!important;will-change:auto!important;'));
 assert(html.includes('@keyframes meOceanDrift'));
 assert(html.includes('@keyframes meOceanLayerDrift'));
 assert(html.includes('animation:meOceanDrift 10s ease-in-out infinite!important'));
});

test('mobile sea animation is lighter than desktop',()=>{
 assert(html.includes('@media(max-width:740px)'));
 assert(html.includes('opacity:.18!important;animation-duration:14s!important;will-change:auto'));
 assert(html.includes('.me-sea-motion::after{display:none!important}'));
});

test('reduced motion disables all sea animation layers',()=>{
 assert(html.includes('@media(prefers-reduced-motion:reduce)'));
 assert(html.includes('.me-sea-motion::before'));
 assert(html.includes('.me-sea-motion::after'));
 assert(html.includes('animation:none!important;transition:none!important;transform:none!important;will-change:auto!important'));
});

test('animation is limited to composited transforms rather than moving the full bridge',()=>{
 assert(!html.includes('@keyframes meOceanBob'),'full bridge bob animation must stay removed');
 assert(html.includes('transform:translate3d(-2%,0,0)'));
 assert(html.includes('contain:paint'));
});

console.log('P0 ocean motion/performance contracts loaded');