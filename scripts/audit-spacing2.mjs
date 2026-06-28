import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(designReferenceUrl(), { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);

const data = await page.evaluate(() => {
  const sections = [...document.querySelectorAll('section[`${REF_SITE_COMPONENT_ATTR}`], section')]
    .map((el) => {
      const r = el.getBoundingClientRect();
      if (r.height < 50) return null;
      const s = getComputedStyle(el);
      return {
        name: el.getAttribute(REF_SITE_COMPONENT_ATTR) || el.textContent?.slice(0, 30).replace(/\s+/g, ' '),
        top: Math.round(r.top + window.scrollY),
        bottom: Math.round(r.bottom + window.scrollY),
        height: Math.round(r.height),
        pt: s.paddingTop,
        pb: s.paddingBottom,
      };
    })
    .filter(Boolean);

  const gaps = [];
  for (let i = 0; i < sections.length - 1; i++) {
    gaps.push({
      from: sections[i].name,
      to: sections[i + 1].name,
      gap: sections[i + 1].top - sections[i].bottom,
    });
  }
  return { sections, gaps };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
