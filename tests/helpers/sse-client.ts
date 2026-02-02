export interface AgentEvent {
  type: "text" | "tool_start" | "tool_result" | "done" | "error";
  content?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: unknown;
}

/**
 * Parse SSE stream from a fetch Response into AgentEvent objects.
 */
export async function* parseSSE(response: Response): AsyncGenerator<AgentEvent> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const json = trimmed.slice(6);
        try {
          yield JSON.parse(json) as AgentEvent;
        } catch {
          // skip malformed lines
        }
      }
    }
  }

  // Process remaining buffer
  if (buffer.trim().startsWith("data: ")) {
    try {
      yield JSON.parse(buffer.trim().slice(6)) as AgentEvent;
    } catch {
      // skip
    }
  }
}

/**
 * Collect all events from an SSE stream.
 */
export async function collectSSE(response: Response): Promise<AgentEvent[]> {
  const events: AgentEvent[] = [];
  for await (const event of parseSSE(response)) {
    events.push(event);
  }
  return events;
}
