# Khoj Pitch Deck — 4 Slide Prompts (Idea Round)

## Overview

4 AI-generated slides for the VoyageHack 3.0 idea round submission. Format: Cover + 2 content slides + Thank You. Generated via Nano Banana Pro / Gemini 3 Pro Image.

**Submission format:** 2-slider PPT/PPTX (excluding cover and thank you)
**Model:** Nano Banana Pro (API: `gemini-3-pro-image-preview`) via Google AI Studio
**Aspect ratio:** 16:9 (presentation format)
**Live demo:** https://khoj-demo.vercel.app

---

## SLIDE 1: Cover Page

### What it communicates
- Khoj brand identity — premium, professional, real product
- One-line value prop that instantly connects to TBO's problem statement
- VoyageHack 3.0 context + team
- Live demo URL front and center — judges can try it immediately
- Sets the tone: this is a polished product, not a hackathon project

### Nano Banana Pro Prompt

```
A premium 16:9 presentation cover slide for a hackathon pitch. Clean white background with a very faint light gray dot grid pattern. The design is airy, minimal, and confident — like a Series A startup's landing page.

CENTER-UPPER: The word "Khoj" in a large elegant serif font, 96pt, color #111827 near-black, with a small sparkle icon in #111827 to its left. The font has beautiful contrast between thick and thin strokes. This is the hero element — bold, commanding, takes up visual space.

Directly below "Khoj" in Inter regular 20pt, color #6B7280 medium gray, centered: "The Virtual Travel Agent Copilot". Below that, a thin horizontal line in #E5E7EB, 120px wide, centered.

Below the line, a single sentence in Inter regular 15pt, color #9CA3AF, centered, max-width 600px: "AI-powered copilot that helps travel agents discover, recommend, and book travel products 10x faster — with real TBO APIs, voice input, and proactive intelligence."

CENTER-LOWER: A prominent rounded pill button shape with #111827 dark background and white text in Inter Medium 14pt: "Try the live demo → khoj-demo.vercel.app". This pill has a subtle white border glow / soft shadow to draw attention. It's the clear call-to-action.

Below the demo pill, small text in #9CA3AF 11pt: "100% live APIs — zero mocked data"

BOTTOM-LEFT: "VoyageHack 3.0" in a small rounded pill with thin #E5E7EB border and #6B7280 text. Next to it: "TBO Tek" in same style pill.

BOTTOM-CENTER: Very small text in #9CA3AF 10pt: "Team Khoj — Akash Mondal & Hitakshi"

BOTTOM-RIGHT: Three tiny rounded pill tags in a row with light #E5E7EB borders and #9CA3AF text: "Next.js 16", "Groq LLM", "TBO API"

Overall style: Ultra-clean, confident, white-space-heavy. This cover should feel like an Apple keynote title slide crossed with a premium SaaS landing page. The "Khoj" wordmark dominates. The demo URL is impossible to miss. No clutter, no gradients, no dark backgrounds. Just crisp typography, light gray accents, and quiet confidence. The kind of cover that makes judges think "this team takes design seriously."
```

---

## SLIDE 2: Problem + What We Built (Content Slide 1)

### What it communicates
- The agent's daily reality — concrete, numbered pain points with real data
- What Khoj does today — a working product with 5 live flows
- Mini product visuals that show the actual UI
- Hard engineering stats that prove this is real
- Architecture summary

### Nano Banana Pro Prompt

