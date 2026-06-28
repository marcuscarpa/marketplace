import { chromium } from 'playwright';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:3000/en', { waitUntil: 'networkidle' });
await p.evaluate(() => document.getElementById('most-popular')?.scrollIntoView());

const before = await p.evaluate(() => {
  const add = document.querySelector('#most-popular a.uppercase');
  const pick = (el) => el && { y: Math.round(el.getBoundingClientRect().y), h: Math.round(el.getBoundingClientRect().height), text: el.textContent?.trim() };
  return pick(add);
});

await (await p.$('#most-popular article .group\\/image'))?.hover();
await p.waitForTimeout(400);

const hover = await p.evaluate(() => {
  const add = [...document.querySelectorAll('#most-popular a')].find((a) => /add to cart/i.test(a.textContent));
  const pick = (el) => el && {
    y: Math.round(el.getBoundingClientRect().y),
    bottom: Math.round(el.getBoundingClientRect().bottom),
    h: Math.round(el.getBoundingClientRect().height),
    pad: getComputedStyle(el).padding,
    borderRadius: getComputedStyle(el).borderRadius,
    fontSize: getComputedStyle(el).fontSize,
  };
  const image = document.querySelector('#most-popular .group\\/image');
  return { add: pick(add), imageBottom: image ? Math.round(image.getBoundingClientRect().bottom) : null };
});

console.log(JSON.stringify({ before, hover }, null, 2));
await b.close();
