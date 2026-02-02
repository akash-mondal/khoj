import { GROQ_API_KEY, GROQ_TTS_MODEL, GROQ_TTS_VOICE } from "@/config/constants";

const MAX_CHUNK_LENGTH = 195;

/**
 * Split text into chunks at sentence boundaries, each under 195 chars.
 * Orpheus TTS has a 200 char limit per request.
 */
export function splitTextForTTS(text: string): string[] {
  if (text.length <= MAX_CHUNK_LENGTH) return [text];

  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length > MAX_CHUNK_LENGTH) {
      if (current.trim()) chunks.push(current.trim());
      // If a single sentence exceeds the limit, split at word boundaries
      if (sentence.length > MAX_CHUNK_LENGTH) {
        const words = sentence.split(" ");
        current = "";
        for (const word of words) {
          if (current.length + word.length + 1 > MAX_CHUNK_LENGTH) {
            if (current.trim()) chunks.push(current.trim());
            current = word + " ";
          } else {
            current += word + " ";
          }
        }
      } else {
        current = sentence;
      }
    } else {
      current += sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/**
 * Generate speech audio for a single text chunk.
 * Returns an ArrayBuffer of WAV audio data.
 */
export async function generateSpeechChunk(
  text: string,
  voice: string = GROQ_TTS_VOICE
): Promise<ArrayBuffer> {
  const res = await fetch("https://api.groq.com/openai/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_TTS_MODEL,
      input: text,
      voice,
      response_format: "wav",
    }),
  });

  if (!res.ok) {
    throw new Error(`TTS failed (${res.status}): ${await res.text()}`);
  }

  return res.arrayBuffer();
}

/**
 * Generate speech for full text by splitting into chunks and generating in parallel.
 * Returns array of ArrayBuffers in order.
 */
export async function generateSpeech(
  text: string,
  voice: string = GROQ_TTS_VOICE
): Promise<ArrayBuffer[]> {
  const chunks = splitTextForTTS(text);
  return Promise.all(chunks.map((chunk) => generateSpeechChunk(chunk, voice)));
}
