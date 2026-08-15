const metrics = [
  { label: "Accuracy", value: "—", detail: "Build your first attempt" },
  { label: "Questions", value: "0", detail: "Completed across all modes" },
  { label: "Streak", value: "0 days", detail: "Start a daily practice habit" },
];

export default function ProgressPage() {
  return (
    <main className="main">
      <a className="cardLink" href="/">← Dashboard</a>
      <section style={{ marginTop: 28 }}>
        <p className="eyebrow">Progress</p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}>Your preparation at a glance.</h1>
        <p className="subtitle">A useful progress system should show what improved, what remains weak, and what to study next.</p>
        <div className="statRow">
          {metrics.map((metric) => <div className="stat" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><p style={{ marginBottom: 0 }}>{metric.detail}</p></div>)}
        </div>
        <div className="grid">
          <article className="card"><h2>Accuracy by subject</h2><p>No attempt data yet. Complete practice questions to populate this view.</p></article>
          <article className="card"><h2>Weak areas</h2><p>Abhyas will surface topics with repeated errors rather than simply showing a total score.</p></article>
          <article className="card"><h2>Recommended next</h2><p>Your revision queue will prioritize recent mistakes, low-confidence topics and overdue review.</p></article>
        </div>
      </section>
    </main>
  );
}
