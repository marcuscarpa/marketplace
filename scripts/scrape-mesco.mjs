import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const URL = designReferenceUrl();
const OUT = join(process.cwd(), 'scripts', 'mesco-audit');

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  const refDom = { a: REF_SITE_COMPONENT_ATTR };

  const audit = await page.evaluate(({ a }) => {
    const fonts = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style}`);
    const styles = getComputedStyle(document.body);
    const imgs = [...document.querySelectorAll('img')].map((img) => ({
      src: img.src,
      alt: img.alt,
      w: img.naturalWidth,
      h: img.naturalHeight,
    }));
    const sections = [...document.querySelectorAll(`section, [${a}]`)].slice(0, 80).map((el) => ({
      tag: el.tagName,
      name: el.getAttribute(a) || el.className?.slice?.(0, 80),
      text: el.textContent?.slice(0, 120)?.replace(/\s+/g, ' ').trim(),
    }));
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      tag: h.tagName,
      text: h.textContent?.trim(),
      font: getComputedStyle(h).fontFamily,
      size: getComputedStyle(h).fontSize,
      weight: getComputedStyle(h).fontWeight,
      color: getComputedStyle(h).color,
      letterSpacing: getComputedStyle(h).letterSpacing,
    }));
    const links = [...document.querySelectorAll('a')].slice(0, 60).map((a) => ({
      text: a.textContent?.trim()?.slice(0, 60),
      href: a.getAttribute('href'),
    }));
    const cssVars = {};
    for (const sheet of [...document.styleSheets]) {
      try {
        for (const rule of [...sheet.cssRules]) {
          if (rule.selectorText === ':root' || rule.selectorText?.includes(':root')) {
            cssVars[rule.cssText] = true;
          }
        }
      } catch (_) {}
    }
    return {
      title: document.title,
      bodyFont: styles.fontFamily,
      bodyBg: styles.backgroundColor,
      bodyColor: styles.color,
      fonts: [...new Set(fonts)],
      headings,
      imgs: imgs.filter((i) => i.src && !i.src.startsWith('data:')),
      sections,
      links: links.filter((l) => l.text),
      htmlLen: document.documentElement.outerHTML.length,
    };
  }, refDom);

  await page.screenshot({ path: join(OUT, 'full-page.png'), fullPage: true });
  await page.screenshot({ path: join(OUT, 'hero.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });

  // mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, 'mobile-full.png'), fullPage: true });

  writeFileSync(join(OUT, 'audit.json'), JSON.stringify(audit, null, 2));
  console.log('Saved to', OUT);
  console.log('Fonts:', audit.fonts.slice(0, 10));
  console.log('Headings:', audit.headings.length);
  console.log('Images:', audit.imgs.length);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
