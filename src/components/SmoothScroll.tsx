"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotionNow } from "@/lib/motion-prefs";

/**
 * Сглаженный скролл. Не должен ломать Ctrl+F и якорные ссылки:
 * поэтому у Lenis отключён перехват якорей, а поиск браузера
 * скроллит нативно — Lenis подхватывает позицию.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotionNow()) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.6 });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
      history.replaceState(history.state, "", `#${id}`);
      (target as HTMLElement).focus?.({ preventScroll: true });
    };
    document.addEventListener("click", onAnchor);

    return () => {
      document.removeEventListener("click", onAnchor);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
