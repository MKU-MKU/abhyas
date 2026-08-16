import type { Question, QuestionOption } from "./types";
import { DRIVE_SOURCES, type DriveSource } from "./drive-manifest";

const CONTENT_API =
  process.env.NEXT_PUBLIC_ABHYAS_CONTENT_API ||
  "https://script.google.com/macros/s/AKfycbwAhfyQm7NvxaNjgRm3oC9SdKwrfKNfjgDd-J0nYjYAhsU1d2PP2JfyMI30ol9AGSatyg/exec";

const CACHE_PREFIX = "abhyas:q:";

type RawQuestion = Record<string, unknown>;

function normalize(raw: unknown, source: DriveSource): Question[] {
  if (raw && typeof raw === "object" && !Array.isArray(raw) && (raw as RawQuestion).success === false) {
    throw new Error(String((raw as RawQuestion).error || "Question source returned an error."));
  }

  let items: unknown = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
      ? (raw as RawQuestion).questions ||
        (raw as RawQuestion).data ||
        (raw as RawQuestion).quiz ||
        (raw as RawQuestion).items ||
        (raw as RawQuestion).result
      : null;

  if (!Array.isArray(items) && raw && typeof raw === "object") {
    const values = Object.values(raw as RawQuestion);
    if (values.length && values[0] && typeof values[0] === "object") items = values;
  }

  if (!Array.isArray(items)) return [];

  return items.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const q = item as RawQuestion;
    const prompt = String(q.q || q.question || q.Question || q.stem || q.ques || q.text || "").trim();
    if (!prompt) return [];

    let rawOptions = q.options || q.opts || q.choices || q.Options;
    if (!Array.isArray(rawOptions)) {
      rawOptions = [q.a || q.A, q.b || q.B, q.c || q.C, q.d || q.D, q.e || q.E].filter(Boolean);
    }
    if (!Array.isArray(rawOptions) || rawOptions.length < 2) return [];

    let correct = q.correct ?? q.answer ?? q.ans ?? q.Answer;
    if (typeof correct === "string" && /^[a-e]$/i.test(correct.trim())) {
      correct = "abcde".indexOf(correct.trim().toLowerCase());
    }

    const options: QuestionOption[] = rawOptions.map((option, optionIndex) => ({
      id: String(optionIndex),
      label: String(option),
      isCorrect: String(correct) === String(optionIndex),
    }));

    return [{
      id: `${source.fileId}_${index}`,
      prompt,
      options,
      answer: String(correct ?? ""),
      explanation: String(q.explanation || q.explain || q.exp || q.solution || q.hint || ""),
      source: `${source.chapterName} · ${source.subtopic}`,
    } satisfies Question];
  });
}

async function fetchSource(source: DriveSource): Promise<Question[]> {
  const cacheKey = `${CACHE_PREFIX}${source.fileId}`;
  if (typeof window !== "undefined") {
    const cached = window.localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached) as Question[];
      } catch {
        window.localStorage.removeItem(cacheKey);
      }
    }
  }

  const url = new URL(CONTENT_API);
  url.searchParams.set("action", "getFile");
  url.searchParams.set("fileId", source.fileId);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) throw new Error(`Question source returned HTTP ${response.status}.`);
  const payload = await response.json();
  const questions = normalize(payload?.success === true ? payload.result : payload, source);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(cacheKey, JSON.stringify(questions));
  }
  return questions;
}

export async function loadQuestions(source: DriveSource): Promise<Question[]> {
  return fetchSource(source);
}

export async function loadChapterQuestions(level = "level7", chapterCode = "2"): Promise<Question[]> {
  const sources = DRIVE_SOURCES.filter((source) => source.level === level && source.chapterCode === chapterCode);
  const batches = await Promise.all(sources.map((source) => loadQuestions(source)));
  return batches.flat();
}

export { DRIVE_SOURCES };
