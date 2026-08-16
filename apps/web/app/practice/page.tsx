"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Question = { prompt: string; options: string[]; answer: number; explanation: string };

const demoQuestions: Question[] = [
  { prompt: "Which design philosophy primarily checks reinforced concrete members at ultimate and serviceability limit states?", options: ["Working Stress Method", "Limit State Method", "Elastic Method", "Rankine Method"], answer: 1, explanation: "The Limit State Method checks both ultimate strength and serviceability limit states." },
  { prompt: "In a pressurised conduit, rapid valve closure can produce which transient phenomenon?", options: ["Cavitation only", "Water hammer", "Sedimentation", "Uniform flow"], answer: 1, explanation: "Rapid changes in flow momentum generate pressure waves known as water hammer." },
];

export default function PracticePage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const question = demoQuestions[index];
  const progress = useMemo(() => ((index + 1) / demoQuestions.length) * 100, [index]);

  if (!question) return <main className="main"><section className="card"><p className="eyebrow">No question found</p><Link className="cardLink" href="/">Return to dashboard →</Link></section></main>;

  const submit = () => { if (selected !== null) setSubmitted(true); };
  const next = () => { if (index < demoQuestions.length - 1) { setIndex((value) => value + 1); setSelected(null); setSubmitted(false); } };

  return (
    <main className="main"><section style={{ maxWidth: 820, margin: "0 auto" }}>
      <Link className="cardLink" href="/">← Dashboard</Link>
      <p className="eyebrow" style={{ marginTop: 28 }}>Practice · Civil Engineering</p>
      <div style={{ height: 6, background: "var(--surface-muted)", borderRadius: 99, overflow: "hidden", margin: "10px 0 24px" }}><div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)" }} /></div>
      <div className="card"><p className="meta">Question {index + 1} of {demoQuestions.length}</p><h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}>{question.prompt}</h2>
        <div style={{ display: "grid", gap: 10, marginTop: 24 }}>{question.options.map((option, optionIndex) => { const correct = submitted && optionIndex === question.answer; const wrong = submitted && selected === optionIndex && optionIndex !== question.answer; return <button key={option} type="button" onClick={() => !submitted && setSelected(optionIndex)} aria-pressed={selected === optionIndex} style={{ textAlign: "left", padding: "16px 18px", borderRadius: 14, border: `1px solid ${correct ? "var(--success)" : wrong ? "var(--danger)" : selected === optionIndex ? "var(--primary)" : "var(--border)"}`, background: selected === optionIndex ? "var(--surface-muted)" : "var(--surface)", color: "var(--text)" }}><strong>{String.fromCharCode(65 + optionIndex)}.</strong> {option}</button>; })}</div>
        {submitted && <div className="card" style={{ marginTop: 18, background: "var(--surface-muted)", boxShadow: "none" }}><strong>{selected === question.answer ? "Correct" : "Review this one"}</strong><p>{question.explanation}</p></div>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>{!submitted ? <button type="button" onClick={submit} disabled={selected === null} className="primaryButton" style={{ opacity: selected === null ? .5 : 1 }}>Check answer</button> : index < demoQuestions.length - 1 ? <button type="button" onClick={next} className="primaryButton">Next question →</button> : <Link className="primaryButton" href="/chapters">Choose another chapter →</Link>}</div>
      </div>
    </section></main>
  );
}
