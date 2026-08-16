import type { AttemptPersistence } from "./attempt-persistence";
import { assertSameUser } from "./authorization";

export async function loadOwnAttempt(store: AttemptPersistence, actorUserId: string, attemptId: string) {
  const attempt = await store.get(attemptId);
  if (!attempt) return null;
  assertSameUser({ userId: actorUserId, roles: [] }, attempt.userId);
  return attempt;
}

export async function saveOwnAnswer(store: AttemptPersistence, actorUserId: string, input: { attemptId: string; questionId: string; selectedOptionIndexes: readonly number[]; isCorrect: boolean; elapsedMs: number }) {
  const attempt = await loadOwnAttempt(store, actorUserId, input.attemptId);
  if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");
  if (attempt.status !== "in_progress") throw new Error("ATTEMPT_ALREADY_SUBMITTED");
  if (!attempt.questionIds.includes(input.questionId)) throw new Error("QUESTION_NOT_IN_ATTEMPT");
  await store.recordAnswer(input);
}
