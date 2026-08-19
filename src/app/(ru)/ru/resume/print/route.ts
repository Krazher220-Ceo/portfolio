import { renderCv } from "@/lib/cv-html";

/**
 * Печатная версия резюме отдельным документом.
 *
 * PDF собирается печатью именно этой страницы, а не интерактивной:
 * так в файл не может попасть ни сцена со светом, ни прелоадер, ни
 * состояние, зависящее от рантайма. Содержание — из тех же данных,
 * что и /resume, поэтому разойтись они не могут.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(renderCv("ru"), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
