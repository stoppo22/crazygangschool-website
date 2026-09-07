# Asset inventory — Crazy Gang homepage

## Original brand

Source: [documented original PNG](https://static.wixstatic.com/media/ba68a2_19e22ae6d0e446b3bf0048459054a510~mv2.png), recorded in CONTEXT.md. Downloaded 6 September 2026.

- `public/brand/crazy-gang-original.png`: unchanged source, 2307 × 1157 px.
- `public/brand/crazy-gang-{320,640,960}.webp`: lossless responsive reductions, unchanged proportions, colours and transparency.
- `public/favicon.png`: complete logo reduced onto a dark 64 × 64 canvas; small-size detail is necessarily limited.
- Original logo verified visually. Final approved version, rights and vector master: **NEEDS VERIFICATION**. Never redraw, crop, recolour or animate its individual parts.

## Original archival photography

These are photographs published on the original school website, used in this local prototype. They are historical material, not evidence of current classes, staff or availability. Dates, photographer credits, rights, consents and production attribution remain **NEEDS VERIFICATION**. Do not identify pictured people.

| Local variants | Original source | Role and crop |
| --- | --- | --- |
| `public/images/archive-ensemble-{640,1100,1600}.webp` | [Original, 2126 × 1414](https://static.wixstatic.com/media/ba68a2_88e77d0232bc48e7b1c96b50b9edc501~mv2_d_2126_1414_s_2.jpg), [modern dance gallery](https://www.crazygangschool.com/copia-di-galleria) | Stage archive; preserve the ensemble and original wide framing |
| `public/images/archive-sister-act-{640,1100,1600}.webp` | [Original, 3300 × 2156](https://static.wixstatic.com/media/ba68a2_a627e800cd514062845637f777ce34d4~mv2_d_3300_2156_s_2.png), [original homepage](https://www.crazygangschool.com/) | Stage archive; “Sister Act” is the source label, not independently verified attribution. Keep embedded lettering unobscured |

Both originals were visually inspected. Generated variants preserve colour and aspect ratio, with WebP quality 84. Ensemble sizes: 18.6 / 41.9 / 76.2 KB; Sister Act: 50.5 / 137.0 / 281.9 KB. Captions describe provenance without inventing dates or credits. Descriptive alt text refers only to visible subjects.

Placement, responsive sources, intrinsic dimensions, alternative text, captions and focal positions are centralized in `src/content.js`. CSS controls layout. No photo is presented as a specific lesson or matched to a named teacher.

Reproduce assets with `python scripts/prepare-archive.py` (Python and Pillow; downloads only the documented public originals). No image-generation or artistic alteration was used.

## Temporary photography for hero and disciplines

The redesign currently uses one placeholder placement in the hero. It is an existing stock photograph, **not a photograph of Crazy Gang School, its students, teachers or lessons**. The placement has a visible “Fotografia segnaposto” caption and empty decorative alt text. Both prepared source sets remain independently replaceable for later approved photography.

| Responsive variants | Intrinsic source size | Roles / replacement |
| --- | --- | --- |
| `public/images/placeholder-stage-{480,900,1300}.webp` | 1400 × 1869 px | Current hero image; replace with approved school photography |
| `public/images/placeholder-studio-{480,900,1100}.webp` | 1100 × 1650 px | Prepared alternative, not currently loaded; available for a later independent placement |

WebP quality 82. Stage variants: 19.5 / 49.5 / 82.7 KB; studio: 16.5 / 41.1 / 59.4 KB. Prepared from the local source JPEGs using `python scripts/prepare-placeholders.py` (Python and Pillow, no downloads). Source files are unaltered; the interface applies a removable monochrome and blue colour treatment in CSS.

The photographic placeholders illustrate composition only. Juxtaposition with course names does not identify a lesson, age group or discipline. The site footer identifies the mix of placeholders and archive photography.

## Original stock files and retired favicon

The two original JPEGs are retained as sources for the responsive placeholders. The browser loads the optimized variants:
- `public/images/dance-stage.jpg`: https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1400&q=85
- `public/images/dance-studio.jpg`: https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1100&q=85

These are **placeholders, not photographs of Crazy Gang School**. The old `public/favicon.svg` is also a retired provisional treatment, not an official logo.

## Temporary course photography

The seven course images are visual placeholders downloaded on 6 September 2026. They are **not photographs of Crazy Gang School, its students, teachers or lessons** and do not document the current courses. Every placement is labelled “Foto segnaposto” or “Fotografia segnaposto” in the interface. Replace each set independently when original, approved school photography is available.

| Local responsive variants | Photographer / source page | Current visual role |
| --- | --- | --- |
| `public/images/courses/dance-modern-{640,1200,1800}.webp` | Israyosoy S. · [Pexels](https://www.pexels.com/photo/contemporary-dancer-in-vibrant-motion-28972636/) | Danza Moderna |
| `public/images/courses/dance-classical-{640,1200,1800}.webp` | Đậu Photograph · [Pexels](https://www.pexels.com/photo/artistic-dance-pose-in-modern-ballet-studio-30826528/) | Danza Classica |
| `public/images/courses/tap-{640,1200,1800}.webp` | Jay Brand · [Pexels](https://www.pexels.com/photo/32448644) | Tip Tap |
| `public/images/courses/kpop-{640,1200,1800}.webp` | Yan Krukau · [Pexels](https://www.pexels.com/photo/a-group-of-people-dancing-7312375/) | K-Pop |
| `public/images/courses/kung-fu-{640,1200,1800}.webp` | Alireza Heidarpour · [Pexels](https://www.pexels.com/photo/martial-artist-in-focused-kung-fu-pose-29817841/) | Kung Fu |
| `public/images/courses/hip-hop-{640,1200,1800}.webp` | Beatriz Braga · [Pexels](https://www.pexels.com/photo/street-dancer-performing-break-dance-11063348/) | Hip Hop |
| `public/images/courses/latin-{640,1200,1800}.webp` | Nathana Rebouças · [Unsplash](https://unsplash.com/photos/couple-dancing-photograph-Zunukrg0Grg) | Danze Latino Americane |

The browser loads only local WebP variants. Source-page links and credits are also centralized in `src/course-data.js`. The downloaded source JPEGs are retained in `source-assets/course-placeholders/`, outside the public browser payload. Rebuild the responsive sets with `python scripts/prepare-course-placeholders.py` (Pillow, WebP quality 82). The script performs resizing only; it does not generate or artistically alter images.

## Original teacher portraits

The 13 portraits in `public/images/teachers/` were downloaded on 6 September 2026 from the corresponding named image links on the official [Insegnanti page](https://www.crazygangschool.com/insegnanti). They are matched only to the names attached to those images on that page; no stock portrait is used for a real person. The original JPEG files are retained in `source-assets/teacher-originals/` and the browser-ready WebP files can be reproduced with `python scripts/prepare-teacher-images.py`.

These are source-site materials for the local prototype. Current staff composition, image rights, photographer credits and consent for reuse remain **NEEDS VERIFICATION** before launch. The interface states that the published list requires confirmation.

## Typography and launch

Cabinet Grotesk comes from [Fontshare](https://www.fontshare.com/fonts/cabinet-grotesk). Locally hosted WOFF2 weights: 400, 500, 700, 800, 900. `public/fonts/fontshare-source.css` records source URLs. Confirm font license obligations before launch.

## External Google Maps links and review data

The homepage includes a click-to-activate map in the separate location section. The location and reviews sections link to the public [Crazy Gang School Google Maps listing](https://www.google.com/maps/place/Crazy+Gang+School/@41.8724821,12.5294285,17z/data=!3m1!4b1!4m6!3m5!1s0x132f61f808a89c81:0xe5f28e8c08f3ea59!8m2!3d41.8724821!4d12.5294285!16s%2Fg%2F11cs2v__pm).

The public listing displayed a 4.8 rating on 6 September 2026. In the limited public view available during verification, Google did not expose a reliable review count, author names or complete review texts. The prototype therefore shows the verified rating only and explicitly leaves the review excerpts unpublished. Add excerpts only after direct verification against the listing.

No remote image, font, video or tracking embed is loaded by the homepage or course pages. The location iframe is the only remote embed and remains non-interactive until explicitly activated. The site remains a local, noindex prototype. Confirm placeholder licenses, archival image rights/credits, logo approval, current operational content and final alt/captions before public launch.
## Animated gallery archive

The gallery uses 28 photographs from the official Crazy Gang website, prepared as local 640 px, 960 px and 1600 px WebP variants. Exact CDN identifiers are preserved in `scripts/prepare-gallery.py`; provenance, labels, categories, responsive paths and dimensions are centralized in `src/gallery-data.js`.

These are historical source-site materials, not evidence of current classes or staff. Photographer credits, image rights, consent and dates remain **NEEDS VERIFICATION** before launch.
