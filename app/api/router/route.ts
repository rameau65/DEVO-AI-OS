import { NextRequest, NextResponse } from "next/server";

const engineMap: Record<string, string[]> = {
  story: ["story_engine", "quality_engine"],
  visual: ["story_engine", "visual_engine", "quality_engine"],
  video: ["story_engine", "visual_engine", "seedance_engine", "music_engine", "quality_engine"],
  music: ["music_engine", "quality_engine"],
  meditation: ["meditation_engine", "music_engine", "quality_engine"],
  canva: ["story_engine", "visual_engine", "canva_engine", "quality_engine"],
  github: ["github_engine", "quality_engine"],
  workflow: ["flow_engine", "quality_engine"],
};

function detectIntent(input: string) {
  const text = input.toLowerCase();

  if (text.includes("github") || text.includes("commit") || text.includes("pr")) return "github";
  if (text.includes("canva") || text.includes("ppt") || text.includes("presentation")) return "canva";
  if (text.includes("video") || text.includes("hailuo") || text.includes("seedance")) return "video";
  if (text.includes("music") || text.includes("suno")) return "music";
  if (text.includes("meditation") || text.includes("명상")) return "meditation";
  if (text.includes("image") || text.includes("midjourney") || text.includes("visual")) return "visual";

  return "workflow";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userInput = body.input || body.message || body.topic || "";
    const intent = body.intent || detectIntent(userInput);
    const engines = engineMap[intent] || engineMap.workflow;

    const workflowRes = await fetch(new URL("/api/workflows", req.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, intent, engines }),
    });

    const result = await workflowRes.json();

    return NextResponse.json({
      ok: true,
      intent,
      engines,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
