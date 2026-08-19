import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectView from "@/components/ProjectView";
import { projects, bySlug } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.tagline.ru,
    alternates: {
      canonical: `/ru/projects/${slug}`,
      languages: {
        ru: `/ru/projects/${slug}`,
        en: `/en/projects/${slug}`,
        "x-default": `/ru/projects/${slug}`,
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!bySlug(slug)) notFound();
  return <ProjectView slug={slug} />;
}
