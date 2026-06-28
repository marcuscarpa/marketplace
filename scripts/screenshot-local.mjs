import { chromium } from 'playwright';
import { join } from 'path';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: join(process.cwd(), 'scripts', 'mesco-audit', 'local-hero.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  await page.screenshot({
    path: join(process.cwd(), 'scripts', 'mesco-audit', 'local-full.png'),
    fullPage: true,
  });
  await browser.close();
  console.log('Screenshots saved');
}

main();