```
A premium 16:9 presentation slide for a hackathon pitch deck. Clean white background with faint light gray dot grid pattern. Inter sans-serif font for all text, classic serif font only for the brand name. This slide is DENSE with information — every inch communicates value.

TOP-LEFT: "Khoj" in serif 24pt #111827 with sparkle icon. Next to it a thin vertical #E5E7EB line, then "What Agents Face → What We Built" in Inter Medium 16pt #111827.

TOP-RIGHT: A small dark #111827 pill with white text: "khoj-demo.vercel.app"

The slide is split into TWO HALVES by a thin vertical dashed line in #E5E7EB.

LEFT HALF (40% width) — Header: "THE PROBLEM" in Inter Medium 10pt, uppercase, letter-spacing 0.1em, color #DC2626 red. Below: "Travel agents manage $900B+ in bookings using fragmented, manual workflows" in Inter 12pt #6B7280.

Below that are four pain-point cards stacked vertically with small gaps. Each has white background, rounded corners, thin #E5E7EB border, and a left border accent in red #DC2626. Each card has a small line-art icon in #9CA3AF, a bold #111827 title, and a second line of #6B7280 description:

Card 1: Search icon. Title: "300K+ Hotels, Zero Intelligence". Desc: "Agents search supplier portals one by one — no cross-system comparison, no memory of what worked before."
Card 2: Bell-off icon. Title: "Blind to Price Changes". Desc: "Rates shift hourly. A $23/night drop on a $196 hotel? The agent finds out days later — or never."
Card 3: Brain icon. Title: "Client Preferences Lost". Desc: "5-star preference, pool required, Marriott loyalty, vegetarian meals — agents re-discover these every single trip."
Card 4: Layers icon. Title: "6+ Tools Per Booking". Desc: "Search here, compare there, prebook somewhere else, confirm via email. Every booking is a scavenger hunt."

Below the cards: "Result: 45+ minutes per booking. Missed savings. Frustrated clients." in Inter 11pt italic #DC2626.

RIGHT HALF (60% width) — Header: "KHOJ — LIVE TODAY" in Inter Medium 10pt, uppercase, letter-spacing 0.1em, color #059669 green.

Below that are five horizontal flow cards arranged in a tight grid (3 top, 2 bottom). Each is a small card with white background, thin #E5E7EB border, a colored left border stripe, a small circled number, a mini illustrated product screenshot occupying the top portion, a bold title, and one line of description:

Flow 1: Green #059669 left stripe. Number "1". Mini illustration of a dashboard with alert rows and a floating copilot widget opening in the corner. Title: "Alert → Instant Action". Desc: "Price drop alert opens copilot. AI searches current rates automatically."

Flow 2: Blue #2563EB left stripe. Number "2". Mini illustration of a client profile with preference tags and quick action buttons below, with copilot showing hotel cards. Title: "Client-Aware Search". Desc: "Agent clicks client → Khoj loads preferences → TBO search with real prices."

Flow 3: Orange #D97706 left stripe. Number "3". Mini illustration of hotel cards in a 2-column grid with one expanded showing room rows with meal/refund badges and prices. Title: "Rooms + Inline Booking". Desc: "Click hotel → rooms load inline → prebook with one click. No page jumps."

Flow 4: Red #DC2626 left stripe. Number "4". Mini illustration of copilot input bar with microphone active and audio level bars animating. Title: "Voice-First Agent". Desc: "Speak naturally. Auto-detects silence. Transcribes and executes."

Flow 5: Dark #111827 left stripe. Number "5". Mini illustration of a split view — left itinerary timeline, right Mapbox map with pins. Title: "Trip Command Center". Desc: "Itinerary + live map + budget — one screen per trip."

BOTTOM SECTION: A thin #E5E7EB horizontal line. Below it, a row of 7 stat boxes, each with a large bold #111827 number and a small #9CA3AF label below:
"307,640 Hotels" · "19 Cities" · "13 AI Tools" · "37 Tests" · "60s TTL" · "0 Mocks" · "< 3s Response"

FOOTER: Left: "Team Khoj — VoyageHack 3.0" in #9CA3AF 9pt. Right: Architecture in tiny text: "Next.js 16 → Groq LLM (gpt-oss-120b) → TBO Staging API · Whisper · Mapbox" in #9CA3AF 9pt.

Overall style: Information-dense but clean. The left side is red-accented problems, the right side is green-accented solutions — the visual contrast tells the story instantly. The mini product illustrations in each flow card are the hero — judges see the actual UI, not generic mockups. Every stat is real. White background, no gradients, no dark mode. Crisp, data-rich, professional. The kind of slide where judges zoom in because there's always more detail to find.
```

---

## SLIDE 3: Vision + Integrations (Content Slide 2)

### What it communicates
- Khoj isn't just a chatbot — it's an intelligent agent PLATFORM
- 6+ integrations that extend Khoj beyond the browser (WhatsApp, Calendar, CRM, Email, Notifications, Invoicing)
- AI reasoning layer — thinking, learning, proactive intelligence
- The "10x agent" vision — what the future looks like
- This is the slide that separates us from every other team

### Nano Banana Pro Prompt

