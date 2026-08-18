import type { Question } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_ABHYAS_API_URL || "";

export type ContentSource = {
  level: string;
  chapterCode: string;
  chapterName: string;
  book: string;
  subtopic: string;
};

export type ChapterTopic = {
  name: string;
  questionCount: number;
};

export type ChapterSummary = {
  level: string;
  chapterCode: string;
  chapterName: string;
  questionCount: number;
  topics: ChapterTopic[];
};

// Static manifest of chapters with real, seeded question content.
// Mirrors the numeric chapter codes from the original chapterData.js
// so the UI (chapter picker, etc.) doesn't need to change shape —
// only where the actual question data is fetched from.
export const CONTENT_SOURCES: ContentSource[] = [
  { level: "level7", chapterCode: "1", chapterName: "Structural Engineering", book: "Abhyas", subtopic: "" },
  { level: "level7", chapterCode: "2", chapterName: "Engineering Survey", book: "Abhyas", subtopic: "" },
  { level: "level7", chapterCode: "3", chapterName: "Construction Materials", book: "Abhyas", subtopic: "" },
  { level: "level7", chapterCode: "4", chapterName: "Concrete Technology", book: "Abhyas", subtopic: "" },
  { level: "level7", chapterCode: "7", chapterName: "Estimating & Costing", book: "Abhyas", subtopic: "" },
  { level: "level7", chapterCode: "8", chapterName: "Engineering Drawing", book: "Abhyas", subtopic: "" },
  { level: "level7", chapterCode: "9", chapterName: "Engineering Economics", book: "Abhyas", subtopic: "" },
];

async function apiGet<T>(path: string, params: Record<string, string>): Promise<T> {
  if (!API_BASE) throw new Error("Content API URL is not configured (NEXT_PUBLIC_ABHYAS_API_URL).");
  const url = new URL(path, API_BASE);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Content API returned HTTP ${response.status}.`);
  }
  return (await response.json()) as T;
}

export async function loadChapterQuestions(level = "level7", chapterCode = "2"): Promise<Question[]> {
  return apiGet<Question[]>("/questions", { level, chapterCode });
}

export async function loadQuestions(source: ContentSource): Promise<Question[]> {
  const params: Record<string, string> = { level: source.level, chapterCode: source.chapterCode };
  if (source.subtopic) params.subtopic = source.subtopic;
  return apiGet<Question[]>("/questions", params);
}

export async function loadChapters(level = "level7"): Promise<ChapterSummary[]> {
  return apiGet<ChapterSummary[]>("/chapters", { level });
}
