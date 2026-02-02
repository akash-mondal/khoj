import { GROQ_API_KEY, GROQ_WHISPER_MODEL } from "@/config/constants";

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

/**
 * Transcribe audio using Groq Whisper.
 * Accepts a File/Blob of audio data.
 */
export async function transcribeAudio(
  audioData: Blob,
  filename = "audio.wav"
): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append("file", audioData, filename);
  formData.append("model", GROQ_WHISPER_MODEL);
  formData.append("response_format", "json");
  formData.append("language", "en");

  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Whisper transcription failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  return {
    text: data.text,
    language: data.language,
    duration: data.duration,
  };
}
