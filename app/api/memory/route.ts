import { NextRequest, NextResponse } from "next/server";
import { remember, recall, clearMemory } from "@/lib/memory";
import { requireSecret } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    requireSecret(req, "DEVO_API_SECRET");
    const key = req.nextUrl.searchParams.get("key") || undefined;
    return NextResponse.json({ ok: true, memory: recall(key) });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireSecret(req, "DEVO_API_SECRET");
    const body = await req.json();

    if (body.action === "remember") {
      return NextResponse.json({ ok: true, item: remember(body.key || "general", body.value) });
    }

    if (body.action === "recall") {
      return NextResponse.json({ ok: true, memory: recall(body.key) });
    }

    if (body.action === "clear") {
      clearMemory();
      return NextResponse.json({ ok: true, memory: [] });
    }

    return NextResponse.json({ ok: false, error: "Unknown memory action." }, { status: 400 });
  } catch (error: any) {
    const status = error.message?.startsWith("Unauthorized") ? 401 : 500;
    return NextResponse.json({ ok: false, error: error.message }, { status });
  }
}
