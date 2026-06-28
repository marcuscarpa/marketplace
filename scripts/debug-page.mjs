import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const info = await page.evaluate(() => ({
  menu: !!document.querySelector('button[aria-controls="mesco-menu"]'),
  headerHtml: document.querySelector('header')?.outerHTML?.slice(0, 400) ?? null,
  textStart: document.body.innerText.slice(0, 300),
  imgCount: document.querySelectorAll('img').length,
  imgsLoaded: [...document.querySelectorAll('img')].slice(0, 5).map((i) => ({
    w: i.naturalWidth,
    src: i.currentSrc.slice(0, 60),
  })),
}));

console.log(JSON.stringify(info, null, 2));
await browser.close();
