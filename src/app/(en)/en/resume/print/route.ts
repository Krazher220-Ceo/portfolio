import { renderCv } from "@/lib/cv-html";

export const dynamic = "force-static";

export function GET() {
  return new Response(renderCv("en"), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
