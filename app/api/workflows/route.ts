import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const engines: string[] = body.engines || ["flow_engine", "quality_engine"];
    const input = body.input || body.message || body.topic || "";

    const results = [];

    for (const engine of engines) {
      const res = await fetch(new URL("/api/engines", req.url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engine, input }),
      });

      results.push(await res.json());
    }

    return NextResponse.json({
      ok: true,
      workflow: {
        input,
        engines,
        results,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
