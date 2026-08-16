import { NextResponse } from "next/server";
import { validateCreateAttemptCommand } from "@abhyas/application";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const command = validateCreateAttemptCommand(body);
    return NextResponse.json({ error: "AUTHENTICATION_REQUIRED", mode: command.mode, questionIds: command.questionIds }, { status: 401 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request.";
    return NextResponse.json({ error: "INVALID_REQUEST", message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "AUTHENTICATION_REQUIRED" }, { status: 401 });
}
