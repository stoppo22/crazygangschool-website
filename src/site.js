/* global __SITE_URL__, __SITE_DESCRIPTION__, __OG_IMAGE__, __LAUNCHED__ */
// Values injected by Vite `define` from seo.config.js. The fallbacks keep the
// module usable in contexts where define did not run (e.g. plain unit tooling).
export const SITE_URL =
  typeof __SITE_URL__ !== 'undefined' ? __SITE_URL__ : 'https://www.crazygangschool.com';

export const SITE_DESCRIPTION =
  typeof __SITE_DESCRIPTION__ !== 'undefined'
    ? __SITE_DESCRIPTION__
    : 'Scuola di danza a Roma.';

export const OG_IMAGE =
  typeof __OG_IMAGE__ !== 'undefined' ? __OG_IMAGE__ : '/brand/crazy-gang-960.webp';

// Matches the robots meta the Vite SEO plugin writes into index.html: indexable
// only on a production build AND when SITE_LAUNCHED=true; noindex otherwise.
const LAUNCHED = typeof __LAUNCHED__ !== 'undefined' ? __LAUNCHED__ : false;
export const ROBOTS_DEFAULT =
  import.meta.env && import.meta.env.PROD && LAUNCHED ? 'index, follow' : 'noindex, nofollow';

export const absoluteUrl = (path) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
