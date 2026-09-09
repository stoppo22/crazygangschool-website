# Privacy notes (internal)

Working document for whoever reviews or maintains the site's privacy setup. Not a
legal document. It records **what the site actually does** (verifiable in code)
and **what still has to be confirmed** by the owner or a privacy professional.

## 1. What the site does — verified in the codebase

- Static site (React + Vite), hosted on **Cloudflare Pages**. No backend, no
  database, no CMS, no login, no forms.
- **No first-party cookies and no client-side storage.** `grep` over `src/` and
  `index.html` for `localStorage` / `sessionStorage` / `document.cookie` /
  `indexedDB` returns nothing.
- **No analytics, tag manager, pixel or A/B tool** in the shipped code.
- **Fonts and images are self-hosted** (`public/fonts/`, `public/images/`). No
  Google Fonts, no third-party image CDN.
- **Google Maps** (`src/LocationSection.jsx`): the `<iframe>` is **not rendered**
  until the visitor clicks "Attiva la mappa". Before the click, no request goes
  to Google. The click is the consent signal; there is no consent-storage cookie
  because the map is re-gated on every page load.
- **Outbound links** (Instagram, Facebook, Google Maps "apri su") are plain
  `<a target="_blank" rel="noreferrer">` — no `Referer` header is sent.
- **Contact** is `mailto:` / `tel:` only. No data passes through the website; the
  visitor's own mail/phone app handles it, and any message lands in the school's
  mailbox.
- **Reviews** (`src/ReviewsSection.jsx`) are five texts + names transcribed
  verbatim from the public Google listing. Static content, no API call.
- The homepage JSON-LD / `noscript` publish the *school's* email, phone and
  address — the business's own data, not a visitor's.

## 2. Personal data actually processed

| Data | Where | Purpose | Legal basis |
| --- | --- | --- | --- |
| IP, user agent, request metadata (edge/CDN logs) | Cloudflare infrastructure | Serve the site, security, aggregate traffic measurement | Legitimate interest (art. 6.1.f) |
| Aggregate page-view stats (once Cloudflare Web Analytics is enabled — cookieless) | Cloudflare | Understand audience size | Legitimate interest (art. 6.1.f) |
| Name, contact, message content | The school's mailbox (off-site) | Answer enquiries, pre-contractual steps | Art. 6.1.b / 6.1.f |
| Data sent to Google after map activation | Google (autonomous controller) | Show the map | Consent for the loading (art. 6.1.a); Google's own basis thereafter |
| Names + opinions of Google reviewers shown on the site | Site content | Testimonials | Legitimate interest / data made public by the data subject; remove on request |
| Faces in gallery photos, incl. minors | Site content | Document school activity | Consent collected by the school (see §4) |

No special-category data is processed *through the website*. No profiling, no
automated decision-making.

## 3. Cookie banner — current position (to confirm with a professional)

No consent banner is shown at the moment. The working rationale — **not a legal
determination**, and to be validated by a privacy professional against the
Garante's 2021 guidelines — is that on this site:

- the site's own code sets **no cookies**;
- the planned analytics (Cloudflare Web Analytics) is described by the vendor as
  **cookieless**, and is not enabled yet;
- the only third-party that can set cookies (Google, via the map) loads **only
  after an explicit click**.

Given this, the current approach is the Cookie Policy page + the in-context note
on the map button, with no up-front banner. This is contingent on the three
points above continuing to hold and on the professional review confirming it.

**This breaks — and a consent manager with prior blocking becomes mandatory — if
anyone later adds:** Google Analytics or any cookie/ID-based analytics, a Meta/
TikTok/LinkedIn pixel, remarketing tags, an embedded YouTube/Vimeo player, a
chat widget, a booking/CRM widget, a font/asset loaded from a third-party CDN, or
reCAPTCHA. Any of these ⇒ update the Cookie Policy and add a CMP.

## 4. To confirm before publishing (not verified here)

- **Data controller identity** — the exact legal subject on the enrolment
  contracts (association / company, or a named natural person) + its tax code /
  VAT number + registered address. Fill the bracket in `src/LegalPage.jsx`
  (`PrivacyPage`). The policy cannot go live with this blank.
- **Retention periods** — for edge/analytics logs and for email correspondence.
  Insert concrete figures in place of "[periodo da definire]".
- **"Ultimo aggiornamento" dates** on both pages.
- **Cloudflare cookies** — check on the live domain (devtools → Application →
  Cookies) whether the Cloudflare infrastructure sets any cookies; if so, list
  each (name, purpose, duration) in the Cookie Policy.
- **Processor arrangements** — the data-processing terms with Cloudflare, with
  the email provider, and with whoever maintains the site (art. 28 GDPR). None of
  these is asserted as already in place in the policy text.
- **International transfers** — the policy only says transfers outside the EU, if
  any, follow Chapter V of the GDPR. The specific mechanism per provider (SCCs,
  adequacy, Data Privacy Framework) should be confirmed and can be added.
- **Gallery / recital image consent** — the school must hold written consent
  (liberatoria) from participants / parents for online publication of
  identifiable images, especially minors, and be able to act on removal
  requests. This is the largest real privacy item and is independent of the
  website's technical setup.
- **Legal review** — the drafts in `src/LegalPage.jsx` are written to be accurate
  and complete for this site, but a privacy professional should validate them
  against the confirmed facts above.

## 5. Keeping it this way

Before merging anything that adds a third-party script, embed, cookie or tracker,
re-read §3. If the change defeats "no non-technical cookie without a user
action", it also requires a consent banner and a Cookie Policy update in the same
change.
