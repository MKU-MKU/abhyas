import type { ContentRepository } from "../index";
import type { Chapter, ContentId, Level, Question, Source, Subject, Topic } from "@abhyas/content";

export class InMemoryContentRepository implements ContentRepository {
  constructor(
    private readonly data: {
      levels?: readonly Level[];
      subjects?: readonly Subject[];
      chapters?: readonly Chapter[];
      sources?: readonly Source[];
      topics?: readonly Topic[];
      questions?: readonly Question[];
    } = {},
  ) {}

  async getLevels(): Promise<readonly Level[]> { return this.data.levels ?? []; }

  async getSubjects(levelId: ContentId): Promise<readonly Subject[]> {
    return (this.data.subjects ?? []).filter((item) => item.levelId === levelId);
  }

  async getChapters(subjectId: ContentId): Promise<readonly Chapter[]> {
    return (this.data.chapters ?? []).filter((item) => item.subjectId === subjectId);
  }

  async getSources(chapterId: ContentId): Promise<readonly Source[]> {
    return (this.data.sources ?? []).filter((item) => item.chapterId === chapterId);
  }

  async getTopics(chapterId: ContentId): Promise<readonly Topic[]> {
    return (this.data.topics ?? []).filter((item) => item.chapterId === chapterId);
  }

  async getQuestionsByTopic(topicId: ContentId): Promise<readonly Question[]> {
    return (this.data.questions ?? []).filter((item) => item.topicId === topicId && item.isActive);
  }

  async getQuestion(id: ContentId): Promise<Question | null> {
    return (this.data.questions ?? []).find((item) => item.id === id && item.isActive) ?? null;
  }
}
