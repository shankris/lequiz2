/* src/app/[locale]/practice/[category]/[topic]/WordLevelSelector.js */

"use client";

import { useState } from "react";
import { Eye, Calendar, Timer } from "lucide-react";
import styles from "./WordLevelSelector.module.css";

const PRACTICE_OPTIONS = [
  {
    id: "group1",
    title: "Group 1",
    wordLevels: ["Beginner"],
  },
  {
    id: "group2",
    title: "Group 2",
    wordLevels: ["Intermediate"],
  },
  {
    id: "group1-2",
    title: "Group 1 + 2",
    wordLevels: ["Beginner", "Intermediate"],
  },
  {
    id: "group3",
    title: "Group 3",
    wordLevels: ["Advanced"],
  },
  {
    id: "group1-2-3",
    title: "Group 1, 2, 3",
    wordLevels: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    id: "group4",
    title: "Group 4",
    wordLevels: ["Challenge"],
  },
  {
    id: "all",
    title: "All",
    wordLevels: ["Beginner", "Intermediate", "Advanced", "Challenge"],
  },
];

export default function WordLevelSelector({ onStart, wordCounts }) {
  const [viewCounts] = useState(() => Object.fromEntries(PRACTICE_OPTIONS.map((option) => [option.id, Math.floor(Math.random() * 21) + 10])));

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
            aria-label={`${option.title}: ${wordCounts[option.id]} words`}
          >
            <span className={styles.levelWordCount}>{wordCounts[option.id]} words</span>

            <span className={styles.levelInfo}>
              <span className={styles.levelTitle}>{option.title}</span>
            </span>

            <span className={styles.levelMeta}>
              <span className={styles.metaItem}>
                <Eye
                  size={15}
                  aria-hidden='true'
                />
                {viewCounts[option.id]}
              </span>

              <span className={styles.metaItem}>
                <Calendar
                  size={15}
                  aria-hidden='true'
                />
                2d ago
              </span>

              <span className={styles.metaItem}>
                <Timer
                  size={15}
                  aria-hidden='true'
                />
                1.6s
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
