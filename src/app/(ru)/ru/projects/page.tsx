import type { Metadata } from "next";
import { ProjectsSection } from "@/components/Sections";
import ru from "@/i18n/ru.json";

export const metadata: Metadata = {
  title: ru.projects.kicker,
  description: ru.projects.lead,
  alternates: { canonical: "/ru/projects", languages: { ru: "/ru/projects", en: "/en/projects", "x-default": "/ru/projects" } },
};

export default function ProjectsPage() {
  return <div style={{ paddingTop: "var(--s-16)" }}><ProjectsSection all /></div>;
}
