import type { QuizMode } from "@abhyas/quiz-engine";

export interface CreateAttemptBody {
  readonly mode: QuizMode;
  readonly questionIds: readonly string[];
}

export function parseCreateAttemptBody(value: unknown): CreateAttemptBody {
  if (!value || typeof value !== "object") throw new Error("INVALID_BODY");
  const body = value as Record<string, unknown>;
  const mode = body.mode;
  const questionIds = body.questionIds;
  if (typeof mode !== "string") throw new Error("MODE_REQUIRED");
  if (!Array.isArray(questionIds) || questionIds.length === 0 || !questionIds.every((id) => typeof id === "string" && id.length > 0)) {
    throw new Error("QUESTION_IDS_REQUIRED");
  }
  return { mode: mode as QuizMode, questionIds };
}
