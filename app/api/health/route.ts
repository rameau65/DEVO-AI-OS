import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "DEVO-AI-OS",
    version: "1.1",
    status: "healthy",
    features: [
      "GitHub auto commit",
      "GitHub PR creation",
      "Vercel deploy hook",
      "Canva Design Agent",
      "OpenAI API",
      "MCP endpoint",
      "Workflow Router",
      "Agent Memory"
    ]
  });
}
