import { NextRequest } from "next/server";
import { runAgent, type AgentEvent } from "@/lib/agent/agent-loop";
import type { ChatMessage } from "@/lib/groq/llm-client";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages: ChatMessage[] = body.messages || [];
  const clientName: string | undefined = body.clientName;
  const clientPreferences: string | undefined = body.clientPreferences;
  const tripId: string | undefined = body.tripId;
  const tripSummary: string | undefined = body.tripSummary;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const agentStream = runAgent({
          messages,
          clientName,
          clientPreferences,
          tripId,
          tripSummary,
        });

        for await (const event of agentStream) {
          const data = JSON.stringify(event);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      } catch (err) {
        const errorEvent: AgentEvent = {
          type: "error",
          content: err instanceof Error ? err.message : "Unknown error",
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
