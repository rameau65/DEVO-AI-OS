import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "DEVO-AI-OS",
    version: "1.0",
    status: "healthy",
    endpoints: [
      "/api/openai",
      "/api/router",
      "/api/engines",
      "/api/workflows",
      "/api/quality",
      "/api/canva",
      "/api/github"
    ]
  });
}
