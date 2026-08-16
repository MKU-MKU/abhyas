import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/chapters", label: "Chapters" },
  { href: "/practice", label: "Practice" },
  { href: "/exam", label: "Exam" },
  { href: "/review", label: "Review" },
  { href: "/progress", label: "Progress" },
] satisfies ReadonlyArray<{ href: Route; label: string }>;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="appShell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="Abhyas home">
          <span className="brandMark">A</span>
          <span>abhyas</span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <Link className="headerCta" href="/chapters">Start studying</Link>
      </header>
      {children}
      <footer className="footer">
        <span>abhyas · focused preparation for serious learners</span>
        <span>Built for study, practice and progress.</span>
      </footer>
    </div>
  );
}
