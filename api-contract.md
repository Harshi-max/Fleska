# API Contract

All money values in responses are **strings with exactly 2 decimals** (e.g. `"12.30"`) to avoid float-format ambiguity. Requests send item prices as they appear in `fixtures/menu.json`.

Your server must run on `PORT` env var (default 3001). These shapes are fixed — our test suite calls them exactly as written.

## POST /orders

Request:
```json
{
  "shop_id": "shop_berlin",
  "items": [{ "sku": "PIZZA_M", "qty": 2 }],
  "tip": "2.00",
  "discount": "1.50",
  "payment_type": "CARD",
  "placed_at": "2026-07-05T23:30:00-05:00"
}
```
- `sku` refers to `fixtures/menu.json`; unknown sku → `400`
- `placed_at` optional ISO-8601 with offset; defaults to server now. (It exists so daily reports are testable.)
- `payment_type`: `"CARD"` | `"CASH"`
- Validation: negative tip/discount → `400`; discount > pre-discount total → `400`

Response `201`:
```json
{
  "id": "<any unique string>",
  "shop_id": "shop_berlin",
  "payment_type": "CARD",
  "placed_at": "2026-07-05T23:30:00-05:00",
  "subtotal": "27.04",
  "convenience_fee": "1.08",
  "dual_pricing_surcharge": "1.04",
  "tip": "2.00",
  "discount": "1.50",
  "total": "28.62"
}
```
Semantics:
- CARD: each item price is increased by 4% (dual pricing) **before** summing → `subtotal` includes the surcharge; `dual_pricing_surcharge` reports how much of the subtotal that increase was (informational — do NOT add it again to total)
- CASH: no dual pricing, no convenience fee
- `convenience_fee` = 2.9% of `subtotal` + $0.30 (CARD only)
- Invariant: `subtotal + convenience_fee + tip − discount == total` (±$0.01), else respond `422`

## POST /orders/:id/split

Request:
```json
{ "ways": 3 }
```
- `ways`: integer 2–20, else `400`; unknown order id → `404`

Response `200`:
```json
{
  "order_id": "...",
  "total": "28.62",
  "shares": ["9.54", "9.54", "9.54"]
}
```
- `shares` length = `ways`, each ≥ 0, and the sum of shares must equal `total` **exactly**
- Max share − min share ≤ $0.01

## GET /reports/daily?date=2026-07-05&tz=America/Chicago

Response `200`:
```json
{
  "date": "2026-07-05",
  "tz": "America/Chicago",
  "order_count": 3,
  "orders": [{ "id": "...", "placed_at": "...", "total": "28.62" }],
  "gross_total": "84.10",
  "card_fees_total": "3.24"
}
```
- An order belongs to `date` if its `placed_at` instant falls within that calendar day **in the given timezone**
- Invalid tz → `400`
