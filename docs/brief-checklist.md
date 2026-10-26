# Coursework brief checklist

A map from each brief requirement to the exact file and section that satisfies it. Read
this first, then open the named file at the named line/selector to verify.

## Minimum two pages

Four HTML pages, all cross-linked from the same navbar and footer:

- `index.html` — Overview / home
- `features.html` — Features
- `specs.html` — Specs
- `buy.html` — Buy

## Promotes a product / product description / product information

- `index.html` lines 39–62 — hero headline "Crusher 1080 ANC / No compromise." (`h1.type-display`),
  sub-copy, and the "Not the same price." comparison section (lines 64–86) that argues the
  product's value against rivals.
- `features.html` — full feature breakdown: Crusher Bass haptic levels (accordion, lines 53–105),
  Bose audio systems (three `.card` blocks, lines 113–147), and an "Everyday" section (lines
  152–170).
- `specs.html` lines 46–101 — full spec table (driver size, frequency response, ANC, Bluetooth,
  codecs, battery life, fast charge, weight, connectors, price) plus an exploded/teardown view
  (lines 103–132).
- `buy.html` lines 39–63 — restates the product and price, and the colourway picker (lines
  53–67, now inside the order form) at the point of purchase.

## Attractive visual

- `css/theme.css` — design tokens (`:root`, lines 1–23: ink/carbon/graphite/sand palette,
  Archivo/Instrument Sans/IBM Plex Mono type stack) and all Bootstrap overrides that give the
  site its dark, single-accent look.
- `css/pages.css` — page-specific layout: hero grid, teaser cards, price strip, colourway
  plates, callout styling for the teardown scrub.
- Product photography: `assets/hero-product-1600.webp` / `hero-product-1000.webp`
  (`index.html`, `buy.html`), `assets/exploded-poster.webp` and the 121-frame
  `assets/teardown/frame-*.webp` sequence (`specs.html`) crushed to true black so the
  renders composite seamlessly against the page's `#000000` background.

## Buttons

- `.btn-sand` (filled, primary): navbar "Buy — $279.99" on every page; index.html hero CTA and
  price-strip "Buy now" (lines 50, 123); `buy.html` "Place order" (line 107).
- `.btn-ghost` (outline, secondary): index.html hero "Explore features" (line 51).
- Both variants defined in `css/theme.css` lines 98–121, including hover/focus states.

## HTML

Four semantic pages under the repo root (`index.html`, `features.html`, `specs.html`,
`buy.html`), each with a `<header>`/`<nav>`, one `<main>`, and a shared `<footer>`. Uses
semantic headings (`h1`–`h3`), a `<table>` with `<th scope="row">` row headers and a `<caption>`
for specs, a native `<form>` with real `<label>`s for the order form, and `role="radiogroup"`
for the colourway picker (`buy.html` line 55, inside the order form).

## CSS

- `css/theme.css` — shared design tokens and every Bootstrap component override (navbar,
  buttons, accordion, form controls, table, focus rings, link colour).
- `css/pages.css` — per-page layout rules (hero grid, teaser cards, teardown stage/callouts,
  colourway plates, form validation states).
- `vendor/fonts/fonts.css` — vendored `@font-face` declarations (Archivo variable, Instrument
  Sans variable, IBM Plex Mono weight 500 only).

## JavaScript

- `js/nav.js` — shared navbar behaviour (active-link highlighting) used by all four pages.
- `js/teardown.js` — drives the scroll-scrubbed 121-frame canvas teardown on `specs.html`,
  swapping the static poster image for a `<canvas>` that scrubs through frames as the user
  scrolls, with the poster left as a working no-JS fallback.
- `js/form.js` — client-side validation wiring for `buy.html`'s order form (Bootstrap's
  `needs-validation` pattern, custom submit handling, on-screen order confirmation).
- Bootstrap's own bundled JS (`vendor/bootstrap/bootstrap.bundle.min.js`) powers the navbar
  collapse/toggler and the features-page accordion.

## Bootstrap

Vendored locally at `vendor/bootstrap/` (`bootstrap.min.css` + `bootstrap.bundle.min.js`), no
CDN, no build step. Components used, and where:

- **Navbar** (`navbar navbar-expand-lg fixed-top`, collapse + toggler) — header of all four
  pages.
- **Grid** (`container-xxl`, `row`/`col-lg-*`) — hero layouts, footer columns, feature cards,
  order form layout.
- **Accordion** — `features.html` Crusher Bass haptic-level breakdown (lines 53–105).
- **Cards** — `features.html` Bose audio system trio (lines 113–147).
- **Table** + `.table-responsive` — `specs.html` spec sheet (lines 46–101), scrolls inside its
  own container rather than widening the page at narrow widths.
- **Forms** (`form-control`, `form-select`, `needs-validation`/`was-validated`,
  `invalid-feedback`) — `buy.html` order form, with Bootstrap's built-in client-side
  validation states.
- **Buttons** (`btn`, custom `btn-sand`/`btn-ghost` variants built on Bootstrap's button base).
- All components are re-skinned through CSS custom properties and targeted overrides in
  `css/theme.css` rather than replaced, so Bootstrap's structure and behaviour (collapse,
  validation, focus handling) still does the work.

## Header / Navbar

Identical `<header>`/`<nav class="navbar navbar-expand-lg fixed-top">` block on every page
(e.g. `index.html` lines 15–36): logo/home link, Overview/Features/Specs links, and a
sand-filled "Buy — $279.99" CTA. Collapses to a hamburger toggler below 992px
(`navbar-expand-lg`), with `aria-expanded` kept in sync by Bootstrap's collapse JS.

## Footer

Identical `<footer class="section">` on every page (e.g. `index.html` lines 129+): logo,
one-line product blurb, a "Product" link column repeating the site nav, a "Coursework notice"
disclaimer column, and a copyright line naming the tech stack.

## Price

"$279.99" appears verbatim in: `index.html` (hero CTA and price strip), `features.html` (nav
CTA), `specs.html` (nav CTA and spec table "Price" row), and `buy.html` (headline price display,
nav CTA, and page `<title>`/meta description).
