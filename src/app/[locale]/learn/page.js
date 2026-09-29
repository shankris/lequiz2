/* src/app/[locale]/learn/page.js */

import { getTranslations } from "next-intl/server";

import styles from "../page.module.css";

export default async function LearnPage() {
  const t = await getTranslations("learn");

  return (
    <div className={styles.page}>
      <h1 className='pageTitle'>{t("title")}</h1>
      <div className='h1SubHead'>{t("subtitle")}</div>
    </div>
  );
}
