import type { Metadata } from "next";
import AboutView from "@/components/AboutView";
import ru from "@/i18n/ru.json";

export const metadata: Metadata = {
  title: ru.about.title,
  description: ru.about.short,
  alternates: { canonical: "/ru/about", languages: { ru: "/ru/about", en: "/en/about", "x-default": "/ru/about" } },
};

export default function AboutPage() {
  return <AboutView />;
}
