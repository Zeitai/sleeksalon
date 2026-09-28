# The Sleek — Salon Menu App

> **v2 — gold/black glassmorphism redesign.** Frosted-glass cards and bars over
> a deep black field, tuned for tablet and phone touch targets, plus two new
> tabs (**My Bookings**, **Our Story**) and a quiet "Powered by Avate Labs"
> credit in the footer. See "What changed in this redesign" near the bottom.

A tablet-friendly digital menu for **The Sleek**. Customers (or staff) tap through
services, build a ticket, and save it against a client's name — all stored
locally on the tablet, no backend or account needed.

No build step. It's plain HTML/CSS/JS, so it deploys to Vercel as-is and works
completely offline once loaded.

## What's included

| File | Purpose |
|---|---|
| `index.html` | App shell — header, hero, tabs, menu grid, ticket drawer, history & settings views |
| `styles.css` | All visual styling (dark/gold theme) |
| `app.js` | All app logic — rendering, cart, saving tickets, history, CSV export |
| `data.js` | **The menu itself.** Every service, section and price lives here |
| `manifest.json` + `sw.js` | Makes the app installable ("Add to Home Screen") and usable offline |
| `icons/` | App icon (placeholder gold "S" monogram — swap for a real logo anytime) |

## How it works

- **Menu tabs**: Men / Women / Common, matching the printed price list.
- **Add to ticket**: tapping "Add" (or a price, for services like Waxing that
  have Normal/Chocolate/Rica options) adds that service to the current ticket.
- **Ticket drawer**: shows everything added, lets staff adjust quantities,
  enter the client's name and phone, and **Save ticket**.
- **Saved tickets live in `localStorage`** on that specific tablet/browser —
  nothing leaves the device. The History tab lists every saved ticket with
  a running total for "today" and all-time, plus reorder/delete actions.
- **Settings tab** lets staff export everything to a CSV file (opens fine in
  Excel/Google Sheets) or wipe all saved tickets.

Because everything is local, each tablet keeps its own ticket history. If you
later want tickets to sync across multiple devices or to a phone/back office,
that needs a small backend (e.g. a database) — happy to help with that next
step when you're ready.

## What changed in this redesign

- **Theme**: rebuilt every surface (cards, top bar, tabs, drawer, nav) as
  frosted glass — translucent panels with blur, sitting over a fixed
  gold-glow black background — instead of flat dark cards.
- **My Bookings**: the old "History" tab, renamed to be customer-friendly,
  now also has a search box so staff can find a booking by client name or
  phone instantly.
- **Our Story**: a new tab telling the salon's story — intro, milestones,
  values. All of its copy lives in the `STORY` object at the bottom of
  `data.js`, so it's editable the same way the menu is.
- **Studio credit**: a quiet "© The Sleek · Powered by Avate Labs" line now
  sits in the footer of the menu, My Bookings, Our Story and Settings pages.
  The name/link come from `STUDIO_CREDIT` in `data.js` — change or remove it
  there.
- **Tablet & phone tuning**: bigger tap targets (44px minimum), a 3-column
  grid on tablets, a 1–2 column grid on phones, an icon-only bottom nav on
  very narrow screens, and safe-area padding for notches/home indicators.

## Seasonal offers from Google Sheets (auto-updating)

1. Create a Google Sheet and import `offers-template.csv` (File → Import). Columns:
   Title, Description, Price, Original Price, Badge, Valid Till, Show.
2. Share it: **Share → Anyone with the link → Viewer**
   (or File → Share → Publish to web → CSV).
3. Paste the sheet link into `OFFERS_CONFIG.sheetCsvUrl` in `data.js`, redeploy once.
4. From then on the owner only edits the sheet. Rows with `Show` = no, or a past
   `Valid Till` date, disappear automatically. If no offers are live, the section hides.

Preview the design without a sheet: open the site with `?demo=offers`.

## Folder layout

`icons/` (app icons), `images/` (review QR; optional `story-salon.jpg` for the Our Story tab),
`api/notify.js` (Telegram booking alert; needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID on Vercel).

## Editing the menu / prices

Everything the salon will actually want to change lives in **`data.js`**.
Each service is one line:

```js
{ name: "Hair Cut", price: 100 },
```

Sections with size/price variants (like Waxing, which has Normal/Chocolate/Rica
prices) look like this instead:

```js
{ name: "Full Hand", prices: [250, 350, 600] }, // matches the "variants" list above
```

Add, remove, rename, or re-price anything there — the app updates automatically.
The salon name and tagline are at the very bottom of the same file, under `SALON`.

## Running it locally

No install needed. From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

## Deploying to Vercel

1. Push this folder to a GitHub repo (or drag-and-drop the folder into the
   Vercel dashboard's "Add New Project" → "Deploy" screen).
2. Framework preset: choose **"Other"** (it's a static site, no build command
   needed, no output directory to set — the project root is the output).
3. Deploy. Vercel gives you a `https://your-project.vercel.app` URL.

That's it — no environment variables, no database, no server code.

## Installing on the salon's devices

**iPad (Safari):**
1. Open the Vercel URL in Safari.
2. Tap the Share icon → **Add to Home Screen**.
3. It now opens full-screen like a normal app, with the gold "S" icon.

**Android tablet/phone (Chrome):**
1. Open the Vercel URL in Chrome.
2. Tap the menu (⋮) → **Install app** (or "Add to Home screen").
3. Same result — a standalone app icon, no browser chrome.

Both install methods use the included `manifest.json`; nothing extra to build
or submit to an app store.

## Notes & good next steps

- **Backups**: since ticket history lives in the browser, occasionally use
  Settings → Export CSV as a backup, especially before clearing the tablet's
  browser data.
- **Multiple tablets**: right now each tablet has its own separate history.
  If the salon wants one shared client/order list across devices, that's a
  natural next step (needs a small cloud database instead of localStorage).
- **Real photos**: the app currently uses typography and line art rather than
  stock photos, to keep it authentically "The Sleek" rather than generic.
  Swap in real salon/service photos anytime — happy to help wire that up.
