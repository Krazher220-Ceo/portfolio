"use client";
import { useEffect, useRef } from "react";
import s from "./shell.module.css";
import { useSite } from "@/lib/state";

export default function Progress() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useSite();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
        el.style.setProperty("--p", String(Math.min(1, window.scrollY / max)));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className={s.progress} role="presentation" aria-label={t.a11y.progress} />;
}
