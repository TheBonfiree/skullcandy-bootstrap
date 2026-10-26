# Skullcandy Bootstrap Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a four-page static product site for the Skullcandy Crusher 1080 ANC using plain HTML, CSS, JavaScript and a locally vendored Bootstrap 5.3, reusing the image assets from the existing React project.

**Architecture:** Four hand-written HTML pages sharing a copy-pasted header, navbar and footer. Bootstrap is vendored into `vendor/` and themed by overriding its own CSS custom properties in `css/theme.css`, so stock components inherit a true-black editorial palette. Three small vanilla scripts handle the navbar active state, the 121-frame canvas teardown scrub, and order-form validation. No build step, no package manager, no network access at runtime.

**Tech Stack:** HTML5, CSS custom properties, vanilla ES2019 JavaScript, Bootstrap 5.3.3 (vendored CSS + bundle JS), self-hosted woff2 fonts (Archivo variable, Instrument Sans variable, IBM Plex Mono).

**Spec:** `docs/superpowers/specs/2026-09-13-skullcandy-bootstrap-site-design.md`

## Global Constraints

- The page base colour is `#000000` exactly. Never place a gradient, glow, or tinted wash behind product imagery — the opaque image frame paints over it and reveals its bounding box as a visible rectangle.
- Any newly introduced image asset must be crushed to luma 0 first: `ffmpeg -i in -vf "lutyuv=y='if(lt(val,5),0,val)'" out`. The existing assets already satisfy this and must be copied unmodified.
- There is exactly one accent colour family, warm. Interactive elements are separated by **fill** (`--color-sand` plate, `--color-ink` text), never by a second hue. Do not introduce blue, green, or any cool colour.
- Callouts are a hairline leader, a dot terminal, and a mono label. No `01 / 02 / 03` numbered markers.
- Type contrast is **width**, not serif versus sans: Archivo (display, expanded widths), Instrument Sans (body), IBM Plex Mono (spec data and labels).
- Focus rings are `2px solid var(--color-bone)`, so they stay visible on ink and on a sand-filled control.
- Every page must open correctly from `file://` with the network disabled. No CDN links, no Google Fonts links, no `fetch()` of local JSON.
- Header, navbar and footer markup is duplicated verbatim across all four pages. Do not introduce a JavaScript layout injector.
- Palette tokens, copied verbatim: `--color-ink: #000000`, `--color-carbon: #0b0908`, `--color-graphite: #1a1512`, `--color-sand: #d9a97e`, `--color-sand-dim: #8c5e3e`, `--color-bone: #f4ece4`, `--color-ash: #9c9089`.
- Product facts, copied verbatim: product `Crusher 1080 ANC`, brand `Skullcandy`, price `$279.99`, battery `60 hrs with ANC off` / `50 hrs with ANC on`, charging `10 minutes on the cable` = `4 hours` of playback.

**Testing note:** this project has no test runner. Every task's verification step is a specific, observable browser check with a stated expected result. Treat a failed check exactly as you would a failing unit test: fix before commit. Where a local server is needed, this machine runs Python as `py`, not `python`: `py -m http.server 8000`.

---

### Task 1: Project scaffold, vendored dependencies, and assets

**Files:**
- Create: `.gitattributes`, `.gitignore`, `README.md`
- Create: `vendor/bootstrap/bootstrap.min.css`, `vendor/bootstrap/bootstrap.bundle.min.js`
- Create: `vendor/fonts/fonts.css` and the woff2 files beside it
- Create: `assets/` (copied images)

**Interfaces:**
- Consumes: nothing.
- Produces: the vendored paths every later task links to — `vendor/bootstrap/bootstrap.min.css`, `vendor/bootstrap/bootstrap.bundle.min.js`, `vendor/fonts/fonts.css`; and asset paths `assets/hero-product-1000.webp`, `assets/hero-product-1600.webp`, `assets/exploded-poster.webp`, `assets/skullcandy-logo.webp`, `assets/teardown/frame-001.webp` … `assets/teardown/frame-121.webp`.

- [ ] **Step 1: Pin line endings and ignore rules**

Create `.gitattributes`:

```
* text=auto eol=lf
*.webp binary
*.woff2 binary
```

Create `.gitignore`:

```
.DS_Store
Thumbs.db
*.zip
```

- [ ] **Step 2: Copy the image assets from the React project**

