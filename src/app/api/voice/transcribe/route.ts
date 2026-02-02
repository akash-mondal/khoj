import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/groq/stt-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const result = await transcribeAudio(file);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcription failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
