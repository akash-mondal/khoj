import { NextRequest, NextResponse } from "next/server";
import { bookHotel } from "@/lib/tbo/rest-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingCode, clientRef, guestTitle, guestFirstName, guestLastName } = body;
    if (!bookingCode || !guestFirstName || !guestLastName) {
      return NextResponse.json({ error: "bookingCode, guestFirstName, guestLastName required" }, { status: 400 });
    }
    const result = await bookHotel({
      bookingCode,
      clientRef: clientRef || `KHOJ-${Date.now()}`,
      guests: [{ title: guestTitle || "Mr", firstName: guestFirstName, lastName: guestLastName, type: "Adult" }],
    });
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Booking failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
