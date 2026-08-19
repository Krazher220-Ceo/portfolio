/**
 * Обёртка над localStorage. В приватном режиме Safari запись бросает
 * исключение — сайт от этого падать не должен, поэтому есть фолбэк
 * в память. Всё под одним префиксом `ak.`.
 */
const PREFIX = "ak.";
const memory = new Map<string, string>();

export function read(key: string): string | null {
  try {
    const v = window.localStorage.getItem(PREFIX + key);
    if (v !== null) return v;
  } catch {
    /* приватный режим — читаем из памяти */
  }
  return memory.get(key) ?? null;
}

export function write(key: string, value: string): void {
  memory.set(key, value);
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    /* нечего делать: значение уже в памяти на эту сессию */
  }
}

export function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(PREFIX + key);
  } catch {
    return memory.get("s:" + key) ?? null;
  }
}

export function writeSession(key: string, value: string): void {
  memory.set("s:" + key, value);
  try {
    window.sessionStorage.setItem(PREFIX + key, value);
  } catch {
    /* см. выше */
  }
}
