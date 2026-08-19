/** Клиентская часть: имя файла резюме. Версия-дата в имени нужна,
 *  чтобы у скачавшего не лежала безымянная resume.pdf и чтобы
 *  старая версия не тянулась из кеша. */
export const CV_VERSION = "2026-08";
export const cvFile = (locale: "ru" | "en") =>
  `alikhan-kabdualy-cv-${locale}-${CV_VERSION}.pdf`;
