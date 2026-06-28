import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });

const pick = (el) => {
  if (!el) return null;
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    text: (el.innerText || el.textContent || '').trim().slice(0, 80),
    tag: el.tagName,
    rect: { w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY) },
    font: `${s.fontSize}/${s.lineHeight}`,
    fontFamily: s.fontFamily.slice(0, 35),
    color: s.color,
    bg: s.backgroundColor,
    padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
    position: s.position,
    top: s.top,
    display: s.display,
    gap: s.gap,
    gridCols: s.gridTemplateColumns,
  };
};

const data = await page.evaluate(() => {
  const pick = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      text: (el.innerText || el.textContent || '').trim().slice(0, 80),
      tag: el.tagName,
      rect: { w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY) },
      font: `${s.fontSize}/${s.lineHeight}`,
      fontFamily: s.fontFamily.slice(0, 35),
      color: s.color,
      bg: s.backgroundColor,
      padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
      position: s.position,
      top: s.top,
      display: s.display,
      gap: s.gap,
      gridCols: s.gridTemplateColumns,
    };
  };

  const h1 = document.querySelector('h1');
  const heroSection = h1?.closest('section') || h1?.parentElement?.parentElement?.parentElement;
  const heroImg = heroSection?.querySelector('img');

  const popularH = [...document.querySelectorAll('h3')].find((h) => /most popular/i.test(h.textContent));
  const popularSection = popularH?.closest('section') || popularH?.parentElement?.parentElement;

  const stickyEls = [...document.querySelectorAll('*')].filter((el) => {
    const s = getComputedStyle(el);
    return s.position === 'sticky' && el.getBoundingClientRect().height > 100;
  }).map((el) => ({
    ...pick(el),
    stickyTop: getComputedStyle(el).top,
  }));

  const menuBtn = [...document.querySelectorAll('button,a,p')].find((el) => el.textContent?.trim() === 'Menu');
  const navRow = menuBtn?.closest('header') || menuBtn?.parentElement?.parentElement?.parentElement;

  const valuesH = [...document.querySelectorAll('h3')].find((h) => /our values/i.test(h.textContent));
  const valuesSection = valuesH?.closest('section');

  const sections = [...document.querySelectorAll('section')].map((sec, i) => ({
    i,
    h: Math.round(sec.getBoundingClientRect().height),
    y: Math.round(sec.getBoundingClientRect().top + scrollY),
    bg: getComputedStyle(sec).backgroundColor,
    pad: getComputedStyle(sec).paddingTop,
    title: sec.querySelector('h1,h2,h3,h4,h5,h6')?.textContent?.trim().slice(0, 40),
  }));

  return {
    hero: { section: pick(heroSection), h1: pick(h1), img: pick(heroImg) },
    header: pick(navRow),
    menuBtn: pick(menuBtn),
    popular: { section: pick(popularSection), heading: pick(popularH), stickyEls },
    values: pick(valuesSection),
    sections: sections.slice(0, 14),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
