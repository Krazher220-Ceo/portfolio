/* Зеркало RU-маршрута: та же страница, состояние задаёт (en)/layout. */
import type { Metadata } from "next";
import { bySlug } from "@/content/projects";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.tagline.en,
    alternates: {
      canonical: `/en/projects/${slug}`,
      languages: {
        ru: `/ru/projects/${slug}`,
        en: `/en/projects/${slug}`,
        "x-default": `/ru/projects/${slug}`,
      },
    },
  };
}

export { default, generateStaticParams } from "../../../../(ru)/ru/projects/[slug]/page";
