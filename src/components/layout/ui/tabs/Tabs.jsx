/* src/components/layout/ui/tabs/Tabs.jsx */

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import styles from "./Tabs.module.css";

export default function Tabs({ tabs = [], initialTab = 0 }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const activeContent = tabs[activeTab]?.content;

  return (
    <div className={styles.container}>
      <div
        className={styles.materialTabs}
        role='tablist'
        aria-label='Practice categories'
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;

          return (
            <button
              key={tab.id}
              type='button'
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => setActiveTab(index)}
              role='tab'
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              {tab.label}

              {isActive && (
                <motion.span
                  className={styles.yellowBar}
                  layoutId='tabs-indicator'
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        className={styles.tabContent}
        role='tabpanel'
        id={`tab-panel-${tabs[activeTab]?.id || "content"}`}
        aria-labelledby={`tab-${tabs[activeTab]?.id || "content"}`}
      >
        {activeContent}
      </div>
    </div>
  );
}
