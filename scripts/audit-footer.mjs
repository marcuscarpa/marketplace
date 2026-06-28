import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

const data = await page.evaluate(() => {
  const pick = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      text: (el.innerText || '').slice(0, 120),
      class: el.className?.slice?.(0, 80),
      rect: { w: r.width, h: r.height, y: r.y + scrollY },
      font: `${s.fontSize}/${s.lineHeight} ${s.fontFamily.slice(0, 40)}`,
      color: s.color,
      opacity: s.opacity,
      padding: `${s.paddingTop} ${s.paddingBottom}`,
      margin: `${s.marginTop} ${s.marginBottom}`,
      letterSpacing: s.letterSpacing,
      fontWeight: s.fontWeight,
    };
  };

  const faq = [...document.querySelectorAll('h3,h2,h4,h5,h6')].find((h) =>
    /faq/i.test(h.textContent)
  );
  const newsletter = [...document.querySelectorAll('h4,h3,h2')].find((h) =>
    /first to discover/i.test(h.textContent)
  );
  const logo = [...document.querySelectorAll('*')].find(
    (el) => el.childElementCount === 0 && /^mesco$/i.test(el.textContent?.trim())
  );
  const copyright = [...document.querySelectorAll('p,span,div')].find((el) =>
    /©|copyright|framlix/i.test(el.textContent) && el.textContent.length < 80
  );

  const input = document.querySelector('input[type="email"], input[placeholder*="mail" i]');
  const submit = [...document.querySelectorAll('button,a,input[type="submit"]')].find((el) =>
    /submit/i.test(el.textContent || el.value)
  );

  const cols = [...document.querySelectorAll('p,span,h5,h6')].filter(
    (el) => el.childElementCount === 0 && /^(Shop|Company|Others|Legal)$/i.test(el.textContent.trim())
  );

  return {
    faq: pick(faq),
    newsletter: pick(newsletter),
    input: pick(input),
    submit: pick(submit),
    logo: pick(logo),
    copyright: pick(copyright),
    colHeaders: cols.map(pick),
    footerSection: pick(document.querySelector('footer') || faq?.closest('section') || faq?.parentElement),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
