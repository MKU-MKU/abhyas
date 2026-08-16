import { NextResponse } from "next/server";

export async function GET(_request: Request, context: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await context.params;
  return NextResponse.json({
    error: "AUTHENTICATION_REQUIRED",
    message: "Attempt access requires an authenticated user.",
    attemptId,
  }, { status: 401 });
}

export async function PATCH(_request: Request, context: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await context.params;
  return NextResponse.json({
    error: "AUTHENTICATION_REQUIRED",
    message: "Attempt updates require an authenticated user.",
    attemptId,
  }, { status: 401 });
}
