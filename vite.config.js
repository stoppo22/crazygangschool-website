import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  OG_IMAGE,
  COURSE_SLUGS,
  STATIC_ROUTES,
} from './seo.config.js';

// Emits robots.txt / sitemap.xml at build time and flips the robots meta tag:
// production build => "index, follow"; dev server => "noindex, nofollow".
function seoPlugin() {
  return {
    name: 'crazy-gang-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const isBuild = ctx.server === undefined;
        const robots = isBuild ? 'index, follow' : 'noindex, nofollow';
        return html
          .split('%SITE_URL%').join(SITE_URL)
          .replace(
            /<meta name="robots" content="[^"]*" \/>/,
            `<meta name="robots" content="${robots}" />`,
          );
      },
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = [
        '/',
        ...STATIC_ROUTES,
        ...COURSE_SLUGS.map((slug) => `/corsi/${slug}`),
      ];
      const sitemap =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls
          .map(
            (path) =>
              `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
          )
          .join('\n') +
        '\n</urlset>\n';

      const robotsTxt =
        `# ${SITE_NAME}\n` +
        'User-agent: *\n' +
        'Allow: /\n\n' +
        `Sitemap: ${SITE_URL}/sitemap.xml\n`;

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt });
    },
  };
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
  define: {
    __SITE_URL__: JSON.stringify(SITE_URL),
    __SITE_DESCRIPTION__: JSON.stringify(DEFAULT_DESCRIPTION),
    __OG_IMAGE__: JSON.stringify(OG_IMAGE),
  },
});
