(()=>{
  if(window.__WT_BULK_CLEAN_V4) return;
  window.__WT_BULK_CLEAN_V4=true;

  const roundsEl=()=>document.getElementById('rounds');
  const selected=new Set();
  const blocks=()=>{const r=roundsEl();return r?[...r.querySelectorAll(':scope > .round')]:[]};

  function updateCount(){
    const el=document.getElementById('bulk-selected-count');
    if(el) el.textContent=`${selected.size} selecionado${selected.size===1?'':'s'}`;
  }

  function ensureToolbar(){
    const r=roundsEl(); if(!r) return;
    let bar=document.getElementById('bulk-duplicate-toolbar');
    if(bar) return;
    bar=document.createElement('div');
    bar.id='bulk-duplicate-toolbar';
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
      const nameWrap=block.querySelector(':scope > .round-name');
      if(!nameWrap) return;
      let cb=nameWrap.querySelector(':scope > .bulk-block-check');
      if(!cb){
        cb=document.createElement('input');
        cb.type='checkbox';
        cb.className='bulk-block-check';
        cb.dataset.bulkCheckbox='1';
        cb.title='Selecionar bloco';
        cb.setAttribute('aria-label','Selecionar bloco');
        cb.addEventListener('click',e=>e.stopPropagation());
        cb.addEventListener('change',()=>{if(cb.checked)selected.add(i);else selected.delete(i);updateCount()});
        nameWrap.insertBefore(cb,nameWrap.firstChild);
      }
      cb.checked=selected.has(i);
    });
    updateCount();
  }

  function duplicateOneAndMoveToEnd(index){
    const r=roundsEl();
    if(!r) return false;
    const before=new Set(blocks());
    const source=blocks()[index];
    const button=source?.querySelector(':scope .duplicate');
    if(!button) return false;

    button.click();

    // The original timer inserts the new block next to its source. Capture
    // that new block and move it to the end so bulk copies stay together.
    const created=blocks().find(block=>!before.has(block));
    if(created) r.appendChild(created);
    return !!created;
  }

  function duplicateSelected(){
    if(!selected.size || window.running) return;

    // Capture the original positions before any copy is created. Process in
    // ascending order, then move each newly-created copy to the end. This
    // guarantees: select 1,3,5 => original list + copy 1 + copy 3 + copy 5.
    const indexes=[...selected].sort((a,b)=>a-b);
    selected.clear();
    renderChecks();

    indexes.forEach((index,step)=>{
      setTimeout(()=>{
        const ok=duplicateOneAndMoveToEnd(index);
        if(!ok){
          // If an earlier operation changed the index unexpectedly, retry by
          // locating the corresponding original through its current position.
          const bs=blocks();
          const fallback=bs[index];
          const btn=fallback?.querySelector(':scope .duplicate');
          if(btn){
            const before=new Set(bs);
            btn.click();
            const created=blocks().find(b=>!before.has(b));
            if(created) roundsEl().appendChild(created);
          }
        }
      },step*220);
    });
  }

  const style=document.createElement('style');
  style.id='bulk-clean-style-v4';
  style.textContent=`
    #bulk-duplicate-toolbar{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}
    .round-name{display:flex!important;align-items:center!important;gap:8px!important;grid-column:1/-1!important}
    .round-name .bulk-block-check{position:static!important;flex:0 0 20px!important;width:20px!important;height:20px!important;margin:0!important;accent-color:#8a2be2;cursor:pointer}
    .round-name .rname{flex:1 1 auto!important;min-width:0!important;width:auto!important}
  `;
  document.head.appendChild(style);

  ensureToolbar();
  renderChecks();
  const r=roundsEl();
  if(r) new MutationObserver(()=>{ensureToolbar();renderChecks()}).observe(r,{childList:true});
})();
