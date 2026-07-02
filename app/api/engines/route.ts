import { NextRequest, NextResponse } from "next/server";
import { runEngine, EngineName } from "@/lib/engines";

export async function GET() {
  return NextResponse.json({
    ok: true,
    engines: [
      "onemind_engine",
      "story_engine",
      "visual_engine",
      "video_engine",
      "seedance_engine",
      "music_engine",
      "meditation_engine",
      "infographic_engine",
      "education_engine",
      "canva_engine",
      "github_engine",
      "vercel_engine",
      "mcp_engine",
      "memory_engine",
      "quality_engine"
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = runEngine(body.engine as EngineName, body.input || body.message || body.topic || "", body.options || {});
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
