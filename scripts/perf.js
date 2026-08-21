const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  const bytes = { js: 0, css: 0, img: 0, font: 0, other: 0 };
  p.on('response', async r => {
    try {
      const t = r.request().resourceType();
      const len = +(r.headers()['content-length'] || 0);
      const k = t === 'script' ? 'js' : t === 'stylesheet' ? 'css' : t === 'image' ? 'img' : t === 'font' ? 'font' : 'other';
      bytes[k] += len;
    } catch {}
  });
  await p.goto('http://localhost:3000/ru', { waitUntil: 'networkidle2' });
  const m = await p.evaluate(() => new Promise(res => {
    let cls = 0, lcp = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => { const e = l.getEntries(); lcp = e[e.length - 1].renderTime || e[e.length - 1].loadTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      res({ cls: +cls.toFixed(4), lcp: Math.round(lcp), dcl: Math.round(nav.domContentLoadedEventEnd) });
    }, 3500);
  }));
  console.log('LCP:', m.lcp + 'ms  | CLS:', m.cls, ' | DOMContentLoaded:', m.dcl + 'ms');
  console.log('загружено на первой странице:',
    Object.entries(bytes).map(([k, v]) => `${k} ${(v / 1024).toFixed(0)}KB`).join('  '));

  // CLS при смене темы — главный риск по ТЗ
  const shift = await p.evaluate(async () => {
    let cls = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; }).observe({ type: 'layout-shift' });
    const btn = [...document.querySelectorAll('button')].find(x => x.textContent.includes('RU'));
    btn.click();
    await new Promise(r => setTimeout(r, 2200));
    return +cls.toFixed(4);
  });
  console.log('CLS при смене языка:', shift);
  await b.close();
})();
