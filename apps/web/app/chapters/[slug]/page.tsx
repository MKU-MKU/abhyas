import Link from "next/link";
import { notFound } from "next/navigation";
import { findChapter, listSubjects } from "../../../lib/content/repository";

export function generateStaticParams() {
  return listSubjects().flatMap((subject) => subject.chapters.map((chapter) => ({ slug: chapter.slug })));
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = findChapter(slug);
  if (!chapter) notFound();

  return (
    <main className="main">
      <Link className="cardLink" href="/chapters">← All chapters</Link>
      <section style={{ marginTop: 18 }}>
        <p className="eyebrow">Chapter {chapter.code}</p>
        <h1>{chapter.name}</h1>
        <p className="subtitle">{chapter.description}</p>
      </section>
      <section style={{ marginTop: 34 }} aria-labelledby="subtopics">
        <div className="sectionHeader"><div><p className="eyebrow">Study map</p><h2 id="subtopics" style={{ margin: 0 }}>Subtopics</h2></div><span className="meta">{chapter.subtopics.length} sections</span></div>
        <div className="subtopicList">
          {chapter.subtopics.map((topic) => (
            <div className="subtopic" key={topic.id}>
              <div><span className="chapterCode">{topic.code}</span><br /><strong>{topic.name}</strong></div>
              <span className="pill">Practice coming next</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
