import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abhyas — Smart exam preparation",
  description: "Focused practice, exams, revision and progress for serious learners.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
