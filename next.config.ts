import type { NextConfig } from "next";
import { createHash } from "node:crypto";

/* Идентификатор сборки. Им версионируется кеш service worker:
   без него после деплоя у посетителей остаётся старая версия,
   и это очень трудно диагностировать. */
const BUILD_ID = createHash("sha1")
  .update(String(process.env.VERCEL_GIT_COMMIT_SHA ?? Date.now()))
  .digest("hex")
  .slice(0, 12);

/**
 * Хешированные ассеты Next отдаёт immutable сам. Здесь — то, что он
 * не знает: собственные файлы в /public. Резюме обновляется чаще, чем
 * раз в год, поэтому у него свой срок; всё остальное с контент-хешем
 * или неизменное.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  generateBuildId: async () => BUILD_ID,
  env: { NEXT_PUBLIC_BUILD_ID: BUILD_ID },
  compress: true,
  async redirects() {
    return [
      /* Безпрефиксного корня у страниц нет: каждый адрес обязан
         однозначно называть язык, иначе canonical и hreflang
         начинают спорить друг с другом. */
      { source: "/", destination: "/ru", permanent: false },
      { source: "/about", destination: "/ru/about", permanent: true },
      { source: "/certificates", destination: "/ru/certificates", permanent: true },
      { source: "/resume", destination: "/ru/resume", permanent: true },
      { source: "/events/:slug", destination: "/ru/events/:slug", permanent: true },

      /* ── Адреса прежних витрин.
         Их нельзя просто уронить в 404: на /jasyl ведут напечатанные
         QR-коды и публикация в Instagram, а поменять напечатанное
         уже нельзя. Разборы этих проектов теперь живут в портфолио,
         туда и отправляем. ─────────────────────────────────────── */
      { source: "/jasyl", destination: "/ru/projects/jasyl", permanent: true },
      { source: "/qa-dashboard", destination: "/ru/projects/qa-vision", permanent: true },
      { source: "/projects", destination: "/ru/projects", permanent: true },
      { source: "/projects/npai", destination: "/ru/projects/npai", permanent: true },
      { source: "/projects/kostanai/jasyl", destination: "/ru/projects/jasyl", permanent: true },
      { source: "/projects/kostanai/qa-vision", destination: "/ru/projects/qa-vision", permanent: true },
      { source: "/projects/kostanai/qa-dashboard", destination: "/ru/projects/qa-vision", permanent: true },
      { source: "/projects/almaty/itfest", destination: "/ru/events/it-fest-2025", permanent: true },
      {
        source: "/projects/almaty/itfest/kz-universe",
        destination: "/ru/projects/kz-universe",
        permanent: true,
      },
      /* Оставшийся хвост /projects/* — в общий список проектов,
         чтобы ни одна старая ссылка не приводила в пустоту. */
      { source: "/projects/:path*", destination: "/ru/projects", permanent: true },

      /* Поддомен витрин больше не обслуживается отдельно. */
      {
        source: "/:path*",
        has: [{ type: "host", value: "projects.alikhandev.com" }],
        destination: "https://alikhandev.com/ru/projects",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        /* Не immutable: у этих файлов нет контент-хеша в имени, и
           заменённая картинка под тем же именем осталась бы у
           посетителя старой навсегда. Хешированные ассеты Next
           отдаёт immutable сам — им это можно, этим нельзя. */
        source: "/media/:path*",
        headers: [{
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=604800",
        }],
      },
      {
        source: "/certificates/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/resume/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
