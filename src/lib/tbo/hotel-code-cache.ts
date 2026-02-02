import { getHotelCodeList } from "./rest-client";

interface CacheEntry {
  codes: string[];
  fetchedAt: number;
}

// In-memory cache of hotel codes per city — survives across requests in the same server process
const cache = new Map<string, CacheEntry>();

// Cache for 1 hour (hotel code lists don't change frequently)
const CACHE_TTL = 60 * 60 * 1000;

export async function getHotelCodesForCity(cityCode: string): Promise<string[]> {
  const entry = cache.get(cityCode);
  if (entry && Date.now() - entry.fetchedAt < CACHE_TTL) {
    return entry.codes;
  }

  const codes = await getHotelCodeList(cityCode);
  cache.set(cityCode, { codes, fetchedAt: Date.now() });
  return codes;
}

/**
 * Search hotels in batches. TBO HotelSearch works with HotelCodes (not CityCode).
 * We batch codes (max 300 per request) to find available hotels.
 * Start from offset 500 — early codes in TBO lists often have no availability.
 */
export function batchHotelCodes(
  codes: string[],
  batchSize = 300,
  startOffset = 0,
  maxBatches = 3
): string[][] {
  const batches: string[][] = [];
  let offset = startOffset;

  for (let i = 0; i < maxBatches && offset < codes.length; i++) {
    const batch = codes.slice(offset, offset + batchSize);
    if (batch.length > 0) {
      batches.push(batch);
    }
    offset += batchSize;
  }

  return batches;
}
