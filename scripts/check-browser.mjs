import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';

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
    assert.equal(await page.locator('#dove-siamo iframe').count(), 1);
    assert.equal(await page.locator('.facts-bento,.people,.archive').count(), 0);
    assert.equal(await page.locator('.hero-description p').count(), 2);
    assert.equal(await page.locator('.hero-aside,[data-location]').count(), 0);
    assert.deepEqual(await page.locator('main>section').evaluateAll(sections => sections.map(section => section.id)), ['inizio', 'discipline', 'docenti', 'recensioni', 'galleria', 'dove-siamo', 'contatti']);
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
    assert.equal(await page.locator('.faculty-list .godui-accordion__item[data-open="true"]').count(), 1);
    if (width > 820) {
      assert.equal(await page.locator('.magic-tab>a[aria-current="page"]').textContent(), 'Insegnanti');
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
      assert.equal(await page.locator('.faculty-mobile-profile:visible').count(), 1);
      assert.equal(await page.locator('.faculty-list:visible').count(), 0);
      await page.getByRole('button', { name: 'Vedi tutti gli insegnanti' }).click();
      assert.equal(await page.locator('.faculty-list:visible').count(), 1);
      const teacherTriggers = page.locator('.faculty-list .godui-accordion__trigger');
      await teacherTriggers.nth(1).click();
      await page.waitForTimeout(200);
      assert.equal(await page.locator('.faculty-list:visible').count(), 0);
      assert.ok((await page.locator('.faculty-mobile-profile img').getAttribute('src')).includes('stefano-stopponi'));
    }
    await page.screenshot({ path: `artifacts/${name}-faculty.png` });
    await page.locator('#recensioni').scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
    assert.equal((await page.locator('.reviews__rating strong').textContent()).trim(), '4,8');
    assert.equal(await page.locator('#recensioni [data-review-status="awaiting-verification"]').count(), 1);
    assert.equal(await page.locator('#recensioni blockquote').count(), 0);
    assert.equal(await page.locator('.review-carousel__controls button:disabled').count(), 2);
    assert.deepEqual((await page.locator('.reviews__actions>a').allTextContents()).map(text => text.replace('(nuova scheda)', '').trim()), ['Leggi tutte le recensioni', 'Lascia una recensione']);
    assert.ok(await page.locator('.reviews__actions>a').evaluateAll(links => links.every(link => link.href.startsWith('https://www.google.com/maps/place/Crazy+Gang+School/'))));
    if (width > 820) assert.equal(await page.locator('.magic-tab>a[aria-current="page"]').textContent(), 'Recensioni');
    await page.screenshot({ path: `artifacts/${name}-reviews.png` });
    await page.locator('#dove-siamo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
    assert.equal(await page.locator('#dove-siamo address').textContent(), 'Crazy Gang SchoolLargo Orazi e Curiazi, 1200181 Roma');
    assert.equal(await page.locator('#dove-siamo').getByText('Metro A · Colli Albani', { exact: true }).count(), 1);
    assert.equal(await page.locator('#dove-siamo a[href*="google.com/maps"]').count(), 1);
    assert.equal(await page.locator('#dove-siamo iframe').evaluate(frame => getComputedStyle(frame).pointerEvents), 'none');
    await page.getByRole('button', { name: 'Attiva la mappa' }).click();
    assert.equal(await page.locator('#dove-siamo iframe').evaluate(frame => getComputedStyle(frame).pointerEvents), 'auto');
    await page.getByRole('button', { name: 'Disattiva interazione' }).click();
    assert.equal(await page.locator('#dove-siamo iframe').evaluate(frame => getComputedStyle(frame).pointerEvents), 'none');
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
    assert.equal(await page.locator('#contatti a[href^="tel:"]').count(), 2);
    assert.equal(await page.locator('#contatti a[href*="instagram"],#contatti a[href*="facebook"]').count(), 2);
    assert.equal(await page.locator('#contatti [data-future-channel="whatsapp"] a').count(), 0);
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
    assert.equal(await coursePage.locator('.course-fact').count(), 4);
    assert.equal(await coursePage.getByText('Orari in aggiornamento. Contatta la scuola per informazioni.', { exact: true }).count(), 1);
    assert.equal(await coursePage.locator('a[href="/#discipline"]').count(), 3);
    assert.ok((await coursePage.locator('a[href^="mailto:"]').count()) >= 2);
    const courseLayout = await coursePage.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      imagesBroken: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
    }));
    assert.ok(courseLayout.scrollWidth <= courseLayout.width, `${slug}: horizontal overflow`);
    assert.deepEqual(courseLayout.imagesBroken, [], `${slug}: broken images`);
  }
  await coursePage.goto(`${baseURL}/corsi/danza-moderna`, { waitUntil: 'domcontentloaded' });
  await coursePage.screenshot({ path: 'artifacts/course-danza-moderna-desktop.png', fullPage: true });
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
