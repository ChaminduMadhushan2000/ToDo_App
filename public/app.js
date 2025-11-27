const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

const input = qs('#task-input');
const addBtn = qs('#add-btn');
const list = qs('#task-list');
const remainingEl = qs('#remaining');
const filterBtns = qsa('.filter');

let tasks = [];
let filter = 'all';

function api(path, opts = {}){
  return fetch(path, Object.assign({headers:{'Content-Type':'application/json'}}, opts))
    .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)));
}

function render(){
  const visible = tasks.filter(t => (filter==='all') || (filter==='active' && !t.completed) || (filter==='completed' && t.completed));
  list.innerHTML = '';
  if(visible.length===0){
    const li = document.createElement('li'); li.className='placeholder'; li.textContent='No tasks yet. Add one above!'; list.appendChild(li); return;
  }
  visible.forEach(t => {
    const li = document.createElement('li');
    const left = document.createElement('div'); left.className='left';
    const cb = document.createElement('div'); cb.className='checkbox' + (t.completed? ' checked':''); cb.innerHTML = t.completed? '✓':'';
    cb.onclick = () => toggle(t.id, !t.completed);
    const txt = document.createElement('div'); txt.className='task-text' + (t.completed? ' completed':''); txt.textContent = t.text;
    left.appendChild(cb); left.appendChild(txt);
    const actions = document.createElement('div'); actions.className='task-actions';
    const del = document.createElement('button'); del.innerHTML = '✕'; del.title='Delete'; del.onclick = () => remove(t.id);
    actions.appendChild(del);
    li.appendChild(left); li.appendChild(actions);
    list.appendChild(li);
  });
  remainingEl.textContent = tasks.filter(t => !t.completed).length;
}

function load(){
  api('/api/tasks').then(data => { tasks = data.sort((a,b)=>b.createdAt-a.createdAt); render(); }).catch(()=>{});
}

function add(text){
  api('/api/tasks', {method:'POST', body: JSON.stringify({text})}).then(t => { tasks.unshift(t); render(); input.value=''; input.focus(); }).catch(err => alert(err.error || 'Could not add'));
}

function toggle(id, completed){
  api('/api/tasks/'+id, {method:'PUT', body: JSON.stringify({completed})}).then(updated => { const i = tasks.findIndex(t=>t.id===id); if(i>-1) tasks[i]=updated; render(); });
}

function remove(id){
  api('/api/tasks/'+id, {method:'DELETE'}).then(()=>{ tasks = tasks.filter(t=>t.id!==id); render(); });
}

addBtn.addEventListener('click', ()=>{ const v = input.value.trim(); if(v) add(v); });
input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ const v = input.value.trim(); if(v) add(v); } });

filterBtns.forEach(b=>b.addEventListener('click', ()=>{ filterBtns.forEach(x=>x.classList.remove('active')); b.classList.add('active'); filter = b.dataset.filter; render(); }));

load();
