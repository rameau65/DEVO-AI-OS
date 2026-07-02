import { NextRequest, NextResponse } from "next/server";
import { runEngine, EngineName } from "@/lib/engines";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body.input || body.message || body.topic || "";
    const engines = (body.engines || ["flow_engine", "story_engine", "visual_engine", "canva_engine", "quality_engine"]) as EngineName[];
    const results = engines.map((engine) => runEngine(engine, input, body.options || {}));

    return NextResponse.json({
      ok: true,
      workflow: { input, intent: body.intent || "workflow", engines, results },
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
