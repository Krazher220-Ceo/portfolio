import Hero from "@/components/Hero";
import {
  AboutShort, ProjectsSection, TimelineSection, StackSection,
  CertificatesSection, ContactsSection,
} from "@/components/Sections";
import { cvSize } from "@/lib/cv.server";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutShort />
      <ProjectsSection />
      <TimelineSection />
      <StackSection />
      <CertificatesSection />
      <ContactsSection cvSize={cvSize("ru")} />
    </>
  );
}
