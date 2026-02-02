import { describe, it, expect } from "vitest";
import { splitTextForTTS } from "@/lib/groq/tts-client";

const MAX_CHUNK_LENGTH = 195;

describe("splitTextForTTS", () => {
  it("returns single chunk for short text", () => {
    const text = "Hello, how are you?";
    const chunks = splitTextForTTS(text);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it("returns single chunk for text at exactly 195 chars", () => {
    const text = "A".repeat(195);
    const chunks = splitTextForTTS(text);
    expect(chunks).toHaveLength(1);
  });

  it("splits long text at sentence boundaries", () => {
    const text =
      "The hotel features a stunning rooftop pool with panoramic views. " +
      "Guests can enjoy fine dining at three on-site restaurants. " +
      "The spa offers a full range of rejuvenating treatments. " +
      "Free Wi-Fi is available throughout the property.";
    const chunks = splitTextForTTS(text);

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(MAX_CHUNK_LENGTH);
    }
  });

  it("preserves all content when splitting", () => {
    const text =
      "First sentence here. Second sentence follows. Third one too. " +
      "And a fourth sentence. Plus a fifth one. Yet another sentence. " +
      "One more for good measure. This is getting long now. " +
      "Almost done with this test. Final sentence.";
    const chunks = splitTextForTTS(text);
    const rejoined = chunks.join(" ");
    // All words should be present
    for (const word of text.split(/\s+/)) {
      expect(rejoined).toContain(word.replace(/[.!?]/g, "").trim() || word);
    }
  });

  it("splits a single very long sentence at word boundaries", () => {
    const words = Array.from({ length: 50 }, (_, i) => `word${i}`);
    const longSentence = words.join(" ") + ".";
    const chunks = splitTextForTTS(longSentence);

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(MAX_CHUNK_LENGTH);
    }
  });

  it("handles empty string", () => {
    const chunks = splitTextForTTS("");
    // Empty string is <= 195, returned as-is
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe("");
  });

  it("handles text without sentence terminators", () => {
    const text = "A ".repeat(100).trim();
    const chunks = splitTextForTTS(text);
    // Should still split since it's > 195 chars
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(MAX_CHUNK_LENGTH);
    }
  });
});
