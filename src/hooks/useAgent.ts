"use client";

import { useState, useCallback, useRef } from "react";
import type { AgentEvent } from "@/lib/agent/agent-loop";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: unknown;
  isStreaming?: boolean;
  timestamp: number;
}

interface UseAgentOptions {
  clientName?: string;
  clientPreferences?: string;
  tripId?: string;
  tripSummary?: string;
}

export function useAgent(options: UseAgentOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Build message history for API (only user + assistant content)
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      // Create streaming assistant message
      const assistantId = `msg-${Date.now() + 1}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          isStreaming: true,
          timestamp: Date.now(),
        },
      ]);

      try {
        abortRef.current = new AbortController();

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            clientName: options.clientName,
            clientPreferences: options.clientPreferences,
            tripId: options.tripId,
            tripSummary: options.tripSummary,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error(`Chat failed: ${res.status}`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6);

            let event: AgentEvent;
            try {
              event = JSON.parse(json);
            } catch {
              continue;
            }

            switch (event.type) {
              case "text":
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + (event.content || "") }
                      : m
                  )
                );
                break;

              case "tool_start":
                setActiveTool(event.toolName || null);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `tool-${Date.now()}`,
                    role: "tool",
                    content: `Calling ${event.toolName}...`,
                    toolName: event.toolName,
                    toolArgs: event.toolArgs,
                    timestamp: Date.now(),
                  },
                ]);
                break;

              case "tool_result":
                setActiveTool(null);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.role === "tool" && m.toolName === event.toolName && !m.toolResult
                      ? { ...m, content: `${event.toolName} completed`, toolResult: event.toolResult }
                      : m
                  )
                );
                break;

              case "done":
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, isStreaming: false } : m
                  )
                );
                break;

              case "error":
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + `\n\nError: ${event.content}`, isStreaming: false }
                      : m
                  )
                );
                break;
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const errorMsg = err instanceof Error ? err.message : "Something went wrong";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `Error: ${errorMsg}`, isStreaming: false }
              : m
          )
        );
      } finally {
        setIsLoading(false);
        setActiveTool(null);
      }
    },
    [messages, options.clientName, options.clientPreferences, options.tripId, options.tripSummary]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setActiveTool(null);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    activeTool,
    sendMessage,
    stop,
    clearMessages,
  };
}