```bash
cd "/f/Brain/02-PROJECTS/Skullcandy Bootstrap Site"
mkdir -p assets
cp -r "/f/Brain/02-PROJECTS/Skullcandy Landing page/public/assets/." assets/
ls assets; ls assets/teardown | wc -l
```

Expected: `exploded-poster.webp`, `hero-product-1000.webp`, `hero-product-1600.webp`, `skullcandy-logo.webp`, `teardown/`, and a frame count of `121`.

- [ ] **Step 3: Vendor Bootstrap 5.3.3**

```bash
mkdir -p vendor/bootstrap
curl -fsSL -o vendor/bootstrap/bootstrap.min.css \
  https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
curl -fsSL -o vendor/bootstrap/bootstrap.bundle.min.js \
  https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
head -c 80 vendor/bootstrap/bootstrap.min.css
```

Expected: the first line names Bootstrap v5.3.3. If `curl` is unavailable, download both files by hand and place them at those paths.

- [ ] **Step 4: Vendor the fonts**

Download the woff2 files for Archivo (variable, `wdth` and `wght` axes), Instrument Sans (variable `wght`), and IBM Plex Mono (weights 400, 500, 600) into `vendor/fonts/`. Then create `vendor/fonts/fonts.css`:

```css
@font-face {
  font-family: "Archivo";
  src: url("archivo-variable.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-stretch: 62% 125%;
  font-display: swap;
}
@font-face {
  font-family: "Instrument Sans";
  src: url("instrument-sans-variable.woff2") format("woff2-variations");
  font-weight: 400 700;
  font-display: swap;
}
@font-face {
  font-family: "IBM Plex Mono";
  src: url("ibm-plex-mono-500.woff2") format("woff2");
  font-weight: 500;
  font-display: swap;
}
```

Name the downloaded files to match these `src` values exactly.

- [ ] **Step 5: Verify the fonts resolve offline**

Create a throwaway `vendor/fonts/_check.html` containing a link to `fonts.css` and three paragraphs, one per family. Open it from `file://` with the network disabled.
Expected: three visibly different typefaces; Archivo noticeably wider than Instrument Sans. Delete `_check.html` afterwards.

- [ ] **Step 6: Write the README**

`README.md` states what the project is, that it is plain HTML/CSS/JS with Bootstrap, that it needs no build step or internet, and how to view it: open `index.html`, or run `py -m http.server 8000`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Scaffold project with vendored Bootstrap, fonts and assets"
```

---

### Task 2: Design tokens and Bootstrap theme overrides

**Files:**
- Create: `css/theme.css`

**Interfaces:**
- Consumes: `vendor/bootstrap/bootstrap.min.css` and `vendor/fonts/fonts.css` from Task 1.
- Produces: the custom properties and utility classes every page uses — `--color-ink`, `--color-carbon`, `--color-graphite`, `--color-sand`, `--color-sand-dim`, `--color-bone`, `--color-ash`, `--font-display`, `--font-body`, `--font-mono`; and classes `.type-display`, `.type-mono`, `.btn-sand`, `.section`, `.rule`.

- [ ] **Step 1: Write the token block and Bootstrap variable overrides**

```css
:root {
  --color-ink: #000000;
  --color-carbon: #0b0908;
  --color-graphite: #1a1512;
  --color-sand: #d9a97e;
  --color-sand-dim: #8c5e3e;
  --color-bone: #f4ece4;
  --color-ash: #9c9089;

  --font-display: "Archivo", system-ui, sans-serif;
  --font-body: "Instrument Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --bs-body-bg: var(--color-ink);
  --bs-body-color: var(--color-ash);
  --bs-emphasis-color: var(--color-bone);
  --bs-border-color: var(--color-graphite);
  --bs-link-color: var(--color-sand);
  --bs-link-hover-color: var(--color-bone);
  --bs-font-sans-serif: var(--font-body);
  --bs-body-font-family: var(--font-body);
}

html, body {
  background-color: var(--color-ink);
}

body {
  color: var(--color-bone);
  font-synthesis-weight: none;
  -webkit-font-smoothing: antialiased;
}

:focus-visible {
  outline: 2px solid var(--color-bone);
  outline-offset: 2px;
}

::selection {
  background: var(--color-sand);
  color: var(--color-ink);
}
```

- [ ] **Step 2: Add the type classes**

```css
.type-display {
  font-family: var(--font-display);
  font-variation-settings: "wdth" 118, "wght" 800;
  line-height: 0.95;
  letter-spacing: -0.01em;
  color: var(--color-bone);
}

