/* src/app/[locale]/page.js */

import { getTranslations } from "next-intl/server";

import styles from "./page.module.css";

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <div className={styles.page}>
      <h1 className='pageTitle'>{t("title")}</h1>
      <div className='h1SubHead'>{t("description")}</div>

      <h2 className='sectionHead'>{t("learningFrench")}</h2>
      <p className='content'>{t("learningFrenchText1")}</p>
      <p className='content'>{t("learningFrenchText2")}</p>

      <h2 className='sectionHead'>{t("howLeQuizHelps")}</h2>
      <p className='content'>{t("howLeQuizHelpsText1")}</p>
      <p className='content'>{t("howLeQuizHelpsText2")}</p>
    </div>
  );
}
