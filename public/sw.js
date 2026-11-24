/* Offline-first cache so the site loads fast and survives flaky networks. */
const VERSION = 'v1';
const STATIC_CACHE = `static-${VERSION}`;
const PAGE_CACHE = `pages-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((c) => c.addAll(['/'])).catch(() => {}).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => ![STATIC_CACHE, PAGE_CACHE].includes(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Pages: network first (3s), fall back to the cached shell when slow/offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      Promise.race([fetch(req), timeout(3000)])
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put('/', copy));
          return res;
        })
        .catch(() => caches.match('/').then((r) => r || fetch(req)))
    );
    return;
  }

  // Hashed build assets, images, fonts: cache first, refresh in background.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
