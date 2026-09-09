// Single source of truth for production SEO metadata (Node / build context).
// The browser reads the same base URL through the Vite `define` for `__SITE_URL__`
// (see vite.config.js and src/site.js).
//
// Dominio di produzione. Alimenta canonical, Open Graph, robots.txt, sitemap.xml
// e i placeholder %SITE_URL% in index.html.
// TODO(launch): confermare il dominio definitivo e impostarlo con la variabile
// d'ambiente SITE_URL nel progetto Cloudflare Pages. Se si usano più domini
// (es. crazygangschool.com e crazygangschool.it), SOLO UNO è quello canonico
// impostato qui; gli altri devono fare redirect 301 verso di esso a livello
// Cloudflare, per evitare contenuti duplicati.
export const SITE_URL = (process.env.SITE_URL || 'https://www.crazygangschool.com').replace(/\/$/, '');

// Safety switch: the site is served noindex/nofollow AND robots.txt "Disallow: /"
// even on a production build, until this is explicitly flipped. Set the env var
// SITE_LAUNCHED=true in the Cloudflare project ONLY when the content is final and
// the site is meant to be public.
export const LAUNCHED = process.env.SITE_LAUNCHED === 'true';

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
