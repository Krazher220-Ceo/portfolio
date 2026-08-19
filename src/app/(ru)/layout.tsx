import type { Metadata, Viewport } from "next";
import "../globals.css";
import ru from "@/i18n/ru.json";
import { CONTACT } from "@/content/site";
import RootHtml from "@/components/RootHtml";

export const metadata: Metadata = {
  metadataBase: new URL(CONTACT.domain),
  title: { default: ru.meta.title, template: "%s — Алихан Кабдуалы" },
  description: ru.meta.description,
  alternates: { canonical: "/ru", languages: { ru: "/ru", en: "/en", "x-default": "/ru" } },
  openGraph: {
    type: "website", siteName: ru.meta.title, title: ru.meta.title,
    description: ru.meta.description, url: "/ru", locale: "ru_RU",
    alternateLocale: "en_US",
    images: [{ url: "/media/og-ru.png", width: 1200, height: 630, alt: ru.meta.ogAlt }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#05070c", colorScheme: "dark" };

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="ru">{children}</RootHtml>;
}
