import type {
  Chapter,
  ContentId,
  Level,
  Question,
  Source,
  Subject,
  Topic,
} from "@abhyas/content";

export interface ContentRepository {
  getLevels(): Promise<readonly Level[]>;
  getSubjects(levelId: ContentId): Promise<readonly Subject[]>;
  getChapters(subjectId: ContentId): Promise<readonly Chapter[]>;
  getSources(chapterId: ContentId): Promise<readonly Source[]>;
  getTopics(chapterId: ContentId): Promise<readonly Topic[]>;
  getQuestionsByTopic(topicId: ContentId): Promise<readonly Question[]>;
  getQuestion(id: ContentId): Promise<Question | null>;
}

export interface QuestionWriteRepository {
  createQuestion(question: Question): Promise<Question>;
  createQuestions(questions: readonly Question[]): Promise<readonly Question[]>;
}

export type { Chapter, ContentId, Level, Question, Source, Subject, Topic } from "@abhyas/content";
