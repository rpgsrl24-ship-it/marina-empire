const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
for(const token of ['id="cloudLogin"','id="cloudRegister"','id="cloudLogout"','id="cloudResetPassword"','client.auth.signInWithPassword({email,password})','client.auth.signUp({email,password','client.auth.signOut({scope:"local"})','client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname})','el("cloudResetPassword").addEventListener("click",resetPassword)'])assert(html.includes(token),'Missing account feature: '+token);
const start=html.indexOf('async function resetPassword()');const end=html.indexOf('async function signout()',start);assert(start>0&&end>start,'Password recovery function missing');const body=html.slice(start,end);assert(body.includes('if(busy)return'),'Password recovery must guard concurrent requests');assert(body.includes('if(r.error)throw r.error'),'Password recovery must handle provider errors');assert(body.includes('Se l’account esiste'),'Password recovery must avoid account enumeration in success message');
console.log('PASS: signup, login, logout and recovery request UI contracts');
