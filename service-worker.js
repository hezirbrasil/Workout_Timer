const CACHE_NAME = 'workout-timer-v8';
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
const BULK_PATCH = `<style id="wt-bulk-duplicate-style">
#wt-bulk-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:10px 0}
#wt-bulk-tools .wt-bulk-btn{border:1px solid #43205c;background:#0b0710;color:#eee;border-radius:9px;padding:9px 12px;font:600 13px system-ui;cursor:pointer}
#wt-bulk-tools .wt-bulk-btn.primary{background:linear-gradient(90deg,#8a2be2,#6f50d8);border:0}
.wt-round-check{width:20px!important;height:20px!important;accent-color:#8a2be2;cursor:pointer;flex:0 0 auto}
.wt-round-selected{outline:1px solid rgba(138,43,226,.7);box-shadow:0 0 0 2px rgba(138,43,226,.12) inset}
</style>
<script id="wt-bulk-duplicate-script">
(()=>{
  const toolsId='wt-bulk-tools';
  const selected=new Set();
  const rounds=()=>document.getElementById('rounds');
  function addTools(){
    const r=rounds(); if(!r) return;
    if(!document.getElementById(toolsId)){
      const box=document.createElement('div'); box.id=toolsId;
      box.innerHTML='<button type="button" class="wt-bulk-btn" id="wt-select-all">Selecionar todos</button><button type="button" class="wt-bulk-btn" id="wt-clear-selection">Limpar seleção</button><button type="button" class="wt-bulk-btn primary" id="wt-duplicate-selected">Duplicar selecionados <span id="wt-selected-count">(0)</span></button>';
      r.parentNode.insertBefore(box,r);
      box.querySelector('#wt-select-all').onclick=()=>{document.querySelectorAll('#rounds .wt-round-check').forEach(c=>{c.checked=true;selected.add(+c.dataset.i);c.closest('.round').classList.add('wt-round-selected')});updateCount()};
      box.querySelector('#wt-clear-selection').onclick=clearSelection;
      box.querySelector('#wt-duplicate-selected').onclick=duplicateSelected;
    }
  }
  function updateCount(){const c=document.getElementById('wt-selected-count');if(c)c.textContent='('+selected.size+')'}
  function clearSelection(){selected.clear();document.querySelectorAll('#rounds .wt-round-check').forEach(c=>{c.checked=false;c.closest('.round').classList.remove('wt-round-selected')});updateCount()}
  function decorate(){
    addTools();
    document.querySelectorAll('#rounds .round').forEach((row,i)=>{
      if(row.querySelector('.wt-round-check')) return;
      const name=row.querySelector('.round-name'); if(!name)return;
      const check=document.createElement('input'); check.type='checkbox'; check.className='wt-round-check'; check.dataset.i=i; check.title='Selecionar bloco';
      check.addEventListener('change',()=>{if(check.checked){selected.add(i);row.classList.add('wt-round-selected')}else{selected.delete(i);row.classList.remove('wt-round-selected')}updateCount()});
      name.insertBefore(check,name.firstChild); name.style.display='flex'; name.style.alignItems='center'; name.style.gap='8px';
      const input=name.querySelector('.rname'); if(input) input.style.flex='1';
    });
    updateCount();
  }
  function duplicateSelected(){
    if(!selected.size){return}
    const indexes=[...selected].sort((a,b)=>b-a);
    clearSelection();
    indexes.forEach(i=>{
      const btn=document.querySelector('#rounds .duplicate[data-i="'+i+'"]');
      if(btn) btn.click();
    });
    setTimeout(decorate,30);
  }
  const observer=new MutationObserver(decorate);
  function init(){const r=rounds();if(!r){setTimeout(init,100);return}observer.observe(r,{childList:true});decorate()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
</script>`;
function patchHTML(response){return response.text().then(html=>{if(!html.includes('wt-premium-controls'))html=html.replace('</head>',UI_PATCH+'</head>');if(!html.includes('wt-bulk-duplicate-script'))html=html.replace('</body>',BULK_PATCH+'</body>');html=html.replace('>⏮<','><span aria-hidden="true">‹</span><').replace('>⏭<','><span aria-hidden="true">›</span><').replace('>⏸ Pausar<','><span aria-hidden="true">Ⅱ</span><').replace('>▶ Continuar<','><span aria-hidden="true">▶</span><');return new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});});}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(!response||!response.ok)return caches.match(event.request)||response;const type=response.headers.get('content-type')||'';const result=type.includes('text/html')?await patchHTML(response.clone()):response;const cache=await caches.open(CACHE_NAME);await cache.put(event.request,result.clone());return result;}catch(e){return caches.match(event.request)||new Response('Offline',{status:503});}})());});
