const puppeteer = require('puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });

  // 1. reduced-motion: функции остаются, вспышек нет
  const p1 = await b.newPage();
  await p1.setViewport({ width: 1280, height: 900 });
  await p1.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p1.goto('http://localhost:3000/ru', { waitUntil: 'networkidle2' });
  const rm = await p1.evaluate(async () => {
    const btn = [...document.querySelectorAll('button')].find(x => x.textContent.includes('RU'));
    const before = document.documentElement.dataset.state;
    const seen = new Set();
    const iv = setInterval(() => seen.add(document.documentElement.dataset.lit), 30);
    btn.click();
    await new Promise(r => setTimeout(r, 900));
    clearInterval(iv);
    return {
      было: before, стало: document.documentElement.dataset.state,
      язык: document.documentElement.lang, адрес: location.pathname,
      фазыСвета: [...seen].join(','),
      курсор: document.documentElement.dataset.cursor || 'системный',
    };
  });
  console.log('reduced-motion →', JSON.stringify(rm, null, 0));

  // 2. Обычный режим: сцена со светом отрабатывает и не двигает скролл
  const p2 = await b.newPage();
  await p2.setViewport({ width: 1280, height: 900 });
  await p2.goto('http://localhost:3000/ru', { waitUntil: 'networkidle2' });
  const sc = await p2.evaluate(async () => {
    window.scrollTo(0, 900); await new Promise(r => setTimeout(r, 900));
    const y0 = Math.round(window.scrollY);
    const root = document.getElementById('top');
    const btn = [...document.querySelectorAll('button')].find(x => x.textContent.includes('RU'));
    const phases = new Set();
    const iv = setInterval(() => phases.add(root.dataset.phase), 25);
    btn.click();
    await new Promise(r => setTimeout(r, 1500));
    clearInterval(iv);
    return { скроллДо: y0, скроллПосле: Math.round(window.scrollY),
             фазы: [...phases].join('→'), состояние: document.documentElement.dataset.state,
             адрес: location.pathname };
  });
  console.log('обычный режим →', JSON.stringify(sc, null, 0));
  await b.close();
})();
