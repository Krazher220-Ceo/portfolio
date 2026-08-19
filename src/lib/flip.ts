/**
 * FLIP-осадка. Блоки меняют размер из-за разной длины строк RU/EN —
 * без этого при смене языка страница дёргается.
 * Анимируются только transform и opacity.
 */
type Snap = Map<Element, DOMRect>;

export function measure(): Snap {
  const snap: Snap = new Map();
  document.querySelectorAll("[data-flip]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width || r.height) snap.set(el, r);
  });
  return snap;
}

export function play(snap: Snap, duration = 380): void {
  const easing = "cubic-bezier(.22, 1, .36, 1)";
  snap.forEach((first, el) => {
    if (!el.isConnected) return;
    const last = el.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const sy = last.height > 1 ? first.height / last.height : 1;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sy - 1) < 0.01) return;
    const node = el as HTMLElement;
    node.style.willChange = "transform";
    const anim = node.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scaleY(${sy})`, transformOrigin: "top left" },
        { transform: "none", transformOrigin: "top left" },
      ],
      { duration, easing, fill: "none" }
    );
    anim.finished.catch(() => {}).finally(() => {
      node.style.willChange = "";
    });
  });
}
