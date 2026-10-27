/* src/app/[locale]/practice/[category]/[topic]/SentenceCarousel.jsx */

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./SentenceCarousel.module.css";

export default function SentenceCarousel({ sentences = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!sentences.length) {
    return null;
  }

  const currentSentence = sentences[currentIndex];

  function handlePrevious() {
    setCurrentIndex((previous) => Math.max(0, previous - 1));
  }

  function handleNext() {
    setCurrentIndex((previous) => Math.min(sentences.length - 1, previous + 1));
  }

  return (
    <section
      className={styles.carousel}
      aria-label='Example sentences'
    >
      <div className={styles.content}>
        <AnimatePresence
          mode='wait'
          initial={false}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className={styles.exampleSentence}>{currentSentence.text}</div>

            {currentSentence.translation && <p className={styles.translation}>{currentSentence.translation}</p>}

            {currentSentence.explanation?.length > 0 && (
              <table className={styles.explanationTable}>
                <tbody>
                  {currentSentence.explanation.map((item, index) => (
                    <tr key={index}>
                      <td>{item.french}</td>
                      <td>{item.english}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.controls}>
        <button
          type='button'
          className={styles.carouselArrow}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label='Previous sentence'
        >
          <ChevronLeft size={20} />
        </button>

        <div
          className={styles.dots}
          aria-label='Choose an example'
        >
          {sentences.map((sentence, index) => (
            <button
              key={sentence.id ?? index}
              type='button'
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to example ${index + 1}`}
              aria-current={index === currentIndex ? "step" : undefined}
            />
          ))}
        </div>

        <button
          type='button'
          className={styles.carouselArrow}
          onClick={handleNext}
          disabled={currentIndex === sentences.length - 1}
          aria-label='Next sentence'
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
