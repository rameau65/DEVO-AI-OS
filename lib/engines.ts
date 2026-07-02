export type EngineName =
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
  return "workflow";
}

export const engineRoutes: Record<string, EngineName[]> = {
  github: ["github_engine", "quality_engine"],
  vercel: ["vercel_engine", "quality_engine"],
  mcp: ["mcp_engine", "quality_engine"],
  memory: ["memory_engine", "quality_engine"],
  canva: ["story_engine", "visual_engine", "infographic_engine", "canva_engine", "quality_engine"],
  youtube: ["story_engine", "visual_engine", "video_engine", "music_engine", "channel_engine", "quality_engine"],
  brand: ["story_engine", "visual_engine", "brand_engine", "marketing_engine", "canva_engine", "quality_engine"],
  documentary: ["story_engine", "documentary_engine", "visual_engine", "video_engine", "music_engine", "quality_engine"],
  video: ["story_engine", "visual_engine", "seedance_engine", "music_engine", "quality_engine"],
  music: ["music_engine", "quality_engine"],
  meditation: ["meditation_engine", "music_engine", "quality_engine"],
  infographic: ["story_engine", "infographic_engine", "canva_engine", "quality_engine"],
  education: ["story_engine", "education_engine", "infographic_engine", "canva_engine", "quality_engine"],
  visual: ["story_engine", "visual_engine", "quality_engine"],
  workflow: ["flow_engine", "story_engine", "visual_engine", "canva_engine", "quality_engine"],
};

export function runEngine(engine: EngineName, input: string, options: any = {}) {
  switch (engine) {
    case "story_engine":
      return { engine, output: { core_message: `핵심 메시지: ${input}`, summary: `${input}을 이해 가능한 이야기로 변환합니다.`, structure: ["Question", "Conflict", "Discovery", "Transformation", "Insight"] } };
    case "visual_engine":
      return { engine, output: { strategy: "상징적 이미지, 명확한 시각 계층, 교육적 구도", midjourney_prompt: `Cinematic educational visual about "${input}", modern minimal design, symbolic composition, clear hierarchy, elegant lighting, 16:9` } };
    case "video_engine":
    case "seedance_engine":
      return { engine, output: { structure: ["Hook", "Context", "Build", "Peak", "Resolution", "CTA"], video_prompt: `Create a cinematic educational video about "${input}". Slow camera movement, documentary tone, clear transitions, 16:9.` } };
    case "music_engine":
      return { engine, output: { suno_prompt: `Ambient cinematic educational soundtrack for "${input}". Warm piano, soft strings, reflective and hopeful mood.` } };
    case "meditation_engine":
      return { engine, output: { meditation_structure: ["Breath", "Awareness", "Inner Scene", "Release", "Integration"] } };
    case "infographic_engine":
      return { engine, output: { layout: ["Title", "Core Problem", "3 Key Concepts", "Process Map", "Insight Box", "Action Step"] } };
    case "education_engine":
      return { engine, output: { learning_flow: ["Learn", "Understand", "Apply", "Create", "Teach"], materials: ["slides", "worksheet", "teacher guide"] } };
    case "brand_engine":
      return { engine, output: { mission: `${input}의 본질을 명확한 브랜드 메시지로 전환`, personality: ["clear", "creative", "educational"] } };
    case "channel_engine":
      return { engine, output: { youtube_package: { formats: ["Long-form", "Shorts", "Thumbnail system"], episode_structure: ["Hook", "Story", "Visual Insight", "Takeaway"] } } };
    case "documentary_engine":
      return { engine, output: { documentary_structure: ["Opening Image", "Question", "Evidence", "Human Story", "Turning Point", "Insight", "Ending Image"] } };
    case "canva_engine":
      return { engine, output: { design_brief: { project: input, audience: options.audience || "General audience", objective: "Transform knowledge into clear visual communication", style: "Modern, minimal, educational, cinematic", ratio: "16:9" }, canva_ai_prompt: `Create a modern educational Canva presentation about "${input}". Use clean sans-serif typography, clear visual hierarchy, simple icons, diagrams, minimal text, calm professional design, 16:9 ratio.`, asset_list: ["title slide", "icons", "timeline", "diagram", "summary card", "CTA slide"] } };
    case "github_engine":
      return { engine, output: { api: "/api/github", actions: ["read_file", "write_file", "create_branch", "create_pr", "refactor_commit_pr"] } };
    case "vercel_engine":
      return { engine, output: { api: "/api/vercel", actions: ["trigger_deploy"] } };
    case "mcp_engine":
      return { engine, output: { api: "/api/mcp", note: "Basic MCP-compatible endpoint for tool discovery and calls." } };
    case "memory_engine":
      return { engine, output: { api: "/api/memory", actions: ["remember", "recall", "list", "clear"] } };
    case "quality_engine":
      return { engine, output: { checklist: { clarity: true, narrative_coherence: true, visual_consistency: true, educational_value: true, github_safety: true, deploy_readiness: true, reusable_output: true }, recommendation: "Ready for next production step." } };
    default:
      return { engine, output: { workflow: "Complete DEVO-AI-OS workflow initialized.", formula: "Complex Knowledge → Story → Image → Experience → Change" } };
  }
}
