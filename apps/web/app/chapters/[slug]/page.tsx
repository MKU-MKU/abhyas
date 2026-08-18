import ChapterDetailClient from "./ChapterDetailClient";
import { slugify } from "../../../lib/content/slug";

// Static export requires every dynamic route to be known at build time.
// These are the 7 chapters that currently have real seeded content
// (see packages/database/seed-data/level7/) - kept in sync manually
// with apps/api's CHAPTER_CODE_MAP until there's a build-time way to
// query the live API safely (Render free tier can be asleep at build).
const REAL_CHAPTER_NAMES = [
  "Structural Engineering",
  "Engineering Survey",
  "Construction Materials",
  "Concrete Technology",
  "Estimating & Costing",
  "Engineering Drawing",
  "Engineering Economics",
];

export function generateStaticParams() {
  return REAL_CHAPTER_NAMES.map((name) => ({ slug: slugify(name) }));
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ChapterDetailClient slug={slug} />;
}
