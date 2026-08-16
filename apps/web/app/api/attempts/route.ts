import { NextResponse } from "next/server";
import { parseCreateAttemptBody } from "./contracts";

export async function GET() {
  return NextResponse.json({
    error: "AUTHENTICATION_REQUIRED",
    message: "Attempt endpoints require an authenticated user.",
  }, { status: 401 });
}

export async function POST(request: Request) {
  try {
    const body = parseCreateAttemptBody(await request.json());
    return NextResponse.json({
      error: "AUTHENTICATION_REQUIRED",
      message: "Attempt creation requires an authenticated user.",
      requested: body,
    }, { status: 401 });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "INVALID_BODY",
    }, { status: 400 });
  }
}
