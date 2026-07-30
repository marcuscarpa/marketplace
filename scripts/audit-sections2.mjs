import { designReferenceUrl, REF_SITE_COMPONENT_ATTR, REF_SITE_CLASS_TOKEN } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });

const refDom = { a: REF_SITE_COMPONENT_ATTR, c: REF_SITE_CLASS_TOKEN };

const data = await page.evaluate(({ a, c }) => {
  const pick = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      text: (el.innerText || el.textContent || '').trim().slice(0, 60),
      rect: { w: Math.round(r.width), h: Math.round(r.height) },
      font: s.fontSize,
      lh: s.lineHeight,
      color: s.color,
      bg: s.backgroundColor,
      pad: s.padding,
      tracking: s.letterSpacing,
      transform: s.textTransform,
    };
  };

  const menuEl = [...document.querySelectorAll('*')].find(
    (el) => el.childElementCount === 0 && el.textContent?.trim() === 'Menu'
  );
  const shopAll = [...document.querySelectorAll('a,button')].find((el) =>
    /shop all/i.test(el.textContent)
  );
  const h1 = document.querySelector('h1');
  const heroBtn = shopAll;

  const productImg = document.querySelector('section:nth-of-type(2) img');
  const productCard = productImg?.closest(`li,div[class*="${c}"]`);

  const addToCart = [...document.querySelectorAll('*')].find(
    (el) => el.childElementCount === 0 && /add to cart/i.test(el.textContent)
  );

  const bestsellersSec = [...document.querySelectorAll('section')].find((s) =>
    /our bestsellers/i.test(s.textContent)
  );

  const aboutSec = [...document.querySelectorAll('section')].find((s) =>
    /about us/i.test(s.textContent)
  );

  const newArr = [...document.querySelectorAll('section')].find((s) =>
    s.querySelector('h3')?.textContent?.trim() === 'New arrivals'
  );

  const annBar = [...document.querySelectorAll('*')].find(
    (el) => el.textContent?.includes('Take 10% off your first order') && el.children.length <= 3
  );

  return {
    menu: pick(menuEl),
    annBar: pick(annBar?.closest('div')),
    h1: pick(h1),
    heroBtn: pick(heroBtn),
    heroGradient: (() => {
      const hero = document.querySelector('section');
      const overlay = hero?.querySelector(`[${a}="Overlay"], [class*="gradient"]`);
      return overlay ? pick(overlay) : 'none found';
    })(),
    popularProductImg: pick(productImg),
    addToCart: pick(addToCart),
    popularGap: (() => {
      const ol = [...document.querySelectorAll('ol')].find((el) => getComputedStyle(el).position === 'sticky');
      return ol ? getComputedStyle(ol).gap : null;
    })(),
    bestsellers: bestsellersSec
      ? {
          bg: getComputedStyle(bestsellersSec).backgroundColor,
          pad: getComputedStyle(bestsellersSec).paddingTop,
        }
      : null,
    about: aboutSec
      ? {
          h: Math.round(aboutSec.getBoundingClientRect().height),
          text: aboutSec.innerText.slice(0, 200),
        }
      : null,
    newArrivalsGrid: newArr
      ? {
          gap: getComputedStyle(newArr.querySelector('ol,ul,div[class]') || newArr).gap,
          cols: getComputedStyle(newArr.querySelector(`[class*="${c}"]`) || newArr).gridTemplateColumns,
        }
      : null,
    navLinks: [...document.querySelectorAll('a,p,button')]
      .filter((el) => ['Search', 'Favorites', 'cart'].some((t) => el.textContent?.trim().startsWith(t)))
      .slice(0, 4)
      .map(pick),
  };
}, refDom);

console.log(JSON.stringify(data, null, 2));
await browser.close();
