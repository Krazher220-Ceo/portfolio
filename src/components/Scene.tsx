"use client";

import { useEffect, useRef } from "react";
import { useSite } from "@/lib/state";
import { useReducedMotion, useDesktop } from "@/lib/motion-prefs";
import s from "./scene.module.css";

export default function Scene() {
  const { phase } = useSite();
  const reduce = useReducedMotion();
  const desktop = useDesktop();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  /* Свет следует за скроллом: конус слабо разворачивается вниз,
     освещая текущую секцию, а светильник уходит за первый экран.

     Габариты секций считаются один раз и пересчитываются только на
     resize: getBoundingClientRect по всем секциям на каждый кадр
     прокрутки — это принудительный layout, и именно он давал
     подлагивания на длинных страницах. */
  useEffect(() => {
    if (reduce) return;
    const el = wrap.current;
    if (!el) return;

    let bands: { mid: number }[] = [];
    let docH = 1;

    const remeasure = () => {
      const y = window.scrollY;
      bands = Array.from(
        document.querySelectorAll<HTMLElement>("[data-lit-section]")
      ).map((sec) => {
        const r = sec.getBoundingClientRect();
        return { mid: r.top + y + r.height / 2 };
      });
      docH = Math.max(1, document.body.scrollHeight - window.innerHeight);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const vh = window.innerHeight;
        const p = Math.min(1, y / docH);

        el.style.setProperty("--cone-tilt", `${(p * 5.5).toFixed(2)}deg`);
        el.style.setProperty("--cone-reach", (1 + p * 0.18).toFixed(3));
        // Светильник гаснет к концу первого экрана.
        el.style.setProperty(
          "--lamp-fade",
          Math.max(0, 1 - y / (vh * 0.75)).toFixed(3)
        );

        // Ближайшая к центру кадра секция — без обращения к layout.
        const center = y + vh / 2;
        let best = 0.6;
        let bestD = Infinity;
        for (const b of bands) {
          const d = Math.abs(b.mid - center);
          if (d < bestD) { bestD = d; best = (b.mid - y) / vh; }
        }
        el.style.setProperty("--trail-y", (Math.max(-0.2, Math.min(1.2, best)) * 100).toFixed(1));
      });
    };

    remeasure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  /* Рывок шнура даёт источнику угловой импульс: качание ±5°
     по пружине, затухает за ~1.3s. */
  useEffect(() => {
    const el = wrap.current;
    if (!el || reduce) return;
    if (phase !== "pull") return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = (now - t0) / 1000;
      if (t > 1.35) { el.style.setProperty("--cone-swing", "0deg"); return; }
      // stiffness 130, damping 14, mass 0.7
      const w = Math.sqrt(130 / 0.7);
      const z = 14 / (2 * Math.sqrt(130 * 0.7));
      const a = 5 * Math.exp(-z * w * t) * Math.cos(w * Math.sqrt(1 - z * z) * t);
      el.style.setProperty("--cone-swing", `${a.toFixed(3)}deg`);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduce]);

  /* Пылинки в конусе: только десктоп, только при живом моушне. */
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || reduce || !desktop) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let raf = 0, w = 0, h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const N = 22;
    const dots = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.6 + Math.random() * 1.3,
      v: 0.012 + Math.random() * 0.022,
      d: Math.random() * Math.PI * 2,
      a: 0.14 + Math.random() * 0.34,
    }));
    const size = () => {
      const box = cv.getBoundingClientRect();
      w = Math.round(box.width); h = Math.round(box.height);
      if (w < 2 || h < 2) return;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const color = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--light-core").trim() || "#fff";
    let tint = color();
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(50, now - last); last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = tint;
      for (const p of dots) {
        p.y -= p.v * (dt / 16.7) * 0.004;
        p.d += 0.004;
        if (p.y < -0.05) { p.y = 1.05; p.x = 0.28 + Math.random() * 0.36; }
        // конус сужается кверху: пылинки живут внутри него
        const spread = 0.1 + p.y * 0.8;
        const x = (0.5 + Math.sin(p.d) * 0.03 + (p.x - 0.5) * spread) * w;
        const y = p.y * h;
        ctx.globalAlpha = p.a * (1 - p.y * 0.55);
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const mo = new MutationObserver(() => { tint = color(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-state"] });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); };
  }, [reduce, desktop]);

  const lit = phase === "cut" || phase === "dark" ? 0 : 1;

  return (
    <div
      ref={wrap}
      className={s.wrap}
      aria-hidden="true"
      data-print-hide
      data-phase={phase}
      style={{ ["--cone-on" as string]: lit }}
    >
      <div className={s.mesh}>
        <span className={`${s.blob} ${s.blob1}`} />
        <span className={`${s.blob} ${s.blob2}`} />
        <span className={`${s.blob} ${s.blob3}`} />
      </div>
      <div className={`${s.beam} ${s.breathe}`} />
      <div className={s.trail} />
      <div className={s.pool} />
      <div className={`${s.halo} ${s.breathe}`} />
      <div className={s.head}>
        <span className={s.lampStack}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={s.lamp}
            src="/media/lamp-fixture.webp"
            alt=""
            width={460}
            height={641}
            decoding="async"
          />
          <span className={s.shadeSpill} />
          <span className={s.bulb} />
        </span>
      </div>
      <canvas ref={canvas} className={s.dust} />
    </div>
  );
}
