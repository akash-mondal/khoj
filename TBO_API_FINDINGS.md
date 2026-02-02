# TBO Staging API — Actual Field Names & Response Structures

## CRITICAL: The TBO staging API uses DIFFERENT field names than official docs

The official TBO documentation says `CheckInDate`/`CheckOutDate` and `RoomGuests` with `AdultCount`/`ChildCount`.
The **actual staging API** (hackathontest credentials) uses completely different names.

---

## Credentials

All credentials are stored in `.env.local` (gitignored). See `.env.example` for required variables.

```
Staging API:
  URL: http://api.tbotechnology.in/TBOHolidays_HotelAPI
  Username: (see .env.local → TBO_USERNAME)
  Password: (see .env.local → TBO_PASSWORD)
```

---

## HotelCodeList (GET) — WORKS

```
GET /HotelCodeList?CityCode=115936&IsDetailedResponse=false
Authorization: Basic <base64>

Response: { "HotelCodes": [1000000, 1000001, ...] }
```

- Returns `HotelCodes` (NOT `Hotels`)
- Values are **numbers** (not objects, not strings)
- Dubai (115936) returns ~307,640 codes
- Must convert to strings: `codes.map(c => String(c))`

---

## HotelSearch (POST) — CORRECT FIELD NAMES

### Request (CORRECT — tested and working):
```json
{
  "CheckIn": "2026-02-10",        // NOT "CheckInDate"
  "CheckOut": "2026-02-11",       // NOT "CheckOutDate"
  "HotelCodes": "1000027,1000028,1000029,1000030,1000031",
  "GuestNationality": "IN",
  "NoOfRooms": "1",
  "PaxRooms": [                   // NOT "RoomGuests"
    {
      "Adults": 2,                // NOT "AdultCount"
      "Children": 0               // NOT "ChildCount"
      // "ChildAge": [5] if children > 0
    }
  ],
  "ResponseTime": 25,
  "IsDetailedResponse": true,
  "Filters": {
    "StarRating": "All",
    "OrderBy": "PriceAsc"
  }
}
```

### What DOES NOT work:
- `CheckInDate` / `CheckOutDate` → returns `{"Status":{"Code":400,"Description":"Check In Date can not be null or empty"}}`
- `RoomGuests` with `AdultCount`/`ChildCount` → returns `{"Status":{"Code":500,"Description":"Unexpected Error"}}`
- `CheckIn`/`CheckOut` with `RoomGuests` → 500 error
- Only `CheckIn`/`CheckOut` + `PaxRooms` with `Adults`/`Children` works

### Response (actual structure):
```json
{
  "Status": { "Code": 200, "Description": "Successful" },
  "HotelSearchResults": [           // NOT "HotelResult"
    {
      "HotelBookingCode": "1000030!TB!uuid-here",
      "HotelInfo": {                 // Nested under HotelInfo!
        "HotelCode": 1000030,        // number, not string
        "HotelName": "Marlin Inn Beach Resort",
        "HotelPicture": "https://api.tbotechnology.in//imageresource.aspx?img=...",
        "HotelDescription": "HotelDescription#This luxurious resort...",
        "Latitude": "27.192371",
        "Longitude": "33.835152",
        "HotelAddress": "Hurghada Red Sea",
        "Rating": "FourStar",        // NOT a number, it's a string like "FiveStar"
        "TripAdvisorRating": "4.0",
        "TagIds": "46954"            // optional
      },
      "MinHotelPrice": {             // NOT "Price"
        "TotalPrice": 104.01,
        "Currency": "USD",
        "OriginalPrice": 104.01
      },
      "IsPkgProperty": false,
      "IsPackageRate": true,
      "MappedHotel": false,
      "IsHalal": false
    }
  ]
}
```

### Key differences from what we assumed:
| What we had | What it actually is |
|---|---|
| `CheckInDate` | `CheckIn` |
| `CheckOutDate` | `CheckOut` |
| `RoomGuests` | `PaxRooms` |
| `AdultCount` | `Adults` |
| `ChildCount` | `Children` |
| `HotelResult[]` | `HotelSearchResults[]` |
| `hotel.HotelName` (top-level) | `hotel.HotelInfo.HotelName` (nested) |
| `hotel.Price.OfferedPrice` | `hotel.MinHotelPrice.TotalPrice` |
| `hotel.StarRating` (number) | `hotel.HotelInfo.Rating` (string: "FiveStar") |
| `hotel.HotelBookingCode` (top-level) | `hotel.HotelBookingCode` (top-level, same) |

