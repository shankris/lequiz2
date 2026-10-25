/* src/app/[locale]/practice/[category]/[topic]/WordLevelSelector.js */

"use client";

import styles from "./WordLevelSelector.module.css";

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
    id: "group1-2",
    title: "Group 1 + 2",
    description: "Beginner and Intermediate",
    wordLevels: ["Beginner", "Intermediate"],
  },
  {
    id: "group3",
    title: "Group 3",
    description: "Advanced",
    wordLevels: ["Advanced"],
  },
  {
    id: "group1-2-3",
    title: "Group 1, 2, 3",
    description: "Beginner to Advanced",
    wordLevels: ["Beginner", "Intermediate", "Advanced"],
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

export default function WordLevelSelector({ onStart, wordCounts }) {
  return (
    <section className={styles.selector}>
      <div className={styles.heading}>
        <h2>Choose your practice</h2>
        <p>Practice French definite articles at your own pace.</p>
      </div>

      <div className={styles.levelGrid}>
        {PRACTICE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type='button'
            className={`${styles.levelCard} ${option.id === "all" ? styles.levelCardAll : ""}`}
            onClick={() => onStart(option)}
            disabled={wordCounts[option.id] === 0}
            aria-label={`${option.title}: ${wordCounts[option.id]} words. ${option.description}`}
          >
            <span className={styles.levelWordCount}>{wordCounts[option.id]} words</span>

            <span className={styles.levelInfo}>
              <span className={styles.levelTitle}>{option.title}</span>
              <span className={styles.levelDescription}>{option.description}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
