/* src/app/[locale]/practice/[category]/[topic]/page.js */

"use client";

import { useEffect, useRef, useState } from "react";
import vocabulary from "@/data/vocabulary/definiteArticle.json";
import englishVocabulary from "@/data/vocabulary/definiteArticle_en.json";
import appConfig from "@/config/appConfig";
import WordLevelSelector from "./WordLevelSelector";
import SentenceCarousel from "./SentenceCarousel";

import { Check, X } from "lucide-react";
import styles from "./page.module.css";

const ANSWER_OPTIONS = ["le", "la", "l'", "les"];

function shuffleArray(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function getWordDetails(record) {
  const englishRecord = englishVocabulary.find((item) => item.noun === record.noun);

  return {
    word: record.word,
    meaning: record.english ?? englishRecord?.meaning ?? "",
    englishRecord,
  };
}

function getSentences(record, englishRecord) {
  const availableSentences = [];

  for (let i = 1; i <= 5; i++) {
    const text = record[`sentence${i}`];

    if (!text?.trim()) continue;

    const explanation = englishRecord?.[`explain${i}`] ?? "";

    availableSentences.push({
      id: i,
      text,
      translation: englishRecord?.[`sentence${i}`] ?? "",
      explanation: explanation
        .split("|")
        .map((item) => {
          const [french, ...englishParts] = item.split("=");

          return {
            french: french.trim(),
            english: englishParts.join("=").trim(),
          };
        })
        .filter((item) => item.french && item.english),
    });
  }

  return availableSentences;
}

const WORD_LEVELS = {
  group1: ["Beginner"],
  group2: ["Intermediate"],
  "group1-2": ["Beginner", "Intermediate"],
  group3: ["Advanced"],
  "group1-2-3": ["Beginner", "Intermediate", "Advanced"],
  group4: ["Challenge"],
  all: ["Beginner", "Intermediate", "Advanced", "Challenge"],
};

const isValidQuestion = (record) => record.level === "A1" && record.article && record.noun && ["singular", "plural"].includes(record.number) && ANSWER_OPTIONS.includes(record.article);

const wordCounts = Object.fromEntries(Object.entries(WORD_LEVELS).map(([id, levels]) => [id, vocabulary.filter((record) => isValidQuestion(record) && levels.includes(record.wordLevel)).length]));

export default function PracticeTopicPage() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const questionStartedAt = useRef(null);

  function handleStartQuiz(selectedOption) {
    const availableQuestions = vocabulary
      .filter((record) => record.level === "A1" && record.article && record.noun && ["singular", "plural"].includes(record.number) && selectedOption.wordLevels.includes(record.wordLevel))
      .map((record) => {
        const details = getWordDetails(record);

        return {
          ...details,
          noun: record.noun,
          word: record.noun,
          gender: record.gender,
          form: record.number,
          answer: record.article,
          sentence: getSentences(record, details.englishRecord),
        };
      })
      .filter((question) => ANSWER_OPTIONS.includes(question.answer));

    const randomizedQuestions = shuffleArray(availableQuestions).slice(0, appConfig.practice.numberOfQuestions);

    setQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setResponses([]);
    setIsFinished(false);
    questionStartedAt.current = Date.now();
    setQuizStarted(true);
  }

  if (!quizStarted) {
    return (
      <main className={styles.page}>
        <WordLevelSelector
          onStart={handleStartQuiz}
          wordCounts={wordCounts}
        />
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.answer;
  const score = responses.filter((response) => response.isCorrect).length;

  function handleAnswer(answer) {
    if (selectedAnswer !== null) return;

    const reactionTimeMs = Date.now() - questionStartedAt.current;

    setSelectedAnswer(answer);
    setResponses((previous) => [
      ...previous,
      {
        noun: currentQuestion.noun,
        word: currentQuestion.word,
        gender: currentQuestion.gender,
        number: currentQuestion.form,
        correctAnswer: currentQuestion.answer,
        selectedAnswer: answer,
        isCorrect: answer === currentQuestion.answer,
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
    questionStartedAt.current = Date.now();
  }

  if (isFinished) {
    return (
      <main className={styles.page}>
        <section className={styles.result}>
          <h1>Quiz complete!</h1>
          <p>
            You answered {score} out of {questions.length} questions correctly.
          </p>

          <button
            type='button'
            className={styles.primaryButton}
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.quiz}>
        <h1 className={styles.title}>Choose the definite article</h1>

        <div className={styles.word}>{currentQuestion.word}</div>
        <p className={styles.meaning}>{currentQuestion.meaning}</p>

        <div className={styles.options}>
          {ANSWER_OPTIONS.map((answer) => {
            const isSelected = selectedAnswer === answer;
            const isAnswer = currentQuestion.answer === answer;

            let optionClass = styles.option;

            if (selectedAnswer !== null && isAnswer) {
              optionClass += ` ${styles.correct}`;
            } else if (isSelected && !isCorrect) {
              optionClass += ` ${styles.incorrect}`;
            }

            return (
              <button
                key={answer}
                type='button'
                className={optionClass}
                onClick={() => handleAnswer(answer)}
                disabled={selectedAnswer !== null}
              >
                {selectedAnswer !== null && isAnswer && (
                  <div className={styles.optionIconWrapper}>
                    <Check
                      className={styles.optionIcon}
                      size={22}
                      strokeWidth={2.5}
                    />
                  </div>
                )}

                {selectedAnswer !== null && isSelected && !isCorrect && (
                  <div className={styles.optionIconWrapperIncorrect}>
                    <X
                      size={18}
                      strokeWidth={2.5}
                      color='#dc2626'
                    />
                  </div>
                )}

                {answer}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <>
            <div className={styles.exampleDetails}>
              <span className={styles.detailTag}>
                {currentQuestion.answer === "l'" ? `L'${currentQuestion.word}` : `${currentQuestion.answer} ${currentQuestion.word}`} — {currentQuestion.gender === "m" ? "Masculine" : currentQuestion.gender === "f" ? "Feminine" : currentQuestion.gender} {currentQuestion.form === "singular" ? "Singular" : "Plural"}
              </span>
            </div>

            <SentenceCarousel sentences={currentQuestion.sentence} />
          </>
        )}

        {selectedAnswer !== null && (
          <button
            type='button'
            className={styles.primaryButton}
            onClick={handleNext}
          >
            {currentIndex === questions.length - 1 ? "See results" : "Next"}
          </button>
        )}
      </section>
    </main>
  );
}