.type-subhead {
  font-family: var(--font-display);
  font-variation-settings: "wdth" 110, "wght" 700;
  line-height: 1.05;
  color: var(--color-bone);
}

.type-mono {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ash);
}

.type-mono-sand { color: var(--color-sand); }
```

- [ ] **Step 3: Add the interactive and layout helpers**

Interactive elements are separated by fill, not hue — this is the rule that block encodes.

```css
.btn-sand {
  background: var(--color-sand);
  color: var(--color-ink);
  border: 0;
  border-radius: 0;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.95rem 1.6rem;
}
.btn-sand:hover, .btn-sand:focus-visible {
  background: var(--color-bone);
  color: var(--color-ink);
}

.btn-ghost {
  background: transparent;
  color: var(--color-bone);
  border: 1px solid var(--color-graphite);
  border-radius: 0;
}
.btn-ghost:hover { border-color: var(--color-sand); color: var(--color-bone); }

.section {
  padding: 6rem 0;
  border-top: 1px solid var(--color-graphite);
}
@media (min-width: 768px) { .section { padding: 8rem 0; } }

.section-carbon { background: var(--color-carbon); }
.rule { border: 0; border-top: 1px solid var(--color-graphite); opacity: 1; }
```

Note: `.section-carbon` is for text sections only. Never apply it, or any other non-`#000000` background, to a block containing product imagery.

- [ ] **Step 4: Restyle the Bootstrap components used later**

```css
.navbar { background: rgba(0,0,0,0.88); backdrop-filter: blur(8px); }
.navbar .nav-link { font-family: var(--font-mono); font-size: 0.6875rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-ash); }
.navbar .nav-link:hover { color: var(--color-bone); }
.navbar .nav-link.active { color: var(--color-sand); }

.card { background: var(--color-carbon); border: 1px solid var(--color-graphite);
  border-radius: 0; }

.table { --bs-table-bg: transparent; --bs-table-color: var(--color-bone);
  --bs-table-border-color: var(--color-graphite); }
.table td:first-child { font-family: var(--font-mono); font-size: 0.6875rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-ash); }

.accordion { --bs-accordion-bg: transparent; --bs-accordion-color: var(--color-bone);
  --bs-accordion-border-color: var(--color-graphite);
  --bs-accordion-btn-color: var(--color-bone);
  --bs-accordion-active-bg: transparent;
  --bs-accordion-active-color: var(--color-sand);
  --bs-accordion-btn-focus-box-shadow: none;
  --bs-accordion-border-radius: 0; }

.form-control, .form-select {
  background: var(--color-carbon); border: 1px solid var(--color-graphite);
  border-radius: 0; color: var(--color-bone); }
.form-control:focus, .form-select:focus {
  background: var(--color-carbon); color: var(--color-bone);
  border-color: var(--color-sand); box-shadow: none; }
.form-label { font-family: var(--font-mono); font-size: 0.6875rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-ash); }
```

- [ ] **Step 5: Verify**

Create a throwaway `_theme-check.html` that links Bootstrap, `fonts.css` and `theme.css` in that order, and renders one `.btn-sand`, one `.card`, one two-row `.table` and one `.type-display` heading.
Expected: pure black background, warm sand button with black text, no blue anywhere, display heading visibly wider than body text. Tab to the button and confirm a bone-coloured focus ring. Delete the file afterwards.

- [ ] **Step 6: Commit**

```bash
git add css/theme.css
git commit -m "Add design tokens and Bootstrap theme overrides"
```

---

### Task 3: Shared chrome and the home page

**Files:**
- Create: `index.html`, `css/pages.css`, `js/nav.js`

**Interfaces:**
- Consumes: `css/theme.css` classes from Task 2; `assets/hero-product-*.webp` and `assets/skullcandy-logo.webp` from Task 1.
- Produces: the canonical header/navbar/footer markup that Tasks 4, 5 and 7 copy verbatim, and `js/nav.js`, which marks the active nav link by comparing `location.pathname` to each link's `href`.

- [ ] **Step 1: Write the shared head block**

