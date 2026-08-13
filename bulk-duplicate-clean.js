(()=>{
  if(window.__WT_BULK_CLEAN_V1) return;
  window.__WT_BULK_CLEAN_V1=true;
  const roundsEl=()=>document.getElementById('rounds');
  const selected=new Set();
  const cleanOld=()=>{
    document.querySelectorAll('.bulk-block-check,[data-bulk-checkbox],#bulk-duplicate-toolbar').forEach(el=>el.remove());
    document.querySelectorAll('[id^="bulk-duplicate"],[class*="bulk-duplicate"]').forEach(el=>{if(el.id!=='bulk-duplicate-toolbar')el.remove()});
  };
  function ensureToolbar(){
    const r=roundsEl(); if(!r) return;
    let bar=document.getElementById('bulk-duplicate-toolbar');
    if(!bar){
      bar=document.createElement('div'); bar.id='bulk-duplicate-toolbar';
      bar.innerHTML='<button type="button" class="btn small" id="bulk-select-all">Selecionar todos</button><button type="button" class="btn small" id="bulk-clear">Limpar seleção</button><button type="button" class="btn small primary" id="bulk-duplicate-selected">Duplicar selecionados</button><span id="bulk-selected-count" style="color:var(--muted);font-size:12px">0 selecionados</span>';
      r.parentNode.insertBefore(bar,r);
      bar.querySelector('#bulk-select-all').onclick=()=>{const blocks=[...r.querySelectorAll(':scope > .round')];const all=blocks.length>0&&blocks.every((_,i)=>selected.has(i));selected.clear();if(!all)blocks.forEach((_,i)=>selected.add(i));renderChecks()};
      bar.querySelector('#bulk-clear').onclick=()=>{selected.clear();renderChecks()};
      bar.querySelector('#bulk-duplicate-selected').onclick=duplicateSelected;
    }
  }
  function renderChecks(){
    const r=roundsEl(); if(!r)return;
    ensureToolbar();
    const blocks=[...r.querySelectorAll(':scope > .round')];
    [...selected].forEach(i=>{if(i<0||i>=blocks.length)selected.delete(i)});
    blocks.forEach((block,i)=>{
      let cb=block.querySelector(':scope > .bulk-block-check');
      if(!cb){
        cb=document.createElement('input'); cb.type='checkbox'; cb.className='bulk-block-check'; cb.dataset.bulkCheckbox='1'; cb.title='Selecionar bloco'; cb.setAttribute('aria-label','Selecionar bloco');
        cb.addEventListener('click',e=>e.stopPropagation());
        cb.addEventListener('change',()=>{if(cb.checked)selected.add(i);else selected.delete(i);updateCount();});
        block.insertBefore(cb,block.firstChild);
      }
      cb.checked=selected.has(i);
    });
    updateCount();
  }
  function updateCount(){const el=document.getElementById('bulk-selected-count');if(el)el.textContent=`${selected.size} selecionado${selected.size===1?'':'s'}`}
  function duplicateSelected(){
    if(!selected.size||window.running)return;
    const originals=[...selected].sort((a,b)=>a-b).map(i=>store.rounds[i]).filter(Boolean).map(r=>({...r}));
    if(!originals.length)return;
    store.rounds.push(...originals);
    selected.clear();
    save();
    renderRounds();
    setTimeout(renderChecks,0);
  }
  const style=document.createElement('style');style.id='bulk-clean-style';style.textContent=`#bulk-duplicate-toolbar{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}.bulk-block-check{flex:0 0 auto!important;width:20px!important;height:20px!important;margin:0 4px 0 0!important;accent-color:#8a2be2;cursor:pointer;z-index:2}.round{position:relative}.round .name{flex:1;min-width:0}.round .bulk-block-check{align-self:center}.bulk-block-check+ .name{margin-left:0}`;document.head.appendChild(style);
  const originalRender=window.renderRounds;
  window.renderRounds=function(){originalRender.apply(this,arguments);setTimeout(renderChecks,0)};
  ensureToolbar();renderChecks();
})();
