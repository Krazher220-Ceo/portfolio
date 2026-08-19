"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import A from "./A";
import { useSite } from "@/lib/state";
import { otherLocale } from "@/i18n/dict";
import { CONTACT } from "@/content/site";
import s from "./header.module.css";

const LINKS = [
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/certificates", key: "certificates" },
  { href: "/resume", key: "resume" },
] as const;

export default function Header() {
  const { t, locale, switchState, sound, toggleSound, primeSound } = useSite();
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  const bare = path.replace(/^\/(ru|en)(?=\/|$)/, "") || "/";

  /* Активный индикатор навигации — одна из трёх линз на весь сайт.
     Едет к активному пункту, а не перерисовывается на месте. */
  useEffect(() => {
    const wrap = nav.current, ind = indicator.current;
    if (!wrap || !ind) return;
    const active = wrap.querySelector<HTMLElement>("[data-active='true']");
    if (!active) { ind.style.opacity = "0"; return; }
    const r = active.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    ind.style.opacity = "1";
    ind.style.width = `${r.width}px`;
    ind.style.transform = `translateX(${r.left - w.left}px)`;
  }, [bare, locale, open]);

  useEffect(() => { setOpen(false); }, [path]);

  /* Пока лист открыт, страница под ним не прокручивается,
     а Esc закрывает — иначе на телефоне из меню не выйти. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={s.header}>
      <div className={`glass glassThin ${s.bar}`}>
        <A href="/" className={s.brand} aria-label={t.nav.home}>
          <span className={s.mark} aria-hidden="true" />
          <span className="label">{t.hero.first}&nbsp;{t.hero.last}</span>
        </A>

        <nav ref={nav} className={s.nav} aria-label={t.nav.menu}>
          <span ref={indicator} className={`lens ${s.indicator}`} aria-hidden="true" />
          {LINKS.map((l) => (
            <A
              key={l.href}
              href={l.href}
              className={s.link}
              data-active={bare === l.href || bare.startsWith(l.href + "/")}
            >
              {t.nav[l.key]}
            </A>
          ))}
        </nav>

        <div className={s.tools}>
          <button
            className={`label ${s.lang}`}
            onClick={switchState}
            onPointerEnter={primeSound}
            aria-label={t.state.toFigure}
          >
            <span data-on={locale === "ru"}>RU</span>
            <span aria-hidden="true" className={s.slash}>/</span>
            <span data-on={locale === "en"}>EN</span>
          </button>

          <button
            className={s.sound}
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={`${t.a11y.sound}: ${sound ? t.state.soundOn : t.state.soundOff}`}
            title={sound ? t.state.soundOn : t.state.soundOff}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
              <path d="M3 5.5h2.2L8.4 3v9L5.2 9.5H3z" fill="currentColor" />
              {sound ? (
                <>
                  <path d="M10.4 5.4a3 3 0 0 1 0 4.2" stroke="currentColor" fill="none" strokeWidth="1.1" strokeLinecap="round" />
                  <path d="M12 3.9a5.2 5.2 0 0 1 0 7.2" stroke="currentColor" fill="none" strokeWidth="1.1" strokeLinecap="round" />
                </>
              ) : (
                <path d="M10.6 5.6l3.2 3.8M13.8 5.6l-3.2 3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
              )}
            </svg>
          </button>

          <button
            className={s.burger}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
          >
            <span className={s.burgerBar} />
            <span className={s.burgerBar} />
            <span className={s.burgerBar} />
          </button>
        </div>
      </div>

      {/* Отдельный слой поверх сцены: список, втиснутый в шапку,
          на телефоне читается как сломавшаяся вёрстка. */}
      <nav
        id="mobile-menu"
        className={`${s.sheet} ${open ? s.sheetOpen : ""}`}
        aria-label={t.nav.menu}
        hidden={!open}
      >
        {LINKS.map((l) => (
          <A
            key={l.href}
            href={l.href}
            className={s.sheetLink}
            data-active={bare === l.href || bare.startsWith(l.href + "/")}
            onClick={() => setOpen(false)}
          >
            {t.nav[l.key]}
          </A>
        ))}
        <div className={s.sheetFoot}>
          <span className={s.sheetRule} />
          <a className={`mono ${s.sheetMail}`} href={`mailto:${CONTACT.email}`} data-selectable>
            {CONTACT.email}
          </a>
          <a className="mono dimmer" href={CONTACT.github} target="_blank" rel="noreferrer">
            {CONTACT.githubLabel}
          </a>
        </div>
      </nav>
    </header>
  );
}

export { otherLocale };
