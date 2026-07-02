import { NextRequest, NextResponse } from "next/server";
import { requireSecret } from "@/lib/security";

const tools = [
  {
    name: "devo_router",
    description: "Route a creative request to DEVO-AI-OS engines.",
    input_schema: {
      type: "object",
      properties: { input: { type: "string" } },
      required: ["input"]
    }
  },
  {
    name: "devo_canva",
    description: "Generate Canva Design Brief and Canva AI Prompt.",
    input_schema: {
      type: "object",
      properties: { input: { type: "string" } },
      required: ["input"]
    }
  },
  {
    name: "devo_memory",
    description: "Remember or recall agent memory.",
    input_schema: {
      type: "object",
      properties: { action: { type: "string" }, key: { type: "string" }, value: {} },
      required: ["action"]
    }
  }
];

export async function GET(req: NextRequest) {
  try {
    requireSecret(req, "MCP_API_SECRET");
    return NextResponse.json({
      ok: true,
      name: "DEVO-AI-OS MCP Server",
      version: "1.1",
      tools
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireSecret(req, "MCP_API_SECRET");
    const body = await req.json();
    const tool = body.tool || body.name;
    const input = body.input || body.arguments || {};

    const base = new URL(req.url).origin;

    if (tool === "devo_router") {
      const res = await fetch(`${base}/api/router`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      return NextResponse.json(await res.json());
    }

    if (tool === "devo_canva") {
      const res = await fetch(`${base}/api/canva`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      return NextResponse.json(await res.json());
    }

    if (tool === "devo_memory") {
      const res = await fetch(`${base}/api/memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-devo-secret": process.env.DEVO_API_SECRET || "" },
        body: JSON.stringify(input)
      });
      return NextResponse.json(await res.json());
    }

    return NextResponse.json({ ok: false, error: "Unknown MCP tool." }, { status: 400 });
  } catch (error: any) {
    const status = error.message?.startsWith("Unauthorized") ? 401 : 500;
    return NextResponse.json({ ok: false, error: error.message }, { status });
  }
}
