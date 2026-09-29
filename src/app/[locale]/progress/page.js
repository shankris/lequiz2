/* src/app/[locale]/progress/page.js */

import { getTranslations } from "next-intl/server";

import styles from "../page.module.css";

export default async function ProgressPage() {
  const t = await getTranslations("progress");

  return (
    <div className={styles.page}>
      <h1 className='pageTitle'>{t("title")}</h1>
      <div className='h1SubHead'>{t("subtitle")}</div>
    </div>
  );
}
