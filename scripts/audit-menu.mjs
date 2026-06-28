import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT = join(process.cwd(), 'scripts', 'mesco-audit');
mkdirSync(OUT, { recursive: true });

const refDom = { a: REF_SITE_COMPONENT_ATTR };

const browser = await chromium.launch();

for (const vp of [
  { w: 1440, h: 900, name: 'desktop' },
  { w: 390, h: 844, name: 'mobile' },
]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(designReferenceUrl(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  const headerInfo = await page.evaluate(({ a }) => {
    const header = document.querySelector(`[${a}="Header"]`);
    if (!header) return null;
    const children = [...header.querySelectorAll(`[${a}], a, p`)].map((el) => ({
      tag: el.tagName,
      name: el.getAttribute(a),
      text: el.textContent?.trim().slice(0, 40),
      rect: el.getBoundingClientRect(),
      styles: {
        fontSize: getComputedStyle(el).fontSize,
        color: getComputedStyle(el).color,
        letterSpacing: getComputedStyle(el).letterSpacing,
        textTransform: getComputedStyle(el).textTransform,
        fontFamily: getComputedStyle(el).fontFamily,
      },
    }));
    return {
      text: header.innerText,
      height: header.getBoundingClientRect().height,
      bg: getComputedStyle(header).backgroundColor,
      position: getComputedStyle(header).position,
      children: children.filter((c) => c.text || c.name),
    };
  }, refDom);

  await page.locator('a').filter({ hasText: /^MENU$/ }).first().click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: join(OUT, `menu-open-${vp.name}.png`) });

  const menuInfo = await page.evaluate(({ a }) => {
    const named = [...document.querySelectorAll(`[${a}]`)]
      .filter((el) => {
        const n = el.getAttribute(a) || '';
        return /nav|menu|overlay|navigation|sidebar|drawer|modal|close/i.test(n);
      })
      .map((el) => ({
        name: el.getAttribute(a),
        text: el.innerText?.slice(0, 300).replace(/\s+/g, ' ').trim(),
        rect: el.getBoundingClientRect(),
        opacity: getComputedStyle(el).opacity,
        transform: getComputedStyle(el).transform,
        position: getComputedStyle(el).position,
        zIndex: getComputedStyle(el).zIndex,
        bg: getComputedStyle(el).backgroundColor,
        display: getComputedStyle(el).display,
      }))
      .filter((el) => el.rect.width > 0 && el.rect.height > 0);

    const allVisibleText = [...document.querySelectorAll('a, button, p, h1, h2, h3, span')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < 900;
      })
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .slice(0, 40);

    return { named, allVisibleText };
  }, refDom);

  writeFileSync(
    join(OUT, `menu-audit-${vp.name}.json`),
    JSON.stringify({ headerInfo, menuInfo }, null, 2),
  );
  console.log(`\n=== ${vp.name} ===`);
  console.log('Header:', headerInfo?.text?.replace(/\n/g, ' | '));
  console.log('Menu named elements:', menuInfo.named.map((n) => n.name).join(', '));
  console.log('Top visible:', menuInfo.allVisibleText.slice(0, 15).join(' | '));

  await page.close();
}

await browser.close();
