// Black Coffin Service Worker — static cache only
const CACHE = 'black-coffin-v1';
const ASSETS = [
  './index.html',
  './pages/menu.html',
  './pages/story.html',
  './pages/visit.html',
  './admin/index.html',
  './admin/menu.html',
  './admin/orders.html',
  './admin/inbox.html',
  './admin/settings.html',
  './admin/login.html',
  './assets/css/style.css',
  './assets/js/script.js',
  './admin/admin.js',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});