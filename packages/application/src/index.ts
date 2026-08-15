import type { Chapter, ContentId, Level, Question, Source, Subject, Topic } from "@abhyas/content";
import type { ContentRepository } from "@abhyas/database";

export interface ContentDiscovery {
  listLevels(): Promise<readonly Level[]>;
  listSubjects(levelId: ContentId): Promise<readonly Subject[]>;
  listChapters(subjectId: ContentId): Promise<readonly Chapter[]>;
  listSources(chapterId: ContentId): Promise<readonly Source[]>;
  listTopics(chapterId: ContentId): Promise<readonly Topic[]>;
  listQuestions(topicId: ContentId): Promise<readonly Question[]>;
  getQuestion(questionId: ContentId): Promise<Question | null>;
}

export class ContentService implements ContentDiscovery {
  constructor(private readonly repository: ContentRepository) {}

  listLevels() { return this.repository.getLevels(); }
  listSubjects(levelId: ContentId) { return this.repository.getSubjects(levelId); }
  listChapters(subjectId: ContentId) { return this.repository.getChapters(subjectId); }
  listSources(chapterId: ContentId) { return this.repository.getSources(chapterId); }
  listTopics(chapterId: ContentId) { return this.repository.getTopics(chapterId); }
  listQuestions(topicId: ContentId) { return this.repository.getQuestionsByTopic(topicId); }
  getQuestion(questionId: ContentId) { return this.repository.getQuestion(questionId); }
}
