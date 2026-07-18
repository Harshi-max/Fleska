# Engineering Internship — Take-Home Assignment

Welcome! This is the technical round for the Fleksa / Nuxa engineering internship. You'll build a small full-stack restaurant billing app. Expect **4–6 hours** of focused work. Deadline is in your invitation email.

## What you're building

A mini restaurant ordering & billing service: a small backend API + a small frontend. Restaurants in different countries and timezones sell items, charge card fees, split bills, and need daily reports that are **actually correct** — that's the whole game here. The details that look trivial (cents, rounding, midnight) are the assignment.

## Requirements

### Backend — 3 endpoints (spec in `api-contract.md`)

1. **`POST /orders`** — create an order from items (price × qty), tip, discount, payment type (`CARD` | `CASH`).
   The server computes:
   - **Convenience fee**: 2.9% of subtotal + $0.30 — CARD only, $0.00 for CASH
   - **Dual-pricing surcharge**: 4% baked into item prices — CARD only
   - **Invariant (must hold, reject otherwise)**: `subtotal + convenience_fee + tip − discount = total` (±$0.01)
2. **`POST /orders/:id/split`** — split the total N ways. The N shares **must sum back to the exact total** — no lost or invented cents.
3. **`GET /reports/daily?date=YYYY-MM-DD&tz=<IANA timezone>`** — orders grouped by **business day in the shop's timezone**. An order placed 23:30 in Chicago on the 5th belongs to the 5th — not the 6th.

Use the data in `fixtures/` — the two shops (Berlin & Chicago) and sample orders are your test data. Some of them are... deliberately chosen.

### Frontend — 2–3 screens (React or Next.js)

1. **Order screen** — menu, cart, CARD/CASH toggle, live fee breakdown (subtotal, convenience fee, dual pricing, tip, discount, total). The displayed total must come from the **server**, not be recomputed in the browser.
2. **Split screen** — pick N people, show each share, and show that the shares sum to the total.
3. **Report screen** — date + timezone picker, list of orders for that business day with totals.

Plain and functional beats pretty. We're reading your state management, not your gradients.

### Stack

- TypeScript throughout (backend and frontend)
- Backend framework: your choice (Express / Fastify / Next API routes / Nest)
- Frontend: React or Next.js
- Database optional — in-memory storage is fine
- Tests required for: rounding edge cases, the invariant, split-sum exactness, and a timezone boundary case

## AI tools: allowed and encouraged

Use Claude Code, Cursor, Copilot — whatever you actually work with. We work with them daily too. But you must submit:

- **`AI-USAGE.md`** — what you asked the AI, **where it was wrong, and what you overrode**. "The AI got everything right" is not a credible answer for this assignment.
- **`DECISIONS.md`** — how you represented money and why, how you distributed remainder cents in splits, how you handled timezone/DST, what you'd do differently with more time.

We grade judgment, not typing speed. The AI-usage doc is a first-class deliverable.

## Submission

1. Build in a **private GitHub repo** (do not publish it publicly)
2. Add **`MishraBhushan`** as a collaborator
3. Include a README with run instructions (`npm install && npm run dev` level)
4. Record a **3-minute Loom** walking through your code and one decision you're proud of
5. Reply to the invitation email with your repo link + Loom link **before the deadline**

## Optional bonus (ungraded, but we'll notice)

`GET /insights?date=&tz=` — a natural-language daily summary ("Slow Tuesday: 4 orders, card fees ate 3.1% of revenue..."). Use any LLM API or mock the call — the prompt design and data plumbing are what's interesting.

## What happens next

If your submission passes review, the final round is a 30-minute call where **you modify your own code live** — we'll change one requirement and watch you work. So build something you understand completely.

Good luck — build the boring parts carefully.
