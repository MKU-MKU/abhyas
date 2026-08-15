import type { QuizResult } from "@abhyas/quiz-engine";

export interface ProgressSnapshot {
  readonly attempts: number;
  readonly questionsAnswered: number;
  readonly questionsCorrect: number;
  readonly accuracy: number;
  readonly totalStudyTimeMs: number;
}

export function aggregateProgress(results: readonly QuizResult[]): ProgressSnapshot {
  const attempts = results.length;
  const questionsAnswered = results.reduce((sum, result) => sum + result.total - result.unanswered, 0);
  const questionsCorrect = results.reduce((sum, result) => sum + result.correct, 0);
  const totalQuestions = results.reduce((sum, result) => sum + result.total, 0);
  const totalStudyTimeMs = results.reduce((sum, result) => sum + result.totalElapsedMs, 0);

  return {
    attempts,
    questionsAnswered,
    questionsCorrect,
    accuracy: totalQuestions === 0 ? 0 : questionsCorrect / totalQuestions,
    totalStudyTimeMs,
  };
}
