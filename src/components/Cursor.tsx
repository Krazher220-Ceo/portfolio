"use client";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/lib/state";
import s from "./cursor.module.css";

type Mode = "default" | "link" | "photo" | "image" | "drag";

/** Только десктоп, только pointer: fine. При reduced-motion —
 *  системный курсор, эта штука не рисуется вовсе. */
export default function Cursor() {
  const { t } = useSite();
  const [mode, setMode] = useState<Mode>("default");
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.dataset.cursor !== "on") return;
    const d = dot.current, r = ring.current;
    if (!d || !r) return;

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0, visible = false;

    const move = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) { visible = true; d.style.opacity = "1"; r.style.opacity = "1"; }
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = (el?.dataset.cursor as Mode) ??
        ((e.target as HTMLElement)?.closest?.("a,button") ? "link" : "default");
      setMode((prev) => (prev === next ? prev : next));
    };
    const leave = () => { visible = false; d.style.opacity = "0"; r.style.opacity = "0"; };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  const caption =
    mode === "photo" ? t.state.cursorLabel :
    mode === "image" ? t.certificates.open : "";

  return (
    <>
      <div ref={dot} className={s.dot} data-mode={mode} aria-hidden="true" data-print-hide />
      <div ref={ring} className={s.ring} data-mode={mode} aria-hidden="true">
        {caption && <span className={s.cap}>{caption}</span>}
        {mode === "photo" && <span className={s.cord} />}
        {mode === "drag" && <span className={s.arrows} />}
      </div>
    </>
  );
}
