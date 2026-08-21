const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await p.goto('http://localhost:3000/ru', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const r = await p.evaluate(() => {
    const q = s => { const e = document.querySelector(s); if (!e) return 'нет узла';
      const b = e.getBoundingClientRect(); const c = getComputedStyle(e);
      return `${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)} op=${c.opacity} vis=${c.visibility} disp=${c.display}`; };
    return {
      hero: q('[class*="hero-module"][class*="hero"]'),
      nameTop: q('[class*="nameTop"]'),
      figure: q('[class*="hero-module"][class*="img"]'),
      lamp: q('[class*="scene-module"][class*="lamp"]'),
      lit: document.documentElement.dataset.lit,
      litVar: getComputedStyle(document.documentElement).getPropertyValue('--lit').trim(),
      scrollY: window.scrollY,
    };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
