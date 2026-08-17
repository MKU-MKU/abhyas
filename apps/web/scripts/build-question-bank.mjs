import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const seedRoot = path.resolve(webRoot, "../../packages/database/seed-data/level7");
const publicRoot = path.join(webRoot, "public");

const CHAPTERS = {
  "01-structural-engineering": { code: "1", name: "Structural Engineering" },
  "02-engineering-survey": { code: "2", name: "Engineering Survey" },
  "03-construction-materials": { code: "3", name: "Construction Materials" },
  "04-concrete-technology": { code: "4", name: "Concrete Technology" },
  "07-estimating-costing": { code: "7", name: "Estimating & Costing" },
  "08-engineering-drawing": { code: "8", name: "Engineering Drawing" },
  "09-engineering-economics": { code: "9", name: "Engineering Economics" },
};

function normalizeCorrect(value, optionCount) {
  if (typeof value === "number") return value >= 0 && value < optionCount ? String(value) : "";
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (/^[a-e]$/i.test(trimmed)) return String("abcde".indexOf(trimmed.toLowerCase()));
  if (/^\d+$/.test(trimmed)) return Number(trimmed) < optionCount ? trimmed : "";
  return "";
}

async function main() {
  const chapters = [];
  let totalQuestions = 0;

  for (const [folder, meta] of Object.entries(CHAPTERS)) {
    const chapterRoot = path.join(seedRoot, folder);
    const files = (await readdir(chapterRoot)).filter((file) => file.endsWith(".json")).sort();
    const subtopics = [];
    const questions = [];

    for (const file of files) {
      const raw = JSON.parse(await readFile(path.join(chapterRoot, file), "utf8"));
      const items = Array.isArray(raw) ? raw : Array.isArray(raw?.questions) ? raw.questions : [];
      const code = String(raw?.code || file.split("-")[0]);
      const name = String(raw?.subtopic || raw?.topic || file.replace(/\.json$/, ""));
      const before = questions.length;

      for (const [index, item] of items.entries()) {
        if (!item || typeof item !== "object") continue;
        const prompt = String(item.q || item.question || item.Question || item.stem || item.text || "").trim();
        const rawOptions = Array.isArray(item.options)
          ? item.options
          : [item.a, item.b, item.c, item.d, item.e].filter((option) => option != null && String(option).trim());
        if (!prompt || rawOptions.length < 2) continue;

        const answer = normalizeCorrect(item.correct ?? item.answer ?? item.ans ?? item.Answer, rawOptions.length);
        if (!answer) continue;

        questions.push({
          id: `seed-${meta.code}-${code}-${index + 1}`,
          prompt,
          options: rawOptions.map((option, optionIndex) => ({
            id: String(optionIndex),
            label: String(option),
            isCorrect: String(optionIndex) === answer,
          })),
          answer,
          explanation: String(item.explanation || item.explain || item.exp || item.solution || item.hint || ""),
          source: `${meta.name} · ${name}`,
          marks: 1,
        });
      }

      subtopics.push({ code, name, questionCount: questions.length - before });
    }

    totalQuestions += questions.length;
    chapters.push({ level: "level7", chapterCode: meta.code, chapterName: meta.name, subtopics, questions });
  }

  await mkdir(publicRoot, { recursive: true });
  const output = { version: 1, generatedAt: new Date().toISOString(), totalQuestions, chapters };
  await writeFile(path.join(publicRoot, "question-bank.json"), JSON.stringify(output), "utf8");
  console.log(`Built frontend question bank: ${totalQuestions} questions across ${chapters.length} chapters.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
