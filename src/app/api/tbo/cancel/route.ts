import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "@/lib/tbo/rest-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { confirmationNumber } = await req.json();
    if (!confirmationNumber) {
      return NextResponse.json({ error: "confirmationNumber required" }, { status: 400 });
    }
    const result = await cancelBooking(confirmationNumber);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Cancel failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
