import Link from "next/link";

const reviewAreas = [
  ["Weak areas", "Topics where your accuracy needs another pass.", "0 targets"],
  ["Mistakes", "Questions you answered incorrectly and should revisit.", "0 saved"],
  ["Bookmarks", "Questions you deliberately kept for later review.", "0 saved"],
];

export default function ReviewPage() {
  return (
    <main className="main">
      <p className="eyebrow">Revision workspace</p>
      <h1>Review what matters.</h1>
      <p className="subtitle">The review layer will turn attempts and mistakes into targeted revision queues. The foundation is intentionally storage-independent.</p>
      <div className="grid" style={{ marginTop: 32 }}>
        {reviewAreas.map(([title, description, count]) => <article className="card" key={title}><span className="pill">{count}</span><h2 style={{ marginTop: 14 }}>{title}</h2><p>{description}</p><Link className="cardLink" href="/chapters">Browse chapters →</Link></article>)}
      </div>
    </main>
  );
}
