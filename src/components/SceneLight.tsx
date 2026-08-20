"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSite } from "@/lib/state";
import { useFinePointer, useReducedMotion } from "@/lib/motion-prefs";

/**
 * Уровень света всей сцены.
 *
 * На главной с мышью свет выключен: посетитель попадает в тёмную
 * комнату, где висит погашенный светильник и едва тлеет пятно
 * в центре. Наводит на фигуру — лампа зажигается, и расцветает
 * всё сразу: конус, фон, сетка, подсвет.
 *
 * На внутренних страницах и там, где точного указателя нет
 * (телефон, планшет), свет горит всегда: наводить там нечем,
 * и держать человека в темноте было бы просто поломкой.
 */
/** Уровень «выключено»: не ноль — в комнате остаётся тлеющее пятно. */
const DIM = 0.1;

/* Разряды настоящей лампы: вспышка, провал, ещё одна — и ровный свет. */
const ON: [number, number][] = [
  [0, DIM], [40, 0.85], [95, 0.14], [150, 0.72],
  [190, 0.18], [250, 0.96], [300, 0.6], [430, 1],
];
const OFF: [number, number][] = [
  [0, 1], [90, 0.42], [160, 0.8], [250, 0.2],
  [340, 0.5], [450, 0.12], [560, 0.26], [700, DIM],
];

export default function SceneLight() {
  const { figureHover } = useSite();
  const path = usePathname() ?? "/";
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const prev = useRef<boolean | null>(null);
  const raf = useRef(0);

  const isHome = path === "/ru" || path === "/en";
  const lit = !isHome || !fine || figureHover;

  useEffect(() => {
    document.documentElement.dataset.inner = isHome ? "0" : "1";
  }, [isHome]);

  useEffect(() => {
    const root = document.documentElement;
    if (prev.current === null) {
      // Первый кадр: без вспышек, просто нужное состояние.
      root.dataset.lit = lit ? "on" : "off";
      prev.current = lit;
      return;
    }
    if (prev.current === lit) return;
    prev.current = lit;

    cancelAnimationFrame(raf.current);

    if (reduce) {
      root.dataset.lit = lit ? "on" : "off";
      root.style.setProperty("--lit", lit ? "1" : String(DIM));
      return;
    }

    /* Раскадровка ведётся отсюда, а не ключевыми кадрами CSS:
       анимация зарегистрированного кастомного свойства на корне
       заводится не во всех браузерах, и вместо мигания выходил
       скачок. И не на setTimeout: в неактивной вкладке таймеры
       сливаются в один, и вспышки пропадают. rAF привязан к кадрам —
       и точен, и честно замирает, когда вкладку не смотрят. */
    const frames = lit ? ON : OFF;
    const total = frames[frames.length - 1][0];
    root.dataset.lit = lit ? "turning-on" : "turning-off";

    const start = performance.now();
    let last = -1;
    const step = (now: number) => {
      const t = now - start;
      let i = 0;
      while (i + 1 < frames.length && frames[i + 1][0] <= t) i++;
      if (i !== last) {
        last = i;
        root.style.setProperty("--lit", String(frames[i][1]));
      }
      if (t < total) {
        raf.current = requestAnimationFrame(step);
      } else {
        root.style.setProperty("--lit", String(lit ? 1 : DIM));
        root.dataset.lit = lit ? "on" : "off";
      }
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [lit, reduce]);

  return null;
}
