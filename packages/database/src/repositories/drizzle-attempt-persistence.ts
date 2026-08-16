import type { AttemptPersistence } from "@abhyas/application";
import { quizAttempts, quizAttemptAnswers } from "../schema";
import { and, eq } from "drizzle-orm";
import type { Database } from "../client";

export class DrizzleAttemptPersistence implements AttemptPersistence {
  constructor(private readonly db: Database) {}

  async create(input: { userId: string; mode: string; questionIds: readonly string[] }) {
    const [attempt] = await this.db.insert(quizAttempts).values({ userId: input.userId, mode: input.mode, metadata: { questionIds: [...input.questionIds] } }).returning({ id: quizAttempts.id, startedAt: quizAttempts.startedAt });
    if (!attempt) throw new Error("ATTEMPT_CREATE_FAILED");
    return attempt;
  }

  async get(id: string) {
    const [attempt] = await this.db.select().from(quizAttempts).where(eq(quizAttempts.id, id)).limit(1);
    if (!attempt) return null;
    const answers = await this.db.select().from(quizAttemptAnswers).where(eq(quizAttemptAnswers.attemptId, id));
    const questionIds = Array.isArray(attempt.metadata?.questionIds) ? attempt.metadata.questionIds.filter((value): value is string => typeof value === "string") : [];
    return { id: attempt.id, userId: attempt.userId, mode: attempt.mode, status: attempt.status as "in_progress" | "submitted", questionIds, answers: answers.map((answer) => ({ questionId: answer.questionId, selectedOptionIndexes: answer.selectedOptionIndexes, elapsedMs: answer.elapsedMs })) };
  }

  async recordAnswer(input: { attemptId: string; questionId: string; selectedOptionIndexes: readonly number[]; isCorrect: boolean; elapsedMs: number }) {
    await this.db.insert(quizAttemptAnswers).values({ attemptId: input.attemptId, questionId: input.questionId, selectedOptionIndexes: [...input.selectedOptionIndexes], isCorrect: input.isCorrect ? 1 : 0, elapsedMs: input.elapsedMs }).onConflictDoUpdate({ target: [quizAttemptAnswers.attemptId, quizAttemptAnswers.questionId], set: { selectedOptionIndexes: [...input.selectedOptionIndexes], isCorrect: input.isCorrect ? 1 : 0, elapsedMs: input.elapsedMs } });
  }

  async submit(input: { attemptId: string; score: number; total: number; durationMs: number }) {
    await this.db.update(quizAttempts).set({ status: "submitted", submittedAt: new Date(), score: input.score, total: input.total, durationMs: input.durationMs }).where(and(eq(quizAttempts.id, input.attemptId), eq(quizAttempts.status, "in_progress")));
  }
}
