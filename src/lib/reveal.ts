/**
 * Общий реестр ещё не показанных блоков.
 *
 * IntersectionObserver сюда не годится: он сообщает только о смене
 * состояния, и элемент, мимо которого проскочили одним прыжком
 * (быстрый скролл, переход по якорю, восстановление позиции), так и
 * остаётся невидимым. Поэтому — один общий проход по списку на скролл.
 * Показанный элемент из списка выбывает и больше не проверяется,
 * так что список сам сходит к нулю, а слушатель снимается.
 */
type Entry = { el: HTMLElement; show: () => void };

const pending = new Set<Entry>();
let raf = 0;
let attached = false;

function sweep() {
  raf = 0;
  const limit = window.innerHeight * 0.85;
  for (const e of pending) {
    if (!e.el.isConnected) { pending.delete(e); continue; }
    const r = e.el.getBoundingClientRect();
    // Виден или уже выше кадра — в обоих случаях он обязан быть на месте.
    if (r.top < limit) { e.show(); pending.delete(e); }
  }
  if (!pending.size) detach();
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(sweep);
}

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function detach() {
  if (!attached) return;
  attached = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

export function register(el: HTMLElement, show: () => void): () => void {
  const entry: Entry = { el, show };
  pending.add(entry);
  attach();
  schedule();
  return () => { pending.delete(entry); if (!pending.size) detach(); };
}
