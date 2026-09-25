# Black Coffin — Coffee Shop (HTML/CSS/JS only)

No build, no npm, no npx. Double-click to run.

## Run
Just open `index.html` in a browser.
- Site: `index.html` (Home) → `pages/menu.html` → `pages/story.html` → `pages/visit.html` → `pages/track.html`
- Staff / Manager / Admin: `admin/login.html` (or `admin.html`) → pick role + password → Dashboard / Board / Orders / Menu / Inbox / Reservations / Coupons / Reports / Settings

Works offline via `file://`. No server, no install, no build step.

## Shop details
- 13 Raven Alley, Colombo 03 — phone `+94 11 234 5678`
- Open daily 07:00–23:00 (Fri–Sat to 01:00)
- Delivery per Colombo zone (Rs 400–600, minimum Rs 1,500–2,500, free over Rs 3,000–4,000) — editable in Settings
- Menu prices LKR 500–900
- Loyalty: 1 point per Rs 100 on paid orders, 100 points = Rs 1,000 off
- Table reservations: 30-minute slots, 4 guests per slot

## Features
| Feature | Where |
| --- | --- |
| Cart + checkout | pickup/delivery, zone selection, promo code, loyalty redemption, mock card/Stripe |
| Order tracking | `pages/track.html` — order ID + last 4 phone digits, status only |
| Barista order board | `admin/board.html` — pending/preparing/ready columns, click to advance, live updates, new-order beep |
| Stock control | `admin/menu.html` — stock count per item, "Sell out" / "Restock" toggle, site greys out sold-out items |
| Promo codes | `admin/coupons.html` — % or Rs off, min spend, max discount, usage limit, expiry |
| Loyalty | dashboard member list with manual ±100 point adjust |
| Delivery zones | Settings → Delivery Zones (fee, min order, free-over, active) |
| Reservations | `pages/visit.html` booking form + `admin/reservations.html` confirm/decline |
| Reports | `admin/reports.html` — revenue, orders, AOV, discounts, revenue-by-day and top-item bars, status funnel, CSV export |
| Favourites | heart on each menu card, "Favorites" filter on the menu page |
| Search | Lunr.js fuzzy search on `pages/menu.html` |
| Print receipt | offered after checkout, prints a clean receipt |
| PWA | `manifest.json` + `sw.js` caches all pages for offline/install |
| Backup | Settings → Export/Import all data as JSON |

## Data (localStorage)
| Key | Used for |
| --- | --- |
| `bc-menu` | Menu items (name, price in LKR, category, badge, description, image, stock, sold-out flag) |
| `bc-cart` | Customer cart |
| `bc-cart-meta` | Applied promo code, selected delivery zone, loyalty redemption |
| `bc-orders` | Orders — visible only in the staff/manager/admin panel |
| `bc-messages` | Contact form messages |
| `bc-newsletter` | Newsletter emails |
| `bc-favorites` | Favourited menu item ids |
| `bc-coupons` | Promo codes and their usage counts |
| `bc-zones` | Delivery zones, fees and minimums |
| `bc-reservations` | Table reservations |
| `bc-loyalty` | Loyalty members, points earned/redeemed, lifetime spend |
| `bc-admin-users` | Role accounts: password, enabled flag, session limit |
| `bc-admin-locks` | Failed-login counters and lock expiry per role |
| `bc-board-sound` | Order board sound on/off preference |

Session state (`bc-admin`, `bc-admin-login`, `bc-admin-last`) lives in `sessionStorage` and is cleared when the browser tab closes.

## Users
| User | Login | Can do |
| --- | --- | --- |
| Customer (public) | none — open `index.html` | Browse menu, add to cart, checkout, contact form, newsletter |
| Staff | `admin/login.html` → Staff / `staff123` | Staff dashboard: order queue + full order details, update order status, read inbox, read-only menu |
| Manager | `admin/login.html` → Manager / `manager123` | Manager dashboard: revenue + reports, edit/delete menu items, delete orders, inbox tools, exports |
| Admin | `admin/login.html` → Admin / `coffin123` | Full dashboard + Settings (admin-only nav item), clear all data, password list |

Each role gets its own dashboard heading and controls:
- **Staff** — order queue + full order details, update order status, read inbox, read-only menu, order board, view reservations. No revenue, no deletes, no exports, no coupons, no reports, no loyalty, no Settings. 60 min idle session.
- **Manager** — everything staff can (120 min idle session), plus menu editing, delete orders, inbox tools, exports, promo codes, confirm/decline reservations, loyalty member list, reports. No Settings.
- **Admin** — full access (240 min idle session) including Settings, account management, delivery-zone rates and destructive data tools.

