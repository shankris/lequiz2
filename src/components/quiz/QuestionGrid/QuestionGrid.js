/* src/components/quiz/QuestionGrid/QuestionGrid.js */

"use client";

import styles from "./QuestionGrid.module.css";

function formatTime(milliseconds) {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }

  return `${(milliseconds / 1000).toFixed(1)}s`;
}

export default function QuestionGrid({ totalQuestions, responses, activeIndex, viewingIndex, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Questions</h2>

      <div className={styles.grid}>
        {Array.from({ length: totalQuestions }, (_, index) => {
          const response = responses[index];
          const isAnswered = Boolean(response);
          const isViewing = index === viewingIndex;

          let cellClass = styles.question;

          if (isAnswered) {
            cellClass += response.isCorrect ? ` ${styles.correct}` : ` ${styles.incorrect}`;
          } else {
            cellClass += ` ${styles.unanswered}`;
          }

          if (isViewing) {
            cellClass += ` ${styles.selected}`;
          }

          return (
            <button
              key={index}
              type='button'
              className={cellClass}
              disabled={!isAnswered}
              onClick={() => onSelect(index)}
              aria-label={isAnswered ? `Question ${index + 1}, ${response.isCorrect ? "correct" : "incorrect"}, time ${formatTime(response.reactionTimeMs)}` : `Question ${index + 1}, not answered`}
              aria-current={isViewing ? "true" : undefined}
            >
              <span className={styles.number}>{index + 1}</span>

              {isAnswered && <span className={styles.time}>{formatTime(response.reactionTimeMs)}</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span>
          <i className={styles.legendCorrect} /> Correct
        </span>
        <span>
          <i className={styles.legendIncorrect} /> Incorrect
        </span>
        <span>
          <i className={styles.legendUnanswered} /> Not answered
        </span>
      </div>
    </aside>
  );
}
