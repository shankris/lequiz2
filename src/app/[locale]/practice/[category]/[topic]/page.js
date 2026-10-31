/* src/app/[locale]/practice/[category]/[topic]/page.js */

"use client";

import { useRef, useState } from "react";
import vocabulary from "@/data/vocabulary/definiteArticle.json";
import englishVocabulary from "@/data/vocabulary/definiteArticle_en.json";
import appConfig from "@/config/appConfig";

import WordLevelSelector from "./WordLevelSelector";
import SentenceCarousel from "./SentenceCarousel";
import QuizQuestion from "@/components/quiz/QuizQuestion/QuizQuestion";
import QuestionGrid from "@/components/quiz/QuestionGrid/QuestionGrid";

import styles from "./page.module.css";

const ANSWER_OPTIONS = ["le", "la", "l'", "les"];

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

function isValidQuestion(record) {
  return record.level === "A1" && record.article && record.noun && ["singular", "plural"].includes(record.number) && ANSWER_OPTIONS.includes(record.article);
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

const wordCounts = Object.fromEntries(Object.entries(WORD_LEVELS).map(([id, levels]) => [id, vocabulary.filter((record) => isValidQuestion(record) && levels.includes(record.wordLevel)).length]));

export default function PracticeTopicPage() {
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewingIndex, setViewingIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const questionStartedAt = useRef(null);
  const elapsedTimeMs = useRef(0);

  // Current question and response
  const currentQuestion = questions[viewingIndex];
  const currentResponse = responses[viewingIndex];

  const selectedAnswer = currentResponse?.selectedAnswer ?? null;
  const isViewingActive = viewingIndex === activeIndex;

  // Quiz score
  const score = responses.filter((response) => response?.isCorrect).length;

  // Start a new quiz
  function handleStartQuiz(selectedOption) {
    const availableQuestions = vocabulary
      .filter((record) => isValidQuestion(record) && selectedOption.wordLevels.includes(record.wordLevel))
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
      });

    const randomizedQuestions = shuffleArray(availableQuestions).slice(0, appConfig.practice.numberOfQuestions);

    setQuestions(randomizedQuestions);
    setActiveIndex(0);
    setViewingIndex(0);
    setResponses(Array(randomizedQuestions.length).fill(null));
    setIsFinished(false);

    elapsedTimeMs.current = 0;
    questionStartedAt.current = Date.now();

    setQuizStarted(true);
  }

  // Select an answered question from the grid
  function handleSelectQuestion(index) {
    if (!responses[index]) return;

    // Pause the timer if leaving an unanswered active question.
    if (viewingIndex === activeIndex && !responses[activeIndex] && questionStartedAt.current !== null) {
      elapsedTimeMs.current = Math.min(15000, elapsedTimeMs.current + (Date.now() - questionStartedAt.current));

      questionStartedAt.current = null;
    }

    setViewingIndex(index);
  }

  // Return to the current unanswered question
  function handleReturnToActive() {
    setViewingIndex(activeIndex);

    // Resume the timer if the active question is still unanswered.
    if (!responses[activeIndex] && questionStartedAt.current === null) {
      questionStartedAt.current = Date.now();
    }
  }

  // Submit an answer
  function handleAnswer(answer) {
    if (viewingIndex !== activeIndex) return;
    if (responses[activeIndex]) return;
    if (!currentQuestion) return;

    const reactionTimeMs = Math.min(15000, elapsedTimeMs.current + (Date.now() - questionStartedAt.current));

    const response = {
      questionIndex: activeIndex,
      noun: currentQuestion.noun,
      word: currentQuestion.word,
      gender: currentQuestion.gender,
      number: currentQuestion.form,
      correctAnswer: currentQuestion.answer,
      selectedAnswer: answer,
      isCorrect: answer === currentQuestion.answer,
      reactionTimeMs,
    };

    setResponses((previous) => {
      const updated = [...previous];
      updated[activeIndex] = response;
      return updated;
    });

    questionStartedAt.current = null;
  }

  // Move to the next question or finish the quiz
  function handleNext() {
    if (!responses[activeIndex]) return;

    if (activeIndex === questions.length - 1) {
      setIsFinished(true);
      return;
    }

    const nextIndex = activeIndex + 1;

    setActiveIndex(nextIndex);
    setViewingIndex(nextIndex);

    elapsedTimeMs.current = 0;
    questionStartedAt.current = Date.now();
  }

  // Return to the word-level selection screen
  function handleTryAgain() {
    setQuizStarted(false);
    setQuestions([]);
    setActiveIndex(0);
    setViewingIndex(0);
    setResponses([]);
    setIsFinished(false);

    questionStartedAt.current = null;
    elapsedTimeMs.current = 0;
  }

  // Show the word-level selector before the quiz starts
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

  // Handle an empty question list
  if (!currentQuestion) {
    return (
      <main className={styles.page}>
        <section className={styles.result}>
          <h1>No questions available</h1>

          <div className={styles.titleSubHead}>There are no questions available for this selection.</div>

          <button
            type='button'
            className={styles.primaryButton}
            onClick={handleTryAgain}
          >
            Go back
          </button>
        </section>
      </main>
    );
  }

  // Metadata for the current question
  const articlePhrase = currentQuestion.answer === "l'" ? `L'${currentQuestion.word}` : `${currentQuestion.answer} ${currentQuestion.word}`;

  const genderLabel = currentQuestion.gender === "m" ? "Masculine" : currentQuestion.gender === "f" ? "Feminine" : currentQuestion.gender;

  const numberLabel = currentQuestion.form === "singular" ? "Singular" : "Plural";

  const metadata = `${articlePhrase} — ${genderLabel} ${numberLabel}`;

  return (
    <main className={styles.page}>
      <div className={styles.quizLayout}>
        <section className={styles.quiz}>
          {/* Quiz completion message */}
          {isFinished && (
            <div className={styles.result}>
              <h1>Quiz Complete</h1>

              <p>
                You answered {score} out of {questions.length} questions correctly.
              </p>
            </div>
          )}

          {/* Current question */}
          <QuizQuestion
            question='Choose the definite article'
            word={currentQuestion.word}
            translation={currentQuestion.meaning}
            options={ANSWER_OPTIONS}
            correctAnswer={currentQuestion.answer}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswer}
            questionNumber={viewingIndex + 1}
            totalQuestions={questions.length}
            metadata={metadata}
            disabled={!isViewingActive || isFinished}
            isFinished={isFinished}
            score={score}
          />

          {/* Sentence examples and navigation */}
          {selectedAnswer !== null && (
            <>
              <SentenceCarousel
                key={currentQuestion.noun}
                sentences={currentQuestion.sentence}
              />

              {!isFinished &&
                (isViewingActive ? (
                  <button
                    type='button'
                    className={styles.primaryButton}
                    onClick={handleNext}
                  >
                    {activeIndex === questions.length - 1 ? "See results" : "Next"}
                  </button>
                ) : (
                  <button
                    type='button'
                    className={styles.primaryButton}
                    onClick={handleReturnToActive}
                  >
                    Return to question {activeIndex + 1}
                  </button>
                ))}
            </>
          )}
        </section>

        {/* Question navigation grid */}
        <QuestionGrid
          totalQuestions={questions.length}
          responses={responses}
          activeIndex={activeIndex}
          viewingIndex={viewingIndex}
          onSelect={handleSelectQuestion}
        />
      </div>
    </main>
  );
}
