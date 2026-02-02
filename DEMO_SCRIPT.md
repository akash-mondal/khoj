# Khoj Demo Video — Pitch Slides + Narration Script

## Overview

Two AI-generated slides (via Nano Banana Pro / Gemini 3 Pro Image) bookending a 3-minute Screen Studio demo video. Hitakshi narrates. Slides are information-dense; narration is brief and human. Viewer can pause to absorb visual detail.

**Model:** Nano Banana Pro (API: `gemini-3-pro-image-preview`) via Google AI Studio
**Aspect ratio:** 16:9 (presentation format)
**Access:** aistudio.google.com → select model → paste prompt

---

## Prompting Strategy (from research)

- Nano Banana Pro handles dense text well — lean into it. Pack real data, numbers, descriptions.
- Natural language, not keyword soup. Write like a creative brief.
- Specify layout spatially: "top left", "center", "bottom right"
- Put exact text in double quotes
- Describe colors, typography, style explicitly
- Request 16:9, 4K resolution
- Match actual Khoj product theme: white background, Inter sans-serif, Instrument Serif for brand, #111827 dark accent, light gray borders, green/orange/red/blue status colors
- The slides are meant to be paused and studied — more content = more impressive
- Include visual depictions of actual product UI to sell the value proposition

---

## SLIDE 1: Opening Slide (shown first 15 seconds)

### What it communicates
- Khoj branding + tagline matching the real product aesthetic
- The problem travel agents face — with real numbers and concrete pain descriptions
- What Khoj actually looks like — miniature product screenshots showing key UI
- The value proposition as a visual before/after
- Tech stack, VoyageHack context

### Nano Banana Pro Prompt

```
A premium 16:9 presentation slide for a hackathon pitch deck. Clean white background with a very faint light gray dot grid pattern. The design matches a modern SaaS product — airy, minimal, with Inter sans-serif font for all text and a classic serif font only for the brand name.

TOP-LEFT: The word "Khoj" in large elegant serif font, 64pt, color #111827 near-black, with a small sparkle icon in #111827 to its left. Directly below in Inter regular 16pt, color #6B7280 medium gray: "AI Copilot for Travel Agents". Below that a small rounded pill badge with #111827 dark background and white text reading "VoyageHack 3.0 — Live Demo".

TOP-RIGHT: A small cluster of three tiny rounded pill tags in a row with light gray #E5E7EB borders and #6B7280 text: "Next.js 16", "Groq LLM", "TBO API". These sit elegantly in the corner.

MAIN SECTION is split into two halves — LEFT side shows the problem, RIGHT side shows the product solution. A thin light vertical dashed line in color #E5E7EB separates them.

LEFT HALF — Header: "Before Khoj" in Inter Medium 13pt, uppercase, letter-spacing 0.05em, color #9CA3AF light gray. Below it are four horizontal cards stacked vertically with small gaps. Each card has a white background, rounded corners, a thin #E5E7EB border, and a left border accent in red #DC2626. Inside each card is a small line-art icon on the left in #9CA3AF gray, a bold #111827 title, and a second line of smaller #6B7280 gray description text:
Card 1: Clock icon. Title: "Manual Hotel Search". Desc: "Agents comb through 300K+ hotel codes by hand across separate supplier portals — hours per booking."
Card 2: Bell-slash icon. Title: "Missed Price Drops". Desc: "No alerts when rates fall $23/night or flights reschedule. Savings and rebooking windows lost."
Card 3: User-x icon. Title: "Zero Client Memory". Desc: "5-star preference, pool required, vegetarian meals, Marriott Bonvoy — none remembered between trips."
Card 4: Layout icon. Title: "Tab-Hopping Workflow". Desc: "Search one tool, compare in a spreadsheet, prebook on another, confirm via email. 6+ tools per booking."

RIGHT HALF — Header: "With Khoj" in Inter Medium 13pt, uppercase, letter-spacing 0.05em, color #9CA3AF. Below it is a detailed illustrated mockup of the Khoj product UI occupying the full right half. This mockup shows:

A clean white application window with a light gray left sidebar showing nav items: Dashboard, Trips, Clients, Bookings, Alerts. The main area shows a dashboard header "Good morning, Raj." with stat cards: "2 active bookings", "$960 revenue", "4 alerts". Below that are trip cards for "Rahul Kumar — Dubai" and "Priya Mehra — Bali" with colored status badges (green "booked", orange "quoted"). At the bottom are alert rows: "Price dropped on Marriott Dubai — $23/night lower" with a green down-arrow icon and "2h ago" timestamp.

In the bottom-right corner of this mockup, overlapping slightly, is the floating copilot chat widget — a rounded white card with shadow, showing the Khoj sparkle header, a user message bubble in dark #111827 saying "find hotels for Kumar", and an assistant response with formatted text and a hotel result card showing a hotel image, star rating badge, and price. A small circular dark FAB button with a sparkle icon sits below it.

This mockup visual should be rendered as a clean flat UI illustration — not a screenshot, but a polished product rendering with the exact visual language described (white cards, thin gray borders, dark text, status colors).

BOTTOM SECTION: A horizontal strip with five connected steps showing the agent workflow. Each step is a rounded pill with white background, thin #E5E7EB border, and #111827 text. Thin arrow lines in #9CA3AF connect them left to right: "Alert Fires" → "AI Reads Context" → "Hotels Searched" → "Rooms Compared" → "Booked". Above the arrows in tiny #059669 green text: "All automated — zero manual steps".

FOOTER: A thin #E5E7EB line. Left: "Team Khoj" in #9CA3AF 10pt. Center: "TBO API + Groq LLM + Whisper + Mapbox" in #9CA3AF 10pt. Right: A small pill with #111827 background and white text: "100% Live — Zero Mocks".

Overall style: clean, airy, white, modern SaaS pitch aesthetic. The slide should feel like a product marketing page — polished, data-rich, and with a real product visual that makes judges immediately understand what Khoj looks like. No gradients, no dark backgrounds, no gold. Just crisp white, near-black text, light gray accents, and the green/orange/red status colors for visual pop. Maximum information density while maintaining the calm, professional look of a well-designed tool.
```

