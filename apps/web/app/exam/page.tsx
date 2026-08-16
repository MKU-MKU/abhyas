"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const questions = [
  { prompt: "Which design philosophy checks ultimate and serviceability limit states?", options: ["WSM", "LSM", "Elastic theory", "Plastic analysis"], answer: 1 },
  { prompt: "Rapid valve closure in a pressure conduit causes?", options: ["Uniform flow", "Water hammer", "Sedimentation", "Critical depth"], answer: 1 },
  { prompt: "The primary purpose of a settling basin is to?", options: ["Increase velocity", "Remove suspended sediment", "Raise pressure", "Aerate water"], answer: 1 },
];

const TOTAL_SECONDS = 5 * 60;

export default function ExamPage() {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted || seconds <= 0) return;
    const timer = globalThis.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => globalThis.clearInterval(timer);
  }, [submitted, seconds]);

  useEffect(() => { if (seconds === 0) setSubmitted(true); }, [seconds]);

  const question = questions[index];
  const answered = Object.keys(answers).length;
  const score = useMemo(() => questions.reduce((sum, item, i) => sum + (answers[i] === item.answer ? 1 : 0), 0), [answers]);
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  if (!question) return <main className="main"><section className="card"><p className="eyebrow">No question found</p><Link className="cardLink" href="/">Return to dashboard →</Link></section></main>;

  if (submitted) return (
    <main className="main"><section className="card" style={{ maxWidth: 700, margin: "60px auto", textAlign: "center" }}>
      <p className="eyebrow">Exam complete</p><h1>{score}/{questions.length}</h1>
      <p className="subtitle" style={{ marginInline: "auto" }}>{Math.round((score / questions.length) * 100)}% accuracy · {answered} answered · {questions.length - answered} unanswered</p>
      <Link className="primaryButton" href="/chapters" style={{ marginTop: 16 }}>Choose another topic →</Link>
    </section></main>
  );

  return (
    <main className="main"><section style={{ maxWidth: 860, margin: "0 auto" }}>
      <div className="sectionHeader"><div><p className="eyebrow">Timed examination</p><strong>{answered}/{questions.length} answered</strong></div><div className="pill" aria-label="Time remaining">{minutes}:{secs}</div></div>
      <div className="card"><p className="meta">Question {index + 1} of {questions.length}</p><h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.3rem)" }}>{question.prompt}</h2>
        <div style={{ display: "grid", gap: 10, marginTop: 24 }}>{question.options.map((option, optionIndex) => <button key={option} type="button" onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} aria-pressed={answers[index] === optionIndex} style={{ textAlign: "left", padding: "16px 18px", borderRadius: 14, border: `1px solid ${answers[index] === optionIndex ? "var(--primary)" : "var(--border)"}`, background: answers[index] === optionIndex ? "var(--surface-muted)" : "var(--surface)", color: "var(--text)" }}><strong>{String.fromCharCode(65 + optionIndex)}.</strong> {option}</button>)}</div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 28 }}><button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="secondaryButton">← Previous</button>{index < questions.length - 1 ? <button type="button" onClick={() => setIndex((value) => value + 1)} className="primaryButton">Next →</button> : <button type="button" onClick={() => setSubmitted(true)} className="primaryButton">Submit exam</button>}</div>
      </div>
    </section></main>
  );
}
