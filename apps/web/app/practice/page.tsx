"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadChapterQuestions, loadQuestionBankChapters } from "../../lib/content/drive-adapter";
import type { Question } from "../../lib/content/types";
import { recordAttempt } from "../../lib/learning/attempts";

const FALLBACK_CHAPTERS = [["1", "Structural Engineering"], ["2", "Engineering Survey"], ["3", "Construction Materials"], ["4", "Concrete Technology"], ["7", "Estimating & Costing"], ["8", "Engineering Drawing"], ["9", "Engineering Economics"]] as const;
function shuffle<T>(items: T[]): T[] { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }

export default function PracticePage() {
  const [chapterKey, setChapterKey] = useState("2");
  const [chapters, setChapters] = useState<Array<{ code: string; name: string; count: number }>>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const chapterName = chapters.find((chapter) => chapter.code === chapterKey)?.name ?? FALLBACK_CHAPTERS.find(([code]) => code === chapterKey)?.[1] ?? "Engineering Survey";
  const question = questions[index];
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  useEffect(() => { void loadQuestionBankChapters().then((items) => { const mapped = items.map((item) => ({ code: item.chapterCode, name: item.chapterName, count: item.questions.length })); if (mapped.length) setChapters(mapped); }); }, []);

  async function startPractice(nextChapter = chapterKey) {
    setLoading(true); setError(""); setQuestions([]); setIndex(0); setSelected(null); setSubmitted(false); setFinished(false); setScore(0); setSessionId(crypto.randomUUID());
    try { const available = await loadChapterQuestions("level7", nextChapter); const loaded = shuffle(available).slice(0, 20); if (!loaded.length) throw new Error("No verified questions are available for this chapter yet."); setQuestions(loaded); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not load questions."); }
    finally { setLoading(false); }
  }

  useEffect(() => { const requested = new URLSearchParams(window.location.search).get("chapter"); const valid = requested && FALLBACK_CHAPTERS.some(([code]) => code === requested) ? requested : "2"; setChapterKey(valid); void startPractice(valid); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const correct = submitted && question && selected === question.answer;
  const optionClass = useMemo(() => (optionId: string) => { if (!submitted) return selected === optionId ? "selected" : ""; if (optionId === question?.answer) return "correct"; if (optionId === selected) return "wrong"; return ""; }, [question, selected, submitted]);

  function checkAnswer() {
    if (!question || selected === null || !sessionId) return;
    setSubmitted(true); const isCorrect = selected === question.answer; if (isCorrect) setScore((value) => value + 1);
    try { recordAttempt({ sessionId, questionId: question.id, mode: "practice", selectedAnswer: selected, correctAnswer: question.answer, correct: isCorrect, marks: question.marks ?? 1 }); const current = JSON.parse(localStorage.getItem("abhyas:wrong") || "[]") as Question[]; localStorage.setItem("abhyas:wrong", JSON.stringify(isCorrect ? current.filter((item) => item.id !== question.id) : [question, ...current.filter((item) => item.id !== question.id)].slice(0, 100))); } catch { /* Local persistence must never block answering. */ }
  }

  function nextQuestion() { if (index >= questions.length - 1) { setFinished(true); return; } setIndex((value) => value + 1); setSelected(null); setSubmitted(false); }

  return <main className="main"><section style={{ maxWidth: 920, margin: "0 auto" }}><Link className="cardLink" href="/">← Dashboard</Link><div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", flexWrap: "wrap" }}><div><p className="eyebrow">Real question bank</p><h1>Practice</h1><p className="meta">Verified questions are bundled into the GitHub Pages build. No live Drive file is required for Practice.</p></div><div style={{ minWidth: 300 }}><label className="meta" htmlFor="chapter">Chapter</label><select id="chapter" className="input" value={chapterKey} onChange={(event) => { const value = event.target.value; setChapterKey(value); void startPractice(value); }} disabled={loading}>{(chapters.length ? chapters : FALLBACK_CHAPTERS.map(([code, name]) => ({ code, name, count: 0 }))).map((chapter) => <option key={chapter.code} value={chapter.code}>{chapter.name}{chapter.count ? ` · ${chapter.count} Q` : ""}</option>)}</select></div></div><div className="card" style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}><span className="pill">{chapterName}</span><span className="meta">{questions.length || "—"} questions in this session</span><span className="meta">·</span><span className="meta">Up to 20 per session</span><Link className="cardLink" href="/review" style={{ margin: 0 }}>Review mistakes →</Link><button type="button" className="primaryButton" onClick={() => void startPractice()} disabled={loading} style={{ marginLeft: "auto" }}>{loading ? "Loading…" : "New set ↻"}</button></div>{error && <div className="card" style={{ marginTop: 16, borderColor: "var(--danger)" }}><strong>Could not load the question bank.</strong><p>{error}</p><button type="button" className="primaryButton" onClick={() => void startPractice()}>Retry</button></div>}{finished && <div className="card" style={{ marginTop: 20, textAlign: "center" }}><p className="eyebrow">Practice complete</p><h2 style={{ fontSize: "2.5rem", marginBottom: 8 }}>{score}/{questions.length}</h2><p className="subtitle" style={{ marginInline: "auto" }}>{questions.length ? Math.round((score / questions.length) * 100) : 0}% accuracy · Great work on {chapterName}.</p><div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 18 }}><button type="button" className="primaryButton" onClick={() => void startPractice()}>Practice again ↻</button><Link className="secondaryButton" href="/review">Review mistakes →</Link><Link className="secondaryButton" href="/progress">See progress →</Link></div></div>}{question && !loading && !finished && <div className="card" style={{ marginTop: 20 }}><div style={{ height: 7, background: "var(--surface-muted)", borderRadius: 99, overflow: "hidden", marginBottom: 22 }}><div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)" }} /></div><div className="meta" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>{chapterName}</span><span>Question {index + 1} / {questions.length}</span></div><h2 style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", lineHeight: 1.35, marginTop: 12 }}>{question.prompt}</h2><div style={{ display: "grid", gap: 10, marginTop: 24 }}>{question.options.map((option, optionIndex) => <button key={option.id} type="button" className={`questionOption ${optionClass(option.id)}`} onClick={() => !submitted && setSelected(option.id)} disabled={submitted} aria-pressed={selected === option.id}><strong>{String.fromCharCode(65 + optionIndex)}.</strong><span>{option.label}</span></button>)}</div>{submitted && <div className="card" style={{ marginTop: 18, background: "var(--surface-muted)", boxShadow: "none" }}><strong>{correct ? "✓ Correct" : "Review this question"}</strong>{!correct && <p style={{ marginBottom: 6 }}>Correct answer: <strong>{question.options.find((option) => option.id === question.answer)?.label ?? question.answer}</strong></p>}{question.explanation && <p style={{ marginBottom: 0 }}>{question.explanation}</p>}</div>}<div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 22 }}><button type="button" disabled={index === 0 || submitted} onClick={() => { setIndex((value) => value - 1); setSelected(null); setSubmitted(false); }} className="secondaryButton">← Previous</button>{!submitted ? <button type="button" onClick={checkAnswer} disabled={selected === null} className="primaryButton" style={{ opacity: selected === null ? .5 : 1 }}>Check answer</button> : <button type="button" onClick={nextQuestion} className="primaryButton">{index < questions.length - 1 ? "Next question →" : "Finish session →"}</button>}</div></div>}</section></main>;
}
