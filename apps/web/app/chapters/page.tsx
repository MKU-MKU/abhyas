import Link from "next/link";
import { listSubjects } from "../../lib/content/repository";

export default function ChaptersPage() {
  const subjects = listSubjects();
  return (
    <main className="main">
      <div className="sectionHeader">
        <div><p className="eyebrow">Syllabus explorer</p><h1>Chapters</h1><p className="subtitle">Navigate the study structure without tying the interface to a particular storage provider.</p></div>
      </div>
      {subjects.map((subject) => (
        <section key={subject.id} aria-labelledby={subject.id} style={{ marginTop: 28 }}>
          <div className="sectionHeader"><div><h2 id={subject.id} style={{ margin: 0 }}>{subject.name}</h2><span className="meta">{subject.chapters.length} chapters</span></div></div>
          <div className="chapterGrid">
            {subject.chapters.map((chapter) => (
              <Link className="chapterCard" href={`/chapters/${chapter.slug}`} key={chapter.id}>
                <span className="chapterCode">CHAPTER {chapter.code}</span>
                <h3 className="chapterTitle">{chapter.name}</h3>
                <p className="meta">{chapter.description}</p>
                <div className="pillRow"><span className="pill">{chapter.subtopics.length} subtopics</span><span className="pill">Question bank ready</span></div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
