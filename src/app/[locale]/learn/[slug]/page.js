/* src/app/[locale]/learn/[slug]/page.js */

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import learningNotes from "@/components/learn/learningNotes.json";
import learningNotesRegistry from "@/components/learn/learningNotesRegistry";

import styles from "../../page.module.css";

export default async function LearningNotePage({ params }) {
  const { slug } = await params;
  const t = await getTranslations("learn");

  const note = learningNotes.notes.find((item) => item.slug === slug);

  if (!note || note.status !== "available") {
    notFound();
  }

  const NoteComponent = learningNotesRegistry[note.component];

  if (!NoteComponent) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <h1 className='pageTitle'>{note.title}</h1>
      <div className='h1SubHead'>{t("subtitle")}</div>

      <NoteComponent />
    </div>
  );
}
