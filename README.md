# Black Coffin — Coffee Shop (HTML/CSS/JS only)

No build, no npm, no npx. Double-click to run.

## Run
Just open `index.html` in a browser.
- Site: `index.html` (Home) → `pages/menu.html` → `pages/story.html` → `pages/visit.html`
- Staff / Manager / Admin: `admin/login.html` (or `admin.html`) → pick role + password → Dashboard / Menu / Orders / Inbox / Settings

Works offline via `file://`. All data in `localStorage` (`bc-menu`, `bc-orders`, `bc-messages`, `bc-newsletter`).

## Users
| User | Login | Can do |
| --- | --- | --- |
| Customer (public) | none — open `index.html` | Browse menu, add to cart, checkout, contact form, newsletter |
| Staff | `admin/login.html` → Staff / `staff123` | Staff dashboard: order queue + full order details, update order status, read inbox, read-only menu |
| Manager | `admin/login.html` → Manager / `manager123` | Manager dashboard: revenue + reports, edit/delete menu items, delete orders, inbox tools, exports |
| Admin | `admin/login.html` → Admin / `coffin123` | Full dashboard + Settings (admin-only nav item), clear all data, password list |

Each role gets its own dashboard heading and controls:
- **Staff** — no revenue card, no seed/export/delete buttons, no Settings link, menu page is read-only, 60 min idle session.
- **Manager** — everything staff can (120 min idle session), plus menu editing, delete orders, inbox tools, exports. No Settings.
- **Admin** — full access (240 min idle session) including Settings, account management and destructive data tools.

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
│   └── visit.html          # Hours, map, contact + newsletter
├── assets/
│   ├── css/style.css       # Gothic theme (all site + admin)
│   └── js/script.js        # Menu/cart/checkout/storage sync
├── admin/
│   ├── index.html          # Role dashboard (Staff / Manager / Admin)
│   ├── menu.html           # Menu manager (read-only for staff)
│   ├── orders.html
│   ├── inbox.html
│   ├── settings.html       # Admin only — accounts, limits, data tools
│   ├── login.html          # Role + password login
│   └── admin.js            # Shared admin logic, roles + permissions (static only)
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
