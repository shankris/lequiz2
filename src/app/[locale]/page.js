/* src/app/[locale]/page.js */

import { getTranslations } from "next-intl/server";

import styles from "./page.module.css";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className={styles.page}>
      <h1 className='pageTitle'>{t("title")}</h1>
      <div className='h1SubHead'>{t("description")}</div>
    </div>
  );
}
