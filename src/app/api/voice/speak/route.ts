import { NextRequest } from "next/server";
import { generateSpeechChunk, splitTextForTTS } from "@/lib/groq/tts-client";
import { GROQ_TTS_VOICE } from "@/config/constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const chunks = splitTextForTTS(text);

    // Generate all chunks in parallel
    const audioBuffers = await Promise.all(
      chunks.map((chunk) => generateSpeechChunk(chunk, voice || GROQ_TTS_VOICE))
    );

    // Concatenate all audio buffers
    const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of audioBuffers) {
      combined.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    return new Response(combined, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(totalLength),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