Every page's `<head>` carries this, with only `<title>`, the description and the active nav item differing:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#000000">
<link rel="stylesheet" href="vendor/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="vendor/fonts/fonts.css">
<link rel="stylesheet" href="css/theme.css">
<link rel="stylesheet" href="css/pages.css">
```

Load order matters: Bootstrap first, theme last.

- [ ] **Step 2: Write the header and navbar**

```html
<header>
  <nav class="navbar navbar-expand-lg fixed-top border-bottom" style="border-color: var(--color-graphite) !important;">
    <div class="container-xxl">
      <a class="navbar-brand" href="index.html">
        <img src="assets/skullcandy-logo.webp" alt="Skullcandy" height="18">
      </a>
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
              data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-4">
          <li class="nav-item"><a class="nav-link" href="index.html">Overview</a></li>
          <li class="nav-item"><a class="nav-link" href="features.html">Features</a></li>
          <li class="nav-item"><a class="nav-link" href="specs.html">Specs</a></li>
          <li class="nav-item ms-lg-3"><a class="btn btn-sand" href="buy.html">Buy — $279.99</a></li>
        </ul>
      </div>
    </div>
  </nav>
</header>
```

The toggler icon is a white-on-black SVG data URI set in `pages.css`; Bootstrap's default is dark and invisible here.

- [ ] **Step 3: Write the footer**

```html
<footer class="section">
  <div class="container-xxl">
    <div class="row gy-4">
      <div class="col-lg-5">
        <img src="assets/skullcandy-logo.webp" alt="Skullcandy" height="16">
        <p class="mt-3 mb-0" style="color: var(--color-ash); max-width: 28rem;">
          Crusher 1080 ANC. Crusher haptic bass and three Bose audio systems
          in one set of headphones.
        </p>
      </div>
      <div class="col-6 col-lg-3">
        <p class="type-mono mb-3">Product</p>
        <ul class="list-unstyled m-0">
          <li><a href="index.html">Overview</a></li>
          <li><a href="features.html">Features</a></li>
          <li><a href="specs.html">Specs</a></li>
          <li><a href="buy.html">Buy</a></li>
        </ul>
      </div>
      <div class="col-6 col-lg-4">
        <p class="type-mono mb-3">Coursework notice</p>
        <p class="mb-0" style="color: var(--color-ash);">
          A student project. Not affiliated with Skullcandy or Bose.
          Product names and imagery belong to their owners.
        </p>
      </div>
    </div>
    <hr class="rule my-4">
    <p class="type-mono mb-0">© 2026 — built with HTML, CSS, JavaScript and Bootstrap</p>
  </div>
</footer>
<script src="vendor/bootstrap/bootstrap.bundle.min.js"></script>
<script src="js/nav.js"></script>
```

The coursework notice is required — the site uses a real brand's marks.

- [ ] **Step 4: Write `js/nav.js`**

```js
(function () {
  "use strict";
  var here = location.pathname.split("/").pop() || "index.html";
  var links = document.querySelectorAll(".navbar .nav-link");
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("href") === here) {
      links[i].classList.add("active");
      links[i].setAttribute("aria-current", "page");
    }
  }
})();
```

- [ ] **Step 5: Build the home page body**

Between header and footer, in order:

1. **Hero** — full-viewport section. `<p class="type-mono type-mono-sand">Skullcandy</p>`, `<h1 class="type-display">Crusher 1080 ANC<br>No compromise.</h1>`, a one-paragraph product description, a `.btn-sand` to `buy.html` and a `.btn-ghost` to `features.html`, and the product image:

```html
<img src="assets/hero-product-1600.webp"
     srcset="assets/hero-product-1000.webp 1000w, assets/hero-product-1600.webp 1672w"
     sizes="(max-width: 768px) 92vw, 64vw"
     alt="Skullcandy Crusher 1080 ANC headphones" class="img-fluid">
```

The hero section's background stays `#000000`. No gradient, no glow.

2. **Positioning** — `.section` with the heading "Not the same price." and two or three short paragraphs on what the product includes that rivals charge more for.
3. **Feature teaser** — a three-column Bootstrap row of `.card`s: Crusher Bass, Sound by Bose, 60-hour battery. Each links to `features.html`.
4. **Price strip** — `.section .section-carbon` stating `$279.99` in `.type-display` with a `.btn-sand` to `buy.html`.

- [ ] **Step 6: Write `css/pages.css`**

Hold the hero grid, the navbar toggler icon override, and the section-specific layout here. Keep component-level styling in `theme.css`.

