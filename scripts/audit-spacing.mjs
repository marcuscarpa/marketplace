import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT = join(process.cwd(), 'scripts', 'mesco-audit');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(designReferenceUrl(), { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);

const refDom = { a: REF_SITE_COMPONENT_ATTR };

const data = await page.evaluate(({ a }) => {
  const names = [
    'Hero',
    'Most popular',
    'Our values',
    'New arrivals',
    'About us',
    'Our bestsellers',
    'Our articles',
    "FAQ's",
  ];

  const found = names.map((name) => {
    const el = document.querySelector(`[${a}="${name}"]`);
    if (!el) return { name, missing: true };
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return {
      name,
      top: Math.round(r.top + window.scrollY),
      bottom: Math.round(r.bottom + window.scrollY),
      height: Math.round(r.height),
      paddingTop: s.paddingTop,
      paddingBottom: s.paddingBottom,
      marginTop: s.marginTop,
      marginBottom: s.marginBottom,
      gap: s.gap,
    };
  });

  const gaps = [];
  for (let i = 0; i < found.length - 1; i++) {
    const a = found[i];
    const b = found[i + 1];
    if (!a.missing && !b.missing) {
      gaps.push({ from: a.name, to: b.name, gapPx: b.top - a.bottom });
    }
  }

  return { found, gaps, viewport: { h: window.innerHeight } };
}, refDom);

writeFileSync(join(OUT, 'spacing-audit.json'), JSON.stringify(data, null, 2));
console.log(JSON.stringify(data, null, 2));
await browser.close();
