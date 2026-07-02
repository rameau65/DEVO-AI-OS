export type CanvaDesignPreset = "doc" | "email" | "presentation" | "whiteboard";

export type CanvaCreateDesignInput = {
  title: string;
  preset?: CanvaDesignPreset;
  width?: number;
  height?: number;
  assetId?: string;
  accessToken?: string;
};

export type CanvaCreateDesignResult = {
  id?: string;
  title?: string;
  edit_url?: string;
  view_url?: string;
  thumbnail_url?: string;
  raw: any;
};

const CANVA_API_BASE = "https://api.canva.com/rest/v1";

function assertValidCustomSize(width: number, height: number) {
  if (width < 40 || width > 8000 || height < 40 || height > 8000) {
    throw new Error("Custom Canva design dimensions must be between 40 and 8000 pixels.");
  }

  if (width * height > 25_000_000) {
    throw new Error("Custom Canva design area must not exceed 25,000,000 pixels.");
  }
}

export function buildCanvaDesignBody(input: CanvaCreateDesignInput) {
  const title = input.title?.trim() || "DEVO Canva Project";

  if (input.width && input.height) {
    assertValidCustomSize(input.width, input.height);

    return {
      type: "type_and_asset",
      design_type: {
        type: "custom",
        width: input.width,
        height: input.height
      },
      ...(input.assetId ? { asset_id: input.assetId } : {}),
      title
    };
  }

  return {
    type: "type_and_asset",
    design_type: {
      type: "preset",
      name: input.preset || "presentation"
    },
    ...(input.assetId ? { asset_id: input.assetId } : {}),
    title
  };
}

export async function createCanvaDesign(input: CanvaCreateDesignInput): Promise<CanvaCreateDesignResult> {
  const accessToken = input.accessToken || process.env.CANVA_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Missing CANVA_ACCESS_TOKEN. Add a Canva OAuth access token to Vercel environment variables.");
  }

  const response = await fetch(`${CANVA_API_BASE}/designs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(buildCanvaDesignBody(input))
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Canva API error: ${response.status}`);
  }

  const design = data.design || {};

  return {
    id: design.id,
    title: design.title,
    edit_url: design.urls?.edit_url,
    view_url: design.urls?.view_url,
    thumbnail_url: design.thumbnail?.url,
    raw: data
  };
}

export function buildCanvaAiPrompt(params: {
  topic: string;
  format?: string;
  audience?: string;
  style?: string;
  ratio?: string;
  pages?: number;
  designBrief?: any;
}) {
  const pages = params.pages || 10;
  const format = params.format || "presentation";
  const audience = params.audience || "general audience";
  const style = params.style || "modern minimal cinematic educational";
  const ratio = params.ratio || "16:9";

  return [
    `Create an editable Canva ${format} about: ${params.topic}`,
    `Audience: ${audience}`,
    `Format: ${format}, ${ratio}, ${pages} pages/cards/slides`,
    `Visual style: ${style}`,
    "Use clean Korean typography, strong hierarchy, simple icons, diagrams, and generous whitespace.",
    "Structure: cover, core message, problem/context, knowledge map, 3 key ideas, process flow, visual example, summary, call to action.",
    "Keep text concise and make every page directly editable in Canva.",
    params.designBrief ? `Design brief JSON: ${JSON.stringify(params.designBrief)}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}
