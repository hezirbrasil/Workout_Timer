const CACHE_NAME = 'workout-timer-v3';
const APP_SHELL = ['./','./index.html','./manifest.json','./icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return fetch(event.request).then(response => {
        if (!response || !response.ok) return cached || response;
        const url = new URL(event.request.url);
        const isAppDocument = event.request.mode === 'navigate' || url.pathname.endsWith('/index.html');
        if (url.origin === self.location.origin && isAppDocument) {
          return response.clone().text().then(html => {
            const patch = `<style id="wt-controls-visibility">.timer-nav{display:none!important}.compact .timer-nav{display:flex!important}</style>`;
            const patched = html.includes('wt-controls-visibility') ? html : html.replace('</head>', patch + '</head>');
            const result = new Response(patched, {status: response.status, statusText: response.statusText, headers: response.headers});
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, result.clone()));
            return result;
          });
        }
        if (url.origin === self.location.origin) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        return response;
      }).catch(() => cached);
    })
  );
});
