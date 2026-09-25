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
        buildLunrIndex();
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
  const CART_META_KEY = 'bc-cart-meta';
  const LOYALTY_KEY = 'bc-loyalty';
  const COUPONS_KEY = 'bc-coupons';
  const ZONES_KEY = 'bc-zones';
  const POINTS_PER_100 = 1;
  const REDEEM_POINTS = 100;
  const REDEEM_VALUE = 1000;
  const BACKUP_KEYS = ['bc-menu','bc-cart','bc-orders','bc-messages','bc-newsletter','bc-favorites','bc-cart-meta','bc-coupons','bc-zones','bc-reservations','bc-loyalty'];
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
  function getCartMeta() { try{ const m=JSON.parse(localStorage.getItem(CART_META_KEY)||'{}'); return m && typeof m==='object' ? m : {}; }catch(e){ return {}; } }
  function saveCartMeta(m) { localStorage.setItem(CART_META_KEY, JSON.stringify(m)); }
  function getZones() { try{ const z=JSON.parse(localStorage.getItem(ZONES_KEY)||'[]'); return Array.isArray(z) && z.length ? z : []; }catch(e){ return []; } }
  function getCoupons() { try{ const c=JSON.parse(localStorage.getItem(COUPONS_KEY)||'[]'); return Array.isArray(c) ? c : []; }catch(e){ return []; } }
  function getLoyalty() { try{ const l=JSON.parse(localStorage.getItem(LOYALTY_KEY)||'[]'); return Array.isArray(l) ? l : []; }catch(e){ return []; } }
  function saveLoyalty(list) { localStorage.setItem(LOYALTY_KEY, JSON.stringify(list)); }
  function normalizePhone(p) { return String(p||'').replace(/\D/g,'').slice(-9); }
  function getMember(phone) { const key=normalizePhone(phone); if(!key) return null; return getLoyalty().find(m=>m.phone===key) || null; }
  function isSoldOut(item) { return !!item.soldOut || item.stock === 0; }
  function findCoupon(code) {
    const c = String(code||'').trim().toUpperCase();
    if(!c) return null;
    return getCoupons().find(x=>String(x.code||'').toUpperCase() === c) || null;
  }
  function couponUsable(coupon, subtotal) {
    if(!coupon) return { ok:false, msg:'Invalid promo code.' };
    if(coupon.active === false) return { ok:false, msg:'This promo code is no longer active.' };
    if(coupon.expires && new Date(coupon.expires) < new Date()) return { ok:false, msg:'This promo code has expired.' };
    if(coupon.maxUses && (coupon.used||0) >= coupon.maxUses) return { ok:false, msg:'This promo code has reached its usage limit.' };
    const min = Number(coupon.minSpend) || 0;
    if(Number(subtotal) < min) return { ok:false, msg:`Minimum spend ${formatPrice(min)} for this code.` };
    return { ok:true, msg:`Promo ${String(coupon.code).toUpperCase()} applied.` };
  }
  function couponDiscount(coupon, subtotal) {
    if(!coupon) return 0;
    const sub = Number(subtotal) || 0;
    let value = coupon.type === 'percent' ? Math.round(sub * (Number(coupon.value)||0) / 100) : Math.round(Number(coupon.value)||0);
    if(coupon.maxDiscount) value = Math.min(value, Number(coupon.maxDiscount));
    return Math.min(value, sub);
  }
  function redeemablePoints(member) {
    if(!member) return 0;
    return Math.floor(member.points / REDEEM_POINTS) * REDEEM_POINTS;
  }
  function earnPointsOnOrder(phone, name, total){
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
  function decrementStock(items){
    let changed = false;
    const next = menu.map(m => {
      if(m.stock === undefined || m.stock === null) return m;
      const line = items.find(i => i.id === m.id);
      if(!line) return m;
      const left = Number(m.stock) - Number(line.qty);
      changed = true;
      return { ...m, stock: Math.max(0, left), soldOut: left <= 0 ? true : m.soldOut };
    });
    if(changed){ menu = next; saveMenu(next); lastMenuJSON = JSON.stringify(next); }
  }
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
      const out = isSoldOut(item);
      const low = !out && item.stock > 0 && item.stock <= 5;
      const card = document.createElement('article');
      card.className = 'card' + (out ? ' card-out' : '');
      card.innerHTML = `
        <div class="card-img">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          ${item.badge ? `<span class="badge">${escapeText(item.badge)}</span>` : ''}
          ${out ? `<span class="soldout-tag">Sold out</span>` : low ? `<span class="stock-tag">Only ${item.stock} left</span>` : ''}
          <button class="heart-btn" data-fav="${item.id}" aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.6); border:none; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.1rem; color:${fav ? '#ef4444' : '#fff'}; transition:color 0.2s">${fav ? '♥' : '♡'}</button>
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3>${escapeText(item.name)}</h3>
            <span class="price">${formatPrice(item.price)}</span>
          </div>
          <p class="card-desc">${escapeText(item.desc)}</p>
          <div class="card-foot">
            <div class="qty-ctrl">
              <button aria-label="Decrease quantity" data-dec="${item.id}" ${out?'disabled':''}>−</button>
              <span data-qty="${item.id}">${qty}</span>
              <button aria-label="Increase quantity" data-inc="${item.id}" ${out?'disabled':''}>+</button>
            </div>
            <button class="btn btn-primary add-btn" data-add="${item.id}" ${out?'disabled':''}>${out ? 'Sold out' : 'Add • ' + formatPrice(item.price * qty)}</button>
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
  const cartDiscountEl = $('#cart-discount');
  const cartZoneHint = $('#cart-zone-hint');
  const cartFreeHint = $('#cart-free-hint');
  const cartTotalEl = $('#cart-total');
  const checkoutTotalEl = $('#checkout-total');
  const modalTotalEl = $('#modal-total');

  function cartTotals(phone){
    const subtotal = cart.reduce((s, c) => { const m = menu.find(x => x.id === c.id); return s + (m ? m.price * c.qty : 0); }, 0);
    const isDelivery = document.querySelector('input[name="order-type"]:checked')?.value === 'delivery';
    const meta = getCartMeta();
    const zones = getZones().filter(z => z.active !== false);
    const zone = zones.find(z => z.id === meta.zone) || null;
    const zoneFee = zone ? Number(zone.fee) || 0 : DELIVERY_FEE;
    const zoneMin = zone ? Number(zone.min) || 0 : 0;
    const zoneFreeOver = zone ? (Number(zone.freeOver) || Number(zone.min) || 0) : FREE_DELIVERY_OVER;
    let deliveryFee = 0;
    if (isDelivery && subtotal > 0) deliveryFee = subtotal >= zoneFreeOver ? 0 : zoneFee;
    const coupon = meta.couponCode ? findCoupon(meta.couponCode) : null;
    const couponOk = coupon ? couponUsable(coupon, subtotal) : { ok:false };
    const discount = couponOk.ok ? couponDiscount(coupon, subtotal) : 0;
    const member = phone ? getMember(phone) : null;
    const maxRedeem = redeemablePoints(member);
    const pointsWanted = Number(meta.redeemPoints) || 0;
    const pointsUsed = meta.redeem && pointsWanted > 0 ? Math.min(pointsWanted, maxRedeem) : 0;
    const loyaltyDiscount = pointsUsed ? Math.min(Math.round(pointsUsed / REDEEM_POINTS * REDEEM_VALUE), Math.max(0, subtotal - discount)) : 0;
    const total = Math.max(0, subtotal - discount - loyaltyDiscount + deliveryFee);
    return {
      subtotal, discount, coupon, couponOk, deliveryFee, total, isDelivery,
      zone, zoneMin, zoneFee, zoneFreeOver,
      member, pointsUsed, loyaltyDiscount,
      minOrderOk: !isDelivery || subtotal >= zoneMin,
      remainingForFree: Math.max(0, zoneFreeOver - subtotal),
      remainingForMin: Math.max(0, zoneMin - subtotal)
    };
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
            <h4>${escapeText(m.name)}</h4>
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
    const t = cartTotals();
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(t.subtotal);
    if (cartDiscountEl) cartDiscountEl.parentElement.classList.toggle('hidden', !t.discount);
    if (cartDiscountEl) cartDiscountEl.textContent = '−' + formatPrice(t.discount);
    if (cartDeliveryEl) cartDeliveryEl.textContent = !t.isDelivery ? 'Pickup — free' : t.deliveryFee === 0 ? 'Free' : formatPrice(t.deliveryFee);
    if (cartZoneHint) cartZoneHint.textContent = t.zone ? `${t.zone.name} • fee ${formatPrice(t.zoneFee)} • min ${formatPrice(t.zoneMin)}` : '';
    if (cartZoneHint) cartZoneHint.classList.toggle('hidden', !t.isDelivery || !t.zone);
    if (cartFreeHint) {
      if (t.isDelivery && t.remainingForFree > 0) { cartFreeHint.textContent = `Add ${formatPrice(t.remainingForFree)} more for free delivery`; cartFreeHint.classList.remove('hidden'); }
      else cartFreeHint.classList.add('hidden');
    }
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(t.total);
    if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(t.total);
    if (modalTotalEl) modalTotalEl.textContent = formatPrice(t.total);
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
    const wrap = $('#zone-wrap');
    if (wrap) { if (isDelivery) { wrap.classList.remove('hidden'); if (zoneSelect) renderZoneOptions(); } else wrap.classList.add('hidden'); }
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
  const cartPromoInput = $('#cart-promo-code'), cartPromoApply = $('#cart-promo-apply'), cartPromoStatus = $('#cart-promo-status');
  const checkoutPhoneEl = $('#checkout-phone');

  function renderCheckoutSummary(phone) {
    const summary = $('#checkout-summary'); if (!summary) return;
    if (cart.length===0) { summary.innerHTML = '<div class="muted">Cart empty</div>'; return; }
    const t = cartTotals(phone);
    const rows = cart.map(c=>{
      const m=menu.find(x=>x.id===c.id); return `<div><span>${m.name} × ${c.qty}</span><span>${formatPrice(m.price*c.qty)}</span></div>`;
    }).join('');
    const discountRow = t.discount ? `<div><span>Promo ${escapeText(String(t.coupon.code).toUpperCase())}</span><span>−${formatPrice(t.discount)}</span></div>` : '';
    const loyaltyRow = t.loyaltyDiscount ? `<div><span>Loyalty (${t.pointsUsed} pts)</span><span>−${formatPrice(t.loyaltyDiscount)}</span></div>` : '';
    const deliveryLabel = t.isDelivery ? `Delivery${t.zone ? ' — ' + t.zone.name : ''}` : 'Pickup';
    const deliveryValue = !t.isDelivery ? 'Free' : t.deliveryFee === 0 ? 'Free' : formatPrice(t.deliveryFee);
    summary.innerHTML = rows
      + `<div style="border-top:1px dashed var(--border); padding-top:0.4rem; margin-top:0.3rem"><span>Subtotal</span><span>${formatPrice(t.subtotal)}</span></div>`
      + discountRow + loyaltyRow
      + `<div><span>${deliveryLabel}</span><span>${deliveryValue}</span></div>`
      + `<div style="font-weight:800; border-top:1px solid var(--border); padding-top:0.4rem"><span>Total</span><span>${formatPrice(t.total)}</span></div>`
      + (t.isDelivery && !t.minOrderOk ? `<div class="small" style="color:#ef4444">Min order for this zone is ${formatPrice(t.zoneMin)} — add ${formatPrice(t.remainingForMin)} more.</div>` : '');
  }
  function escapeText(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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

  const promoInput = $('#promo-code'), promoApply = $('#promo-apply'), promoStatus = $('#promo-status');
  function applyPromo(){
    if(!promoInput) return;
    const code = promoInput.value.trim();
    const status = promoStatus || cartPromoStatus;
    if(!code){
      const m = getCartMeta(); delete m.couponCode; saveCartMeta(m);
      if(status) status.textContent = 'Promo removed';
      saveCart(); renderCheckoutSummary(checkoutPhoneEl ? checkoutPhoneEl.value.trim() : '');
      return;
    }
    const coupon = findCoupon(code);
    const meta = getCartMeta();
    const rawSub = cart.reduce((s, c) => { const m = menu.find(x => x.id === c.id); return s + (m ? m.price * c.qty : 0); }, 0);
    const res = couponUsable(coupon, rawSub);
    if(res.ok){ meta.couponCode = String(coupon.code).toUpperCase(); saveCartMeta(meta); }
    else { delete meta.couponCode; saveCartMeta(meta); }
    if(status) status.textContent = res.msg;
    saveCart(); renderCheckoutSummary(checkoutPhoneEl ? checkoutPhoneEl.value.trim() : '');
  }
  if (promoApply) promoApply.addEventListener('click', applyPromo);
  if (promoInput) promoInput.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); applyPromo(); } });
  if (cartPromoApply) cartPromoApply.addEventListener('click', applyPromo);
  if (cartPromoInput) cartPromoInput.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); applyPromo(); } });

  const zoneSelect = $('#delivery-zone'), zoneHint = $('#zone-hint'), zoneWrap = $('#zone-wrap');
  function renderZoneOptions(){
    if(!zoneSelect) return;
    const zones = getZones().filter(z => z.active !== false);
    const current = getCartMeta().zone || '';
    zoneSelect.innerHTML = '<option value="">Choose your zone…</option>'
      + zones.map(z=>`<option value="${escapeText(z.id)}" ${z.id===current?'selected':''}>${escapeText(z.name)} — ${formatPrice(z.fee)} (min ${formatPrice(z.min)})</option>`).join('');
  }
  if (zoneSelect) {
    renderZoneOptions();
    zoneSelect.addEventListener('change', () => {
      const m = getCartMeta();
      if(zoneSelect.value) m.zone = zoneSelect.value; else delete m.zone;
      saveCartMeta(m);
      saveCart(); renderCheckoutSummary(checkoutPhoneEl ? checkoutPhoneEl.value.trim() : '');
    });
  }

  const loyaltyBox = $('#loyalty-box'), loyaltyInfo = $('#loyalty-info'), loyaltyToggle = $('#loyalty-redeem');
  function renderLoyalty(){
    if(!loyaltyBox) return;
    const phone = checkoutPhoneEl ? checkoutPhoneEl.value.trim() : '';
    const member = getMember(phone);
    if(!member){
      loyaltyBox.classList.add('hidden');
      return;
    }
    const redeemable = redeemablePoints(member);
    loyaltyBox.classList.remove('hidden');
    loyaltyInfo.textContent = `${member.name} — balance ${member.points} pts (${formatPrice(Math.floor(member.points/REDEEM_POINTS)*REDEEM_VALUE)} value)`;
    if(loyaltyToggle){
      loyaltyToggle.disabled = redeemable < REDEEM_POINTS;
      loyaltyToggle.parentElement.classList.toggle('hidden', redeemable < REDEEM_POINTS);
      if(redeemable < REDEEM_POINTS) loyaltyToggle.checked = false;
    }
    const m = getCartMeta();
    if(redeemable < REDEEM_POINTS) delete m.redeem;
    saveCartMeta(m);
    renderCheckoutSummary(phone);
  }
  if (loyaltyToggle) loyaltyToggle.addEventListener('change', () => {
    const m = getCartMeta();
    if(loyaltyToggle.checked){ m.redeem = true; m.redeemPoints = Math.min(Number(m.redeemPoints) || redeemablePoints(getMember(checkoutPhoneEl.value.trim())), redeemablePoints(getMember(checkoutPhoneEl.value.trim()))); }
    else delete m.redeem;
    if(!m.redeem) delete m.redeemPoints;
    saveCartMeta(m);
    renderCheckoutSummary(checkoutPhoneEl.value.trim());
  });
  if (checkoutPhoneEl) checkoutPhoneEl.addEventListener('input', renderLoyalty);
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
      const t = cartTotals(phone);
      const { subtotal, deliveryFee, total, isDelivery } = t;
      if(!name||!phone||!email){ checkoutStatus.textContent='Please enter name, phone, email.'; return; }
      if(isDelivery && !address){ checkoutStatus.textContent='Delivery address required for delivery.'; return; }
      if(isDelivery && !t.zone){ checkoutStatus.textContent='Please choose your delivery zone.'; return; }
      if(isDelivery && !t.minOrderOk){ checkoutStatus.textContent=`Minimum order for ${t.zone.name} is ${formatPrice(t.zoneMin)} — add ${formatPrice(t.remainingForMin)} more.`; return; }
      const soldOutItem = cart.map(c=>menu.find(x=>x.id===c.id)).find(m=>m && isSoldOut(m));
      if(soldOutItem){ checkoutStatus.textContent=`${soldOutItem.name} just sold out — please remove it from your cart.`; return; }
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
        discount: t.discount,
        couponCode: t.discount ? String(t.coupon.code).toUpperCase() : '',
        zone: isDelivery && t.zone ? t.zone.id : '',
        zoneName: isDelivery && t.zone ? t.zone.name : '',
        loyaltyPointsRedeemed: t.pointsUsed,
        loyaltyDiscount: t.loyaltyDiscount,
        orderType: isDelivery?'delivery':'pickup',
        paymentMethod: payMethod,
        paymentStatus: payMethod==='pickup'?'pending':'paid',
        status: 'pending',
        notes
      };
      const orders=getOrders(); orders.unshift(order); saveOrders(orders);
      if (t.pointsUsed) {
        const list = getLoyalty();
        const m = list.find(x=>x.phone === normalizePhone(phone));
        if(m){ m.points = Math.max(0, m.points - t.pointsUsed); m.redeemed += t.pointsUsed; saveLoyalty(list); }
      }
      let pointsEarned = 0;
      if (payMethod !== 'pickup') pointsEarned = earnPointsOnOrder(phone, name, total);
      decrementStock(order.items);
      if (t.discount && t.coupon) {
        const coupons = getCoupons();
        const c = coupons.find(x=>String(x.code).toUpperCase() === String(t.coupon.code).toUpperCase());
        if(c){ c.used = (c.used||0) + 1; localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons)); }
      }
      const cartMeta = getCartMeta();
      delete cartMeta.couponCode; delete cartMeta.redeem; delete cartMeta.redeemPoints;
      saveCartMeta(cartMeta);
      checkoutStatus.textContent=`Order ${orderId} placed! Total ${formatPrice(total)} — ${isDelivery?'Delivery 35-50 min':'Pickup 15 min'}.${pointsEarned ? ` +${pointsEarned} loyalty pts` : ''}`;
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
