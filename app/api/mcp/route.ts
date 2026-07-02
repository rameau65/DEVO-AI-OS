import { NextRequest, NextResponse } from "next/server";
import { requireSecret } from "@/lib/security";

const tools = [
  { name: "devo_onemind", description: "Run OneMind creative workflow.", input_schema: { type: "object", properties: { input: { type: "string" } }, required: ["input"] } },
  { name: "devo_router", description: "Route a creative request to DEVO-AI-OS engines.", input_schema: { type: "object", properties: { input: { type: "string" } }, required: ["input"] } },
  { name: "devo_canva", description: "Generate Canva Design Brief and Canva AI Prompt.", input_schema: { type: "object", properties: { input: { type: "string" } }, required: ["input"] } }
];

export async function GET(req: NextRequest) {
  try {
    requireSecret(req, "MCP_API_SECRET");
    return NextResponse.json({ ok: true, name: "DEVO-AI-OS v2.0 MCP Server", version: "2.0", tools });
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

    const endpoint = tool === "devo_onemind" ? "/api/onemind" : tool === "devo_canva" ? "/api/canva" : "/api/router";
    const res = await fetch(`${base}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    return NextResponse.json(await res.json());
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: error.message?.startsWith("Unauthorized") ? 401 : 500 });
  }
}
