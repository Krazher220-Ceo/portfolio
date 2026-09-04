import { dictionaries, type Locale } from "@/i18n/dict";
import { projects } from "@/content/projects";
import { CONTACT, stack, timeline } from "@/content/site";
import { certificates } from "@/content/certificates";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const num = (v: number, d = 0, plain = false) =>
  plain ? v.toFixed(d)
        : v.toLocaleString("ru-RU", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Белый лист, чёрный текст, моно для метрик. Ни стекла, ни конуса. */
export function renderCv(locale: Locale): string {
  const t = dictionaries[locale];
  const L = locale === "ru" ? "ru" : "en";

  const projectBlocks = projects.map((p) => `
    <article class="entry">
      <div class="head">
        <h3>${esc(p.name)}</h3>
        <span class="mono meta">${esc(p.date)} · ${esc(p.term[locale])}</span>
      </div>
      <p class="lead">${esc(p.tagline[locale])}</p>
      <p class="meta"><b>${esc(t.projects.event)}:</b> ${esc(p.event[locale])}</p>
      <p class="meta"><b>${esc(t.projects.role)}:</b> ${esc(p.role[locale])}</p>
      <p class="meta"><b>${esc(t.projects.stack)}:</b> <span class="mono">${esc(p.stack.join(" · "))}</span></p>
      <ul class="metrics">
        ${p.metrics.map((m) =>
          `<li><span class="mono">${num(m.value, m.decimals ?? 0, m.plain)}${esc(m.suffix ?? "")}</span> ${esc(m.label[locale])}</li>`
        ).join("")}
      </ul>
    </article>`).join("");

  const timelineBlocks = timeline.map((e) => `
    <article class="entry tight">
      <div class="head">
        <h3>${esc(e.title[locale])}</h3>
        <span class="mono meta">${esc(e.year)} · ${esc(e.city[locale])}</span>
      </div>
      <p class="lead">${esc(e.note[locale])}</p>
    </article>`).join("");

  const certBlocks = certificates.map((c) => `
    <li>
      <b>${esc(c.event)}</b> <span class="mono">${esc(c.date)}</span><br>
      <span class="meta">${esc(c.short[locale])}</span>
    </li>`).join("");

  return `<!doctype html>
<html lang="${L}">
<head>
<meta charset="utf-8">
<title>${esc(t.hero.first)} ${esc(t.hero.last)} — ${esc(t.resume.title)}</title>
<meta name="robots" content="noindex">
<style>
  @page { size: A4; margin: 14mm 15mm; }
  * { box-sizing: border-box; }
  html, body { background: #fff; color: #111; margin: 0; }
  body {
    font: 9.6pt/1.44 -apple-system, "Helvetica Neue", Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .mono { font-family: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
          font-variant-numeric: tabular-nums; font-size: 0.94em; }
  header { border-bottom: 1.5pt solid #111; padding-bottom: 7pt; margin-bottom: 11pt; }
  h1 { font-size: 23pt; letter-spacing: -0.5pt; margin: 0 0 3pt; }
  .tag { font-size: 10.5pt; color: #333; margin: 0 0 6pt; max-width: 120mm; }
  .contacts { display: flex; flex-wrap: wrap; gap: 4pt 12pt; color: #444; }
  section { margin-bottom: 8pt; break-inside: auto; }
  h2 { font-size: 7.6pt; text-transform: uppercase; letter-spacing: 1.1pt;
       color: #666; border-bottom: 0.5pt solid #ccc; padding-bottom: 3pt;
       margin: 0 0 8pt; font-weight: 600; }
  .entry { margin-bottom: 8pt; break-inside: avoid; }
  .entry.tight { margin-bottom: 4.5pt; }
  .head { display: flex; justify-content: space-between; align-items: baseline; gap: 8pt; }
  h3 { font-size: 11pt; margin: 0; }
  .lead { margin: 2pt 0; color: #222; }
  .meta { margin: 1pt 0; color: #555; font-size: 9pt; }
  .meta b { color: #333; font-weight: 600; }
  ul.metrics { margin: 3pt 0 0; padding-left: 11pt; color: #444; font-size: 8.8pt; }
  ul.metrics li { margin-bottom: 1pt; }
  dl.stack { display: grid; grid-template-columns: 42mm 1fr; gap: 4pt 8pt; margin: 0; }
  dt { color: #666; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.7pt; }
  dd { margin: 0; color: #222; }
  ul.plain { margin: 0; padding-left: 11pt; color: #222; }
  ul.certs { margin: 0; padding-left: 11pt; color: #222; }
  ul.certs li { margin-bottom: 2.5pt; break-inside: avoid; }
  ul.certs b { font-weight: 600; }
  .duo { display: grid; grid-template-columns: 1fr 52mm; gap: 0 10mm;
         break-inside: avoid; }
  a { color: #111; text-decoration: none; }
</style>
</head>
<body>
  <header>
    <h1>${esc(t.hero.first)} ${esc(t.hero.last)}</h1>
    <p class="tag">${esc(t.hero.tagline)}</p>
    <div class="contacts mono">
      <span>${esc(CONTACT.email)}</span>
      <span>${esc(CONTACT.domain.replace("https://", ""))}</span>
      <span>${esc(CONTACT.githubLabel)}</span>
      <span>${esc(t.footer.rights)}</span>
    </div>
  </header>

  <section>
    <h2>${esc(t.about.kicker)}</h2>
    <p class="lead">${esc(t.about.short)}</p>
  </section>

  <section>
    <h2>${esc(t.resume.experience)}</h2>
    ${projectBlocks}
  </section>

  <section>
    <h2>${esc(t.timeline.kicker)} · ${esc(t.timeline.title)}</h2>
    ${timelineBlocks}
  </section>

  <section>
    <h2>${esc(t.resume.skills)}</h2>
    <dl class="stack">
      <dt>${esc(t.stack.confident)}</dt><dd class="mono">${esc(stack.confident.join(" · "))}</dd>
      <dt>${esc(t.stack.worked)}</dt><dd class="mono">${esc(stack.worked.join(" · "))}</dd>
      <dt>${esc(t.stack.learning)}</dt><dd class="mono">${esc(stack.learning.join(" · "))}</dd>
    </dl>
  </section>

  <section>
    <h2>${esc(t.certificates.title)}</h2>
    <ul class="certs">${certBlocks}</ul>
  </section>

  <!-- Образование и языки в ряд: по отдельности последняя секция
       уезжала на третий лист ради двух строк. -->
  <div class="duo">
    <section>
      <h2>${esc(t.resume.education)}</h2>
      <ul class="plain">
        <li>${esc(t.resume.school)}</li>
        <li>${esc(t.resume.musicSchool)}</li>
      </ul>
    </section>
    <section>
      <h2>${esc(t.resume.languages)}</h2>
      <p class="lead">${esc(t.resume.langList)}</p>
    </section>
  </div>
</body>
</html>`;
}
