"use client";
import { useRef } from "react";
import A from "./A";
import Glass from "./Glass";
import { useSite } from "@/lib/state";
import { useLightbox } from "./Lightbox";
import type { Certificate } from "@/content/certificates";
import s from "./sections.module.css";

export default function CertCard({ cert }: { cert: Certificate }) {
  const { t, locale } = useSite();
  const open = useLightbox();
  const btn = useRef<HTMLButtonElement>(null);

  /* Пустой слот — честно пустой слот, а не заглушка-имитация.
     Кликом не открывается. */
  if (cert.status === "pending" || !cert.file || !cert.preview) {
    return (
      <div className={s.slot}>
        <div className={s.slotBox}>
          <span className="label">{t.certificates.pending}</span>
        </div>
        <div className={s.certMeta}>
          <span className={s.certEvent}>{cert.event}</span>
          <span className={`mono label`}>{cert.date}</span>
        </div>
      </div>
    );
  }

  return (
    <Glass className={s.cert} as="figure" style={{ margin: 0 }}>
      <button
        ref={btn}
        data-cursor="image"
        onClick={() =>
          open(
            {
              src: `/certificates/${cert.file}`,
              alt: cert.alt[locale],
              caption: cert.note[locale],
              href: `/certificates/${cert.file}`,
            },
            btn.current!
          )
        }
        aria-label={`${t.certificates.open}: ${cert.alt[locale]}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={s.certShot}
          src={`/certificates/${cert.preview}`}
          alt={cert.alt[locale]}
          width={cert.previewW}
          height={cert.previewH}
          loading="lazy"
          decoding="async"
        />
      </button>
      <figcaption className={s.certMeta}>
        <span className={s.certEvent}>{cert.event}</span>
        <span className="mono label">{cert.date}</span>
        <p className={`small ${s.certNote}`}>{cert.note[locale]}</p>
      </figcaption>
    </Glass>
  );
}

/** Карточка «сертификата под трек нет — есть общий фестивальный». */
export function FestivalOnlyCard({ cert }: { cert: Certificate }) {
  const { t, locale } = useSite();
  return (
    <Glass className={s.cert}>
      <span className="label">{t.projects.certificate}</span>
      <p className="small dim" style={{ margin: 0 }}>{t.certificates.festivalOnly}</p>
      {cert.preview && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className={s.certShot}
          src={`/certificates/${cert.preview}`}
          alt={cert.alt[locale]}
          width={cert.previewW}
          height={cert.previewH}
          loading="lazy"
          decoding="async"
        />
      )}
      <A href="/events/it-fest-2025" className="label">
        {t.certificates.toFestival} <span aria-hidden="true">→</span>
      </A>
    </Glass>
  );
}
