export type QuizMode =
  | "practice"
  | "flashcard"
  | "timed-exam"
  | "daily-challenge"
  | "psycho";

export type QuestionId = string;

export interface QuizQuestion {
  readonly id: QuestionId;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly correctOptionIndexes: readonly number[];
  readonly explanation?: string;
  readonly difficulty?: "easy" | "medium" | "hard";
}

export interface AnswerAttempt {
  readonly questionId: QuestionId;
  readonly selectedOptionIndexes: readonly number[];
  readonly elapsedMs: number;
}

export interface QuestionResult {
  readonly questionId: QuestionId;
  readonly correct: boolean;
  readonly selectedOptionIndexes: readonly number[];
  readonly elapsedMs: number;
}

export interface QuizResult {
  readonly mode: QuizMode;
  readonly total: number;
  readonly correct: number;
  readonly incorrect: number;
  readonly unanswered: number;
  readonly accuracy: number;
  readonly questions: readonly QuestionResult[];
}

function sameIndexes(
  left: readonly number[],
  right: readonly number[],
): boolean {
  if (left.length !== right.length) return false;
  const a = [...left].sort((x, y) => x - y);
  const b = [...right].sort((x, y) => x - y);
  return a.every((value, index) => value === b[index]);
}

export function evaluateAnswer(
  question: QuizQuestion,
  attempt: AnswerAttempt,
): QuestionResult {
  if (attempt.questionId !== question.id) {
    throw new Error("Answer does not belong to the supplied question.");
  }

  if (!Number.isFinite(attempt.elapsedMs) || attempt.elapsedMs < 0) {
    throw new Error("Elapsed time must be a non-negative finite number.");
  }

  const selected = attempt.selectedOptionIndexes;
  const valid = selected.every(
    (index) => Number.isInteger(index) && index >= 0 && index < question.options.length,
  );

  if (!valid) throw new Error("Answer contains an invalid option index.");

  return {
    questionId: question.id,
    correct: sameIndexes(selected, question.correctOptionIndexes),
    selectedOptionIndexes: [...selected],
    elapsedMs: attempt.elapsedMs,
  };
}

export function calculateQuizResult(
  mode: QuizMode,
  questions: readonly QuizQuestion[],
  attempts: readonly AnswerAttempt[],
): QuizResult {
  const attemptsByQuestion = new Map(attempts.map((attempt) => [attempt.questionId, attempt]));

  const results = questions.map((question) => {
    const attempt = attemptsByQuestion.get(question.id);
    if (!attempt) {
      return {
        questionId: question.id,
        correct: false,
        selectedOptionIndexes: [],
        elapsedMs: 0,
      } satisfies QuestionResult;
    }
    return evaluateAnswer(question, attempt);
  });

  const correct = results.filter((result) => result.correct).length;
  const answered = results.filter((result) => result.elapsedMs > 0 || result.selectedOptionIndexes.length > 0).length;
  const unanswered = results.length - answered;

  return {
    mode,
    total: results.length,
    correct,
    incorrect: answered - correct,
    unanswered,
    accuracy: results.length === 0 ? 0 : correct / results.length,
    questions: results,
  };
}
