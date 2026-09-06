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
    assert.equal(await page.locator('.discipline-slice').count(), 10);
    assert.equal(await page.locator('[data-placeholder]').count(), 1);
    const clipped = await page.locator('h1,h2,h3,.discipline-slice strong').evaluateAll(elements => elements.flatMap(element => [...element.getClientRects()].filter(rect => rect.left < -1 || rect.right > innerWidth + 1).map(() => element.textContent)));
    assert.deepEqual(clipped, [], `${name}: clipped heading`);
    for (const href of new Set(await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href'))))) assert.equal(await page.locator(href).count(), 1, `Missing anchor ${href}`);
    await page.screenshot({ path: `artifacts/${name}-hero.png` });
    await page.locator('#discipline').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/${name}-disciplines.png` });
    const faculty = page.getByRole('button', { name: 'Vedi gli altri nomi riportati' });
    await faculty.click();
    assert.equal(await page.locator('.faculty-list li').count(), 11);
    await page.screenshot({ path: `artifacts/${name}-faculty-expanded.png` });
    if (width <= 820) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      assert.ok(await page.locator('#menu-mobile').isVisible());
      await page.screenshot({ path: `artifacts/${name}-menu.png` });
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded'), 'false');
    }
    await page.locator('.footer').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/${name}-footer.png` });
    await page.evaluate(() => scrollTo(0, 0));
    if (name === 'desktop' || name === 'mobile') await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
    results.push({ name, viewport: { width, height }, ...layout, passed: true });
    await context.close();
    console.log(`Passed ${name}`);
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`motion: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') errors.push(`motion: ${message.text()}`); });
  await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1400);
  assert.ok(await page.locator('.hero-title__line span').evaluateAll(lines => lines.every(line => getComputedStyle(line).transform === 'none')));
  await page.locator('#archivio').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const archiveY = await page.locator('.archive-layout').evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => scrollTo(0, y + 220), archiveY);
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.pin-spacer').count(), 1, 'Archive pin missing');
  await page.screenshot({ path: 'artifacts/desktop-motion-archive.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.pin-spacer').count(), 0, 'Reduced motion retains pinning');
  assert.ok(await page.locator('.story-word,.photo__frame,.hero-title__line span').evaluateAll(elements => elements.every(el => {
    const style = getComputedStyle(el);
    return style.transform === 'none' && style.opacity === '1';
  })));
  await context.close();
  assert.deepEqual(errors, [], 'Browser console errors');
  await writeFile('artifacts/browser-report.json', JSON.stringify({ baseURL, results, motion: 'passed', errors }, null, 2));
  console.log('Passed: responsive layouts, images, navigation, menu, footer, motion and reduced motion. Screenshots: artifacts/');
} finally {
  await browser.close();
}
