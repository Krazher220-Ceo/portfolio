import type { Metadata } from "next";
import OfflineView from "@/components/OfflineView";

export const metadata: Metadata = {
  title: "Нет сети",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return <OfflineView />;
}
