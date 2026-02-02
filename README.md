# Khoj — Virtual Travel Agent Copilot

An AI-powered copilot that turns travel agents into superagents. Built for [TBO VoyageHack 3.0](https://www.tboholidays.com/).

Khoj connects to TBO's live hotel inventory (307,640+ hotels across 20 cities), understands client preferences, monitors alerts proactively, and handles the full search-to-booking workflow — via text or voice.

## What It Does

| Capability | How |
|---|---|
| **Hotel Search** | Searches real TBO staging API — prices, images, star ratings, locations |
| **Room Comparison** | Fetches room types, meal plans, cancellation policies, taxes |
| **Full Booking Flow** | Search → Room Select → PreBook (price lock) → Book → Confirmation |
| **Client Personalization** | Remembers star preference, pool needs, dietary restrictions, loyalty programs, budget tier |
| **Proactive Alerts** | Price drops, schedule changes, reconfirmation reminders — click any alert to act |
| **Voice Agent** | Speak commands via mic, get spoken responses. Groq Whisper STT + Orpheus TTS |
| **Trip Management** | Itinerary timeline, Mapbox map with pins, budget tracking, quote generation |

## Demo Flows

The app ships with 5 interactive demo flows designed for a 3-minute walkthrough:

1. **Alert → Copilot Action** — Click a dashboard alert (e.g. "Price dropped on Marriott Dubai"), copilot opens and recommends action
2. **Client-Aware Search** — Select a client, copilot loads their preferences, searches matching hotels via TBO API
3. **Room Selection & Booking** — View Rooms on a hotel card, compare options, select and trigger booking
4. **Voice-First Agent** — Click mic, speak a query, copilot transcribes and executes multi-tool search
5. **Trip Command Center** — Click a trip card, see itinerary + map + budget in one view

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 + React 19 |
| Styling | Tailwind CSS 4 + Framer Motion |
| LLM | Groq (`openai/gpt-oss-120b`) with structured tool calling |
| Voice | Groq Whisper Large v3 Turbo (STT) + Orpheus v1 (TTS) |
| Hotel API | TBO Staging API (real inventory, not mocked) |
| Maps | Mapbox GL JS (light-v11 style) |
| UI Components | Radix UI (Dialog, Tabs, Tooltip, ScrollArea) + Lucide icons |
| Testing | Vitest (unit) + tsx (E2E) |

## Architecture

```
Browser (React 19)
  ├── AppShell (Sidebar + MainContent + CopilotPanel)
  ├── Views: Dashboard, Trips, Clients, Bookings, Alerts
  └── Copilot Panel
        ├── ChatInput (text + voice via useVoice hook)
        ├── ChatMessages (renders hotel cards, room cards, text)
        └── SuggestedActions (context-aware quick actions)

Next.js API Routes
  ├── /api/chat ─────────── SSE streaming agent loop
  ├── /api/tbo/search ───── Hotel search (batched)
  ├── /api/tbo/rooms ────── Available rooms
  ├── /api/tbo/details ──── Hotel details
  ├── /api/tbo/prebook ──── Price lock
  ├── /api/tbo/book ─────── Confirm reservation
  ├── /api/tbo/cancel ───── Cancel booking
  ├── /api/tbo/booking-detail ── Booking status
  ├── /api/voice/transcribe ── Groq Whisper STT
  └── /api/voice/speak ──── Groq Orpheus TTS

Agent Layer
  ├── agent-loop.ts ─── LLM ↔ Tool execution loop (SSE streaming)
  ├── tools.ts ──────── 13 tool definitions (OpenAI function calling format)
  ├── tool-executor.ts ─ Dispatches tool calls to TBO API / local logic
  └── system-prompt.ts ─ Agent personality + instructions

TBO REST Client (src/lib/tbo/rest-client.ts)
  ├── getHotelCodeList(cityCode)
  ├── searchHotels({ hotelCodes, checkIn, checkOut, rooms })
  ├── getHotelDetails(hotelCode)
  ├── getAvailableRooms(bookingCode)
  ├── preBook(bookingCode)
  ├── bookHotel({ bookingCode, guests, clientRef })
  ├── getBookingDetail(confirmationNumber)
  └── cancelBooking(confirmationNumber)
```

## Agent Tools (13)

| Tool | Description |
|---|---|
| `search_hotels` | Search TBO inventory with city, dates, rooms, star filter, budget |
| `get_hotel_details` | Full hotel info — amenities, description, coordinates |
| `get_room_options` | Room types, meal plans, prices, cancellation policies |
| `check_cancellation_policy` | Detailed cancellation terms for a booking code |
| `prebook_room` | Lock price before booking (required by TBO — 60s session TTL) |
| `book_hotel` | Confirm reservation with guest details |
| `get_booking_status` | Check existing booking by confirmation number |
| `cancel_booking` | Cancel a reservation |
| `get_client_preferences` | Fetch client profile — stars, brands, dietary, loyalty, budget |
| `add_to_itinerary` | Add hotel/flight/transfer/activity to a trip |
| `generate_quote` | Create price proposal with configurable markup |
| `suggest_activities` | Curated activity suggestions for a destination |

## Supported Cities (20)

Dubai, Abu Dhabi, London, Paris, New York, Bangkok, Singapore, New Delhi, Mumbai, Goa, Bali, Tokyo, Maldives, Istanbul, Rome, Barcelona, Sydney, Kuala Lumpur, Phuket, Cairo

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- TBO staging API credentials (from VoyageHack 3.0)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Mapbox public token (free at [mapbox.com](https://www.mapbox.com))

### Setup

```bash
# Clone
git clone https://github.com/akash-mondal/khoj.git
cd khoj

# Install
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TBO_API_URL` | Yes | TBO staging API base URL |
| `TBO_USERNAME` | Yes | TBO API username |
| `TBO_PASSWORD` | Yes | TBO API password |
| `GROQ_API_KEY` | Yes | Groq API key for LLM + voice |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox GL public token |

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm test             # Run 37 unit tests (vitest)
npm run test:e2e     # Run all E2E tests
npm run test:tbo     # Run TBO API integration tests
npm run test:booking # Run booking flow E2E test
npm run test:agent   # Run agent loop E2E test
npm run test:chat    # Run chat SSE E2E test
npm run test:voice   # Run voice E2E test
npm run lint         # ESLint
```

## Project Structure

```
src/
  app/
    api/chat/          # SSE streaming agent endpoint
    api/tbo/           # TBO API proxy routes (search, rooms, book, etc.)
    api/voice/         # Groq STT + TTS endpoints
    page.tsx           # Main app page
    layout.tsx         # Root layout with AppProvider
  components/
    copilot/           # CopilotPanel, ChatMessages, ChatInput, HotelCard, RoomOptionCard
    views/             # DashboardView, ClientsView, TripWorkspace, AlertsView, BookingsView
    layout/            # AppShell, Sidebar, MainContent
    trip/              # MapView (Mapbox)
    booking/           # BookingModal (Radix Dialog)
    ui/                # Badge, Button
  config/
    constants.ts       # Env vars, city map, model config
  context/
    AppContext.tsx      # Global state — trips, bookings, alerts, copilot, queued messages
  hooks/
    useAgent.ts        # Chat + tool calling via SSE
    useVoice.ts        # Mic recording + Groq STT/TTS
  lib/
    agent/             # agent-loop, tools, tool-executor, system-prompt
    groq/              # LLM client, STT client, TTS client
    tbo/               # REST client, hotel-code-cache
    utils.ts           # Formatting helpers
tests/
  unit/                # 37 vitest unit tests
  e2e/                 # E2E tests (TBO API, booking flow, agent loop, chat SSE, voice)
  helpers/             # Test utilities
```

## TBO API Notes

The TBO staging API uses different field names than the official documentation. Key differences:

| Official Docs | Actual Staging API |
|---|---|
| `CheckInDate` / `CheckOutDate` | `CheckIn` / `CheckOut` |
| `RoomGuests` with `AdultCount` | `PaxRooms` with `Adults` |
| `HotelResult[]` | `HotelSearchResults[]` |
| `hotel.HotelName` (top-level) | `hotel.HotelInfo.HotelName` (nested) |
| `hotel.Price.OfferedPrice` | `hotel.MinHotelPrice.TotalPrice` |
| `RoomResult[][]` (nested) | `Rooms[]` (flat) |
| `room.Price.OfferedPrice` | `room.TotalFare` |

Sessions expire in ~60 seconds. The client handles this by chaining API calls quickly and re-searching on expiry.

See [TBO_API_FINDINGS.md](./TBO_API_FINDINGS.md) for the full mapping.

## Testing

```bash
# Unit tests (37 tests, ~130ms)
npm test

# TBO API E2E (requires .env.local with TBO credentials)
npm run test:tbo
```

All 37 unit tests and 5 TBO API E2E tests pass.

## Deployment

Deployed on Vercel. Set all environment variables in Vercel project settings:

```
TBO_API_URL
TBO_USERNAME
TBO_PASSWORD
GROQ_API_KEY
NEXT_PUBLIC_MAPBOX_TOKEN
```

## License

Built for TBO VoyageHack 3.0 hackathon.
