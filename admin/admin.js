// Black Coffin Admin — shared logic (HTML/CSS/JS only)
const ADMIN_PASS = 'coffin123';
const USERS_KEY = 'bc-admin-users';
const LOCKS_KEY = 'bc-admin-locks';
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 10;
const DEFAULT_USERS = [
  { role: 'staff', label: 'Staff', pass: 'staff123', enabled: true, sessionMins: 60 },
  { role: 'manager', label: 'Manager', pass: 'manager123', enabled: true, sessionMins: 120 },
  { role: 'admin', label: 'Admin', pass: ADMIN_PASS, enabled: true, sessionMins: 240 },
];
const PERMISSIONS = {
  staff: ['orders.view', 'orders.status', 'inbox.view', 'menu.view'],
  manager: ['orders.view', 'orders.status', 'orders.delete', 'inbox.view', 'inbox.manage', 'menu.view', 'menu.edit', 'reports.view', 'export'],
  admin: ['orders.view', 'orders.status', 'orders.delete', 'inbox.view', 'inbox.manage', 'menu.view', 'menu.edit', 'reports.view', 'export', 'settings'],
};
const ORDERS_KEY = 'bc-orders';
const MENU_KEY = 'bc-menu';
const SL_TZ = 'Asia/Colombo';
const DEFAULT_MENU = [
  { id: 'midnight', name: 'Midnight Espresso', price: 650, cat: 'espresso', badge: 'House', desc: 'Double shot, dark chocolate, smoked cherry. Our signature.', img: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80' },
  { id: 'obsidian', name: 'Obsidian Latte', price: 850, cat: 'espresso', desc: 'Activated charcoal, oat milk, vanilla — black as night.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80' },
  { id: 'coffin', name: 'The Coffin Cold Brew', price: 750, cat: 'cold', badge: 'Best Seller', desc: '24h steeped, nitrogen chilled, velvet finish.', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },
  { id: 'raven', name: 'Raven Mocha', price: 900, cat: 'espresso', desc: 'Dark cocoa, espresso, oat milk, whisper of sea salt.', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80' },
  { id: 'soul', name: 'Soul Filter — Ethiopia', price: 700, cat: 'brew', desc: 'Washed, light-dark. Jasmine, bergamot, honey.', img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80' },
  { id: 'hex', name: 'Hex Pour-Over', price: 800, cat: 'brew', badge: 'Single Origin', desc: 'Colombia Huila, 1:16, 96°C. Ritual brewed at bar.', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80' },
  { id: 'black-tonic', name: 'Black Tonic', price: 850, cat: 'cold', desc: 'Espresso + tonic + lime. Bitter, bright, possessed.', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { id: 'ash-croissant', name: 'Ash Croissant', price: 600, cat: 'pastry', desc: 'Charcoal croissant, almond frangipane, dusted black.', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
  { id: 'velvet-brownie', name: 'Velvet Brownie', price: 700, cat: 'pastry', badge: 'Vegan', desc: '70% dark, sea salt, walnut. No compromise.', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
  { id: 'mourning-bun', name: 'Mourning Cinnamon Bun', price: 650, cat: 'pastry', desc: 'Black sugar glaze, cardamom, sticky & dark.', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { id: 'penance', name: 'Penance Americano', price: 500, cat: 'espresso', desc: 'Straight, hot, honest. No milk, no mercy.', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80' },
  { id: 'nocturne', name: 'Nocturne Iced Latte', price: 850, cat: 'cold', desc: 'Oat milk, midnight espresso, vanilla cold foam.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80' },
];

const $ = (s, r=document) => r.querySelector(s);
function getUsers(){
  try{
    const v = localStorage.getItem(USERS_KEY);
    if(v){
      const arr = JSON.parse(v);
      if(Array.isArray(arr) && arr.length) return arr.map(u=>({ ...(DEFAULT_USERS.find(d=>d.role===u.role)||{}), ...u }));
    }
  }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_USERS));
}
function saveUsers(users){ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function getLocks(){ try{ const v=localStorage.getItem(LOCKS_KEY); const o=v? JSON.parse(v): {}; return (o && typeof o==='object') ? o : {}; }catch(e){ return {}; } }
function saveLocks(locks){ localStorage.setItem(LOCKS_KEY, JSON.stringify(locks)); }
function lockState(role){
  const l = getLocks()[role];
  if(!l) return { locked:false, tries:0, until:0 };
  if(l.until && l.until > Date.now()) return { locked:true, tries:l.tries||0, until:l.until };
  return { locked:false, tries:0, until:0 };
}
function registerFail(role){
  const locks = getLocks();
  const cur = locks[role] || { tries:0 };
  cur.tries = (cur.tries || 0) + 1;
  if(cur.tries >= MAX_ATTEMPTS){ cur.until = Date.now() + LOCK_MINUTES * 60000; cur.tries = 0; }
  locks[role] = cur;
  saveLocks(locks);
  return lockState(role);
}
function clearLock(role){ const locks=getLocks(); delete locks[role]; saveLocks(locks); }
function currentRole(){
  const v = sessionStorage.getItem('bc-admin');
  if(v === '1') return 'admin';
  return (v && PERMISSIONS[v]) ? v : null;
}
function currentUser(){ const r=currentRole(); return getUsers().find(u=>u.role===r) || null; }
function isAuthed(){ return !!currentRole(); }
function can(perm){ const r=currentRole(); return !!r && PERMISSIONS[r].includes(perm); }
function sessionMins(){ const u=currentUser(); return u && u.sessionMins ? u.sessionMins : 60; }
function lastLogin(){ return Number(sessionStorage.getItem('bc-admin-login') || 0); }
function touchSession(){ if(isAuthed()) sessionStorage.setItem('bc-admin-last', String(Date.now())); }
function sessionExpired(){
  if(!isAuthed()) return false;
  const last = Number(sessionStorage.getItem('bc-admin-last') || 0);
  if(!last) return false;
  return (Date.now() - last) > sessionMins() * 60000;
}
function logout(param){ sessionStorage.removeItem('bc-admin'); sessionStorage.removeItem('bc-admin-login'); sessionStorage.removeItem('bc-admin-last'); location.href = param ? `login.html?${param}` : 'login.html'; }
function login(role, pass){
  const state = lockState(role);
  if(state.locked) return { ok:false, msg:`Locked — try again in ${Math.ceil((state.until - Date.now())/60000)} min.` };
  const u = getUsers().find(x=>x.role===role);
  if(!u) return { ok:false, msg:'Unknown role.' };
  if(u.enabled === false) return { ok:false, msg:'This account is disabled. Ask the admin.' };
  if(u.pass !== pass){
    const after = registerFail(role);
    return { ok:false, msg: after.locked ? `Too many attempts — locked for ${LOCK_MINUTES} min.` : `Wrong password (${after.tries}/${MAX_ATTEMPTS}).` };
  }
  clearLock(role);
  const now = String(Date.now());
  sessionStorage.setItem('bc-admin', u.role);
  sessionStorage.setItem('bc-admin-login', now);
  sessionStorage.setItem('bc-admin-last', now);
  return { ok:true, msg:`Welcome, ${u.label}.` };
}
function changeOwnPassword(oldPass, newPass){
  const role = currentRole();
  if(!role) return { ok:false, msg:'Not signed in.' };
  const users = getUsers();
  const u = users.find(x=>x.role===role);
  if(!u) return { ok:false, msg:'Account missing.' };
  if(u.pass !== oldPass) return { ok:false, msg:'Current password is wrong.' };
  if(!newPass || newPass.length < 6) return { ok:false, msg:'New password needs 6+ characters.' };
  u.pass = newPass;
  saveUsers(users);
  return { ok:true, msg:'Password changed.' };
}
function adminSetPassword(role, newPass){
  if(!can('settings')) return { ok:false, msg:'Admin only.' };
  const users = getUsers();
  const u = users.find(x=>x.role===role);
  if(!u) return { ok:false, msg:'Account missing.' };
  if(!newPass || newPass.length < 6) return { ok:false, msg:'Password needs 6+ characters.' };
  u.pass = newPass;
  saveUsers(users);
  return { ok:true, msg:`${u.label} password updated.` };
}
function adminResetPassword(role){
  if(!can('settings')) return { ok:false, msg:'Admin only.' };
  const d = DEFAULT_USERS.find(x=>x.role===role);
  if(!d) return { ok:false, msg:'Account missing.' };
  return adminSetPassword(role, d.pass);
}
function adminSetEnabled(role, enabled){
  if(!can('settings')) return { ok:false, msg:'Admin only.' };
  const users = getUsers();
  const u = users.find(x=>x.role===role);
  if(!u) return { ok:false, msg:'Account missing.' };
  if(u.role === 'admin' && !enabled) return { ok:false, msg:'Admin account cannot be disabled.' };
  u.enabled = !!enabled;
  saveUsers(users);
  return { ok:true, msg:`${u.label} ${u.enabled ? 'enabled' : 'disabled'}.` };
}
function adminClearLocks(){
  if(!can('settings')) return { ok:false, msg:'Admin only.' };
  saveLocks({});
  return { ok:true, msg:'All login locks cleared.' };
}
function requireAuth(perm){
  const p = location.pathname.split('/').pop() || 'index.html';
  if(!isAuthed()){
    if(p !== 'login.html') location.href = 'login.html';
    return false;
  }
  if(perm && !can(perm)){
    if(p !== 'index.html') location.href = 'index.html';
    return false;
  }
  return true;
}
function getOrders(){ try{ const v=localStorage.getItem(ORDERS_KEY); return v? JSON.parse(v): []; }catch(e){ return []; } }
function saveOrders(o){ localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }
function getMenu(){ try{ const v=localStorage.getItem(MENU_KEY); if(v){ const p=JSON.parse(v); if(Array.isArray(p)) return p; } }catch(e){} return JSON.parse(JSON.stringify(DEFAULT_MENU)); }
function saveMenu(m){ localStorage.setItem(MENU_KEY, JSON.stringify(m)); }
function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,30) || 'item-'+Date.now().toString(36); }
const lkrFmt = new Intl.NumberFormat('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
function formatPrice(n){ return 'Rs ' + lkrFmt.format(Number(n) || 0); }
function formatSLDateTime(iso){
  const d = iso ? new Date(iso) : new Date();
  if(isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-LK', { timeZone: SL_TZ, day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true }).format(d) + ' SLST';
}
function formatSLClock(){
  const now = new Date();
  const date = new Intl.DateTimeFormat('en-LK', { timeZone: SL_TZ, weekday:'short', day:'2-digit', month:'short', year:'numeric' }).format(now);
  const time = new Intl.DateTimeFormat('en-LK', { timeZone: SL_TZ, hour:'2-digit', minute:'2-digit', hour12:true }).format(now);
  return date + ' • ' + time + ' SLST';
}

// Sidebar active state + logout
document.addEventListener('DOMContentLoaded', () => {
  if(isAuthed() && sessionExpired()){ logout('expired=1'); return; }
  if(isAuthed()){
    touchSession();
    let lastTouch = 0;
    const act = () => { const n = Date.now(); if(n - lastTouch > 5000){ lastTouch = n; touchSession(); } };
    document.addEventListener('click', act, { passive:true });
    document.addEventListener('keydown', act);
    document.addEventListener('mousemove', act, { passive:true });
    setInterval(()=>{ if(isAuthed() && sessionExpired()) logout('expired=1'); }, 15000);
    document.addEventListener('visibilitychange', ()=>{ if(!document.hidden && isAuthed() && sessionExpired()) logout('expired=1'); });
  }
  const cur = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.admin-nav a').forEach(a=>{
    const href = (a.getAttribute('href')||'').split('/').pop().toLowerCase();
    if(href===cur) a.classList.add('active');
  });
  const role = currentRole();
  document.querySelectorAll('[data-roles]').forEach(el=>{
    const allowed = (el.getAttribute('data-roles')||'').split(',').map(s=>s.trim());
    if(role && !allowed.includes(role)) el.remove();
  });
  const badge = document.getElementById('role-badge');
  if(badge){
    const u = currentUser();
    badge.textContent = u ? u.label : '';
    badge.hidden = !u;
  }
  document.querySelectorAll('[data-need]').forEach(el=>{
    if(!can(el.getAttribute('data-need'))) el.classList.add('hidden');
  });
  const logoutBtn = document.getElementById('admin-logout');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=> logout());
  const clockEl = document.getElementById('sl-clock');
  if(clockEl){ const tick=()=>{ clockEl.textContent=formatSLClock(); }; tick(); setInterval(tick, 30000); }
  const exp = document.getElementById('export-btn');
  if(exp && !can('export')) exp.classList.add('hidden');
  if(exp) exp.addEventListener('click', ()=>{
    const data=JSON.stringify({ orders:getOrders(), menu:getMenu(), messages:JSON.parse(localStorage.getItem('bc-messages')||'[]'), newsletter:JSON.parse(localStorage.getItem('bc-newsletter')||'[]') }, null, 2);
    const blob=new Blob([data], {type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='black-coffin-export.json'; a.click(); URL.revokeObjectURL(url);
  });
});
