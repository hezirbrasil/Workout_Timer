(()=>{
  if(window.__WT_BULK_CLEAN_V3) return;
  window.__WT_BULK_CLEAN_V3=true;

  const roundsEl=()=>document.getElementById('rounds');
  const selected=new Set();
  const blocks=()=>{const r=roundsEl();return r?[...r.querySelectorAll(':scope > .round')]:[]};

  function updateCount(){
    const el=document.getElementById('bulk-selected-count');
    if(el)el.textContent=`${selected.size} selecionado${selected.size===1?'':'s'}`;
  }

  function ensureToolbar(){
    const r=roundsEl();if(!r)return;
    let bar=document.getElementById('bulk-duplicate-toolbar');
    if(bar)return;
    bar=document.createElement('div');bar.id='bulk-duplicate-toolbar';
    bar.innerHTML='<button type="button" class="btn small" id="bulk-select-all">Selecionar todos</button><button type="button" class="btn small" id="bulk-clear">Limpar seleção</button><button type="button" class="btn small primary" id="bulk-duplicate-selected">Duplicar selecionados</button><span id="bulk-selected-count" style="color:var(--m);font-size:12px">0 selecionados</span>';
    r.parentNode.insertBefore(bar,r);
    bar.querySelector('#bulk-select-all').onclick=()=>{const bs=blocks();const all=bs.length>0&&bs.every((_,i)=>selected.has(i));selected.clear();if(!all)bs.forEach((_,i)=>selected.add(i));renderChecks()};
    bar.querySelector('#bulk-clear').onclick=()=>{selected.clear();renderChecks()};
    bar.querySelector('#bulk-duplicate-selected').onclick=duplicateSelected;
  }

  function renderChecks(){
    const bs=blocks();
    [...selected].forEach(i=>{if(i<0||i>=bs.length)selected.delete(i)});
    bs.forEach((block,i)=>{
      const nameWrap=block.querySelector(':scope > .round-name');if(!nameWrap)return;
      let cb=nameWrap.querySelector(':scope > .bulk-block-check');
      if(!cb){
        cb=document.createElement('input');cb.type='checkbox';cb.className='bulk-block-check';cb.dataset.bulkCheckbox='1';cb.title='Selecionar bloco';cb.setAttribute('aria-label','Selecionar bloco');
        cb.addEventListener('click',e=>e.stopPropagation());
        cb.addEventListener('change',()=>{if(cb.checked)selected.add(i);else selected.delete(i);updateCount()});
        nameWrap.insertBefore(cb,nameWrap.firstChild);
      }
      cb.checked=selected.has(i);
    });
    updateCount();
  }

  function duplicateSelected(){
    if(!selected.size||window.running)return;
    // Use the timer's original 📋 handler. Click originals from right to left:
    // each copy is inserted immediately after its source, so the resulting
    // copies appear in the same left-to-right order as the selection.
    const indexes=[...selected].sort((a,b)=>b-a);
    selected.clear();renderChecks();
    indexes.forEach((i,n)=>{
      setTimeout(()=>{
        const bs=blocks();
        const block=bs[i];
        const button=block?.querySelector(':scope .duplicate');
        if(button)button.click();
      },n*180);
    });
  }

  const style=document.createElement('style');style.id='bulk-clean-style-v3';style.textContent=`
    #bulk-duplicate-toolbar{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}
    .round-name{display:flex!important;align-items:center!important;gap:8px!important;grid-column:1/-1!important}
    .round-name .bulk-block-check{position:static!important;flex:0 0 20px!important;width:20px!important;height:20px!important;margin:0!important;accent-color:#8a2be2;cursor:pointer}
    .round-name .rname{flex:1 1 auto!important;min-width:0!important;width:auto!important}
  `;document.head.appendChild(style);

  ensureToolbar();renderChecks();
  const r=roundsEl();if(r)new MutationObserver(()=>{ensureToolbar();renderChecks()}).observe(r,{childList:true});
})();
