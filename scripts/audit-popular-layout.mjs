import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(designReferenceUrl(), { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

const refDom = { a: REF_SITE_COMPONENT_ATTR };

const layout = await page.evaluate(({ a }) => {
  const section = document.querySelector(`[${a}="Most popular"]`);
  if (!section) return null;
  const wrapper = section.querySelector(`[${a}="Wrapper"]`);
  const children = wrapper ? [...wrapper.children].map((el) => ({
    name: el.getAttribute(a),
    tag: el.tagName,
    class: el.className?.slice?.(0, 80),
    rect: el.getBoundingClientRect(),
    position: getComputedStyle(el).position,
    top: getComputedStyle(el).top,
    display: getComputedStyle(el).display,
    grid: getComputedStyle(el).display,
  })) : [];
  return {
    sectionRect: section.getBoundingClientRect(),
    wrapperRect: wrapper?.getBoundingClientRect(),
    children,
  };
}, refDom);

console.log(JSON.stringify(layout, null, 2));
await browser.close();