- [ ] **Step 7: Verify**

Open `index.html` from `file://` with the network disabled.
Expected: black page, logo and hero image visible, navbar collapses to a visible white toggler below 992px and the offcanvas menu opens, "Overview" is sand-coloured and carries `aria-current`, no horizontal scrollbar at 375px, and no rectangle seam behind the hero image.

- [ ] **Step 8: Commit**

```bash
git add index.html css/pages.css js/nav.js
git commit -m "Add shared chrome and home page"
```

---

### Task 4: Features page

**Files:**
- Create: `features.html`
- Modify: `css/pages.css`

**Interfaces:**
- Consumes: the header/navbar/footer markup from Task 3 (copied verbatim, with the `Features` link marked by `nav.js`), and `theme.css` classes.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Copy the page shell**

Copy `index.html`, strip the body sections, and set the title to `Features — Skullcandy Crusher 1080 ANC` and a matching description. Do not alter the header or footer markup.

- [ ] **Step 2: Build the Crusher Bass section**

A `.section` with heading "Crusher Bass" and a Bootstrap accordion of the four haptic levels, text copied verbatim:

- Off — "Standard tuning, nothing added underneath."
- Low — "A light pulse on kick drums and low synths."
- Mid — "Low end you feel in your jaw as much as you hear it."
- Full — "Full physical rumble through the cups and into your skull."

- [ ] **Step 3: Build the Sound by Bose section**

A `.section` with heading "Sound by Bose" and a three-column row of `.card`s:

- **Bose QuietControl** — adaptive noise cancellation.
- **Bose TrueSpatial** — spatial audio.
- **Bose WaveForm Audio Engine** — "Bose's own tuning and processing engine, running on the Crusher's drivers rather than alongside them."

- [ ] **Step 4: Build the Everyday section**

A `.section` carrying the battery and charging figures as large `.type-display` numbers with `.type-mono` labels: `60` hrs with ANC off, `50` hrs with ANC on, and `10` minutes on the cable for `4` hours of playback.

- [ ] **Step 5: Verify**

Open `features.html` offline.
Expected: "Features" is the active nav link; all four accordion panels open and close; the three cards sit in one row at 1440px and stack at 375px; every figure matches the Global Constraints exactly.

- [ ] **Step 6: Commit**

```bash
git add features.html css/pages.css
git commit -m "Add features page"
```

---

### Task 5: Specs page — table and exploded callouts

**Files:**
- Create: `specs.html`
- Modify: `css/pages.css`

**Interfaces:**
- Consumes: shared chrome from Task 3; `assets/exploded-poster.webp`.
- Produces: the DOM hooks Task 6 attaches to — a section with `id="teardown"`, containing `<canvas id="teardown-canvas">` and `<img id="teardown-poster" src="assets/exploded-poster.webp">`.

- [ ] **Step 1: Copy the page shell**

Title `Specs — Skullcandy Crusher 1080 ANC`. Header and footer copied verbatim.

- [ ] **Step 2: Build the specification table**

A Bootstrap `.table` with rows for driver size, frequency response, ANC, Bluetooth version, codecs, battery (ANC off and on), fast charge, weight, connectors, and price `$279.99`. Values must not contradict anything in the Global Constraints.

- [ ] **Step 3: Build the teardown section shell**

```html
<section id="teardown" class="section">
  <div class="container-xxl">
    <p class="type-mono type-mono-sand">Inside</p>
    <h2 class="type-display">Every layer, in order.</h2>
  </div>
  <div class="teardown-track">
    <div class="teardown-stage">
      <img id="teardown-poster" src="assets/exploded-poster.webp"
           alt="Exploded view of the Crusher 1080 ANC" class="img-fluid">
      <canvas id="teardown-canvas" hidden></canvas>
    </div>
  </div>
</section>
```

The poster is the default state; Task 6's script reveals the canvas over it. This is what makes the page degrade correctly with JavaScript disabled.

- [ ] **Step 4: Style the sticky track**

In `pages.css`:

```css
.teardown-track { position: relative; height: 400vh; }
.teardown-stage { position: sticky; top: 0; height: 100vh;
  display: grid; place-items: center; background: var(--color-ink); }
.teardown-stage img, .teardown-stage canvas {
  max-height: 86vh; width: auto; }
```

The stage background is `#000000` — never a gradient, per the Global Constraints.

