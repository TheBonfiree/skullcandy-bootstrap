# Skullcandy Crusher 1080 ANC — Bootstrap Site

**Date:** 2026-09-13
**Status:** approved design, not yet implemented

## Purpose

A four-page marketing site for the Skullcandy Crusher 1080 ANC, built to satisfy a
coursework brief that an earlier project could not meet. The earlier project
(`F:\Brain\02-PROJECTS\Skullcandy Landing page`) is a single-page Vite + React 19 +
Tailwind v4 build. The brief requires plain HTML, CSS, JavaScript and Bootstrap, and a
minimum of two pages, so this is a fresh build rather than a port. The old project is
read-only source material and must not be modified.

### Brief requirements

The site must promote a product and include product information, attractive visuals and
buttons; it must use HTML, CSS, JavaScript and Bootstrap; and it must carry a header, a
navbar, a product description, features, a price and a footer, across at least two pages.

### Success criteria

- Every brief requirement above is present and easy for a grader to point at.
- The site opens by double-clicking `index.html` with no internet connection, no local
  server and no build step.
- Bootstrap's own components are visibly used, while the finished page does not read as a
  Bootstrap template.
- The teardown scroll interaction works without React.

## Non-goals

- No backend. The order form on `buy.html` validates and confirms on the client only.
- No build tooling, package manager, or Sass compilation.
- No e-commerce, cart, or persistence.
- No changes of any kind to the existing React project.

## Architecture

Static files served from disk. No framework, no bundler.

```
Skullcandy Bootstrap Site/
  index.html          hero, positioning, price teaser, primary CTA
  features.html       Crusher Bass, Sound by Bose, everyday use
  specs.html          specification table, teardown scrub, exploded callouts
  buy.html            price, variants, order form
  css/
    theme.css         design tokens and Bootstrap overrides
    pages.css         page-specific layout
  js/
    teardown.js       canvas scroll-scrub
    nav.js            active nav link, sticky header behaviour
    form.js           order form validation
  assets/             images copied from the React project
  vendor/
    bootstrap/        bootstrap.min.css, bootstrap.bundle.min.js
    fonts/            woff2 files and an @font-face stylesheet
  README.md
```

### Shared markup

Header, navbar and footer markup is hand-copied into all four pages rather than injected
by JavaScript. This was a deliberate choice: the duplication is small at four pages, the
submitted HTML reads honestly as static HTML, and navigation does not depend on scripting.
The cost is that a change to the navbar touches four files.

### Stylesheet load order

1. `vendor/bootstrap/bootstrap.min.css`
2. `vendor/fonts/fonts.css`
3. `css/theme.css`
4. `css/pages.css`

`theme.css` sets Bootstrap's own custom properties — `--bs-body-bg`, `--bs-body-color`,
`--bs-border-color`, `--bs-primary` and the link variables — so stock components inherit
the palette instead of being fought with overrides. Project-specific tokens
(`--color-ink`, `--color-carbon`, `--color-graphite`, `--color-ash`, `--color-sand`,
`--color-bone`) are defined in the same block and used by custom sections and by inline
SVG styles.

### Bootstrap components used

Navbar with collapse, grid, card, table, accordion, form controls with validation
classes, buttons, and offcanvas for the mobile menu. These are used as Bootstrap ships
them and then restyled through the variables above.

## Design rules carried over

These come from the React project's `CLAUDE.md` and were established against the actual
product renders. They are requirements, not preferences.

- **The base stays `#000000` exactly.** The source renders sit on pure black. Any
  gradient, glow, or tinted wash behind product imagery lets the opaque image frame paint
  over it and shows its bounding box as a visible rectangle. This was a real bug in the
  earlier build.
- **Any new asset must be crushed to luma 0** before shipping:
  `ffmpeg -i in -vf "lutyuv=y='if(lt(val,5),0,val)'" out`. The existing assets already
  satisfy this.
- **No second accent hue.** The palette is warm throughout because nothing in the product
  photography is cool. Interactive elements are separated by fill — a solid `sand` plate
  with `ink` text — never by a different colour. An earlier build used a saturated blue
  and it was removed.
