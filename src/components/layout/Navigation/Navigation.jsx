/* src/components/layout/Navigation/Navigation.jsx */

"use client";

import { ChartNoAxesColumn, BookOpen, House, SquareCheckBig } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";

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
  const pathname = usePathname();

  return (
    <nav
      className={`${styles.navigation} ${variant === "mobile" ? styles.mobileNavigation : styles.desktopNavigation}`}
      aria-label={variant === "mobile" ? "Mobile navigation" : "Main navigation"}
    >
      {navigation.map((item) => {
        const Icon = icons[item.icon];

        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
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
