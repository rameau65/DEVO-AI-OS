import { NextRequest, NextResponse } from "next/server";
import { runEngine } from "@/lib/engines";

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({ ok: true, review: runEngine("quality_engine", body.input || "quality review") });
}
