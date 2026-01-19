const CACHE_NAME = 'study-tracker-v2';
const ASSETS = [
  '/study-tracker/',
  '/study-tracker/index.html',
  '/study-tracker/manifest.json',
  '/study-tracker/icon-192.png',
  '/study-tracker/icon-512.png'
];

// Install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
      .catch(() => caches.match('/study-tracker/index.html'))
  );
});

// Handle notification click
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/study-tracker') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/study-tracker/');
      }
    })
  );
});