- [ ] **Step 5: Build the callouts**

Four leader-line callouts over the poster: a 1px hairline in `--color-graphite`, a 5px dot terminal in `--color-sand`, and a `.type-mono` label. No numbered markers.

- [ ] **Step 6: Verify**

Open `specs.html` offline.
Expected: "Specs" active; the table reads with mono labels in the first column; the poster is visible and stays pinned while its section scrolls; the callout lines land on the parts they label at 1440px and are hidden or repositioned at 375px.

- [ ] **Step 7: Commit**

```bash
git add specs.html css/pages.css
git commit -m "Add specs page with spec table and exploded callouts"
```

---

### Task 6: Teardown scroll-scrub

**Files:**
- Create: `js/teardown.js`
- Modify: `specs.html` (add the script tag)

**Interfaces:**
- Consumes: `#teardown`, `#teardown-canvas`, `#teardown-poster` from Task 5; frames `assets/teardown/frame-001.webp` … `frame-121.webp` from Task 1.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Write the frame loader**

```js
(function () {
  "use strict";
  var FRAME_COUNT = 121;
  var section = document.getElementById("teardown");
  var canvas = document.getElementById("teardown-canvas");
  var poster = document.getElementById("teardown-poster");
  if (!section || !canvas || !poster) { return; }

  var ctx = canvas.getContext("2d");
  var frames = [];
  var loaded = 0;

  function src(i) {
    return "assets/teardown/frame-" + String(i + 1).padStart(3, "0") + ".webp";
  }

  for (var i = 0; i < FRAME_COUNT; i++) {
    var img = new Image();
    img.decoding = "async";
    img.onload = onFrameLoad;
    img.onerror = onFrameError;
    img.src = src(i);
    frames.push(img);
  }
```

- [ ] **Step 2: Write the readiness and failure handling**

```js
  var failed = false;

  function onFrameError() {
    failed = true;
  }

  function onFrameLoad() {
    loaded++;
    if (loaded === FRAME_COUNT && !failed) { start(); }
  }
```

If any frame fails, `start()` never runs, the canvas stays hidden, and the poster remains visible. That is the intended degraded state — no broken canvas is ever shown.

- [ ] **Step 3: Write the draw and scroll mapping**

```js
  var current = -1;
  var ticking = false;

  function sizeCanvas() {
    var first = frames[0];
    canvas.width = first.naturalWidth;
    canvas.height = first.naturalHeight;
  }

  function draw(index) {
    if (index === current) { return; }
    current = index;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
  }

  function frameForScroll() {
    var rect = section.getBoundingClientRect();
    var travel = rect.height - window.innerHeight;
    if (travel <= 0) { return FRAME_COUNT - 1; }
    var progress = (-rect.top) / travel;
    progress = Math.min(1, Math.max(0, progress));
    return Math.round(progress * (FRAME_COUNT - 1));
  }

  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () {
      draw(frameForScroll());
      ticking = false;
    });
  }
```

- [ ] **Step 4: Write the start function with the reduced-motion branch**

```js
  function start() {
    sizeCanvas();
    canvas.hidden = false;
    poster.hidden = true;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw(FRAME_COUNT - 1);
      return;
    }

    draw(frameForScroll());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }
})();
```

Under reduced motion the final frame is drawn once and no scroll listener is attached.

- [ ] **Step 5: Wire it into the page**

Add `<script src="js/teardown.js"></script>` to `specs.html`, after the Bootstrap bundle.

- [ ] **Step 6: Verify the happy path**

Serve the page — `py -m http.server 8000` — and scroll `specs.html` through the teardown section.
Expected: the poster is replaced by the canvas once loading completes; scrolling advances frames smoothly in both directions; the last scroll position shows the final frame; the console is clean.

- [ ] **Step 7: Verify the three degraded paths**

1. Disable JavaScript and reload. Expected: the poster is visible, the page still scrolls normally.
2. Enable `prefers-reduced-motion` in the browser's rendering settings and reload. Expected: one static final frame, and no repaint while scrolling.
3. Temporarily rename `assets/teardown/frame-050.webp`, reload, and confirm the poster stays visible with no blank canvas. Rename it back.

- [ ] **Step 8: Commit**

```bash
git add js/teardown.js specs.html
git commit -m "Add vanilla canvas teardown scroll-scrub"
```

---

### Task 7: Buy page and order form

