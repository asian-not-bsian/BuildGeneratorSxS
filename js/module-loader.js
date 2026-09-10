const loaded=new Set();
const map={
 optimize:'./modules/optimize.js',
 reliclab:'./modules/optimize.js',
 fantlab:'./modules/optimize.js',
 account:'./modules/optimize.js',
 chaosrealm:'./modules/chaos-realm.js',
 acquisition:'./modules/acquisition.js',
 datahealth:'./modules/data-health.js',
 team:'./modules/team.js',
 build:'./modules/screenshots.js',
 pvp:'./modules/screenshots.js',
 reference:'./modules/reference.js',
 setlogic:'./modules/reference.js',
 droprates:'./modules/reference.js',
 source:'./modules/reference.js'
};
async function load(tab){const src=map[tab];if(!src||loaded.has(src))return;loaded.add(src);try{const m=await import(src);m.init?.(window.SXS_APP,tab)}catch(e){console.error('Feature module failed',src,e)}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)load(b.dataset.tab)});
window.addEventListener('DOMContentLoaded',()=>{const b=document.querySelector('.nav-subtab-v58.active');load(b?.dataset.tab||'build')});

if('serviceWorker' in navigator&&location.protocol!=='file:'){window.addEventListener('load',()=>navigator.serviceWorker.register(new URL('../sw.js',import.meta.url),{scope:'../'}).catch(e=>console.warn('Service worker registration failed',e)))}
