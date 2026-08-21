"use client";

import { useEffect, useRef, useState } from "react";
import A from "./A";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import CertCard from "./CertCard";
import { useSite } from "@/lib/state";
import { projects } from "@/content/projects";
import { CONTACT, stack, timeline } from "@/content/site";
import { certificates } from "@/content/certificates";
import s from "./sections.module.css";

/** Сколько раз список повторяется внутри одной половины ленты. */
const REPEAT = 4;

/**
 * Заголовок секции. Ведёт типографика, а не коробка: номер и метка
 * набраны моно и стоят в собственной колонке, заголовок крупный
 * с плотным трекингом, между ними — волосяная линия. Ни рамки,
 * ни подложки: разделяют отступ и контраст, а не бордер.
 */
export function SectionHead({
  n, kicker, title, lead, id,
}: { n: string; kicker: string; title: string; lead?: string; id?: string }) {
  return (
    <Reveal className={s.head} id={id}>
      <div className={s.headMeta}>
        <span className={`mono ${s.num}`}>{n}</span>
        <span className={s.rule} aria-hidden="true" />
        <span className="label">{kicker}</span>
      </div>
      <h2 data-flip>{title}</h2>
      {lead && <p className={`bodyL ${s.lead}`} data-flip>{lead}</p>}
    </Reveal>
  );
}

