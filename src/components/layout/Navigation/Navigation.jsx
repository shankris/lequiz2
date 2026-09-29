/* src/components/layout/Navigation/Navigation.jsx */

"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { House, BookOpen, Pencil, ChartNoAxesColumn } from "lucide-react";

import navigation from "./navigation.json";
import styles from "./Navigation.module.css";

// --------------------------------------------------
// Lucide icon mapping
// --------------------------------------------------

const icons = {
  House,
  BookOpen,
  Pencil,
  ChartNoAxesColumn,
};

// --------------------------------------------------
// Navigation
// --------------------------------------------------

export default function Navigation({ variant = "desktop" }) {
  const locale = useLocale();
  const t = useTranslations("navigation");

  return (
    <nav
      className={`${styles.navigation} ${variant === "mobile" ? styles.mobileNavigation : styles.desktopNavigation}`}
      aria-label={variant === "mobile" ? "Mobile navigation" : "Main navigation"}
    >
      {navigation.map((item) => {
        const Icon = icons[item.icon];
        const translationKey = item.label.toLowerCase();
        const href = `/${locale}${item.href === "/" ? "" : item.href}`;

        return (
          <Link
            key={item.href}
            href={href}
            className={styles.navItem}
          >
            <Icon
              className={styles.icon}
              size={20}
              strokeWidth={1.8}
              aria-hidden='true'
            />

            <span className={styles.label}>{t(translationKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
