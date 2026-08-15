import type { ContentId, Question } from "@abhyas/content";
import type { ContentRepository } from "@abhyas/database";
import type { QuizMode, QuizQuestion } from "@abhyas/quiz-engine";

export interface QuizPreparationRequest {
  readonly topicId: ContentId;
  readonly mode: QuizMode;
  readonly limit?: number;
}

export interface PreparedQuiz {
  readonly mode: QuizMode;
  readonly questions: readonly QuizQuestion[];
}

function toQuizQuestion(question: Question): QuizQuestion {
  const correctOptionIndexes = question.options
    .map((option, index) => question.correctOptionIds.includes(option.id) ? index : -1)
    .filter((index) => index >= 0);

  return {
    id: question.id,
    prompt: question.prompt,
    options: question.options.map((option) => option.text),
    correctOptionIndexes,
    ...(question.explanation ? { explanation: question.explanation } : {}),
    difficulty: question.difficulty,
  };
}

export async function prepareQuiz(
  repository: ContentRepository,
  request: QuizPreparationRequest,
): Promise<PreparedQuiz> {
  const questions = await repository.getQuestionsByTopic(request.topicId);
  const selected = request.limit && request.limit > 0
    ? questions.slice(0, request.limit)
    : questions;

  return {
    mode: request.mode,
    questions: selected.map(toQuizQuestion),
  };
}
