import { NextRequest, NextResponse } from "next/server";
import { preBook } from "@/lib/tbo/rest-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { bookingCode } = await req.json();
    if (!bookingCode) {
      return NextResponse.json({ error: "bookingCode required" }, { status: 400 });
    }
    const result = await preBook(bookingCode);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PreBook failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
