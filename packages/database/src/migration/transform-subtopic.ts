import { randomUUID } from "node:crypto";
import type { Chapter, Level, Question, Source, Subject, Topic } from "@abhyas/content";

/**
 * Shape of the source-of-truth JSON files exported from the old
 * Google Drive "chapterData.js" question bank (one file per subtopic).
 *
 * Example: "4.5 LEVELING.json"
 * {
 *   "code": "4.5",
 *   "subtopic": "LEVELING",
 *   "topic": "Leveling: principle of leveling, ...",
 *   "source": "survey101-175 / 175-250 / ... (merged from old LEVEL 7 archive)",
 *   "questions": [
 *     { "q": "...", "options": ["...", "..."], "correct": 1, "explain": "..." }
 *   ]
 * }
 */
export interface RawSubtopicQuestion {
  readonly q: string;
  readonly options: readonly string[];
  readonly correct: number;
  readonly explain?: string;
}

export interface RawSubtopicFile {
  readonly code: string;
  readonly subtopic: string;
  readonly topic?: string;
  readonly source?: string;
  readonly questions: readonly RawSubtopicQuestion[];
}

export interface TransformContext {
  readonly level: Level;
  readonly subject: Subject;
  readonly chapter: Chapter;
  readonly source: Source;
}

export interface TransformResult {
  readonly topic: Topic;
  readonly questions: readonly Question[];
  readonly warnings: readonly string[];
}

/**
 * Strips the leading "163. " style numbering that the old Drive files
 * embed directly into the question text, since the new schema keeps
 * prompt text clean and numbering is a rendering concern, not data.
 */
function stripLeadingNumber(text: string): string {
  return text.replace(/^\s*\d+\.\s*/, "").trim();
}

export function transformSubtopic(raw: RawSubtopicFile, ctx: TransformContext, sortOrder: number): TransformResult {
  const warnings: string[] = [];

  const topic: Topic = {
    id: randomUUID(),
    chapterId: ctx.chapter.id,
    name: `${raw.code} ${raw.subtopic}`.trim(),
    sortOrder,
  };

  const questions: Question[] = raw.questions.map((rq, index) => {
    if (rq.correct < 0 || rq.correct >= rq.options.length) {
      warnings.push(`Question ${index} in ${raw.code} ${raw.subtopic} has an out-of-range correct index (${rq.correct}); defaulting to 0.`);
    }
    const correctIndex = rq.correct >= 0 && rq.correct < rq.options.length ? rq.correct : 0;

    const options = rq.options.map((text, optIndex) => ({
      id: randomUUID(),
      text,
      sortOrder: optIndex,
    }));

    return {
      id: randomUUID(),
      version: 1,
      chapterId: ctx.chapter.id,
      sourceId: ctx.source.id,
      topicId: topic.id,
      prompt: stripLeadingNumber(rq.q),
      options,
      correctOptionIds: [options[correctIndex]!.id],
      ...(rq.explain ? { explanation: rq.explain } : {}),
      difficulty: "medium" as const,
      tags: [],
      isActive: true,
    };
  });

  return { topic, questions, warnings };
}
