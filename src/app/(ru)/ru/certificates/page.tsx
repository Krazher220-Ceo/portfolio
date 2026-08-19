import type { Metadata } from "next";
import { CertificatesSection } from "@/components/Sections";
import ru from "@/i18n/ru.json";

export const metadata: Metadata = {
  title: ru.certificates.title,
  description: ru.certificates.lead,
  alternates: { canonical: "/ru/certificates", languages: { ru: "/ru/certificates", en: "/en/certificates", "x-default": "/ru/certificates" } },
};

export default function CertificatesPage() {
  return <div style={{ paddingTop: "var(--s-16)" }}><CertificatesSection all /></div>;
}
