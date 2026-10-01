/* src/components/learn/LearningNotesIndex.jsx */

import { Link } from "@/i18n/navigation";

import learningNotes from "./learningNotes.json";

export default function LearningNotesIndex() {
  return (
    <div className='learningNotesGrid'>
      {learningNotes.notes.map((note) => {
        const isAvailable = note.status === "available";

        const cardContent = (
          <>
            <div className='learningNoteHeader'>
              <h3>{note.title}</h3>
            </div>

            <p className='learningNoteDescription'>{note.description}</p>

            <div className='learningNoteMeta'>
              <span>{note.status === "available" ? "Available" : note.status === "comingSoon" ? "Coming Soon" : "Planned"}</span>

              {isAvailable && <span>Last View: —</span>}
            </div>
          </>
        );

        if (isAvailable) {
          return (
            <Link
              key={note.slug}
              href={`/learn/${note.slug}`}
              className='learningNoteCard'
            >
              {cardContent}
            </Link>
          );
        }

        return (
          <div
            key={note.slug}
            className='learningNoteCard learningNoteCardDisabled'
          >
            {cardContent}
          </div>
        );
      })}
    </div>
  );
}
