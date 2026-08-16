import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "abhyas-web",
    timestamp: new Date().toISOString(),
  });
}
