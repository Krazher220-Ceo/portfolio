"use client";
import {
  createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode,
} from "react";
import { useSite } from "@/lib/state";
import s from "./lightbox.module.css";

type Shot = { src: string; alt: string; caption?: string; href?: string };
const Ctx = createContext<(shot: Shot, from: HTMLElement) => void>(() => {});
export const useLightbox = () => useContext(Ctx);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const { t } = useSite();
  const [shot, setShot] = useState<Shot | null>(null);
  const origin = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);

  const open = useCallback((next: Shot, from: HTMLElement) => {
    origin.current = from;
    setShot(next);
  }, []);

  const close = useCallback(() => {
    setShot(null);
    // Фокус возвращается на исходный элемент, а не улетает в body.
    origin.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!shot) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      // Фокус заперт внутри просмотра.
      const f = panel.current?.querySelectorAll<HTMLElement>(
        "a[href],button:not([disabled]),[tabindex]:not([tabindex='-1'])"
      );
      if (!f || !f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [shot, close]);

  return (
    <Ctx.Provider value={open}>
      {children}
      {shot && (
        <div
          className={s.backdrop}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          onTouchStart={(e) => { startY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => {
            const y0 = startY.current;
            if (y0 !== null && e.changedTouches[0].clientY - y0 > 90) close();
            startY.current = null;
          }}
        >
          <div
            ref={panel}
            className={`glass glassThick ${s.panel}`}
            role="dialog"
            aria-modal="true"
            aria-label={shot.alt}
            tabIndex={-1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.img} src={shot.src} alt={shot.alt} />
            {shot.caption && <p className={`small dim ${s.cap}`}>{shot.caption}</p>}
            <div className={s.tools}>
              {shot.href && (
                <a className={`label ${s.link}`} href={shot.href} target="_blank" rel="noreferrer">
                  {t.certificates.openOriginal}
                </a>
              )}
              <button className={`label ${s.close}`} onClick={close}>
                {t.certificates.lightboxClose} · Esc
              </button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
