import { getAttempts } from "./attempts";

export function getLearningStats() {
  const attempts = getAttempts();
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const byQuestion = new Map<string, { attempts: number; correct: number }>();
  for (const attempt of attempts) {
    const current = byQuestion.get(attempt.questionId) || { attempts: 0, correct: 0 };
    current.attempts += 1;
    if (attempt.correct) current.correct += 1;
    byQuestion.set(attempt.questionId, current);
  }
  return { total: attempts.length, correct, accuracy: attempts.length ? Math.round((correct / attempts.length) * 100) : 0, questionsAttempted: byQuestion.size };
}
