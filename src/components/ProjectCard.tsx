"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSite } from "@/lib/state";
import { localizePath } from "@/i18n/dict";
import { remember } from "@/lib/shared-element";
import type { Project } from "@/content/projects";
import s from "./cards.module.css";

export default function ProjectCard({ p, index }: { p: Project; index: number }) {
  const { t, locale } = useSite();
  const router = useRouter();
  const cover = useRef<HTMLDivElement>(null);
  const href = localizePath(`/projects/${p.slug}`, locale);

  /* Настоящая ссылка внутри остаётся — её видит скринридер, её можно
     открыть в новой вкладке и по ней работает предзагрузка. Клик по
     карточке просто повторяет её, не перехватывая выделение текста
     и не мешая средней кнопке и модификаторам. */
  const openFromCard = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((e.target as HTMLElement).closest("a, button")) return;
    remember(`cover-${p.slug}`, cover.current);
    router.push(href);
  };

  return (
    <article
      className={s.card}
      data-clickable
      onClick={openFromCard}
    >
      <div ref={cover} className={s.cover} data-kind={p.cover ? "photo" : "data"}>
        {p.cover && p.coverAlt ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/media/${p.cover}-1400.webp`}
            srcSet={`/media/${p.cover}-700.webp 700w, /media/${p.cover}-1050.webp 1050w, /media/${p.cover}-1400.webp 1400w`}
            sizes="(max-width: 900px) 92vw, 44vw"
            alt={p.coverAlt[locale]}
            width={1400}
            height={933}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          /* Фотографии с этой площадки нет. Ставить сюда чужой кадр
             нельзя, поэтому обложка — данные проекта, а не картинка. */
          <div className={s.dataCover} aria-hidden="true">
            <span className={`mono ${s.dataBig}`}>
              {p.metrics[0].value.toLocaleString("ru-RU")}
              {p.metrics[0].suffix ?? ""}
            </span>
            <span className={`label ${s.dataLabel}`}>{p.metrics[0].label[locale]}</span>
            <span className={`mono ${s.dataDate}`}>{p.date}</span>
          </div>
        )}
      </div>

      <div className={s.body}>
        <span className="label">{p.event[locale]}</span>
        <h3 className={s.title}>{p.name}</h3>
        <p className={`dim ${s.tagline}`}>{p.tagline[locale]}</p>
        <div className={s.chips}>
          {p.stack.slice(0, 4).map((x) => (
            <span key={x} className={`mono ${s.chip}`}>{x}</span>
          ))}
        </div>
        <Link
          href={href}
          className={`label ${s.open}`}
          onClick={() => remember(`cover-${p.slug}`, cover.current)}
        >
          {t.projects.open} <span aria-hidden="true">→</span>
          <span className="srOnly">: {p.name}</span>
        </Link>
      </div>
    </article>
  );
}
