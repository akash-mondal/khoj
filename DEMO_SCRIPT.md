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
- Request 16:9, 4K, clean sans-serif throughout
- The slides are meant to be paused and studied — more content = more impressive

---

## SLIDE 1: Opening Slide (shown first 15 seconds)

### What it communicates
- Khoj branding + tagline + what it is in one sentence
- The real problem with numbers and pain points described in full sentences
- Khoj's solution broken into concrete capabilities with descriptions
- The workflow: how an agent actually uses it
- Tech stack, VoyageHack context, "Live Demo" energy

### Nano Banana Pro Prompt

```
A richly detailed 16:9 presentation slide designed as a premium hackathon pitch deck page. Deep navy blue background with a very subtle dark geometric grid pattern overlay.

TOP SECTION:
In the top-left, the word "Khoj" in large bold white serif font, size 72pt equivalent, with a small golden sparkle icon to its left. Directly below "Khoj" in clean white sans-serif font size 18pt: "The AI Copilot That Turns Travel Agents Into Superagents". Below that in small gold uppercase tracking: "VoyageHack 3.0 — Live Demo".

TOP-RIGHT corner: A small rounded dark card with gold border containing three lines of tiny white text: "Built with Next.js 16 + React 19", "Groq LLM + Whisper + Orpheus TTS", "Real TBO Staging API Integration".

MIDDLE SECTION divided into two columns by a thin vertical gold dashed line:

LEFT COLUMN header: "The Problem Today" in gold uppercase 14pt. Below it, four detailed rows, each row is a dark rounded card with a red-tinted left border. Each card contains a white icon on the left and two lines of white text:
Row 1: Clock icon. Bold line: "Manual Hotel Search". Normal line: "Agents search 300K+ hotel codes by hand across dozens of supplier portals".
Row 2: Bell-off icon. Bold line: "Missed Price Drops & Changes". Normal line: "No alerts when flights reschedule or hotel rates drop after booking".
Row 3: Users icon. Bold line: "Zero Client Memory". Normal line: "Preferences, loyalty programs, dietary needs forgotten between trips".
Row 4: Layers icon. Bold line: "Fragmented Workflow". Normal line: "Search, compare, prebook, book, track — all separate tools and tabs".

RIGHT COLUMN header: "How Khoj Solves It" in gold uppercase 14pt. Below it, four matching rows, each card has a gold-tinted left border with a warm subtle glow:
Row 1: Sparkles icon. Bold line: "AI-Powered Hotel Discovery". Normal line: "Searches 307,640 hotels across 19 cities via TBO API in seconds".
Row 2: Bell icon. Bold line: "Proactive Alert System". Normal line: "Price drops, schedule changes, reconfirmation reminders — click to act".
Row 3: Heart icon. Bold line: "Client-Aware Personalization". Normal line: "Remembers star preference, pool needs, brands, budget, loyalty programs".
Row 4: Mic icon. Bold line: "Voice-First Agent". Normal line: "Speak commands while on client calls — hands-free search and booking".

BOTTOM SECTION:
A horizontal flow diagram showing the agent workflow as five connected rounded pill shapes with arrows between them, flowing left to right: "Alert Triggers" → "AI Analyzes" → "Hotels Searched" → "Rooms Compared" → "Booking Confirmed". Each pill is dark with white text and a thin gold outline. Arrows are thin gold lines.

Very bottom edge: a thin gold line separating a footer. Footer left: "Team Khoj" in tiny white text. Footer center: "Powered by TBO API + Groq LLM + Mapbox" in tiny gray text. Footer right: "100% Live Data — Zero Mocks" in a small gold pill badge with dark text.

Overall style: premium dark luxury, clean sans-serif typography throughout, maximum information density while maintaining elegance, every piece of text is crisp and legible, the kind of slide that makes judges pause and zoom in.
```

---

## SLIDE 2: Closing Slide (shown last 15 seconds)

