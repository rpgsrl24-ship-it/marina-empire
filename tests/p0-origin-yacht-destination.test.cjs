'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const test=require('node:test');

const html=fs.readFileSync('index.html','utf8');

test('voyage identity is derived from active trip and saved yacht',()=>{
 assert(html.includes('boat(state.trip?.mission?.boat||state.boat).name'));
 assert(!html.includes('Yacht RPG Voyager a '),'VHF must not hard-code the starter yacht');
 assert(html.includes('boat(trip.mission?.boat||state.boat).name+" · "+port(origin).name+" → "+port(nextPort).name'));
});

test('GPS bridge is the intentional voyage scene and old dock scene stays hidden',()=>{
 assert(html.includes('Scene 3D di uscita/arrivo disattivate: solo plancia GPS durante il viaggio.'));
 assert(html.includes('$("cinemaDock").classList.add("hide")'));
 assert(html.includes('$("cinemaSea").classList.remove("hide")'));
});

test('arrival console derives destination from saved game state',()=>{
 assert(html.includes('state.port=destination'));
 assert(html.includes('state.lastDockedBridge={origin:trip.origin||state.port,destination:state.port,at:Date.now()}'));
 assert(html.includes('boat(state.boat).name+(dock.interrupted?" · Sosta tecnica a ":" · Ormeggiato a ")+port(dock.destination).name'));
});

console.log('P0 origin/yacht/destination contracts loaded');