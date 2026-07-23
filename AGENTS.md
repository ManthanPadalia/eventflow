# AGENTS.md — EventFlow

> **READ THIS FIRST, EVERY SESSION.** You are an implementation agent. This file is
> your single source of truth. If anything you're about to write contradicts this
> file, STOP and re-read. Do not invent features, libraries, or styles not described
> in this repo's docs.

---

## What this project is

**EventFlow** — an Event Management System (MVP). Users browse and register for events;
admins manage events, categories, bookings, and users via a dashboard.

This is a **local-only demo** (no deployment). Anyone who clones the repo must be able
to run it immediately with seeded demo data. No cloud accounts, no env secrets required.

Full requirements: `docs/PROJECT.md`
Final look & feel: `docs/VISION.md`
Locked decisions: `docs/DECISIONS.md`
Phase plan + prompts: `docs/PHASES.md`
Code rules: `docs/CONVENTIONS.md`

---

## Tech stack (do not substitute)

| Layer      | Choice                                              |
|------------|-----------------------------------------------------|
| Framework  | Next.js 15 (App Router) + TypeScript                |
| DB         | SQLite (single file `prisma/dev.db`) via **Prisma** |
| Styling    | Tailwind CSS + **shadcn/ui**                         |
| Auth       | Auth.js (NextAuth v5 beta), Credentials provider    |
| Forms      | React Hook Form + Zod                               |
| Charts     | Recharts                                            |
| Icons      | lucide-react                                         |
| Hashing    | bcryptjs                                             |

**SQLite is deliberate** — it makes "clone and run" trivial. Never propose Postgres,
Docker, Supabase, or browser localStorage. The DB is a file in the repo's ignore list;
seed data recreates it.

---

## Design system (the anti-"AI-generated" rules)

The UI must look **editorial and human-designed**, not like a templated dashboard.

**Fonts** (via `next/font/google`):
- `Instrument Serif` → display/headings → CSS var `--font-display`
- `Geist` → body & UI → CSS var `--font-sans`

**Palette** (light mode only; define in `globals.css` as CSS variables):
```
--background        #FAF8F4   warm off-white paper
--foreground        #1A1815   near-black warm ink
--accent            #C1440E   deep terracotta / rust
--accent-foreground #FAF8F4
--muted             #EFEBE3
--muted-foreground  #6B6459
--border            #E0DACF
--card              #FFFFFF
```

**HARD DESIGN GUARDRAILS — violating these is a bug:**
- ❌ NO gradients (especially purple/blue). NO glow effects. NO heavy drop-shadows.
- ❌ NO emoji in UI. NO centered-everything layouts. NO rainbow of colors.
- ❌ NO inline hex colors in components — use the CSS variables / Tailwind tokens ONLY.
- ✅ Large confident Instrument Serif headings; generous whitespace.
- ✅ Left-aligned, editorial layouts. Thin 1px borders instead of shadows.
- ✅ ONE accent color (terracotta), used sparingly for emphasis and primary actions.
- ✅ Restrained, purposeful motion only.

If a design choice isn't specified, prefer *less* — whitespace and type over decoration.

---

## Code guardrails (summary — full rules in `docs/CONVENTIONS.md`)

- **Server Components by default.** Add `"use client"` only when interactivity requires it.
- **Prisma is only imported inside `src/lib/`.** Never query the DB directly in a component.
- **Zod schemas are shared** between client validation and server actions (`src/lib/schemas`).
- **shadcn primitives live in `src/components/ui`**; feature components in `src/components`.
- **No dead code, no placeholder features, no TODO stubs** left behind in a committed phase.
- **TypeScript strict.** No `any` unless truly unavoidable (and comment why).

---

## Folder structure (target)

```
eventflow/
├── AGENTS.md                  ← you are here
├── README.md
├── docs/
│   ├── PROJECT.md             requirements + data model
│   ├── VISION.md              final-state description of every screen
│   ├── DECISIONS.md           locked decisions + rationale
│   ├── PHASES.md              6-phase plan with embedded Codex prompts
│   └── CONVENTIONS.md         detailed code rules
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/                   routes (user side + /admin)
│   ├── components/
│   │   ├── ui/                shadcn primitives
│   │   └── ...                feature components
│   └── lib/
│       ├── db.ts              PrismaClient singleton
│       ├── auth.ts            Auth.js config
│       ├── schemas/           Zod schemas
│       └── data/              data-access functions (all Prisma calls)
└── package.json
```

---

## How to work across sessions (IMPORTANT — accounts rotate)

This project is built by many disconnected agent sessions (the human rotates accounts).
The repo is the ONLY memory. Therefore:

1. **At session start:** read this file, then read the phase you're told to build in `docs/PHASES.md`.
2. **Only build the phase you're asked to build.** Do not run ahead.
3. **At phase end:** update the status table in `docs/PHASES.md` (mark the phase done),
   then stop and let the human review + commit.
4. **Never assume prior conversation.** Everything you need is in the repo. If it's not
   written down, it wasn't decided — ask, don't invent.

---

## Anti-hallucination rules (READ)

- If asked to use a library/API not listed in the stack above → **stop and flag it**, don't improvise.
- If a file or function you expect doesn't exist → **check the repo**, don't assume it does.
- Do not fabricate file paths, component names, or Prisma fields — they are all defined in `docs/`.
- If requirements are ambiguous → implement the **simplest** interpretation and note it in your summary.
- Never delete or rewrite files outside the scope of the current phase.
- Keep the diff minimal and reviewable — this is built phase-by-phase for a reason.

## Current status

See the status table at the top of `docs/PHASES.md` for what's done and what's next.
