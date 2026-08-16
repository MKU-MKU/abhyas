import type { AnswerAttempt, QuizMode, QuizQuestion, QuizResult } from "@abhyas/quiz-engine";
import type { AttemptPersistence } from "./repositories/drizzle-attempts";

export interface AttemptSession {
  readonly id: string;
  readonly userId: string;
  readonly mode: QuizMode;
  readonly questions: readonly QuizQuestion[];
  readonly answers: readonly AnswerAttempt[];
  readonly status: "in_progress" | "submitted";
}

export interface AttemptSessionStore {
  create(input: { userId: string; mode: QuizMode; questions: readonly QuizQuestion[] }): Promise<{ id: string; startedAt: Date }>;
  get(id: string): Promise<AttemptSession | null>;
  recordAnswer(input: { attemptId: string; attempt: AnswerAttempt; correct: boolean }): Promise<void>;
  submit(input: { attemptId: string; result: QuizResult }): Promise<void>;
}

export class AttemptService {
  constructor(private readonly store: AttemptSessionStore) {}

  start(userId: string, mode: QuizMode, questions: readonly QuizQuestion[]) {
    if (!userId) throw new Error("Authenticated user is required.");
    if (questions.length === 0) throw new Error("An attempt requires at least one question.");
    return this.store.create({ userId, mode, questions });
  }

  async saveAnswer(session: AttemptSession, attempt: AnswerAttempt, correct: boolean): Promise<void> {
    if (session.status !== "in_progress") throw new Error("Attempt is already submitted.");
    if (session.questions.every((question) => question.id !== attempt.questionId)) throw new Error("Question is not part of this attempt.");
    await this.store.recordAnswer({ attemptId: session.id, attempt, correct });
  }

  async finish(session: AttemptSession, result: QuizResult): Promise<void> {
    if (session.status !== "in_progress") throw new Error("Attempt is already submitted.");
    await this.store.submit({ attemptId: session.id, result });
  }
}

export type { AttemptPersistence };
