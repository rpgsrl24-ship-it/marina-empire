(()=>{
"use strict";
if(window.__ME_BRIDGE_BACKGROUND__)return;
window.__ME_BRIDGE_BACKGROUND__=true;

async function loadBridge(){
 try{
  const res=await fetch("./assets/bridge-cockpit.b64",{cache:"force-cache"});
  if(!res.ok)return;
  const b64=(await res.text()).trim();
  if(!b64)return;
  const dataUrl="data:image/webp;base64,"+b64;
  document.documentElement.style.setProperty("--me-bridge-bg",'url("'+dataUrl+'")');
 }catch(_){}
}
const st=document.createElement("style");
st.id="me-bridge-background-style";
st.textContent=`
@media(min-width:741px) and (max-width:899px) and (orientation:landscape){
 #home .hero{
   background-image:
    linear-gradient(180deg,rgba(2,16,27,.08),rgba(2,16,27,.12)),
    var(--me-bridge-bg)!important;
   background-size:cover!important;
   background-position:center center!important;
   background-repeat:no-repeat!important;
 }
 #home .hero:before,#home .hero:after{display:none!important}
 .me-live-home-marina{mix-blend-mode:normal!important}
 .me-live-home-boat{font-size:24px!important;opacity:.92!important}
 .me-live-home-traffic{
   left:105px!important;right:105px!important;bottom:104px!important;
   grid-template-columns:repeat(3,minmax(0,1fr))!important
 }
 .me-live-home-vhf{
   top:24px!important;width:min(44%,520px)!important;background:rgba(4,31,44,.78)!important
 }
 .me-live-home-loc{top:24px!important;left:18px!important}
 .me-live-home-contract{bottom:18px!important;width:min(68%,760px)!important}
}
`;
document.head.appendChild(st);
loadBridge();
})();