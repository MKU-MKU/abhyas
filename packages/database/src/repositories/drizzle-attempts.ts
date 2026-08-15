import { and, asc, eq } from "drizzle-orm";
import type { AnswerAttempt, QuizMode, QuizQuestion, QuizResult } from "@abhyas/quiz-engine";
import { quizAttemptAnswers, quizAttempts } from "../schema";

export interface AttemptDatabase {
  insert: (...args: any[]) => any;
  select: (...args: any[]) => any;
  update: (...args: any[]) => any;
}

export interface AttemptPersistence {
  create(input: { userId: string; mode: QuizMode; questions: readonly QuizQuestion[] }): Promise<{ id: string; startedAt: Date }>;
  recordAnswer(input: { attemptId: string; attempt: AnswerAttempt; correct: boolean }): Promise<void>;
  submit(input: { attemptId: string; result: QuizResult }): Promise<void>;
}

export class DrizzleAttemptRepository implements AttemptPersistence {
  constructor(private readonly db: AttemptDatabase) {}

  async create(input: { userId: string; mode: QuizMode; questions: readonly QuizQuestion[] }): Promise<{ id: string; startedAt: Date }> {
    const [attempt] = await this.db.insert(quizAttempts).values({
      userId: input.userId,
      mode: input.mode,
      status: "in_progress",
      total: input.questions.length,
      metadata: { questionIds: input.questions.map((question) => question.id) },
    }).returning({ id: quizAttempts.id, startedAt: quizAttempts.startedAt });

    if (!attempt) throw new Error("Unable to create quiz attempt.");
    return attempt;
  }

  async recordAnswer(input: { attemptId: string; attempt: AnswerAttempt; correct: boolean }): Promise<void> {
    await this.db.insert(quizAttemptAnswers).values({
      attemptId: input.attemptId,
      questionId: input.attempt.questionId,
      selectedOptionIndexes: [...input.attempt.selectedOptionIndexes],
      isCorrect: input.correct,
      elapsedMs: input.attempt.elapsedMs,
    }).onConflictDoUpdate({
      target: [quizAttemptAnswers.attemptId, quizAttemptAnswers.questionId],
      set: {
        selectedOptionIndexes: [...input.attempt.selectedOptionIndexes],
        isCorrect: input.correct,
        elapsedMs: input.attempt.elapsedMs,
        answeredAt: new Date(),
      },
    });
  }

  async submit(input: { attemptId: string; result: QuizResult }): Promise<void> {
    const updated = await this.db.update(quizAttempts).set({
      status: "submitted",
      submittedAt: new Date(),
      score: input.result.correct,
      total: input.result.total,
      durationMs: input.result.totalElapsedMs,
    }).where(and(eq(quizAttempts.id, input.attemptId), eq(quizAttempts.status, "in_progress"))).returning({ id: quizAttempts.id });

    if (updated.length === 0) throw new Error("Quiz attempt is missing or already submitted.");
  }

  async getAnswers(attemptId: string): Promise<readonly AnswerAttempt[]> {
    const rows = await this.db.select().from(quizAttemptAnswers).where(eq(quizAttemptAnswers.attemptId, attemptId)).orderBy(asc(quizAttemptAnswers.answeredAt));
    return rows.map((row: any) => ({
      questionId: row.questionId,
      selectedOptionIndexes: row.selectedOptionIndexes ?? [],
      elapsedMs: row.elapsedMs,
    }));
  }
}
