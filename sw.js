const cacheName = 'CvCarlos-v1';

const contentToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/fonts/freesans.ttf',
  '/fonts/freesans.woff',
  '/favicon.ico',
  '/icons/at.svg',
  '/icons/logo-github.svg',
  '/icons/user.png',
  '/iconapp/android-chrome-192x192.png',
  '/iconapp/favicon-16x16.png',
  '/iconapp/favicon-32x32.png',
  '/head.js',
  '/three/three.min.js',
];

self.addEventListener('install', (e) => {
  //console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    //console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(contentToCache);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    //console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    //console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});