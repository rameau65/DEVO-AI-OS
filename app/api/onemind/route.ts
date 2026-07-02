import { NextRequest, NextResponse } from "next/server";
import { runOneMindEngine } from "@/lib/onemind";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "DEVO-AI-OS OneMind Engine is running.",
    philosophy: "Complex Knowledge → Story → Image → Experience → Change"
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic = body.topic || body.input || body.message || "";
    const output = runOneMindEngine(topic, body.options || {});
    return NextResponse.json({ ok: true, engine: "ONEMIND_ENGINE", output });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
