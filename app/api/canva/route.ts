import { NextRequest, NextResponse } from "next/server";
import { runOneMindEngine } from "@/lib/onemind";
import { buildCanvaAiPrompt, createCanvaDesign, CanvaDesignPreset } from "@/lib/canva";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "DEVO Canva Design Agent",
    mode: process.env.CANVA_ACCESS_TOKEN ? "live_canva_api" : "brief_only",
    message: "POST an input command to create a Canva-ready design brief and, when CANVA_ACCESS_TOKEN is configured, a real Canva editable design link."
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body.input || body.topic || "Untitled Canva Project";
    const options = body.options || {};
    const onemind = runOneMindEngine(input, options);

    const title = body.title || `DEVO - ${input}`.slice(0, 255);
    const preset = (body.preset || options.preset || "presentation") as CanvaDesignPreset;
    const width = body.width || options.width;
    const height = body.height || options.height;
    const pages = body.pages || options.pages || 10;
    const shouldCreate = body.create !== false;

    const designBrief = {
      ...onemind.outputs.canva_design_brief,
      title,
      pages,
      preset,
      width: width || null,
      height: height || null
    };

    const canvaAiPrompt = buildCanvaAiPrompt({
      topic: input,
      format: options.format || preset,
      audience: options.audience,
      style: options.style || designBrief.style,
      ratio: designBrief.ratio,
      pages,
      designBrief
    });

    let canvaDesign = null;
    let liveCreateError = null;

    if (shouldCreate) {
      try {
        canvaDesign = await createCanvaDesign({
          title,
          preset,
          width,
          height,
          assetId: body.asset_id || options.asset_id
        });
      } catch (error: any) {
        liveCreateError = error.message;
      }
    }

    return NextResponse.json({
      ok: true,
      role: "Canva Design Agent powered by OneMind",
      mode: canvaDesign ? "live_canva_api" : "brief_only",
      command: input,
      canva: {
        design_brief: designBrief,
        canva_ai_prompt: canvaAiPrompt,
        editable_design: canvaDesign,
        edit_url: canvaDesign?.edit_url || null,
        view_url: canvaDesign?.view_url || null,
        asset_list: ["cover", "knowledge map", "timeline", "diagram", "summary card", "CTA slide"]
      },
      setup_required: canvaDesign
        ? null
        : {
            reason: liveCreateError || "Live Canva design creation skipped.",
            next_step: "Add CANVA_ACCESS_TOKEN to Vercel environment variables after Canva OAuth authorization."
          }
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
