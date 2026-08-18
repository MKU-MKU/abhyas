"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadChapterQuestions } from "../../lib/content/db-adapter";
import type { Question } from "../../lib/content/types";

const TOTAL_SECONDS = 20 * 90;

export default function ExamPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function startExam() {
    setLoading(true);
    setError("");
    setSubmitted(false);
    setAnswers({});
    setIndex(0);
    setSeconds(TOTAL_SECONDS);
    try {
      const loaded = await loadChapterQuestions("level7", "2");
      const selected = [...loaded].sort(() => Math.random() - 0.5).slice(0, 20);
      if (!selected.length) throw new Error("No valid questions are available for this chapter.");
      setQuestions(selected);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the exam question bank.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void startExam(); }, []);

  useEffect(() => {
    if (loading || submitted || seconds <= 0) return;
    const timer = globalThis.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => globalThis.clearInterval(timer);
  }, [loading, submitted, seconds]);

  useEffect(() => {
    if (!loading && seconds === 0 && questions.length) setSubmitted(true);
  }, [loading, seconds, questions.length]);

  const question = questions[index];
  const answered = Object.keys(answers).length;
  const score = useMemo(() => questions.reduce((sum, item, i) => sum + (answers[i] === item.answer ? 1 : 0), 0), [answers, questions]);
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  if (loading) return <main className="main"><section className="card" style={{ maxWidth: 700, margin: "60px auto", textAlign: "center" }}><p className="eyebrow">Preparing exam</p><h1>Loading real questions…</h1><p className="subtitle" style={{ marginInline: "auto" }}>Reading the Abhyas question bank.</p></section></main>;

  if (error) return <main className="main"><section className="card" style={{ maxWidth: 700, margin: "60px auto" }}><p className="eyebrow">Exam unavailable</p><h1>Could not load questions</h1><p>{error}</p><button type="button" className="primaryButton" onClick={() => void startExam()}>Retry</button></section></main>;

  if (!question || submitted) return (
    <main className="main"><section className="card" style={{ maxWidth: 700, margin: "60px auto", textAlign: "center" }}>
      <p className="eyebrow">Exam complete</p><h1>{score}/{questions.length}</h1>
      <p className="subtitle" style={{ marginInline: "auto" }}>{questions.length ? Math.round((score / questions.length) * 100) : 0}% accuracy · {answered} answered · {questions.length - answered} unanswered</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <button type="button" className="primaryButton" onClick={() => void startExam()}>New exam ↻</button>
        <Link className="secondaryButton" href="/practice">Practice mistakes →</Link>
      </div>
    </section></main>
  );

  return (
    <main className="main"><section style={{ maxWidth: 860, margin: "0 auto" }}>
      <div className="sectionHeader"><div><p className="eyebrow">Timed examination · Engineering Survey</p><strong>{answered}/{questions.length} answered</strong></div><div className="pill" aria-label="Time remaining">{minutes}:{secs}</div></div>
      <div className="card">
        <div style={{ height: 6, background: "var(--surface-muted)", borderRadius: 99, overflow: "hidden", marginBottom: 20 }}><div style={{ width: `${((index + 1) / questions.length) * 100}%`, height: "100%", background: "var(--primary)" }} /></div>
        <p className="meta">Question {index + 1} of {questions.length}</p>
        <h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2.25rem)", lineHeight: 1.35 }}>{question.prompt}</h2>
        <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
          {question.options.map((option, i) => <button key={option.id} type="button" onClick={() => setAnswers((current) => ({ ...current, [index]: option.id }))} aria-pressed={answers[index] === option.id} className={`questionOption ${answers[index] === option.id ? "selected" : ""}`}><strong>{String.fromCharCode(65 + i)}.</strong><span>{option.label}</span></button>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 28 }}>
          <button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="secondaryButton">← Previous</button>
          {index < questions.length - 1 ? <button type="button" onClick={() => setIndex((value) => value + 1)} className="primaryButton">Next →</button> : <button type="button" onClick={() => setSubmitted(true)} className="primaryButton">Submit exam</button>}
        </div>
      </div>
    </section></main>
  );
}
