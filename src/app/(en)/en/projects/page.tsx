/* Зеркало RU-маршрута: та же страница, состояние задаёт (en)/layout. */
import type { Metadata } from "next";
import en from "@/i18n/en.json";

export const metadata: Metadata = {
  title: en.projects.kicker,
  description: en.projects.lead,
  alternates: {
    canonical: "/en/projects",
    languages: { ru: "/ru/projects", en: "/en/projects", "x-default": "/ru/projects" },
  },
};

export { default } from "../../../(ru)/ru/projects/page";
