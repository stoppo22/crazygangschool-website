// Minimal client-side <head> manager for the pathname-rendered pages.
// The static index.html already carries the homepage metadata; this only runs
// for the course pages and the 404 view, which are rendered by JS.
//
// Every tag it creates is marked data-managed-head so a later call can replace
// the previous set cleanly.

import { ROBOTS_DEFAULT } from './site';

const MARK = 'data-managed-head';

function upsert(selector, create) {
  let el = document.head.querySelector(`${selector}[${MARK}]`);
  if (!el) {
    el = create();
    el.setAttribute(MARK, '');
    document.head.appendChild(el);
  }
  return el;
}

function setMeta(attr, key, content) {
  if (content == null) return;
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, key);
    return m;
  });
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  const el = upsert(`link[rel="${rel}"]`, () => {
    const l = document.createElement('link');
    l.setAttribute('rel', rel);
    return l;
  });
  el.setAttribute('href', href);
}

export function applyHead({ title, description, canonical, robots, ogTitle, ogImage, ogType = 'website', jsonLd }) {
  if (title) document.title = title;

  // The static index.html tags (homepage values) must not sit alongside the
  // managed per-page ones, or scrapers may read the wrong copy.
  document.head
    .querySelectorAll(
      'meta[name="description"]:not([' + MARK + ']), ' +
        'meta[name="robots"]:not([' + MARK + ']), ' +
        'meta[name="twitter:card"]:not([' + MARK + ']), ' +
        'meta[property^="og:"]:not([' + MARK + ']), ' +
        'link[rel="canonical"]:not([' + MARK + '])',
    )
    .forEach((el) => el.remove());

  setMeta('name', 'description', description);
  setMeta('name', 'robots', robots || ROBOTS_DEFAULT);
  setLink('canonical', canonical);

  setMeta('property', 'og:title', ogTitle || title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', ogType);
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:image', ogImage);
  setMeta('name', 'twitter:card', 'summary_large_image');

  const scriptEl = upsert('script[type="application/ld+json"]', () => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    return s;
  });
  if (jsonLd) scriptEl.textContent = JSON.stringify(jsonLd);
  else scriptEl.remove();
}
