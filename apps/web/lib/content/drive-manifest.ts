export type DriveSource = {
  level: string;
  chapterCode: string;
  chapterName: string;
  book: string;
  subtopic: string;
  fileId: string;
};

export const DRIVE_SOURCES: DriveSource[] = REPLACE_ME;

export function sourcesForChapter(level: string, chapterCode: string): DriveSource[] {
  return DRIVE_SOURCES.filter((source) => source.level === level && source.chapterCode === chapterCode);
}
