const CACHE_NAME = 'unlock-london-v15';
const SHELL = [
  './',
  './index.html',
  './style.css',
  './landmarks.json',
  './manifest.json',
  'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js',
  'https://cdn.jsdelivr.net/npm/ag-grid-community@32.3.3/styles/ag-grid.min.css',
  'https://cdn.jsdelivr.net/npm/ag-grid-community@32.3.3/styles/ag-theme-alpine.min.css',
  'https://cdn.jsdelivr.net/npm/ag-grid-community@32.3.3/dist/ag-grid-community.min.js',
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for our own app files so code changes always show up.
// Cache-first for third-party CDN assets (rarely change, good offline).
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const { landmarkId, tier } = event.notification.data || {};
  const url = new URL('./index.html', self.location.origin);
  if (landmarkId) {
    url.searchParams.set('landmark', landmarkId);
    if (tier) url.searchParams.set('notif', tier);
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_CLICK', landmarkId, tier });
          return client.focus();
        }
      }
      return clients.openWindow(url.toString());
    })
  );
});
