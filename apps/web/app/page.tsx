const modes = [
  { title: "Practice", description: "Focused questions with immediate feedback.", href: "/practice" },
  { title: "Timed Exam", description: "Simulate the pressure of a real examination.", href: "/exam" },
  { title: "Revision", description: "Review weak areas and previously missed questions.", href: "/review" },
];

export default function HomePage() {
  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="/">abhyas</a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="/practice">Practice</a>
          <a href="/exam">Exams</a>
          <a href="/review">Review</a>
          <a href="/progress">Progress</a>
        </nav>
      </header>

      <main className="main">
        <p className="eyebrow">Your preparation workspace</p>
        <h1>Study with purpose.<br />Know where you stand.</h1>
        <p className="subtitle">
          Abhyas brings practice, examination, revision and progress into one focused learning loop.
        </p>

        <div className="statRow" aria-label="Study summary">
          <div className="stat"><strong>0%</strong><span>Current accuracy</span></div>
          <div className="stat"><strong>0</strong><span>Questions completed</span></div>
          <div className="stat"><strong>0 days</strong><span>Current streak</span></div>
        </div>

        <section className="grid" aria-labelledby="study-modes">
          <div style={{ gridColumn: "1 / -1" }}>
            <h2 id="study-modes">Choose your next move</h2>
          </div>
          {modes.map((mode) => (
            <article className="card" key={mode.title}>
              <h2>{mode.title}</h2>
              <p>{mode.description}</p>
              <a className="cardLink" href={mode.href}>Start →</a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
