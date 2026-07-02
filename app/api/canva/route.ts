import { NextRequest, NextResponse } from "next/server";
import { runOneMindEngine } from "@/lib/onemind";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Canva Design Agent with OneMind is running." });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body.input || body.topic || "Untitled Project";
    const onemind = runOneMindEngine(input, body.options || {});
    return NextResponse.json({
      ok: true,
      role: "Canva Design Agent powered by OneMind",
      canva: {
        design_brief: onemind.outputs.canva_design_brief,
        canva_ai_prompt: onemind.outputs.canva_ai_prompt,
        asset_list: ["title slide", "knowledge map", "timeline", "diagram", "summary card", "CTA slide"]
      }
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
