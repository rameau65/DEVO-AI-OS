import { NextRequest, NextResponse } from "next/server";
import { runEngine } from "@/lib/engines";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      ok: true,
      review: runEngine("quality_engine", body.input || "quality review", body.options || {})
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
