import Link from "next/link";
import { getChapterCount, getSubtopicCount } from "../lib/content/repository";

const modes = [
  { title: "Practice", description: "Focused questions with immediate feedback.", href: "/practice", tag: "Learn" },
  { title: "Timed Exam", description: "Simulate real examination pressure with a focused timer.", href: "/exam", tag: "Test" },
  { title: "Revision", description: "Return to weak areas and previously missed questions.", href: "/review", tag: "Improve" },
];

export default function HomePage() {
  const chapters = getChapterCount();
  const subtopics = getSubtopicCount();

  return (
    <main className="main">
      <section className="hero">
        <div className="heroPanel">
          <p className="eyebrow">Abhyas V2 · Your preparation workspace</p>
          <h1>Study with purpose.<br />Know where you stand.</h1>
          <p className="subtitle">A focused learning loop for Nepal engineering and PSC preparation: choose a topic, practice deliberately, test yourself and review what needs work.</p>
          <div className="heroActions">
            <Link className="primaryButton" href="/chapters">Explore chapters →</Link>
            <Link className="secondaryButton" href="/practice">Start practice</Link>
          </div>
          <div className="stats" aria-label="Content summary">
            <div className="stat"><strong>{chapters}</strong><span>Foundation chapters</span></div>
            <div className="stat"><strong>{subtopics}</strong><span>Mapped subtopics</span></div>
            <div className="stat"><strong>0%</strong><span>Your current accuracy</span></div>
          </div>
        </div>
        <aside className="heroPanel" style={{ background: "linear-gradient(145deg, #111827, #24345e)", color: "white" }}>
          <p className="eyebrow" style={{ color: "#b9c8ff" }}>The study loop</p>
          <h2 style={{ fontSize: "1.65rem", marginTop: 8 }}>Small sessions. Better recall. Clear progress.</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
            {[["01", "Choose", "Pick a chapter or weak area."], ["02", "Practice", "Answer with immediate feedback."], ["03", "Review", "Turn mistakes into revision targets."], ["04", "Measure", "Track accuracy and consistency."]].map(([number, title, text]) => (
              <div key={number} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 12, alignItems: "start", padding: "12px 0", borderTop: "1px solid rgb(255 255 255 / 14%)" }}>
                <strong style={{ color: "#b9c8ff", fontSize: ".75rem" }}>{number}</strong>
                <div><strong>{title}</strong><div style={{ color: "#c6cedf", fontSize: ".82rem", marginTop: 2 }}>{text}</div></div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section style={{ marginTop: 42 }} aria-labelledby="study-modes">
        <div className="sectionHeader"><div><p className="eyebrow">Study modes</p><h2 id="study-modes" style={{ margin: 0, fontSize: "1.7rem" }}>Choose your next move</h2></div><Link className="cardLink" href="/chapters">View syllabus →</Link></div>
        <div className="grid">
          {modes.map((mode) => <article className="card" key={mode.title}><span className="pill">{mode.tag}</span><h2 style={{ marginTop: 14 }}>{mode.title}</h2><p>{mode.description}</p><Link className="cardLink" href={mode.href}>Open {mode.title.toLowerCase()} →</Link></article>)}
        </div>
      </section>
    </main>
  );
}
