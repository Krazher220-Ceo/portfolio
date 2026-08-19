"use client";
import { useEffect, useState } from "react";
import { useSite } from "@/lib/state";
import * as store from "@/lib/storage";
import { prefersReducedMotionNow } from "@/lib/motion-prefs";
import s from "./preloader.module.css";

/**
 * Включение фонарика. Один раз за сессию, не при каждой навигации —
 * прелоадер на каждом переходе раздражает сильнее, чем помогает.
 */
export default function Preloader() {
  const { t } = useSite();
  const [on, setOn] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (store.readSession("booted") === "1" || prefersReducedMotionNow()) return;
    store.writeSession("booted", "1");
    setOn(true);
    document.documentElement.dataset.booting = "1";

    const t0 = performance.now();
    let raf = requestAnimationFrame(function step(now: number) {
      const p = Math.min(1, (now - t0) / 1400);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(step);
    });
    const done = window.setTimeout(() => {
      setOn(false);
      delete document.documentElement.dataset.booting;
    }, 1400);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(done); };
  }, []);

  if (!on) return null;
  return (
    <div className={s.veil} aria-hidden="true" data-print-hide>
      <span className={`label ${s.count}`}>
        {t.hero.loading} <span className="num">{String(pct).padStart(3, "0")}</span>
      </span>
    </div>
  );
}
