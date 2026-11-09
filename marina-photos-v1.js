(()=>{
"use strict";
const fallback="./anteprima/assets/render-2026/marine.jpg";
const photos={
rose:{name:"Isola delle Rose",url:fallback,source:"Render Marina Empire"},
rimini:{name:"Marina di Rimini",url:"https://img.marinas.com/v2/251c6f58536fbcef278d843f1863f20c355bdf76309b0a67d9fa0cee39456d6c.jpg",source:"Marinas.com"},
ancona:{name:"Marina Dorica · Ancona",url:"https://img.marinas.com/v2/898a699d9eb158e16f1306f86dbeb538139d7cfc02b417f7e4b7903b2ed4e32f.jpg",source:"Marinas.com"},
lignano:{name:"Marina Punta Faro · Lignano",url:"https://cdn.shopify.com/s/files/1/0892/3598/0611/articles/D_Marin_Punta_Faro07134706_0142_D_69b6277c-06ed-422b-bb60-3ed478ad9844.jpg?v=1747818043",source:"Pardo Yachts / Marina Punta Faro"},
cervia:{name:"Marina di Cervia",url:"https://img.marinas.com/v2/c24da706d0def65ed8fa3cf7b8065dd7e1f39bdb64f8b392eaf5e929444fb0d3.jpg",source:"Marinas.com"},
bari:{name:"Porto di Bari",url:"https://programming14-20.italy-croatia.eu/documents/301381/0/Porto%2Bdi%2BBari%2Bok%2Bpixel.png/2c7fe1d9-01ba-9527-143d-f43b65478bc7?imagePreview=1&t=1627468303462",source:"Interreg Italy-Croatia"},
ravenna:{name:"Marinara · Marina di Ravenna",url:"https://censimentoarchitetturecontemporanee.cultura.gov.it/img/3/4/7/3/3/34733.jpg",source:"Ministero della Cultura"},
pescara:{name:"Marina di Pescara",url:"https://img.marinas.com/v2/b0e6f8742b7265b4e38949b7316e736226e90df9446a89098929fd3e88ac4340.jpg",source:"Marinas.com"},
brindisi:{name:"Marina di Brindisi",url:"https://pressmare.it/storage/app/uploads/public/682/c58/c23/682c58c23ecfe624180283.jpg",source:"PressMare"},
salerno:{name:"Marina d’Arechi · Salerno",url:"https://d2wzo7cpkz5upz.cloudfront.net/photos2/20140805_0608-03_IT_Pollica-IT_Positano/DS/0608-03_WIDE_Q98A7542.jpg",source:"TripInView"},
nettuno:{name:"Marina di Nettuno",url:"https://www.comune.nettuno.roma.it/sites/comune.nettuno.roma.it/files/styles/wide/public/2025-04/Marina%20di%20Nettuno%20%282%29.png?itok=99S55RTg",source:"Comune di Nettuno"},
scarlino:{name:"Marina di Scarlino",url:"https://www.marinadiscarlino.com/wp3/wp-content/uploads/revslider/video-media/HOMEPAGE-MDS-2025_507.jpeg",source:"Marina di Scarlino"},
loano:{name:"Marina di Loano",url:"https://modulo.net/files/chunks/6242bf1ba0d55620e2000095/6242bfd4a0d55620e2000096.jpg",source:"Modulo.net"},
portocervo:{name:"Marina di Porto Cervo",url:"https://static.wixstatic.com/media/9c8337_13a5034f77b443b18c41b8dc11d44d34~mv2.webp",source:"Yacht & Service Sardinia"},
capodorlando:{name:"Capo d’Orlando Marina",url:"https://www.nebrodinews.it/wp-content/uploads/2022/05/porto-turistico-capo-dorlando.jpeg",source:"Nebrodi News"}
};
function get(id){return photos[id]||{name:id||"Marina",url:fallback,source:"Marina Empire"}}
function apply(img,id){if(!img)return;const p=get(id);img.src=p.url;img.alt=p.name;img.onerror=()=>{img.onerror=null;img.src=fallback}}
window.MarinaEmpireMarinaPhotos=Object.freeze({photos,get,apply,fallback});
})();