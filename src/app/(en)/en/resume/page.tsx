/* Зеркало RU-маршрута: та же страница, состояние задаёт (en)/layout. */
import type { Metadata } from "next";
import en from "@/i18n/en.json";

export const metadata: Metadata = {
  title: en.resume.title,
  description: en.resume.lead,
  alternates: {
    canonical: "/en/resume",
    languages: { ru: "/ru/resume", en: "/en/resume", "x-default": "/ru/resume" },
  },
};

export { default } from "../../../(ru)/ru/resume/page";
