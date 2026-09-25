// Black Coffin Admin — shared logic (HTML/CSS/JS only)
const ADMIN_PASS = 'coffin123';
const ORDERS_KEY = 'bc-orders';
const MENU_KEY = 'bc-menu';
const DEFAULT_MENU = [
  { id: 'midnight', name: 'Midnight Espresso', price: 4.5, cat: 'espresso', badge: 'House', desc: 'Double shot, dark chocolate, smoked cherry. Our signature.', img: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80' },
  { id: 'obsidian', name: 'Obsidian Latte', price: 6.0, cat: 'espresso', desc: 'Activated charcoal, oat milk, vanilla — black as night.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80' },
  { id: 'coffin', name: 'The Coffin Cold Brew', price: 5.5, cat: 'cold', badge: 'Best Seller', desc: '24h steeped, nitrogen chilled, velvet finish.', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },
  { id: 'raven', name: 'Raven Mocha', price: 6.5, cat: 'espresso', desc: 'Dark cocoa, espresso, oat milk, whisper of sea salt.', img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80' },
  { id: 'soul', name: 'Soul Filter — Ethiopia', price: 5.0, cat: 'brew', desc: 'Washed, light-dark. Jasmine, bergamot, honey.', img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80' },
  { id: 'hex', name: 'Hex Pour-Over', price: 5.5, cat: 'brew', badge: 'Single Origin', desc: 'Colombia Huila, 1:16, 96°C. Ritual brewed at bar.', img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80' },
  { id: 'black-tonic', name: 'Black Tonic', price: 6.0, cat: 'cold', desc: 'Espresso + tonic + lime. Bitter, bright, possessed.', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { id: 'ash-croissant', name: 'Ash Croissant', price: 4.0, cat: 'pastry', desc: 'Charcoal croissant, almond frangipane, dusted black.', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80' },
  { id: 'velvet-brownie', name: 'Velvet Brownie', price: 4.5, cat: 'pastry', badge: 'Vegan', desc: '70% dark, sea salt, walnut. No compromise.', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
  { id: 'mourning-bun', name: 'Mourning Cinnamon Bun', price: 5.0, cat: 'pastry', desc: 'Black sugar glaze, cardamom, sticky & dark.', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { id: 'penance', name: 'Penance Americano', price: 4.0, cat: 'espresso', desc: 'Straight, hot, honest. No milk, no mercy.', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80' },
  { id: 'nocturne', name: 'Nocturne Iced Latte', price: 6.0, cat: 'cold', desc: 'Oat milk, midnight espresso, vanilla cold foam.', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80' },
];

const $ = (s, r=document) => r.querySelector(s);
function isAuthed(){ return sessionStorage.getItem('bc-admin')==='1'; }
function requireAuth(){
  if(!isAuthed()){
    const p = location.pathname.split('/').pop() || 'index.html';
    if(p !== 'login.html') location.href = 'login.html';
    return false;
  }
  return true;
}
function getOrders(){ try{ const v=localStorage.getItem(ORDERS_KEY); return v? JSON.parse(v): []; }catch(e){ return []; } }
function saveOrders(o){ localStorage.setItem(ORDERS_KEY, JSON.stringify(o)); }
function getMenu(){ try{ const v=localStorage.getItem(MENU_KEY); if(v){ const p=JSON.parse(v); if(Array.isArray(p)) return p; } }catch(e){} return JSON.parse(JSON.stringify(DEFAULT_MENU)); }
function saveMenu(m){ localStorage.setItem(MENU_KEY, JSON.stringify(m)); }
function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,30) || 'item-'+Date.now().toString(36); }
function formatPrice(n){ return `$${Number(n).toFixed(2)}`; }

// Sidebar active state + logout
document.addEventListener('DOMContentLoaded', () => {
  const cur = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.admin-nav a').forEach(a=>{
    const href = (a.getAttribute('href')||'').split('/').pop().toLowerCase();
    if(href===cur) a.classList.add('active');
  });
  const logoutBtn = document.getElementById('admin-logout');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{ sessionStorage.removeItem('bc-admin'); location.href='login.html'; });
  // global export helper if present
  const exp = document.getElementById('export-btn');
  if(exp) exp.addEventListener('click', ()=>{
    const data=JSON.stringify({ orders:getOrders(), menu:getMenu(), messages:JSON.parse(localStorage.getItem('bc-messages')||'[]'), newsletter:JSON.parse(localStorage.getItem('bc-newsletter')||'[]') }, null, 2);
    const blob=new Blob([data], {type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='black-coffin-export.json'; a.click(); URL.revokeObjectURL(url);
  });
});