/* ── Обо мне, кратко ──────────────────────────────────────── */
export function AboutShort() {
  const { t } = useSite();
  return (
    <section className="section container" data-lit-section aria-labelledby="about-h">
      <SectionHead n="01" kicker={t.about.kicker} title={t.about.title} id="about-h" />
      <div className={s.split}>
        <Reveal className={s.text}>
          <p className="bodyL" data-flip>{t.about.short}</p>
          <A href="/about" className={`label ${s.moreLink}`}>
            {t.about.more} <span aria-hidden="true">→</span>
          </A>
        </Reveal>
        <Reveal className={s.meta} delay={60}>
          <div className={s.cert} style={{ paddingLeft: "var(--s-6)", borderLeft: "1px solid color-mix(in srgb, var(--accent-hi) 30%, transparent)" }}>
            <span className="label">{t.timeline.title}</span>
            <p className="small dim" data-flip style={{ margin: 0 }}>{t.timeline.lead}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Проекты ──────────────────────────────────────────────── */
export function ProjectsSection({ all = false }: { all?: boolean }) {
  const { t } = useSite();
  return (
    <section className="section container" data-lit-section aria-labelledby="projects-h">
      <SectionHead
        n="02"
        kicker={t.projects.kicker}
        title={t.projects.title}
        lead={t.projects.lead}
        id="projects-h"
      />
      <div className={s.grid ?? ""}>
        <div className="cardsGrid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 4) * 50}>
              <ProjectCard p={p} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
      {!all && (
        <A href="/projects" className={`label ${s.moreLink}`}>
          {t.projects.all} <span aria-hidden="true">→</span>
        </A>
      )}
    </section>
  );
}

/* ── Хронология: точки зажигаются по одной ────────────────── */
export function TimelineSection() {
  const { t, locale } = useSite();
  const wrap = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const line = el.querySelector<HTMLElement>(`.${s.line}`);
    const items = Array.from(el.querySelectorAll<HTMLElement>(`.${s.event}`));
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (window.innerHeight * 0.75 - r.top) / r.height));
        line?.style.setProperty("--tl", String(p));
        setLit(Math.round(p * items.length));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="section container" data-lit-section aria-labelledby="timeline-h">
      <SectionHead
        n="03"
        kicker={t.timeline.kicker}
        title={t.timeline.title}
        lead={t.timeline.lead}
        id="timeline-h"
      />
      <div ref={wrap} className={s.timeline}>
        <span className={s.line} aria-hidden="true" />
        {timeline.map((e, i) => (
          <div key={e.year + e.title.ru} className={s.event} data-lit={i < lit}>
            <span className={s.dot} aria-hidden="true" />
            <span className="label">
              <span className={s.year}>{e.year}</span> · <span className={s.city}>{e.city[locale]}</span>
            </span>
            <span className={s.evTitle} data-flip>{e.title[locale]}</span>
            <p className={`small ${s.evNote}`} data-flip>{e.note[locale]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Стек: три ленты с разной прозрачностью ───────────────── */
export function StackSection() {
  const { t } = useSite();
  const tiers = [
    { title: t.stack.confident, items: stack.confident, cls: "" },
    { title: t.stack.worked, items: stack.worked, cls: s.tier2 },
    { title: t.stack.learning, items: stack.learning, cls: s.tier3 },
  ];
  return (
    <section className="section" data-lit-section aria-labelledby="stack-h">
      <div className="container">
        <SectionHead
          n="04"
        kicker={t.stack.kicker}
          title={t.stack.title}
          lead={t.stack.lead}
          id="stack-h"
        />
      </div>
      {tiers.map((tier) => (
        <div key={tier.title} className={s.tierRow}>
          <div className="container">
            <span className="label">{tier.title}</span>
          </div>
          <div className={`${s.marquee} ${tier.cls}`}>
            {/* Каждая половина повторяет список столько раз, чтобы
                перекрыть ширину экрана: короткая лента иначе
                доезжает до конца и показывает пустоту. */}
            <div className={s.track} aria-hidden="true">
              {[0, 1].map((half) => (
                <div className={s.half} key={half}>
                  {Array.from({ length: REPEAT }).flatMap((_, r) =>
                    tier.items.map((x) => (
                      <span key={`${x}-${r}`} className={`pill mono ${s.tech}`}>
                        {x}
                      </span>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="srOnly">{tier.title}: {tier.items.join(", ")}</p>
        </div>
      ))}
    </section>
  );
}

/* ── Сертификаты ──────────────────────────────────────────── */
export function CertificatesSection({ all = false }: { all?: boolean }) {
  const { t } = useSite();
  return (
    <section className="section container" data-lit-section aria-labelledby="certs-h">
      <SectionHead
        n="05"
        kicker={t.certificates.kicker}
        title={t.certificates.title}
        lead={t.certificates.lead}
        id="certs-h"
      />
      <div className={s.certGrid}>
        {certificates.map((c, i) => (
          <Reveal key={c.id} delay={i * 50}>
            <CertCard cert={c} />
          </Reveal>
        ))}
      </div>
      {!all && (
        <A href="/certificates" className={`label ${s.moreLink}`}>
          {t.certificates.all} <span aria-hidden="true">→</span>
        </A>
      )}
    </section>
  );
}

/* ── Контакты ─────────────────────────────────────────────── */
export function ContactsSection({ cvSize }: { cvSize: string }) {
  const { t, locale } = useSite();
  const file = `alikhan-kabdualy-cv-${locale}-2026-08.pdf`;
  return (
    <section className="section container" data-lit-section aria-labelledby="contacts-h">
      <SectionHead
        n="06"
        kicker={t.contacts.kicker}
        title={t.contacts.title}
        lead={t.contacts.lead}
        id="contacts-h"
      />
      <Reveal>
        <a className={s.mailBig} href={`mailto:${CONTACT.email}`} data-selectable>
          <span className="mono">{CONTACT.email}</span>
        </a>
        <div className={s.contactRow}>
          <a className={`btnPrimary label ${s.cta}`} href={`/resume/${file}`} download>
            {t.contacts.cv}
            <span className={`mono ${s.ctaSize}`}>PDF · {cvSize}</span>
          </a>
          <A className={`btnGhost label ${s.cta}`} href="/resume">{t.contacts.cvHtml}</A>
          <a
            className={`btnGhost label ${s.cta}`}
            href={CONTACT.github}
            target="_blank"
            rel="noreferrer"
          >
            {t.contacts.github}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
