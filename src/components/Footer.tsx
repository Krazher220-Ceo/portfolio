"use client";
import A from "./A";
import { useSite } from "@/lib/state";
import { CONTACT } from "@/content/site";
import s from "./footer.module.css";

const YEAR = 2026;

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

        {/* Молчание о правах читается как разрешение брать что угодно.
            Поэтому условие стоит на самом сайте, а не только
            в файле LICENSE, который открывают единицы. */}
        <div className={s.legal}>
          <span className="label">
            © {YEAR} {t.hero.first} {t.hero.last} · {t.footer.license}
          </span>
          <p className={`small dimmer ${s.legalNote}`}>
            {t.footer.licenseNote}{" "}
            <a className={s.legalLink} href={CONTACT.license} target="_blank" rel="noreferrer">
              {t.footer.licenseLink} <span aria-hidden="true">↗</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
