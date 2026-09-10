'use strict';
const CACHE='sxs-build-generator-v7.0.1';
const SHELL=[
  './','./index.html','./assets/styles.css','./data/datamine.js','./js/app.js','./js/module-loader.js',
  './js/workers/optimizer-worker.js','./js/lib/formulas.mjs',
  './js/modules/optimize.js','./js/modules/chaos-realm.js','./js/modules/acquisition.js',
  './js/modules/data-health.js','./js/modules/team.js','./js/modules/screenshots.js','./js/modules/reference.js',
  './manifest.webmanifest'
];
const local=u=>u.origin===self.location.origin;
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL.map(p=>new URL(p,self.registration.scope).href))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sxs-build-generator-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(!local(url))return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(new URL('./index.html',self.registration.scope).href,copy));return res}).catch(()=>caches.match(new URL('./index.html',self.registration.scope).href)));
    return;
  }
  // Cache only the local app shell. User-triggered source refreshes point to remote origins and bypass this worker.
  const shellUrl=new Set(SHELL.map(p=>new URL(p,self.registration.scope).href));if(!shellUrl.has(url.href))return;
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone()));return res})));
});
