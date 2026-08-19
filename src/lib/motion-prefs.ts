"use client";
import { useEffect, useState } from "react";

function query(q: string) {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(q).matches;
}

export function useMediaFlag(q: string): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const h = () => setOn(mq.matches);
    h();
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [q]);
  return on;
}

export const useReducedMotion = () =>
  useMediaFlag("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaFlag("(pointer: fine)");
export const useDesktop = () => useMediaFlag("(min-width: 900px)");

export const prefersReducedMotionNow = () =>
  query("(prefers-reduced-motion: reduce)");
