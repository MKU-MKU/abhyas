"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DRIVE_SOURCES, loadQuestions } from "../../lib/content/drive-adapter";
import type { Question } from "../../lib/content/types";

const chapterOptions = Array.from(new Map(DRIVE_SOURCES.map((source) => [`${source.level}:${source.chapterCode}`, source])).values());
function shuffle<T>(items: T[]): T[] { return [...items].sort(() => Math.random() - 0.5); }

export default function PracticePage() {
  const [chapterKey, setChapterKey] = useState("level7:2");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedChapter = chapterOptions.find((item) => `${item.level}:${item.chapterCode}` === chapterKey) || chapterOptions[0];
  const sources = DRIVE_SOURCES.filter((source) => `${source.level}:${source.chapterCode}` === chapterKey);
  const question = questions[index];
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  async function startPractice() {
    setLoading(true); setError(""); setQuestions([]); setIndex(0); setSelected(null); setSubmitted(false);
    try {
      const batches = await Promise.all(sources.map(loadQuestions));
      const loaded = shuffle(batches.flat()).slice(0, 20);
      if (!loaded.length) throw new Error("No valid questions were returned from this chapter.");
      setQuestions(loaded);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load questions."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void startPractice(); }, []);

  const correct = submitted && question && selected === question.answer;
  const optionClass = useMemo(() => (optionId: string) => {
    if (!submitted) return selected === optionId ? "selected" : "";
    if (optionId === question?.answer) return "correct";
    if (optionId === selected) return "wrong";
    return "";
  }, [question, selected, submitted]);

  function checkAnswer() {
    if (!question || selected === null) return;
    setSubmitted(true);
    try {
      const current = JSON.parse(localStorage.getItem("abhyas:wrong") || "[]") as Question[];
      const wrong = selected !== question.answer;
      localStorage.setItem("abhyas:wrong", JSON.stringify(wrong ? [question, ...current.filter((item) => item.id !== question.id)].slice(0, 100) : current.filter((item) => item.id !== question.id)));
      const stats = JSON.parse(localStorage.getItem("abhyas:stats") || '{"total":0,"correct":0}') as { total: number; correct: number };
      stats.total += 1; if (!wrong) stats.correct += 1;
      localStorage.setItem("abhyas:stats", JSON.stringify(stats));
    } catch { /* local persistence must never block answering */ }
  }

  if (!selectedChapter) return <main className="main"><section className="card"><h1>Question bank is being connected</h1><p>Drive sources are not configured yet.</p></section></main>;

  return <main className="main"><section style={{ maxWidth: 920, margin: "0 auto" }}>
    <Link className="cardLink" href="/">← Dashboard</Link>
    <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", flexWrap: "wrap" }}>
      <div><p className="eyebrow">Real Question Bank</p><h1>Practice</h1><p className="meta">Questions load from the existing Abhyas Drive files through the V1 content API.</p></div>
      <div style={{ minWidth: 240 }}><label className="meta" htmlFor="chapter">Chapter</label><select id="chapter" className="input" value={chapterKey} onChange={(event) => setChapterKey(event.target.value)}>{chapterOptions.map((chapter) => <option key={`${chapter.level}:${chapter.chapterCode}`} value={`${chapter.level}:${chapter.chapterCode}`}>{chapter.chapterName}</option>)}</select></div>
    </div>
    <div className="card" style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}><span className="meta">{sources.length} Drive question sets</span><span className="meta">·</span><span className="meta">Offline cache enabled</span><Link className="cardLink" href="/review" style={{ margin: 0 }}>Review mistakes →</Link><button type="button" className="primaryButton" onClick={() => void startPractice()} disabled={loading} style={{ marginLeft: "auto" }}>{loading ? "Loading questions…" : "Start / Reload Practice →"}</button></div>
    {error && <div className="card" style={{ marginTop: 16, borderColor: "var(--danger)" }}><strong>Could not load the question bank.</strong><p>{error}</p><p className="meta">Check that the existing Apps Script deployment is available and can read the Drive file.</p></div>}
    {question && !loading && !error && <div className="card" style={{ marginTop: 20 }}>
      <div style={{ height: 7, background: "var(--surface-muted)", borderRadius: 99, overflow: "hidden", marginBottom: 22 }}><div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)" }} /></div>
      <div className="meta" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>{selectedChapter.chapterName}</span><span>Question {index + 1} / {questions.length}</span></div>
      <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", lineHeight: 1.35, marginTop: 12 }}>{question.prompt}</h2>
      <div style={{ display: "grid", gap: 10, marginTop: 24 }}>{question.options.map((option) => <button key={option.id} type="button" className={`questionOption ${optionClass(option.id)}`} onClick={() => !submitted && setSelected(option.id)} disabled={submitted} aria-pressed={selected === option.id}><strong>{String.fromCharCode(65 + Number(option.id))}.</strong><span>{option.label}</span></button>)}</div>
      {submitted && <div className="card" style={{ marginTop: 18, background: "var(--surface-muted)", boxShadow: "none" }}><strong>{correct ? "✓ Correct" : "Review this question"}</strong>{question.explanation && <p style={{ marginBottom: 0 }}>{question.explanation}</p>}</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>{!submitted ? <button type="button" onClick={checkAnswer} disabled={selected === null} className="primaryButton" style={{ opacity: selected === null ? .5 : 1 }}>Check answer</button> : index < questions.length - 1 ? <button type="button" onClick={() => { setIndex((value) => value + 1); setSelected(null); setSubmitted(false); }} className="primaryButton">Next question →</button> : <button type="button" onClick={() => void startPractice()} className="primaryButton">New practice set ↻</button>}</div>
    </div>}
    {!question && !loading && !error && <div className="card" style={{ marginTop: 20 }}><h2>Ready when you are.</h2><p>Choose a chapter and start a real question session.</p></div>}
  </section></main>;
}
