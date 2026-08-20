"use client";
import Reveal from "./Reveal";
import A from "./A";
import { TimelineSection, StackSection } from "./Sections";
import { useSite } from "@/lib/state";
import { CONTACT } from "@/content/site";
import { cvFile } from "@/lib/cv";
import s from "./about.module.css";

export default function AboutView() {
  const { t, locale } = useSite();
  return (
    <>
      <section className={`container ${s.top}`} data-selectable>
        <Reveal>
          <span className="label">{t.about.kicker}</span>
          <h1 className={`displayL ${s.title}`} data-flip>{t.about.title}</h1>
        </Reveal>

        <div className={s.layout}>
          <Reveal className={s.prose}>
            {t.about.body.map((par, i) => (
              <p key={i} className={i === 0 ? "bodyL" : undefined} data-flip>{par}</p>
            ))}
          </Reveal>

          <Reveal className={s.aside} delay={60}>
            <figure className={s.figure}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/about-beach-sitting-854.webp"
                srcSet="/media/about-beach-sitting-427.webp 427w, /media/about-beach-sitting-641.webp 641w, /media/about-beach-sitting-854.webp 854w"
                sizes="(max-width: 900px) 92vw, 30vw"
                alt={t.about.photoAlt}
                width={854}
                height={1280}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className={s.card}>
              <span className="label">{t.contacts.kicker}</span>
              <a className="mono" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <a className="mono" href={CONTACT.github} target="_blank" rel="noreferrer">
                {CONTACT.githubLabel}
              </a>
              <a className={`label ${s.cv}`} href={`/resume/${cvFile(locale)}`} download>
                {t.contacts.cv} <span aria-hidden="true">↓</span>
              </a>
              <A className="label" href="/resume">{t.contacts.cvHtml} →</A>
            </div>
          </Reveal>
        </div>
      </section>

      <TimelineSection />
      <StackSection />
    </>
  );
}