```
A premium 16:9 presentation slide for a hackathon pitch deck showing a product vision and integration ecosystem. Clean white background with faint light gray dot grid pattern. Inter sans-serif for all text, serif only for brand. This slide sells the FUTURE — ambitious, credible, and visually striking.

TOP-LEFT: "Khoj" in serif 24pt #111827 with sparkle icon. Next to it: "The Agent Platform — Beyond the Browser" in Inter Medium 16pt #111827.

TOP-RIGHT: Small pill in #111827 dark bg with white text: "khoj-demo.vercel.app"

MAIN SECTION — A large central hub-and-spoke diagram occupying 65% of the slide.

CENTER HUB: A larger rounded rectangle with a subtle #111827 border, light gray #F9FAFB fill, and a thin accent shadow. Inside: the sparkle icon at top, "Khoj AI Engine" in Inter Bold 16pt #111827, and below it "13 Tools · Reasoning · Memory" in Inter 11pt #6B7280. This hub has a subtle animated-feeling glow ring in very light blue #2563EB at 10% opacity — suggesting intelligence and activity.

Six integration nodes are arranged in a circle around the hub, connected by thin #9CA3AF lines with small directional arrows pointing both ways (bi-directional). Each node is a rounded card with white background, thin #E5E7EB border, a colored top border stripe, and contains: a small icon, a bold title, and 2 lines of description.

NODE 1 (top-left): Green #059669 top stripe. WhatsApp icon (chat bubble with phone). Title: "WhatsApp Bot". Desc: "Clients message directly. Khoj processes requests, suggests responses, agent approves. 2-way sync — itineraries, confirmations, changes." Small green badge: "98% open rate"

NODE 2 (top-right): Blue #2563EB top stripe. Calendar icon. Title: "Calendar Sync". Desc: "Auto-add check-ins, flights, transfers to Google Calendar / Outlook. Travel reminders 24h before. Meeting scheduling with suppliers." Small blue badge: "Auto-sync"

NODE 3 (right): Orange #D97706 top stripe. Bell icon. Title: "Smart Notifications". Desc: "Price drops, schedule changes, booking confirmations, payment reminders via push, SMS, and email. Works beyond the browser — agents never miss an alert." Small orange badge: "Multi-channel"

NODE 4 (bottom-right): Purple #7C3AED top stripe. Users icon (people silhouettes). Title: "CRM Integration". Desc: "Salesforce, HubSpot, or built-in. Client lifecycle, booking history, communication log. Every preference remembered forever." Small purple badge: "Client 360"

NODE 5 (bottom-left): Red #DC2626 top stripe. Mail icon. Title: "Email Automation". Desc: "Parse incoming client requests from Gmail/Outlook. Auto-draft itinerary responses. Send branded confirmations and invoices on booking." Small red badge: "AI-drafted"

NODE 6 (left): Dark #374151 top stripe. Receipt icon. Title: "Invoicing & Commission". Desc: "Track commissions per booking. Auto-generate GST invoices. Reconcile payments. Revenue dashboard for the agent's business." Small dark badge: "Auto-track"

BELOW THE DIAGRAM — A horizontal strip with dark #111827 background and white text, full-width, rounded corners. This is the "AI Brain" section:

Left side: A small brain icon in white. Text: "AI Reasoning Engine" in Inter Bold 13pt white.

Right side: Three short bullet points in Inter 11pt white/light gray, separated by thin vertical lines:
"Chain-of-thought reasoning for multi-leg itineraries" · "Learns from agent feedback — gets smarter every trip" · "Proactive upsells, better deals, loyalty match suggestions"

BOTTOM SECTION: A single powerful line in Inter Medium 14pt #111827 centered: "One copilot. Every channel. Every client. Every booking." Below it in smaller Inter 11pt #6B7280: "Turning agents from booking operators into travel strategists."

FOOTER: Left: "Team Khoj — VoyageHack 3.0" in #9CA3AF 9pt. Right: "Vision roadmap — built on the same architecture shipping today" in #9CA3AF 9pt.

Overall style: This slide should feel AMBITIOUS but GROUNDED. The hub-and-spoke diagram is the hero — it shows Khoj at the center of an ecosystem, not just a chat window. Each integration node is specific and practical (not hand-wavy). The dark AI reasoning strip at the bottom adds gravitas. White background, colorful integration nodes creating a rainbow effect around the central hub. The visual hierarchy draws the eye: hub first, then nodes, then the AI strip, then the tagline. Judges should look at this and think "this team is building a platform, not a feature." Information-dense but spatially balanced. No gradients on the background, no dark mode — just the clean white Khoj aesthetic with strategic pops of color on each integration.
```

---

## SLIDE 4: Thank You / Try It Live

### What it communicates
- The demo is LIVE — judges can try it right now
- Clear URL, impossible to miss
- Quick recap of what makes Khoj different (one-line differentiators)
- Team info
- Confident close — the product speaks for itself

### Nano Banana Pro Prompt

