import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, message: "DEVO-AI-OS Canva API is running." });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const topic = body.topic || body.input || "Untitled Project";

  return NextResponse.json({
    ok: true,
    canva: {
      design_brief: {
        project: topic,
        style: "Modern, minimal, educational, cinematic",
        ratio: "16:9"
      },
      canva_ai_prompt: `Create a modern educational Canva presentation about "${topic}". Use clear visual hierarchy, clean sans-serif typography, simple icons, diagrams, minimal text, and calm professional design.`,
      asset_list: ["title slide", "icons", "timeline", "diagram", "summary card", "CTA slide"]
    }
  });
}
