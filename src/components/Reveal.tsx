"use client";
import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { register } from "@/lib/reveal";

/**
 * Появление секции. Один раз и никогда повторно: повторные
 * раскрытия при прокрутке туда-обратно — главный источник
 * ощущения дешевизны. Проскроллил быстро — элемент уже на месте.
 */
export default function Reveal({
  as: Tag = "div", delay = 0, className = "", children, ...rest
}: { as?: ElementType; delay?: number; className?: string; children: ReactNode } &
  React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.willChange = "opacity, transform";
    return register(el, () => {
      el.dataset.shown = "true";
      window.setTimeout(() => { el.style.willChange = ""; }, 600);
    });
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
