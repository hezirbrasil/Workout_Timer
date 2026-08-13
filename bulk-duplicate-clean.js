(()=>{
  if(window.__WT_BULK_CLEAN_V6)return;window.__WT_BULK_CLEAN_V6=true;
  const roundsEl=()=>document.getElementById('rounds');
  const selected=new Set();
  const blocks=()=>{const r=roundsEl();return r?[...r.querySelectorAll(':scope > .round')]:[]};
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const updateCount=()=>{const e=document.getElementById('bulk-selected-count');if(e)e.textContent=`${selected.size} selecionado${selected.size===1?'':'s'}`};
  function ensureToolbar(){const r=roundsEl();if(!r||document.getElementById('bulk-duplicate-toolbar'))return;const b=document.createElement('div');b.id='bulk-duplicate-toolbar';b.innerHTML='<button type="button" class="btn small" id="bulk-select-all">Selecionar todos</button><button type="button" class="btn small" id="bulk-clear">Limpar seleção</button><button type="button" class="btn small primary" id="bulk-duplicate-selected">Duplicar selecionados</button><span id="bulk-selected-count" style="color:var(--m);font-size:12px">0 selecionados</span>';r.parentNode.insertBefore(b,r);b.querySelector('#bulk-select-all').onclick=()=>{const a=blocks();const all=a.length&&a.every((_,i)=>selected.has(i));selected.clear();if(!all)a.forEach((_,i)=>selected.add(i));renderChecks()};b.querySelector('#bulk-clear').onclick=()=>{selected.clear();renderChecks()};b.querySelector('#bulk-duplicate-selected').onclick=duplicateSelected}
  function renderChecks(){const bs=blocks();for(const i of [...selected])if(i>=bs.length)selected.delete(i);bs.forEach((block,i)=>{const w=block.querySelector(':scope > .round-name');if(!w)return;let c=w.querySelector(':scope > .bulk-block-check');if(!c){c=document.createElement('input');c.type='checkbox';c.className='bulk-block-check';c.title='Selecionar bloco';c.addEventListener('click',e=>e.stopPropagation());c.addEventListener('change',()=>{c.checked?selected.add(i):selected.delete(i);updateCount()});w.insertBefore(c,w.firstChild)}c.checked=selected.has(i)});updateCount()}

  async function duplicateOneToEnd(index){
    if(window.running)return false;
    let bs=blocks();
    const source=bs[index];
    if(!source)return false;
    const duplicate=source.querySelector(':scope .duplicate');
    if(!duplicate)return false;
    // Use the timer's real duplicate handler so the clone is written into
    // the internal `store.rounds` and therefore participates in the timer.
    duplicate.click();
    await sleep(60);
    bs=blocks();
    // The native handler inserts the copy immediately after the source.
    let newIndex=index+1;
    if(newIndex>=bs.length)return false;
    // Move that newly-created block to the end using the native ▼ handler.
    // This updates store.rounds on every move and keeps the selected originals
    // at their original indexes.
    while(newIndex<bs.length-1){
      const down=bs[newIndex].querySelector(':scope .down');
      if(!down||down.disabled)break;
      down.click();
      await sleep(35);
      bs=blocks();
      newIndex++;
    }
    return true;
  }

  async function duplicateSelected(){
    if(!selected.size||window.running)return;
    const indexes=[...selected].sort((a,b)=>a-b);
    selected.clear();renderChecks();
    // Process from the lowest original index upward. Each new copy is moved
    // to the end immediately, so later original indexes never shift.
    for(const index of indexes){
      await duplicateOneToEnd(index);
    }
    renderChecks();
  }

  const style=document.createElement('style');style.id='bulk-clean-style-v6';style.textContent='#bulk-duplicate-toolbar{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}.round-name{display:flex!important;align-items:center!important;gap:8px!important;grid-column:1/-1!important}.round-name .bulk-block-check{position:static!important;flex:0 0 20px!important;width:20px!important;height:20px!important;margin:0!important;accent-color:#8a2be2;cursor:pointer}.round-name .rname{flex:1 1 auto!important;min-width:0!important;width:auto!important}';document.head.appendChild(style);
  ensureToolbar();renderChecks();const r=roundsEl();if(r)new MutationObserver(()=>{ensureToolbar();renderChecks()}).observe(r,{childList:true});
})();
