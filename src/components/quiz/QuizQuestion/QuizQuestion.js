/* src/app/components/quiz/QuizQuestion/QuizQuestion.js */

"use client";

import { Check, X } from "lucide-react";
import styles from "./QuizQuestion.module.css";

export default function QuizQuestion({ question, word, translation = "", options = [], correctAnswer, selectedAnswer = null, onAnswer, questionNumber, totalQuestions, answerLabel = "", explanation, metadata, onNext, nextLabel = "Next", disabled = false, isFinished = false, score = 0 }) {
  const hasAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === correctAnswer;
  const isLastQuestion = questionNumber === totalQuestions;

  // Show the correct definite article once the question is answered.
  const displayedWord = hasAnswered ? (correctAnswer === "l'" ? `l'${word}` : `${correctAnswer} ${word}`) : word;

  function handleAnswer(answer) {
    if (hasAnswered || disabled || isFinished) return;
    onAnswer?.(answer);
  }

  return (
    <section className={styles.quizQuestion}>
      {/* Quiz completion */}

      {/* Question */}
      {!isFinished && <h1 className={styles.question}>{question}</h1>}

      {/* Word and translation */}
      {word && (
        <div className={styles.wordSection}>
          <div className={styles.word}>{displayedWord}</div>

          {hasAnswered && metadata && <div className={styles.metadata}>{metadata.split("—").pop().trim()}</div>}

          {translation && <div className={styles.translation}>{translation}</div>}
        </div>
      )}

      {/* Answer options */}
      <div className={styles.answerSection}>
        {answerLabel && <p className={styles.answerLabel}>{answerLabel}</p>}

        <div className={styles.options}>
          {options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isAnswer = correctAnswer === option;

            let optionClass = styles.option;

            if (hasAnswered && isAnswer) {
              optionClass += ` ${styles.correct}`;
            } else if (hasAnswered && isSelected && !isCorrect) {
              optionClass += ` ${styles.incorrect}`;
            }

            return (
              <button
                key={option}
                type='button'
                className={optionClass}
                onClick={() => handleAnswer(option)}
                disabled={hasAnswered || disabled || isFinished}
                aria-pressed={isSelected}
              >
                <span>{option}</span>

                {hasAnswered && isAnswer && (
                  <Check
                    className={styles.optionIcon}
                    size={20}
                    strokeWidth={2.5}
                  />
                )}

                {hasAnswered && isSelected && !isCorrect && (
                  <X
                    className={styles.optionIcon}
                    size={20}
                    strokeWidth={2.5}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next button */}
      {!isFinished && hasAnswered && onNext && (
        <button
          type='button'
          className={styles.nextButton}
          onClick={onNext}
        >
          {nextLabel || (isLastQuestion ? "See results" : "Next")}
        </button>
      )}
    </section>
  );
}
