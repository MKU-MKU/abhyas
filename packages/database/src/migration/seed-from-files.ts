import { randomUUID } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Chapter, Level, Question, Source, Subject, Topic } from "@abhyas/content";
import { transformSubtopic, type RawSubtopicFile } from "./transform-subtopic";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Directory convention:
 *   seed-data/<level-code>/<chapter-slug>/<subtopic-file>.json
 *
 * Example:
 *   seed-data/level7/02-engineering-survey/4.5-leveling.json
 *
 * The chapter-slug prefix number (02-) controls chapter sortOrder;
 * the level directory name is the level code (level7, gk, ...).
 * Chapter display name comes from the first word after the number
 * in the folder name — for now we keep a small manual name map here
 * because chapterData.js's CH_NAMES is the real source of truth and
 * should be pasted in as levels/chapters are onboarded one at a time.
 */
const CHAPTER_NAMES: Record<string, Record<string, string>> = {
  level7: {
    "02-engineering-survey": "Engineering Survey",
  },
};

const SEED_ROOT = path.resolve(__dirname, "../../seed-data");

interface BuiltContent {
  levels: Level[];
  subjects: Subject[];
  chapters: Chapter[];
  sources: Source[];
  topics: Topic[];
  questions: Question[];
  warnings: string[];
}

async function buildFromFiles(): Promise<BuiltContent> {
  const result: BuiltContent = { levels: [], subjects: [], chapters: [], sources: [], topics: [], questions: [], warnings: [] };

  const levelDirs = await readdir(SEED_ROOT, { withFileTypes: true });

  for (const levelDir of levelDirs) {
    if (!levelDir.isDirectory()) continue;
    const levelCode = levelDir.name;

    const level: Level = { id: randomUUID(), code: levelCode, name: levelCode, sortOrder: result.levels.length };
    result.levels.push(level);

    // One implicit "default" subject per level for now — chapterData.js has
    // no subject tier between level and chapter, so we synthesize one.
    // Replace this once a real subject taxonomy is defined.
    const subject: Subject = { id: randomUUID(), levelId: level.id, code: `${levelCode}-default`, name: "General", sortOrder: 0 };
    result.subjects.push(subject);

    const chapterDirs = await readdir(path.join(SEED_ROOT, levelCode), { withFileTypes: true });

    for (const chapterDir of chapterDirs) {
      if (!chapterDir.isDirectory()) continue;
      const chapterSlug = chapterDir.name;
      const chapterName = CHAPTER_NAMES[levelCode]?.[chapterSlug] ?? chapterSlug;

      const chapter: Chapter = {
        id: randomUUID(),
        subjectId: subject.id,
        code: chapterSlug,
        name: chapterName,
        sortOrder: result.chapters.length,
      };
      result.chapters.push(chapter);

      const source: Source = { id: randomUUID(), chapterId: chapter.id, title: "Abhyas", sortOrder: 0 };
      result.sources.push(source);

      const files = (await readdir(path.join(SEED_ROOT, levelCode, chapterSlug))).filter((f) => f.endsWith(".json")).sort();

      for (const [index, file] of files.entries()) {
        const raw = JSON.parse(await readFile(path.join(SEED_ROOT, levelCode, chapterSlug, file), "utf-8")) as RawSubtopicFile;
        const { topic, questions, warnings } = transformSubtopic(raw, { level, subject, chapter, source }, index);
        result.topics.push(topic);
        result.questions.push(...questions);
        result.warnings.push(...warnings);
      }
    }
  }

  return result;
}

async function main() {
  const built = await buildFromFiles();

  console.log(`Levels: ${built.levels.length}`);
  console.log(`Subjects: ${built.subjects.length}`);
  console.log(`Chapters: ${built.chapters.length}`);
  console.log(`Topics: ${built.topics.length}`);
  console.log(`Questions: ${built.questions.length}`);
  if (built.warnings.length > 0) {
    console.log(`Warnings (${built.warnings.length}):`);
    for (const w of built.warnings) console.log(`  - ${w}`);
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    const outPath = path.resolve(__dirname, "../../seed-output.json");
    await writeFile(outPath, JSON.stringify(built, null, 2), "utf-8");
    console.log(`\nNo DATABASE_URL set — dry run only. Wrote built content tree to ${outPath}`);
    return;
  }

  const { drizzle } = await import("drizzle-orm/node-postgres");
  const { Pool } = await import("pg");
  const schema = await import("../schema");

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  await db.insert(schema.levels).values(built.levels.map((l) => ({ id: l.id, code: l.code, name: l.name, sortOrder: l.sortOrder })));
  await db.insert(schema.subjects).values(built.subjects.map((s) => ({ id: s.id, levelId: s.levelId, code: s.code, name: s.name, sortOrder: s.sortOrder })));
  await db.insert(schema.chapters).values(built.chapters.map((c) => ({ id: c.id, subjectId: c.subjectId, code: c.code, name: c.name, sortOrder: c.sortOrder })));
  await db.insert(schema.sources).values(built.sources.map((s) => ({ id: s.id, chapterId: s.chapterId, title: s.title, sortOrder: s.sortOrder })));
  await db.insert(schema.topics).values(built.topics.map((t) => ({ id: t.id, chapterId: t.chapterId, name: t.name, sortOrder: t.sortOrder })));

  for (const q of built.questions) {
    await db.insert(schema.questions).values({
      id: q.id,
      version: q.version,
      chapterId: q.chapterId,
      sourceId: q.sourceId ?? null,
      topicId: q.topicId ?? null,
      prompt: q.prompt,
      explanation: q.explanation ?? null,
      difficulty: q.difficulty,
      tags: [...q.tags],
      isActive: q.isActive,
    });
    await db.insert(schema.questionOptions).values(
      q.options.map((opt) => ({
        id: opt.id,
        questionId: q.id,
        text: opt.text,
        sortOrder: opt.sortOrder,
        isCorrect: q.correctOptionIds.includes(opt.id),
      })),
    );
  }

  await pool.end();
  console.log("\nSeed complete: inserted into Postgres.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
