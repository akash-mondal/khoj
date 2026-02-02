import { describe, it, expect } from "vitest";
import { batchHotelCodes } from "@/lib/tbo/hotel-code-cache";

describe("batchHotelCodes", () => {
  const codes = Array.from({ length: 2000 }, (_, i) => `H${String(i).padStart(5, "0")}`);

  it("returns correct number of batches", () => {
    const batches = batchHotelCodes(codes, 300, 0, 3);
    expect(batches).toHaveLength(3);
    expect(batches[0]).toHaveLength(300);
    expect(batches[1]).toHaveLength(300);
    expect(batches[2]).toHaveLength(300);
  });

  it("respects startOffset", () => {
    const batches = batchHotelCodes(codes, 300, 500, 2);
    expect(batches).toHaveLength(2);
    expect(batches[0][0]).toBe("H00500");
    expect(batches[0]).toHaveLength(300);
    expect(batches[1][0]).toBe("H00800");
  });

  it("returns empty array when offset exceeds codes length", () => {
    const batches = batchHotelCodes(codes, 300, 5000, 3);
    expect(batches).toHaveLength(0);
  });

  it("handles last batch being smaller", () => {
    const smallCodes = codes.slice(0, 500);
    const batches = batchHotelCodes(smallCodes, 300, 0, 3);
    expect(batches).toHaveLength(2);
    expect(batches[0]).toHaveLength(300);
    expect(batches[1]).toHaveLength(200);
  });

  it("returns empty for empty codes array", () => {
    const batches = batchHotelCodes([], 300, 0, 3);
    expect(batches).toHaveLength(0);
  });

  it("defaults work correctly", () => {
    const batches = batchHotelCodes(codes);
    // Default: batchSize=300, startOffset=0, maxBatches=3
    expect(batches).toHaveLength(3);
  });

  it("handles batchSize of 1", () => {
    const batches = batchHotelCodes(codes, 1, 0, 5);
    expect(batches).toHaveLength(5);
    for (const batch of batches) {
      expect(batch).toHaveLength(1);
    }
  });

  it("maxBatches limits output", () => {
    const batches = batchHotelCodes(codes, 100, 0, 1);
    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(100);
  });
});
