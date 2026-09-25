# Black Coffin — Coffee Shop (HTML/CSS/JS only)

No build, no npm, no npx. Double-click to run.

## Run
Just open `index.html` in a browser.
- Site: `index.html` (Home) → `pages/menu.html` → `pages/story.html` → `pages/visit.html`
- Admin: `admin/index.html` or `admin.html` → login `coffin123` → Menu / Orders / Inbox / Settings

Works offline via `file://`. All data in `localStorage` (`bc-menu`, `bc-orders`, `bc-messages`, `bc-newsletter`).

## Structure
```
/
├── index.html              # Home (hero, features, teasers)
├── pages/
│   ├── menu.html           # Full menu + cart + order history
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
Edit in `admin/menu.html`: name/price/category/badge/desc/image, ↑/↓ to reorder, Dup, Del, Add/Save, Reset, Export JSON.

Changes sync to site via `localStorage` polling (800ms) + `storage`/`visibilitychange` events. Keep site and admin in same browser profile.

## Payments
Mock only: Pay on pickup / Card `4242 4242 4242 4242` / Stripe mock. No backend.