---

## AvailableHotelRooms (POST) — CORRECT STRUCTURE

### Request:
```json
{
  "HotelBookingCode": "1000030!TB!uuid-here"
}
```

### Response (actual):
```json
{
  "Status": { "Code": 200, "Description": "Successful" },
  "Rooms": [                              // NOT "RoomResult"
    {
      "Name": ["Standard Room,1 King Bed,Nonsmoking"],  // Array of strings
      "BookingCode": "1000030!TB!2!TB!uuid",
      "Inclusion": "Breakfast buffet,Free parking ",     // Single string, NOT array
      "TotalFare": 105.55,                               // NOT nested Price object
      "TotalTax": 24.42,
      "RoomPromotion": [],
      "CancelPolicies": [                                // NOT "CancellationPolicies"
        {
          "FromDate": "01-02-2026 00:00:00",
          "ChargeType": "Percentage",
          "CancellationCharge": 100.0
        }
      ],
      "MealType": "BreakFast",
      "IsRefundable": false,
      "WithTransfers": false,
      "ImageURLs": ["https://i.travelapi.com/..."]       // Room images!
    }
  ]
}
```

### Key differences:
| What we had | What it actually is |
|---|---|
| `RoomResult[][]` (nested arrays) | `Rooms[]` (flat array) |
| `room.RoomTypeName` | `room.Name[0]` (array of strings) |
| `room.RatePlanName` | N/A (not in response) |
| `room.Inclusion` (string[]) | `room.Inclusion` (single string) |
| `room.Price.OfferedPrice` | `room.TotalFare` (top-level number) |
| `room.Price.Tax` | `room.TotalTax` (top-level number) |
| `room.CancellationPolicies` | `room.CancelPolicies` |

---

## HotelDetails (POST) — NOT YET VERIFIED with correct codes

The test with code "1009731" didn't return Latitude/Longitude. Need to test with actual codes from HotelCodeList (like "1000030").

Request:
```json
{ "HotelCodes": "1000030" }
```

---

## Session Expiry

- Sessions expire in ~60 seconds
- Must chain: Search → Rooms → PreBook → Book quickly
- If rooms call comes >60s after search, you get `{"Status":{"Code":500,"Description":"Unexpected Error"}}`

---

## Files updated (ALL DONE)

1. **`src/lib/tbo/rest-client.ts`** — DONE: Rewritten with correct API fields, normalized TBOHotel type
2. **`src/lib/agent/tool-executor.ts`** — DONE: Updated hotel price mapping and room mapping
3. **`src/app/api/tbo/search/route.ts`** — DONE: Uses `result.hotels` instead of `result.HotelResult`
4. **`src/components/copilot/HotelCard.tsx`** — No changes needed (tool result format kept compatible)
5. **`src/components/copilot/RoomOptionCard.tsx`** — No changes needed
6. **`src/components/copilot/ChatMessages.tsx`** — No changes needed
7. **`src/components/booking/BookingModal.tsx`** — No changes needed (calls routes directly)

---

## Completion Status

### Phase 1-2 UI components (DONE):
- HotelCard, HotelCardList, RoomOptionCard, SuggestedActions
- ChatMessages modified to render cards
- CopilotPanel modified with SuggestedActions
- MapView with real Mapbox (static CSS import, light-v11 style)
- BookingModal with Radix Dialog
- Badge and Button shared UI components
- Build passes clean

### Phase 3 REST Client + Tests (DONE):
- rest-client.ts fully rewritten with correct staging API field names
- tool-executor.ts updated for new response types
- search route updated
- vitest installed, configured, 37 unit tests pass
- E2E tests updated and passing (5/5 TBO API tests)
- Test framework: vitest for unit, tsx for E2E
- Build verification: clean pass

---

## Meeting Transcript Key Points

- Hackathon is VoyageHack 3.0, finale in mid-March in Gurgaon
- They want a working MVP, not production-ready
- "How close are you to implementation" is key evaluation criteria
- Language/tech agnostic — any tech stack is fine
- Staging API credentials shared, no booking rights initially
- Working demo is highly recommended even in Round 0 (idea round)
- Video demos accepted, keep under 10 minutes
