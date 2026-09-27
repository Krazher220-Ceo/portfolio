import { plainSecret } from "@/lib/secret";
import type { Metadata } from "next";
import AboutView from "@/components/AboutView";
import ru from "@/i18n/ru.json";

export const metadata: Metadata = {
  title: ru.about.title,
  description: plainSecret(ru.about.short, "ru"),
  alternates: { canonical: "/ru/about", languages: { ru: "/ru/about", en: "/en/about", "x-default": "/ru/about" } },
};

export default function AboutPage() {
  return <AboutView />;
}
