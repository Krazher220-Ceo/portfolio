import type { Metadata } from "next";
import FestivalView from "@/components/FestivalView";
import ru from "@/i18n/ru.json";

export const metadata: Metadata = {
  title: ru.events.title,
  description: ru.events.lead,
  alternates: {
    canonical: "/ru/events/it-fest-2025",
    languages: {
      ru: "/ru/events/it-fest-2025",
      en: "/en/events/it-fest-2025",
      "x-default": "/ru/events/it-fest-2025",
    },
  },
};

export default function FestivalPage() {
  return <FestivalView />;
}