---

## SLIDE 2: Closing Slide (shown last 15 seconds)

### What it communicates
- Recap of all 5 demo flows — each with a mini visual showing what happened
- Full architecture diagram in the product's visual language
- Hard numbers that prove real engineering
- Why this is different from every other hackathon submission

### Nano Banana Pro Prompt

```
A premium 16:9 presentation slide for a hackathon closing recap. Clean white background with faint light gray dot grid pattern matching the opening slide. Inter sans-serif font for all text, serif font only for the brand.

TOP: Centered, the word "Khoj" in serif 28pt color #111827, with a sparkle icon. Below it: "5 Live Flows — Every API Call Real" in Inter Medium 18pt #111827. Below that a thin centered line in #E5E7EB, 200px wide.

UPPER SECTION — Five cards in a horizontal row with small gaps. Each card is a tall rounded rectangle with white background, thin #E5E7EB border, and a colored top border stripe. Each card contains a small number in a dark #111827 circle at top-left, a mini illustrated product screenshot in the upper portion, a bold title below the illustration, and 2 lines of small #6B7280 description:

Card 1: Green #059669 top border. Number "1". Mini illustration shows a dashboard with an alert row highlighted and a floating copilot widget opening with a message. Title: "Alert to Action". Desc: "Price drop alert on dashboard. One click opened copilot. AI immediately searched current Marriott Dubai rates — $23/night savings found."

Card 2: Blue #2563EB top border. Number "2". Mini illustration shows a client profile page with preference tags (4-star, Holiday Inn, Novotel) and quick action buttons at the bottom, with the copilot showing hotel result cards. Title: "Client-Aware Search". Desc: "Clicked Priya Mehra's profile, hit 'Hotels in Bali'. Copilot loaded her 4-star preference and searched TBO. Real prices, images, star ratings."

Card 3: Orange #D97706 top border. Number "3". Mini illustration shows the copilot widget with room option cards displaying meal plans, refundable badges, and prices. Title: "Room Booking". Desc: "Clicked View Rooms on a hotel. Got room types with meal plans, refund policies, taxes. Selected a room — booking flow triggered in one conversation."

Card 4: Red #DC2626 top border. Number "4". Mini illustration shows the copilot input bar with a microphone button active, small audio level bars animating, and transcribed text appearing. Title: "Voice Agent". Desc: "Clicked mic, spoke 'find 5-star hotels in Dubai for Kumar'. Audio bars showed live input. Auto-stopped on silence. Transcribed and searched hands-free."

Card 5: Dark #111827 top border. Number "5". Mini illustration shows a trip workspace split view — left side with an itinerary timeline with colored status dots, right side with a Mapbox map showing location pins. Title: "Trip Center". Desc: "Opened Kumar's Dubai trip. Itinerary timeline, live Mapbox map centered on Dubai, budget bar at 64%. Switched to Priya — map moved to Bali."

LOWER SECTION — Architecture diagram styled to match the product:
A horizontal diagram with three groups of rounded white boxes with thin #E5E7EB borders, connected by thin arrow lines in #9CA3AF.

Left group, small label above in uppercase #9CA3AF 10pt: "FRONTEND". Two stacked boxes: "Next.js 16 + React 19" and "Tailwind 4 + Framer Motion + Mapbox GL".

Center group, label: "AGENT". A larger box "Groq LLM" with subtitle "openai/gpt-oss-120b" in small #6B7280 text. Below it a box "13 Tools" with a subtle grid of tiny tool names inside in 8pt #9CA3AF: "search_hotels · get_rooms · prebook · book · cancel · details · client_prefs · itinerary · quote · activities · booking_status · cancel_policy · voice".

Right group, label: "APIS". Two stacked boxes: "TBO Staging API" with "307,640 Hotels · 19 Cities" in small green #059669 text below, and "Groq Whisper + Orpheus" with "Voice In + Voice Out" in small blue #2563EB text below.

Arrows flow left-to-right and return, with tiny labels on the arrows: "SSE Stream" going right, "Tool Results" going left.

BOTTOM SECTION — Six stat boxes in a row, each with white background, thin top border in #111827, and centered content:
Box 1: Large bold #111827 "307,640" / small #9CA3AF "Hotels"
Box 2: Large "19" / "Cities"
Box 3: Large "13" / "Agent Tools"
Box 4: Large "37" / "Tests Pass"
Box 5: Large "60s" / "Session TTL"
Box 6: Large "0" / "Mocked Calls"

FOOTER: Thin #E5E7EB line. Left: "Team Khoj — VoyageHack 3.0" in #9CA3AF. Right: "github.com/akash-mondal/khoj" in #9CA3AF.

Overall style: Clean white, modern, matching the product's actual UI aesthetic. The mini illustrations in each flow card are the hero — they give judges a visual of what each flow actually looked like without needing to rewatch the video. No dark backgrounds, no gold, no gradients. Just crisp whites, near-black #111827 accents, light gray borders, and green/orange/red/blue color pops on the status elements. Feels like a polished product marketing page, not a hackathon slide. The kind of thing judges screenshot because it looks professional and information-dense.
```

