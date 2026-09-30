/* src/components/layout/Header/Header.jsx */

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./Header.module.css";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";
import NotificationBell from "./Notification/NotificationBell";
import Navigation from "../Navigation/Navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <Image
            src='/flags/Fr_flag_logo.svg'
            alt=''
            width={45}
            height={28}
            className={styles.logoImage}
          />

          <span>LeQuiz</span>
        </div>

        <Navigation variant='desktop' />

        <div className={styles.rightIcons}>
          <ThemeToggle />

          <LanguageSwitcher />

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
