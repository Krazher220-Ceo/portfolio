"use client";

import { useEffect, useRef, useState } from "react";
import A from "./A";
import Glass from "./Glass";
import Reveal from "./Reveal";
import Counter from "./Counter";
import { FestivalOnlyCard } from "./CertCard";
import CertCard from "./CertCard";
import { useSite } from "@/lib/state";
import { claim, remember } from "@/lib/shared-element";
import { projects, type Project } from "@/content/projects";
import { certForProject } from "@/content/certificates";
import s from "./project.module.css";

export default function ProjectView({ slug }: { slug: string }) {
  const { t, locale } = useSite();
  const p = projects.find((x) => x.slug === slug)!;
  const cover = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<string>(t.projects.facts);

  /* Обратная сторона раскрытия карточки: обложка приезжает
     из позиции, которую занимала в сетке. */
  useEffect(() => { claim(`cover-${slug}`, cover.current); }, [slug]);

  /* Липкий подзаголовок: название текущего раздела разбора.
     Считается по позиции, а не по IntersectionObserver: между
     блоками наблюдатель молчит, и пилюля оставалась пустой. */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-sub]"));
    if (!els.length) return;
    let raf = 0;
    const pick = () => {
      raf = 0;
      let current = els[0];
      for (const el of els) {
        if (el.getBoundingClientRect().top <= 140) current = el;
        else break;
      }
      const name = current.getAttribute("data-sub");
      if (name) setSection((prev) => (prev === name ? prev : name));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(pick); };
    pick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [locale, slug]);

  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];
  const certInfo = certForProject(slug);

  return (
    <article>
      <header className={`container ${s.top}`}>
        <nav className={`label ${s.crumbs}`} aria-label="breadcrumb">
          <A href="/projects">{t.projects.kicker}</A>
          <span aria-hidden="true">/</span>
          <span>{p.name}</span>
        </nav>
        <span className="label">{p.event[locale]}</span>
        <h1 className={`displayL ${s.title}`} data-flip>{p.name}</h1>
        <p className={`bodyL ${s.tagline}`} data-flip>{p.tagline[locale]}</p>

        {p.cover && p.coverAlt && (
          <div ref={cover} className={s.hero}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/media/${p.cover}-1400.webp`}
              srcSet={`/media/${p.cover}-700.webp 700w, /media/${p.cover}-1050.webp 1050w, /media/${p.cover}-1400.webp 1400w`}
              sizes="(max-width: 1280px) 92vw, 1200px"
              alt={p.coverAlt[locale]}
              width={1400}
              height={933}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        )}
      </header>

      <div className="container">
        <span className={`glass glassThin label ${s.sticky}`} aria-hidden="true">
          <span key={section} className={s.stickyIn}>{section}</span>
        </span>

        {/* ── Карточка фактов ──────────────────────────────── */}
        <Reveal className={s.block} data-sub={t.projects.facts}>
          <Glass className={s.facts}>
            {([
              [t.projects.role, p.role[locale]],
              [t.projects.stack, <span key="st" className="mono">{p.stack.join(" · ")}</span>],
              [t.projects.term, <span key="tm" className="mono">{p.term[locale]}</span>],
              [t.projects.status, p.status[locale]],
              [t.projects.event, p.event[locale]],
            ] as const).map(([k, v], i) => (
              <div
                key={k}
                className={s.factRow}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="label">{k}</span>
                <span className={s.factVal}>{v}</span>
              </div>
            ))}
          </Glass>

          <div className={s.links}>
            {p.links.demo && (
              <a className={`glass label ${s.link}`} href={p.links.demo} target="_blank" rel="noreferrer">
                {t.projects.demo} <span aria-hidden="true">↗</span>
              </a>
            )}
            {p.links.repo && (
              <a className={`glass glassThin label ${s.link}`} href={p.links.repo} target="_blank" rel="noreferrer">
                {t.projects.repo} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </Reveal>

        <Block sub={t.projects.task} title={t.projects.task}>
          <p className="bodyL">{p.task[locale]}</p>
        </Block>

        <Block sub={t.projects.solution} title={t.projects.solution}>
          <p className="bodyL">{p.solution[locale]}</p>
        </Block>

        <Block sub={t.projects.tech} title={t.projects.tech}>
          <ul className={s.list}>
            {p.tech[locale].map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </Block>

        {/* ── Что пошло не так ─────────────────────────────── */}
        <Reveal className={`${s.block} ${s.wrong}`} data-sub={t.projects.wrong}>
          <span className={`label ${s.kicker}`}>{t.projects.wrong}</span>
          <h2 className="h3" style={{ margin: "var(--s-3) 0 var(--s-6)" }} data-flip>
            {t.projects.wrong}
          </h2>
          <ul className={s.list}>
            {p.wrong[locale].map((x, i) => (
              <li key={i} style={{ animationDelay: `${i * 60}ms` }}>{x}</li>
            ))}
          </ul>
        </Reveal>

        {/* ── Результат ────────────────────────────────────── */}
        <Reveal className={s.block} data-sub={t.projects.result}>
          <span className="label">{t.projects.result}</span>
          <h2 style={{ margin: "var(--s-3) 0 var(--s-8)" }} data-flip>{t.projects.result}</h2>
          <div className={s.metrics}>
            {p.metrics.map((m, i) => (
              <Glass key={i} className={s.metric} glints={2}>
                <span className={`num ${s.metricVal}`}>
                  <Counter value={m.value} decimals={m.decimals} suffix={m.suffix} plain={m.plain} />
                </span>
                <span className={`label ${s.metricLabel}`}>{m.label[locale]}</span>
              </Glass>
            ))}
          </div>
          <p className={`bodyL ${s.blockBody}`}>{p.result[locale]}</p>
        </Reveal>

        <Block sub={t.projects.otherwise} title={t.projects.otherwise}>
          <p className="bodyL">{p.otherwise[locale]}</p>
        </Block>

        <Block sub={t.projects.venue} title={t.projects.venue}>
          <p className="bodyL">{p.venue[locale]}</p>
        </Block>

        {p.gallery && (
          <Reveal className={s.block} data-sub={t.projects.kicker}>
            <div className={s.gallery}>
              {p.gallery.map((g) => (
                <figure key={g.src} className={s.shot}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/media/${g.src}-1400.webp`}
                    srcSet={`/media/${g.src}-700.webp 700w, /media/${g.src}-1050.webp 1050w, /media/${g.src}-1400.webp 1400w`}
                    sizes="(max-width: 860px) 92vw, (max-width: 1280px) 92vw, 1200px"
                    alt={g.alt[locale]}
                    width={1400}
                    height={933}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="small">{g.alt[locale]}</figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        )}

        {/* ── Сертификат ───────────────────────────────────── */}
        {certInfo && (
          <Reveal className={s.block} data-sub={t.projects.certificate}>
            <span className="label">{t.projects.certificate}</span>
            <h2 style={{ margin: "var(--s-3) 0 var(--s-8)" }} data-flip>
              {t.projects.certificate}
            </h2>
            <div style={{ maxWidth: 420 }}>
              {certInfo.festivalOnly
                ? <FestivalOnlyCard cert={certInfo.cert} />
                : <CertCard cert={certInfo.cert} />}
            </div>
          </Reveal>
        )}

        {/* ── Следующий проект ─────────────────────────────── */}
        <Reveal className={s.block}>
          <A
            href={`/projects/${next.slug}`}
            className={`glass ${s.next}`}
            onClick={() => remember(`cover-${next.slug}`, null)}
          >
            <span>
              <span className="label">{t.projects.next}</span>
              <span className={s.nextName} style={{ display: "block" }}>{next.name}</span>
            </span>
            <span className="label">{next.tagline[locale]} →</span>
          </A>
        </Reveal>
      </div>
    </article>
  );
}

function Block({ sub, title, children }: { sub: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal className={s.block} data-sub={sub}>
      <span className="label">{title}</span>
      <h2 style={{ margin: "var(--s-3) 0 var(--s-6)" }} data-flip>{title}</h2>
      <div className={s.blockBody}>{children}</div>
    </Reveal>
  );
}
