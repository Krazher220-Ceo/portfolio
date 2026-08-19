/**
 * Минимальный service worker.
 *
 * Кеш версионируется хешем сборки (?v= в адресе воркера). Старые кеши
 * удаляются в activate — иначе после деплоя у посетителей останется
 * старая версия сайта, и это очень трудно диагностировать.
 */
const VERSION = new URL(self.location).searchParams.get("v") || "dev";
const SHELL = `ak-shell-${VERSION}`;
const RUNTIME = `ak-runtime-${VERSION}`;
const OFFLINE = "/offline";

const PRECACHE = [
  OFFLINE,
  "/media/texture-ru.webp",
  "/media/texture-en.webp",
  "/media/switch.m4a",
  "/media/figure-620.webp",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

const isImage = (r) =>
  r.destination === "image" || r.destination === "font" || r.destination === "audio";

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // HTML — network-first: страница обязана быть свежей.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match(OFFLINE)))
    );
    return;
  }

  // Картинки, шрифты, звук — stale-while-revalidate.
  if (isImage(req)) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const net = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME).then((c) => c.put(req, copy));
            return res;
          })
          .catch(() => cached);
        return cached || net;
      })
    );
  }
});
