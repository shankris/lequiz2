/* src/app/[locale]/practice/vocabulary/[level]/page.js */

"use client";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { Check, X } from "lucide-react";

import frenchVocabulary from "@/data/vocabulary/vocabulary.json";
import englishVocabularyData from "@/data/vocabulary/vocabulary_en.json";
import appConfig from "@/config/appConfig";

import styles from "./page.module.css";

const englishVocabulary = Array.isArray(englishVocabularyData) ? englishVocabularyData : (englishVocabularyData.Sheet1 ?? []);

console.log("English vocabulary data:", englishVocabularyData);
console.log("Is array:", Array.isArray(englishVocabularyData));
console.log("Top-level keys:", Object.keys(englishVocabularyData ?? {}));

const WORD_LEVELS = {
  group1: ["Beginner"],
  group2: ["Intermediate"],
  group3: ["Advanced"],
  group4: ["Challenge"],
  all: ["Beginner", "Intermediate", "Advanced", "Challenge"],
};

function shuffleArray(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function getFrenchRecord(word) {
  return frenchVocabulary.find((record) => record.word === word);
}

function getMeaning(record) {
  const entries = Object.entries(record);

  return entries[1]?.[1] ?? "";
}

function getSentences(record, englishRecord) {
  if (!record || !englishRecord) return [];

  return Object.entries(record)
    .filter(([french]) => /[.!?]$/.test(french.trim()))
    .slice(0, 5)
    .map(([french, targetFrench], index) => {
      const explanation = englishRecord[`explain${index + 1}`] ?? "";

      return {
        id: index + 1,
        text: targetFrench,
        translation: englishRecord[`sentence${index + 1}`] ?? "",
        explanation: explanation
          .split("|")
          .map((item) => {
            const [frenchPart, ...englishParts] = item.split("=");

            return {
              french: frenchPart.trim(),
              english: englishParts.join("=").trim(),
            };
          })
          .filter((item) => item.french && item.english),
      };
    });
}

function buildQuestion(englishRecord) {
  const frenchRecord = getFrenchRecord(englishRecord.word);

  if (!frenchRecord) return null;

  const options = [
    ...new Set(
      (englishRecord.options ?? "")
        .split("|")
        .map((option) => option.trim())
        .filter(Boolean),
    ),
  ];

  const answer = englishRecord.correct_answer?.trim();

  if (!answer || !options.includes(answer)) return null;

  return {
    word: englishRecord.word,
    meaning: getMeaning(frenchRecord),
    answer,
    options: shuffleArray(options),
    sentences: getSentences(frenchRecord, englishRecord),
  };
}

export default function VocabularyQuizPage() {
  const params = useParams();
  const level = params.level;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(0);

  const questionStartedAt = useRef(null);

  const availableLevels = WORD_LEVELS[level];

  function handleStartQuiz() {
    alert("Start practice button clicked");
    console.log("handleStartQuiz is running");

    if (!availableLevels) {
      alert(`No available levels for: ${level}`);
      return;
    }

    if (!availableLevels) return;

    console.log("Vocabulary counts by level:", Object.fromEntries(["Beginner", "Intermediate", "Advanced", "Challenge"].map((wordLevel) => [wordLevel, frenchVocabulary.filter((record) => record[wordLevel] === wordLevel).length])));

    console.log(
      "English records with valid answers:",
      englishVocabulary.filter((record) => {
        const options = (record.options ?? "").split("|").map((option) => option.trim());

        return record.correct_answer?.trim() && options.includes(record.correct_answer.trim());
      }).length,
    );

    const availableQuestions = englishVocabulary.map(buildQuestion).filter(
      (question) =>
        question &&
        availableLevels.some((wordLevel) => {
          const record = getFrenchRecord(question.word);
          return record?.[wordLevel] === wordLevel;
        }),
    );

    const randomizedQuestions = shuffleArray(availableQuestions).slice(0, appConfig.practice.numberOfQuestions);

    // Temporary diagnostics — run these before the early return.
    console.log("Vocabulary records:", frenchVocabulary.length);
    console.log("English records:", englishVocabulary.length);
    console.log("Matching French records:", englishVocabulary.filter((record) => frenchVocabulary.some((french) => french.word === record.word)).length);
    console.log("Available questions:", availableQuestions.length);
    console.log("Selected questions:", randomizedQuestions.length);
    console.log("Route level:", level);

    if (randomizedQuestions.length === 0) return;

    setQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResponses([]);
    setIsFinished(false);
    setSentenceIndex(0);

    questionStartedAt.current = Date.now();
    setQuizStarted(true);
  }

  function handleAnswer(answer) {
    if (selectedAnswer !== null) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.answer;
    const reactionTimeMs = Date.now() - questionStartedAt.current;

    setSelectedAnswer(answer);

    setResponses((previous) => [
      ...previous,
      {
        word: currentQuestion.word,
        correctAnswer: currentQuestion.answer,
        selectedAnswer: answer,
        isCorrect,
        reactionTimeMs,
      },
    ]);
  }

  function handleNext() {
    if (currentIndex === questions.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((previous) => previous + 1);
    setSelectedAnswer(null);
    setSentenceIndex(0);
    questionStartedAt.current = Date.now();
  }

  function handleRestart() {
    setQuizStarted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResponses([]);
    setIsFinished(false);
    setSentenceIndex(0);
  }

  if (!availableLevels) {
    return (
      <main className={styles.page}>
        <h1 className={styles.title}>Practice not found</h1>
        <p className={styles.description}>The selected vocabulary level is not available.</p>
      </main>
    );
  }

  if (!quizStarted) {
    return (
      <main className={styles.page}>
        <section className={styles.start}>
          <h1 className={styles.title}>French Vocabulary</h1>
          <p className={styles.description}>Practice {level === "all" ? "all vocabulary levels" : availableLevels[0].toLowerCase() + " vocabulary"}.</p>

          <button
            type='button'
            className={styles.primaryButton}
            onClick={handleStartQuiz}
          >
            Start practice
          </button>
        </section>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (isFinished) {
    const score = responses.filter((response) => response.isCorrect).length;

    return (
      <main className={styles.page}>
        <section className={styles.result}>
          <h1 className={styles.title}>Practice complete!</h1>
          <p className={styles.description}>
            You answered {score} out of {questions.length} questions correctly.
          </p>

          <button
            type='button'
            className={styles.primaryButton}
            onClick={handleRestart}
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.answer;
  const currentSentence = currentQuestion.sentences[sentenceIndex];

  return (
    <main className={styles.page}>
      <section className={styles.quiz}>
        <div className={styles.progress}>
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>Score: {responses.filter((response) => response.isCorrect).length}</span>
        </div>

        <h1 className={styles.title}>Choose the correct meaning</h1>

        <div className={styles.word}>{currentQuestion.word}</div>

        <div className={styles.options}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isAnswer = currentQuestion.answer === option;

            let optionClass = styles.option;

            if (selectedAnswer !== null && isAnswer) {
              optionClass += ` ${styles.correct}`;
            } else if (isSelected && !isCorrect) {
              optionClass += ` ${styles.incorrect}`;
            }

            return (
              <button
                key={option}
                type='button'
                className={optionClass}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {selectedAnswer !== null && isAnswer && (
                  <Check
                    size={20}
                    aria-hidden='true'
                  />
                )}

                {selectedAnswer !== null && isSelected && !isCorrect && (
                  <X
                    size={20}
                    aria-hidden='true'
                  />
                )}

                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div
            className={styles.feedback}
            aria-live='polite'
          >
            {currentSentence && (
              <section className={styles.example}>
                <h2>Example sentences</h2>

                <div className={styles.sentence}>
                  <p className={styles.frenchSentence}>{currentSentence.text}</p>

                  <p className={styles.translation}>{currentSentence.translation}</p>
                </div>

                {currentSentence.explanation.length > 0 && (
                  <div className={styles.explanation}>
                    {currentSentence.explanation.map((item, index) => (
                      <div
                        className={styles.explanationRow}
                        key={index}
                      >
                        <span>{item.french}</span>
                        <span>{item.english}</span>
                      </div>
                    ))}
                  </div>
                )}

                {currentQuestion.sentences.length > 1 && (
                  <div className={styles.sentenceNavigation}>
                    <button
                      type='button'
                      onClick={() => setSentenceIndex((previous) => previous - 1)}
                      disabled={sentenceIndex === 0}
                    >
                      Previous example
                    </button>

                    <span>
                      {sentenceIndex + 1} / {currentQuestion.sentences.length}
                    </span>

                    <button
                      type='button'
                      onClick={() => setSentenceIndex((previous) => previous + 1)}
                      disabled={sentenceIndex === currentQuestion.sentences.length - 1}
                    >
                      Next example
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {selectedAnswer !== null && (
          <button
            type='button'
            className={styles.primaryButton}
            onClick={handleNext}
          >
            {currentIndex === questions.length - 1 ? "See results" : "Next question"}
          </button>
        )}
      </section>
    </main>
  );
}
