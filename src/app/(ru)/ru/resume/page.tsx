import type { Metadata } from "next";
import ResumeView from "@/components/ResumeView";
import ru from "@/i18n/ru.json";
import { cvSize } from "@/lib/cv.server";

export const metadata: Metadata = {
  title: ru.resume.title,
  description: ru.resume.lead,
  alternates: { canonical: "/ru/resume", languages: { ru: "/ru/resume", en: "/en/resume", "x-default": "/ru/resume" } },
};

export default function ResumePage() {
  return <ResumeView sizes={{ ru: cvSize("ru"), en: cvSize("en") }} />;
}
