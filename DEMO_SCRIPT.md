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
