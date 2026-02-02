import { NextRequest, NextResponse } from "next/server";
import { CITY_MAP } from "@/config/constants";
import { getHotelCodesForCity, batchHotelCodes } from "@/lib/tbo/hotel-code-cache";
import { searchHotels } from "@/lib/tbo/rest-client";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { city, checkIn, checkOut, rooms = 1, adults = 2, stars, maxPrice } = body;

    const cityInfo = Object.entries(CITY_MAP).find(
      ([k]) => k.toLowerCase() === String(city).toLowerCase()
    );

    if (!cityInfo) {
      return NextResponse.json(
        { error: `City not found. Available: ${Object.keys(CITY_MAP).join(", ")}` },
        { status: 400 }
      );
    }

    const allCodes = await getHotelCodesForCity(cityInfo[1].code);
    const batches = batchHotelCodes(allCodes, 300, 500, 2);
    const hotels = [];

    for (const batch of batches) {
      const result = await searchHotels({
        hotelCodes: batch.join(","),
        checkIn,
        checkOut,
        rooms: Array.from({ length: rooms }, () => ({ adults, children: 0 })),
        filters: {
          starRating: stars ? String(stars) : "All",
          orderBy: "PriceAsc",
          ...(maxPrice ? { maxPrice } : {}),
        },
      });

      if (result.hotels.length > 0) {
        hotels.push(...result.hotels);
      }
      if (hotels.length >= 20) break;
    }

    return NextResponse.json({ hotels: hotels.slice(0, 20), total: hotels.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
