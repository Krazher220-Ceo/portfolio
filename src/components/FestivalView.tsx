"use client";
import A from "./A";
import Reveal from "./Reveal";
import CertCard from "./CertCard";
import { useSite } from "@/lib/state";
import { projects } from "@/content/projects";
import { certById } from "@/content/certificates";
import { CONTACT } from "@/content/site";
import s from "./about.module.css";
import c from "./sections.module.css";

/** Страница-хаб фестиваля: два трека, ветки на KZ UniVerse и NPAI,
 *  общий сертификат участника — отдельных сертификатов под трек нет. */
export default function FestivalView() {
  const { t, locale } = useSite();
  const tracks = [
    { p: projects.find((x) => x.slug === "kz-universe")!, kind: t.events.hackathon },
    { p: projects.find((x) => x.slug === "npai")!, kind: t.events.battle },
  ];
  const cert = certById("02")!;

  return (
    <section className={`container ${s.top}`}>
      <Reveal>
        <span className="label">{t.events.kicker}</span>
        <h1 className={`displayL ${s.title}`} data-flip>{t.events.title}</h1>
        <p className="bodyL dim" data-flip style={{ maxWidth: "62ch" }}>{t.events.lead}</p>
      </Reveal>

      <Reveal className={c.certGrid} style={{ gridTemplateColumns: "repeat(2, 1fr)", marginTop: "var(--s-12)" }}>
        {tracks.map(({ p, kind }) => (
          <div key={p.slug} className={c.cert}>
            <span className="label">{kind}</span>
            <h2 className="h3">{p.name}</h2>
            <p className="small dim" style={{ margin: 0 }}>{p.tagline[locale]}</p>
            <p className="small dim" style={{ margin: 0 }}>{p.result[locale]}</p>
            <A href={`/projects/${p.slug}`} className="label">
              {t.projects.open} <span aria-hidden="true">→</span>
            </A>
          </div>
        ))}
      </Reveal>

      <Reveal style={{ marginTop: "var(--section-gap)" }}>
        <span className="label">{t.events.commonCert}</span>
        <h2 style={{ margin: "var(--s-3) 0 var(--s-8)" }} data-flip>{t.certificates.title}</h2>
        <div style={{ maxWidth: 420 }}><CertCard cert={cert} /></div>
      </Reveal>

      <Reveal style={{ marginTop: "var(--section-gap)" }}>
        <a className="label" href={CONTACT.itFest} target="_blank" rel="noreferrer">
          {t.projects.full} <span aria-hidden="true">↗</span>
        </a>
      </Reveal>
    </section>
  );
}