## Account access limits
| Limit | Rule |
| --- | --- |
| Login attempts | 5 wrong passwords → that role is locked for 10 minutes (admin can clear locks in Settings) |
| Session timeout | Auto-logout after idle time: staff 60 min, manager 120 min, admin 240 min → back to login with "Session expired" |
| Enable / disable | Admin can disable staff or manager; a disabled account cannot log in. Admin cannot be disabled |
| Own password | Staff / manager / admin can change their own password from Dashboard → "My account" (6+ characters) |
| Admin password reset | Settings → Account Access Limits: set or reset any role's password |

Accounts, passwords, enabled flags and session limits are stored in `localStorage 'bc-admin-users'`; login locks in `bc-admin-locks`; the signed-in role in `sessionStorage 'bc-admin'`. Defaults are in `DEFAULT_USERS` in `admin/admin.js` (passwords `staff123` / `manager123` / `coffin123`), permissions in `PERMISSIONS`. This is a static demo, not real security — a browser-only site cannot enforce access limits against a determined user.

## Order details (private)
Customers never see order lists or order details on the site. Only staff / manager / admin can check them, via the admin login → Orders. Customers can only confirm their own order ID at checkout and check it by phone (`+94 11 234 5678`) or at the counter.

## Locale
Prices in LKR (`Rs`), dates/times in `Asia/Colombo` (UTC+5:30, SLST) on both site and admin.

## Structure
```
/
├── index.html              # Home (hero, features, teasers)
├── pages/
│   ├── menu.html           # Full menu + cart (order details = staff only)
│   ├── story.html          # Brand story
│   ├── visit.html          # Hours, map, contact, delivery zones, reservations
│   └── track.html          # Track your order (order ID + last 4 phone digits)
├── assets/
│   ├── css/style.css       # Gothic theme (all site + admin)
│   └── js/script.js        # Menu/cart/checkout/coupons/loyalty/zones/storage sync
├── admin/
│   ├── index.html          # Role dashboard (Staff / Manager / Admin)
│   ├── board.html          # Barista order board (all roles)
│   ├── orders.html         # Order details, status updates (delete = manager+)
│   ├── menu.html           # Menu manager + stock/sold-out (read-only for staff)
│   ├── inbox.html          # Contact messages + newsletter (staff read-only)
│   ├── reservations.html   # Table bookings (confirm/decline = manager+)
│   ├── coupons.html        # Promo codes (manager+)
│   ├── reports.html        # Sales reports + CSV (manager+)
│   ├── settings.html       # Admin only — accounts, zones, data tools
│   ├── login.html          # Role + password login
│   └── admin.js            # Shared admin logic, roles + permissions (static only)
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (offline cache)
├── admin.html              # Redirect → admin/index.html
└── README.md
```

## Admin — Menu
Edit in `admin/menu.html`: name/price (LKR)/category/badge/desc/image, **stock count** and **sold out** flag, ↑/↓ to reorder, Dup, Sell out/Restock, Del, Add/Save, Reset, Export JSON. Stock is decremented automatically when an order is placed, and the site disables Add for sold-out items.

Changes sync to site via `localStorage` polling (800ms) + `storage`/`visibilitychange` events. Keep site and admin in same browser profile.

After changing prices to LKR, use **Reset to default** in the menu manager once so old USD-style prices are replaced.

## Security note
All user-entered text (order names, notes, messages, menu fields) is HTML-escaped before rendering with `escapeHtml()` in admin and `escapeText()` on the site, so a `<script>` or `onerror=` payload in a checkout field cannot execute in the staff panel.

Loyalty, coupons, reservations and stock are device-local (`localStorage`) and staff accounts are client-side only — this is a demo-grade shop front, not a production POS. Real enforcement needs a backend.

## Payments
Mock only: Pay on pickup / Card `4242 4242 4242 4242` / Stripe mock. No backend, no real charge.

## Troubleshooting
- **Old prices still showing as USD-style** → admin Menu Manager → *Reset to default*, then reload the site tab.
- **Menu edits not appearing on site** → site and admin must run in the same browser profile; the site polls `bc-menu` every 800 ms.
- **Promo code rejected** → check min spend, expiry, usage limit and whether the code is active in `admin/coupons.html`.
- **Loyalty box not showing** → points are keyed by phone number; enter the same phone used at checkout. You need 100 points to redeem.
- **Delivery checkout blocked** → pick a zone and meet that zone's minimum order; zones are set in Settings.
- **Order board not updating** → keep the board tab open and in the same browser profile; it refreshes every second.
- **Locked out of login** → wait 10 minutes, or sign in as admin and use *Clear all login locks* in Settings.
- **"Session expired" loop** → the idle limit for your role is shorter than the break; sign in again to reset it.
- **Backup/restore errors** → use Settings → Data Backup & Restore; the export contains all `bc-*` keys.
- **Fonts/images look wrong offline** → Google Fonts, Unsplash and Lunr need internet; the rest of the site works offline.

## Font
Main site uses **IM Fell English** (medieval Roman italic), scoped by `body.site-font` in `assets/css/style.css`. Admin keeps Inter/Cinzel. To change it, edit `--font-site` in `assets/css/style.css`.
