"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadChapters, type ChapterSummary } from "../../lib/content/db-adapter";
import { slugify } from "../../lib/content/slug";

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadChapters("level7")
      .then((data) => {
        if (!cancelled) setChapters(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load chapters.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="main">
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Syllabus explorer</p>
          <h1>Chapters</h1>
          <p className="subtitle">Real question counts, straight from the Abhyas question bank.</p>
        </div>
      </div>

      {loading && <p className="meta" style={{ marginTop: 20 }}>Loading chapters…</p>}
      {error && <p className="meta" style={{ marginTop: 20, color: "var(--danger, #b00)" }}>{error}</p>}

      {!loading && !error && (
        <section style={{ marginTop: 28 }}>
          <div className="sectionHeader">
            <div>
              <h2 style={{ margin: 0 }}>Level 7 — Engineering</h2>
              <span className="meta">{chapters.length} chapters</span>
            </div>
          </div>
          <div className="chapterGrid">
            {chapters.map((chapter) => (
              <Link className="chapterCard" href={`/chapters/${slugify(chapter.chapterName)}`} key={chapter.chapterCode}>
                <span className="chapterCode">CHAPTER {chapter.chapterCode}</span>
                <h3 className="chapterTitle">{chapter.chapterName}</h3>
                <div className="pillRow">
                  <span className="pill">{chapter.topics.length} subtopics</span>
                  <span className="pill">{chapter.questionCount} questions</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
