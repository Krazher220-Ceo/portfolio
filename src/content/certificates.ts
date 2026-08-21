import type { Bi } from "./projects";

/**
 * Реестр сертификатов. ЕДИНСТВЕННОЕ место, которое правится
 * при добавлении файла. Вёрстку трогать не нужно —
 * инструкция лежит в /public/certificates/README.md.
 */

export type CertStatus = "published" | "pending" | "festival-only";

export type Certificate = {
  /** = префикс имени файла */
  id: string;
  /** к какому проекту относится; null — общий */
  projectId: string | null;
  event: string;
  /** YYYY-MM */
  date: string;
  file: string | null;
  preview: string | null;
  /** Реальные пропорции превью: сертификат показывается целиком. */
  previewW: number;
  previewH: number;
  status: CertStatus;
  alt: Bi;
  note: Bi;
  /** для festival-only: куда вести за общим сертификатом */
  refersTo?: string;
};

export const certificates: Certificate[] = [
  {
    id: "01",
    projectId: "qa-vision",
    event: "Qostanai AI-Sana Industry Hackathon: Allur Challenge",
    date: "2025-11",
    file: "01-qa-vision-allur-2025.jpg",
    preview: "01-qa-vision-allur-2025-preview.webp",
    previewW: 900,
    previewH: 634,
    status: "published",
    alt: {
      ru: "Сертификат участника Qostanai AI-Sana Industry Hackathon, кейс Allur, ноябрь 2025",
      en: "Certificate of participation, Qostanai AI-Sana Industry Hackathon, Allur case, November 2025",
    },
    note: {
      ru: "Подписи: президент КИнЭУ им. М. Дулатова, региональный директор офиса МСЭ для СНГ, руководитель Корпоративного университета Allur, директор Qostanai Hub.",
      en: "Signed by the president of Dulatov University, the ITU regional director for the CIS, the head of Allur's corporate university and the director of Qostanai Hub.",
    },
  },
  {
    id: "02",
    projectId: null,
    event: "IT Fest 2025",
    date: "2025-12",
    file: "02-itfest-2025.jpg",
    preview: "02-itfest-2025-preview.webp",
    previewW: 900,
    previewH: 636,
    status: "published",
    alt: {
      ru: "Сертификат участника фестиваля IT Fest 2025, Алматы, декабрь 2025",
      en: "Certificate of participation, IT Fest 2025, Almaty, December 2025",
    },
    note: {
      ru: "Один общий сертификат на оба трека фестиваля. Председатель организационного комитета — Дузбаев Н. Т.",
      en: "One shared certificate for both festival tracks. Chair of the organising committee: N. T. Duzbayev.",
    },
  },
  {
    id: "03",
    projectId: "jasyl",
    event: "Qostanai Smart City Hackathon",
    date: "2026-08",
    file: "03-jasyl-qostanai-2026.jpg",
    preview: "03-jasyl-qostanai-2026-preview.webp",
    previewW: 900,
    previewH: 637,
    status: "published",
    alt: {
      ru: "Сертификат участия команды Jasyl в Qostanai Smart City Hackathon, Костанай, 2026",
      en: "Certificate of participation of team Jasyl in the Qostanai Smart City Hackathon, Kostanay, 2026",
    },
    note: {
      ru: "Выдан команде, а не лично: на бланке стоит название команды — Jasyl. Подписи: региональный директор офиса МСЭ для СНГ и директор костанайского филиала фонда «Astana Hub».",
      en: "Issued to the team, not to a person: the certificate carries the team name, Jasyl. Signed by the ITU regional director for the CIS and the director of the Kostanay branch of the Astana Hub foundation.",
    },
  },
];

/** Треки фестиваля своего сертификата не имеют — они ссылаются на слот 02. */
export const festivalOnly: { projectId: string; certId: string }[] = [
  { projectId: "kz-universe", certId: "02" },
  { projectId: "npai", certId: "02" },
];

export const certById = (id: string) => certificates.find((c) => c.id === id);
export const certForProject = (projectId: string) => {
  const own = certificates.find(
    (c) => c.projectId === projectId && c.status !== "pending"
  );
  if (own) return { cert: own, festivalOnly: false as const };
  const pending = certificates.find((c) => c.projectId === projectId);
  if (pending) return { cert: pending, festivalOnly: false as const };
  const fo = festivalOnly.find((f) => f.projectId === projectId);
  if (fo) {
    const cert = certById(fo.certId);
    if (cert) return { cert, festivalOnly: true as const };
  }
  return null;
};
