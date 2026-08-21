const pages = ['/ru','/ru/projects','/ru/projects/jasyl','/ru/about','/ru/certificates','/ru/resume','/ru/events/it-fest-2025','/en'];
const widths = [375, 768, 1024, 1440];
(async () => {
  const puppeteer = require('puppeteer-core');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new', args: ['--no-sandbox'] });
  const bad = [];
  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    for (const p of pages) {
      const errs = [];
      page.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
      await page.goto('http://localhost:3000' + p, { waitUntil: 'networkidle2', timeout: 30000 });
      const r = await page.evaluate(() => {
        const de = document.documentElement;
        const over = de.scrollWidth - de.clientWidth;
        const wide = [...document.querySelectorAll('body *')]
          .filter(e => e.getBoundingClientRect().right > window.innerWidth + 2)
          .slice(0, 3)
          .map(e => e.tagName + '.' + String(e.className || '').replace(/[a-z-]+-module__\w+__/g, '').trim().slice(0, 26));
        return { over, wide };
      });
      if (r.over > 2 || errs.length) bad.push(`${w}px ${p} → сдвиг ${r.over}px ${r.wide.join(', ')} ${errs.join(' | ')}`);
    }
    await page.close();
  }
  console.log(bad.length ? bad.join('\n') : 'переполнений и ошибок нет на всех ширинах');
  await browser.close();
})();
