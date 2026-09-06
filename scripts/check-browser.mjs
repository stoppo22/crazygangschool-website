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
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { await Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); })); });
    assert.equal(await page.locator('h1').count(), 1);
    const layout = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      const lines = [...heading.children].map(span => { const range = document.createRange(); range.selectNodeContents(span); const r = range.getBoundingClientRect(); return { left: r.left, right: r.right }; });
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, lines, imageErrors: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src), reducedWordsVisible: [...document.querySelectorAll('.story-word')].every(el => getComputedStyle(el).opacity === '1') };
    });
    assert.ok(layout.scrollWidth <= layout.width, `${name}: page overflows horizontally`);
    assert.ok(layout.lines.every(line => line.left >= 0 && line.right <= width), `${name}: hero heading overflows`);
    assert.deepEqual(layout.imageErrors, [], `${name}: broken images`);
    assert.ok(layout.reducedWordsVisible, `${name}: reduced motion hides content`);

    const anchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(a => a.getAttribute('href')));
    for (const href of new Set(anchors)) assert.equal(await page.locator(href).count(), 1, `Missing anchor ${href}`);
    await page.locator('#trigger-ritmo').click();
    assert.equal(await page.locator('#trigger-ritmo').getAttribute('aria-expanded'), 'true');
    assert.ok(await page.locator('#panel-ritmo').isVisible());
    assert.ok(!await page.locator('#panel-danza').isVisible());
    await page.locator('#trigger-incontro').focus();
    await page.keyboard.press('Enter');
    assert.ok(await page.locator('#panel-incontro').isVisible());
    assert.match(await page.locator('#panel-incontro a').getAttribute('href'), /^mailto:info@crazygang\.it\?subject=/);
    await page.screenshot({ path: `artifacts/${name}-courses-expanded.png` });
    await page.locator('#trigger-danza').click();

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
    results.push({ name, viewport: { width, height }, ...layout, passed: true });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(`motion: ${error.message}`));
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'artifacts/desktop-motion-hero.png' });
  await page.locator('.story-copy').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/desktop-motion-story.png' });
  await page.locator('.other-disciplines summary').click();
  await page.waitForTimeout(300);
  const stageY = await page.locator('#palcoscenico').evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => window.scrollTo(0, y + 450), stageY);
  await page.waitForTimeout(1000);
  const pinTop = await page.locator('.stage-heading').evaluate(el => el.getBoundingClientRect().top);
  assert.ok(Math.abs(pinTop - 110) < 3, `Stage heading not pinned: ${pinTop}`);
  await page.screenshot({ path: 'artifacts/desktop-motion-stage.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(200);
  assert.notEqual(await page.locator('.stage-heading').evaluate(el => getComputedStyle(el).position), 'fixed');
  await context.close();
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('pageerror', error => errors.push(`mobile motion: ${error.message}`));
  await mobilePage.goto(baseURL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1800);
  await mobilePage.screenshot({ path: 'artifacts/mobile-motion-hero.png' });
  await mobilePage.locator('#palcoscenico').scrollIntoViewIfNeeded();
  assert.notEqual(await mobilePage.locator('.stage-heading').evaluate(el => getComputedStyle(el).position), 'fixed');
  await mobilePage.locator('#insegnanti').scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1000);
  assert.ok(await mobilePage.locator('.director').first().evaluate(el => Number(getComputedStyle(el).opacity) > 0.95));
  await mobilePage.screenshot({ path: 'artifacts/mobile-motion-teachers.png' });
  await mobileContext.close();
  assert.deepEqual(errors, [], 'Browser errors');
  await writeFile('artifacts/browser-report.json', JSON.stringify({ baseURL, results, motion: 'passed', errors }, null, 2));
  console.log('Passed: five responsive viewports, keyboard, navigation, images, accordions, faculty, motion and reduced motion. Screenshots: artifacts/');
} finally {
  await browser.close();
}

