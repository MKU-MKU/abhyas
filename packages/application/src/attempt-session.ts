import type { AnswerAttempt, QuizMode, QuizQuestion, QuizResult } from "@abhyas/quiz-engine";
import { calculateQuizResult } from "@abhyas/quiz-engine";
import type { AttemptSession, AttemptSessionStore } from "./attempt-service";

export async function resumeAttempt(store: AttemptSessionStore, attemptId: string, userId: string): Promise<AttemptSession> {
  const session = await store.get(attemptId);
  if (!session) throw new Error("ATTEMPT_NOT_FOUND");
  if (session.userId !== userId) throw new Error("FORBIDDEN");
  return session;
}

export async function submitAttempt(
  store: AttemptSessionStore,
  session: AttemptSession,
  answers: readonly AnswerAttempt[],
): Promise<QuizResult> {
  if (session.status !== "in_progress") throw new Error("ATTEMPT_ALREADY_SUBMITTED");
  const result = calculateQuizResult(session.mode, session.questions, answers);
  await store.submit({ attemptId: session.id, result });
  return result;
}
