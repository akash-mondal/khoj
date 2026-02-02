import { NextRequest, NextResponse } from "next/server";
import { getHotelDetails } from "@/lib/tbo/rest-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { hotelCode } = await req.json();
    if (!hotelCode) {
      return NextResponse.json({ error: "hotelCode required" }, { status: 400 });
    }
    const result = await getHotelDetails(hotelCode);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
