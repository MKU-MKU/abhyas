import type { AnswerAttempt, QuizMode, QuizQuestion } from "@abhyas/quiz-engine";

export interface CreateAttemptCommand {
  readonly userId: string;
  readonly mode: QuizMode;
  readonly questions: readonly QuizQuestion[];
}

export interface RecordAnswerCommand {
  readonly userId: string;
  readonly attemptId: string;
  readonly attempt: AnswerAttempt;
}

export interface AttemptAuthorization {
  canRead(userId: string, ownerId: string): boolean;
  canWrite(userId: string, ownerId: string): boolean;
}

export const sameUserAuthorization: AttemptAuthorization = {
  canRead: (userId, ownerId) => userId === ownerId,
  canWrite: (userId, ownerId) => userId === ownerId,
};

export function assertAttemptOwner(userId: string, ownerId: string): void {
  if (!sameUserAuthorization.canRead(userId, ownerId)) {
    throw new Error("ATTEMPT_FORBIDDEN");
  }
}

export function assertCreateAttempt(command: CreateAttemptCommand): void {
  if (!command.userId.trim()) throw new Error("USER_REQUIRED");
  if (command.questions.length === 0) throw new Error("QUESTIONS_REQUIRED");
}

export function assertRecordAnswer(command: RecordAnswerCommand): void {
  if (!command.userId.trim()) throw new Error("USER_REQUIRED");
  if (!command.attemptId.trim()) throw new Error("ATTEMPT_REQUIRED");
  if (!Number.isFinite(command.attempt.elapsedMs) || command.attempt.elapsedMs < 0) {
    throw new Error("INVALID_ELAPSED_TIME");
  }
}
