const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message).slice(0, 100)));
  p.on('requestfailed', r => errs.push('не загрузилось: ' + r.url().split('/').pop()));
  await p.goto('https://alikhandev.com/ru', { waitUntil: 'networkidle2', timeout: 60000 });
  const m = await p.evaluate(() => new Promise(res => {
    let cls = 0, lcp = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => { const e = l.getEntries(); lcp = e[e.length - 1].renderTime || e[e.length - 1].loadTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => res({ cls: +cls.toFixed(4), lcp: Math.round(lcp) }), 3500);
  }));
  console.log('боевой LCP:', m.lcp + 'ms  CLS:', m.cls);
  console.log('ошибки:', errs.length ? errs.join(' | ') : 'нет');
  await p.screenshot({ path: '/tmp/live.png' });
  await b.close();
})();
