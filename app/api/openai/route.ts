import { NextRequest, NextResponse } from "next/server";
import { getOpenAI, getOpenAIModel } from "@/lib/openai";

export async function GET() {
  return NextResponse.json({ ok: true, message: "DEVO-AI-OS OpenAI API is running. Use POST." });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body.input || body.message || body.topic || "";

    if (body.use_openai === true) {
      const client = getOpenAI();
      const response = await client.responses.create({
        model: getOpenAIModel(),
        input: `You are DEVO-AI-OS v2.0 with OneMind Engine. Create reusable creative outputs for: ${input}`
      });
      return NextResponse.json({ ok: true, source: "openai", output_text: response.output_text });
    }

    const routerRes = await fetch(new URL("/api/router", req.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return NextResponse.json({ ok: true, source: "router", result: await routerRes.json() });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
