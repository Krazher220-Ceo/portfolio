const puppeteer = require('puppeteer-core');
const [url, out, w, h, scrollTo] = process.argv.slice(2);
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  // Останавливаем только бесконечные анимации: пауза на въездных
  // замораживала их на первом кадре, и элементы казались пропавшими.
  await p.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      const c = getComputedStyle(el);
      if (c.animationIterationCount === 'infinite') el.style.animationPlayState = 'paused';
    });
  });
  if (scrollTo) {
    await p.evaluate(sel => { const el=document.querySelector(sel); if(el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40); }, scrollTo);
    await new Promise(r => setTimeout(r, 1400));
  }
  await new Promise(r => setTimeout(r, 600));
  await p.screenshot({ path: out });
  await b.close();
})();
