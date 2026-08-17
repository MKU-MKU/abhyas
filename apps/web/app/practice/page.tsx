"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadChapterQuestions } from "../../lib/content/drive-adapter";
import type { Question } from "../../lib/content/types";
import { recordAttempt } from "../../lib/learning/attempts";

const CHAPTERS = [
  ["1", "Structural Engineering"],
  ["2", "Engineering Survey"],
  ["3", "Construction Materials"],
  ["4", "Concrete Technology"],
  ["7", "Estimating & Costing"],
  ["8", "Engineering Drawing"],
  ["9", "Engineering Economics"],
] as const;

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function PracticePage() {
  const [chapterKey, setChapterKey] = useState("2");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const chapterName = CHAPTERS.find(([code]) => code === chapterKey)?.[1] ?? "Engineering Survey";
  const question = questions[index];
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  async function startPractice(nextChapter = chapterKey) {
    setLoading(true);
    setError("");
    setQuestions([]);
    setIndex(0);
    setSelected(null);
    setSubmitted(false);
    setSessionId(crypto.randomUUID());

    try {
      const available = await loadChapterQuestions("level7", nextChapter);
      const loaded = shuffle(available).slice(0, 20);
      if (!loaded.length) throw new Error("No verified questions are available for this chapter yet.");
      setQuestions(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load questions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void startPractice("2"); }, []);

  const correct = submitted && question && selected === question.answer;
  const optionClass = useMemo(() => (optionId: string) => {
    if (!submitted) return selected === optionId ? "selected" : "";
    if (optionId === question?.answer) return "correct";
    if (optionId === selected) return "wrong";
    return "";
  }, [question, selected, submitted]);

  function checkAnswer() {
    if (!question || selected === null || !sessionId) return;
    setSubmitted(true);
    const isCorrect = selected === question.answer;
    try {
      recordAttempt({
        sessionId,
        questionId: question.id,
        mode: "practice",
        selectedAnswer: selected,
        correctAnswer: question.answer,
        correct: isCorrect,
        marks: question.marks ?? 1,
      });
      const current = JSON.parse(localStorage.getItem("abhyas:wrong") || "[]") as Question[];
      localStorage.setItem(
        "abhyas:wrong",
        JSON.stringify(isCorrect
          ? current.filter((item) => item.id !== question.id)
          : [question, ...current.filter((item) => item.id !== question.id)].slice(0, 100)),
      );
    } catch {
      // Local persistence must never block answering.
    }
  }

  return <main className="main"><section style={{ maxWidth: 920, margin: "0 auto" }}>
    <Link className="cardLink" href="/">← Dashboard</Link>
    <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", flexWrap: "wrap" }}>
      <div>
        <p className="eyebrow">Verified Question Bank</p>
        <h1>Practice</h1>
        <p className="meta">Questions are bundled from the verified Abhyas question-bank files, so Practice does not depend on a live Drive file.</p>
      </div>
      <div style={{ minWidth: 280 }}>
        <label className="meta" htmlFor="chapter">Chapter</label>
        <select
          id="chapter"
          className="input"
          value={chapterKey}
          onChange={(event) => {
            const value = event.target.value;
            setChapterKey(value);
            void startPractice(value);
          }}
          disabled={loading}
        >
          {CHAPTERS.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </div>
    </div>

    <div className="card" style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <span className="meta">7 verified chapters</span>
      <span className="meta">·</span>
      <span className="meta">Practice set: up to 20 questions</span>
      <Link className="cardLink" href="/review" style={{ margin: 0 }}>Review mistakes →</Link>
      <button type="button" className="primaryButton" onClick={() => void startPractice()} disabled={loading} style={{ marginLeft: "auto" }}>
        {loading ? "Loading questions…" : "New Practice Set →"}
      </button>
    </div>

    {error && <div className="card" style={{ marginTop: 16, borderColor: "var(--danger)" }}>
      <strong>Could not load the question bank.</strong>
      <p>{error}</p>
    </div>}

    {question && !loading && <div className="card" style={{ marginTop: 20 }}>
      <div style={{ height: 7, background: "var(--surface-muted)", borderRadius: 99, overflow: "hidden", marginBottom: 22 }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)" }} />
      </div>
      <div className="meta" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span>{chapterName}</span>
        <span>Question {index + 1} / {questions.length}</span>
      </div>
      <h2 style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", lineHeight: 1.35, marginTop: 12 }}>{question.prompt}</h2>
      <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
        {question.options.map((option, optionIndex) => <button
          key={option.id}
          type="button"
          className={`questionOption ${optionClass(option.id)}`}
          onClick={() => !submitted && setSelected(option.id)}
          disabled={submitted}
          aria-pressed={selected === option.id}
        >
          <strong>{String.fromCharCode(65 + optionIndex)}.</strong>
          <span>{option.label}</span>
        </button>)}
      </div>
      {submitted && <div className="card" style={{ marginTop: 18, background: "var(--surface-muted)", boxShadow: "none" }}>
        <strong>{correct ? "✓ Correct" : "Review this question"}</strong>
        {question.explanation && <p style={{ marginBottom: 0 }}>{question.explanation}</p>}
      </div>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
        {!submitted ? <button type="button" onClick={checkAnswer} disabled={selected === null} className="primaryButton" style={{ opacity: selected === null ? .5 : 1 }}>Check answer</button> : index < questions.length - 1 ? <button type="button" onClick={() => { setIndex((value) => value + 1); setSelected(null); setSubmitted(false); }} className="primaryButton">Next question →</button> : <button type="button" onClick={() => void startPractice()} className="primaryButton">New practice set ↻</button>}
      </div>
    </div>}

    {!question && !loading && !error && <div className="card" style={{ marginTop: 20 }}><h2>Ready when you are.</h2><p>Choose a chapter and start a verified question session.</p></div>}
  </section></main>;
}
