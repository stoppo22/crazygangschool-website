# Launch checklist — Crazy Gang School

Open items before the site goes public. Grouped by who has to act.

## TO PROVIDE (owner supplies the material)

- **Foto originali** — real photographs of the school, its spaces, classes and
  staff to replace the temporary stock images.
  - Hero image: `public/images/placeholder-stage-*` (`src/content.js`,
    `placeholder: true`).
  - Seven course images: `public/images/courses/*` (`src/course-data.js`).
  - Replace each set independently; keep the same file names / sizes or update
    the references. Remove the `placeholder: true` flag and the
    `data-placeholder` attributes once done, plus the related `TODO(launch)`
    comments in `src/content.js`, `src/CourseAccordion.jsx` and
    `src/CoursePage.jsx`.
  - Gallery photos (`public/images/gallery/*`) are archival images from the old
    site — confirm rights, credits and consent, or replace.

- **WhatsApp Business** — confirmed business number and whether it should be
  activated. Currently shown as "non ancora attivo" in both contact sections
  (`src/main.jsx`, `data-future-channel="whatsapp"`; `src/CoursePage.jsx`,
  `.course-contact__pending`). When ready, turn it into a
  `https://wa.me/<number>` link.

## TO VERIFY (confirm, then update copy if needed)

- **Nome "Avviamento"** — the Danza Classica group appears as "AVVIAMENTO??" in
  the original material and is shown as "Avviamento". Confirm the final name.
  `src/course-data.js` (Danza Classica schedule, see the `TODO(content)` comment).

- **Staff attuale** — the published faculty list (`src/content.js`, `faculty`)
  follows the historical teacher page and does not reconcile the alternate
  roster. Confirm who currently teaches and in which discipline. Note in
  `src/FacultySection.jsx` (`TODO(launch)`).

- **Corsi attivi** — confirm which of the seven courses are actually running for
  the current season, and the age ranges / levels shown. Schedules are the
  owner-confirmed ones from 8 September 2026 (`CONTEXT.md`); do not change days
  or time slots without a new confirmation.

- **Testi legali** — `/privacy` and `/cookie` (`src/LegalPage.jsx`) are short
  drafts with `[bracketed]` placeholders. A professional must review them and
  the owner must supply: legal entity name, VAT / tax number, registered
  address, data-retention periods, and the "last updated" dates. See the
  `TODO(launch)` comment in `src/LegalPage.jsx`.

## TECHNICAL (before the first production deploy)

- **Production domain** — set the `SITE_URL` environment variable in the Vercel
  project to the final origin. The fallback in `seo.config.js`
  (`https://www.crazygang.it`) is derived from the `info@crazygang.it` email
  address and must be confirmed. It feeds the canonical URLs, Open Graph URLs,
  `robots.txt` and `sitemap.xml`.
- **Deploy config** — `vercel.json` is committed (build command, output dir,
  `/corsi/*`, `/privacy`, `/cookie` rewrites, asset cache headers).
- **Google Search Console** — after go-live, submit `https://<domain>/sitemap.xml`.
- **Font licence** — confirm Cabinet Grotesk (Fontshare) licensing obligations
  for a public site (`ASSETS.md`).
- **Google reviews** — if a review count / rating count becomes verifiable on
  the listing, an `aggregateRating` can be added to the homepage JSON-LD;
  it is deliberately omitted now (no verified count).
- **Logo master** — confirm the approved logo version and whether a vector
  master is available (`ASSETS.md`).
- **Final alt text and captions** — review image alt text and the faculty photo
  caption before launch.

## Verified and safe to publish (no action needed)

- Address: Largo Orazi e Curiazi, 12, 00181 Roma; Metro A, Colli Albani.
- Map coordinates and Google Maps listing link.
- Google rating 4,8 (shown as a number only, no review text).
- Contact channels: `info@crazygang.it`, 06 7883621, 333 402 7525, Instagram,
  Facebook.
- Course disciplines, age ranges and schedules confirmed by the owner
  (6 and 8 September 2026, `CONTEXT.md`).
