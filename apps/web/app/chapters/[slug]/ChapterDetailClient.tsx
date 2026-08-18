"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadChapters, type ChapterSummary } from "../../../lib/content/db-adapter";
import { slugify } from "../../../lib/content/slug";

export default function ChapterDetailClient({ slug }: { slug: string }) {
  const [chapter, setChapter] = useState<ChapterSummary | null | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadChapters("level7")
      .then((chapters) => {
        if (cancelled) return;
        const match = chapters.find((c) => slugify(c.chapterName) === slug);
        setChapter(match ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load this chapter.");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <main className="main">
        <Link className="cardLink" href="/chapters">← All chapters</Link>
        <p className="meta" style={{ marginTop: 20, color: "var(--danger, #b00)" }}>{error}</p>
      </main>
    );
  }

  if (chapter === undefined) {
    return (
      <main className="main">
        <Link className="cardLink" href="/chapters">← All chapters</Link>
        <p className="meta" style={{ marginTop: 20 }}>Loading chapter…</p>
      </main>
    );
  }

  if (chapter === null) {
    return (
      <main className="main">
        <Link className="cardLink" href="/chapters">← All chapters</Link>
        <p className="meta" style={{ marginTop: 20 }}>Chapter not found.</p>
      </main>
    );
  }

  return (
    <main className="main">
      <Link className="cardLink" href="/chapters">← All chapters</Link>
      <section style={{ marginTop: 18 }}>
        <p className="eyebrow">Chapter {chapter.chapterCode}</p>
        <h1>{chapter.chapterName}</h1>
        <p className="subtitle">{chapter.questionCount} questions across {chapter.topics.length} subtopics.</p>
      </section>
      <section style={{ marginTop: 34 }} aria-labelledby="subtopics">
        <div className="sectionHeader">
          <div><p className="eyebrow">Study map</p><h2 id="subtopics" style={{ margin: 0 }}>Subtopics</h2></div>
          <span className="meta">{chapter.topics.length} sections</span>
        </div>
        <div className="subtopicList">
          {chapter.topics.map((topic) => (
            <Link
              className="subtopic"
              key={topic.name}
              href={`/practice?level=level7&chapterCode=${chapter.chapterCode}&subtopic=${encodeURIComponent(topic.name)}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div><strong>{topic.name}</strong></div>
              <span className="pill">{topic.questionCount} questions</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
