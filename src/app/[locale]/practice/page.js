/* src/app/[locale]/practice/page.js */

import { getTranslations } from "next-intl/server";

import styles from "../page.module.css";

export default async function PracticePage() {
  const t = await getTranslations("practice");

  return (
    <div className={styles.page}>
      <h1 className='pageTitle'>{t("title")}</h1>
      <div className='h1SubHead'>{t("subtitle")}</div>
    </div>
  );
}
