"use client";

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
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [submitted, seconds]);

  useEffect(() => {
    if (seconds === 0) setSubmitted(true);
  }, [seconds]);

  const question = questions[index];
  if (!question) {
    return (
      <main className="main">
        <section className="card" style={{ maxWidth: 700, margin: "60px auto", textAlign: "center" }}>
          <p className="eyebrow">No question found</p>
          <a className="cardLink" href="/">Return to dashboard →</a>
        </section>
      </main>
    );
  }
  const answered = Object.keys(answers).length;
  const score = useMemo(() => questions.reduce((sum, item, i) => sum + (answers[i] === item.answer ? 1 : 0), 0), [answers]);
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  if (submitted) {
    return (
      <main className="main">
        <section className="card" style={{ maxWidth: 700, margin: "60px auto", textAlign: "center" }}>
          <p className="eyebrow">Exam complete</p>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>{score}/{questions.length}</h1>
          <p className="subtitle" style={{ marginInline: "auto" }}>{Math.round((score / questions.length) * 100)}% accuracy · {answered} answered · {questions.length - answered} unanswered</p>
          <a className="cardLink" href="/">Return to dashboard →</a>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div><p className="eyebrow">Timed examination</p><strong>{answered}/{questions.length} answered</strong></div>
          <div aria-label="Time remaining" style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", fontVariantNumeric: "tabular-nums", fontWeight: 800 }}>{minutes}:{secs}</div>
        </div>
        <div className="card">
          <p style={{ color: "var(--muted)" }}>Question {index + 1} of {questions.length}</p>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.3rem)", marginTop: 12 }}>{question.prompt}</h1>
          <div style={{ display: "grid", gap: 10, marginTop: 28 }}>
            {question.options.map((option, optionIndex) => (
              <button key={option} type="button" onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} aria-pressed={answers[index] === optionIndex} style={{ textAlign: "left", padding: "16px 18px", borderRadius: 14, border: `1px solid ${answers[index] === optionIndex ? "var(--primary)" : "var(--border)"}`, background: answers[index] === optionIndex ? "var(--surface-muted)" : "var(--surface)", color: "var(--text)" }}>
                <strong>{String.fromCharCode(65 + optionIndex)}.</strong> {option}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 28 }}>
            <button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} style={{ padding: "11px 16px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", opacity: index === 0 ? .45 : 1 }}>← Previous</button>
            {index < questions.length - 1 ? <button type="button" onClick={() => setIndex((value) => value + 1)} style={{ padding: "11px 16px", border: 0, borderRadius: 12, background: "var(--primary)", color: "white" }}>Next →</button> : <button type="button" onClick={() => setSubmitted(true)} style={{ padding: "11px 16px", border: 0, borderRadius: 12, background: "var(--primary)", color: "white" }}>Submit exam</button>}
          </div>
        </div>
      </section>
    </main>
  );
}
