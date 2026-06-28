import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const b = await chromium.launch();

async function measure(url, w) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 } });
  await p.goto(url, { waitUntil: 'networkidle' });
  const d = await p.evaluate(() => {
    const h3 = [...document.querySelectorAll('h3')].find((h) => /new arrivals/i.test(h.textContent || ''));
    h3?.scrollIntoView({ block: 'center' });

    const tereLink = [...document.querySelectorAll('a')].find((a) => {
      const href = a.getAttribute('href') || '';
      return /products\/tere$/.test(href.replace(/^\.\//, '')) && a.querySelector('img');
    });
    const img = tereLink?.querySelector('img');
    const imageWrap = tereLink?.parentElement;
    const card = tereLink?.closest('article') ?? tereLink?.parentElement?.parentElement?.parentElement;
    const grid = h3?.nextElementSibling;
    const m = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        aspect: s.aspectRatio,
        gap: s.gap,
        cols: s.gridTemplateColumns,
      };
    };
    return {
      grid: m(grid),
      imageWrap: m(imageWrap),
      img: img && { ...m(img), fit: getComputedStyle(img).objectFit },
      card: m(card),
      link: m(tereLink),
    };
  });
  await p.close();
  return d;
}

for (const w of [390, 810, 1440]) {
  console.log(`\n=== ${w} ===`);
  console.log(
    JSON.stringify(
      {
        reference: await measure(designReferenceUrl(), w),
        local: await measure('http://127.0.0.1:3000/en', w),
      },
      null,
      2,
    ),
  );
}

await b.close();
