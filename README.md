# Black Coffin — Coffee Shop (HTML/CSS/JS only)

No build, no npm, no npx. Double-click to run.

## Run
Just open `index.html` in a browser.
- Site: `index.html` (Home) → `pages/menu.html` → `pages/story.html` → `pages/visit.html`
- Admin: `admin/index.html` or `admin.html` → login `coffin123` → Menu / Orders / Inbox / Settings

Works offline via `file://`. All data in `localStorage` (`bc-menu`, `bc-orders`, `bc-messages`, `bc-newsletter`).

## Users
| User | Login | Can do |
| --- | --- | --- |
| Customer (public) | none — open `index.html` | Browse menu, add to cart, checkout, contact form, newsletter |
| Staff / Manager / Admin | `admin/index.html` → password `coffin123` | View order details, update order status, manage menu, read inbox, export/clear data |

Password lives in `ADMIN_PASS` in `admin/admin.js`. Auth is a static demo check (`sessionStorage 'bc-admin'`), not real security.

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
│   └── visit.html          # Hours, map, contact + newsletter
├── assets/
│   ├── css/style.css       # Gothic theme (all site + admin)
│   └── js/script.js        # Menu/cart/checkout/storage sync
├── admin/
│   ├── index.html          # Dashboard
│   ├── menu.html           # Menu manager (add/remove/rename/move/change)
│   ├── orders.html
│   ├── inbox.html
│   ├── settings.html
│   ├── login.html
│   └── admin.js            # Shared admin logic (static only)
├── admin.html              # Redirect → admin/index.html
└── README.md
```

## Admin — Menu
Edit in `admin/menu.html`: name/price (LKR)/category/badge/desc/image, ↑/↓ to reorder, Dup, Del, Add/Save, Reset, Export JSON.

Changes sync to site via `localStorage` polling (800ms) + `storage`/`visibilitychange` events. Keep site and admin in same browser profile.

After changing prices to LKR, use **Reset to default** in the menu manager once so old USD-style prices are replaced.

## Payments
Mock only: Pay on pickup / Card `4242 4242 4242 4242` / Stripe mock. No backend.

## Font
Main site uses **IM Fell English** (medieval Roman italic), scoped by `body.site-font` in `assets/css/style.css`. Admin keeps Inter/Cinzel. To change it, edit `--font-site` in `assets/css/style.css`.
