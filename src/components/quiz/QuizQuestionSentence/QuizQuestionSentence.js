/* src/components/quiz/QuizQuestionSentence/QuizQuestionSentence.js */

"use client";

import { Check, X } from "lucide-react";
import styles from "./QuizQuestionSentence.module.css";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSentenceParts(sentence, noun, correctAnswer) {
  if (!sentence || !noun || !correctAnswer) return null;

  const articlePattern = correctAnswer === "l'" ? "l['’]" : escapeRegExp(correctAnswer);

  const pattern = new RegExp(`(^|[\\s([{])(${articlePattern})(\\s*)(${escapeRegExp(noun)})`, "i");

  const match = sentence.match(pattern);

  if (!match) return null;

  const articleStart = match.index + match[1].length;
  const articleEnd = articleStart + match[2].length;

  return {
    before: sentence.slice(0, articleStart),
    article: match[2],
    after: sentence.slice(articleEnd),
  };
}

function getExplanationParts(explanation) {
  if (!explanation) return [];

  return explanation
    .split("|")
    .map((item) => {
      const [french, ...englishParts] = item.split("=");

      return {
        french: french.trim(),
        english: englishParts.join("=").trim(),
      };
    })
    .filter((item) => item.french && item.english);
}

export default function QuizQuestionSentence({ question, sentence, noun, translation = "", explanation = "", options = [], correctAnswer, selectedAnswer = null, onAnswer, disabled = false, isFinished = false }) {
  const hasAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === correctAnswer;

  const sentenceParts = getSentenceParts(sentence, noun, correctAnswer);

  const explanationParts = getExplanationParts(explanation);

  function handleAnswer(answer) {
    if (hasAnswered || disabled || isFinished) return;
    onAnswer?.(answer);
  }

  return (
    <section className={styles.quizQuestion}>
      {!isFinished && <h1 className={styles.question}>{question}</h1>}

      {/* Sentence and explanation */}
      <div className={styles.sentenceSection}>
        <div className={styles.exampleSentence}>
          {sentenceParts ? (
            <>
              <span>{sentenceParts.before}</span>

              {hasAnswered ? (
                <span className={styles.correctArticle}>{sentenceParts.article}</span>
              ) : (
                <>
                  <span className={styles.blank}>_____</span>
                  {!/^\s/.test(sentenceParts.after) && " "}
                </>
              )}

              <span>{sentenceParts.after}</span>
            </>
          ) : (
            sentence
          )}
        </div>

        {/* English translation - always visible */}
        {translation && <p className={styles.translation}>{translation}</p>}

        {hasAnswered && explanationParts.length > 0 && (
          <table className={styles.explanationTable}>
            <tbody>
              {explanationParts.map((item, index) => (
                <tr key={index}>
                  <td>{item.french}</td>
                  <td>{item.english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Answer options */}
      <div className={styles.answerSection}>
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
              >
                {option}

                {hasAnswered && isAnswer && <Check size={18} />}

                {hasAnswered && isSelected && !isCorrect && <X size={18} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer feedback */}
      {hasAnswered && (
        <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}>
          <strong>{isCorrect ? "Correct!" : `Correct answer: ${correctAnswer}`}</strong>
        </div>
      )}
    </section>
  );
}
