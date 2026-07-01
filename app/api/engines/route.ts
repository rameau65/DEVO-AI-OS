import { NextRequest, NextResponse } from "next/server";

type EngineName =
  | "story_engine"
  | "visual_engine"
  | "seedance_engine"
  | "music_engine"
  | "meditation_engine"
  | "canva_engine"
  | "github_engine"
  | "flow_engine"
  | "quality_engine";

function runEngine(engine: EngineName, input: string) {
  switch (engine) {
    case "story_engine":
      return {
        engine,
        output: {
          core_message: `핵심 메시지: ${input}`,
          structure: ["Hook", "Context", "Conflict", "Discovery", "Insight", "Call to Action"],
        },
      };

    case "visual_engine":
      return {
        engine,
        output: {
          midjourney_prompt: `Create a cinematic, educational visual about: ${input}. modern minimal style, clear symbolic composition, high visual hierarchy, 16:9`,
        },
      };

    case "seedance_engine":
      return {
        engine,
        output: {
          video_prompt: `Create a cinematic educational video sequence about: ${input}. Use slow camera movement, clear scene transitions, emotional build-up, documentary tone.`,
        },
      };

    case "music_engine":
      return {
        engine,
        output: {
          suno_prompt: `Ambient cinematic educational soundtrack for: ${input}. Warm piano, soft strings, subtle pulse, reflective and hopeful mood.`,
        },
      };

    case "meditation_engine":
      return {
        engine,
        output: {
          meditation_structure: ["Breath", "Awareness", "Inner Scene", "Release", "Integration"],
        },
      };

    case "canva_engine":
      return {
        engine,
        output: {
          design_brief: {
            project: input,
            style: "Modern, minimal, educational, cinematic",
            format: "Presentation / Infographic",
            ratio: "16:9",
          },
          canva_ai_prompt: `Create a modern educational Canva presentation about "${input}". Use clean typography, clear visual hierarchy, simple icons, minimal text, cinematic but readable design, 16:9 ratio.`,
          asset_list: ["icons", "timeline", "diagram", "section cards", "summary slide"],
        },
      };

    case "github_engine":
      return {
        engine,
        output: {
          note: "GitHub actions require GITHUB_TOKEN and repository configuration.",
          planned_actions: ["create_branch", "update_files", "commit", "create_pr"],
        },
      };

    case "quality_engine":
      return {
        engine,
        output: {
          checklist: {
            clarity: true,
            story_coherence: true,
            visual_consistency: true,
            educational_value: true,
            reusable_output: true,
          },
        },
      };

    default:
      return {
        engine,
        output: {
          workflow: "Complete DEVO-AI-OS creative workflow executed.",
        },
      };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const engine = body.engine as EngineName;
    const input = body.input || body.message || body.topic || "";

    const result = runEngine(engine, input);

    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
