import cors from "cors";
import { and, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import { Pool } from "pg";
import * as schema from "@abhyas/database/schema";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set. Refusing to start.");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool, { schema });

/**
 * Maps the legacy numeric chapter codes (from the old chapterData.js /
 * DRIVE_SOURCES manifest, e.g. "2" for Engineering Survey) to the
 * chapters.code values used in the seeded database (folder-slug style,
 * e.g. "02-engineering-survey"). Keeping the numeric codes at the API
 * boundary means the frontend doesn't need to change how it refers to
 * chapters, only where it fetches questions from.
 */
const CHAPTER_CODE_MAP: Record<string, string> = {
  "1": "01-structural-engineering",
  "2": "02-engineering-survey",
  "3": "03-construction-materials",
  "4": "04-concrete-technology",
  "5": "05-geotechnical-engineering",
  "6": "06-construction-management",
  "7": "07-estimating-costing",
  "8": "08-engineering-drawing",
  "9": "09-engineering-economics",
  "10": "10-professional-practices",
};

const app = express();
app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/questions", async (req, res) => {
  const level = String(req.query.level ?? "");
  const chapterCode = String(req.query.chapterCode ?? "");
  const subtopic = req.query.subtopic ? String(req.query.subtopic) : undefined;

  const chapterSlug = CHAPTER_CODE_MAP[chapterCode];
  if (!level || !chapterSlug) {
    res.status(400).json({ error: "Missing or unrecognized level/chapterCode." });
    return;
  }

  try {
    const [levelRow] = await db.select().from(schema.levels).where(eq(schema.levels.code, level)).limit(1);
    if (!levelRow) {
      res.json([]);
      return;
    }

    const chapterRows = await db
      .select({ id: schema.chapters.id, name: schema.chapters.name })
      .from(schema.chapters)
      .innerJoin(schema.subjects, eq(schema.chapters.subjectId, schema.subjects.id))
      .where(and(eq(schema.subjects.levelId, levelRow.id), eq(schema.chapters.code, chapterSlug)))
      .limit(1);
    const chapterRow = chapterRows[0];
    if (!chapterRow) {
      res.json([]);
      return;
    }

    let topicId: string | undefined;
    if (subtopic) {
      const topicRows = await db
        .select({ id: schema.topics.id })
        .from(schema.topics)
        .where(and(eq(schema.topics.chapterId, chapterRow.id), eq(schema.topics.name, subtopic)));
      topicId = topicRows[0]?.id;
      if (!topicId) {
        res.json([]);
        return;
      }
    }

    const questionRows = await db
      .select()
      .from(schema.questions)
      .where(topicId ? and(eq(schema.questions.chapterId, chapterRow.id), eq(schema.questions.topicId, topicId))! : eq(schema.questions.chapterId, chapterRow.id));
    const questionIds = questionRows.map((q) => q.id);

    const allOptions = questionIds.length
      ? await db.select().from(schema.questionOptions).where(inArray(schema.questionOptions.questionId, questionIds))
      : [];

    const optionsByQuestion = new Map<string, typeof allOptions>();
    for (const opt of allOptions) {
      const list = optionsByQuestion.get(opt.questionId) ?? [];
      list.push(opt);
      optionsByQuestion.set(opt.questionId, list);
    }

    const result = questionRows.map((q) => {
      const opts = optionsByQuestion.get(q.id) ?? [];
      const correct = opts.find((o) => o.isCorrect);
      return {
        id: q.id,
        prompt: q.prompt,
        options: opts.map((o) => ({ id: o.id, label: o.text, isCorrect: o.isCorrect })),
        answer: correct?.id ?? "",
        explanation: q.explanation ?? undefined,
        difficulty: (q.difficulty as "easy" | "medium" | "hard" | undefined) ?? undefined,
        source: chapterRow.name,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error fetching questions." });
  }
});

app.listen(PORT, () => {
  console.log(`Abhyas API listening on port ${PORT}`);
});
