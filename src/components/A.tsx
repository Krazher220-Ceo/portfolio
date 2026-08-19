"use client";
import Link from "next/link";
import { useSite } from "@/lib/state";
import { localizePath } from "@/i18n/dict";

/**
 * Внутренняя ссылка. Префикс `/en` живёт ровно здесь — так адрес
 * никогда не расходится с состоянием, какой бы путь ни выбрал
 * посетитель: клик по фигуре, шапка или прямая ссылка.
 */
export default function A({
  href, children, ...rest
}: { href: string } & Omit<React.ComponentProps<typeof Link>, "href">) {
  const { locale } = useSite();
  return (
    <Link href={localizePath(href, locale)} {...rest}>
      {children}
    </Link>
  );
}
