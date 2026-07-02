import { NextRequest, NextResponse } from "next/server";
import { runEngine } from "@/lib/engines";

export async function GET() {
  return NextResponse.json({ ok: true, message: "DEVO-AI-OS Canva Agent API is running." });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body.input || body.topic || "Untitled Project";
    const canva = runEngine("canva_engine", input, body.options || {});

    return NextResponse.json({
      ok: true,
      role: "Canva as Design Agent",
      canva,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
