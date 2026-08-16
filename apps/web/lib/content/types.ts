export type QuestionOption = {
  id: string;
  label: string;
  isCorrect?: boolean;
};

export type Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  answer: string;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  marks?: number;
  source?: string;
};

export type Subtopic = {
  id: string;
  code: string;
  name: string;
  slug: string;
  questionCount: number;
  sourceId?: string;
};

export type Chapter = {
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  subtopics: Subtopic[];
};

export type Subject = {
  id: string;
  name: string;
  slug: string;
  chapters: Chapter[];
};
