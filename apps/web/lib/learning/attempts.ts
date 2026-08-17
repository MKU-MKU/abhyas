export type AttemptMode = "practice" | "exam";

export type AttemptRecord = {
  id: string;
  sessionId: string;
  questionId: string;
  mode: AttemptMode;
  selectedAnswer: string;
  correctAnswer: string;
  correct: boolean;
  marks: number;
  timestamp: string;
};

const ATTEMPTS_KEY = "abhyas:attempts:v1";

function read(): AttemptRecord[] {
  try {
    const value = JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function recordAttempt(input: Omit<AttemptRecord, "id" | "timestamp">): AttemptRecord {
  const attempt: AttemptRecord = {
    ...input,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  const attempts = [...read(), attempt].slice(-5000);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  return attempt;
}

export function getAttempts(): AttemptRecord[] { return read(); }

export function getWrongQuestionIds(): Set<string> {
  const latest = new Map<string, AttemptRecord>();
  for (const attempt of read()) latest.set(attempt.questionId, attempt);
  return new Set([...latest.values()].filter((attempt) => !attempt.correct).map((attempt) => attempt.questionId));
}

export function getProgressStats() {
  const attempts = read();
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return {
    total: attempts.length,
    correct,
    accuracy: attempts.length ? Math.round((correct / attempts.length) * 100) : 0,
  };
}
