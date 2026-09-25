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
  staff: ['orders.view', 'orders.status', 'inbox.view', 'menu.view', 'board.view', 'reservations.view'],
  manager: ['orders.view', 'orders.status', 'orders.delete', 'inbox.view', 'inbox.manage', 'menu.view', 'menu.edit', 'reports.view', 'export', 'board.view', 'reservations.view', 'reservations.manage', 'coupons.manage', 'loyalty.view'],
  admin: ['orders.view', 'orders.status', 'orders.delete', 'inbox.view', 'inbox.manage', 'menu.view', 'menu.edit', 'reports.view', 'export', 'settings', 'board.view', 'reservations.view', 'reservations.manage', 'coupons.manage', 'loyalty.view'],
};
const ORDERS_KEY = 'bc-orders';
const MENU_KEY = 'bc-menu';
const ZONES_KEY = 'bc-zones';
const COUPONS_KEY = 'bc-coupons';
const RESERVATIONS_KEY = 'bc-reservations';
const LOYALTY_KEY = 'bc-loyalty';
const BOARD_SOUND_KEY = 'bc-board-sound';
const SL_TZ = 'Asia/Colombo';
const POINTS_PER_100 = 1;
const REDEEM_POINTS = 100;
const REDEEM_VALUE = 1000;
const DEFAULT_ZONES = [
  { id: 'C01', name: 'Colombo 01 — Fort', fee: 400, min: 1500, freeOver: 3000, active: true },
  { id: 'C02', name: 'Colombo 02 — Slave Island', fee: 400, min: 1500, freeOver: 3000, active: true },
  { id: 'C03', name: 'Colombo 03 — Kollupitiya', fee: 450, min: 2000, freeOver: 3500, active: true },
  { id: 'C04', name: 'Colombo 04 — Bambalapitiya', fee: 500, min: 2000, freeOver: 3500, active: true },
  { id: 'C05', name: 'Colombo 05 — Havelock Town', fee: 500, min: 2500, freeOver: 4000, active: true },
  { id: 'C06', name: 'Colombo 06 — Wellawatte', fee: 600, min: 2500, freeOver: 4000, active: true },
  { id: 'C07', name: 'Colombo 07 — Cinnamon Gardens', fee: 450, min: 2000, freeOver: 3500, active: true },
];
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
function readList(key, fallback){
  try{ const v=localStorage.getItem(key); if(v){ const p=JSON.parse(v); if(Array.isArray(p)) return p; } }catch(e){}
  return JSON.parse(JSON.stringify(fallback));
}
function getZones(){ return readList(ZONES_KEY, DEFAULT_ZONES); }
function saveZones(z){ localStorage.setItem(ZONES_KEY, JSON.stringify(z)); }
function getCoupons(){ return readList(COUPONS_KEY, []); }
function saveCoupons(c){ localStorage.setItem(COUPONS_KEY, JSON.stringify(c)); }
function getReservations(){ return readList(RESERVATIONS_KEY, []); }
function saveReservations(r){ localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(r)); }
function getLoyalty(){ return readList(LOYALTY_KEY, []); }
function saveLoyalty(l){ localStorage.setItem(LOYALTY_KEY, JSON.stringify(l)); }
function normalizePhone(p){ return String(p||'').replace(/\D/g,'').slice(-9); }
function getMember(phone){
  const key = normalizePhone(phone);
  if(!key) return null;
  return getLoyalty().find(m=>m.phone === key) || null;
}
function earnPoints(phone, name, total){
  const key = normalizePhone(phone);
  if(!key) return 0;
  const points = Math.floor(Number(total||0) / 100) * POINTS_PER_100;
  if(points <= 0) return 0;
  const list = getLoyalty();
  let m = list.find(x=>x.phone === key);
  if(!m){ m = { phone:key, name: name||'Guest', points:0, earned:0, redeemed:0, orders:0, spend:0 }; list.push(m); }
  m.points += points; m.earned += points; m.orders += 1; m.spend += Number(total||0);
  if(name) m.name = name;
  saveLoyalty(list);
  return points;
}
function redeemPoints(phone, points){
  const key = normalizePhone(phone);
  const list = getLoyalty();
  const m = list.find(x=>x.phone === key);
  if(!m) return { ok:false, msg:'No loyalty balance for this number.' };
  if(m.points < points) return { ok:false, msg:`Not enough points — you have ${m.points}.` };
  m.points -= points; m.redeemed += points;
  saveLoyalty(list);
  return { ok:true, msg:`Redeemed ${points} points.` };
}
function boardSoundOn(){ try{ return localStorage.getItem(BOARD_SOUND_KEY) !== '0'; }catch(e){ return true; } }
function setBoardSoundOn(on){ try{ localStorage.setItem(BOARD_SOUND_KEY, on ? '1' : '0'); }catch(e){} }
const BACKUP_KEYS = ['bc-menu','bc-cart','bc-orders','bc-messages','bc-newsletter','bc-favorites','bc-cart-meta','bc-coupons','bc-zones','bc-reservations','bc-loyalty'];
function exportData(){
  const data = {};
  BACKUP_KEYS.forEach(k => { data[k] = localStorage.getItem(k); });
  return data;
}
function importData(data){
  if(!data || typeof data !== 'object') return { ok:false, msg:'Invalid backup file.' };
  let n = 0;
  BACKUP_KEYS.forEach(k => { if(data[k] !== undefined && data[k] !== null){ localStorage.setItem(k, data[k]); n++; } });
  return { ok:true, msg:`Restored ${n} key(s). Reloading…`, count:n };
}
function adjustPoints(phone, delta){
  if(!can('loyalty.view')) return { ok:false, msg:'Manager or admin only.' };
  const key = normalizePhone(phone);
  const list = getLoyalty();
  let m = list.find(x=>x.phone === key);
  if(!m) return { ok:false, msg:'Member not found.' };
  m.points = Math.max(0, m.points + Number(delta||0));
  if(delta > 0) m.earned += Number(delta);
  if(delta < 0) m.redeemed += Math.abs(Number(delta));
  saveLoyalty(list);
  return { ok:true, msg:`${m.name} now has ${m.points} points.` };
}
function setReservationStatus(id, status){
  if(!can('reservations.manage')) return { ok:false, msg:'Manager or admin only.' };
  const list = getReservations();
  const r = list.find(x=>x.id === id);
  if(!r) return { ok:false, msg:'Reservation not found.' };
  r.status = status;
  saveReservations(list);
  return { ok:true, msg:`Reservation ${r.id} ${status}.` };
}
function escapeHtml(v){
  return String(v === undefined || v === null ? '' : v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function couponDiscountValue(coupon, subtotal){
  if(!coupon) return 0;
  const sub = Number(subtotal) || 0;
  let value = coupon.type === 'percent' ? Math.round(sub * (Number(coupon.value) || 0) / 100) : Math.round(Number(coupon.value) || 0);
  if(coupon.maxDiscount) value = Math.min(value, Number(coupon.maxDiscount));
  return Math.min(value, sub);
}
function couponIsUsable(coupon, subtotal){
  if(!coupon) return { ok:false, msg:'Invalid code.' };
  if(coupon.active === false) return { ok:false, msg:'This code is no longer active.' };
  if(coupon.expires && new Date(coupon.expires) < new Date()) return { ok:false, msg:'This code has expired.' };
  if(coupon.maxUses && coupon.used >= coupon.maxUses) return { ok:false, msg:'This code has reached its usage limit.' };
  const min = Number(coupon.minSpend) || 0;
  if(Number(subtotal) < min) return { ok:false, msg:`Minimum spend ${formatPrice(min)} for this code.` };
  return { ok:true, msg:'Code applied.' };
}
function findCoupon(code){
  const c = String(code||'').trim().toUpperCase();
  if(!c) return null;
  return getCoupons().find(x=>String(x.code||'').toUpperCase() === c) || null;
}
function slDayKey(iso){
  try{ return new Intl.DateTimeFormat('en-CA', { timeZone: SL_TZ, year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date(iso)); }
  catch(e){ return ''; }
}
function slDateTimeLocal(iso){
  try{ return new Intl.DateTimeFormat('en-CA', { timeZone: SL_TZ, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false }).format(new Date(iso)); }
  catch(e){ return ''; }
}
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
