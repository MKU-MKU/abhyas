export type ContentId = string;

export type Difficulty = "easy" | "medium" | "hard";

export interface Level {
  readonly id: ContentId;
  readonly name: string;
  readonly code: string;
  readonly sortOrder: number;
}

export interface Subject {
  readonly id: ContentId;
  readonly levelId: ContentId;
  readonly name: string;
  readonly code: string;
  readonly sortOrder: number;
}

export interface Chapter {
  readonly id: ContentId;
  readonly subjectId: ContentId;
  readonly name: string;
  readonly code: string;
  readonly sortOrder: number;
}

export interface Source {
  readonly id: ContentId;
  readonly chapterId: ContentId;
  readonly title: string;
  readonly author?: string;
  readonly edition?: string;
  readonly sortOrder: number;
}

export interface Topic {
  readonly id: ContentId;
  readonly chapterId: ContentId;
  readonly name: string;
  readonly sortOrder: number;
}

export interface QuestionOption {
  readonly id: ContentId;
  readonly text: string;
  readonly sortOrder: number;
}

export interface Question {
  readonly id: ContentId;
  readonly version: number;
  readonly chapterId: ContentId;
  readonly sourceId?: ContentId;
  readonly topicId?: ContentId;
  readonly prompt: string;
  readonly options: readonly QuestionOption[];
  readonly correctOptionIds: readonly ContentId[];
  readonly explanation?: string;
  readonly difficulty: Difficulty;
  readonly tags: readonly string[];
  readonly isActive: boolean;
}

export interface ContentPath {
  readonly level: Level;
  readonly subject: Subject;
  readonly chapter: Chapter;
  readonly source?: Source;
  readonly topic?: Topic;
}

export interface QuestionImportRecord {
  readonly externalId?: string;
  readonly path: ContentPath;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly correctOptionIndexes: readonly number[];
  readonly explanation?: string;
  readonly difficulty?: Difficulty;
  readonly tags?: readonly string[];
}

export function validateQuestionImport(record: QuestionImportRecord): void {
  if (!record.prompt.trim()) throw new Error("Question prompt cannot be empty.");
  if (record.options.length < 2) throw new Error("A question needs at least two options.");

  const uniqueIndexes = new Set(record.correctOptionIndexes);
  if (uniqueIndexes.size !== record.correctOptionIndexes.length) {
    throw new Error("Correct option indexes must be unique.");
  }

  for (const index of record.correctOptionIndexes) {
    if (!Number.isInteger(index) || index < 0 || index >= record.options.length) {
      throw new Error("Correct option index is outside the available options.");
    }
  }
}

export function normalizeQuestionImport(
  record: QuestionImportRecord,
  ids: readonly ContentId[],
): Question {
  validateQuestionImport(record);
  if (ids.length !== record.options.length) {
    throw new Error("The number of generated option IDs must match options.");
  }

  return {
    id: record.externalId ?? crypto.randomUUID(),
    version: 1,
    chapterId: record.path.chapter.id,
    ...(record.path.source ? { sourceId: record.path.source.id } : {}),
    ...(record.path.topic ? { topicId: record.path.topic.id } : {}),
    prompt: record.prompt.trim(),
    options: record.options.map((text, index) => ({
      id: ids[index]!,
      text: text.trim(),
      sortOrder: index,
    })),
    correctOptionIds: record.correctOptionIndexes.map((index) => ids[index]!),
    ...(record.explanation?.trim() ? { explanation: record.explanation.trim() } : {}),
    difficulty: record.difficulty ?? "medium",
    tags: [...(record.tags ?? [])],
    isActive: true,
  };
}
