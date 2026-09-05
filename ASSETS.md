# Asset inventory — temporary homepage

All photographs in this version are **visual placeholders, not photographs of Crazy Gang School, its students, teachers or productions**. They are labelled in the UI and must be replaced by approved original school photographs before public launch. No portrait is paired with a real teacher's name.

| Local file | Source | Current role | Replacement needed |
| --- | --- | --- | --- |
| `public/images/dance-stage.jpg` | https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1400&q=85 | Hero and stage atmosphere; monochrome dancer | Original performance photograph with dark negative space |
| `public/images/dance-studio.jpg` | https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1100&q=85 | Discipline panels, inline crop, movement story | Original lesson and rehearsal photography |

Placement and crop are centralized in `src/content.js`. Responsive aspect ratios live in CSS. Photos are decorative with empty alternative text because they do not provide factual information about the school; visible captions explicitly identify their placeholder status.

Cabinet Grotesk comes from [Fontshare](https://www.fontshare.com/fonts/cabinet-grotesk). Locally hosted WOFF2 weights: 400, 500, 700, 800, 900. `public/fonts/fontshare-source.css` records the source URLs returned by Fontshare. Only the locally hosted font files are requested by the page.

The textual wordmark and favicon are provisional treatments of the name, not a replacement of an approved official logo. The historical logo remains documented in `CONTEXT.md`.

Before launch: replace temporary photos, confirm rights and credits, approve the logo, provide suitable alt text for factual photos, confirm font license obligations and supply final image sizes/formats. No remote image, font, video, map or tracking embed is loaded by the homepage.
