/**
 * Пересборка PDF-резюме из /resume/print.
 *
 * Раньше файлы делали руками, и любая правка содержания молча
 * разводила PDF со страницей — при том, что оба рендерятся из одних
 * данных. Теперь это одна команда:
 *
 *   npm run dev            # нужен поднятый сервер
 *   node scripts/cv-pdf.js
 *
 * Печатается именно /resume/print, а не интерактивная страница: в
 * файл не попадают ни сцена со светом, ни прелоадер, ни рантайм.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';
const VERSION = process.argv[2];

if (!VERSION) {
  console.error('Укажите версию: node scripts/cv-pdf.js 2026-09');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'public', 'resume');

(async () => {
  const b = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
  });
  for (const locale of ['ru', 'en']) {
    const p = await b.newPage();
    const url = `${ORIGIN}/${locale}/resume/print`;
    const res = await p.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
    if (!res || !res.ok()) throw new Error(`${url} → ${res && res.status()}`);
    const out = path.join(outDir, `alikhan-kabdualy-cv-${locale}-${VERSION}.pdf`);
    await p.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      // Поля задаёт @page в самом документе — здесь их обнуляем,
      // иначе они сложатся с ним и лист поедет.
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    console.log(`${locale}: ${(fs.statSync(out).size / 1024).toFixed(0)} KB → ${path.basename(out)}`);
    await p.close();
  }
  await b.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
