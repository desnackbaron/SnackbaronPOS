const CACHE_NAME = "snackbaron-pos-v4-0";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./logo.png",
  "./images/bruis-water.png",
  "./images/cola-zero.png",
  "./images/cola.png",
  "./images/dr-pepper.png",
  "./images/fanta.png",
  "./images/ice-tea-peach.png",
  "./images/ice-tea.png",
  "./images/jupiler-00.png",
  "./images/jupiler.png",
  "./images/monster.png",
  "./images/plat-water.png",
  "./images/red-bull.png",
  "./images/sprite.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  // Pagina openen: eerst internet voor updates, anders offline cache.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // App-bestanden en foto's: direct uit cache, ondertussen vernieuwen.
  event.respondWith(
    caches.match(request).then(cached => {
      const refresh = fetch(request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);

      return cached || refresh;
    })
  );
});
