/* Зеркало RU-маршрута: та же страница, состояние задаёт (en)/layout. */
import type { Metadata } from "next";
import en from "@/i18n/en.json";

export const metadata: Metadata = {
  title: en.events.title,
  description: en.events.lead,
  alternates: {
    canonical: "/en/events/it-fest-2025",
    languages: { ru: "/ru/events/it-fest-2025", en: "/en/events/it-fest-2025", "x-default": "/ru/events/it-fest-2025" },
  },
};

export { default } from "../../../../(ru)/ru/events/it-fest-2025/page";