**Files:**
- Create: `buy.html`, `js/form.js`
- Modify: `css/pages.css`

**Interfaces:**
- Consumes: shared chrome from Task 3; `assets/hero-product-1000.webp`.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Copy the page shell**

Title `Buy — Skullcandy Crusher 1080 ANC`.

- [ ] **Step 2: Build the price and variant block**

Price `$279.99` in `.type-display`, the product image, and three colourway options as radio inputs styled as fill-separated plates — selected is a solid sand plate, unselected is a graphite hairline border. No second hue.

- [ ] **Step 3: Build the form**

Bootstrap form controls inside `<form id="order-form" class="needs-validation" novalidate>`: full name (`name="fullName"`, `required` — `js/form.js` reads it by that exact name), email, quantity (`type="number"`, `min="1"`, `max="5"`), shipping country (`<select>`), and an optional notes `<textarea>`. Each field carries a `.invalid-feedback` element with specific text — for example, "Enter the email address the order confirmation should go to." Add an empty `<div id="order-confirmation" class="mt-4" hidden></div>` after the submit button.

- [ ] **Step 4: Write `js/form.js`**

```js
(function () {
  "use strict";
  var form = document.getElementById("order-form");
  var confirmation = document.getElementById("order-confirmation");
  if (!form || !confirmation) { return; }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      confirmation.hidden = true;
      var firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) { firstInvalid.focus(); }
      return;
    }

    var name = form.elements.fullName.value.trim();
    confirmation.textContent =
      "Thanks, " + name + ". This is a coursework demo, so no order was placed.";
    confirmation.hidden = false;
    confirmation.focus();
  });
})();
```

Add `tabindex="-1"` to the confirmation element so `focus()` works and the result is announced.

- [ ] **Step 5: Wire it in**

Add `<script src="js/form.js"></script>` to `buy.html`, after the Bootstrap bundle.

- [ ] **Step 6: Verify**

Open `buy.html` offline.
Expected: submitting empty marks every required field red, shows the specific messages, keeps the confirmation hidden, and moves focus to the first invalid field; submitting valid data shows the confirmation naming the buyer and nothing navigates; quantity `0` and `6` are both rejected.

- [ ] **Step 7: Commit**

```bash
git add buy.html js/form.js css/pages.css
git commit -m "Add buy page with validated order form"
```

---

### Task 8: Cross-page pass and brief sign-off

**Files:**
- Modify: any of the four pages, `css/theme.css`, `css/pages.css` as the checks require
- Create: `docs/brief-checklist.md`

**Interfaces:**
- Consumes: everything above.
- Produces: the finished, verified site.

- [ ] **Step 1: Run the offline check on all four pages**

Disable the network. Open each page from `file://` and watch the browser's network panel.
Expected: zero requests to any external host. Any CDN or Google Fonts URL found is a defect — vendor it.

- [ ] **Step 2: Run the responsive check**

Check all four pages at 375px, 768px and 1440px.
Expected: no horizontal scrollbar at any width; the navbar collapses below 992px; the spec table scrolls inside its own container rather than widening the page.

- [ ] **Step 3: Run the true-black check**

Look behind every product image on every page at 1440px.
Expected: no visible rectangle, no seam, no lighter panel edge. If one appears, find the non-`#000000` background behind that image and remove it.

- [ ] **Step 4: Run the accessibility pass**

Tab through each page end to end.
Expected: every interactive element is reachable in visual order; the focus ring is bone and visible on both ink and sand-filled controls; every image has a meaningful `alt`; each page has exactly one `<h1>`; the navbar toggler keeps its `aria-expanded`.

- [ ] **Step 5: Write the brief checklist**

Create `docs/brief-checklist.md` mapping each brief requirement — minimum two pages, promotes a product, product information, attractive visual, buttons, HTML, CSS, JavaScript, Bootstrap, header, navbar, product description, features, price, footer — to the exact file and section that satisfies it. This is what a grader reads first.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Cross-page verification pass and brief checklist"
```

- [ ] **Step 7: Register the repo with the vault**

Close Obsidian, then add a line to the vault's `.obsidian/app.json` `userIgnoreFilters` matching the folder name exactly, with a trailing slash: `Skullcandy Bootstrap Site/`. Obsidian holds these settings in memory and overwrites the file on quit, so it must be closed before editing. Reopen Obsidian and confirm the folder no longer appears in search results.
