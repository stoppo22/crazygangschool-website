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
| `public/images/archive-ensemble-{640,1100,1600}.webp` | [Original, 2126 × 1414](https://static.wixstatic.com/media/ba68a2_88e77d0232bc48e7b1c96b50b9edc501~mv2_d_2126_1414_s_2.jpg), [modern dance gallery](https://www.crazygangschool.com/copia-di-galleria) | Hero and stage archive; preserve the ensemble and original wide framing |
| `public/images/archive-sister-act-{640,1100,1600}.webp` | [Original, 3300 × 2156](https://static.wixstatic.com/media/ba68a2_a627e800cd514062845637f777ce34d4~mv2_d_3300_2156_s_2.png), [original homepage](https://www.crazygangschool.com/) | Stage archive; “Sister Act” is the source label, not independently verified attribution. Keep embedded lettering unobscured |

Both originals were visually inspected. Generated variants preserve colour and aspect ratio, with WebP quality 84. Ensemble sizes: 18.6 / 41.9 / 76.2 KB; Sister Act: 50.5 / 137.0 / 281.9 KB. Captions describe provenance without inventing dates or credits. Descriptive alt text refers only to visible subjects.

Placement, responsive sources, intrinsic dimensions, alternative text, captions and focal positions are centralized in `src/content.js`. CSS controls layout. No photo is presented as a specific lesson or matched to a named teacher.

Reproduce assets with `python scripts/prepare-archive.py` (Python and Pillow; downloads only the documented public originals). No image-generation or artistic alteration was used.

## Retired prototype assets

The two v1 stock photographs remain on disk for reference but are not used by the revised homepage:
- `public/images/dance-stage.jpg`: https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1400&q=85
- `public/images/dance-studio.jpg`: https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1100&q=85

These are **placeholders, not photographs of Crazy Gang School**. The old `public/favicon.svg` is also a retired provisional treatment, not an official logo.

## Typography and launch

Cabinet Grotesk comes from [Fontshare](https://www.fontshare.com/fonts/cabinet-grotesk). Locally hosted WOFF2 weights: 400, 500, 700, 800, 900. `public/fonts/fontshare-source.css` records source URLs. Confirm font license obligations before launch.

No remote image, font, video, map or tracking embed is loaded by the homepage. The site remains a local, noindex prototype. Confirm archival image rights/credits, logo approval, current operational content and final alt/captions before public launch.

