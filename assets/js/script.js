// Black Coffin — Menu + Cart + Mock Stripe (static: HTML/CSS/JS only, no backend)
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const SL_TZ = 'Asia/Colombo';
  const DELIVERY_FEE = 450;
  const FREE_DELIVERY_OVER = 3500;
  const lkrFmt = new Intl.NumberFormat('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  function formatPrice(n) { return 'Rs ' + lkrFmt.format(Number(n) || 0); }
  function formatSLDateTime(iso) {
    const d = iso ? new Date(iso) : new Date();
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('en-LK', { timeZone: SL_TZ, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(d) + ' SLST';
  }
  function formatSLClock() {
    const now = new Date();
    const date = new Intl.DateTimeFormat('en-LK', { timeZone: SL_TZ, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(now);
    const time = new Intl.DateTimeFormat('en-LK', { timeZone: SL_TZ, hour: '2-digit', minute: '2-digit', hour12: true }).format(now);
    return date + ' • ' + time + ' SLST';
  }
  const clockEl = $('#sl-clock');
  if (clockEl) {
    const tick = () => { clockEl.textContent = formatSLClock(); };
    tick();
    setInterval(tick, 30000);
  }

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Intl.DateTimeFormat('en-LK', { timeZone: SL_TZ, year: 'numeric' }).format(new Date());

  const mobileToggle = $('#mobile-toggle');
  const mobileNav = $('#mobile-nav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
  }

  const MENU_KEY = 'bc-menu';
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
  function loadMenu(){ try{ const v=localStorage.getItem(MENU_KEY); if(v){ const p=JSON.parse(v); if(Array.isArray(p)&&p.length) return p; } }catch(e){} return JSON.parse(JSON.stringify(DEFAULT_MENU)); }
  function saveMenu(m){ localStorage.setItem(MENU_KEY, JSON.stringify(m)); }
  let menu = loadMenu();
  let lastMenuJSON = JSON.stringify(menu);
  function checkMenuUpdate(){
    try{
      const cur = localStorage.getItem(MENU_KEY);
      const curJSON = cur ? cur : JSON.stringify(DEFAULT_MENU);
      if(curJSON !== lastMenuJSON){
        const parsed = cur ? JSON.parse(cur) : null;
        if(Array.isArray(parsed) && parsed.length){ menu = parsed; } else { menu = JSON.parse(JSON.stringify(DEFAULT_MENU)); }
        lastMenuJSON = JSON.stringify(menu);
        renderMenu(); renderCart();
        // optional toast for debug: console.log('menu updated');
      }
    }catch(e){}
  }
  // keep menu in sync if admin changes it in another tab/window
  window.addEventListener('storage', (e)=>{ if(e.key===MENU_KEY || e.key===null){ checkMenuUpdate(); } });
  window.addEventListener('focus', checkMenuUpdate);
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) checkMenuUpdate(); });
  window.addEventListener('pageshow', checkMenuUpdate);
  // polling for cross-page sync when storage event doesn't fire
  setInterval(checkMenuUpdate, 800);

  const grid = $('#menu-grid');
  const emptyEl = $('#menu-empty');
  const searchEl = $('#menu-search');
  const filterBtns = $$('.filter-btn');
  let activeFilter = 'all';
  let searchQuery = '';

  const CART_KEY = 'bc-cart';
  const ORDERS_KEY = 'bc-orders';
  const FAVORITES_KEY = 'bc-favorites';
  const BACKUP_KEYS = ['bc-menu','bc-cart','bc-orders','bc-messages','bc-newsletter','bc-favorites'];
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const pendingQty = {};

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }
  function getOrders() { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); }
  function saveOrders(orders) { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }
  function getFavorites() { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); }
  function saveFavorites(favs) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs)); }
  function toggleFavorite(id) {
    const favs = getFavorites();
    const idx = favs.indexOf(id);
    if (idx === -1) favs.push(id); else favs.splice(idx, 1);
    saveFavorites(favs);
    renderMenu();
  }
  function isFavorite(id) { return getFavorites().includes(id); }

  let lunrIndex = null;
  function buildLunrIndex() {
    if (!window.lunr) return;
    lunrIndex = window.lunr(function() {
      this.ref('id');
      this.field('name');
      this.field('desc');
      this.field('cat');
      menu.forEach(m => this.add(m));
    });
  }
  function filteredMenu() {
    const favs = getFavorites();
    return menu.filter(m => {
      const matchCat = activeFilter === 'all' || (activeFilter === 'favorites' ? favs.includes(m.id) : m.cat === activeFilter);
      const q = searchQuery.trim().toLowerCase();
      let matchSearch = !q;
      if (!matchSearch) {
        if (lunrIndex) {
          const results = lunrIndex.search(q);
          matchSearch = results.some(r => r.ref === m.id);
        } else {
          matchSearch = m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q);
        }
      }
      return matchCat && matchSearch;
    });
  }
  function renderMenu() {
    if (!grid) return;
    const items = filteredMenu();
    grid.innerHTML = '';
    if (items.length === 0) { emptyEl.classList.remove('hidden'); return; }
    emptyEl.classList.add('hidden');
    const favFilterBtn = $('#fav-filter');
    if (favFilterBtn) favFilterBtn.style.display = getFavorites().length ? 'inline-flex' : 'none';
    items.forEach(item => {
      const qty = pendingQty[item.id] || 1;
      const fav = isFavorite(item.id);
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-img">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
          <button class="heart-btn" data-fav="${item.id}" aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.6); border:none; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.1rem; color:${fav ? '#ef4444' : '#fff'}; transition:color 0.2s">${fav ? '♥' : '♡'}</button>
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3>${item.name}</h3>
            <span class="price">${formatPrice(item.price)}</span>
          </div>
          <p class="card-desc">${item.desc}</p>
          <div class="card-foot">
            <div class="qty-ctrl">
              <button aria-label="Decrease quantity" data-dec="${item.id}">−</button>
              <span data-qty="${item.id}">${qty}</span>
              <button aria-label="Increase quantity" data-inc="${item.id}">+</button>
            </div>
            <button class="btn btn-primary add-btn" data-add="${item.id}">Add • ${formatPrice(item.price * qty)}</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  if (grid) {
    grid.addEventListener('click', (e) => {
      const inc = e.target.closest('[data-inc]');
      const dec = e.target.closest('[data-dec]');
      const add = e.target.closest('[data-add]');
      const fav = e.target.closest('[data-fav]');
      if (inc) { const id = inc.getAttribute('data-inc'); pendingQty[id] = Math.min(9, (pendingQty[id] || 1) + 1); renderMenu(); }
      else if (dec) { const id = dec.getAttribute('data-dec'); pendingQty[id] = Math.max(1, (pendingQty[id] || 1) - 1); renderMenu(); }
      else if (add) { const id = add.getAttribute('data-add'); const qty = pendingQty[id] || 1; addToCart(id, qty); toast(`${qty} × ${menu.find(m=>m.id===id).name} added`); }
      else if (fav) { const id = fav.getAttribute('data-fav'); toggleFavorite(id); }
    });
  }
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeFilter = btn.dataset.filter; renderMenu();
  }));
  if (searchEl) searchEl.addEventListener('input', () => { searchQuery = searchEl.value; renderMenu(); });
  function addToCart(id, qty) { const ex = cart.find(c => c.id === id); if (ex) ex.qty += qty; else cart.push({ id, qty }); saveCart(); }

  const cartItemsEl = $('#cart-items');
  const cartCountEl = $('#cart-count');
  const cartCountDrawerEl = $('#cart-count-drawer');
  const cartSubtotalEl = $('#cart-subtotal');
  const cartDeliveryEl = $('#cart-delivery');
  const cartTotalEl = $('#cart-total');
  const checkoutTotalEl = $('#checkout-total');
  const modalTotalEl = $('#modal-total');

  function cartTotals() {
    const subtotal = cart.reduce((s, c) => { const m = menu.find(x => x.id === c.id); return s + (m ? m.price * c.qty : 0); }, 0);
    const isDelivery = document.querySelector('input[name="order-type"]:checked')?.value === 'delivery';
    const deliveryFee = isDelivery && subtotal > 0 && subtotal < FREE_DELIVERY_OVER ? DELIVERY_FEE : 0;
    return { subtotal, deliveryFee, total: subtotal + deliveryFee, isDelivery };
  }

  function renderCart() {
    // purge cart items whose menu entry was deleted
    const before = cart.length;
    cart = cart.filter(c=> menu.some(m=>m.id===c.id));
    if(cart.length!==before) saveCart();
    if (!cartItemsEl) return;
    const totalQty = cart.reduce((s, c) => s + c.qty, 0);
    if (cartCountEl) cartCountEl.textContent = totalQty;
    if (cartCountDrawerEl) cartCountDrawerEl.textContent = totalQty ? `(${totalQty})` : '';
    if (cart.length === 0) cartItemsEl.innerHTML = '<p class="empty-cart">Your coffin is empty. Add something dark.</p>';
    else {
      cartItemsEl.innerHTML = cart.map(c => {
        const m = menu.find(x => x.id === c.id);
        if(!m) return '';
        return `<div class="cart-item">
          <img src="${m.img}" alt="">
          <div>
            <h4>${m.name}</h4>
            <p>${formatPrice(m.price)} × ${c.qty} = ${formatPrice(m.price * c.qty)}</p>
            <div class="qty">
              <button data-cdec="${c.id}">−</button>
              <span>${c.qty}</span>
              <button data-cinc="${c.id}">+</button>
              <button class="remove" data-cremove="${c.id}">Remove</button>
            </div>
          </div>
          <strong>${formatPrice(m.price * c.qty)}</strong>
        </div>`;
      }).join('');
    }
    const { subtotal, total, deliveryFee, isDelivery } = cartTotals();
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);
    if (cartDeliveryEl) cartDeliveryEl.textContent = !isDelivery ? 'Pickup — free' : deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(total);
    if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(total);
    if (modalTotalEl) modalTotalEl.textContent = formatPrice(total);
    const checkoutBtn = $('#checkout-btn'); if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
    renderCheckoutSummary();
  }

  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', (e) => {
      const inc = e.target.closest('[data-cinc]'); const dec = e.target.closest('[data-cdec]'); const rem = e.target.closest('[data-cremove]');
      if (inc) { const item = cart.find(c=>c.id===inc.getAttribute('data-cinc')); if(item){ item.qty=Math.min(9,item.qty+1); saveCart(); } }
      else if (dec) { const item = cart.find(c=>c.id===dec.getAttribute('data-cdec')); if(item){ item.qty-=1; if(item.qty<=0) cart=cart.filter(c=>c.id!==item.id); saveCart(); } }
      else if (rem) { cart=cart.filter(c=>c.id!==rem.getAttribute('data-cremove')); saveCart(); }
    });
  }
  $$('input[name="order-type"]').forEach(r => r.addEventListener('change', () => { saveCart(); toggleAddress(); }));

  function toggleAddress() {
    const isDelivery = document.querySelector('input[name="order-type"]:checked')?.value === 'delivery';
    const addr = $('#checkout-address');
    if (addr) { if (isDelivery) addr.classList.remove('hidden'); else addr.classList.add('hidden'); }
  }

  // Drawer
  const drawer = $('#cart-drawer'); const overlay = $('#cart-overlay'); const cartBtn = $('#cart-btn'); const cartClose = $('#cart-close');
  function openCart() { drawer.classList.add('open'); overlay.classList.remove('hidden'); drawer.setAttribute('aria-hidden','false'); overlay.setAttribute('aria-hidden','false'); }
  function closeCart() { drawer.classList.remove('open'); overlay.classList.add('hidden'); drawer.setAttribute('aria-hidden','true'); overlay.setAttribute('aria-hidden','true'); }
  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeCart(); });

  // Checkout
  const modal = $('#checkout-modal'); const checkoutBtn = $('#checkout-btn'); const modalCancel = $('#modal-cancel'); const checkoutStatus = $('#checkout-status');
  const checkoutForm = $('#checkout-form'); const mockFields = $('#mock-card-fields'); const stripeInfo = $('#stripe-info');

  function renderCheckoutSummary() {
    const summary = $('#checkout-summary'); if (!summary) return;
    if (cart.length===0) { summary.innerHTML = '<div class="muted">Cart empty</div>'; return; }
    const { subtotal, deliveryFee, total, isDelivery } = cartTotals();
    summary.innerHTML = cart.map(c=>{
      const m=menu.find(x=>x.id===c.id); return `<div><span>${m.name} × ${c.qty}</span><span>${formatPrice(m.price*c.qty)}</span></div>`;
    }).join('') + `<div style="border-top:1px dashed var(--border); padding-top:0.4rem; margin-top:0.3rem"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>` + `<div><span>Delivery ${isDelivery?'(delivery)':'(pickup)'}</span><span>${deliveryFee?formatPrice(deliveryFee):(isDelivery?'Free':'—')}</span></div>` + `<div style="font-weight:800; border-top:1px solid var(--border); padding-top:0.4rem"><span>Total</span><span>${formatPrice(total)}</span></div>`;
  }

  // Pay method toggle
  $$('input[name="pay-method"]').forEach(r=>{
    r.addEventListener('change', ()=>{
      const v = document.querySelector('input[name="pay-method"]:checked')?.value;
      if (mockFields) mockFields.classList.toggle('hidden', v!=='card-mock');
      if (stripeInfo) stripeInfo.classList.toggle('hidden', v!=='stripe');
    });
  });

  if (checkoutBtn && modal) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length===0) { toast('Cart is empty'); return; }
      closeCart(); toggleAddress(); renderCheckoutSummary();
      if (typeof modal.showModal==='function') modal.showModal(); else modal.setAttribute('open','');
    });
  }
  if (modalCancel && modal) modalCancel.addEventListener('click', ()=> modal.close());
  if (modal) modal.addEventListener('click', (e)=>{
    const r=modal.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) modal.close();
  });

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name=$('#checkout-name').value.trim();
      const phone=$('#checkout-phone').value.trim();
      const email=$('#checkout-email').value.trim();
      const notes=$('#checkout-notes').value.trim();
      const address=$('#checkout-address').value.trim();
      const payMethod=document.querySelector('input[name="pay-method"]:checked')?.value || 'pickup';
      const { subtotal, deliveryFee, total, isDelivery } = cartTotals();
      if(!name||!phone||!email){ checkoutStatus.textContent='Please enter name, phone, email.'; return; }
      if(isDelivery && !address){ checkoutStatus.textContent='Delivery address required for delivery.'; return; }
      // mock card validation
      if(payMethod==='card-mock'){
        const num=$('#mock-card-number').value.replace(/\s/g,'');
        const exp=$('#mock-exp').value.trim();
        const cvc=$('#mock-cvc').value.trim();
        if(!num || !exp || !cvc){ checkoutStatus.textContent='Please enter mock card details.'; return; }
        if(num!=='4242424242424242'){ checkoutStatus.textContent='Mock card declined — use 4242 4242 4242 4242'; return; }
      }
      checkoutStatus.textContent = payMethod==='stripe' ? 'Redirecting to Stripe (mock)...' : 'Processing payment...';
      const placeBtn=$('#place-order'); if(placeBtn) placeBtn.disabled=true;

      // Static-only: mock Stripe / card — no backend required
      if(payMethod==='stripe'){
        await sleep(1000);
        checkoutStatus.textContent='Stripe mock — no backend. Simulating success...';
        await sleep(600);
      } else if(payMethod==='card-mock'){
        await sleep(1200);
      } else {
        await sleep(600);
      }

      // Create order
      const orderId = `BC-${Date.now().toString().slice(-6)}${Math.floor(100+Math.random()*900)}`;
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        customer: { name, phone, email, address: isDelivery?address:'Pickup' },
        items: cart.map(c=>{ const m=menu.find(x=>x.id===c.id); return { id:c.id, name:m.name, price:m.price, qty:c.qty }; }),
        subtotal, deliveryFee, total,
        orderType: isDelivery?'delivery':'pickup',
        paymentMethod: payMethod,
        paymentStatus: payMethod==='pickup'?'pending':'paid',
        status: 'pending',
        notes
      };
      const orders=getOrders(); orders.unshift(order); saveOrders(orders);
      checkoutStatus.textContent=`Order ${orderId} placed! Total ${formatPrice(total)} — ${isDelivery?'Delivery 35-50 min':'Pickup 15 min'}.`;
      cart=[]; saveCart();
      toast(`Order ${orderId} confirmed †`);
      const printBtn = document.createElement('button');
      printBtn.className = 'btn btn-ghost small-btn';
      printBtn.textContent = 'Print receipt';
      printBtn.style.marginLeft = '0.5rem';
      printBtn.onclick = () => printReceipt(order);
      const actions = document.querySelector('.modal-actions');
      if (actions) actions.appendChild(printBtn);
      setTimeout(()=>{ modal.close(); checkoutStatus.textContent=''; checkoutForm.reset(); if(mockFields) mockFields.classList.add('hidden'); if(stripeInfo) stripeInfo.classList.add('hidden'); if(placeBtn) placeBtn.disabled=false; }, 2200);
      if(placeBtn) placeBtn.disabled=false;
    });
  }

  function printReceipt(order) {
    const win = window.open('', '_blank');
    win.document.write(`
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Receipt ${order.id}</title>
<style>
body{font-family:monospace; max-width:320px; margin:0 auto; padding:1rem; background:#fff; color:#000}
h3{text-align:center; margin:0.5rem 0}
hr{border:none; border-top:1px dashed #000; margin:0.5rem 0}
.row{display:flex; justify-content:space-between; font-size:0.85rem}
.total{font-weight:bold; font-size:1rem; border-top:2px solid #000; padding-top:0.3rem}
.small{font-size:0.75rem; color:#666}
@media print{@page{margin:1rem} body{padding:0} .no-print{display:none}}
</style></head><body>
<h3>BLACK COFFIN</h3>
<div class="small">13 Raven Alley, Colombo 03 | +94 11 234 5678</div>
<hr>
<div class="row"><span>${order.id}</span><span>${formatSLDateTime(order.date)}</span></div>
<div class="row"><span>${order.customer.name}</span><span>${order.orderType}</span></div>
<div class="row"><span>${order.customer.phone}</span><span>${order.paymentMethod}</span></div>
<hr>
${order.items.map(i=>`<div class="row"><span>${i.name} ×${i.qty}</span><span>${formatPrice(i.price * i.qty)}</span></div>`).join('')}
<hr>
<div class="row"><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
<div class="row"><span>Delivery</span><span>${order.deliveryFee ? formatPrice(order.deliveryFee) : 'Free'}</span></div>
<div class="row total"><span>Total</span><span>${formatPrice(order.total)}</span></div>
<hr>
<div class="small">Thank you for your order!</div>
<button class="no-print" onclick="window.print()" style="margin-top:1rem; padding:0.5rem 1rem; width:100%">Print / Save as PDF</button>
</body></html>
`);
    win.document.close();
    win.focus();
  }

  // Contact
  const contactForm=$('#contact'); const formStatus=$('#form-status');
  if(contactForm) contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name=$('#contact-name').value.trim(); const email=$('#contact-email').value.trim(); const msg=$('#contact-msg').value.trim();
    if(!name||!email||!msg){ formStatus.textContent='Please fill all required fields.'; return; }
    const msgs=JSON.parse(localStorage.getItem('bc-messages')||'[]'); msgs.unshift({ name,email,subject:$('#contact-subject').value.trim(),msg,date:new Date().toISOString() }); localStorage.setItem('bc-messages', JSON.stringify(msgs));
    formStatus.textContent='Sending...'; setTimeout(()=>{ formStatus.textContent='Message sent — we reply within hours.'; contactForm.reset(); }, 500);
  });
  // Newsletter
  const newsletter=$('#newsletter'); const newsletterStatus=$('#newsletter-status');
  if(newsletter) newsletter.addEventListener('submit', (e)=>{
    e.preventDefault(); const email=newsletter.querySelector('input[type="email"]').value.trim(); if(!email) return;
    const list=JSON.parse(localStorage.getItem('bc-newsletter')||'[]'); if(!list.includes(email)){ list.push(email); localStorage.setItem('bc-newsletter', JSON.stringify(list)); }
    newsletterStatus.textContent="You're in. Check email for 10% off."; newsletter.reset(); setTimeout(()=>newsletterStatus.textContent='',4000);
  });
  // Toast
  const toastEl=$('#toast'); let toastTimer; function toast(msg){ if(!toastEl) return; toastEl.textContent=msg; toastEl.classList.remove('hidden'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toastEl.classList.add('hidden'), 2400); }

  // expose for admin + allow admin to force refresh
  window.BC_MENU = menu;
  window.BC_LOAD_MENU = ()=>{ menu=loadMenu(); return menu; };
  window.BC_SAVE_MENU = saveMenu;
  window.BC_DEFAULT_MENU = DEFAULT_MENU;
  window.BC_CHECK_MENU = checkMenuUpdate;
  window.BC_EXPORT_DATA = () => {
    const data = {};
    BACKUP_KEYS.forEach(k => { data[k] = localStorage.getItem(k); });
    return data;
  };
  window.BC_IMPORT_DATA = (data) => {
    BACKUP_KEYS.forEach(k => { if (data[k] !== undefined) localStorage.setItem(k, data[k]); });
    location.reload();
  };
  // init
  buildLunrIndex();
  renderMenu(); renderCart();
  // force check shortly after load
  setTimeout(checkMenuUpdate, 300);
});
