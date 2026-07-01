import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json({
      ok: true,
      review: {
        clarity: "pass",
        narrative_coherence: "pass",
        visual_strategy: "pass",
        educational_value: "pass",
        reusability: "pass",
        recommendation: "Ready for next production step.",
        input: body,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
