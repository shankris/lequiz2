/* src/app/[locale]/practice/page.js */

import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import Tabs from "@/components/layout/ui/tabs/Tabs";

import practiceTabs from "./practiceTabs.json";

import styles from "./page.module.css";

export default async function PracticePage() {
  const t = await getTranslations("practice");

  const tabs = practiceTabs.tabs.map((tab) => ({
    id: tab.id,
    label: t(`tabs.${tab.id}.title`),
    content: (
      <div className={styles.practiceTabContent}>
        <p className={styles.practiceTabDescription}>{t(`tabs.${tab.id}.description`)}</p>

        <div className={styles.practiceCards}>
          {tab.items.map((item) => {
            const title = t(`items.${item.id}.title`);
            const hasSubtitle = t.has(`items.${item.id}.subtitle`);

            return (
              <Link
                key={item.id}
                href={`/practice/${tab.id}/${item.id}`}
                className={styles.practiceCard}
              >
                <h3>{title}</h3>

                {hasSubtitle && <div className={styles.practiceCardSubtitle}>{t(`items.${item.id}.subtitle`)}</div>}

                <p className='txt1'>{t(`items.${item.id}.description`)}</p>
              </Link>
            );
          })}
        </div>
      </div>
    ),
  }));

  return (
    <div className={styles.page}>
      <h1 className='pageTitle'>{t("title")}</h1>

      <div className='h1SubHead'>{t("subtitle")}</div>

      <Tabs tabs={tabs} />
    </div>
  );
}
