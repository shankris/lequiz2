/* src/app/[locale]/practice/Vocabulary.jsx */

"use client";

import { Link } from "@/i18n/navigation";
import vocabulary from "@/data/vocabulary/vocabulary.json";
import styles from "./Vocabulary.module.css";

const PRACTICE_OPTIONS = [
  {
    id: "group1",
    title: "Group 1",
    description: "Beginner",
    wordLevels: ["Beginner"],
  },
  {
    id: "group2",
    title: "Group 2",
    description: "Intermediate",
    wordLevels: ["Intermediate"],
  },
  {
    id: "group3",
    title: "Group 3",
    description: "Advanced",
    wordLevels: ["Advanced"],
  },
  {
    id: "group4",
    title: "Group 4",
    description: "Challenge",
    wordLevels: ["Challenge"],
  },
  {
    id: "all",
    title: "All",
    description: "Practice every word",
    wordLevels: ["Beginner", "Intermediate", "Advanced", "Challenge"],
  },
];

const wordCounts = {
  group1: vocabulary.filter((word) => word.Beginner === "Beginner").length,
  group2: vocabulary.filter((word) => word.Beginner === "Intermediate").length,
  group3: vocabulary.filter((word) => word.Beginner === "Advanced").length,
  group4: vocabulary.filter((word) => word.Beginner === "Challenge").length,
  all: vocabulary.length,
};

export default function Vocabulary() {
  return (
    <section className={styles.selector}>
      <div className={styles.heading}>
        <h2>Choose your practice</h2>
        <p>Practice French vocabulary at your own pace.</p>
      </div>

      <div className={styles.levelGrid}>
        {PRACTICE_OPTIONS.map((option) => (
          <Link
            key={option.id}
            href={`/practice/vocabulary/${option.id}`}
            className={`${styles.levelCard} ${option.id === "all" ? styles.levelCardAll : ""}`}
            aria-label={`${option.title}: ${wordCounts[option.id]} words. ${option.description}`}
          >
            <span className={styles.levelWordCount}>{wordCounts[option.id]} words</span>

            <span className={styles.levelInfo}>
              <span className={styles.levelTitle}>{option.title}</span>
              <span className={styles.levelDescription}>{option.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
