/* src/app/components/quiz/QuizQuestion/QuizQuestion.js */

"use client";

import { Check, X } from "lucide-react";
import styles from "./QuizQuestion.module.css";

export default function QuizQuestion({ question, word, translation = "", options = [], correctAnswer, selectedAnswer = null, onAnswer, questionNumber, totalQuestions, answerLabel = "Choose your answer", explanation, metadata, onNext, nextLabel = "Next", disabled = false }) {
  const hasAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === correctAnswer;
  const isLastQuestion = questionNumber === totalQuestions;

  function handleAnswer(answer) {
    if (hasAnswered || disabled) return;
    onAnswer?.(answer);
  }

  return (
    <section className={styles.quizQuestion}>
      {/* Question progress */}
      {questionNumber != null && totalQuestions != null && (
        <div className={styles.progress}>
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Question */}
      {question && <h2 className={styles.question}>{question}</h2>}

      {/* Word and translation */}
      {word && (
        <div className={styles.wordSection}>
          <div className={styles.word}>{word}</div>

          {translation && <p className={styles.translation}>{translation}</p>}
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
                disabled={hasAnswered || disabled}
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

      {/* Answer feedback */}
      {hasAnswered && (
        <div
          className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}
          role='status'
        >
          <strong>{isCorrect ? "Correct!" : "Not quite!"}</strong>

          {!isCorrect && (
            <p>
              Correct answer: <strong>{correctAnswer}</strong>
            </p>
          )}

          {explanation && <div className={styles.explanation}>{explanation}</div>}

          {metadata && <div className={styles.metadata}>{metadata}</div>}
        </div>
      )}

      {/* Next button */}
      {hasAnswered && onNext && (
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
