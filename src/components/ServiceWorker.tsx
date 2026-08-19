"use client";
import { useEffect } from "react";

/**
 * Регистрация с хешем сборки в адресе: браузер видит новый URL
 * воркера, ставит новую версию и в activate удаляет старые кеши.
 * Без этого после деплоя у посетителей остаётся старая версия сайта.
 */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const v = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";
    const id = window.setTimeout(() => {
      navigator.serviceWorker.register(`/sw.js?v=${v}`).catch(() => {});
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
