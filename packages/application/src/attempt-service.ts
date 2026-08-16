import type { AuthenticatedUser } from "@abhyas/auth";

export interface AttemptPersistence {
  create(input: { userId: string; mode: string; questionIds: readonly string[] }): Promise<{ id: string; startedAt: Date }>;
  get(id: string): Promise<{ id: string; userId: string; mode: string; status: "in_progress" | "submitted"; questionIds: readonly string[]; answers: readonly { questionId: string; selectedOptionIndexes: readonly number[]; elapsedMs: number }[] } | null>;
  recordAnswer(input: { attemptId: string; questionId: string; selectedOptionIndexes: readonly number[]; isCorrect: boolean; elapsedMs: number }): Promise<void>;
  submit(input: { attemptId: string; score: number; total: number; durationMs: number }): Promise<void>;
}

export class AttemptService {
  constructor(private readonly persistence: AttemptPersistence) {}

  create(user: AuthenticatedUser, input: { mode: string; questionIds: readonly string[] }) {
    if (input.questionIds.length === 0) throw new Error("QUESTION_IDS_REQUIRED");
    return this.persistence.create({ userId: user.id, mode: input.mode, questionIds: input.questionIds });
  }

  async get(user: AuthenticatedUser, attemptId: string) {
    const attempt = await this.persistence.get(attemptId);
    if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");
    if (attempt.userId !== user.id) throw new Error("FORBIDDEN");
    return attempt;
  }

  async answer(user: AuthenticatedUser, input: { attemptId: string; questionId: string; selectedOptionIndexes: readonly number[]; isCorrect: boolean; elapsedMs: number }) {
    const attempt = await this.get(user, input.attemptId);
    if (attempt.status !== "in_progress") throw new Error("ATTEMPT_ALREADY_SUBMITTED");
    if (!attempt.questionIds.includes(input.questionId)) throw new Error("QUESTION_NOT_IN_ATTEMPT");
    await this.persistence.recordAnswer(input);
  }

  async submit(user: AuthenticatedUser, input: { attemptId: string; score: number; total: number; durationMs: number }) {
    const attempt = await this.get(user, input.attemptId);
    if (attempt.status !== "in_progress") throw new Error("ATTEMPT_ALREADY_SUBMITTED");
    if (input.total < 1 || input.score < 0 || input.score > input.total) throw new Error("INVALID_RESULT");
    await this.persistence.submit(input);
  }
}
