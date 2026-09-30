/* src/components/layout/Navigation/Navigation.jsx */

"use client";

import { Link } from "@/i18n/navigation";
import { House, BookOpen, SquareCheckBig, ChartNoAxesColumn } from "lucide-react";
import { useTranslations } from "next-intl";

import navigation from "./navigation.json";
import styles from "./Navigation.module.css";

// --------------------------------------------------
// Lucide icon mapping
// --------------------------------------------------

const icons = {
  House,
  BookOpen,
  SquareCheckBig,
  ChartNoAxesColumn,
};

// --------------------------------------------------
// Navigation
// --------------------------------------------------

export default function Navigation({ variant = "desktop" }) {
  const t = useTranslations("navigation");

  return (
    <nav
      className={`${styles.navigation} ${variant === "mobile" ? styles.mobileNavigation : styles.desktopNavigation}`}
      aria-label={variant === "mobile" ? "Mobile navigation" : "Main navigation"}
    >
      {navigation.map((item) => {
        const Icon = icons[item.icon];

        return (
          <Link
            key={item.href}
            href={item.href}
            className={styles.navItem}
          >
            <Icon
              className={styles.icon}
              size={20}
              strokeWidth={1.8}
              aria-hidden='true'
            />

            <span className={styles.label}>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
