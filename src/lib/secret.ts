/**
 * Для мест, где анимации нет и быть не может — meta description,
 * резюме, PDF: метка {secret} заменяется нейтральными словами.
 */
export const plainSecret = (str: string, locale: "ru" | "en") =>
  str.replaceAll("{secret}", locale === "ru" ? "новый проект" : "a new project");
