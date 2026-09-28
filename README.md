# mobstra-choose-cards

Hero screen "the Mobile Content Provider" (ABC Mobile) with phone cards. Vite + Preact, no runtime deps beyond Preact.

```bash
bun install
bun run dev       # http://localhost:5173
bun run build     # tsc -b + vite build → dist/ and dist-zip/dist.zip
bun run preview   # serves dist/ on http://localhost:4173
bun test          # validator tests (src/*.test.ts)
```

## Runtime config

Everything that changes per offer is read at runtime from one `<script>` in `index.html` (also present in
`dist/index.html`): `window.CARDS`, `window.TEXTS` and `window.CONTACT_FORM_ACTION`. Edit them directly in
`dist/index.html`, no rebuild needed. A broken `CARDS` or `TEXTS` shows an error notice on the page instead of
the lander.

## Cards payload

```html
<script>
    window.CARDS = [
        { title: 'SkyRead', image: 'phone-sky.webp', href: '{offer}&offer_id=1' },
        { title: 'BrainUp', image: 'phone-brain.webp', href: '{offer}&offer_id=2' }
    ];
</script>
```

- `title` — aria-label and image alt; `image` — path relative to `index.html` (put files in `public/`); `href` — link target, Keitaro macros like `{offer}` are passed through untouched.
- Invalid items are skipped with a console warning; a non-array or an empty result shows the error notice.

## Texts

Every other text on the page comes from `window.TEXTS` (see `index.html` for the block with the current values):

```js
window.TEXTS = {
    logo: { src, alt, href, width, height }, // width/height = intrinsic image size, keep in sync with src
    nav: [{ label, href }],                  // href must be an in-page anchor like '#about'
    menuLabel, toTopLabel,                   // aria-labels of the hamburger and the "to top" button
    hero: { title, subtitle },
    contact: { eyebrow, title, lead },
    form: { placeholders: { name, email, question }, submit, sending, errors: { required, email } },
    footer: { company, reg, address, phoneLabel, phone, since, brand, rights },
    messages: { MF000, MF255, ... }          // snackbar texts by rd-mailform result code
};
```

- Every key is required and strings must be non-empty. `logo.width`, `logo.height` and `footer.since` are
  positive integers, `nav` is a non-empty array, `messages` must contain at least `MF000` (success) and `MF255`
  (generic error); other `MFxxx` codes are optional.
- A missing or invalid key shows the error notice naming it, e.g. `window.TEXTS.footer.phone is missing`.
  Validation is strict on purpose: there are no default texts in the bundle.
- Punctuation glue stays in the code: `©`, the dash before the current year, the dot before `rights`, `tel:`.
- Deployments made before `window.TEXTS` existed have no such block: replacing only `assets/app.js` on them
  shows the error notice until the block is added to their `index.html`.

## Contact form

`window.CONTACT_FORM_ACTION` (same `<script>` in `index.html`) is the endpoint the footer form POSTs to as
form-data (`name`, `email`, `question`, `form-type=contact`). Rules:

- `''` (default) — nothing is sent; after validation the form shows `messages.MF000` and clears.
- Any 2xx response — success, unless the body is an `MFxxx` code from the original `rd-mailform.php`
  (`MF000` = success, other codes are shown as errors via `messages`). Non-2xx or network failure — `messages.MF255`.

## Header behaviour

Ported from the original RD Navbar: below 1200px a fixed 56px bar with a hamburger and a 270px off-canvas
drawer (closes on a click outside, stays open after a link click — as in the original); at 1200px and above a
static bar that sticks to the top as soon as the page is scrolled. Anchor links scroll smoothly (400ms) and the
current section is highlighted.

## Images

`public/` holds WebP only (phones ~64 KB each at q85 with alpha, logo 7 KB lossless at 600px).
To regenerate from new PNGs: `scripts/optimize-images.sh <dir-with-pngs>` (needs `brew install webp`).
