/**
 * E2E Test Orchestrator
 * Runs all E2E test suites in order, reporting pass/fail summary.
 * Server-dependent tests are skipped if localhost:3000 is not reachable.
 */
import { execSync, type ExecSyncOptions } from "child_process";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

interface TestResult {
  name: string;
  passed: boolean;
  skipped?: boolean;
}

async function isServerRunning(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:3000", { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

function runSuite(name: string, file: string, timeoutSec = 120): TestResult {
  console.log(`\n${CYAN}━━━ ${name} ━━━${RESET}`);

  const opts: ExecSyncOptions = {
    stdio: "inherit",
    timeout: timeoutSec * 1000,
    cwd: process.cwd(),
  };

  try {
    execSync(`npx tsx ${file}`, opts);
    return { name, passed: true };
  } catch {
    return { name, passed: false };
  }
}

async function main() {
  console.log(`\n${CYAN}╔══════════════════════════════════════╗${RESET}`);
  console.log(`${CYAN}║     Khoj — E2E Test Suite Runner     ║${RESET}`);
  console.log(`${CYAN}╚══════════════════════════════════════╝${RESET}`);

  const results: TestResult[] = [];

  // --- Direct API tests (no server needed) ---
  console.log(`\n${CYAN}▸ Phase 1: Direct API Tests${RESET}`);

  results.push(runSuite("TBO REST Client", "tests/e2e/tbo-api.test.ts", 60));
  results.push(runSuite("Agent Loop + Groq", "tests/e2e/agent-loop.test.ts", 180));

  // --- Server-dependent tests ---
  const serverUp = await isServerRunning();

  if (serverUp) {
    console.log(`\n${CYAN}▸ Phase 2: Server-Dependent Tests (localhost:3000)${RESET}`);

    results.push(runSuite("Chat SSE Endpoint", "tests/e2e/chat-sse.test.ts", 120));
    results.push(runSuite("TBO API Routes", "tests/e2e/tbo-routes.test.ts", 120));
    results.push(runSuite("Voice Endpoints", "tests/e2e/voice.test.ts", 60));
  } else {
    console.log(`\n${CYAN}▸ Phase 2: Skipped (dev server not running on :3000)${RESET}`);
    results.push({ name: "Chat SSE Endpoint", passed: true, skipped: true });
    results.push({ name: "TBO API Routes", passed: true, skipped: true });
    results.push({ name: "Voice Endpoints", passed: true, skipped: true });
  }

  // --- Booking flow (creates real bookings, run last) ---
  console.log(`\n${CYAN}▸ Phase 3: Booking Lifecycle${RESET}`);
  results.push(runSuite("TBO Booking Flow", "tests/e2e/tbo-booking-flow.test.ts", 120));

  // --- Summary ---
  console.log(`\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${CYAN}Summary${RESET}\n`);

  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const r of results) {
    if (r.skipped) {
      console.log(`  ○ ${r.name} (skipped)`);
      totalSkipped++;
    } else if (r.passed) {
      console.log(`  ${GREEN}✓${RESET} ${r.name}`);
      totalPassed++;
    } else {
      console.log(`  ${RED}✗${RESET} ${r.name}`);
      totalFailed++;
    }
  }

  console.log(
    `\n  ${totalFailed > 0 ? RED : GREEN}${totalPassed} passed, ${totalFailed} failed${
      totalSkipped > 0 ? `, ${totalSkipped} skipped` : ""
    }${RESET}\n`
  );

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
