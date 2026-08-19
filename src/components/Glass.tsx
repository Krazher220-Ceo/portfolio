"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion-prefs";

type Density = "thin" | "base" | "thick";

/** Точечные блики. Позиции детерминированы, иначе поедет гидратация. */
const GLINT_SPOTS = [
  { top: "-3px", left: "12%", w: 13, h: 5 },
  { top: "-2px", right: "9%", w: 9, h: 4 },
  { bottom: "-2px", left: "7%", w: 10, h: 4 },
  { bottom: "-3px", right: "16%", w: 12, h: 5 },
];

export default function Glass({
  as: Tag = "div", density = "base", glints = 4, tilt = false,
  className = "", style, children, ...rest
}: {
  as?: React.ElementType;
  density?: Density;
  glints?: 0 | 2 | 3 | 4;
  tilt?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  /* Бюджет backdrop-filter: за пределами вьюпорта blur снимается.
     Больше шести живых пластин в кадре — и кадры не удержать. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { el.dataset.offscreen = e.isIntersecting ? "false" : "true"; },
      { rootMargin: "220px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Наклон стекла: максимум 4°, точка вращения по курсору.
     Блики на углах при наклоне перемещаются — именно это
     выдаёт настоящее стекло, а не матовую панель. */
  useEffect(() => {
    const el = ref.current;
    if (!el || !tilt || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - 0.5;
      const py = (ev.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--tilt-x", `${(-py * 8).toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${(px * 8).toFixed(2)}deg`);
        el.style.setProperty("--glint-dx", `${(-px * 14).toFixed(1)}px`);
        el.style.setProperty("--glint-dy", `${(-py * 8).toFixed(1)}px`);
      });
    };
    const onEnter = () => { el.style.willChange = "transform"; };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--glint-dx", "0px");
      el.style.setProperty("--glint-dy", "0px");
      el.style.willChange = "";
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [tilt, reduce]);

  const densityClass =
    density === "thin" ? "glassThin" : density === "thick" ? "glassThick" : "";

  return (
    <Tag
      ref={ref}
      className={`glass ${densityClass} ${tilt ? "glassTilt" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
      {GLINT_SPOTS.slice(0, glints).map((g, i) => (
        <span
          key={i}
          className="glint"
          aria-hidden="true"
          style={{
            top: g.top, left: g.left, right: g.right, bottom: g.bottom,
            width: g.w, height: g.h,
            opacity: i % 2 ? 0.72 : 0.95,
            transform: "translate(var(--glint-dx, 0px), var(--glint-dy, 0px))",
          }}
        />
      ))}
    </Tag>
  );
}
