import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "AUTHENTICATION_REQUIRED" }, { status: 401 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    const { mode, questionIds } = body as Record<string, unknown>;
    const validModes = ["practice", "timed-exam", "flashcard", "daily-challenge", "psycho"];
    if (typeof mode !== "string" || !validModes.includes(mode)) return NextResponse.json({ error: "INVALID_MODE" }, { status: 400 });
    if (!Array.isArray(questionIds) || questionIds.length === 0 || questionIds.some((id) => typeof id !== "string")) return NextResponse.json({ error: "INVALID_QUESTION_IDS" }, { status: 400 });
    return NextResponse.json({ error: "AUTHENTICATION_REQUIRED" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }
}
