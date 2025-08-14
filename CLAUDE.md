# Bus Duty — Build Brief (MVP as PWA on Cloudflare Pages)

## One-liner
Tap a big button when a bus arrives. Office sees a live board. Daily CSV archive. $0 infra.

## Non-negotiables
- PWA (installable, offline-friendly). No native app.
- Cloudflare Pages + Functions. One **Durable Object** per school for ordered updates; **D1** as source-of-truth log; **KV** for config; **R2** for daily CSV.
- Minimal auth: school code + PIN; office view gated with Turnstile.
- No student PII.

## Entities
- School { code, name, pin }
- Bus { school_code, bus_no, display_name, active }
- Arrival { id, school_code, bus_no, date_ymd, ts_utc, entrance? }

## API (MVP)
- `POST /api/arrive?school=CODE` { bus_no, entrance? } → { ok, arrived[], remaining[] }
- `GET /api/state?school=CODE` → { date_ymd, arrived[], remaining[] }
- `POST /api/done?school=CODE` → archives CSV to R2, returns { ok, r2_key }
- `POST /api/auth/office` (Turnstile token → server verifies → session)

## Tech
- Frontend: React + Vite (TypeScript). Service Worker + manifest.json.
- Backend: Cloudflare **Pages Functions** (Workers runtime), **Durable Object** Worker (“BusHub”), **D1** (SQLite) for arrivals, **KV** for bus list/config, **R2** for CSV.
- Bindings via `wrangler.jsonc`. Pages uses wrangler config as source of truth.

## Acceptance Criteria (MVP)
- Grid of bus buttons; tap marks arrival, button turns green; list below shows timestamp.
- Office page shows live list without refresh (polling is fine for MVP).
- “Done for the day” creates & stores CSV in R2 and clears today’s in-memory state.
- Everything deploys on Cloudflare Free tiers.

## Nice-to-haves (defer)
- SSE/WebSocket updates, multi-entrance, email/SMS, admin UI, SSO.
