import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cvFile } from "./cv";

/**
 * Вес файла рядом с подписью кнопки. Читается на сборке —
 * в рантайме никаких запросов, и цифра не может разойтись с файлом.
 */
export function cvSize(locale: "ru" | "en"): string {
  try {
    const p = path.join(process.cwd(), "public", "resume", cvFile(locale));
    return `${Math.round(fs.statSync(p).size / 1024)} KB`;
  } catch {
    return "—";
  }
}
