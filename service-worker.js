const CACHE='snackbaron-pos-v3-0-0';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.json','./logo.png','./images/plat-water.png','./images/bruis-water.png','./images/cola.png','./images/cola-zero.png','./images/dr-pepper.png','./images/fanta.png','./images/sprite.png','./images/jupiler.png','./images/jupiler-00.png','./images/ice-tea.png','./images/ice-tea-peach.png','./images/red-bull.png','./images/monster.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
