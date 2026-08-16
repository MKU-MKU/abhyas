import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    error: "AUTHENTICATION_REQUIRED",
    message: "Attempt endpoints require an authenticated user.",
  }, { status: 401 });
}

export async function POST() {
  return NextResponse.json({
    error: "AUTHENTICATION_REQUIRED",
    message: "Attempt creation requires an authenticated user.",
  }, { status: 401 });
}
