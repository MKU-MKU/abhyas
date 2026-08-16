import { subjects } from "./seed";
import type { Chapter, Subject } from "./types";

export function listSubjects(): Subject[] {
  return subjects;
}

export function findChapter(slug: string): Chapter | undefined {
  for (const subject of subjects) {
    const chapter = subject.chapters.find((item) => item.slug === slug);
    if (chapter) return chapter;
  }
  return undefined;
}

export function getChapterCount(): number {
  return subjects.reduce((total, subject) => total + subject.chapters.length, 0);
}

export function getSubtopicCount(): number {
  return subjects.reduce(
    (total, subject) => total + subject.chapters.reduce((count, chapter) => count + chapter.subtopics.length, 0),
    0,
  );
}