- **Leader-line callouts, not numbered markers.** A hairline, a dot terminal, a mono
  label, lifted from the exploded render's own visual language. The callout content is not
  a sequence, so `01 / 02 / 03` markers would be decoration.
- **Type contrast is width, not serif versus sans.** Archivo at expanded widths for
  display, the narrower Instrument Sans for body, IBM Plex Mono for spec data and labels.
- **Focus rings use `bone`** so they stay visible both on ink and on a sand-filled
  control.

## Page contents

### index.html

Header and navbar; hero using `hero-product-1600.webp` with the headline "Crusher 1080
ANC / No compromise."; a short product description; a positioning section built around
"Not the same price."; a price teaser showing **$279.99**; and a primary call to action
linking to `buy.html`. Footer.

### features.html

Three feature sections carried over in substance from the React build:

- **Crusher Bass** — four haptic levels, described from off ("Standard tuning, nothing
  added underneath") through to full ("Full physical rumble through the cups and into your
  skull").
- **Sound by Bose** — Bose QuietControl, Bose TrueSpatial, and the Bose WaveForm Audio
  Engine, described as running on the Crusher's drivers rather than alongside them.
- **Everyday** — battery and charging claims: 60 hrs with ANC off, 50 hrs with ANC on, and
  10 minutes on the cable for 4 hours of playback.

The bass levels use a Bootstrap accordion; the Bose items use cards.

### specs.html

A full specification table using Bootstrap's table component, the teardown scroll-scrub,
and the exploded poster with leader-line callouts.

### buy.html

Price, colourway variants, and an order form using Bootstrap form controls and validation
styles. Submitting shows an inline confirmation; nothing is sent anywhere.

## Teardown scroll-scrub

`js/teardown.js` replaces the React implementation.

A tall section holds a sticky `<canvas>`. On load the script preloads all 121 frames from
`assets/teardown/frame-001.webp` through `frame-121.webp`, tracking how many have decoded.
A scroll listener, throttled through `requestAnimationFrame`, maps the section's scroll
progress to a frame index and draws that frame to the canvas, scaled to cover.

Degradation is explicit:

- The poster image `assets/exploded-poster.webp` is the markup's default state and the
  script creates and reveals the canvas over it. With JavaScript disabled, the poster is
  simply what stays visible.
- Under `prefers-reduced-motion: reduce`, the script draws the final frame once and skips
  the scroll listener entirely.
- Until preloading finishes, the poster image stays visible beneath the canvas.

## Assets

Copied from the React project's `public/assets/`, unmodified:

- `hero-product-1000.webp`, `hero-product-1600.webp`
- `exploded-poster.webp`
- `skullcandy-logo.webp`
- `teardown/frame-001.webp` … `frame-121.webp`

The originals in the React project's `Reference/` folder are not copied; they are large
and only needed if an asset must be regenerated.

## Error handling

- **Frames fail to load.** The scrub keeps the poster visible and does not initialise. No
  broken canvas is shown.
- **Form invalid.** Bootstrap validation classes mark the offending fields; submission is
  blocked until they pass.
- **Vendored font missing.** Every family declares a real system fallback stack, so the
  page stays readable.

## Testing

Manual, since there is no test runner and no build:

1. Open each of the four pages directly from disk with the network disabled, and confirm
   Bootstrap styling, fonts, and images all load from `vendor/` and `assets/`.
2. Check every navbar link from every page, and confirm the active link is marked.
3. Scroll `specs.html` end to end and confirm the teardown advances smoothly and lands on
   the last frame.
4. Re-check `specs.html` with reduced motion enabled, and again with JavaScript disabled.
5. Submit the order form empty, then correctly, and confirm both paths behave.
6. Check all four pages at 375px, 768px and 1440px widths.
7. Confirm no page shows a visible rectangle behind product imagery — the true-black rule.

## Follow-up

Add `Skullcandy Bootstrap Site/` to the Obsidian vault's `userIgnoreFilters`, matching the
folder name exactly with a trailing slash, as the vault does for every other project repo.
Close Obsidian before editing `.obsidian/*.json`.
