import { chatCompletionStream, type ChatMessage, type StreamChunk } from "@/lib/groq/llm-client";
import { agentTools } from "./tools";
import { executeTool } from "./tool-executor";
import { buildSystemPrompt } from "./system-prompt";
import { formatDateISO } from "@/lib/utils";

export interface AgentEvent {
  type: "text" | "tool_start" | "tool_result" | "done" | "error";
  content?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: unknown;
}

interface AgentOptions {
  messages: ChatMessage[];
  clientName?: string;
  clientPreferences?: string;
  tripId?: string;
  tripSummary?: string;
  maxToolRounds?: number;
}

/**
 * Core agentic loop. Streams text + executes tool calls in a loop.
 * Yields AgentEvents as they happen.
 */
export async function* runAgent(options: AgentOptions): AsyncGenerator<AgentEvent> {
  const {
    messages,
    clientName,
    clientPreferences,
    tripId,
    tripSummary,
    maxToolRounds = 5,
  } = options;

  const systemPrompt = buildSystemPrompt({
    clientName,
    clientPreferences,
    tripId,
    tripSummary,
    todayDate: formatDateISO(new Date()),
  });

  // Build full message history with system prompt
  const fullMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  let toolRound = 0;

  while (toolRound < maxToolRounds) {
    // Stream the LLM response
    const chunks: StreamChunk[] = [];
    let hasToolCalls = false;

    for await (const chunk of chatCompletionStream(fullMessages, agentTools)) {
      chunks.push(chunk);

      if (chunk.type === "text" && chunk.content) {
        yield { type: "text", content: chunk.content };
      }

      if (chunk.type === "tool_call" && chunk.toolCall) {
        hasToolCalls = true;
      }
    }

    // If no tool calls, we're done
    if (!hasToolCalls) {
      yield { type: "done" };
      return;
    }

    // Collect all tool calls from this round
    const toolCalls = chunks
      .filter((c) => c.type === "tool_call" && c.toolCall)
      .map((c) => c.toolCall!);

    // Build assistant message with tool calls
    const assistantContent = chunks
      .filter((c) => c.type === "text" && c.content)
      .map((c) => c.content)
      .join("");

    const assistantMsg: ChatMessage = {
      role: "assistant",
      content: assistantContent || null,
      tool_calls: toolCalls.map((tc) => ({
        id: tc.id,
        type: "function" as const,
        function: { name: tc.name, arguments: tc.arguments },
      })),
    };
    fullMessages.push(assistantMsg);

    // Execute each tool call
    for (const tc of toolCalls) {
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(tc.arguments);
      } catch {
        args = {};
      }

      yield { type: "tool_start", toolName: tc.name, toolArgs: args };

      const result = await executeTool(tc.name, args);

      yield { type: "tool_result", toolName: tc.name, toolResult: result };

      // Add tool result to messages
      fullMessages.push({
        role: "tool",
        content: JSON.stringify(result),
        tool_call_id: tc.id,
        name: tc.name,
      });
    }

    toolRound++;
  }

  yield { type: "done" };
}
