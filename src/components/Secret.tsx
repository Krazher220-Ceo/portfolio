"use client";
import { Fragment, useEffect, useState } from "react";
import { useSite } from "@/lib/state";
import { useReducedMotion } from "@/lib/motion-prefs";
import s from "./secret.module.css";

/**
 * Название проекта, который ещё в разработке. Настоящего имени здесь
 * нет вообще — ни в разметке, ни в бандле: показываются случайные
 * символы под размытием, которые двоятся и мерцают. Скрыть имя
 * CSS-фильтром поверх настоящего текста — значит оставить его
 * в исходнике страницы.
 */
const GLYPHS = "ABCDEFGHKMNPRSTVXZ#%&*/<>=+";
const LEN = 11;
/* Первый кадр одинаковый на сервере и клиенте — иначе гидратация
   ругается на расхождение текста. */
const STATIC = "#X%K*R/N&Z=";

const scramble = () =>
  Array.from({ length: LEN }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("");

export default function Secret() {
  const { locale } = useSite();
  const reduce = useReducedMotion();
  const [text, setText] = useState(STATIC);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setText(scramble()), 140);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <span
      className={s.secret}
      role="img"
      aria-label={locale === "ru" ? "название скрыто — проект в разработке" : "name withheld — project in development"}
      title={locale === "ru" ? "Пока секрет" : "Still under wraps"}
    >
      <span className={s.ghost} aria-hidden="true">{text}</span>
      <span className={s.ghost} aria-hidden="true">{text}</span>
      <span className={s.core} aria-hidden="true">{text}</span>
    </span>
  );
}

/** Подставляет <Secret/> на место метки {secret} в строке из словаря. */
export function withSecret(str: string) {
  const parts = str.split("{secret}");
  if (parts.length === 1) return str;
  return parts.map((p, i) => (
    <Fragment key={i}>
      {p}
      {i < parts.length - 1 && <Secret />}
    </Fragment>
  ));
}
