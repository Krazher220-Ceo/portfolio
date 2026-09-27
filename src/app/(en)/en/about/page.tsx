import { plainSecret } from "@/lib/secret";
/* Зеркало RU-маршрута: та же страница, состояние задаёт (en)/layout. */
import type { Metadata } from "next";
import en from "@/i18n/en.json";

export const metadata: Metadata = {
  title: en.about.title,
  description: plainSecret(en.about.short, "en"),
  alternates: {
    canonical: "/en/about",
    languages: { ru: "/ru/about", en: "/en/about", "x-default": "/ru/about" },
  },
};

export { default } from "../../../(ru)/ru/about/page";
