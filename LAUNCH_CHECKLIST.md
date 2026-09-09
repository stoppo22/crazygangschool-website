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

- ~~**WhatsApp Business**~~ — done. Verified number 06 7883621 wired as
  `https://wa.me/39067883621?text=…` in `src/content.js` (`contact.whatsapp`);
  "WhatsApp" CTA active in the contact sections of the homepage and the course
  pages.

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

- **Privacy & Cookie policy** — `/privacy` and `/cookie` (`src/LegalPage.jsx`)
  are complete professional drafts. Before publishing, the owner must:
  - Name the **data controller** (Titolare del trattamento): the exact legal
    subject that appears on the enrolment contracts — the association / company,
    or, if there is no entity, the natural person — with its **tax code / VAT
    number** and registered address. Fill the `[bracketed]` block in
    `src/LegalPage.jsx` (`PrivacyPage`, "Titolare del trattamento").
  - Set the **data-retention periods** (navigation/analytics logs; email
    correspondence) and the **"Ultimo aggiornamento" dates** on both pages.
  - Have the text reviewed by a privacy professional (`PRIVACY-NOTES.md` gives
    the processing inventory so the review is fast).
  - Put the processor relationships in writing: Cloudflare DPA (accepted with
    the Cloudflare ToS), the email provider, and the site's technical maintainer
    (nomina a responsabile ex art. 28 GDPR).
  - After deploy, open browser devtools → Application → Cookies on the live
    domain and record which cookies, if any, the Cloudflare infrastructure sets;
    then list them (name, purpose, duration) in the Cookie Policy.

- **Image consent for gallery / recital photos** — the gallery
  (`public/images/gallery/*`) shows identifiable people, including minors, from
  recitals and shows. Collect written image-consent (liberatoria) from
  participants / parents before keeping the photos online, and be ready to
  remove any on request. This is the highest-priority real privacy item and is
  separate from cookies. (Also confirm rights and credits, or replace with
  originals — see "Foto originali".)

## TECHNICAL (before the first production deploy)

- **Production domain** — set the `SITE_URL` variable in the Cloudflare project
  to the final origin. The fallback in `seo.config.js` is
  `https://www.crazygangschool.com`. Confirm the exact form — `www` vs apex.
  It feeds the `%SITE_URL%` placeholders in `index.html`, the canonical / Open
  Graph URLs, `robots.txt` and `sitemap.xml`.
  - **If two domains are used** (e.g. `crazygangschool.com` and
    `crazygangschool.it`): pick **one** as canonical, set it as `SITE_URL`, and
    make the other **301-redirect** to it at the Cloudflare level. Do not let the
    same content resolve on both without a redirect — it creates duplicate
    content for search engines.
- **Deploy config** — `wrangler.jsonc` (Cloudflare Workers static assets:
  assets-only, `directory: ./dist`, `not_found_handling: "404-page"`) and
  `.nvmrc` (Node 22) are committed. In the Cloudflare project: build command
  `npm run build`, deploy command `npx wrangler deploy`. `public/_redirects`
  (→ `dist/_redirects`) handles the `/corsi/*`, `/privacy`, `/cookie` rewrites;
  `dist/404.html` is served with a real 404 status for any other unknown path.
  No custom `_headers`.
- **Visitor statistics** — turn on **Cloudflare Web Analytics** from the
  Cloudflare dashboard once the domain is connected (Web Analytics → Add a site).
  It is cookieless and Cloudflare injects the beacon automatically for a
  Pages/proxied site — no code change here. Nothing ships until it is enabled.
  Do **not** add Google Analytics or any cookie-based tracker without also adding
  a consent banner with prior blocking and extending the Cookie Policy.
- **Google Search Console** — after go-live, submit `https://<domain>/sitemap.xml`.
- **Font licence** — confirm Cabinet Grotesk (Fontshare) licensing obligations
  for a public site (`ASSETS.md`).
- **Google reviews** — five review texts are published (see "Verified and safe
  to publish"). If a total review count becomes verifiable on the listing, an
  `aggregateRating` can be added to the homepage JSON-LD; it is deliberately
  omitted now (no verified count).
- **Logo master** — confirm the approved logo version and whether a vector
  master is available (`ASSETS.md`).
- **Final alt text and captions** — review image alt text and the faculty photo
  caption before launch.

## Verified and safe to publish (no action needed)

- Address: Largo Orazi e Curiazi, 12, 00181 Roma; Metro A, Colli Albani.
- Map coordinates and Google Maps listing link.
- Google rating 4,8 and five review texts transcribed verbatim from the public
  Google listing (`src/ReviewsSection.jsx`); removable on request per the Privacy
  Policy.
- Contact channels: `info@crazygang.it`, 06 7883621, WhatsApp
  (`wa.me/39067883621`), Instagram, Facebook.
- Course disciplines, age ranges and schedules confirmed by the owner
  (6 and 8 September 2026, `CONTEXT.md`).
