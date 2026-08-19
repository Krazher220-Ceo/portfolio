"use client";
import A from "./A";
import { useSite } from "@/lib/state";
import { CONTACT } from "@/content/site";
import s from "./footer.module.css";

export default function Footer() {
  const { t } = useSite();
  return (
    <footer className={s.footer}>
      <div className="container">
        {/* Второе и последнее место, где используется hero-уровень. */}
        <p className={`hero ${s.name}`} data-flip>
          {t.hero.first} <span className={s.last}>{t.hero.last}</span>
        </p>

        <div className={s.grid}>
          <div className={s.col}>
            <span className="label">{t.contacts.kicker}</span>
            <a className={s.big} href={`mailto:${CONTACT.email}`} data-selectable>
              <span className="mono">{CONTACT.email}</span>
            </a>
            <a className={s.item} href={CONTACT.github} target="_blank" rel="noreferrer" data-selectable>
              <span className="mono">{CONTACT.githubLabel}</span>
            </a>
          </div>

          <div className={s.col}>
            <span className="label">{t.nav.menu}</span>
            <A className={s.item} href="/projects">{t.nav.projects}</A>
            <A className={s.item} href="/about">{t.nav.about}</A>
            <A className={s.item} href="/certificates">{t.nav.certificates}</A>
            <A className={s.item} href="/resume">{t.nav.resume}</A>
          </div>

          <div className={s.col}>
            <span className="label">{t.footer.rights}</span>
            <p className={`small dimmer ${s.note}`}>{t.footer.built}</p>
            <a className={`label ${s.top}`} href="#top">{t.footer.top}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
