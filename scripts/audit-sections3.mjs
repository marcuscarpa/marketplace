import { designReferenceUrl, REF_SITE_COMPONENT_ATTR } from './lib/reference.mjs';
import { chromium } from 'playwright';

const URL = designReferenceUrl();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: 'networkidle' });

const data = await page.evaluate(() => {
  const aboutSec = [...document.querySelectorAll('section')].find((s) => /about us/i.test(s.textContent));
  const aboutH = aboutSec?.querySelector('h3,h2');
  const aboutImg = aboutSec?.querySelector('img');

  const collectionLinks = [...document.querySelectorAll('section')].filter((s) =>
    /new designs to define|most-loved picks/i.test(s.textContent)
  );

  const newArrSec = [...document.querySelectorAll('section')].find((s) =>
    s.querySelector('h3')?.textContent?.trim() === 'New arrivals'
  );
  const newArrProducts = newArrSec?.querySelectorAll('img');

  const popularSec = [...document.querySelectorAll('section')].find((s) =>
    s.querySelector('h3')?.textContent?.trim() === 'Most popular'
  );

  const productCard = popularSec?.querySelector('ol li, ol > div');
  const cardImgWrap = popularSec?.querySelector('img')?.parentElement;
  const cardStyle = cardImgWrap ? getComputedStyle(cardImgWrap) : null;

  const testimonialSec = [...document.querySelectorAll('section')].find((s) =>
    /carried it everywhere/i.test(s.textContent)
  );

  return {
    sectionPx: [...document.querySelectorAll('section')]
      .slice(1, 6)
      .map((s) => ({
        title: s.querySelector('h3,h2')?.textContent?.slice(0, 20),
        px: getComputedStyle(s).paddingLeft,
        py: getComputedStyle(s).paddingTop,
      })),
    about: {
      h: Math.round(aboutSec?.getBoundingClientRect().height || 0),
      heading: aboutH
        ? {
            color: getComputedStyle(aboutH).color,
            y: Math.round(aboutH.getBoundingClientRect().top),
          }
        : null,
      imgH: aboutImg?.getBoundingClientRect().height,
      overlay: aboutSec ? getComputedStyle(aboutSec).backgroundImage : null,
    },
    collections: collectionLinks.map((s) => ({
      h: Math.round(s.getBoundingClientRect().height),
      y: Math.round(s.getBoundingClientRect().top + scrollY),
      pad: getComputedStyle(s).paddingTop,
    })),
    newArrivals: {
      productCount: newArrProducts?.length,
      imgH: newArrProducts?.[0]?.getBoundingClientRect().height,
    },
    popularCard: {
      imgBg: cardStyle?.backgroundColor,
      imgH: cardImgWrap?.getBoundingClientRect().height,
      imgW: cardImgWrap?.getBoundingClientRect().width,
    },
    testimonial: testimonialSec
      ? {
          h: Math.round(testimonialSec.getBoundingClientRect().height),
          pad: getComputedStyle(testimonialSec).padding,
          cols: getComputedStyle(testimonialSec.querySelector('div') || testimonialSec).gridTemplateColumns,
        }
      : null,
    valuesBtn: (() => {
      const btn = [...document.querySelectorAll('a')].find((a) => /see our values/i.test(a.textContent));
      return btn
        ? {
            text: btn.textContent,
            border: getComputedStyle(btn).border,
            color: getComputedStyle(btn).color,
            pad: getComputedStyle(btn).padding,
          }
        : null;
    })(),
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
