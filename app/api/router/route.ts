import { NextRequest, NextResponse } from "next/server";
import { detectIntent, engineRoutes } from "@/lib/engines";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body.input || body.message || body.topic || "";
    const intent = body.intent || detectIntent(input);
    const engines = body.engines || engineRoutes[intent] || engineRoutes.workflow;

    const workflowRes = await fetch(new URL("/api/workflows", req.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, input, intent, engines }),
    });

    const result = await workflowRes.json();

    return NextResponse.json({
      ok: true,
      intent,
      engines,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
