# Black Coffin — Coffee Shop (HTML/CSS/JS only)

No build, no npm, no npx. Double-click to run.

## Run
Just open `index.html` in a browser.
- Site: `index.html` (Home) → `pages/menu.html` → `pages/story.html` → `pages/visit.html`
- Staff / Manager / Admin: `admin/login.html` (or `admin.html`) → pick role + password → Dashboard / Menu / Orders / Inbox / Settings

Works offline via `file://`. No server, no install, no build step.

## Shop details
- 13 Raven Alley, Colombo 03 — phone `+94 11 234 5678`
- Open daily 07:00–23:00 (Fri–Sat to 01:00)
- Delivery fee Rs 450, free over Rs 3,500
- Menu prices LKR 500–900

## Data (localStorage)
| Key | Used for |
| --- | --- |
| `bc-menu` | Menu items (name, price in LKR, category, badge, description, image) |
| `bc-cart` | Customer cart |
| `bc-orders` | Orders — visible only in the staff/manager/admin panel |
| `bc-messages` | Contact form messages |
| `bc-newsletter` | Newsletter emails |
| `bc-admin-users` | Role accounts: password, enabled flag, session limit |
| `bc-admin-locks` | Failed-login counters and lock expiry per role |

Session state (`bc-admin`, `bc-admin-login`, `bc-admin-last`) lives in `sessionStorage` and is cleared when the browser tab closes.

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
│   ├── orders.html         # Order details, status updates (delete = manager+)
│   ├── inbox.html          # Contact messages + newsletter (staff read-only)
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
Mock only: Pay on pickup / Card `4242 4242 4242 4242` / Stripe mock. No backend, no real charge.

## Troubleshooting
- **Old prices still showing as USD-style** → admin Menu Manager → *Reset to default*, then reload the site tab.
- **Menu edits not appearing on site** → site and admin must run in the same browser profile; the site polls `bc-menu` every 800 ms.
- **Locked out of login** → wait 10 minutes, or sign in as admin and use *Clear all login locks* in Settings.
- **"Session expired" loop** → the idle limit for your role is shorter than the break; sign in again to reset it.
- **Fonts/images look wrong offline** → Google Fonts and Unsplash need internet; the rest of the site works offline.

## Font
Main site uses **IM Fell English** (medieval Roman italic), scoped by `body.site-font` in `assets/css/style.css`. Admin keeps Inter/Cinzel. To change it, edit `--font-site` in `assets/css/style.css`.
