"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadChapterQuestions, loadQuestionBankChapters } from "../../lib/content/drive-adapter";
import type { Question } from "../../lib/content/types";
import { recordAttempt } from "../../lib/learning/attempts";

const TOTAL_SECONDS = 20 * 90;
const FALLBACK_CHAPTERS = [["1", "Structural Engineering"], ["2", "Engineering Survey"], ["3", "Construction Materials"], ["4", "Concrete Technology"], ["7", "Estimating & Costing"], ["8", "Engineering Drawing"], ["9", "Engineering Economics"]] as const;

export default function ExamPage() {
  const [chapterKey, setChapterKey] = useState("2");
  const [chapters, setChapters] = useState<Array<{ code: string; name: string; count: number }>>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");

  async function startExam(nextChapter = chapterKey) {
    setLoading(true); setError(""); setSubmitted(false); setAnswers({}); setIndex(0); setSeconds(TOTAL_SECONDS); setSessionId(crypto.randomUUID());
    try {
      const loaded = await loadChapterQuestions("level7", nextChapter);
      const selected = [...loaded].sort(() => Math.random() - 0.5).slice(0, 20);
      if (!selected.length) throw new Error("No verified questions are available from the question bank.");
      setQuestions(selected);
    } catch (err) { setQuestions([]); setError(err instanceof Error ? err.message : "Could not load the exam question bank."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    void loadQuestionBankChapters().then((items) => { const mapped = items.map((item) => ({ code: item.chapterCode, name: item.chapterName, count: item.questions.length })); if (mapped.length) setChapters(mapped); });
    const requested = new URLSearchParams(window.location.search).get("chapter");
    const valid = requested && FALLBACK_CHAPTERS.some(([code]) => code === requested) ? requested : "2";
    setChapterKey(valid); void startExam(valid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading || submitted || seconds <= 0) return;
    const timer = globalThis.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => globalThis.clearInterval(timer);
  }, [loading, submitted, seconds]);

  useEffect(() => { if (!loading && seconds === 0 && questions.length) submitExam(); }, [loading, seconds, questions.length]);

  const question = questions[index];
  const answered = Object.keys(answers).length;
  const score = useMemo(() => questions.reduce((sum, item, i) => sum + (answers[i] === item.answer ? 1 : 0), 0), [answers, questions]);
  const chapterName = chapters.find((chapter) => chapter.code === chapterKey)?.name ?? FALLBACK_CHAPTERS.find(([code]) => code === chapterKey)?.[1] ?? "Engineering Survey";
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  function submitExam() {
    if (submitted || !sessionId) return;
    for (let i = 0; i < questions.length; i += 1) {
      const selected = answers[i];
      if (selected === undefined) continue;
      const item = questions[i];
      try { recordAttempt({ sessionId, questionId: item.id, mode: "exam", selectedAnswer: selected, correctAnswer: item.answer, correct: selected === item.answer, marks: item.marks ?? 1 }); } catch { /* Scoring must never block submission. */ }
    }
    setSubmitted(true);
  }

  if (loading) return <main className="main"><section className="card" style={{ maxWidth: 760, margin: "60px auto", textAlign: "center" }}><p className="eyebrow">Preparing examination</p><h1>Loading real questions…</h1><p className="subtitle" style={{ marginInline: "auto" }}>Building a fresh 20-question paper from the verified question bank.</p></section></main>;
  if (error) return <main className="main"><section className="card" style={{ maxWidth: 760, margin: "60px auto" }}><p className="eyebrow">Exam unavailable</p><h1>Could not load questions</h1><p>{error}</p><button type="button" className="primaryButton" onClick={() => void startExam()}>Retry</button></section></main>;
  if (!question || submitted) return <main className="main"><section className="card" style={{ maxWidth: 760, margin: "60px auto", textAlign: "center" }}><p className="eyebrow">Exam complete</p><h1>{score}/{questions.length}</h1><p className="subtitle" style={{ marginInline: "auto" }}>{questions.length ? Math.round((score / questions.length) * 100) : 0}% accuracy · {answered} answered · {questions.length - answered} unanswered · {chapterName}</p><div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}><button type="button" className="primaryButton" onClick={() => void startExam()}>New exam ↻</button><Link className="secondaryButton" href={`/practice?chapter=${chapterKey}`}>Practice this chapter →</Link><Link className="secondaryButton" href="/progress">See progress →</Link></div></section></main>;

  return <main className="main"><section style={{ maxWidth: 900, margin: "0 auto" }}>
    <Link className="cardLink" href="/">← Dashboard</Link>
    <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", flexWrap: "wrap" }}><div><p className="eyebrow">Timed examination</p><h1 style={{ marginBottom: 6 }}>{chapterName}</h1><p className="meta">20 questions · 30 minutes · unanswered questions receive no attempt record.</p></div><div style={{ minWidth: 280 }}><label className="meta" htmlFor="exam-chapter">Chapter</label><select id="exam-chapter" className="input" value={chapterKey} onChange={(event) => { const value = event.target.value; setChapterKey(value); void startExam(value); }}>{(chapters.length ? chapters : FALLBACK_CHAPTERS.map(([code, name]) => ({ code, name, count: 0 }))).map((chapter) => <option key={chapter.code} value={chapter.code}>{chapter.name}{chapter.count ? ` · ${chapter.count} Q` : ""}</option>)}</select></div></div>
    <div className="sectionHeader" style={{ marginTop: 20 }}><strong>{answered}/{questions.length} answered</strong><div className="pill" aria-label="Time remaining">{minutes}:{secs}</div></div>
    <div className="card"><div style={{ height: 6, background: "var(--surface-muted)", borderRadius: 99, overflow: "hidden", marginBottom: 20 }}><div style={{ width: `${((index + 1) / questions.length) * 100}%`, height: "100%", background: "var(--primary)" }} /></div><p className="meta">Question {index + 1} of {questions.length}</p><h2 style={{ fontSize: "clamp(1.4rem, 4vw, 2.25rem)", lineHeight: 1.35 }}>{question.prompt}</h2><div style={{ display: "grid", gap: 10, marginTop: 24 }}>{question.options.map((option, optionIndex) => <button key={option.id} type="button" onClick={() => setAnswers((current) => ({ ...current, [index]: option.id }))} aria-pressed={answers[index] === option.id} className={`questionOption ${answers[index] === option.id ? "selected" : ""}`}><strong>{String.fromCharCode(65 + optionIndex)}.</strong><span>{option.label}</span></button>)}</div><div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 28 }}><button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="secondaryButton">← Previous</button>{index < questions.length - 1 ? <button type="button" onClick={() => setIndex((value) => value + 1)} className="primaryButton">Next →</button> : <button type="button" onClick={submitExam} className="primaryButton">Submit exam</button>}</div></div>
  </section></main>;
}
