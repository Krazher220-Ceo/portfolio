/**
 * Раскрытие карточки в страницу. Обложка и заголовок переезжают
 * на новые позиции, остальное дописывается вокруг; обратный переход
 * зеркальный. Сделано на FLIP через sessionStorage, а не на
 * экспериментальных API: поведение одинаковое во всех браузерах,
 * а если что-то пошло не так — просто обычный переход без анимации.
 */
import { prefersReducedMotionNow } from "./motion-prefs";

const KEY = "ak.shared";
const TTL = 1400;

type Handoff = { id: string; rect: DOMRectInit; radius: string; at: number };

export function remember(id: string, el: HTMLElement | null) {
  if (!el || prefersReducedMotionNow()) return;
  const r = el.getBoundingClientRect();
  const data: Handoff = {
    id,
    rect: { x: r.left, y: r.top, width: r.width, height: r.height },
    radius: getComputedStyle(el).borderRadius,
    at: Date.now(),
  };
  try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch { /* приватный режим */ }
}

export function claim(id: string, el: HTMLElement | null) {
  if (!el || prefersReducedMotionNow()) return;
  let data: Handoff | null = null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) data = JSON.parse(raw) as Handoff;
    sessionStorage.removeItem(KEY);
  } catch { return; }
  if (!data || data.id !== id || Date.now() - data.at > TTL) return;

  const to = el.getBoundingClientRect();
  const from = data.rect;
  if (!from.width || !to.width) return;

  const dx = (from.x ?? 0) - to.left;
  const dy = (from.y ?? 0) - to.top;
  const sx = (from.width ?? 1) / to.width;
  const sy = (from.height ?? 1) / to.height;

  el.style.willChange = "transform";
  const anim = el.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, borderRadius: data.radius },
      { transform: "none", borderRadius: getComputedStyle(el).borderRadius },
    ],
    { duration: 520, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "none" }
  );
  Object.assign(el.style, { transformOrigin: "top left" });
  anim.finished.catch(() => {}).finally(() => { el.style.willChange = ""; });
}
