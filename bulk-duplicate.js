(function(){
  if(window.__bulkDuplicateLoaded)return;
  window.__bulkDuplicateLoaded=true;
  const LS='mma.simple.timer.v1',TOOL_ID='bulk-duplicate-toolbar',STYLE_ID='bulk-duplicate-style';
  const selected=new Set(),$=id=>document.getElementById(id);
  function cleanup(){
    document.querySelectorAll('#bulk-duplicate-overlays,.bulk-overlay-check').forEach(e=>e.remove());
    const old=$(TOOL_ID);if(old)old.remove();
    document.querySelectorAll('.bulk-selected-outline').forEach(e=>e.classList.remove('bulk-selected-outline'));
  }
  function style(){
    if($(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`#${TOOL_ID}{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}.bulk-btn{padding:9px 12px;border-radius:10px;border:1px solid rgba(138,43,226,.5);background:#10091a;color:#eee;font-weight:600}.bulk-btn.primary{background:linear-gradient(90deg,#8a2be2,#6f50d8);border:0}.bulk-count{font-size:12px;color:#999}.bulk-check-row{display:flex;align-items:center;gap:7px;margin-bottom:4px}.bulk-check-row input{width:20px!important;height:20px!important;margin:0!important;accent-color:#8a2be2}.bulk-selected-outline{outline:2px solid rgba(138,43,226,.75);outline-offset:2px}`;document.head.appendChild(s);
  }
  function toolbar(){
    const list=$('rounds');if(!list||$(TOOL_ID)||!list.parentElement)return;
    const bar=document.createElement('div');bar.id=TOOL_ID;bar.innerHTML='<button type="button" class="bulk-btn" id="bulkSelectAll">Selecionar todos</button><button type="button" class="bulk-btn" id="bulkClearSelection">Limpar seleção</button><button type="button" class="bulk-btn primary" id="bulkDuplicate">Duplicar selecionados</button><span class="bulk-count" id="bulkCount">0 selecionados</span>';
    list.parentElement.insertBefore(bar,list);
    $('bulkSelectAll').onclick=()=>{const rs=[...list.querySelectorAll('.round')];const all=rs.length&&rs.every((_,i)=>selected.has(i));selected.clear();if(!all)rs.forEach((_,i)=>selected.add(i));decorate()};
    $('bulkClearSelection').onclick=()=>{selected.clear();decorate()};$('bulkDuplicate').onclick=duplicate;
  }
  function decorate(){
    const list=$('rounds');if(!list)return;const rs=[...list.querySelectorAll('.round')];
    [...selected].forEach(i=>{if(i<0||i>=rs.length)selected.delete(i)});
    rs.forEach((r,i)=>{
      let row=r.querySelector(':scope > .bulk-check-row');
      if(!row){row=document.createElement('div');row.className='bulk-check-row';const cb=document.createElement('input');cb.type='checkbox';const text=document.createElement('span');text.textContent='Selecionar';text.style.cssText='font-size:12px;color:#999';row.append(cb,text);r.insertBefore(row,r.firstElementChild);cb.addEventListener('change',()=>{cb.checked?selected.add(i):selected.delete(i);decorate()})}
      const cb=row.querySelector('input');cb.checked=selected.has(i);r.classList.toggle('bulk-selected-outline',selected.has(i));
    });
    const c=$('bulkCount');if(c)c.textContent=`${selected.size} selecionado${selected.size===1?'':'s'}`;
  }
  function duplicate(){
    if(!selected.size){alert('Selecione pelo menos um bloco.');return}
    try{const data=JSON.parse(localStorage.getItem(LS)||'{}');if(!Array.isArray(data.rounds))throw 0;const inds=[...selected].sort((a,b)=>a-b);const copies=inds.map(i=>JSON.parse(JSON.stringify(data.rounds[i])));data.rounds.splice(inds[inds.length-1]+1,0,...copies);localStorage.setItem(LS,JSON.stringify(data));location.reload()}catch(e){alert('Não foi possível duplicar os blocos.')}
  }
  function init(){cleanup();style();toolbar();decorate();const list=$('rounds');if(list)new MutationObserver(()=>{toolbar();decorate()}).observe(list,{childList:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
