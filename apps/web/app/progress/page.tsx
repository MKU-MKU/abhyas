"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProgressPage() {
  const [stats, setStats] = useState({ total: 0, correct: 0 });
  const [wrong, setWrong] = useState(0);

  useEffect(() => {
    try {
      setStats(JSON.parse(localStorage.getItem("abhyas:stats") || '{"total":0,"correct":0}'));
      setWrong(JSON.parse(localStorage.getItem("abhyas:wrong") || "[]").length);
    } catch { /* empty local state */ }
  }, []);

  const accuracy = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;

  return <main className="main">
    <p className="eyebrow">Performance</p>
    <h1>See your progress.</h1>
    <p className="subtitle">Practice attempts currently persist on this device. The same contract can later be synchronized to PostgreSQL without changing this dashboard.</p>
    <div className="stats" style={{ marginTop: 30 }}>
      <div className="stat"><strong>{accuracy}%</strong><span>Accuracy</span></div>
      <div className="stat"><strong>{stats.total}</strong><span>Questions answered</span></div>
      <div className="stat"><strong>{wrong}</strong><span>Wrong bank</span></div>
    </div>
    <section className="card" style={{ marginTop: 20 }}>
      <p className="eyebrow">Next action</p>
      <h2>{stats.total ? "Keep improving your weak areas." : "Complete your first practice set."}</h2>
      <p>{wrong ? `${wrong} questions are waiting in your Review bank.` : "Once you answer real questions, accuracy and review counts will appear here."}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}><Link className="primaryButton" href="/practice">Start practice →</Link><Link className="secondaryButton" href="/review">Open review</Link></div>
    </section>
  </main>;
}
