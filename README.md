# mobstra-choose-cards

Hero screen "the Mobile Content Provider" (ABC Mobile) with phone cards. Vite + Preact, no runtime deps beyond Preact.

```bash
bun install
bun run dev       # http://localhost:5173
bun run build     # tsc -b + vite build → dist/ and dist-zip/dist.zip
bun run preview   # serves dist/ on http://localhost:4173
```

## Cards payload

Cards are read at runtime from `window.CARDS` in `index.html` (also present in `dist/index.html`):

```html
<script>
    window.CARDS = [
        { title: 'SkyRead', image: 'phone-sky.webp', href: '{offer}&offer_id=1' },
        { title: 'BrainUp', image: 'phone-brain.webp', href: '{offer}&offer_id=2' }
    ];
</script>
```

- `title` — aria-label and image alt; `image` — path relative to `index.html` (put files in `public/`); `href` — link target, Keitaro macros like `{offer}` are passed through untouched.
- Edit the array directly in `dist/index.html`, no rebuild needed. Invalid items are skipped with a console warning; a broken array shows an error notice on the page.
- Page texts (title, subtitle, nav, logo, footer, form labels) live in `src/content.ts`.

## Contact form

`window.CONTACT_FORM_ACTION` (same `<script>` in `index.html`) is the endpoint the footer form POSTs to as
form-data (`name`, `email`, `question`, `form-type=contact`). Rules:

- `''` (default) — nothing is sent; after validation the form shows "Successfully sent!" and clears.
- Any 2xx response — success, unless the body is an `MFxxx` code from the original `rd-mailform.php`
  (`MF000` = success, others are shown as errors). Non-2xx or network failure — "Aw, snap! Something went wrong."

## Header behaviour

Ported from the original RD Navbar: below 1200px a fixed 56px bar with a hamburger and a 270px off-canvas
drawer (closes on a click outside, stays open after a link click — as in the original); at 1200px and above a
static bar that sticks to the top as soon as the page is scrolled. Anchor links scroll smoothly (400ms) and the
current section is highlighted.

## Images

`public/` holds WebP only (phones ~64 KB each at q85 with alpha, logo 7 KB lossless at 600px).
To regenerate from new PNGs: `scripts/optimize-images.sh <dir-with-pngs>` (needs `brew install webp`).
