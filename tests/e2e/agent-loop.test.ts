/**
 * E2E: Agent Loop + Groq LLM Tests
 * Tests the agentic tool-calling loop with real Groq API.
 * No server needed — calls agent-loop directly.
 * Requires .env.local with GROQ_API_KEY, TBO credentials.
 */
import { loadEnv, assert, logSection, runTest } from "../helpers/test-utils";

// MUST load env BEFORE importing source modules that read process.env at module scope
loadEnv();

async function main() {
  // Dynamic imports so constants.ts picks up env vars
  const { runAgent } = await import("../../src/lib/agent/agent-loop");

  interface AgentEvent {
    type: string;
    content?: string;
    toolName?: string;
    toolArgs?: Record<string, unknown>;
    toolResult?: unknown;
  }

  async function collectEvents(
    options: Parameters<typeof runAgent>[0],
    timeoutMs = 120_000
  ): Promise<AgentEvent[]> {
    const events: AgentEvent[] = [];
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Agent timeout")), timeoutMs)
    );

    const collect = async () => {
      for await (const event of runAgent(options)) {
        events.push(event as AgentEvent);
      }
      return events;
    };

    return Promise.race([collect(), timeout]);
  }

  logSection("Agent Loop — Real Groq + TBO Tests");

  let passed = 0;
  let failed = 0;

  // Test 1: Hotel search via agent
  const t1 = await runTest("Agent calls search_hotels for 'Find 4-star hotels in Dubai'", async () => {
    const events = await collectEvents({
      messages: [{ role: "user", content: "Find 4-star hotels in Dubai for 2 adults, checking in next month." }],
    });

    const toolStarts = events.filter((e) => e.type === "tool_start");
    const toolResults = events.filter((e) => e.type === "tool_result");
    const textEvents = events.filter((e) => e.type === "text");
    const doneEvents = events.filter((e) => e.type === "done");

    assert(toolStarts.length > 0, "Should have at least one tool_start");
    assert(
      toolStarts.some((e) => e.toolName === "search_hotels"),
      `Expected search_hotels tool call, got: ${toolStarts.map((e) => e.toolName).join(", ")}`
    );
    assert(toolResults.length > 0, "Should have tool results");
    assert(
      toolResults.some((e) => {
        const result = e.toolResult as Record<string, unknown>;
        return result && result.success === true;
      }),
      "At least one tool result should be successful"
    );
    assert(textEvents.length > 0, "Should have text response");
    assert(doneEvents.length > 0, "Should have done event");
  });
  t1 ? passed++ : failed++;

  // Test 2: Client preferences lookup
  const t2 = await runTest("Agent fetches client preferences for 'Rahul Kumar'", async () => {
    const events = await collectEvents({
      messages: [{ role: "user", content: "What are Rahul Kumar's travel preferences?" }],
    });

    const toolStarts = events.filter((e) => e.type === "tool_start");

    assert(
      toolStarts.some((e) => e.toolName === "get_client_preferences"),
      `Expected get_client_preferences, got: ${toolStarts.map((e) => e.toolName).join(", ")}`
    );

    const prefResult = events.find(
      (e) => e.type === "tool_result" && e.toolName === "get_client_preferences"
    );
    assert(!!prefResult, "Should have preferences result");

    const result = prefResult!.toolResult as Record<string, unknown>;
    assert(result.success === true, "Preferences lookup should succeed");

    const textContent = events
      .filter((e) => e.type === "text")
      .map((e) => e.content)
      .join("");
    assert(textContent.length > 20, "Should have meaningful text response");
  });
  t2 ? passed++ : failed++;

  // Test 3: Graceful error for unknown city
  const t3 = await runTest("Agent handles unknown city gracefully", async () => {
    const events = await collectEvents({
      messages: [{ role: "user", content: "Find hotels in Atlantis" }],
    });

    const textContent = events
      .filter((e) => e.type === "text")
      .map((e) => e.content)
      .join("")
      .toLowerCase();

    // Agent should either fail the tool call or explain the city is not available
    const toolResults = events.filter((e) => e.type === "tool_result");
    const hasError = toolResults.some((e) => {
      const result = e.toolResult as Record<string, unknown>;
      return result && result.success === false;
    });
    const hasExplanation =
      textContent.includes("not found") ||
      textContent.includes("not available") ||
      textContent.includes("don't have") ||
      textContent.includes("unable") ||
      textContent.includes("cannot") ||
      textContent.includes("sorry") ||
      textContent.includes("atlantis");

    assert(
      hasError || hasExplanation,
      "Should either have a failed tool result or text explaining the issue"
    );
  });
  t3 ? passed++ : failed++;

  // Test 4: Multi-tool — search with client context
  const t4 = await runTest("Agent uses both preferences + search for contextual query", async () => {
    const events = await collectEvents({
      messages: [
        {
          role: "user",
          content: "Find hotels in Dubai that match Rahul Kumar's preferences",
        },
      ],
      clientName: "Rahul Kumar",
    });

    const toolStarts = events.filter((e) => e.type === "tool_start");
    const toolNames = toolStarts.map((e) => e.toolName);

    // Should call either both tools or at least search_hotels (may use context from system prompt)
    assert(
      toolNames.includes("search_hotels"),
      `Expected search_hotels in ${toolNames.join(", ")}`
    );

    const textContent = events
      .filter((e) => e.type === "text")
      .map((e) => e.content)
      .join("");
    assert(textContent.length > 30, "Should have substantial text response");
  });
  t4 ? passed++ : failed++;

  console.log(`\n  \x1b[${failed ? 31 : 32}m${passed}/${passed + failed} passed\x1b[0m\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