### What it communicates
- Recap of all 5 flows with actual descriptions of what each demonstrated
- Full architecture diagram with every component named and connected
- Hard numbers: 307K hotels, 19 cities, 13 tools, 37 tests, 60s sessions
- What makes this different from every other hackathon submission
- Team identity + next steps

### Nano Banana Pro Prompt

```
A richly detailed 16:9 presentation slide serving as the closing recap of a hackathon demo. Deep navy blue background with subtle dark geometric grid pattern matching the opening slide.

TOP SECTION:
Centered at top: "What You Just Saw — 5 Live Flows, Zero Mocked Data" in white serif font 36pt, with a thin gold underline stretching the width of the text.

UPPER-MIDDLE SECTION — Five detailed cards in a horizontal row with small gaps between them. Each card is a tall rounded rectangle with dark blue-gray background and thin gold border. Each card has a gold circle with a white number at the top, a white icon below it, a bold white title, and 2-3 lines of small white descriptive text:

Card 1: Number "1" in gold circle. Bell icon. Title: "Alert → Action". Description: "Clicked a price drop alert on the dashboard. Copilot auto-opened and recommended rebooking Kumar's Marriott Dubai at $23/night savings."

Card 2: Number "2" in gold circle. Search icon. Title: "Smart Search". Description: "Selected client Priya Mehra. Copilot loaded her preferences and searched Bali hotels via live TBO API. Real prices, images, star ratings."

Card 3: Number "3" in gold circle. Door icon. Title: "Room Booking". Description: "Clicked View Rooms on a hotel. Got room types, meal plans, cancellation policies, taxes. Selected a room and triggered booking flow."

Card 4: Number "4" in gold circle. Microphone icon. Title: "Voice Agent". Description: "Spoke 'Find 5-star hotels in Dubai for Kumar'. Voice transcribed via Groq Whisper. Client prefs loaded. Hotel cards appeared. Hands-free."

Card 5: Number "5" in gold circle. Map-pin icon. Title: "Trip Center". Description: "Opened Kumar's Dubai trip. Full itinerary timeline, live Mapbox map with pins, budget bar showing $3200 of $5000 spent, all in one view."

LOWER-MIDDLE SECTION — Architecture diagram:
A horizontal system architecture diagram with boxes and labeled arrows. Three main layers shown left to right:

Left group labeled "Frontend" in gold: Two stacked boxes "Next.js 16 + React 19" and "Framer Motion + Tailwind + Mapbox".
Center group labeled "Agent Layer" in gold: A large central box "Groq LLM (openai/gpt-oss-120b)" with a smaller box below it "13 Agent Tools" and another below that listing in tiny text: "search_hotels, get_rooms, prebook, book, cancel, get_details, client_prefs, add_itinerary, generate_quote, suggest_activities, booking_status, cancellation_policy, voice".
Right group labeled "APIs" in gold: Two stacked boxes "TBO Staging API" with "307,640 Hotels · 19 Cities" below it, and "Groq Whisper + Orpheus TTS" with "Voice In · Voice Out" below it.

Arrows connect Frontend → Agent Layer → APIs, with return arrows going back.

BOTTOM SECTION:
A row of six small stat boxes with gold top borders, evenly spaced across the bottom:
Box 1: Large text "307,640" small text "Hotel Codes"
Box 2: Large text "19" small text "Cities Live"
Box 3: Large text "13" small text "Agent Tools"
Box 4: Large text "37" small text "Tests Passing"
Box 5: Large text "60s" small text "Session TTL"
Box 6: Large text "0" small text "Mocked Calls"

Very bottom footer: Left side "Team Khoj — VoyageHack 3.0" in tiny white text. Right side "github.com/team-khoj" in tiny gray text.

Overall style: premium dark luxury matching slide 1, maximum information density, clean sans-serif typography, every single text element is crisp and legible at 4K, this slide should feel like an engineering blueprint crossed with a luxury brand pitch — the kind of thing judges screenshot and share.
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

**On screen:** Dashboard is open. Alerts section visible. Click "Price dropped on Marriott Dubai" alert.

**Hitakshi says:**

> "So here's the agent's dashboard — you can see live alerts coming in. This one says Marriott Dubai dropped twenty-three dollars a night. I just click it... and the copilot picks it up automatically. It already knows this is Kumar's trip, and it's asking if it should check rates and rebook. The agent didn't have to type anything."

*Screen Studio: zoom into the alert click, then zoom into copilot panel as the message appears and AI responds.*

---

### [0:40 - 1:05] FLOW 2: Client-Aware Hotel Search

**On screen:** Navigate to Clients tab. Click Priya Mehra. Copilot shows suggested actions. Click "Find hotels in Bali".

**Hitakshi says:**

> "Now say I'm working on Mehra's file. I click her profile, and Khoj already knows — four-star preference, no pool needed, she likes Novotel and Holiday Inn. I hit this suggested action for Bali hotels and... these are real results from TBO's API. Prices, star ratings, images — all live."

*Screen Studio: zoom into client preferences briefly, then the hotel cards loading in copilot.*

---

### [1:05 - 1:30] FLOW 3: Room Selection

**On screen:** From hotel cards, click "View Rooms" on one. Room cards appear. Click "Select Room".

**Hitakshi says:**

> "If a hotel looks good, I just click View Rooms — and now you see room types, meal plans, whether it's refundable, actual pricing with taxes. I pick one, hit Select Room, and it kicks off the booking flow. Discovery to booking, all in one conversation."

*Screen Studio: zoom into room card details — meal type, price, refundable badge.*

---

### [1:30 - 1:55] FLOW 4: Voice Agent

**On screen:** Click microphone button. Speak into mic. Voice transcribed. Hotel cards appear.

**Hitakshi says:**

> "And here's the part I really like — the agent can just talk to it. Click the mic, say 'find five-star hotels in Dubai for Kumar', and Khoj transcribes it, pulls Kumar's preferences, runs the search, and gives you results. Hands-free. Really useful when you're on the phone with a client."

*Screen Studio: zoom into mic button, then the voice waveform/transcription, then results.*

---

### [1:55 - 2:25] FLOW 5: Trip Command Center

**On screen:** Go back to Dashboard. Click Kumar's Dubai trip card. Full trip workspace opens — itinerary, map, budget.

**Hitakshi says:**

> "Last thing — every trip has a command center. I click Kumar's Dubai trip and you get everything in one screen. The itinerary timeline, a real map showing all the locations, budget breakdown with how much is spent versus allocated. The agent doesn't have to jump between tabs or tools — it's all right here."

*Screen Studio: zoom into budget bar, then pan across itinerary items, then the Mapbox map.*

---

### [2:25 - 2:45] CLOSING SLIDE on screen

**Hitakshi says:**

> "So that's all five flows — you can see them recapped on the slide with what each one actually did. Alert to action, smart search, room booking, voice agent, trip center. The architecture's right there too — Groq powering the LLM and voice, thirteen agent tools in the middle, TBO's live API on the other end. Three hundred thousand hotels, nineteen cities, thirty-seven tests passing, and zero mocked API calls. That's Khoj."

*Tone: let the slide do the heavy lifting. Hitakshi just reads the highlights — the numbers speak for themselves. Don't rush, let it land. End clean, no "thanks for watching."*

---

## TIPS FOR HITAKSHI

1. **Don't memorize the script word-for-word.** Read it twice, understand the beats, then say it in your own words. The goal is to sound like you're demoing at a table, not presenting at a conference.

2. **Pause for the visuals.** When hotel cards load or the map renders, let it breathe for 1-2 seconds. Don't talk over loading states.

3. **Screen Studio cursor zoom** is your best friend. Use it on:
   - The alert click (Flow 1)
   - The hotel card prices (Flow 2)
   - The room refundable badge (Flow 3)
   - The mic button (Flow 4)
   - The budget bar (Flow 5)

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
