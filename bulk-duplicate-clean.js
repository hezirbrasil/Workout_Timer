(()=>{
  if(window.__WT_BULK_CLEAN_V2) return;
  window.__WT_BULK_CLEAN_V2=true;

  const roundsEl=()=>document.getElementById('rounds');
  const selected=new Set();

  function blocks(){
    const r=roundsEl();
    return r?[...r.querySelectorAll(':scope > .round')]:[];
  }

  function signature(block){
    const name=block.querySelector('.rname')?.value ?? '';
    const min=Number(block.querySelector('.rmin')?.value || 0);
    const sec=Number(block.querySelector('.rsec')?.value || 0);
    return JSON.stringify([name,min*60+sec]);
  }

  function cleanOld(){
    document.querySelectorAll('.bulk-block-check,[data-bulk-checkbox]').forEach(el=>el.remove());
    document.querySelectorAll('#bulk-duplicate-toolbar').forEach(el=>el.remove());
  }

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
    bar.querySelector('#bulk-select-all').onclick=()=>{
      const bs=blocks();
      const all=bs.length>0&&bs.every((_,i)=>selected.has(i));
      selected.clear();
      if(!all) bs.forEach((_,i)=>selected.add(i));
      renderChecks();
    };
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
        cb.addEventListener('change',()=>{
          if(cb.checked) selected.add(i); else selected.delete(i);
          updateCount();
        });
        nameWrap.insertBefore(cb,nameWrap.firstChild);
      }
      cb.checked=selected.has(i);
    });
    updateCount();
  }

  function findNthCurrent(sig,nth){
    let count=0;
    for(const block of blocks()){
      if(signature(block)!==sig) continue;
      if(count===nth) return block;
      count++;
    }
    return null;
  }

  function duplicateSelected(){
    if(!selected.size || window.running) return;

    const bs=blocks();
    const originals=[...selected].sort((a,b)=>a-b).map(index=>{
      const block=bs[index];
      if(!block) return null;
      const sig=signature(block);
      let occurrence=0;
      for(let i=0;i<index;i++) if(signature(bs[i])===sig) occurrence++;
      return {sig,occurrence};
    }).filter(Boolean);

    if(!originals.length) return;

    selected.clear();
    renderChecks();

    // Duplicate the original blocks in their original order.
    // If identical blocks exist, account for copies inserted by earlier steps.
    const insertedBySig=new Map();
    originals.forEach((item,step)=>{
      setTimeout(()=>{
        const extra=insertedBySig.get(item.sig)||0;
        const target=findNthCurrent(item.sig,item.occurrence+extra);
        if(!target) return;
        const button=target.querySelector('.duplicate');
        if(button) button.click();
        insertedBySig.set(item.sig,extra+1);
      },step*120);
    });
  }

  const style=document.createElement('style');
  style.id='bulk-clean-style-v2';
  style.textContent=`
    #bulk-duplicate-toolbar{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}
    .round-name{display:flex!important;align-items:center!important;gap:8px!important;grid-column:1/-1!important}
    .round-name .bulk-block-check{flex:0 0 20px!important;width:20px!important;height:20px!important;margin:0!important;accent-color:#8a2be2;cursor:pointer}
    .round-name .rname{flex:1 1 auto!important;min-width:0!important;width:auto!important}
  `;
  document.head.appendChild(style);

  cleanOld();
  ensureToolbar();
  renderChecks();

  const r=roundsEl();
  if(r) new MutationObserver(()=>{ensureToolbar();renderChecks()}).observe(r,{childList:true});
})();
