/**
 * E2E: TBO API Route Tests
 * Tests Next.js API routes for TBO integration.
 * Requires dev server running on localhost:3000.
 */
import { futureDate, assert, logSection, runTest } from "../helpers/test-utils";

const BASE = "http://localhost:3000";

async function main() {
  logSection("TBO API Routes (requires dev server)");

  let passed = 0;
  let failed = 0;

  // Test 1: Search Dubai hotels
  const t1 = await runTest("POST /api/tbo/search returns hotels for Dubai", async () => {
    const res = await fetch(`${BASE}/api/tbo/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: "Dubai",
        checkIn: futureDate(30),
        checkOut: futureDate(31),
      }),
    });

    assert(res.ok, `HTTP ${res.status}: ${await res.text()}`);

    const data = await res.json();
    assert(Array.isArray(data.hotels), "Response should have hotels array");
    assert(data.hotels.length > 0, "Should find at least 1 hotel");
    assert(!!data.hotels[0].HotelName, "Hotel should have HotelName");
    assert(!!data.hotels[0].HotelBookingCode, "Hotel should have HotelBookingCode");
  });
  t1 ? passed++ : failed++;

  // Test 2: Invalid city returns 400
  const t2 = await runTest("POST /api/tbo/search with invalid city returns 400", async () => {
    const res = await fetch(`${BASE}/api/tbo/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: "Narnia",
        checkIn: futureDate(30),
        checkOut: futureDate(31),
      }),
    });

    assert(res.status === 400, `Expected 400, got ${res.status}`);

    const data = await res.json();
    assert(!!data.error, "Should have error message");
    assert(data.error.includes("not found"), `Error should mention 'not found': ${data.error}`);
  });
  t2 ? passed++ : failed++;

  // Test 3: Hotel details
  const t3 = await runTest("POST /api/tbo/details returns hotel info", async () => {
    const res = await fetch(`${BASE}/api/tbo/details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotelCode: "1009731" }), // Known Dubai hotel code
    });

    assert(res.ok, `HTTP ${res.status}`);
    const data = await res.json();
    assert(!!data.HotelDetails || !!data.hotel, "Should have hotel details");
  });
  t3 ? passed++ : failed++;

  // Test 4: Rooms endpoint (may fail on session)
  const t4 = await runTest("POST /api/tbo/rooms handles requests", async () => {
    // First search to get a fresh booking code
    const searchRes = await fetch(`${BASE}/api/tbo/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: "Dubai",
        checkIn: futureDate(45),
        checkOut: futureDate(46),
      }),
    });

    if (!searchRes.ok) {
      console.log("    (Search failed, skipping rooms test)");
      return;
    }

    const searchData = await searchRes.json();
    if (!searchData.hotels?.length) {
      console.log("    (No hotels found, skipping rooms test)");
      return;
    }

    const bookingCode = searchData.hotels[0].HotelBookingCode;

    const res = await fetch(`${BASE}/api/tbo/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotelBookingCode: bookingCode }),
    });

    // Session expiry is acceptable
    const data = await res.json();
    assert(
      res.ok || data.error?.toLowerCase().includes("session"),
      `Unexpected error: ${data.error || res.status}`
    );
  });
  t4 ? passed++ : failed++;

  // Test 5: Cities endpoint
  const t5 = await runTest("POST /api/tbo/cities returns city data", async () => {
    const res = await fetch(`${BASE}/api/tbo/cities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode: "AE" }),
    });

    assert(res.ok, `HTTP ${res.status}`);
    const data = await res.json();
    assert(!!data, "Should return data");
  });
  t5 ? passed++ : failed++;

  console.log(`\n  \x1b[${failed ? 31 : 32}m${passed}/${passed + failed} passed\x1b[0m\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
