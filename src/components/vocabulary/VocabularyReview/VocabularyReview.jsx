/* src/components/vocabulary/VocabularyReview/VocabularyReview.jsx */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "next-intl";

import vocabulary from "@/data/vocabulary/a1Vocabulary.json";
import enVocabulary from "@/data/vocabulary/en.json";
import frVocabulary from "@/data/vocabulary/fr.json";
import deVocabulary from "@/data/vocabulary/de.json";
import esVocabulary from "@/data/vocabulary/es.json";

import styles from "./VocabularyReview.module.css";

const LANGUAGE_DATA = {
  en: enVocabulary,
  fr: frVocabulary,
  de: deVocabulary,
  es: esVocabulary,
};

const AUDIO_BASE_PATH = "/audio/vocabulary";

function getLanguageData(locale) {
  return LANGUAGE_DATA[locale] || enVocabulary;
}

function getWordWithArticle(item) {
  if (!item.article) {
    return item.word;
  }

  return `${item.article}${item.article === "l'" ? "" : " "}${item.word}`;
}

export default function VocabularyReview() {
  const locale = useLocale();

  const languageData = getLanguageData(locale);

  const [selectedGroup, setSelectedGroup] = useState(vocabulary[0]?.group || "");

  const [selectedWord, setSelectedWord] = useState(vocabulary[0]?.word || "");

  const [sentenceIndex, setSentenceIndex] = useState(0);

  const wordAudioRef = useRef(null);
  const sentenceAudioRef = useRef(null);

  const languageByWord = useMemo(() => {
    return new Map(languageData.map((item) => [item.word, item]));
  }, [languageData]);

  const groups = useMemo(() => {
    const uniqueGroups = [];

    vocabulary.forEach((item) => {
      if (!uniqueGroups.includes(item.group)) {
        uniqueGroups.push(item.group);
      }
    });

    return uniqueGroups;
  }, []);

  const groupWords = useMemo(() => {
    return vocabulary.filter((item) => item.group === selectedGroup);
  }, [selectedGroup]);

  const currentIndex = groupWords.findIndex((item) => item.word === selectedWord);

  const currentWord = groupWords[currentIndex >= 0 ? currentIndex : 0];

  const currentLanguageData = languageByWord.get(currentWord?.word) || null;

  const currentSentence = currentWord?.sentences?.[sentenceIndex] || null;

  useEffect(() => {
    if (!currentWord) {
      return;
    }

    setSelectedWord(currentWord.word);
    setSentenceIndex(0);
  }, [selectedGroup]);

  useEffect(() => {
    if (!currentWord) {
      return;
    }

    const audio = wordAudioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;

    audio.play().catch(() => {
      // Browsers may block autoplay until the user interacts.
    });
  }, [currentWord]);

  useEffect(() => {
    setSentenceIndex(0);
  }, [selectedWord]);

  function handleGroupChange(group) {
    const firstWord = vocabulary.find((item) => item.group === group);

    setSelectedGroup(group);
    setSelectedWord(firstWord?.word || "");
    setSentenceIndex(0);
  }

  function handleWordChange(word) {
    setSelectedWord(word);
    setSentenceIndex(0);
  }

  function handlePreviousWord() {
    if (currentIndex <= 0) {
      return;
    }

    setSelectedWord(groupWords[currentIndex - 1].word);
  }

  function handleNextWord() {
    if (currentIndex >= groupWords.length - 1) {
      return;
    }

    setSelectedWord(groupWords[currentIndex + 1].word);
  }

  function handlePreviousSentence() {
    setSentenceIndex((index) => (index > 0 ? index - 1 : currentWord.sentences.length - 1));
  }

  function handleNextSentence() {
    setSentenceIndex((index) => (index < currentWord.sentences.length - 1 ? index + 1 : 0));
  }

  function playWordAudio() {
    const audio = wordAudioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function playSentenceAudio() {
    const audio = sentenceAudioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  if (!currentWord || !currentLanguageData) {
    return null;
  }

  const wordWithArticle = getWordWithArticle(currentWord);

  const sentenceAudioPath = currentSentence ? `${AUDIO_BASE_PATH}/${currentSentence.audio}` : "";

  const wordAudioPath = `${AUDIO_BASE_PATH}/${currentWord.audio}`;

  const currentSentenceTranslation = currentLanguageData.sentenceTranslations.find((sentence) => sentence.id === currentSentence?.id)?.text;

  return (
    <section className={styles.vocabularyReview}>
      <aside className={styles.vocabularyReviewSidebar}>
        <div className={styles.vocabularyReviewGroups}>
          {groups.map((group) => (
            <button
              key={group}
              type='button'
              className={group === selectedGroup ? `${styles.vocabularyReviewGroup} ${styles.vocabularyReviewGroupActive}` : styles.vocabularyReviewGroup}
              onClick={() => handleGroupChange(group)}
            >
              {group}
            </button>
          ))}
        </div>

        <div className={styles.vocabularyReviewWords}>
          {groupWords.map((item) => (
            <button
              key={item.word}
              type='button'
              className={item.word === currentWord.word ? `${styles.vocabularyReviewWord} ${styles.vocabularyReviewWordActive}` : styles.vocabularyReviewWord}
              onClick={() => handleWordChange(item.word)}
            >
              {getWordWithArticle(item)}
            </button>
          ))}
        </div>
      </aside>

      <main className={styles.vocabularyReviewMain}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentWord.word}
            className={styles.vocabularyReviewContent}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.vocabularyReviewWordHeader}>
              <div>
                <div className={styles.vocabularyReviewWordLabel}>{wordWithArticle}</div>

                <div className={styles.vocabularyReviewTranslation}>{currentLanguageData.translation}</div>
              </div>

              <button
                type='button'
                className={styles.vocabularyReviewAudioButton}
                onClick={playWordAudio}
                aria-label={`Play pronunciation of ${wordWithArticle}`}
              >
                <Volume2
                  size={20}
                  strokeWidth={1.8}
                />
              </button>

              <audio
                ref={wordAudioRef}
                src={wordAudioPath}
                preload='auto'
              />
            </div>

            <div className={styles.vocabularyReviewDetails}>
              {currentWord.gender && <span>{currentWord.gender}</span>}

              <span>{currentWord.partOfSpeech}</span>
            </div>

            {currentSentence && (
              <div className={styles.vocabularyReviewSentence}>
                <div className={styles.vocabularyReviewSentenceHeader}>
                  <span>
                    Sentence {sentenceIndex + 1} of {currentWord.sentences.length}
                  </span>

                  <button
                    type='button'
                    className={`${styles.vocabularyReviewAudioButton} ${styles.vocabularyReviewSentenceAudio}`}
                    onClick={playSentenceAudio}
                    aria-label='Play sentence'
                  >
                    <Volume2
                      size={18}
                      strokeWidth={1.8}
                    />
                  </button>

                  <audio
                    ref={sentenceAudioRef}
                    src={sentenceAudioPath}
                    preload='auto'
                  />
                </div>

                <AnimatePresence mode='wait'>
                  <motion.div
                    key={`${currentWord.word}-${sentenceIndex}`}
                    className={styles.vocabularyReviewSentenceContent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className={styles.vocabularyReviewFrenchSentence}>{currentSentence.text}</p>

                    <p className={styles.vocabularyReviewTranslatedSentence}>{currentSentenceTranslation}</p>
                  </motion.div>
                </AnimatePresence>

                {currentWord.sentences.length > 1 && (
                  <div className={styles.vocabularyReviewSentenceNavigation}>
                    <button
                      type='button'
                      onClick={handlePreviousSentence}
                      aria-label='Previous sentence'
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className={styles.vocabularyReviewSentenceDots}>
                      {currentWord.sentences.map((sentence, index) => (
                        <button
                          key={sentence.id}
                          type='button'
                          className={index === sentenceIndex ? `${styles.vocabularyReviewSentenceDot} ${styles.vocabularyReviewSentenceDotActive}` : styles.vocabularyReviewSentenceDot}
                          onClick={() => setSentenceIndex(index)}
                          aria-label={`Show sentence ${index + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type='button'
                      onClick={handleNextSentence}
                      aria-label='Next sentence'
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className={styles.vocabularyReviewNavigation}>
              <button
                type='button'
                onClick={handlePreviousWord}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <span>
                {currentIndex + 1} / {groupWords.length}
              </span>

              <button
                type='button'
                onClick={handleNextWord}
                disabled={currentIndex >= groupWords.length - 1}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </section>
  );
}
