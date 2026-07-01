import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "DEVO-AI-OS /api/openai is running. Use POST to send input."
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body.input || body.message || body.topic || "";

    return NextResponse.json({
      ok: true,
      source: "DEVO-AI-OS /api/openai",
      input,
      engines: [
        "story_engine",
        "visual_engine",
        "seedance_engine",
        "music_engine",
        "quality_engine",
        "canva_engine"
      ],
      output: {
        core_message: `핵심 메시지: ${input}`,
        story_structure: ["Hook", "Context", "Conflict", "Discovery", "Insight", "Call to Action"],
        canva_ai_prompt: `Create a modern educational Canva presentation about "${input}". Use clean typography, clear visual hierarchy, simple icons, diagrams, minimal text, and 16:9 ratio.`,
        midjourney_prompt: `Cinematic educational visual about ${input}, modern minimal design, symbolic composition, high clarity, 16:9`,
        video_prompt: `Create a cinematic educational video sequence about ${input}, slow camera movement, documentary tone, clear transitions.`,
        music_prompt: `Ambient cinematic soundtrack for ${input}, warm piano, soft strings, reflective and hopeful mood.`,
        quality_review: "Ready for next production step."
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