```
A premium 16:9 presentation closing slide for a hackathon pitch. Clean white background with faint light gray dot grid pattern. Inter sans-serif for all text, serif only for brand. This slide is intentionally spacious — it's the landing page after an information-dense presentation.

CENTER-UPPER (the hero): The word "Khoj" in large serif 72pt #111827 with sparkle icon. Below it: "Try it live." in Inter Medium 28pt #111827. Clean, bold, inviting.

Below that, a large prominent rounded rectangle button shape, centered, with #111827 dark background, soft shadow, and white text in Inter Medium 18pt: "khoj-demo.vercel.app". This is the biggest interactive-looking element on the slide. Below the URL button, tiny text in #9CA3AF 10pt: "Real TBO APIs · Real hotel data · Real booking flows · Nothing mocked"

MID-SECTION: A thin #E5E7EB horizontal line spanning 60% width, centered. Below it, the header "Why Khoj is Different" in Inter Medium 12pt #9CA3AF uppercase, letter-spacing 0.1em, centered.

Below the header, four differentiator cards in a single horizontal row with small gaps. Each card has white background, thin #E5E7EB border, rounded corners, and a small colored top border:

Card 1: Green top border. Small sparkle icon in #059669. Text: "AI That Acts" in Inter Bold 12pt #111827. Below: "Doesn't ask permission — searches, compares, prebooks automatically" in Inter 10pt #6B7280.

Card 2: Blue top border. Small globe icon in #2563EB. Text: "Beyond the Browser" in Inter Bold 12pt #111827. Below: "WhatsApp, Calendar, Email, Notifications — meets agents where they work" in Inter 10pt #6B7280.

Card 3: Orange top border. Small mic icon in #D97706. Text: "Voice-Native" in Inter Bold 12pt #111827. Below: "Speak naturally, auto-silence detection, hands-free hotel search and booking" in Inter 10pt #6B7280.

Card 4: Red top border. Small database icon in #DC2626. Text: "307K Hotels Live" in Inter Bold 12pt #111827. Below: "TBO staging API with real inventory, real prices, real booking codes" in Inter 10pt #6B7280.

LOWER SECTION: Two columns below the differentiator cards.

LEFT COLUMN: "Tech Stack" header in Inter Medium 10pt #9CA3AF uppercase. Below, a clean vertical list in Inter 11pt #6B7280:
"Next.js 16 + React 19"
"Groq LLM (openai/gpt-oss-120b)"
"TBO Hotel API (307,640 hotels · 19 cities)"
"Groq Whisper + Orpheus (voice I/O)"
"Mapbox GL (trip maps)"
"Framer Motion (animations)"
"Vercel (deployment)"

RIGHT COLUMN: "Team Khoj" header in Inter Medium 10pt #9CA3AF uppercase. Below:
"Akash Mondal" in Inter Medium 13pt #111827, and below it "Full-stack · AI Agent Architecture" in Inter 10pt #6B7280.
"Hitakshi" in Inter Medium 13pt #111827, and below it "Product · UX · Demo Narration" in Inter 10pt #6B7280.
Small space, then "VoyageHack 3.0" in a rounded pill with #E5E7EB border and #6B7280 text.

FOOTER: A thin #E5E7EB line. Centered: "github.com/akash-mondal/khoj" in #9CA3AF 10pt.

Overall style: Spacious, confident, closing. The URL is the undeniable hero — big, dark, prominent. The differentiator cards give judges four reasons to remember Khoj. The tech stack and team section adds credibility without clutter. Lots of white space compared to the previous dense slides — this is the exhale after the inhale. Clean, premium, the kind of closing slide where judges immediately open a new tab to try the demo. No gradients, no dark background, no gold accents. Just the clean Khoj white aesthetic with the dark URL button as the focal point.
```

---

## Slide Order in PPT

| Slide | Purpose | Shown |
|-------|---------|-------|
| 1 | Cover — Khoj branding + demo URL | First impression |
| 2 | Problem → What We Built (5 live flows + stats) | Core content slide 1 |
| 3 | Vision — Platform + 6 Integrations + AI Reasoning | Core content slide 2 |
| 4 | Thank You — Try it live + differentiators + team | Close |

## Generating the Slides

1. Go to **aistudio.google.com**
2. Select **Nano Banana Pro** (or Gemini 3 Pro Image) from the model picker
3. Paste each prompt above (one at a time)
4. Generate at 16:9, highest resolution available
5. If text renders wrong, regenerate 2-3 times — it usually nails it within 3 attempts
6. Download as PNG, drop into PowerPoint/Google Slides
7. If any label is slightly off, fix it in Canva/Figma in 30 seconds

## Key Narrative Arc

**Slide 1 (Cover):** "We built something real."
**Slide 2 (Problem → Solution):** "Here's the pain. Here's what we built to fix it."
**Slide 3 (Vision):** "But we're not building a chatbot — we're building a platform."
**Slide 4 (Close):** "Try it yourself. Right now."
