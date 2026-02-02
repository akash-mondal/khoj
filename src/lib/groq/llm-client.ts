import Groq from "groq-sdk";
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
} from "groq-sdk/resources/chat/completions";
import { GROQ_API_KEY, GROQ_MODEL } from "@/config/constants";

const groq = new Groq({
  apiKey: GROQ_API_KEY,
  timeout: 30_000,
  maxRetries: 2,
});

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
  name?: string;
}

export interface StreamChunk {
  type: "text" | "tool_call" | "tool_call_done" | "done" | "error";
  content?: string;
  toolCall?: {
    id: string;
    name: string;
    arguments: string;
  };
}

/**
 * Non-streaming chat completion with tool calling.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  tools?: ToolDefinition[],
  temperature = 0.1
): Promise<ChatMessage> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: ChatCompletionCreateParamsNonStreaming = {
    model: GROQ_MODEL,
    messages: messages as any,
    temperature,
    max_tokens: 4096,
    ...(tools?.length ? { tools: tools as any } : {}),
  };

  const response = await groq.chat.completions.create(params);
  const choice = response.choices[0];

  return {
    role: "assistant",
    content: choice.message.content,
    tool_calls: choice.message.tool_calls as ChatMessage["tool_calls"],
  };
}

/**
 * Streaming chat completion. Yields chunks as they arrive.
 */
export async function* chatCompletionStream(
  messages: ChatMessage[],
  tools?: ToolDefinition[],
  temperature = 0.1
): AsyncGenerator<StreamChunk> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: ChatCompletionCreateParamsStreaming = {
    model: GROQ_MODEL,
    messages: messages as any,
    temperature,
    max_tokens: 4096,
    stream: true,
    ...(tools?.length ? { tools: tools as any } : {}),
  };

  // Retry once on tool call validation errors (LLM sometimes passes null for optional params)
  let stream;
  try {
    stream = await groq.chat.completions.create(params);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Tool call validation failed")) {
      // Retry with slightly higher temperature for different output
      stream = await groq.chat.completions.create({ ...params, temperature: 0.3 });
    } else {
      throw err;
    }
  }

  const toolCalls = new Map<number, { id: string; name: string; arguments: string }>();

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;
    if (!delta) continue;

    // Text content
    if (delta.content) {
      yield { type: "text", content: delta.content };
    }

    // Tool calls (streamed incrementally)
    if (delta.tool_calls) {
      for (const tc of delta.tool_calls) {
        const idx = tc.index;
        if (!toolCalls.has(idx)) {
          toolCalls.set(idx, {
            id: tc.id || "",
            name: tc.function?.name || "",
            arguments: "",
          });
        }
        const existing = toolCalls.get(idx)!;
        if (tc.id) existing.id = tc.id;
        if (tc.function?.name) existing.name = tc.function.name;
        if (tc.function?.arguments) existing.arguments += tc.function.arguments;
      }
    }

    // Check for finish
    if (chunk.choices[0]?.finish_reason === "tool_calls") {
      for (const [, tc] of toolCalls) {
        yield { type: "tool_call", toolCall: tc };
      }
    }

    if (chunk.choices[0]?.finish_reason === "stop") {
      for (const [, tc] of toolCalls) {
        if (tc.id && tc.name) {
          yield { type: "tool_call", toolCall: tc };
        }
      }
    }
  }

  yield { type: "done" };
}
