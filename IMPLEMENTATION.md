# IMPLEMENTATION.md — Your build guide (for the human)

This is YOUR playbook — read it, keep it open while building. It tells you what to do
before you start, how to run each phase across rotating Codex accounts, and how to keep
the agent from going off the rails.

---

## Part 1 — Before you write any code (pre-flight)

Do these once, in order:

1. **Install prerequisites**
   - Node.js LTS (v20+). Check: `node -v`.
   - Git. Check: `git --version`.
   - A code editor (VS Code).

2. **Create the GitHub repo**
   - New empty repo named `eventflow` (private is fine).
   - Clone it locally: `git clone <url> && cd eventflow`.

3. **Drop in the docs FIRST (before Phase 0)**
   - Copy `AGENTS.md` to the repo root.
   - Copy the `docs/` folder (PROJECT, VISION, DECISIONS, PHASES, CONVENTIONS) in.
   - Copy this `IMPLEMENTATION.md` to the root too.
   - Commit: `git add . && git commit -m "docs: project brief, vision, phases"`.
   - **Why first:** every Codex session reads these to know the plan. They must exist
     before Phase 0 runs.

4. **Confirm the .gitignore will exclude the DB**
   - After Phase 0, make sure `node_modules`, `.next`, and `prisma/dev.db` are ignored.
     The DB is regenerated from the seed — it must NOT be committed. (The seed file IS
     committed; the database file is not.)

5. **Know your demo credentials** (created by the seed in Phase 1)
   - admin@eventflow.test / admin123
   - alex@eventflow.test / password123

---

## Part 2 — The per-phase loop (repeat 6 times)

For each phase, in a Codex session (any account):

1. **Open Codex** pointed at the repo.
2. **Give it the phase.** Simplest reliable prompt:
   > "Read AGENTS.md and docs/. Then implement Phase N exactly as specified in
   > docs/PHASES.md. Do only Phase N."

   (Or paste that phase's prompt block from PHASES.md directly.)
3. **Let it work.** It should only touch files in that phase's scope.
4. **Review the diff yourself** before accepting — see the review checklist below.
5. **Run it locally:**
   - Phase 0: `npm install` then `npm run dev` → check the smoke-test page.
   - Phase 1+: `npm run db:setup` (first time / after schema changes) then `npm run dev`.
6. **Commit at the phase boundary:**
   `git commit -m "Phase N: <name>"` then `git push`.
7. **Confirm PHASES.md status flipped to ✅** (the agent should do it; verify).

Then start the next phase — even on a different account, because the repo carries all context.

---

## Part 3 — Surviving account rotation

The whole system is designed for this. Keys to making it seamless:

- **The repo is the memory.** Never rely on Codex "remembering" — it won't after a switch.
- **Always push before switching accounts.** The next session clones/pulls the latest.
- **The PHASES.md status table tells any new session where you are.** Keep it accurate.
- **If a new session seems lost,** paste: "Read AGENTS.md and docs/PHASES.md, check the
  status table, and continue from the next unfinished phase."

---

## Part 4 — Review checklist (run your eyes over every phase diff)

Design (the "doesn't look AI-generated" guarantee):
- [ ] No gradients, no glow, no heavy shadows, no emoji in UI.
- [ ] Colors come from tokens — search the diff for stray `#` hex in components (should be none).
- [ ] Instrument Serif on headings, Geist on body; terracotta used sparingly.
- [ ] Layouts left-aligned/editorial (centering only on auth cards).

Code health:
- [ ] Prisma imported only under `src/lib/` — not inside components.
- [ ] Server Components by default; `"use client"` only where needed.
- [ ] Zod schema shared between form and server action.
- [ ] No console.logs, no TODO stubs, no commented-out code, no `any` without reason.
- [ ] Typecheck/build passes.

Scope:
- [ ] Only this phase's files changed.
- [ ] No new libraries beyond the AGENTS.md stack (if it added one, question it).
- [ ] Approve/reject stayed a status-flip only (no notification creep).

---

## Part 5 — Guardrails: keeping the agent honest

If the agent starts hallucinating or drifting, use these:

- **"Stop. Re-read AGENTS.md. You used <X> which isn't in the stack."**
- **"That field/component doesn't exist — check docs/PROJECT.md for the real schema."**
- **"You're out of scope. Only implement Phase N. Revert the rest."**
- **"No inline hex. Use the design tokens from globals.css."**
- If it invents a feature: **"Not in requirements. Remove it. Simplest interpretation only."**

The docs are written so you can always point at a specific file/line as the authority.
When in doubt, the agent asks — it does not invent.

---

## Part 6 — Definition of done

- All 6 phases ✅ in PHASES.md.
- Fresh clone → `npm install` → `npm run db:setup` → `npm run dev` works with zero manual steps.
- You can: register, log in, browse/search/filter events, book, see it in My Bookings,
  cancel it; log in as admin, see the dashboard, CRUD events + categories, approve/reject
  a booking, manage users.
- It looks like something a designer made, not a template.

---

## Quick command reference

```
npm install          # deps
npm run db:setup     # migrate + seed (fresh DB with demo data)
npm run db:seed      # re-seed only
npm run dev          # start dev server
npm run build        # production build (use to verify a phase compiles)
```
