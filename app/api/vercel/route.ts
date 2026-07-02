import { NextRequest, NextResponse } from "next/server";
import { requireSecret } from "@/lib/security";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Vercel deployment trigger API is running." });
}

export async function POST(req: NextRequest) {
  try {
    requireSecret(req, "DEVO_API_SECRET");
    const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!deployHook) throw new Error("Missing VERCEL_DEPLOY_HOOK_URL environment variable.");
    const res = await fetch(deployHook, { method: "POST" });
    return NextResponse.json({ ok: res.ok, action: "trigger_deploy", status: res.status, message: await res.text() });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: error.message?.startsWith("Unauthorized") ? 401 : 500 });
  }
}
