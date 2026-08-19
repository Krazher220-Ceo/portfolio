import ru from "./ru.json";
import enRaw from "./en.json";

export type Locale = "ru" | "en";

/** RU — эталон набора ключей. */
export type Dict = typeof ru;

/**
 * Расхождение ключей ru.json / en.json роняет сборку, а не показывает
 * `undefined` посетителю: аннотация ниже — единственное, что для этого нужно.
 */
const en: Dict = enRaw;

export const dictionaries: Record<Locale, Dict> = { ru, en };

export const otherLocale = (l: Locale): Locale => (l === "ru" ? "en" : "ru");

/**
 * Оба языка живут под своим префиксом: `/ru/...` и `/en/...`.
 * Безпрефиксного корня у страниц нет — `/` только перенаправляет,
 * поэтому ни один адрес не может означать «какой-то из двух».
 */
export function localizePath(path: string, locale: Locale): string {
  const bare = path.replace(/^\/(ru|en)(?=\/|$)/, "") || "";
  return `/${locale}${bare}`;
}

/** Язык, заданный самим адресом. */
export function localeFromPath(path: string): Locale {
  return /^\/en(\/|$)/.test(path) ? "en" : "ru";
}
