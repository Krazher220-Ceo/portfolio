"use client";
import { useSite } from "@/lib/state";
import { cvFile } from "@/lib/cv";
import { CONTACT, stack, timeline } from "@/content/site";
import { projects } from "@/content/projects";
import { certificates } from "@/content/certificates";
import { plainSecret } from "@/lib/secret";
import s from "./resume.module.css";

/**
 * HTML-версия резюме. Печатается на белом листе — единственное место
 * на сайте, где допустима светлая тема. Содержание собрано из тех же
 * данных, что и PDF: расхождения между ними физически не бывает.
 *
 * Две колонки на широком экране: слева то, что читают подряд
 * (профиль, проекты, хронология), справа справочное — стек, документы,
 * образование. В печати и на узком экране колонки схлопываются в одну,
 * и порядок становится обычным резюмешным: контакты сразу под именем.
 */
export default function ResumeView({ sizes }: { sizes: { ru: string; en: string } }) {
  const { t, locale } = useSite();
  const size = sizes[locale];

  return (
    <div className={`container ${s.page}`} data-selectable>
      <header className={s.head}>
        <div>
          <span className="label">{t.resume.kicker}</span>
          <h1 className={`displayL ${s.name}`} data-flip>
            {t.hero.first} {t.hero.last}
          </h1>
          <p className={`bodyL dim ${s.tagline}`} data-flip>{t.hero.tagline}</p>
        </div>
        <div className={s.actions}>
          <a className={`btnPrimary label ${s.btn}`} href={`/resume/${cvFile(locale)}`} download>
            {t.resume.download} <span className="mono dimmer">PDF · {size}</span>
          </a>
          <button className={`btnGhost label ${s.btn}`} onClick={() => window.print()}>
            {t.resume.print}
          </button>
        </div>
      </header>

      {/* Контакты — сразу под именем, а не в колонке: в печати
          колонки схлопываются, и из сайдбара они уехали бы в конец. */}
      <ul className={s.contacts}>
        <li><a className="mono" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
        <li><a className="mono" href={CONTACT.domain}>{CONTACT.domain.replace("https://", "")}</a></li>
        <li><a className="mono" href={CONTACT.github}>{CONTACT.githubLabel}</a></li>
        <li className="mono dim">{t.footer.rights}</li>
      </ul>

      <p className={`small dimmer ${s.hint}`}>{t.resume.lead}</p>

      <div className={s.cols}>
        <div className={s.main}>
          <section className={s.block}>
            <h2 className={s.h}>{t.about.kicker}</h2>
            <p className={s.body}>{plainSecret(t.about.short, locale)}</p>
          </section>

          <section className={s.block}>
            <h2 className={s.h}>{t.resume.experience}</h2>
            <ul className={s.entries}>
              {projects.map((p) => (
                <li key={p.slug} className={s.entry}>
                  <div className={s.entryHead}>
                    <span className={s.entryName}>{p.name}</span>
                    <span className="mono label">{p.date} · {p.term[locale]}</span>
                  </div>
                  <p className={s.body}>{p.tagline[locale]}</p>
                  <p className={`${s.body} ${s.dim}`}>
                    <span className="label">{t.projects.event}: </span>{p.event[locale]}
                  </p>
                  <p className={`${s.body} ${s.dim}`}>
                    <span className="label">{t.projects.role}: </span>{p.role[locale]}
                  </p>
                  <p className={`${s.body} ${s.dim}`}>
                    <span className="label">{t.projects.stack}: </span>
                    <span className="mono">{p.stack.join(" · ")}</span>
                  </p>
                  <ul className={s.metrics}>
                    {p.metrics.map((m, i) => (
                      <li key={i}>
                        <span className="mono">
                          {m.plain
                            ? m.value.toFixed(m.decimals ?? 0)
                            : m.value.toLocaleString("ru-RU", {
                                minimumFractionDigits: m.decimals ?? 0,
                                maximumFractionDigits: m.decimals ?? 0,
                              })}
                          {m.suffix ?? ""}
                        </span>{" "}
                        {m.label[locale]}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          <section className={s.block}>
            <h2 className={s.h}>{t.timeline.kicker}</h2>
            <ul className={s.entries}>
              {timeline.map((e) => (
                <li key={e.year + e.title.ru} className={s.entry}>
                  <div className={s.entryHead}>
                    <span className={s.entryName}>{e.title[locale]}</span>
                    <span className="mono label">{e.year} · {e.city[locale]}</span>
                  </div>
                  <p className={s.body}>{e.note[locale]}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className={s.side}>
          <section className={s.block}>
            <h2 className={s.h}>{t.resume.skills}</h2>
            <dl className={s.stack}>
              <dt className="label">{t.stack.confident}</dt>
              <dd className="mono">{stack.confident.join(" · ")}</dd>
              <dt className="label">{t.stack.worked}</dt>
              <dd className="mono">{stack.worked.join(" · ")}</dd>
              <dt className="label">{t.stack.learning}</dt>
              <dd className="mono">{stack.learning.join(" · ")}</dd>
            </dl>
          </section>

          <section className={s.block}>
            <h2 className={s.h}>{t.certificates.title}</h2>
            <ul className={s.certs}>
              {certificates.map((c) => (
                <li key={c.id} className={s.cert}>
                  <span className={s.certEvent}>{c.event}</span>
                  <span className="mono label dim">{c.date}</span>
                  <span className={`small ${s.dim}`}>{c.short[locale]}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={s.block}>
            <h2 className={s.h}>{t.resume.education}</h2>
            <ul className={s.plain}>
              <li>{t.resume.school}</li>
              <li>{t.resume.musicSchool}</li>
            </ul>
          </section>

          <section className={s.block}>
            <h2 className={s.h}>{t.resume.languages}</h2>
            <p className={s.body}>{t.resume.langList}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
