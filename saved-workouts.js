(()=>{
  const KEY='workout.timer.saved.v1';
  const getSaved=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}};
  const setSaved=x=>localStorage.setItem(KEY,JSON.stringify(x));
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const makeUI=()=>{
    const panel=document.querySelector('.wrap > .panel:first-child');
    if(!panel || document.getElementById('savedWorkouts')) return;
    const clear=document.getElementById('clearAll');
    const box=document.createElement('div');
    box.id='savedWorkouts';
    box.innerHTML=`<hr><div class="saved-title">Treinos salvos</div><div class="saved-row"><input id="savedName" class="saved-input" placeholder="Nome do treino"><button id="saveWorkout" class="btn primary">💾 Salvar</button></div><div id="savedList" class="saved-list"></div>`;
    clear.insertAdjacentElement('afterend',box);
    render();
    document.getElementById('saveWorkout').addEventListener('click',saveCurrent);
    document.getElementById('savedName').addEventListener('keydown',e=>{if(e.key==='Enter')saveCurrent()});
  };
  const render=()=>{
    const list=document.getElementById('savedList'); if(!list)return;
    const items=getSaved();
    if(!items.length){list.innerHTML='<div class="saved-empty">Nenhum treino salvo ainda.</div>';return}
    list.innerHTML=items.map((x,i)=>`<div class="saved-item"><div class="saved-item-name">${esc(x.name)}</div><div class="saved-actions"><button class="btn saved-load" data-i="${i}">▶ Carregar</button><button class="btn saved-overwrite" data-i="${i}">💾 Atualizar</button><button class="btn saved-delete delete" data-i="${i}">🗑️</button></div></div>`).join('');
    list.querySelectorAll('.saved-load').forEach(b=>b.onclick=()=>loadSaved(+b.dataset.i));
    list.querySelectorAll('.saved-overwrite').forEach(b=>b.onclick=()=>overwriteSaved(+b.dataset.i));
    list.querySelectorAll('.saved-delete').forEach(b=>b.onclick=()=>deleteSaved(+b.dataset.i));
  };
  const saveCurrent=()=>{
    const input=document.getElementById('savedName');
    const name=(input.value||'').trim();
    if(!name){input.focus();return}
    const items=getSaved();
    items.push({name,rounds:JSON.parse(JSON.stringify(store.rounds)),updatedAt:Date.now()});
    setSaved(items); input.value=''; render();
  };
  const loadSaved=i=>{
    const items=getSaved(); const item=items[i]; if(!item)return;
    if(!confirm(`Carregar o treino "${item.name}"? O treino atual será substituído.`))return;
    store.rounds=JSON.parse(JSON.stringify(item.rounds));
    save(); updateUI();
  };
  const overwriteSaved=i=>{
    const items=getSaved(); const item=items[i]; if(!item)return;
    if(!confirm(`Atualizar "${item.name}" com o treino atual?`))return;
    item.rounds=JSON.parse(JSON.stringify(store.rounds)); item.updatedAt=Date.now();
    setSaved(items); render();
  };
  const deleteSaved=i=>{
    const items=getSaved(); const item=items[i]; if(!item)return;
    if(!confirm(`Excluir o treino "${item.name}"?`))return;
    items.splice(i,1); setSaved(items); render();
  };
  const style=document.createElement('style');
  style.textContent=`#savedWorkouts{margin-top:14px}.saved-title{font-weight:700;margin:8px 0;color:#eee}.saved-row{display:flex;gap:8px;margin:8px 0}.saved-input{flex:1;min-width:0;padding:10px;background:#050505;color:#eee;border:1px solid #222;border-radius:8px}.saved-list{display:flex;flex-direction:column;gap:8px;margin-top:10px}.saved-item{background:#0a0a0a;border:1px solid #222;border-radius:10px;padding:10px}.saved-item-name{font-weight:600;margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.saved-actions{display:grid;grid-template-columns:1fr 1fr 50px;gap:6px}.saved-actions .btn{min-height:40px;padding:7px 5px;font-size:12px}.saved-empty{color:#888;font-size:13px;padding:8px 0}@media(max-width:600px){.saved-row{display:grid;grid-template-columns:1fr auto}.saved-row .primary{min-width:95px}.saved-actions{grid-template-columns:1fr 1fr 50px}}`;
  document.head.appendChild(style);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',makeUI);else makeUI();
})();
