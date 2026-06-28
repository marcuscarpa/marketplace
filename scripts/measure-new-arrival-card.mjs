import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(designReferenceUrl(), { waitUntil: 'networkidle' });

const d = await p.evaluate(() => {
  const h3 = [...document.querySelectorAll('h3')].find((h) => /new arrivals/i.test(h.textContent || ''));
  h3?.scrollIntoView({ block: 'center' });

  const tereLink = [...document.querySelectorAll('a')].find((a) => {
    const href = a.getAttribute('href') || '';
    return /products\/tere$/.test(href.replace(/^\.\//, '')) && a.querySelector('img');
  });
  const img = tereLink?.querySelector('img');
  const imageWrap = tereLink?.parentElement;
  const card = tereLink?.closest('article') ?? tereLink?.parentElement?.parentElement;
  const m = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      pos: s.position,
      left: s.left,
      top: s.top,
      overflow: s.overflow,
      bg: s.backgroundColor,
    };
  };
  return {
    tereLink: m(tereLink),
    imageWrap: m(imageWrap),
    img: img && { ...m(img), fit: getComputedStyle(img).objectFit, pos: getComputedStyle(img).objectPosition },
    card: m(card),
    texts: [...(card?.querySelectorAll('p') ?? [])].map((p) => p.textContent?.trim()),
  };
});

console.log(JSON.stringify(d, null, 2));
await b.close();
