"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Question } from "../../lib/content/types";

export default function ReviewPage() {
  const [wrong, setWrong] = useState<Question[]>([]);
  const [stats, setStats] = useState({ total: 0, correct: 0 });

  useEffect(() => {
    try {
      setWrong(JSON.parse(localStorage.getItem("abhyas:wrong") || "[]"));
      setStats(JSON.parse(localStorage.getItem("abhyas:stats") || '{"total":0,"correct":0}'));
    } catch { /* empty local state */ }
  }, []);

  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;

  return <main className="main">
    <p className="eyebrow">Revision workspace</p>
    <h1>Review what matters.</h1>
    <p className="subtitle">Questions answered incorrectly in Practice are retained locally for focused revision. This is the first storage-independent review layer; backend synchronization comes later.</p>

    <div className="stats">
      <div className="stat"><strong>{wrong.length}</strong><span>Questions in wrong bank</span></div>
      <div className="stat"><strong>{stats.total}</strong><span>Practice answers</span></div>
      <div className="stat"><strong>{accuracy}%</strong><span>Current accuracy</span></div>
    </div>

    <section style={{ marginTop: 30 }}>
      <div className="sectionHeader"><div><p className="eyebrow">Wrong bank</p><h2 style={{ margin: 0 }}>Questions to revisit</h2></div><Link className="primaryButton" href="/practice">Practice more →</Link></div>
      {wrong.length === 0 ? <div className="card"><h2>Nothing to review yet.</h2><p>Answer some real questions in Practice. Incorrect answers will appear here automatically.</p></div> : <div className="subtopicList">{wrong.map((question, index) => <article className="card" key={question.id}><div className="meta">Q{index + 1} · {question.source || "Abhyas question bank"}</div><h2 style={{ marginTop: 8 }}>{question.prompt}</h2><div className="pillRow">{question.options.map((option, optionIndex) => <span className="pill" key={option.id}>{String.fromCharCode(65 + optionIndex)}. {option.label}</span>)}</div>{question.explanation && <p><strong>Explanation:</strong> {question.explanation}</p>}</article>)}</div>}
    </section>
  </main>;
}
