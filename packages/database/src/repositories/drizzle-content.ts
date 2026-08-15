import { and, asc, eq } from "drizzle-orm";
import type { ContentRepository } from "../index";
import type { Chapter, ContentId, Level, Question, QuestionOption, Source, Subject, Topic } from "@abhyas/content";
import { chapters, levels, questionOptions, questions, sources, subjects, topics } from "../schema";

export interface DrizzleDatabase {
  select: (...args: any[]) => any;
}

export class DrizzleContentRepository implements ContentRepository {
  constructor(private readonly db: DrizzleDatabase) {}

  async getLevels(): Promise<readonly Level[]> {
    const rows = await this.db.select().from(levels).orderBy(asc(levels.sortOrder));
    return rows.map((row: any) => ({ id: row.id, code: row.code, name: row.name, sortOrder: row.sortOrder }));
  }

  async getSubjects(levelId: ContentId): Promise<readonly Subject[]> {
    const rows = await this.db.select().from(subjects).where(eq(subjects.levelId, levelId)).orderBy(asc(subjects.sortOrder));
    return rows.map((row: any) => ({ id: row.id, levelId: row.levelId, code: row.code, name: row.name, sortOrder: row.sortOrder }));
  }

  async getChapters(subjectId: ContentId): Promise<readonly Chapter[]> {
    const rows = await this.db.select().from(chapters).where(eq(chapters.subjectId, subjectId)).orderBy(asc(chapters.sortOrder));
    return rows.map((row: any) => ({ id: row.id, subjectId: row.subjectId, code: row.code, name: row.name, sortOrder: row.sortOrder }));
  }

  async getSources(chapterId: ContentId): Promise<readonly Source[]> {
    const rows = await this.db.select().from(sources).where(eq(sources.chapterId, chapterId)).orderBy(asc(sources.sortOrder));
    return rows.map((row: any) => ({ id: row.id, chapterId: row.chapterId, title: row.title, ...(row.author ? { author: row.author } : {}), ...(row.edition ? { edition: row.edition } : {}), sortOrder: row.sortOrder }));
  }

  async getTopics(chapterId: ContentId): Promise<readonly Topic[]> {
    const rows = await this.db.select().from(topics).where(eq(topics.chapterId, chapterId)).orderBy(asc(topics.sortOrder));
    return rows.map((row: any) => ({ id: row.id, chapterId: row.chapterId, name: row.name, sortOrder: row.sortOrder }));
  }

  async getQuestionsByTopic(topicId: ContentId): Promise<readonly Question[]> {
    const rows = await this.db.select().from(questions).where(and(eq(questions.topicId, topicId), eq(questions.isActive, true))).orderBy(asc(questions.createdAt));
    return this.withOptions(rows);
  }

  async getQuestion(id: ContentId): Promise<Question | null> {
    const rows = await this.db.select().from(questions).where(and(eq(questions.id, id), eq(questions.isActive, true)));
    if (rows.length === 0) return null;
    const result = await this.withOptions(rows);
    return result[0] ?? null;
  }

  private async withOptions(rows: readonly any[]): Promise<readonly Question[]> {
    if (rows.length === 0) return [];
    const output: Question[] = [];
    for (const row of rows) {
      const options = await this.db.select().from(questionOptions).where(eq(questionOptions.questionId, row.id)).orderBy(asc(questionOptions.sortOrder));
      output.push({
        id: row.id,
        version: row.version,
        chapterId: row.chapterId,
        ...(row.sourceId ? { sourceId: row.sourceId } : {}),
        ...(row.topicId ? { topicId: row.topicId } : {}),
        prompt: row.prompt,
        options: options.map((option: QuestionOption) => ({ id: option.id, text: option.text, sortOrder: option.sortOrder })),
        correctOptionIds: options.filter((option: any) => option.isCorrect).map((option: any) => option.id),
        ...(row.explanation ? { explanation: row.explanation } : {}),
        difficulty: row.difficulty,
        tags: row.tags ?? [],
        isActive: row.isActive,
      });
    }
    return output;
  }
}
