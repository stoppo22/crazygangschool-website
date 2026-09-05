# Crazy Gang School

First local homepage prototype. Factual source: `CONTEXT.md`. Project rules: `AGENTS.md`. Temporary media: `ASSETS.md`.

## Run

Node.js 22.12+ (tested with 22.14) and npm are required.

```sh
npm install
npm run dev -- --port 5173 --strictPort
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

The script uses an installed Chrome or Edge on Windows. On other systems, set `BROWSER_PATH` to an installed Chromium-family browser or provide a Playwright Chromium installation. `BASE_URL` optionally changes the target. Screenshots and the machine-readable report are written under `artifacts/`.

## Implementation

React + Vite, custom CSS, GSAP ScrollTrigger and `@gsap/react`. There is no router, CMS, backend or component library. The homepage includes anchor navigation, an accessible mobile menu, expandable course groups, an expandable teacher list, an animated text strip with pause control, a desktop pinned stage section and scroll-linked text reveals. Reduced-motion preferences disable movement and pinning.

## Content boundaries

- All operating information is unconfirmed. No open-enrollment claim, class timetable, price, qualification or testimonial is invented.
- The course presentation is an editorial grouping of documented disciplines, not a new official course taxonomy. The faculty list follows the main historical teacher page; it does not reconcile the alternate Home2 roster.
- The CTA opens email or telephone links. No message is automatically sent and no booking or payment is simulated.
- External archive and social links go to the documented destinations. The map is a search link, not a claim of verified coordinates.
- Temporary photography is labelled and documented. This prototype is `noindex` and has not been published.
- Legal information, current opening status, active courses, current staff and final photography must be confirmed before launch.
- `DESIGN.md` intentionally remains absent until the user has reviewed this version.
