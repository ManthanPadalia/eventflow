# DECISIONS.md — Locked decisions & rationale

> These are settled. Do not re-litigate or "improve" them in a fresh session.
> If a change is truly needed, the human decides — not the agent.

### D1 — SQLite, not a cloud/hosted DB
**Decision:** Local SQLite file via Prisma.
**Why:** The #1 requirement is "clone and run instantly, with demo data." SQLite is a
single file, needs no Docker, no cloud account, no env secrets. `npm run db:setup`
migrates + seeds and you're live.
**Not** Postgres/Supabase (setup overhead) and **not** browser localStorage (this is a
real relational app with users, events, bookings, categories).

### D2 — Free registration only, no payments
**Decision:** Booking = reserving a free spot. No Stripe, no ticketing, no pricing.
**Why:** Nothing in the requirements implies paid tickets; payments would balloon scope
and risk for zero MVP benefit.

### D3 — Approve/Reject registrations: INCLUDED
**Decision:** Keep the admin approve/reject flow.
**Why:** It's cheap — a `status` enum already on `Booking` + two buttons on one admin
table. It makes the admin side feel complete.
**Scope fence:** it is ONLY a status flip in the admin bookings table. It must NOT grow
into email notifications, user alerts, or approval queues. Users simply see their
booking's status as a badge.

### D4 — Design: editorial, anti-"AI-generated"
**Decision:** Warm paper background (`#FAF8F4`), near-black ink, a single deep terracotta
accent (`#C1440E`); Instrument Serif display + Geist body.
**Why:** The generic-AI look is cool blues/purples, gradients, heavy shadows, everything
in rounded cards, emoji headers, centered layouts. Warm earth tones + a serif/grotesque
pairing + editorial whitespace reads as deliberately human-designed. Full guardrails in
`AGENTS.md`.

### D5 — Auth: simple credentials, role-gated
**Decision:** Auth.js Credentials provider, email+password, a `role` field (USER/ADMIN).
`/admin/*` is gated to ADMIN via middleware.
**Why:** Requirement says "simple login, shouldn't be complex." No email verification,
no password reset, no social login for the MVP.

### D6 — One Next.js app for everything
**Decision:** User side, admin side, and API/server-actions all in one Next.js App Router
project.
**Why:** Fastest path to a coherent MVP; no separate backend to wire up or deploy.

### D7 — Phase-wise build, repo-as-memory
**Decision:** Build in 6 phases (see PHASES.md); commit at each boundary; the repo's
markdown docs are the only cross-session memory.
**Why:** The human rotates Codex accounts, so no conversational memory persists. Phases
give each session a coherent, testable chunk, and the docs keep every session aligned.

### D8 — Cancel = soft status, not delete
**Decision:** Cancelling a booking sets status `CANCELLED`; it is not hard-deleted.
**Why:** Preserves history, keeps capacity math and admin views honest, avoids
destructive actions.
