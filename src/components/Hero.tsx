"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/state";
import { useReducedMotion } from "@/lib/motion-prefs";
import { stack } from "@/content/site";
import s from "./hero.module.css";

const ROLE_MS = 2800;

export default function Hero() {
  const { t, switchState, hintSeen, primeSound, setFigureHover } = useSite();
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);
  const [paused, setPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Параллакс от курсора: фигура ±8px, конус ±4px, фон ±2px.
     Максимум 8px — больше вызывает тошноту. */
  useEffect(() => {
    const el = stage.current;
    if (!el || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const on = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--par-x", `${(x * 8).toFixed(2)}px`);
        el.style.setProperty("--par-y", `${(y * 8).toFixed(2)}px`);
      });
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => { window.removeEventListener("pointermove", on); cancelAnimationFrame(raf); };
  }, [reduce]);

  /* Переключатель роли. Формулировки — из блока «Стек», не выдуманы. */
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setPrev(role);
      setRole((r) => (r + 1) % t.hero.roles.length);
      setPulse(true);
      window.setTimeout(() => setPulse(false), 260);
      window.setTimeout(() => setPrev(null), 500);
    }, ROLE_MS);
    return () => window.clearInterval(id);
  }, [role, paused, t.hero.roles.length]);

  useEffect(() => {
    const on = () => { if (window.scrollY > 40) setScrolled(true); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <section className={s.hero} data-lit-section aria-labelledby="hero-name">
      <div className="container">
        <div ref={stage} className={s.stage}>
          {/* Свет в комнате, а не ореол-наклейка вокруг кадра. */}
          <span className={s.glow} aria-hidden="true" />
          <h1 id="hero-name" className="srOnly">
            {t.hero.first} {t.hero.last} — {t.hero.tagline}
          </h1>

          <p className={`hero ${s.nameTop}`} aria-hidden="true" data-flip>
            <span className={s.clip}><span>{t.hero.first}</span></span>
          </p>

          <div className={s.figureWrap}>
            {/* Настоящая кнопка: доступна с клавиатуры, с фокус-рингом.
                Дублируется компактным RU / EN в шапке. */}
            <button
              className={s.figure}
              onClick={switchState}
              onPointerEnter={() => { primeSound(); setFigureHover(true); }}
              onPointerLeave={() => setFigureHover(false)}
              onFocus={() => setFigureHover(true)}
              onBlur={() => setFigureHover(false)}
              data-cursor="photo"
              aria-label={t.a11y.figure}
            >
              <picture>
                <source
                  srcSet="/media/figure-620.webp 620w, /media/figure-900.webp 900w, /media/figure-1240.webp 1240w"
                  sizes="(max-width: 900px) 60vw, 34vw"
                  type="image/webp"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={s.img}
                  src="/media/figure-900.webp"
                  width={1273}
                  height={1863}
                  alt=""
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </button>

            {!hintSeen && (
              <span className={s.hint} aria-hidden="true">
                <span className={s.cord} />
                <span className="label">{t.state.hint}</span>
              </span>
            )}
          </div>

          <p className={`hero ${s.nameBottom}`} aria-hidden="true" data-flip>
            <span className={s.clip}><span>{t.hero.last}</span></span>
          </p>

          <div
            className={`lens lensWarp ${s.roles} ${pulse ? s.rolesPulse : ""}`}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            role="group"
            aria-label={t.a11y.roleRotator}
          >
            {prev !== null && (
              <span className={`${s.role} ${s.roleOut}`} aria-hidden="true">
                {t.hero.roles[prev]}
              </span>
            )}
            <span className={`${s.role} ${prev !== null ? s.roleIn : ""}`} aria-live="polite">
              {t.hero.roles[role]}
            </span>
          </div>

          <div className={s.below}>
            <div>
              <div className={s.marks}>
                {t.hero.marks.map((m) => (
                  <span key={m} className={`pill label ${s.mark}`}>{m}</span>
                ))}
              </div>
              <p className={`bodyL ${s.tagline}`} style={{ marginTop: "var(--s-4)" }}>
                {t.hero.tagline}
              </p>
            </div>

            <div className={`glass ${s.panel}`}>
              <span className="label">{t.stack.confident}</span>
              <div className={s.panelRow}>
                {stack.confident.map((x) => (
                  <span key={x} className={`mono ${s.chip}`}>{x}</span>
                ))}
              </div>
              <span className="label" style={{ marginTop: "var(--s-2)" }}>{t.stack.worked}</span>
              <div className={s.panelRow}>
                {stack.worked.slice(0, 6).map((x) => (
                  <span key={x} className={`mono ${s.chip}`}>{x}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <span className={s.scrollHint} data-gone={scrolled} aria-hidden="true">
        <span className={s.scrollLine} />
        <span className="label">{t.hero.scrollHint}</span>
      </span>
    </section>
  );
}
