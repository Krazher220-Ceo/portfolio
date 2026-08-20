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
    images: [{ url: "/media/og-ru.jpg", width: 1200, height: 630, alt: ru.meta.ogAlt }],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#05070c", colorScheme: "dark" };

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="ru">{children}</RootHtml>;
}
