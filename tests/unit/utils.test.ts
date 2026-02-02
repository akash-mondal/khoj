import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDateISO,
  daysUntil,
  truncate,
  starRatingLabel,
  generateId,
  formatDate,
  formatDateShort,
  daysFromNow,
} from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(1500)).toBe("$1,500");
  });

  it("formats with specified currency", () => {
    const result = formatCurrency(2500, "EUR");
    expect(result).toContain("2,500");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("handles large numbers", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000");
  });
});

describe("formatDateISO", () => {
  it("returns YYYY-MM-DD format", () => {
    const d = new Date("2025-03-15T12:00:00Z");
    expect(formatDateISO(d)).toBe("2025-03-15");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2025-06-15");
    expect(result).toContain("Jun");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });

  it("formats a Date object", () => {
    const result = formatDate(new Date("2025-12-25T00:00:00"));
    expect(result).toContain("Dec");
    expect(result).toContain("25");
  });
});

describe("formatDateShort", () => {
  it("returns short format without year", () => {
    const result = formatDateShort("2025-06-15");
    expect(result).toContain("Jun");
    expect(result).toContain("15");
  });
});

describe("daysFromNow", () => {
  it("returns ISO date string in the future", () => {
    const result = daysFromNow(30);
    const future = new Date(result);
    const now = new Date();
    const diff = Math.round((future.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    expect(diff).toBeGreaterThanOrEqual(29);
    expect(diff).toBeLessThanOrEqual(31);
  });
});

describe("daysUntil", () => {
  it("returns positive for future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(daysUntil(future)).toBe(10);
  });

  it("returns negative for past dates", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    expect(daysUntil(past)).toBe(-5);
  });

  it("returns 0 for today", () => {
    expect(daysUntil(new Date())).toBe(0);
  });

  it("accepts string dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    const isoStr = future.toISOString().split("T")[0];
    const result = daysUntil(isoStr);
    expect(result).toBeGreaterThanOrEqual(6);
    expect(result).toBeLessThanOrEqual(8);
  });
});

describe("truncate", () => {
  it("returns original if under limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates with ellipsis", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });

  it("returns original at exact limit", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("starRatingLabel", () => {
  it("returns Luxury for 5 stars", () => {
    expect(starRatingLabel(5)).toBe("Luxury");
  });

  it("returns Premium for 4 stars", () => {
    expect(starRatingLabel(4)).toBe("Premium");
  });

  it("returns Comfort for 3 stars", () => {
    expect(starRatingLabel(3)).toBe("Comfort");
  });

  it("returns Budget for 2 or fewer", () => {
    expect(starRatingLabel(2)).toBe("Budget");
    expect(starRatingLabel(1)).toBe("Budget");
  });
});

describe("generateId", () => {
  it("returns an 8-character string", () => {
    const id = generateId();
    expect(id).toHaveLength(8);
    expect(typeof id).toBe("string");
  });

  it("returns unique values", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});
