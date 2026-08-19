"use client";

import { usePathname } from "next/navigation";
import { StateProvider, useSite } from "@/lib/state";
import type { Locale } from "@/i18n/dict";
import { LightboxProvider } from "./Lightbox";
import Header from "./Header";
import Footer from "./Footer";
import Scene from "./Scene";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import Progress from "./Progress";
import SmoothScroll from "./SmoothScroll";
import ServiceWorker from "./ServiceWorker";
import SceneLight from "./SceneLight";
import s from "./shell.module.css";

export default function Shell({
  locale, children,
}: { locale: Locale; children: React.ReactNode }) {
  return (
    <StateProvider initial={locale}>
      <LightboxProvider>
        <Inner>{children}</Inner>
      </LightboxProvider>
    </StateProvider>
  );
}

function Inner({ children }: { children: React.ReactNode }) {
  const { phase, t } = useSite();
  const path = usePathname() ?? "/";
  const print = /^\/(ru|en)\/resume$/.test(path);

  return (
    <div className={s.root} data-phase={phase} id="top">
      <a className="skipLink" href="#content">{t.nav.skip}</a>
      {!print && <Scene />}
      <Progress />
      <Header />
      <main id="content" className={s.main}>{children}</main>
      <Footer />
      <span className="pageGrain" aria-hidden="true" />
      <Cursor />
      <Preloader />
      <SmoothScroll />
      <ServiceWorker />
      <SceneLight />
      <LensFilter />
    </div>
  );
}

/** Карта смещения для линзы: искажение 3–6px по кромке, не больше. */
function LensFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <filter id="lens-warp" colorInterpolationFilters="sRGB">
        <feImage
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='60'%3E%3CradialGradient id='g' cx='50%25' cy='50%25'%3E%3Cstop offset='55%25' stop-color='%23808080'/%3E%3Cstop offset='100%25' stop-color='%23b0d0a0'/%3E%3C/radialGradient%3E%3Crect width='120' height='60' rx='30' fill='url(%23g)'/%3E%3C/svg%3E"
          result="map"
          preserveAspectRatio="none"
          x="0" y="0" width="100%" height="100%"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="map"
          scale="5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
