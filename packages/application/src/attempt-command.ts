export type AttemptMode = "practice" | "timed-exam" | "flashcard" | "daily-challenge" | "psycho";

export interface CreateAttemptCommand {
  userId: string;
  mode: AttemptMode;
  questionIds: string[];
}

export function validateCreateAttemptCommand(input: unknown): CreateAttemptCommand {
  if (!input || typeof input !== "object") throw new Error("Invalid request body.");
  const value = input as Record<string, unknown>;
  if (typeof value.userId !== "string" || value.userId.length < 1) throw new Error("userId is required.");
  const modes: AttemptMode[] = ["practice", "timed-exam", "flashcard", "daily-challenge", "psycho"];
  if (typeof value.mode !== "string" || !modes.includes(value.mode as AttemptMode)) throw new Error("Invalid attempt mode.");
  if (!Array.isArray(value.questionIds) || value.questionIds.length === 0 || value.questionIds.some((id) => typeof id !== "string")) throw new Error("questionIds must be a non-empty string array.");
  return { userId: value.userId, mode: value.mode as AttemptMode, questionIds: value.questionIds };
}
