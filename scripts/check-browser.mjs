import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const executablePath = process.env.BROWSER_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
const errors = [];
const results = [];

try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844], ['small-mobile', 320, 740], ['tablet', 768, 1024], ['small-desktop', 1024, 768]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1, isMobile: width < 600, hasTouch: width < 600 });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error') errors.push(`${name}: ${message.text()}`); });
    await page.addInitScript(() => {
      window.__reviewMetrics = { cls: 0, lcp: null };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__reviewMetrics.cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__reviewMetrics.lcp = entry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { await Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); })); });
    assert.equal(await page.locator('h1').count(), 1);
    const layout = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      const lines = [...heading.children].map(span => { const range = document.createRange(); range.selectNodeContents(span); const r = range.getBoundingClientRect(); return { left: r.left, right: r.right }; });
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, lines, imageErrors: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src), reducedWordsVisible: getComputedStyle(document.querySelector('.story-copy')).opacity === '1' };
    });
    assert.ok(layout.scrollWidth <= layout.width, `${name}: page overflows horizontally`);
    assert.ok(layout.lines.every(line => line.left >= 0 && line.right <= width), `${name}: hero heading overflows`);
    assert.deepEqual(layout.imageErrors, [], `${name}: broken images`);
    assert.ok(layout.reducedWordsVisible, `${name}: reduced motion hides content`);

    const brand = await page.locator('.header .brand-logo').evaluate(img => ({
      alt: img.alt, ratio: img.getBoundingClientRect().width / img.getBoundingClientRect().height,
      source: img.currentSrc,
    }));
    assert.equal(brand.alt, 'Crazy Gang School');
    assert.ok(Math.abs(brand.ratio - 2307 / 1157) < 0.01, 'Logo proportions changed');
    assert.ok(brand.source.includes('/brand/crazy-gang-'));
    assert.equal(await page.locator('.footer .brand-logo').count(), 1);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
    assert.equal(await page.locator('.marquee-track').count(), 0);

    const headingOverflow = await page.locator('h1,h2,h3,.discipline-item a').evaluateAll(headings => headings.flatMap(heading => {
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const overflow = [];
      while (walker.nextNode()) {
        const range = document.createRange();
        range.selectNodeContents(walker.currentNode);
        for (const rect of range.getClientRects()) {
          if (rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1)) overflow.push(heading.textContent);
        }
      }
      return overflow;
    }));
    assert.deepEqual(headingOverflow, [], name + ': heading text is clipped');

    const anchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(a => a.getAttribute('href')));
    for (const href of new Set(anchors)) assert.equal(await page.locator(href).count(), 1, `Missing anchor ${href}`);
    const courseNames = ['Danza Classica', 'Danza Moderna', 'Hip Hop', 'Tap', 'Break Dance', 'Salsa Cubana', 'Danze Standard', 'Danze Latino Americane', 'Kung Fu', 'Propedeutica'];
    assert.equal(await page.locator('.discipline-item').count(), courseNames.length);
    assert.equal(await page.locator('.course-panel').count(), 0);
    assert.equal(await page.getByRole('heading', { name: 'Crazy Gang School', exact: true }).count(), 1);
    for (const courseName of courseNames) {
      const link = page.getByRole('link', { name: 'Informazioni su ' + courseName, exact: true });
      assert.ok(await link.isVisible(), name + ': course is hidden');
      const href = await link.getAttribute('href');
      assert.equal(href, 'mailto:info@crazygang.it?subject=' + encodeURIComponent('Informazioni: ' + courseName));
    }
    await page.getByRole('link', { name: 'Informazioni su Hip Hop', exact: true }).focus();
    await page.keyboard.press('Tab');
    assert.ok(await page.getByRole('link', { name: 'Informazioni su Tap', exact: true }).evaluate(el => el === document.activeElement));
    await page.evaluate(() => document.activeElement?.blur());
    assert.ok(await page.locator('.skip-link').evaluate(el => el.getBoundingClientRect().bottom <= 0));
    await page.locator('#discipline').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/${name}-disciplines.png` });
    await page.locator('.discipline-salsa').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/${name}-disciplines-lower.png` });
    for (const photo of await page.locator('[data-placeholder]').all()) {
      assert.equal(await photo.locator('img').getAttribute('alt'), '');
      assert.match(await photo.locator('figcaption').textContent(), /segnaposto/);
    }
    assert.equal(await page.locator('[data-placeholder]').count(), 4);

    const facultyButton = page.getByRole('button', { name: 'Gli altri insegnanti' });
    await facultyButton.click();
    assert.equal(await page.locator('.faculty-list li').count(), 11);
    assert.ok(await page.locator('.faculty-list').isVisible());
    await page.screenshot({ path: `artifacts/${name}-faculty-expanded.png` });
    await page.getByRole('button', { name: 'Chiudi l’elenco' }).click();

    if (width <= 800) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      assert.ok(await page.locator('#mobile-menu').isVisible());
      await page.keyboard.press('Shift+Tab');
      assert.ok(await page.getByRole('button', { name: 'Chiudi', exact: true }).evaluate(el => el === document.activeElement));
      await page.keyboard.press('Shift+Tab');
      assert.ok(await page.locator('#mobile-menu a').last().evaluate(el => el === document.activeElement));
      await page.screenshot({ path: `artifacts/${name}-menu.png` });
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false');
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.locator('#mobile-menu').getByRole('link', { name: 'Contatti', exact: true }).click();
      assert.ok(!await page.locator('#mobile-menu').isVisible());
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    }
    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/${name}-footer.png` });
    await page.locator('#contatti').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/${name}-contact.png` });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
    await page.screenshot({ path: `artifacts/${name}-hero.png` });
    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => ({
      name: entry.name, bytes: entry.transferSize,
    })));
    assert.ok(resources.every(entry => new URL(entry.name).origin === new URL(baseURL).origin), name + ': unexpected remote resource');
    assert.ok(resources.every(entry => !entry.name.includes('crazy-gang-original.png') && !entry.name.includes('dance-stage.jpg') && !entry.name.includes('dance-studio.jpg')), name + ': unoptimized or retired asset loaded');
    const metrics = await page.evaluate(() => window.__reviewMetrics);
    results.push({ name, viewport: { width, height }, ...layout, brand, localLabMetrics: metrics, imageTransferBytes: resources.filter(entry => /\.(webp|png)/.test(entry.name)).reduce((sum, entry) => sum + entry.bytes, 0), passed: true });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`motion: ${error.message}`));
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  assert.ok(await page.locator('.hero-line').evaluateAll(lines => lines.every(line => getComputedStyle(line).transform === 'none')));
  assert.ok(await page.locator('.atlas-image--main .photo-frame').evaluate(el => getComputedStyle(el).clipPath === 'none'));
  await page.screenshot({ path: 'artifacts/desktop-motion-hero.png' });
  for (const frame of await page.locator('.discipline-image .photo-frame').all()) {
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    assert.equal(await frame.evaluate(el => getComputedStyle(el).clipPath), 'none');
  }
  await page.locator('#discipline').scrollIntoViewIfNeeded();
  await page.waitForTimeout(750);
  await page.screenshot({ path: 'artifacts/desktop-motion-disciplines.png' });
  await page.locator('.story-copy').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/desktop-motion-story.png' });
  await page.locator('.other-disciplines summary').click();
  await page.waitForTimeout(300);
  const stageY = await page.locator('#palcoscenico').evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => window.scrollTo(0, y + 160), stageY);
  await page.waitForTimeout(1000);
  const pinTop = await page.locator('.stage-heading').evaluate(el => el.getBoundingClientRect().top);
  assert.ok(Math.abs(pinTop - 110) < 3, `Stage heading not pinned: ${pinTop}`);
  await page.screenshot({ path: 'artifacts/desktop-motion-stage.png' });
  for (const frame of await page.locator('.stage-photo .photo-frame').all()) {
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    assert.equal(await frame.evaluate(el => getComputedStyle(el).clipPath), 'none', 'Image reveal did not finish');
    assert.ok(await frame.evaluate(el => Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42) <= 12.1), 'Parallax exceeds 24 px travel');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(200);
  assert.notEqual(await page.locator('.stage-heading').evaluate(el => getComputedStyle(el).position), 'fixed');
  assert.equal(await page.locator('.pin-spacer').count(), 0, 'Reduced motion retains a pin spacer');
  assert.ok(await page.locator('.photo-frame,.hero-line').evaluateAll(elements => elements.every(el => {
    const style = getComputedStyle(el);
    return style.clipPath === 'none' && style.transform === 'none' && style.opacity === '1';
  })), 'Reduced motion leaves a mask or transform');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('.pin-spacer').count(), 1, 'Motion reactivation duplicates pinning');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.pin-spacer').count(), 0);
  await context.close();
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('pageerror', error => errors.push(`mobile motion: ${error.message}`));
  await mobilePage.goto(baseURL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1800);
  await mobilePage.screenshot({ path: 'artifacts/mobile-motion-hero.png' });
  for (const frame of await mobilePage.locator('.discipline-image .photo-frame').all()) {
    await frame.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(750);
    assert.equal(await frame.evaluate(el => getComputedStyle(el).clipPath), 'none');
  }
  await mobilePage.locator('#palcoscenico').scrollIntoViewIfNeeded();
  assert.notEqual(await mobilePage.locator('.stage-heading').evaluate(el => getComputedStyle(el).position), 'fixed');
  for (const frame of await mobilePage.locator('.stage-photo .photo-frame').all()) {
    await frame.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(750);
    assert.equal(await frame.evaluate(el => getComputedStyle(el).clipPath), 'none');
    assert.equal(await frame.evaluate(el => getComputedStyle(el).transform), 'none', 'Mobile must not use parallax');
  }
  await mobilePage.screenshot({ path: 'artifacts/mobile-motion-stage.png' });
  await mobilePage.locator('#insegnanti').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1000);
  assert.ok(await mobilePage.locator('.director').first().evaluate(el => Number(getComputedStyle(el).opacity) > 0.95));
  await mobilePage.screenshot({ path: 'artifacts/mobile-motion-teachers.png' });
  await mobilePage.evaluate(() => window.scrollTo(0, 0));
  await mobilePage.getByRole('button', { name: 'Menu', exact: true }).click();
  await mobilePage.setViewportSize({ width: 1100, height: 844 });
  await mobilePage.waitForTimeout(1100);
  assert.ok(!await mobilePage.locator('#mobile-menu').isVisible(), 'Resize must close the mobile menu');
  assert.equal(await mobilePage.evaluate(() => document.body.style.overflow), '');
  assert.equal(await mobilePage.locator('.pin-spacer').count(), 1);
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.waitForTimeout(750);
  assert.equal(await mobilePage.locator('.pin-spacer').count(), 0, 'Desktop pin remains after returning to mobile');
  await mobileContext.close();
  assert.deepEqual(errors, [], 'Browser errors');
  const palette = { paper: '#f2f0e9', ink: '#181917', indigo: '#292f68', plum: '#713a70', amber: '#d78b52' };
  const luminance = hex => {
    const channels = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const contrast = [['ink', 'paper'], ['paper', 'indigo'], ['plum', 'paper'], ['ink', 'amber'], ['amber', 'indigo'], ['amber', 'ink']].map(([foreground, background]) => {
    const a = luminance(palette[foreground]), b = luminance(palette[background]);
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    assert.ok(ratio >= 4.5, foreground + '/' + background + ': insufficient contrast');
    return { foreground, background, ratio: Number(ratio.toFixed(2)) };
  });
  await writeFile('artifacts/browser-report.json', JSON.stringify({ baseURL, results, motion: 'passed', contrast, errors }, null, 2));
  console.log('Passed: five responsive viewports, keyboard, navigation, images, open disciplines, faculty, motion and reduced motion. Screenshots: artifacts/');
} finally {
  await browser.close();
}


