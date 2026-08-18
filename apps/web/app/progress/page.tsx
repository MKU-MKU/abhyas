"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAttempts, getProgressStats, getWrongQuestionIds } from "../../lib/learning/attempts";

export default function ProgressPage() {
  const [stats, setStats] = useState({ total: 0, correct: 0, accuracy: 0 });
  const [wrong, setWrong] = useState(0);
  const [practice, setPractice] = useState(0);
  const [exams, setExams] = useState(0);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    const attempts = getAttempts();
    setStats(getProgressStats());
    setWrong(getWrongQuestionIds().size);
    setPractice(attempts.filter((attempt) => attempt.mode === "practice").length);
    setExams(attempts.filter((attempt) => attempt.mode === "exam").length);
    setSessions(new Set(attempts.map((attempt) => attempt.sessionId)).size);
  }, []);

  const examAccuracy = useMemo(() => {
    const examAttempts = getAttempts().filter((attempt) => attempt.mode === "exam");
    return examAttempts.length ? Math.round((examAttempts.filter((attempt) => attempt.correct).length / examAttempts.length) * 100) : 0;
  }, [stats]);

  return <main className="main">
    <div className="sectionHeader"><div><p className="eyebrow">Performance dashboard</p><h1 style={{ marginBottom: 6 }}>See your progress.</h1><p className="subtitle">Your learning history is currently stored locally in this browser. The frontend is ready for a future synchronized persistence layer.</p></div><Link className="primaryButton" href="/practice">Practice now →</Link></div>

    <div className="stats" style={{ marginTop: 30 }}>
      <div className="stat"><strong>{stats.accuracy}%</strong><span>Overall accuracy</span></div>
      <div className="stat"><strong>{stats.total}</strong><span>Answers recorded</span></div>
      <div className="stat"><strong>{wrong}</strong><span>Questions to review</span></div>
    </div>

    <div className="grid" style={{ marginTop: 20 }}>
      <article className="card"><p className="eyebrow">Practice</p><h2>{practice}</h2><p>Answers checked with immediate feedback.</p></article>
      <article className="card"><p className="eyebrow">Exam</p><h2>{exams}</h2><p>{examAccuracy}% accuracy across answered exam questions.</p></article>
      <article className="card"><p className="eyebrow">Sessions</p><h2>{sessions}</h2><p>Distinct study sessions recorded on this device.</p></article>
    </div>

    <section className="card" style={{ marginTop: 20 }}>
      <p className="eyebrow">Next action</p>
      <h2>{stats.total ? "Keep improving your weak areas." : "Complete your first practice set."}</h2>
      <p>{wrong ? `${wrong} questions are waiting in your Review bank.` : "Once you answer real questions, accuracy and review counts will appear here."}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}><Link className="primaryButton" href="/practice">Start practice →</Link><Link className="secondaryButton" href="/exam">Take an exam</Link><Link className="secondaryButton" href="/review">Open review</Link></div>
    </section>
  </main>;
}
