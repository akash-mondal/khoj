import { NextRequest, NextResponse } from "next/server";
import { getCityList } from "@/lib/tbo/rest-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { countryCode } = await req.json();
    if (!countryCode) {
      return NextResponse.json({ error: "countryCode required" }, { status: 400 });
    }
    const result = await getCityList(countryCode);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
