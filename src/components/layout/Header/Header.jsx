/* src/components/layout/Header/Header.jsx */

"use client";

import { useRouter } from "next/navigation";

import styles from "./Header.module.css";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./Notification/NotificationBell";
import Navigation from "../Navigation/Navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>Le Quiz</div>

        <Navigation variant='desktop' />

        <div className={styles.rightIcons}>
          <ThemeToggle />

          <NotificationBell
            onItemClick={(item) => console.log("Clicked", item)}
            onViewAll={() => router.push("/notifications")}
          />
        </div>
      </div>

      <Navigation variant='mobile' />
    </header>
  );
}
