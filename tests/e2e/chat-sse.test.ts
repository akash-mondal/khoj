/**
 * E2E: Chat SSE Endpoint Tests
 * Requires dev server running on localhost:3000.
 */
import { assert, logSection, runTest } from "../helpers/test-utils";
import { collectSSE } from "../helpers/sse-client";

const BASE = "http://localhost:3000";

async function main() {
  logSection("Chat SSE Endpoint Tests (requires dev server)");

  let passed = 0;
  let failed = 0;

  // Test 1: Simple text question
  const t1 = await runTest("Simple question returns text + done events", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "What services can you help me with?" }],
      }),
    });

    assert(res.ok, `HTTP ${res.status}`);
    assert(
      res.headers.get("content-type")?.includes("text/event-stream") === true,
      `Expected text/event-stream, got ${res.headers.get("content-type")}`
    );

    const events = await collectSSE(res);
    const textEvents = events.filter((e) => e.type === "text");
    const doneEvents = events.filter((e) => e.type === "done");

    assert(textEvents.length > 0, "Should have text events");
    assert(doneEvents.length > 0, "Should have a done event");

    const fullText = textEvents.map((e) => e.content).join("");
    assert(fullText.length > 10, "Should have meaningful response text");
  });
  t1 ? passed++ : failed++;

  // Test 2: Hotel search query triggers tools
  const t2 = await runTest("Hotel search query triggers tool calls", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "Search for hotels in Dubai for 2 adults next month",
          },
        ],
      }),
    });

    assert(res.ok, `HTTP ${res.status}`);

    const events = await collectSSE(res);
    const toolStarts = events.filter((e) => e.type === "tool_start");
    const toolResults = events.filter((e) => e.type === "tool_result");

    assert(toolStarts.length > 0, "Should have tool_start events");
    assert(toolResults.length > 0, "Should have tool_result events");
    assert(
      toolStarts.some((e) => e.toolName === "search_hotels"),
      `Expected search_hotels, got ${toolStarts.map((e) => e.toolName).join(", ")}`
    );
  });
  t2 ? passed++ : failed++;

  // Test 3: Client context is used
  const t3 = await runTest("Client context influences agent behavior", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "What does my client prefer?" }],
        clientName: "Rahul Kumar",
      }),
    });

    assert(res.ok, `HTTP ${res.status}`);

    const events = await collectSSE(res);
    const textContent = events
      .filter((e) => e.type === "text")
      .map((e) => e.content)
      .join("")
      .toLowerCase();

    // Agent should reference Kumar or call get_client_preferences
    const hasToolCall = events.some(
      (e) => e.type === "tool_start" && e.toolName === "get_client_preferences"
    );
    const hasClientMention =
      textContent.includes("kumar") ||
      textContent.includes("rahul") ||
      textContent.includes("5-star") ||
      textContent.includes("luxury");

    assert(
      hasToolCall || hasClientMention,
      "Should reference client preferences or call get_client_preferences"
    );
  });
  t3 ? passed++ : failed++;

  console.log(`\n  \x1b[${failed ? 31 : 32}m${passed}/${passed + failed} passed\x1b[0m\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
