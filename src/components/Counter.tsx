"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion-prefs";

/**
 * Метрика отсчитывается от нуля при входе в кадр и останавливается
 * ровно на целевом значении. Никаких бесконечных прокруток цифр.
 */
export default function Counter({
  value, decimals = 0, suffix = "", plain = false,
}: { value: number; decimals?: number; suffix?: string; plain?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) { setShown(value); return; }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const start = performance.now();
        const dur = 420;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3); // e-out
          setShown(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
          else setShown(value);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, reduce]);

  const text = plain
    ? shown.toFixed(decimals)
    : shown.toLocaleString("ru-RU", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span ref={ref} className="num">
      {text}
      {suffix}
    </span>
  );
}
