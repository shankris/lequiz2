"use client";

import styles from "./QuestionGrid.module.css";

function formatTime(milliseconds) {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  }

  return `${(milliseconds / 1000).toFixed(1)}s`;
}

export default function QuestionGrid({ totalQuestions, responses, activeIndex, viewingIndex, onSelect }) {
  // Calculate statistics
  const answeredResponses = responses.filter(Boolean);

  const correctResponses = answeredResponses.filter((response) => response.isCorrect);

  const correctCount = correctResponses.length;
  const incorrectCount = answeredResponses.length - correctCount;
  const unansweredCount = totalQuestions - answeredResponses.length;

  const totalReactionTime = correctResponses.reduce((total, response) => total + response.reactionTimeMs, 0);

  const averageReactionTime = correctResponses.length > 0 ? formatTime(totalReactionTime / correctResponses.length) : "—";

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

      {/* Statistics */}
      <div className={styles.summary}>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.statCorrect}`}>{correctCount}</span>
          <span className={styles.statLabel}>Correct</span>
        </div>

        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.statIncorrect}`}>{incorrectCount}</span>
          <span className={styles.statLabel}>Incorrect</span>
        </div>

        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.statUnanswered}`}>{unansweredCount}</span>
          <span className={styles.statLabel}>Unanswered</span>
        </div>

        <div className={`${styles.stat} ${styles.averageTime}`}>
          <span className={styles.statValue}>{averageReactionTime}</span>
          <span className={styles.statLabel}>Avg. Reaction Time</span>
        </div>
      </div>
    </aside>
  );
}
