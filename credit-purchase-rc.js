(function(){
"use strict";
const CONFIG={
  enabled:false,
  shopBase:"https://www.rpgyacht.com",
  packages:[
    {productId:38090,sku:"ME-CREDITS-50000",credits:50000,price:"4,99"},
    {productId:38091,sku:"ME-CREDITS-120000",credits:120000,price:"9,99"},
    {productId:38092,sku:"ME-CREDITS-300000",credits:300000,price:"19,99"},
    {productId:38093,sku:"ME-CREDITS-900000",credits:900000,price:"49,99"},
    {productId:38094,sku:"ME-CREDITS-2000000",credits:2000000,price:"99,99"}
  ]
};
window.MarinaEmpireCreditShopRC=Object.freeze(CONFIG);
function mount(){
  const status=document.getElementById("meVoucherStatus");
  if(!status)return;
  const host=status.closest(".item");
  if(!host||host.querySelector("#meCreditPackagesRC"))return;
  const box=document.createElement("div");
  box.id="meCreditPackagesRC";
  box.className="hide";
  box.setAttribute("aria-hidden","true");
  const title=document.createElement("h4");
  title.textContent="Pacchetti crediti RPG Yacht";
  box.appendChild(title);
  for(const p of CONFIG.packages){
    const row=document.createElement("div");
    row.className="item";
    row.style.margin="8px 0";
    const txt=document.createElement("span");
    txt.textContent=new Intl.NumberFormat("it-IT").format(p.credits)+" crediti · €"+p.price;
    const btn=document.createElement("button");
    btn.type="button";
    btn.disabled=true;
    btn.textContent="ACQUISTA · NON ANCORA ATTIVO";
    btn.dataset.productId=String(p.productId);
    btn.dataset.sku=p.sku;
    btn.addEventListener("click",()=>{if(!CONFIG.enabled)return;});
    row.append(txt,document.createElement("br"),btn);
    box.appendChild(row);
  }
  host.insertBefore(box,status);
  if(CONFIG.enabled){
    box.classList.remove("hide");
    box.removeAttribute("aria-hidden");
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();