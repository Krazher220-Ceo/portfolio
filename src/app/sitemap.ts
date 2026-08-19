import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { CONTACT } from "@/content/site";

const paths = [
  "/", "/about", "/projects", "/certificates", "/resume",
  "/events/it-fest-2025",
  ...projects.map((p) => `/projects/${p.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = CONTACT.domain;
  // Оба языка под префиксом; безпрефиксного корня в карте нет —
  // `/` только перенаправляет и индексировать его нечего.
  return paths.flatMap((p) => {
    const bare = p === "/" ? "" : p;
    const ru = `${base}/ru${bare}`;
    const en = `${base}/en${bare}`;
    const languages = { ru, en, "x-default": ru };
    return (["ru", "en"] as const).map((l) => ({
      url: l === "ru" ? ru : en,
      lastModified: new Date("2026-08-20"),
      changeFrequency: "monthly" as const,
      priority: p === "/" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
