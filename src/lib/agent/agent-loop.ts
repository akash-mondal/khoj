import { chatCompletionStream, type ChatMessage, type StreamChunk } from "@/lib/groq/llm-client";
import { agentTools } from "./tools";
import { executeTool, type ToolResult } from "./tool-executor";
import { buildSystemPrompt } from "./system-prompt";
import { formatDateISO } from "@/lib/utils";

/**
 * Summarize bulky tool results before sending back to LLM.
 * The full data is already sent to the frontend via SSE — the LLM
 * only needs a summary so it can write a brief response without
 * dumping raw data as markdown tables.
 */
function summarizeForLLM(toolName: string, result: ToolResult): string {
  if (!result.success || !result.data) {
    return JSON.stringify(result);
  }

  const data = result.data as Record<string, unknown>;

  if (toolName === "search_hotels" && data.hotels) {
    const hotels = data.hotels as Array<Record<string, unknown>>;
    const top3 = hotels.slice(0, 3).map((h) => {
      const price = h.price as Record<string, unknown> | undefined;
      return `${h.name} (${h.stars}★, $${price?.offeredPrice || "N/A"})`;
    });
    return JSON.stringify({
      success: true,
      summary: `Found ${data.totalFound} hotels. Top results: ${top3.join(", ")}. The hotel cards are displayed visually to the agent — do NOT list them again. Write a brief 1-2 sentence summary mentioning the best match and why.`,
    });
  }

  if (toolName === "get_room_options" && data.rooms) {
    const rooms = data.rooms as Array<Record<string, unknown>>;
    const summary = rooms.slice(0, 3).map((r) => {
      const price = r.price as Record<string, unknown> | undefined;
      return `${r.roomType} ($${price?.offeredPrice || "N/A"}, ${r.mealType}, ${r.isRefundable ? "refundable" : "non-refundable"})`;
    });
    return JSON.stringify({
      success: true,
      summary: `Found ${rooms.length} room options. Examples: ${summary.join("; ")}. The room cards are displayed visually to the agent — do NOT list them or create tables. Write a brief 1-2 sentence summary highlighting the best value option.`,
    });
  }

  return JSON.stringify(result);
}

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
 * Generate a brief description when the LLM jumps straight to tool calls
 * without producing any text. Ensures the user always sees context.
 */
function autoDescribeTools(toolNames: string[]): string {
  const parts: string[] = [];
  if (toolNames.includes("get_client_preferences")) parts.push("pulling up client preferences");
  if (toolNames.includes("search_hotels")) parts.push("searching for available hotels");
  if (toolNames.includes("get_room_options")) parts.push("checking room availability");
  if (toolNames.includes("get_hotel_details")) parts.push("loading hotel details");
  if (toolNames.includes("prebook_room")) parts.push("securing the room rate");
  if (toolNames.includes("book_hotel")) parts.push("completing the booking");
  if (toolNames.includes("check_cancellation_policy")) parts.push("checking cancellation terms");
  if (toolNames.includes("suggest_activities")) parts.push("finding activities");
  if (parts.length === 0) return "Let me look into that.\n\n";
  const joined = parts.length > 1
    ? parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1]
    : parts[0];
  return `On it — ${joined}.\n\n`;
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
    let assistantContent = chunks
      .filter((c) => c.type === "text" && c.content)
      .map((c) => c.content)
      .join("");

    // If LLM jumped straight to tools without text, inject auto-description
    if (!assistantContent.trim() && toolCalls.length > 0) {
      const autoText = autoDescribeTools(toolCalls.map((tc) => tc.name));
      yield { type: "text", content: autoText };
      assistantContent = autoText;
    }

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
        // Strip null values — LLM sometimes passes null for optional params
        for (const key of Object.keys(args)) {
          if (args[key] === null || args[key] === undefined) delete args[key];
        }
      } catch {
        args = {};
      }

      yield { type: "tool_start", toolName: tc.name, toolArgs: args };

      const result = await executeTool(tc.name, args);

      yield { type: "tool_result", toolName: tc.name, toolResult: result };

      // Add summarized tool result to LLM messages (full data already sent to frontend)
      fullMessages.push({
        role: "tool",
        content: summarizeForLLM(tc.name, result),
        tool_call_id: tc.id,
        name: tc.name,
      });
    }

    toolRound++;
  }

  yield { type: "done" };
}
