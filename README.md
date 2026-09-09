# Crazy Gang School

Homepage and course pages for the Crazy Gang dance school, with the original brand
identity and archival photography. Factual source: `CONTEXT.md`. Project rules:
`AGENTS.md`. Media provenance: `ASSETS.md`. Visual direction: `DESIGN.md`.
Pre-launch tasks still open: `LAUNCH_CHECKLIST.md`.

## Run

Node.js 22.12+ (tested with 22.14) and npm are required.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:5173/.

```sh
npm run build
npm run preview
```

## Browser checks

With the development server running:

```sh
npm run test:browser
```

The script uses an installed Chrome or Edge on Windows. On other systems, set
`BROWSER_PATH` to an installed Chromium-family browser or provide a Playwright
Chromium installation. `BASE_URL` optionally changes the target. Screenshots and
the machine-readable report are written under `artifacts/`. The suite covers the
home page, the mobile menu, the seven course pages, the 404 view, the
gallery/lightbox (including `Esc`), the consent-gated Google Map and the absence
of console errors.

## Implementation

React + Vite, custom CSS, GSAP ScrollTrigger, `@gsap/react` and Framer Motion.
There is no router, CMS, backend or component library. A small pathname renderer
(`src/main.jsx` → `resolveView`) selects between the homepage, the seven
`/corsi/*` pages, the `/privacy` and `/cookie` pages and a real 404 view for any
other path. `src/head.js` sets per-page `<title>`, description, canonical, Open
Graph and JSON-LD on the JS-rendered pages; the homepage metadata is static in
`index.html`. Reduced-motion preferences disable movement, transitions and
pinning.

The desktop navigation uses GodUI's Magic Tab; the school section uses GodUI's
Sticky Scroll. Both are installed from their official registry sources and
adapted in `src/components/godui/`. See the git history for details.

Course routes:

- `/corsi/danza-moderna`
- `/corsi/danza-classica`
- `/corsi/tip-tap`
- `/corsi/k-pop`
- `/corsi/kung-fu`
- `/corsi/hip-hop`
- `/corsi/danze-latino-americane`

## SEO

- `seo.config.js` is the single source of truth for the production origin
  (`SITE_URL`, default `https://www.crazygangschool.com` — **confirm www vs apex
  before launch**, override with the `SITE_URL` env var at build time), site
  name, default description and the route list. The Vite plugin substitutes the
  `%SITE_URL%` placeholders in `index.html` (canonical, Open Graph, JSON-LD) with
  this value, so the domain lives in exactly one place.
- The Vite plugin in `vite.config.js` writes `dist/robots.txt` and
  `dist/sitemap.xml` at build time and flips the robots meta tag:
  `index, follow` on `npm run build`, `noindex, nofollow` on the dev server.
- Each course page emits its own `<title>`, meta description, canonical and a
  `Course` JSON-LD node (`src/course-data.js` holds `metaTitle` /
  `metaDescription`). The homepage carries a `DanceSchool` JSON-LD block built
  only from verified data (address, coordinates, contacts, social profiles — no
  rating, no founding date, no opening hours).
- The 404 view is `noindex`.

## Deploy (Cloudflare Pages)

- Build command: `npm run build`. Output directory: `dist`. Node 22. Set these in
  the Cloudflare Pages project settings (there is no config file).
- `public/_redirects` (copied to `dist/_redirects` by the build) rewrites
  `/corsi/*`, `/privacy` and `/cookie` to `/index.html` with status `200`, so a
  direct load or refresh of those paths works. Any other unknown path is left to
  Cloudflare's native 404 (a real `404` status); an unknown course slug such as
  `/corsi/xyz` is served the app, which then renders its own `noindex` 404 view.
- No custom `_headers` file: Cloudflare Pages already sets long-lived caching for
  the hashed files under `/assets`.
- Set the `SITE_URL` environment variable in the Cloudflare Pages project to the
  final production origin before the first production deploy.

## Privacy

The site's own code sets no cookies and stores nothing in the browser (verified:
no `localStorage` / `sessionStorage` / `document.cookie` usage). Fonts and images
are self-hosted. The only third-party embed is the Google Map in the "Dove siamo"
section, which is **not mounted until the visitor clicks "Attiva la mappa"** — no
request reaches Google before then.

Visitor statistics come from **Cloudflare Web Analytics**, which is cookieless
and enabled from the Cloudflare dashboard (no code here); nothing is collected
until it is turned on. Because no profiling/analytics cookies are set and no
non-technical cookie is set without an explicit user action, the site currently
shows **no consent banner**. Adding any cookie-based tracker, pixel, booking
widget or embedded video later would require a consent manager with prior
blocking and an extended Cookie Policy.

`/privacy` and `/cookie` (`src/LegalPage.jsx`) are complete drafts; the owner
must fill the bracketed facts (data controller + tax code, retention periods,
dates) and have the text reviewed before launch. `PRIVACY-NOTES.md` records the
processing inventory and the reasoning. See `LAUNCH_CHECKLIST.md`.

## Content boundaries

- Course pages use only owner-confirmed details recorded in `CONTEXT.md`
  (disciplines, age ranges and the verified schedules from 8 September 2026).
  The "Avviamento" group name in Danza Classica is still to be confirmed.
- The faculty list follows the historical teacher page; the current composition
  is still to be confirmed.
- The CTA opens email or telephone links. No message is sent and no booking or
  payment is simulated. WhatsApp Business is shown as "non ancora attivo".
- The reviews section shows only the verified Google rating; no review text is
  published until each entry is checked against the listing.
- Hero and course images are labelled stock placeholders (`data-placeholder`,
  `placeholder: true`); the gallery uses documented historical photographs.
  Image rights and credits remain to be confirmed.
