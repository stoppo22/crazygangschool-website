# Crazy Gang School

Local homepage with the original Crazy Gang identity and archival photography. Factual source: `CONTEXT.md`. Project rules: `AGENTS.md`. Media provenance: `ASSETS.md`. Visual direction: `DESIGN.md` (the approved editorial revision and plain, descriptive titles).

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

The script uses an installed Chrome or Edge on Windows. On other systems, set `BROWSER_PATH` to an installed Chromium-family browser or provide a Playwright Chromium installation. `BASE_URL` optionally changes the target. Screenshots and the machine-readable report are written under `artifacts/`.

## Implementation

React + Vite, custom CSS, GSAP ScrollTrigger and `@gsap/react`. There is no router, CMS, backend or component library. A small pathname renderer handles the seven local `/corsi/*` pages without adding routing infrastructure. The homepage includes anchor navigation, an accessible mobile menu, a responsive photographic course accordion, an expandable teacher list and a desktop pinned archive section. Reduced-motion preferences disable movement, transitions and pinning.

The desktop navigation uses GodUI’s Magic Tab installed from the official registry source via its documented manual route. The project-specific adapter lives in `src/components/godui/MagicTab.jsx`: it preserves the controlled state and keyboard/hover interaction while using real anchors, the existing custom CSS stack and a restrained non-rainbow indicator. No Tailwind or theme package was added solely for this component.

Course routes:

- `/corsi/danza-moderna`
- `/corsi/danza-classica`
- `/corsi/tip-tap`
- `/corsi/k-pop`
- `/corsi/kung-fu`
- `/corsi/hip-hop`
- `/corsi/danze-latino-americane`

Vite development and preview servers provide the required history fallback. A future static host must rewrite these paths to `index.html`.

## Content boundaries

- All operating information is unconfirmed. No open-enrollment claim, class timetable, price, qualification or testimonial is invented.
- Course pages use only owner-confirmed details recorded in `CONTEXT.md`. Missing ages, levels and schedules are plainly marked as unavailable or to be verified. The faculty list follows the main historical teacher page; it does not reconcile the alternate Home2 roster.
- The CTA opens email or telephone links. No message is automatically sent and no booking or payment is simulated.
- External archive and social links go to the documented destinations. The map is a search link, not a claim of verified coordinates.
- Hero and courses use labelled stock placeholders; the archive section uses documented historical photographs. Image rights and credits remain to be confirmed. This prototype is `noindex` and has not been published.
- Legal information, current opening status, active courses, current staff and final photography must be confirmed before launch.
- `DESIGN.md` records the approved contemporary interpretation of the original brand: strong neutrals, deep indigo and selective plum/amber accents.


