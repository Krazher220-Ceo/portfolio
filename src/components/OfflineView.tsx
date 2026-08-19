"use client";
import Glass from "./Glass";
import A from "./A";
import { useSite } from "@/lib/state";

/** Оффлайн-страница на том же стекле: сцена не должна разваливаться
 *  только потому, что пропала сеть. */
export default function OfflineView() {
  const { locale } = useSite();
  const t = locale === "ru"
    ? { k: "Нет сети", h: "Страница недоступна офлайн",
        p: "Соединение пропало, а этой страницы нет в кеше. Уже открытые разделы продолжают работать.",
        b: "На главную" }
    : { k: "Offline", h: "This page isn’t available offline",
        p: "The connection dropped and this page isn’t in the cache. Sections you already opened still work.",
        b: "Go home" };
  return (
    <section className="section container" style={{ minHeight: "70vh", display: "grid", placeContent: "center" }}>
      <Glass style={{ padding: "var(--s-12)", display: "grid", gap: "var(--s-4)", justifyItems: "start" }}>
        <span className="label">{t.k}</span>
        <h1 className="displayL">{t.h}</h1>
        <p className="bodyL dim">{t.p}</p>
        <A href="/" className="label" style={{ color: "var(--ink)" }}>
          {t.b} <span aria-hidden="true">→</span>
        </A>
      </Glass>
    </section>
  );
}
