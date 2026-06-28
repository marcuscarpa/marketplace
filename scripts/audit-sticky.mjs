import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const refDom = { a: REF_SITE_COMPONENT_ATTR };

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(designReferenceUrl(), { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

const samples = [];
for (const scrollY of [0, 200, 400, 600, 800, 1000, 1200]) {
  await page.evaluate((y) => window.scrollTo(0, 901 + y), scrollY);
  await page.waitForTimeout(300);
  const pos = await page.evaluate(({ a }) => {
    const section = document.querySelector(`[${a}="Most popular"]`);
    const imgs = section ? [...section.querySelectorAll('img')] : [];
    const sticky = section ? [...section.querySelectorAll('*')].filter((el) => {
      const s = getComputedStyle(el);
      return s.position === 'sticky' || s.position === 'fixed';
    }).slice(0, 5).map((el) => ({
      tag: el.tagName,
      name: el.getAttribute(a),
      top: el.getBoundingClientRect().top,
      position: getComputedStyle(el).position,
      height: el.getBoundingClientRect().height,
    })) : [];
    return {
      scrollY: window.scrollY,
      sectionTop: section?.getBoundingClientRect().top,
      imgs: imgs.map((img) => ({
        alt: img.alt?.slice(0, 40),
        top: Math.round(img.getBoundingClientRect().top),
        height: Math.round(img.getBoundingClientRect().height),
      })),
      sticky,
    };
  }, refDom);
  samples.push(pos);
}

console.log(JSON.stringify(samples, null, 2));
await browser.close();
