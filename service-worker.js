const CACHE_NAME = 'workout-timer-v6';
const APP_SHELL = ['./','./index.html','./manifest.json','./icon.svg'];
const UI_PATCH = `<style id="wt-premium-controls">
.timer-nav{display:none!important;gap:14px!important;align-items:center;justify-content:center;margin-top:18px!important}
.compact .timer-nav{display:flex!important}
.compact .controls #start{display:none!important}
.timer-nav .btn{width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important;padding:0!important;border-radius:50%!important;border:1px solid rgba(138,43,226,.55)!important;background:rgba(255,255,255,.055)!important;color:#fff!important;box-shadow:0 5px 20px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.04)!important;font-size:24px!important;font-weight:600!important;display:flex!important;align-items:center!important;justify-content:center!important;transition:transform .12s ease,background .12s ease,box-shadow .12s ease!important;-webkit-tap-highlight-color:transparent!important}
.timer-nav .btn:active{transform:scale(.91)!important;background:rgba(138,43,226,.28)!important;box-shadow:0 2px 8px rgba(0,0,0,.5),inset 0 0 18px rgba(138,43,226,.2)!important}
.timer-nav .pause{width:76px!important;height:76px!important;min-width:76px!important;min-height:76px!important;border:0!important;background:linear-gradient(145deg,#9b4dff,#6f20c9)!important;box-shadow:0 8px 25px rgba(138,43,226,.4)!important;font-size:24px!important}
.timer-nav .pause:active{background:linear-gradient(145deg,#8136dd,#5b18ad)!important}
.compact .timer-nav .btn{width:64px!important;height:64px!important;min-width:64px!important;min-height:64px!important}
.compact .timer-nav .pause{width:82px!important;height:82px!important;min-width:82px!important;min-height:82px!important}
@media(max-width:380px){.timer-nav{gap:10px!important}.compact .timer-nav .btn{width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important}.compact .timer-nav .pause{width:72px!important;height:72px!important;min-width:72px!important;min-height:72px!important}}
</style>`;
function patchHTML(response){return response.text().then(html=>{if(!html.includes('wt-premium-controls'))html=html.replace('</head>',UI_PATCH+'</head>');return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});});}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(!response||!response.ok)return caches.match(event.request)||response;const type=response.headers.get('content-type')||'';const result=type.includes('text/html')?await patchHTML(response.clone()):response;const cache=await caches.open(CACHE_NAME);await cache.put(event.request,result.clone());return result;}catch(e){return caches.match(event.request)||new Response('Offline',{status:503});}})());});
