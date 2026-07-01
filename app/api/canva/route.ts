import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = body.topic || body.input || "Untitled Project";

    return NextResponse.json({
      ok: true,
      canva: {
        design_brief: {
          project: topic,
          audience: body.audience || "General audience",
          objective: body.objective || "Transform knowledge into clear visual communication",
          visual_style: "Modern, minimal, educational, cinematic",
          color_palette: ["deep blue", "white", "soft purple", "light gray"],
          typography: "Clean sans-serif",
          format: body.format || "Presentation",
          ratio: "16:9",
        },
        canva_ai_prompt: `Create a modern, minimal, educational Canva presentation about "${topic}". Use clear visual hierarchy, clean sans-serif typography, simple icons, diagrams, timeline sections, and minimal text. Make it visually calm, professional, and easy to understand. 16:9 ratio.`,
        asset_list: ["title slide", "icons", "timeline", "diagram", "summary card", "CTA slide"],
        layout_plan: [
          "Title",
          "Core Question",
          "Context",
          "Key Concepts",
          "Visual Explanation",
          "Insight",
          "Summary",
          "Call to Action",
        ],
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
