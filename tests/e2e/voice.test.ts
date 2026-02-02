/**
 * E2E: Voice API Endpoint Tests
 * Tests TTS (speak) and STT (transcribe) endpoints.
 * Requires dev server running on localhost:3000.
 */
import { assert, logSection, runTest } from "../helpers/test-utils";

const BASE = "http://localhost:3000";

async function main() {
  logSection("Voice API Tests (requires dev server)");

  let passed = 0;
  let failed = 0;

  // Test 1: TTS generates audio
  const t1 = await runTest("POST /api/voice/speak returns audio/wav", async () => {
    const res = await fetch(`${BASE}/api/voice/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Hello, this is a test of the Khoj speech system." }),
    });

    assert(res.ok, `HTTP ${res.status}: ${res.statusText}`);
    assert(
      res.headers.get("content-type")?.includes("audio/wav") === true,
      `Expected audio/wav, got ${res.headers.get("content-type")}`
    );

    const buffer = await res.arrayBuffer();
    assert(buffer.byteLength > 0, "Audio buffer should not be empty");
    console.log(`    Audio size: ${(buffer.byteLength / 1024).toFixed(1)} KB`);
  });
  t1 ? passed++ : failed++;

  // Test 2: TTS with empty text returns 400
  const t2 = await runTest("POST /api/voice/speak with empty text returns 400", async () => {
    const res = await fetch(`${BASE}/api/voice/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "" }),
    });

    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert(!!data.error, "Should have error message");
  });
  t2 ? passed++ : failed++;

  // Test 3: Transcribe with empty form data returns 400
  const t3 = await runTest("POST /api/voice/transcribe with empty body returns 400", async () => {
    const formData = new FormData();

    const res = await fetch(`${BASE}/api/voice/transcribe`, {
      method: "POST",
      body: formData,
    });

    assert(res.status === 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert(!!data.error, "Should have error message");
  });
  t3 ? passed++ : failed++;

  console.log(`\n  \x1b[${failed ? 31 : 32}m${passed}/${passed + failed} passed\x1b[0m\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
