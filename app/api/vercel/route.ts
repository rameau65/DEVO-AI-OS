import { NextRequest, NextResponse } from "next/server";
import { requireSecret } from "@/lib/security";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Vercel deployment trigger API is running.",
    required_env: "VERCEL_DEPLOY_HOOK_URL"
  });
}

export async function POST(req: NextRequest) {
  try {
    requireSecret(req, "DEVO_API_SECRET");

    const deployHook = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!deployHook) throw new Error("Missing VERCEL_DEPLOY_HOOK_URL environment variable.");

    const body = await req.json().catch(() => ({}));
    const res = await fetch(deployHook, { method: "POST" });
    const text = await res.text();

    return NextResponse.json({
      ok: res.ok,
      action: "trigger_deploy",
      status: res.status,
      message: text,
      request: body
    });
  } catch (error: any) {
    const status = error.message?.startsWith("Unauthorized") ? 401 : 500;
    return NextResponse.json({ ok: false, error: error.message }, { status });
  }
}
