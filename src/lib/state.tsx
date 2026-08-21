"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { flushSync } from "react-dom";
import { dictionaries, localizePath, otherLocale, type Dict, type Locale } from "@/i18n/dict";
import * as store from "./storage";
import { measure, play } from "./flip";
import { prefersReducedMotionNow } from "./motion-prefs";

/** Фазы сцены. Кадры расписаны в §9 спеки и здесь ровно они. */
export type Phase = "idle" | "pull" | "cut" | "dark" | "ignite" | "settle";

type Ctx = {
  locale: Locale;
  t: Dict;
  phase: Phase;
  switching: boolean;
  hintSeen: boolean;
  sound: boolean;
  toggleSound: () => void;
  switchState: () => void;
  primeSound: () => void;
  /** Курсор на фигуре — от этого зажигается вся сцена, не только фото. */
  setFigureHover: (on: boolean) => void;
  figureHover: boolean;
};

const StateCtx = createContext<Ctx | null>(null);

const T = { pull: 90, cut: 110, dark: 30, ignite: 290, settle: 380 };

export function StateProvider({
  initial, children,
}: { initial: Locale; children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initial);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hintSeen, setHintSeen] = useState(true);
  const [sound, setSound] = useState(true);
  const [figureHover, setFigureHover] = useState(false);

  const token = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const soundRef = useRef(true);

  /* Состояние уже проставлено inline-скриптом в <head> до первой
     отрисовки. Здесь только синхронизируем React с реальностью. */
  useEffect(() => {
    const saved = store.read("state");
    if (saved === "ru" || saved === "en") {
      if (saved !== initial) applyDom(saved);
      setLocale(saved);
    }
    setHintSeen(store.read("hintSeen") === "1");
    const s = store.read("sound");
    const on = s !== "0";
    setSound(on);
    soundRef.current = on;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primeSound = useCallback(() => {
    if (audio.current) return;
    const a = new Audio("/media/switch.m4a");
    a.preload = "auto";
    a.volume = 0.35;
    audio.current = a;
  }, []);

  const toggleSound = useCallback(() => {
    setSound((prev) => {
      const next = !prev;
      soundRef.current = next;
      store.write("sound", next ? "1" : "0");
      return next;
    });
  }, []);

  const switchState = useCallback(() => {
    const next = otherLocale(
      (document.documentElement.dataset.state as Locale) || "ru"
    );
    const mine = ++token.current;
    const alive = () => token.current === mine;

    store.write("state", next);
    if (!store.read("hintSeen")) {
      store.write("hintSeen", "1");
      setHintSeen(true);
    }

    /* Полноценный режим для reduced-motion: кроссфейд без мигания,
       качания и подмены кадрами. Ни одна функция не теряется. */
    if (prefersReducedMotionNow()) {
      const root = document.documentElement;
      root.style.transition = "opacity 200ms linear";
      root.style.opacity = "0.35";
      window.setTimeout(() => {
        if (!alive()) return;
        const snap = measure();
        flushSync(() => setLocale(next));
        applyDom(next);
        // Компенсируем сдвиг и здесь: тёмного кадра, который мог бы
        // его спрятать, в этом режиме нет.
        play(snap, 1);
        root.style.opacity = "1";
        window.setTimeout(() => { root.style.transition = ""; }, 220);
      }, 200);
      return;
    }

    playSound(audio.current, soundRef.current);

    /* На мобильных backdrop-filter на время сцены снимается:
       иначе кадры не удержать. Возвращается после «осадки». */
    const heavy = window.matchMedia("(max-width: 768px)").matches;
    if (heavy) document.documentElement.dataset.blur = "off";

    setPhase("pull");
    window.setTimeout(() => {
      if (!alive()) return;
      setPhase("cut");

      window.setTimeout(() => {
        if (!alive()) return;
        setPhase("dark");

        /* Кадр темноты. Только здесь меняется весь текст в DOM —
           пользователь не видит подмены, поэтому не бывает
           «половина по-русски».

           FLIP применяется В ТОМ ЖЕ кадре, что и подмена. Если
           отложить его хотя бы на один кадр, браузер успевает
           отрисовать новую раскладку без компенсации — и это
           настоящий сдвиг вёрстки: CLS на переключении языка
           доходил до 0.66 при норме 0.02. Темнота его прятала
           от глаза, но не от метрики.

           View Transitions отсюда убран намеренно: он переносит
           подмену в собственный асинхронный колбэк, из-за чего
           момент отрисовки перестаёт быть предсказуемым, а свой
           кроссфейд у него всё равно отключён — кадром управляет
           сцена. */
        const snap = measure();
        flushSync(() => setLocale(next));
        applyDom(next);
        play(snap, T.settle);

        window.setTimeout(() => {
          if (!alive()) return;
          setPhase("ignite");

          window.setTimeout(() => {
            if (!alive()) return;
            setPhase("settle");
            window.setTimeout(() => {
              if (!alive()) return;
              setPhase("idle");
              delete document.documentElement.dataset.blur;
            }, T.settle);
          }, T.ignite);
        }, T.dark);
      }, T.cut);
    }, T.pull);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale, t: dictionaries[locale], phase,
      switching: phase !== "idle",
      hintSeen, sound, toggleSound, switchState, primeSound,
      figureHover, setFigureHover,
    }),
    [locale, phase, hintSeen, sound, toggleSound, switchState, primeSound, figureHover]
  );

  return <StateCtx.Provider value={value}>{children}</StateCtx.Provider>;
}

/** Всё, что живёт вне React-дерева: атрибуты корня и адрес. */
function applyDom(next: Locale) {
  const root = document.documentElement;
  root.dataset.state = next;
  root.lang = next;
  const url = localizePath(window.location.pathname, next) + window.location.search + window.location.hash;
  window.history.replaceState(window.history.state, "", url);
}

function playSound(a: HTMLAudioElement | null, on: boolean) {
  if (!a || !on) return;
  try {
    a.currentTime = 0;
    // Autoplay-политика: до первого жеста звука не будет, и это нормально.
    void a.play().catch(() => {});
  } catch { /* не мешаем сцене */ }
}

export function useSite(): Ctx {
  const c = useContext(StateCtx);
  if (!c) throw new Error("useSite вне StateProvider");
  return c;
}
