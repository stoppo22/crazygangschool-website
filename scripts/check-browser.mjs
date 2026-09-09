import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';

// In production, arbitrary unknown paths (e.g. /qualcosa, bare /corsi) are served
// by Cloudflare Pages from the static 404.html with a real 404 status — NOT by
// the app. The Vite dev/preview servers fall back to index.html for those, so
// that path is checked here against the built file, not the running server.
// (The browser 404 checks further down only cover invalid /corsi/* slugs, which
// _redirects sends to the app.)
for (const dir of ['public', 'dist']) {
  const file = `${dir}/404.html`;
  if (dir === 'public') assert.ok(existsSync(file), `${file} missing`);
  if (!existsSync(file)) continue;
  const html = await readFile(file, 'utf8');
  assert.match(html, /lang="it"/, `${file}: missing lang="it"`);
  assert.match(html, /Pagina non trovata/, `${file}: missing heading`);
  assert.match(html, /name="robots" content="noindex/, `${file}: not noindex`);
  assert.doesNotMatch(html, /rel="canonical"/, `${file}: error page must not canonicalize`);
  assert.match(html, /href="\/"/, `${file}: missing home link`);
}

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const executablePath = process.env.BROWSER_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const errors = [];
const results = [];
const courseRoutes = [
  ['danza-moderna', 'Danza Moderna'],
  ['danza-classica', 'Danza Classica'],
  ['tip-tap', 'Tip Tap'],
  ['k-pop', 'K-Pop'],
  ['kung-fu', 'Kung Fu'],
  ['hip-hop', 'Hip Hop'],
  ['danze-latino-americane', 'Danze Latino Americane'],
];

try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['small-mobile', 320, 740], ['tablet', 768, 1024], ['small-desktop', 1024, 768]]) {
    console.log(`Checking ${name}`);
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: width < 600, hasTouch: width < 600 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error') errors.push(`${name}: ${message.text()}`); });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => { for (const img of document.images) img.loading = 'eager'; });
    await page.waitForTimeout(800);
    assert.equal(await page.locator('h1').count(), 1);
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      imagesBroken: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
      hiddenWords: [...document.querySelectorAll('.story-word')].filter(word => Number(getComputedStyle(word).opacity) < .95).length,
    }));
    assert.ok(layout.scrollWidth <= layout.width, `${name}: horizontal overflow`);
    assert.deepEqual(layout.imagesBroken, [], `${name}: broken images`);
    assert.equal(layout.hiddenWords, 0, `${name}: reduced motion hides story`);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
    const brand = await page.locator('.site-header .brand img').evaluate(img => ({ alt: img.alt, ratio: img.getBoundingClientRect().width / img.getBoundingClientRect().height }));
    assert.equal(brand.alt, 'Crazy Gang School');
    assert.ok(Math.abs(brand.ratio - 2307 / 1157) < .03, `${name}: logo distorted`);
    assert.equal(await page.locator('.course-panel').count(), 7);
    assert.equal(await page.locator('[data-placeholder]').count(), 8);
    assert.equal(await page.locator('.sticky-scroll,.school-story,.sticky-scroll__step').count(), 0);
    assert.equal(await page.locator('#dove-siamo iframe').count(), 0, `${name}: map iframe present before consent`);
    assert.equal(await page.locator('.facts-bento,.people,.archive').count(), 0);
    assert.equal(await page.locator('.hero-description p').count(), 2);
    assert.equal(await page.locator('.hero-aside,[data-location]').count(), 0);
    assert.deepEqual(await page.locator('main>section').evaluateAll(sections => sections.map(section => section.id)), ['inizio', 'discipline', 'docenti', 'ospiti', 'recensioni', 'galleria', 'dove-siamo', 'contatti']);
    assert.deepEqual(await page.locator('.course-panel').evaluateAll(links => links.map(link => link.getAttribute('href'))), courseRoutes.map(([slug]) => `/corsi/${slug}`));
    if (width > 820) {
      assert.deepEqual(await page.locator('.magic-tab>a').allTextContents(), ['La scuola', 'Corsi', 'Insegnanti', 'Recensioni', 'Galleria', 'Dove siamo', 'Contatti']);
      assert.equal(await page.locator('.magic-tab').count(), 1);
      assert.equal(await page.locator('.magic-tab>a[aria-current="page"]').textContent(), 'La scuola');
      assert.equal(await page.locator('.nav-cta').textContent(), 'Contattaci ');
      const initialIndicator = await page.locator('.magic-tab__indicator').boundingBox();
      await page.getByRole('link', { name: 'Insegnanti', exact: true }).hover();
      const previewIndicator = await page.locator('.magic-tab__indicator').boundingBox();
      assert.ok(previewIndicator.x > initialIndicator.x, `${name}: Magic Tab did not move on hover`);
      await page.getByRole('link', { name: 'La scuola', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Corsi');
    } else {
      assert.equal(await page.locator('.magic-tab:visible').count(), 0);
      assert.ok(await page.locator('.course-panel').evaluateAll(elements => elements.every(element => {
        const style = getComputedStyle(element);
        return Number(style.opacity) === 1 && style.transform === 'none';
      })), `${name}: reduced motion leaves mobile content transformed`);
    }
    const clipped = await page.locator('h1,h2,h3,.course-panel[data-active="true"] .course-panel__content strong,.course-panel__compact').evaluateAll(elements => elements.flatMap(element => Number(getComputedStyle(element).opacity) > .05 ? [...element.getClientRects()].filter(rect => rect.left < -1 || rect.right > innerWidth + 1).map(() => element.textContent) : []));
    assert.deepEqual(clipped, [], `${name}: clipped heading`);
    for (const href of new Set(await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href'))))) assert.equal(await page.locator(href).count(), 1, `Missing anchor ${href}`);
    await page.screenshot({ path: `artifacts/${name}-hero.png` });
    await page.locator('#discipline').scrollIntoViewIfNeeded();
    await page.waitForTimeout(180);
    if (width > 820) assert.equal(await page.locator('.magic-tab>a[aria-current="page"]').textContent(), 'Corsi');
    await page.screenshot({ path: `artifacts/${name}-courses.png` });
    if (width > 820) {
      await page.mouse.move(0, 0);
      await page.locator('.course-panel').nth(3).focus();
      await page.waitForFunction(() => document.querySelectorAll('.course-panel')[3]?.dataset.active === 'true');
      assert.equal(await page.locator('.course-panel').nth(3).getAttribute('data-active'), 'true');
      assert.equal(await page.locator('.course-panel').nth(3).getAttribute('aria-expanded'), 'true');
    } else {
      assert.ok(await page.locator('.course-panel').first().evaluate(link => link.getBoundingClientRect().height >= 300));
    }
    await page.locator('#docenti').scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    assert.ok(await page.locator('.direction').evaluate((direction, selector) => direction.compareDocumentPosition(document.querySelector(selector)) & Node.DOCUMENT_POSITION_FOLLOWING, '.faculty-selector'));
    assert.deepEqual(await page.locator('.direction article strong').allTextContents(), ['Marco Stopponi', 'Stefano Stopponi']);
    assert.equal(await page.locator('.faculty-list .godui-accordion__trigger').count(), 13);
    assert.equal(await page.locator('.faculty-list .faculty-row__role').count(), 0);
    assert.equal(await page.locator('.faculty-list .godui-accordion__item[data-open="true"]').count(), 0);
    if (width > 820) {
      assert.equal(await page.locator('.magic-tab>a[aria-current="page"]').textContent(), 'Insegnanti');
      assert.equal(await page.locator('.faculty-preview img').count(), 0);
      assert.equal(await page.locator('.faculty-empty').count(), 1);
      const teacherTriggers = page.locator('.faculty-list .godui-accordion__trigger');
      await teacherTriggers.nth(7).hover();
      await page.waitForTimeout(500);
      assert.ok((await page.locator('.faculty-preview img').getAttribute('src')).includes('emiliano-dangelo'));
      await teacherTriggers.nth(7).click();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);
      assert.equal(await teacherTriggers.nth(7).getAttribute('aria-expanded'), 'true');
      assert.ok((await page.locator('.faculty-preview img').getAttribute('src')).includes('emiliano-dangelo'));
      assert.ok((await page.locator('.faculty-preview > * .faculty-preview__identity strong').textContent()).includes("Emiliano D'Angelo"));
      await teacherTriggers.nth(7).focus();
      await page.keyboard.press('ArrowDown');
      assert.ok((await page.evaluate(() => document.activeElement?.textContent)).includes('Gaia Stopponi'));
    } else {
      assert.equal(await page.locator('.faculty-preview:visible').count(), 0);
      assert.equal(await page.locator('.faculty-mobile-profile:visible').count(), 0);
      assert.equal(await page.locator('.faculty-list:visible').count(), 0);
      await page.getByRole('button', { name: 'Vedi tutti gli insegnanti' }).click();
      assert.equal(await page.locator('.faculty-list:visible').count(), 1);
      const teacherTriggers = page.locator('.faculty-list .godui-accordion__trigger');
      await teacherTriggers.nth(1).click();
      await page.waitForTimeout(200);
      assert.equal(await page.locator('.faculty-list:visible').count(), 0);
      assert.equal(await page.locator('.faculty-mobile-profile:visible').count(), 1);
      assert.ok((await page.locator('.faculty-mobile-profile img').getAttribute('src')).includes('stefano-stopponi'));
    }
    await page.screenshot({ path: `artifacts/${name}-faculty.png` });
    await page.locator('#recensioni').scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
    assert.equal((await page.locator('.reviews__rating strong').textContent()).trim(), '4,8');
    assert.equal(await page.locator('#recensioni .review-carousel').count(), 1);
    assert.equal(await page.locator('#recensioni .review-card').count(), 5);
    assert.equal(await page.locator('#recensioni blockquote').count(), 5);
    assert.equal(await page.locator('#recensioni .review-card footer strong').first().textContent(), 'Martina');
    assert.equal(await page.locator('#recensioni .review-card time').count(), 0);
    assert.equal(await page.locator('.review-carousel__controls button:disabled').count(), 0);
    // Carousel pages by how many cards are visible: 2 pages on desktop (3-up), 5 on mobile (1-up).
    const expectedPages = width > 820 ? 2 : 5;
    const pageLabel = () => page.locator('.review-carousel__controls span').textContent().then(t => t.trim());
    assert.equal(await pageLabel(), `1 di ${expectedPages}`);
    for (let step = 1; step < expectedPages; step++) {
      await page.locator('.review-carousel__controls button').last().click();
      await page.waitForTimeout(220);
    }
    assert.equal(await pageLabel(), `${expectedPages} di ${expectedPages}`);
    assert.ok(await page.locator('#recensioni .review-card').last().evaluate(el => {
      const r = el.getBoundingClientRect();
      return r.left >= -1 && r.right <= innerWidth + 1;
    }), `${name}: last review not reachable`);
    await page.locator('.review-carousel__controls button').last().click(); // wraps to first page
    await page.waitForTimeout(220);
    assert.equal(await pageLabel(), `1 di ${expectedPages}`);
    assert.deepEqual((await page.locator('.reviews__actions>a').allTextContents()).map(text => text.replace('(nuova scheda)', '').trim()), ['Leggi tutte le recensioni']);
    assert.ok(await page.locator('.reviews__actions>a').evaluateAll(links => links.every(link => link.href.startsWith('https://www.google.com/maps/place/Crazy+Gang+School/'))));
    assert.deepEqual(await page.locator('#ospiti h2').textContent(), 'Ospiti della struttura');
    assert.deepEqual(await page.locator('#ospiti .guests__links a').evaluateAll(links => links.map(a => `${a.textContent.replace('(nuova scheda)', '').trim()}|${a.href}|${a.target}|${a.rel}`)), ['AID Musical|http://www.aidmusical.it/|_blank|noreferrer', 'Musical Passion|https://www.musicalpassionschool.com/|_blank|noreferrer']);
    if (width > 820) assert.equal(await page.locator('.magic-tab>a[aria-current="page"]').textContent(), 'Recensioni');
    await page.screenshot({ path: `artifacts/${name}-reviews.png` });
    await page.locator('#galleria').scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
    assert.equal(await page.locator('.gallery-photo').count(), 0);
    assert.equal(await page.locator('.tile-reveal--static').count(), 1);
    assert.equal(await page.locator('.gallery-archive').count(), 0);
    assert.equal(await page.locator('.gallery-viewer').count(), 0);
    const galleryOpener = page.locator('.gallery-curtain__action');
    await galleryOpener.click();
    assert.equal(await page.locator('.gallery-archive').count(), 1);
    assert.equal(await page.locator('.gallery-photo').count(), 28);
    assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    const photoOpener = page.locator('.gallery-archive__grid .gallery-photo button').nth(7);
    await photoOpener.click();
    assert.equal(await page.locator('.gallery-viewer').count(), 1);
    assert.equal(await page.locator('.gallery-viewer__stage figure').count(), 1);
    assert.equal((await page.locator('.gallery-viewer header span').textContent()).trim(), '08 / 28');
    await page.keyboard.press('ArrowRight');
    assert.equal((await page.locator('.gallery-viewer header span').textContent()).trim(), '09 / 28');
    await page.locator('.gallery-viewer__stage img').waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.querySelector('.gallery-viewer__stage img')?.naturalWidth > 0);
    if (width <= 820) {
      await page.locator('.gallery-viewer__stage').evaluate(stage => {
        const point = (identifier, clientX) => new Touch({ identifier, target: stage, clientX, clientY: 400, screenX: clientX, screenY: 400, pageX: clientX, pageY: 400 });
        stage.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [point(1, 300)] }));
        stage.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [point(1, 180)] }));
      });
      assert.equal((await page.locator('.gallery-viewer header span').textContent()).trim(), '10 / 28');
    }
    await page.screenshot({ path: `artifacts/${name}-gallery-open.png` });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.gallery-viewer').count(), 0);
    await page.waitForTimeout(50);
    assert.equal(await photoOpener.evaluate(button => document.activeElement === button), true);
    await page.screenshot({ path: `artifacts/${name}-gallery.png` });
    await page.locator('.gallery-archive__close').click();
    assert.equal(await page.locator('.gallery-archive').count(), 0);
    await page.waitForTimeout(50);
    assert.equal(await galleryOpener.evaluate(button => document.activeElement === button), true);
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.locator('#dove-siamo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
    assert.equal(await page.locator('#dove-siamo address').textContent(), 'Crazy Gang SchoolLargo Orazi e Curiazi, 1200181 Roma');
    assert.equal(await page.locator('#dove-siamo').getByText('Metro A · Colli Albani', { exact: true }).count(), 1);
    assert.equal(await page.locator('#dove-siamo a[href*="google.com/maps"]').count(), 1);
    // Google Maps is consent-gated: the iframe is not in the DOM until activated,
    // and the pre-activation note links to the Cookie Policy.
    assert.equal(await page.locator('#dove-siamo iframe').count(), 0);
    assert.equal(await page.locator('#dove-siamo .location-map__note a[href="/cookie"]').count(), 1);
    await page.getByRole('button', { name: /Attiva la mappa/ }).click();
    assert.equal(await page.locator('#dove-siamo iframe').count(), 1);
    assert.equal(await page.locator('#dove-siamo .location-map__note').count(), 0);
    assert.equal(await page.locator('#dove-siamo iframe').evaluate(frame => getComputedStyle(frame).pointerEvents), 'auto');
    await page.getByRole('button', { name: 'Nascondi mappa' }).click();
    assert.equal(await page.locator('#dove-siamo iframe').count(), 0);
    if (width > 820) assert.equal(await page.locator('.magic-tab>a[aria-current="page"]').textContent(), 'Dove siamo');
    await page.screenshot({ path: `artifacts/${name}-location.png` });
    if (width <= 820) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      assert.ok(await page.locator('#menu-mobile').isVisible());
      assert.deepEqual((await page.locator('#menu-mobile>a').allTextContents()).map(text => text.trim()), ['La scuola', 'Corsi', 'Insegnanti', 'Recensioni', 'Galleria', 'Dove siamo', 'Contatti', 'Contattaci']);
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      await page.screenshot({ path: `artifacts/${name}-menu.png` });
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false');
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Menu');
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    }
    await page.locator('#contatti').scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
    assert.equal(await page.locator('#contatti address,#contatti iframe').count(), 0);
    assert.equal(await page.locator('#contatti a[href^="mailto:"]').count(), 1);
    assert.equal(await page.locator('#contatti a[href^="tel:"]').count(), 1);
    assert.equal(await page.locator('#contatti a[href*="instagram"],#contatti a[href*="facebook"]').count(), 2);
    // WhatsApp CTA (verified number, prefilled message, opens in a new tab)
    const wa = page.locator('#contatti a[href^="https://wa.me/"]');
    assert.equal(await wa.count(), 1, `${name}: WhatsApp CTA missing`);
    const waHref = await wa.getAttribute('href');
    assert.equal(waHref, 'https://wa.me/39067883621?text=Ciao%2C%20avrei%20bisogno%20di%20alcune%20informazioni.', `${name}: wrong WhatsApp href`);
    assert.equal(new URL(waHref).searchParams.get('text'), 'Ciao, avrei bisogno di alcune informazioni.', `${name}: wrong WhatsApp prefilled message`);
    assert.equal(await wa.getAttribute('target'), '_blank', `${name}: WhatsApp not target=_blank`);
    assert.equal(await wa.getAttribute('rel'), 'noreferrer', `${name}: WhatsApp rel not noreferrer`);
    assert.equal((await wa.locator('strong').textContent()).trim(), 'WhatsApp', `${name}: wrong WhatsApp CTA text`);
    if (width > 820) assert.equal(await page.locator('.magic-tab>a[aria-current="page"]').textContent(), 'Contatti');
    await page.screenshot({ path: `artifacts/${name}-contacts.png` });
    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/${name}-footer.png` });
    await page.evaluate(() => scrollTo(0, 0));
    if (name === 'desktop' || name === 'mobile') await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
    results.push({ name, viewport: { width, height }, ...layout, passed: true });
    await context.close();
    console.log(`Passed ${name}`);
  }

  const courseContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const coursePage = await courseContext.newPage();
  coursePage.on('pageerror', error => errors.push(`courses: ${error.message}`));
  coursePage.on('console', message => { if (message.type() === 'error') errors.push(`courses: ${message.text()}`); });
  for (const [slug, title] of courseRoutes) {
    console.log(`Checking course: ${slug}`);
    await coursePage.goto(`${baseURL}/corsi/${slug}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await coursePage.evaluate(() => document.fonts.ready);
    await coursePage.evaluate(() => { for (const img of document.images) img.loading = 'eager'; });
    await coursePage.waitForTimeout(450);
    assert.equal(await coursePage.locator('h1').textContent(), title);
    assert.equal(await coursePage.locator('.course-fact').count(), 3);
    assert.ok(await coursePage.locator('[data-schedule-group]').count() >= 1, `${slug}: missing schedule groups`);
    assert.ok(await coursePage.locator('.schedule-session').count() >= 1, `${slug}: missing schedule sessions`);
    assert.equal(await coursePage.getByText('Orari in aggiornamento. Contatta la scuola per informazioni.', { exact: true }).count(), 0);
    assert.equal(await coursePage.locator('a[href="/#discipline"]').count(), 3);
    assert.ok((await coursePage.locator('a[href^="mailto:"]').count()) >= 2);
    const courseWa = coursePage.locator('.course-contact a[href^="https://wa.me/"]');
    assert.equal(await courseWa.count(), 1, `${slug}: WhatsApp CTA missing`);
    assert.equal(await courseWa.getAttribute('href'), 'https://wa.me/39067883621?text=Ciao%2C%20avrei%20bisogno%20di%20alcune%20informazioni.', `${slug}: wrong WhatsApp href`);
    assert.equal(await courseWa.getAttribute('target'), '_blank', `${slug}: WhatsApp not target=_blank`);
    assert.equal(await courseWa.getAttribute('rel'), 'noreferrer', `${slug}: WhatsApp rel not noreferrer`);
    assert.equal((await courseWa.locator('strong').textContent()).trim(), 'WhatsApp', `${slug}: wrong WhatsApp CTA text`);
    const courseLayout = await coursePage.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      imagesBroken: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
    }));
    assert.ok(courseLayout.scrollWidth <= courseLayout.width, `${slug}: horizontal overflow`);
    assert.deepEqual(courseLayout.imagesBroken, [], `${slug}: broken images`);
    // Per-page SEO metadata
    assert.match(await coursePage.title(), new RegExp(title), `${slug}: page title missing course name`);
    assert.ok((await coursePage.locator('meta[name="description"]').getAttribute('content'))?.length > 30, `${slug}: missing meta description`);
    assert.ok((await coursePage.locator('link[rel="canonical"]').getAttribute('href')).endsWith(`/corsi/${slug}`), `${slug}: wrong canonical`);
    const ld = await coursePage.locator('script[type="application/ld+json"]').last().textContent();
    assert.ok(ld.includes('"@type":"Course"') && ld.includes(title), `${slug}: missing Course JSON-LD`);
    assert.equal(await coursePage.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow', `${slug}: dev robots not noindex`);
  }
  await coursePage.goto(`${baseURL}/corsi/danza-moderna`, { waitUntil: 'domcontentloaded' });
  await coursePage.screenshot({ path: 'artifacts/course-danza-moderna-desktop.png', fullPage: true });

  // React noindex 404 view — only for invalid /corsi/* slugs. In production these
  // match the `/corsi/* -> /index.html 200` rewrite in public/_redirects, so the
  // app loads and renders this view (HTTP 200). Arbitrary unknown paths do NOT
  // reach the app in production (they get the static 404.html, checked at the top
  // of this file); testing them against the dev server would assert non-prod
  // behaviour.
  for (const badPath of ['/corsi/non-esiste', '/corsi/pippo']) {
    console.log(`Checking React 404: ${badPath}`);
    await coursePage.goto(`${baseURL}${badPath}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await coursePage.waitForTimeout(250);
    assert.equal(await coursePage.locator('.not-found-main').count(), 1, `${badPath}: no 404 view`);
    assert.equal(await coursePage.locator('h1').textContent(), 'Pagina non trovata', `${badPath}: wrong 404 heading`);
    // Exactly the value NotFoundPage passes explicitly (not the dev-server default),
    // so this proves the client-side 404 keeps itself out of the index.
    assert.equal(await coursePage.locator('meta[name="robots"][data-managed-head]').getAttribute('content'), 'noindex, follow', `${badPath}: 404 not noindex`);
    assert.equal(await coursePage.locator('meta[name="robots"]').count(), 1, `${badPath}: duplicate robots meta`);
    // The error view must not canonicalize (to the homepage or anywhere).
    assert.equal(await coursePage.locator('link[rel="canonical"]').count(), 0, `${badPath}: 404 must not have a canonical`);
    assert.equal(await coursePage.locator('a[href="/"]').count() >= 1, true, `${badPath}: 404 missing home link`);
  }
  await coursePage.screenshot({ path: 'artifacts/not-found.png' });

  // Legal pages render and stay out of the index on the dev server
  for (const [path, heading] of [['/privacy', 'Privacy Policy'], ['/cookie', 'Cookie Policy']]) {
    console.log(`Checking legal page: ${path}`);
    await coursePage.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await coursePage.waitForTimeout(200);
    assert.equal(await coursePage.locator('.legal-main h1').textContent(), heading, `${path}: wrong heading`);
    assert.ok(await coursePage.locator('.legal-main section').count() >= 4, `${path}: too few sections`);
    assert.ok((await coursePage.locator('link[rel="canonical"]').getAttribute('href')).endsWith(path), `${path}: wrong canonical`);
    assert.match(await coursePage.locator('meta[name="robots"]').getAttribute('content'), /noindex/, `${path}: dev robots not noindex`);
    assert.equal(await coursePage.locator('.course-footer a[href="/cookie"]').count(), 1, `${path}: missing footer cookie link`);
    const legalLayout = await coursePage.evaluate(() => ({ w: innerWidth, sw: document.documentElement.scrollWidth }));
    assert.ok(legalLayout.sw <= legalLayout.w + 1, `${path}: horizontal overflow`);
  }
  await coursePage.screenshot({ path: 'artifacts/cookie.png', fullPage: true });
  await coursePage.goto(`${baseURL}/privacy`, { waitUntil: 'domcontentloaded' });
  await coursePage.screenshot({ path: 'artifacts/privacy.png', fullPage: true });
  await courseContext.close();

  const mobileCourseContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
  const mobileCourse = await mobileCourseContext.newPage();
  mobileCourse.on('pageerror', error => errors.push(`course-mobile: ${error.message}`));
  mobileCourse.on('console', message => { if (message.type() === 'error') errors.push(`course-mobile: ${message.text()}`); });
  await mobileCourse.goto(`${baseURL}/corsi/danze-latino-americane`, { waitUntil: 'domcontentloaded' });
  await mobileCourse.evaluate(() => document.fonts.ready);
  await mobileCourse.evaluate(() => { for (const img of document.images) img.loading = 'eager'; });
  await mobileCourse.waitForTimeout(600);
  const mobileLayout = await mobileCourse.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, broken: [...document.images].filter(img => !img.complete || !img.naturalWidth).length }));
  assert.ok(mobileLayout.scrollWidth <= mobileLayout.width, 'mobile course: horizontal overflow');
  assert.equal(mobileLayout.broken, 0, 'mobile course: broken images');
  await mobileCourse.screenshot({ path: 'artifacts/course-latino-mobile.png', fullPage: true });
  await mobileCourse.locator('.course-footer').scrollIntoViewIfNeeded();
  await mobileCourse.screenshot({ path: 'artifacts/course-latino-mobile-footer.png' });
  await mobileCourseContext.close();

  const mobileMotionContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference', isMobile: true, hasTouch: true });
  const mobileMotion = await mobileMotionContext.newPage();
  mobileMotion.on('pageerror', error => errors.push(`mobile-motion: ${error.message}`));
  mobileMotion.on('console', message => { if (message.type() === 'error') errors.push(`mobile-motion: ${message.text()}`); });
  await mobileMotion.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await mobileMotion.waitForTimeout(350);
  assert.ok(Number(await mobileMotion.locator('.course-panel').last().evaluate(element => getComputedStyle(element).opacity)) < .1, 'Mobile course has no entrance state');
  await mobileMotion.locator('.course-panel').first().scrollIntoViewIfNeeded();
  await mobileMotion.waitForTimeout(850);
  assert.ok(Number(await mobileMotion.locator('.course-panel').first().evaluate(element => getComputedStyle(element).opacity)) > .95, 'Mobile course did not reveal');
  await mobileMotion.screenshot({ path: 'artifacts/mobile-motion-courses.png' });
  await mobileMotionContext.close();

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`motion: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`motion: ${message.text()}`); });
  await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1400);
  assert.ok(await page.locator('.hero-title__line span').evaluateAll(lines => lines.every(line => getComputedStyle(line).transform === 'none')));
  assert.notEqual(await page.locator('.magic-tab__indicator').evaluate(element => getComputedStyle(element).transitionDuration), '0s');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.magic-tab__indicator').evaluate(element => getComputedStyle(element).transitionDuration), '0s');
  assert.ok(await page.locator('.story-word,.photo__frame,.hero-title__line span').evaluateAll(elements => elements.every(el => {
    const style = getComputedStyle(el);
    return style.transform === 'none' && style.opacity === '1';
  })));
  await context.close();
  assert.deepEqual(errors, [], 'Browser console errors');
  await writeFile('artifacts/browser-report.json', JSON.stringify({ baseURL, results, motion: 'passed', errors }, null, 2));
  console.log('Passed: responsive layouts, course routes, images, navigation, menu, footer, motion and reduced motion. Screenshots: artifacts/');
} finally {
  await browser.close();
}
