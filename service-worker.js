const CACHE_NAME = 'workout-timer-v4';
const APP_SHELL = ['./','./index.html','./manifest.json','./icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    try {
      const response = await fetch(event.request);
      if (!response || !response.ok) return cached || response;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        const html = await response.clone().text();
        const patch = '<style id="wt-controls-visibility">.timer-nav{display:none!important}.compact .timer-nav{display:flex!important}.compact .controls #start{display:none!important}</style>';
        const patched = html.includes('wt-controls-visibility') ? html : html.replace('</head>', patch + '</head>');
        const result = new Response(patched, {status:response.status,statusText:response.statusText,headers:response.headers});
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, result.clone());
        return result;
      }
      if (new URL(event.request.url).origin === self.location.origin) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      return cached || new Response('Offline', {status:503});
    }
  })());
});
