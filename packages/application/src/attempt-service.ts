import type { AuthenticatedUser } from "@abhyas/auth";
import type { AnswerAttempt, QuizMode, QuizQuestion } from "@abhyas/quiz-engine";
import { calculateQuizResult, evaluateAnswer } from "@abhyas/quiz-engine";

export interface AttemptPersistence {
  create(input: { userId: string; mode: QuizMode; questionIds: readonly string[] }): Promise<{ id: string; startedAt: Date }>;
  get(id: string): Promise<{ id: string; userId: string; mode: QuizMode; status: "in_progress" | "submitted"; questionIds: readonly string[]; answers: readonly AnswerAttempt[] } | null>;
  recordAnswer(input: { attemptId: string; questionId: string; selectedOptionIndexes: readonly number[]; isCorrect: boolean; elapsedMs: number }): Promise<void>;
  submit(input: { attemptId: string; score: number; total: number; durationMs: number }): Promise<void>;
}

export interface AttemptQuestionSource {
  getQuestions(ids: readonly string[]): Promise<readonly QuizQuestion[]>;
}

export class AttemptService {
  constructor(private readonly persistence: AttemptPersistence, private readonly questions: AttemptQuestionSource) {}

  async create(user: AuthenticatedUser, input: { mode: QuizMode; questionIds: readonly string[] }) {
    if (!user.id.trim()) throw new Error("USER_REQUIRED");
    if (input.questionIds.length === 0) throw new Error("QUESTION_IDS_REQUIRED");
    const uniqueIds = [...new Set(input.questionIds)];
    const questions = await this.questions.getQuestions(uniqueIds);
    if (questions.length !== uniqueIds.length) throw new Error("QUESTION_NOT_FOUND");
    return this.persistence.create({ userId: user.id, mode: input.mode, questionIds: uniqueIds });
  }

  async get(user: AuthenticatedUser, attemptId: string) {
    const attempt = await this.persistence.get(attemptId);
    if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");
    if (attempt.userId !== user.id) throw new Error("FORBIDDEN");
    return attempt;
  }

  async answer(user: AuthenticatedUser, input: { attemptId: string; questionId: string; selectedOptionIndexes: readonly number[]; elapsedMs: number }) {
    const attempt = await this.get(user, input.attemptId);
    if (attempt.status !== "in_progress") throw new Error("ATTEMPT_ALREADY_SUBMITTED");
    if (!attempt.questionIds.includes(input.questionId)) throw new Error("QUESTION_NOT_IN_ATTEMPT");
    const question = (await this.questions.getQuestions([input.questionId]))[0];
    if (!question) throw new Error("QUESTION_NOT_FOUND");
    const evaluated = evaluateAnswer(question, input);
    await this.persistence.recordAnswer({ ...input, isCorrect: evaluated.correct });
  }

  async submit(user: AuthenticatedUser, attemptId: string) {
    const attempt = await this.get(user, attemptId);
    if (attempt.status !== "in_progress") throw new Error("ATTEMPT_ALREADY_SUBMITTED");
    const questions = await this.questions.getQuestions(attempt.questionIds);
    if (questions.length !== attempt.questionIds.length) throw new Error("QUESTION_NOT_FOUND");
    const result = calculateQuizResult(attempt.mode, questions, attempt.answers);
    await this.persistence.submit({ attemptId, score: result.correct, total: result.total, durationMs: result.totalElapsedMs });
    return result;
  }
}
