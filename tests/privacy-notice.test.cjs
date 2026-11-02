'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const index=fs.readFileSync('index.html','utf8');
const privacy=fs.readFileSync('privacy.html','utf8');

assert(index.includes('href="./privacy.html"'),'Registration must link the game privacy notice');
assert(index.includes('Ho letto l’<a href="./privacy.html"'),'Privacy checkbox must be an acknowledgement of reading');
assert(!index.includes('accetto il trattamento necessario alla creazione dell’account'),'Necessary account processing must not be presented as optional marketing consent');
assert(index.includes('id="cloudMarketing" disabled'),'Marketing remains disabled in public beta');
assert(index.includes('non richieste per giocare'),'Marketing must be clearly unnecessary to play');

for(const required of [
 'Titolare del trattamento',
 'Dati trattati nella beta',
 'Finalità',
 'Base giuridica',
 'Analisi dell\'uso del gioco',
 'Fornitori tecnici',
 'Conservazione',
 'Diritti dell\'utente',
 'Pagamenti e marketing',
 'info@rpgyacht.com',
 'Supabase',
 'GitHub Pages'
]) assert(privacy.includes(required),'Missing privacy section/content: '+required);

assert(privacy.includes('raccolta di analytics di utilizzo dal client di gioco è sospesa'));
assert(privacy.includes('pagamenti e le ricariche di crediti sono disabilitati'));
console.log('PASS: game privacy notice linked, necessary processing separated from marketing, beta collection described');
