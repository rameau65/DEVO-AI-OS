import { NextRequest, NextResponse } from "next/server";
import { runEngine, EngineName } from "@/lib/engines";

export async function GET() {
  return NextResponse.json({
    ok: true,
    engines: [
      "story_engine",
      "novel_engine",
      "script_engine",
      "visual_engine",
      "video_engine",
      "seedance_engine",
      "music_engine",
      "meditation_engine",
      "ai_toon_engine",
      "infographic_engine",
      "documentary_engine",
      "education_engine",
      "brand_engine",
      "marketing_engine",
      "channel_engine",
      "canva_engine",
      "github_engine",
      "flow_engine",
      "quality_engine"
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const engine = body.engine as EngineName;
    const input = body.input || body.message || body.topic || "";
    const result = runEngine(engine, input, body.options || {});
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
