const CACHE_NAME = 'workout-timer-v5';
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
        const patch = '<style id="wt-controls-visibility">.timer-nav{display:none!important}.compact .timer-nav{display:flex!important}.compact .controls #start{display:none!important}.timer-nav{align-items:center;gap:12px}.timer-nav .btn{width:62px;height:62px;min-width:62px;min-height:62px;padding:0;border:1px solid rgba(138,43,226,.55);border-radius:50%;background:linear-gradient(145deg,rgba(30,20,40,.98),rgba(10,10,14,.98));box-shadow:0 8px 22px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.08);color:#eee;font-size:24px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:transform .12s ease,box-shadow .12s ease,border-color .12s ease}.timer-nav .btn:active{transform:scale(.92);box-shadow:0 3px 10px rgba(0,0,0,.45),inset 0 2px 5px rgba(0,0,0,.35)}.timer-nav .pause{width:78px;height:78px;min-width:78px;min-height:78px;border-color:rgba(138,43,226,.95);background:linear-gradient(145deg,#8a2be2,#6335b8);box-shadow:0 10px 28px rgba(138,43,226,.32),inset 0 1px 0 rgba(255,255,255,.2);font-size:20px}.compact .timer-nav{margin-top:22px}.compact .timer-nav .btn{width:62px;height:62px;min-width:62px;min-height:62px}.compact .timer-nav .pause{width:78px;height:78px;min-width:78px;min-height:78px}.compact .timer-nav .btn:focus-visible{outline:2px solid #fff;outline-offset:3px}@media(max-width:380px){.timer-nav{gap:8px}.compact .timer-nav .btn{width:56px;height:56px;min-width:56px;min-height:56px}.compact .timer-nav .pause{width:70px;height:70px;min-width:70px;min-height:70px}.timer-nav .btn{font-size:22px}} </style>';
        const patched = html.includes('wt-controls-visibility') ? html.replace(/<style id="wt-controls-visibility">[\s\S]*?<\/style>/, patch) : html.replace('</head>', patch + '</head>');
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
