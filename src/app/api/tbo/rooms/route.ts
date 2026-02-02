import { NextRequest, NextResponse } from "next/server";
import { getAvailableRooms } from "@/lib/tbo/rest-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { hotelBookingCode } = await req.json();
    if (!hotelBookingCode) {
      return NextResponse.json({ error: "hotelBookingCode required" }, { status: 400 });
    }
    const result = await getAvailableRooms(hotelBookingCode);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to get rooms";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
