import type { AnswerAttempt, QuizMode, QuizQuestion, QuizResult } from "@abhyas/quiz-engine";
import { calculateQuizResult } from "@abhyas/quiz-engine";

export interface AttemptStore {
  create(input: { userId: string; mode: QuizMode; questions: readonly QuizQuestion[] }): Promise<{ id: string; startedAt: Date }>;
  recordAnswer(input: { attemptId: string; attempt: AnswerAttempt; correct: boolean }): Promise<void>;
  submit(input: { attemptId: string; result: QuizResult }): Promise<void>;
}

export interface ActiveAttempt {
  readonly id: string;
  readonly userId: string;
  readonly mode: QuizMode;
  readonly questions: readonly QuizQuestion[];
  readonly answers: readonly AnswerAttempt[];
}

export async function submitAttempt(store: AttemptStore, attempt: ActiveAttempt): Promise<QuizResult> {
  const result = calculateQuizResult(attempt.mode, attempt.questions, attempt.answers);
  await store.submit({ attemptId: attempt.id, result });
  return result;
}
