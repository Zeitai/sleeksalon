/* Offline cache for The Sleek. Bump CACHE_NAME after changing app files. */
const CACHE_NAME = "the-sleek-v9";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./offers.css", "./app.js", "./data.js",
  "./offers.js", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png",
  "./images/review-qr.png", "./images/hero-salon.jpg", "./images/story-salon.jpg",
];

self.addEventListener("install", (e) => {
  // add one by one so a single missing file can't break the whole cache
  e.waitUntil(caches.open(CACHE_NAME).then((c) => Promise.all(ASSETS.map((a) => c.add(a).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // never touch the API, Google Sheets, fonts or any other site
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  // fast: serve the saved copy instantly, refresh it in the background
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(e.request).then((cached) => {
        const net = fetch(e.request)
          .then((res) => { if (res && res.status === 200) cache.put(e.request, res.clone()); return res; })
          .catch(() => cached);
        return cached || net;
      })
    )
  );
});
