/* Зеркало RU-маршрута: та же страница, состояние задаёт (en)/layout. */
import type { Metadata } from "next";
import en from "@/i18n/en.json";

export const metadata: Metadata = {
  title: en.certificates.title,
  description: en.certificates.lead,
  alternates: {
    canonical: "/en/certificates",
    languages: { ru: "/ru/certificates", en: "/en/certificates", "x-default": "/ru/certificates" },
  },
};

export { default } from "../../../(ru)/ru/certificates/page";
