// Single source of truth for production SEO metadata (Node / build context).
// The browser reads the same base URL through the Vite `define` for `__SITE_URL__`
// (see vite.config.js and src/site.js).
//
// TODO(launch): confermare il dominio di produzione definitivo e impostarlo con
// la variabile d'ambiente SITE_URL (build) — il fallback qui sotto è provvisorio,
// derivato dal dominio email info@crazygang.it.
export const SITE_URL = (process.env.SITE_URL || 'https://www.crazygang.it').replace(/\/$/, '');

export const SITE_NAME = 'Crazy Gang School';

export const DEFAULT_TITLE = 'Crazy Gang School — Scuola di danza a Roma';

export const DEFAULT_DESCRIPTION =
  'Scuola di danza a Roma, zona Colli Albani: danza moderna e classica, hip hop, tip tap, K-pop, danze latino-americane e kung fu per bambini, ragazzi e adulti.';

export const OG_IMAGE = '/brand/crazy-gang-960.webp';

// Course slugs and titles for the sitemap. Kept in sync with src/course-data.js.
export const COURSE_SLUGS = [
  'danza-moderna',
  'danza-classica',
  'tip-tap',
  'k-pop',
  'kung-fu',
  'hip-hop',
  'danze-latino-americane',
];

// Extra indexable routes beyond the homepage and the course pages.
export const STATIC_ROUTES = ['/privacy', '/cookie'];
