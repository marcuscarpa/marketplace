import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(designReferenceUrl(), { waitUntil: 'networkidle' });

const data = await page.evaluate(() => {
  const pick = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      text: (el.textContent || '').trim().slice(0, 40),
      tag: el.tagName,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      color: s.color,
      bg: s.backgroundColor,
      font: `${s.fontSize}/${s.lineHeight} ${s.fontFamily.slice(0, 30)}`,
      tracking: s.letterSpacing,
      fontWeight: s.fontWeight,
      textTransform: s.textTransform,
      position: s.position,
    };
  };

  const logo = [...document.querySelectorAll('a,p,h1,h2,span,div')].find(
    (el) => el.childElementCount === 0 && el.textContent?.trim().toLowerCase() === 'mesco'
  );

  const menu = [...document.querySelectorAll('*')].find(
    (el) => el.childElementCount === 0 && el.textContent?.trim() === 'Menu'
  );
  const menuRow = menu?.closest('header') || menu?.parentElement?.parentElement?.parentElement;

  const h1 = document.querySelector('h1');
  const shopAll = [...document.querySelectorAll('a')].find((a) => /shop all/i.test(a.textContent));

  const cart = [...document.querySelectorAll('*')].find(
    (el) => el.textContent?.trim().toLowerCase() === 'cart' && el.children.length === 0
  );
  const cartBadge = cart?.parentElement?.querySelector('span,div:last-child');

  const navItems = ['Menu', 'SEARCH', 'FAVORITES'].map((label) => {
    const el = [...document.querySelectorAll('*')].find(
      (e) => e.childElementCount <= 1 && e.textContent?.trim().toUpperCase() === label.toUpperCase()
    );
    return pick(el);
  });

  return {
    logo: pick(logo),
    menuRow: pick(menuRow),
    menu: pick(menu),
    navItems,
    h1: pick(h1),
    shopAll: pick(shopAll),
    shopAllParent: shopAll?.parentElement ? pick(shopAll.parentElement) : null,
    cart: pick(cart),
    cartBadge: cartBadge ? pick(cartBadge) : null,
    headerStructure: menuRow?.innerText?.slice(0, 100),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
