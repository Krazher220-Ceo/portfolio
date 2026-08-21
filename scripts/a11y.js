const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  await p.goto('http://localhost:3000/ru', { waitUntil: 'networkidle2' });

  // Клавиатурный проход: собираем, что получает фокус и виден ли он
  const tab = [];
  for (let i = 0; i < 22; i++) {
    await p.keyboard.press('Tab');
    const r = await p.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const c = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        label: (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 34),
        outline: c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0,
        size: Math.round(box.width) + 'x' + Math.round(box.height),
      };
    });
    if (r) tab.push(r);
  }
  const noFocus = tab.filter(t => !t.outline);
  const tooSmall = tab.filter(t => { const [w, h] = t.size.split('x').map(Number); return w > 0 && (w < 24 || h < 24); });
  console.log('фокусируемых элементов:', tab.length);
  console.log('без видимого фокус-ринга:', noFocus.length ? noFocus.map(t => t.tag + ' ' + t.label).join(' | ') : 'нет');
  console.log('меньше 24px:', tooSmall.length ? tooSmall.map(t => t.tag + ' ' + t.label + ' ' + t.size).join(' | ') : 'нет');

  // Изображения без alt
  const noAlt = await p.evaluate(() => [...document.querySelectorAll('img')]
    .filter(i => i.getAttribute('alt') === null).map(i => i.currentSrc.split('/').pop()));
  console.log('img без атрибута alt:', noAlt.length ? noAlt.join(', ') : 'нет');
  await b.close();
})();
