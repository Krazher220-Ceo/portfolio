import type { Metadata, Viewport } from "next";
import "../globals.css";
import en from "@/i18n/en.json";
import { CONTACT } from "@/content/site";
import RootHtml from "@/components/RootHtml";

export const metadata: Metadata = {
  metadataBase: new URL(CONTACT.domain),
  title: { default: en.meta.title, template: "%s — Alikhan Kabdualy" },
  description: en.meta.description,
  alternates: { canonical: "/en", languages: { ru: "/ru", en: "/en", "x-default": "/ru" } },
  openGraph: {
    type: "website", siteName: en.meta.title, title: en.meta.title,
    description: en.meta.description, url: "/en", locale: "en_US",
    alternateLocale: "ru_RU",
    images: [{ url: "/media/og-en.png", width: 1200, height: 630, alt: en.meta.ogAlt }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#050505", colorScheme: "dark" };

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml locale="en">{children}</RootHtml>;
}
