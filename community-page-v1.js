(()=>{
"use strict";
if(window.__ME_COMMUNITY_PAGE_V1__)return;
window.__ME_COMMUNITY_PAGE_V1__=true;

const style=document.createElement("style");
style.textContent=`
#community .me-community-wrap{max-width:880px;margin:0 auto}
#community #marinaCommunity{margin:0!important;border:1px solid #b99b64!important;background:linear-gradient(145deg,#0a3042,#071d2d)!important}
#community #marinaCommunity>h3{font:700 clamp(22px,5vw,30px) Georgia,serif!important;color:#f2d18e!important}
#community .me-community-intro{margin:0 0 12px;padding:12px 14px;border:1px solid rgba(105,190,214,.35);border-radius:12px;background:#092b3b;color:#c9dade}
@media(max-width:899px){#community>.me-lux-page-head{min-height:128px!important}#community .panel{padding:10px!important}}
`;
document.head.appendChild(style);

function ensure(){
 if(document.getElementById("community"))return;
 const office=document.getElementById("office");
 if(!office)return;
 const section=document.createElement("section");
 section.id="community";
 section.className="screen hide";
 section.innerHTML='<header class="me-lux-page-head" style="--me-page-image:url(\'./anteprima/assets/render-2026/marine.jpg\')"><span>MARINA EMPIRE · COMANDANTI ONLINE</span><h1>COMMUNITY</h1><p>Chat generale e conversazioni della marina in cui ti trovi.</p></header><div class="panel me-community-wrap"><div class="me-community-intro"><strong>💬 Centro Community</strong><br><span>Parla con gli altri comandanti, passa dalla chat generale alla marina attuale e segui l\'attività della community.</span></div></div>';
 office.insertAdjacentElement("afterend",section);
 const panel=document.getElementById("marinaCommunity");
 if(panel)section.querySelector(".me-community-wrap").appendChild(panel);
}
function sync(){
 ensure();
 const panel=document.getElementById("marinaCommunity");
 const wrap=document.querySelector("#community .me-community-wrap");
 if(panel&&wrap&&panel.parentNode!==wrap)wrap.appendChild(panel);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(sync,0),{once:true});else setTimeout(sync,0);
window.addEventListener("marina-empire-updated",sync);
})();