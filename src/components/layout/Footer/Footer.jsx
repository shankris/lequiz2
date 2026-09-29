/* src/components/layout/Footer/Footer.jsx */

"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import styles from "./Footer.module.css";

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");

  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>{t("copyright", { year })}</p>

        <nav aria-label={t("navigation")}>
          <ul className={styles.links}>
            <li>
              <Link href={`/${locale}/about`}>{t("about")}</Link>
            </li>

            <li>
              <Link href={`/${locale}/privacy`}>{t("privacy")}</Link>
            </li>

            <li>
              <Link href={`/${locale}/terms`}>{t("terms")}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