---

## HITAKSHI'S NARRATION SCRIPT

### Recording Setup (Screen Studio)
- Record at 1920x1080 or higher
- Use Screen Studio's zoom feature to highlight cursor clicks
- Keep cursor movements smooth and deliberate
- Total video: ~3 minutes (under 10 min limit, way under — that's good)

---

### [0:00 - 0:15] OPENING SLIDE on screen

**Hitakshi says:**

> "So this is Khoj — an AI copilot for travel agents. The slide kind of lays it all out — agents today are juggling three hundred thousand hotel codes by hand, missing price drops, forgetting client preferences between trips. Khoj fixes all of that. It searches TBO's live inventory, tracks alerts, knows each client's preferences, and you can even talk to it. Everything you're about to see is hitting real APIs — nothing's mocked. Let me show you."

*Tone: casual, confident. Let the slide breathe — there's a lot on it. The viewer can pause to read the details. Hitakshi just hits the headlines.*

---

### [0:15 - 0:40] FLOW 1: Alert → Copilot Action

**On screen:** Dashboard is open. Alerts section visible. Click "Price dropped on Marriott Dubai" alert. The floating copilot widget pops up in the bottom-right with the alert context pre-filled. AI immediately starts searching for current rates.

**Hitakshi says:**

> "So here's the agent's dashboard — live alerts coming in. This one says Marriott Dubai dropped twenty-three dollars a night. I click it... and the copilot pops up in the corner, already knows this is Kumar's trip, and immediately starts pulling current rates. No questions asked — it just goes and does the search."

*Screen Studio: zoom into the alert click, then zoom into the floating copilot widget as it opens and the AI starts executing tool calls.*

---

### [0:40 - 1:05] FLOW 2: Client-Aware Hotel Search

**On screen:** Navigate to Clients tab. Click Priya Mehra. See her preferences and booking patterns. Below the profile, click the "Hotels in Bali" quick action button. Floating copilot opens and immediately searches.

**Hitakshi says:**

> "Now I'm on Mehra's profile — four-star preference, Holiday Inn and Novotel are her go-to brands. See these quick action buttons at the bottom? I click 'Hotels in Bali' and the copilot fires up, already has her preferences loaded, and runs the TBO search. Real prices, star ratings, images — all live."

*Screen Studio: zoom into client preferences briefly, then the quick action buttons, then the floating copilot with hotel cards loading.*

---

### [1:05 - 1:30] FLOW 3: Room Selection

**On screen:** From hotel cards in the copilot, click "View Rooms" on one. Room cards appear with meal plans, prices, refundable badges. Click "Select Room".

**Hitakshi says:**

> "If a hotel looks good, I click View Rooms — room types, meal plans, whether it's refundable, actual pricing with taxes. I pick one, hit Select Room, and the booking flow kicks off. Discovery to booking, all in one conversation inside this copilot widget."

*Screen Studio: zoom into room card details — meal type, price, refundable badge.*

---

### [1:30 - 1:55] FLOW 4: Voice Agent

**On screen:** Click the microphone button in the copilot. Audio level bars animate showing input being received. Speak into mic — bars pulse with voice. After finishing speaking, mic auto-stops (VAD detects silence). "Transcribing..." appears, then the text shows up and search begins.

**Hitakshi says:**

> "The agent can just talk to it. Click the mic — see those bars moving? That's real-time audio feedback. I say 'find five-star hotels in Dubai for Kumar' and when I stop speaking, it auto-detects the silence and transcribes. Pulls Kumar's preferences, runs the search, hotel cards appear. Completely hands-free."

*Screen Studio: zoom into mic button, then the audio level bars animating, then the auto-stop and transcription, then results loading.*

---

### [1:55 - 2:25] FLOW 5: Trip Command Center

**On screen:** Go to Trips tab. Click Kumar's Dubai trip — map shows Dubai with markers. Then go back and click Priya's Bali trip — map correctly shows Bali. Show itinerary timeline, cost breakdown, budget bar.

**Hitakshi says:**

> "Every trip has a command center. Kumar's Dubai trip — itinerary, live map centered on Dubai, budget bar showing thirty-two hundred of five thousand spent. And if I go to Priya's Bali trip — the map moves to Bali. Each destination gets its own map view. The agent sees everything in one screen without jumping between tabs."

*Screen Studio: zoom into budget bar, then pan across itinerary, then show the Mapbox map. Quick switch to Priya's trip to show the map updating to Bali.*

---

### [2:25 - 2:45] CLOSING SLIDE on screen

**Hitakshi says:**

> "So that's five flows — alerts, search, booking, voice, trip management. The architecture's on the slide — Groq for the LLM and voice, thirteen agent tools, TBO's live API. Three hundred thousand hotels, nineteen cities, thirty-seven tests, zero mocked calls. That's Khoj."

*Tone: let the slide do the heavy lifting. Short and clean. End it — no "thanks for watching."*

---

## TIPS FOR HITAKSHI

1. **Don't memorize the script word-for-word.** Read it twice, understand the beats, then say it in your own words. The goal is to sound like you're demoing at a table, not presenting at a conference.

2. **Pause for the visuals.** When hotel cards load or the map renders, let it breathe for 1-2 seconds. Don't talk over loading states.

3. **Screen Studio cursor zoom** is your best friend. Use it on:
   - The alert click → floating copilot opening (Flow 1)
   - The quick action buttons on client profile (Flow 2)
   - The room refundable badge and prices (Flow 3)
   - The audio level bars animating during voice input (Flow 4)
   - The map switching from Dubai to Bali (Flow 5)

4. **If something loads slow or breaks,** just say "let me try that again" and cut it in post. That's what Screen Studio is for.

5. **Energy level:** Like you're showing a coworker, not pitching to investors. Casual confidence. The product speaks for itself.

6. **Total time target:** 2:45 to 3:00. Definitely under 3:30. Judges see dozens of these — short and punchy wins.

---

## Generating the Slides

1. Go to **aistudio.google.com**
2. Select **Nano Banana Pro** (or Gemini 3 Pro Image) from the model picker
3. Paste each prompt above (one at a time)
4. Generate at 16:9, highest resolution available
5. If text renders wrong, regenerate 2-3 times — it usually nails it within 3 attempts
6. Download as PNG, drop into PowerPoint/Google Slides
7. If any label is slightly off, fix it in Canva/Figma in 30 seconds — don't fight the model
