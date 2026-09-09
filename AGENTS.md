# Autonomia

- Esegui autonomamente ogni azione che puoi completare senza il mio intervento, senza chiedermi conferma o permesso.

# Crazy Gang School — project rules

## Source of truth

- Read `CONTEXT.md` before changing factual content. Keep its source links and verification status intact.
- The old site is a content source only. Never copy its layout, UI, spacing, navigation or visual treatment.
- Do not invent statistics, testimonials, qualifications, prices, schedules, course availability, opening status or biographies.
- Unconfirmed offers must not become promises. Use requests for information, not booking confirmations or enrollment claims.
- No WhatsApp link without confirmation. Do not infer an official YouTube channel from the old search link.
- The site is being prepared for launch and ships `noindex, nofollow` +
  `robots.txt Disallow: /` everywhere (dev and production build) until the env
  var `SITE_LAUNCHED=true` is set — see `vite.config.js` / `seo.config.js`. Do
  not hard-code robots values back into `index.html`, and do not flip
  `SITE_LAUNCHED` until the content is final. Pre-launch items: `LAUNCH_CHECKLIST.md`.

## Design and implementation

- Use `.agents/skills/gpt-taste/SKILL.md` as the main visual guide, subject to the user's constraints.
- Current stack: React, Vite, custom CSS, GSAP and `@gsap/react`. No component library, backend or router is needed for this homepage.
- Photography is central. Temporary photos must be clearly identified as placeholders, documented in the asset inventory and replaceable independently of the UI.
- No gradients, glassmorphism, generic SaaS layouts, repetitive rounded cards, unnecessary pills or fabricated marketing claims.
- Use varied editorial sections, strong type, clean edges and generous responsive spacing. Headings must not become narrow walls of text.
- Provide working anchor navigation, keyboard-accessible controls, visible focus states, a usable mobile menu and meaningful link names.
- Respect `prefers-reduced-motion`; disable pinning, scrub effects and continuous motion when requested. Never hide essential content behind animation.
- GSAP must be scoped and cleaned up through `useGSAP` / `gsap.matchMedia`. Do not hijack scrolling.
- Do not create `DESIGN.md` until the user requests it after the browser review.
- Do not publish or contact anyone as part of local development.

## Validation

- Run `npm run build` after implementation changes.
- Run the browser checks with `npm run test:browser` while the local server is running.
- Inspect screenshots on desktop and mobile, including expanded controls and page footer.
- Check overflow, broken images, console errors, navigation, menu keyboard behavior and reduced motion.
- Browser screenshots and reports go in `artifacts/`; generated builds and dependencies are ignored.


## Git and checkpoints

- Use Git checkpoints throughout development.
- Create small, frequent, meaningful commits after stable changes or useful milestones.
- Keep each commit focused; do not mix unrelated changes into large commits.
- Always create a checkpoint before structural changes or major refactoring.
- Commit each completed phase after verifying it in the browser.
- Use clear, descriptive commit messages, such as `feat: build initial homepage`, `feat: refine hero section`, `feat: add course section`, `style: improve responsive spacing`, `fix: correct mobile navigation`, or `chore: optimize image assets`.
- Do not commit clearly broken or incomplete work unless it is explicitly needed as a temporary checkpoint; identify such checkpoints in the commit message.
- Before every significant commit, verify that the project builds and has no obvious errors.
- Never rewrite or delete Git history without an explicit user request.
p