import { runOneMindEngine } from "@/lib/onemind";

export type EngineName =
  | "onemind_engine"
  | "story_engine"
  | "visual_engine"
  | "video_engine"
  | "seedance_engine"
  | "music_engine"
  | "meditation_engine"
  | "infographic_engine"
  | "education_engine"
  | "brand_engine"
  | "marketing_engine"
  | "channel_engine"
  | "documentary_engine"
  | "canva_engine"
  | "github_engine"
  | "vercel_engine"
  | "mcp_engine"
  | "memory_engine"
  | "flow_engine"
  | "quality_engine";

export function detectIntent(input: string) {
  const text = (input || "").toLowerCase();
  if (text.includes("onemind") || text.includes("one mind") || text.includes("원마인드") || text.includes("전체 워크플로")) return "onemind";
  if (text.includes("github") || text.includes("commit") || text.includes("pr") || text.includes("pull request")) return "github";
  if (text.includes("vercel") || text.includes("deploy") || text.includes("배포")) return "vercel";
  if (text.includes("mcp")) return "mcp";
  if (text.includes("memory") || text.includes("기억")) return "memory";
  if (text.includes("canva") || text.includes("ppt") || text.includes("presentation") || text.includes("slide")) return "canva";
  if (text.includes("youtube") || text.includes("유튜브")) return "youtube";
  if (text.includes("brand") || text.includes("브랜드")) return "brand";
  if (text.includes("documentary") || text.includes("다큐")) return "documentary";
  if (text.includes("video") || text.includes("영상") || text.includes("seedance")) return "video";
  if (text.includes("music") || text.includes("suno") || text.includes("음악")) return "music";
  if (text.includes("meditation") || text.includes("명상")) return "meditation";
  if (text.includes("infographic") || text.includes("인포그래픽")) return "infographic";
  if (text.includes("education") || text.includes("교육") || text.includes("강의")) return "education";
  if (text.includes("image") || text.includes("midjourney") || text.includes("visual") || text.includes("이미지")) return "visual";
  return "onemind";
}

export const engineRoutes: Record<string, EngineName[]> = {
  onemind: ["onemind_engine", "quality_engine"],
  github: ["github_engine", "quality_engine"],
  vercel: ["vercel_engine", "quality_engine"],
  mcp: ["mcp_engine", "quality_engine"],
  memory: ["memory_engine", "quality_engine"],
  canva: ["onemind_engine", "canva_engine", "quality_engine"],
  youtube: ["onemind_engine", "story_engine", "visual_engine", "video_engine", "music_engine", "channel_engine", "quality_engine"],
  brand: ["onemind_engine", "story_engine", "visual_engine", "brand_engine", "marketing_engine", "canva_engine", "quality_engine"],
  documentary: ["onemind_engine", "story_engine", "documentary_engine", "visual_engine", "video_engine", "music_engine", "quality_engine"],
  video: ["onemind_engine", "story_engine", "visual_engine", "seedance_engine", "music_engine", "quality_engine"],
  music: ["music_engine", "quality_engine"],
  meditation: ["meditation_engine", "music_engine", "quality_engine"],
  infographic: ["onemind_engine", "infographic_engine", "canva_engine", "quality_engine"],
  education: ["onemind_engine", "education_engine", "infographic_engine", "canva_engine", "quality_engine"],
  visual: ["onemind_engine", "visual_engine", "quality_engine"],
  workflow: ["onemind_engine", "flow_engine", "quality_engine"],
};

export function runEngine(engine: EngineName, input: string, options: any = {}) {
  switch (engine) {
    case "onemind_engine":
      return { engine, output: runOneMindEngine(input, options) };
    case "story_engine":
      return { engine, output: { core_message: `핵심 메시지: ${input}`, structure: ["Question", "Conflict", "Discovery", "Transformation", "Insight"] } };
    case "visual_engine":
      return { engine, output: { midjourney_prompt: `Cinematic educational visual about "${input}", symbolic composition, clear hierarchy, 16:9` } };
    case "video_engine":
    case "seedance_engine":
      return { engine, output: { video_prompt: `Cinematic knowledge-design video about "${input}", documentary tone, clean transitions.` } };
    case "music_engine":
      return { engine, output: { suno_prompt: `Ambient cinematic soundtrack for "${input}", warm piano, soft strings, hopeful mood.` } };
    case "meditation_engine":
      return { engine, output: { meditation_structure: ["Breath", "Awareness", "Inner Scene", "Release", "Integration"] } };
    case "infographic_engine":
      return { engine, output: { layout: ["Title", "Core Problem", "Knowledge Map", "Process Flow", "Insight", "Action"] } };
    case "education_engine":
      return { engine, output: { learning_flow: ["Learn", "Understand", "Apply", "Create", "Teach"] } };
    case "canva_engine":
      return { engine, output: { canva_ai_prompt: `Create a modern educational Canva presentation about "${input}". Clear hierarchy, simple icons, diagrams, minimal text, 16:9.` } };
    case "github_engine":
      return { engine, output: { api: "/api/github", actions: ["read_file", "write_file", "create_branch", "create_pr", "refactor_commit_pr"] } };
    case "vercel_engine":
      return { engine, output: { api: "/api/vercel", actions: ["trigger_deploy"] } };
    case "mcp_engine":
      return { engine, output: { api: "/api/mcp", tools: ["devo_router", "devo_onemind", "devo_canva", "devo_memory"] } };
    case "memory_engine":
      return { engine, output: { api: "/api/memory", actions: ["remember", "recall", "clear"] } };
    case "quality_engine":
      return { engine, output: { checklist: { clarity: true, coherence: true, educational_value: true, reusability: true, publication_ready: true } } };
    default:
      return { engine, output: { workflow: "DEVO-AI-OS workflow initialized." } };
  }
}
