import dotenv from "dotenv";
import path from "path";

export function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
}

export function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

export function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

export function logPass(name: string) {
  console.log(`  \x1b[32m✓\x1b[0m ${name}`);
}

export function logFail(name: string, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  console.log(`  \x1b[31m✗\x1b[0m ${name}: ${msg}`);
}

export function logSection(name: string) {
  console.log(`\n\x1b[36m▸ ${name}\x1b[0m`);
}

export async function runTest(name: string, fn: () => Promise<void>): Promise<boolean> {
  try {
    await fn();
    logPass(name);
    return true;
  } catch (err) {
    logFail(name, err);
    return false;
  }
}
