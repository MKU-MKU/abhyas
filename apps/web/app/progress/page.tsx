import Link from "next/link";

const metrics = [["0%", "Accuracy"], ["0", "Questions"], ["0", "Exams"], ["0 days", "Streak"]];

export default function ProgressPage() {
  return (
    <main className="main">
      <p className="eyebrow">Performance</p>
      <h1>See your progress.</h1>
      <p className="subtitle">A clean baseline for accuracy, consistency and exam performance. Real attempt data will plug into this view through the backend later.</p>
      <div className="stats" style={{ marginTop: 30 }}>{metrics.map(([value, label]) => <div className="stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      <section className="card" style={{ marginTop: 20 }}>
        <p className="eyebrow">Next milestone</p>
        <h2>Complete your first practice set.</h2>
        <p>Once attempts are persisted, this area will show chapter accuracy, recent activity, streaks and improvement trends.</p>
        <Link className="primaryButton" href="/practice" style={{ marginTop: 8 }}>Start practice →</Link>
      </section>
    </main>
  );
}
