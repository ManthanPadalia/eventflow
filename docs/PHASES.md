# PHASES.md — Build plan & embedded prompts

> Build in order. Do ONE phase per session. At the end of a phase, update the status
> table below, then stop for human review + commit. Each phase has a ready-to-use prompt
> — the human can paste it (or just say "do Phase N per docs/PHASES.md").

## Status

| Phase | Name                        | Status      |
|-------|-----------------------------|-------------|
| 0     | Scaffold & design foundation| ✅ Done — Next/Tailwind/shadcn/Prisma foundation with design smoke test |
| 1     | Data layer & seed           | ⬜ Not started |
| 2     | Auth                        | ⬜ Not started |
| 3     | User side                   | ⬜ Not started |
| 4     | Admin side                  | ⬜ Not started |
| 5     | Polish pass                 | ⬜ Not started |

> Update the Status cell to ✅ Done (and add a one-line note) when a phase is finished.

---

## How to run a phase (every session)
1. Read `AGENTS.md`, then this file's status table.
2. Read the relevant docs for the phase (noted in each prompt).
3. Implement ONLY that phase. Keep the diff minimal.
4. Run typecheck/build; confirm the app still runs.
5. Update the status table above. Stop. Let the human commit.

---

## PHASE 0 — Scaffold & design foundation

> Read first: `AGENTS.md`, `docs/CONVENTIONS.md`.

```
You are implementing Phase 0 of EventFlow. Read AGENTS.md and docs/CONVENTIONS.md first.
Scaffold + design foundation ONLY — no features.

- Create a Next.js 15 project (App Router, TypeScript, ESLint) named "eventflow".
- Add Tailwind CSS. Initialize shadcn/ui (we add components later).
- Add Prisma configured for SQLite (datasource sqlite, url file:./dev.db).
- Install: prisma, @prisma/client, next-auth@beta, @auth/prisma-adapter,
  react-hook-form, zod, @hookform/resolvers, recharts, bcryptjs, lucide-react.

DESIGN TOKENS (most important — see AGENTS.md design section):
- next/font/google: Instrument Serif → --font-display; Geist → --font-sans.
- Put the exact palette from AGENTS.md into globals.css as CSS variables and wire them
  into the Tailwind theme + shadcn's variable convention. Light mode only.
- Encode the design principles: big Instrument Serif headings, warm paper bg, thin
  borders not shadows, one terracotta accent, no gradients/emoji/glow.

STRUCTURE: create the folders from AGENTS.md (src/app, src/components/ui,
src/components, src/lib with db.ts/auth.ts/schemas/data). Create src/lib/db.ts with a
hot-reload-guarded PrismaClient singleton.

DELIVERABLE: app runs on `npm run dev`. Root page is a design smoke-test only: an
Instrument Serif h1 "EventFlow", a Geist subline, one terracotta button — proving the
type + color system. Add npm scripts db:migrate, db:seed, db:setup (migrate then seed);
seed can be a stub for now. Write README with clone → npm install → npm run db:setup →
npm run dev.

Then update the Phase 0 status in docs/PHASES.md to Done and stop.
```

---

## PHASE 1 — Data layer & seed

> Read first: `AGENTS.md`, `docs/PROJECT.md` (data model + seed section), `docs/CONVENTIONS.md`.

```
Implement Phase 1 of EventFlow. Read AGENTS.md and docs/PROJECT.md first.

- Write prisma/schema.prisma EXACTLY as the data model in docs/PROJECT.md (User,
  Category, Event, Booking, Role enum, BookingStatus enum, the @@unique([userId,eventId])).
- Create and run the initial migration.
- Write prisma/seed.ts producing the demo data described in PROJECT.md: 3–4 categories,
  ~8 future events across categories (realistic titles/descriptions/locations, varied
  capacities, Unsplash image URLs), 1 admin + 2–3 users (bcrypt-hashed passwords), and a
  spread of bookings covering ALL statuses (CONFIRMED, PENDING, REJECTED, CANCELLED).
- Wire `npm run db:seed` / `db:setup` to actually run this seed.
- Create the data-access layer in src/lib/data/ with typed functions the later phases
  need: getUpcomingEvents (with optional search + category filter), getEventById,
  getCategories, and stubs you'll expand later. All Prisma calls live here per CONVENTIONS.
- Put demo credentials in the README.

Verify: delete dev.db, run npm run db:setup, confirm it recreates + seeds cleanly.
Then update Phase 1 status in docs/PHASES.md to Done and stop.
```

---

## PHASE 2 — Auth

> Read first: `AGENTS.md`, `docs/DECISIONS.md` (D5), `docs/CONVENTIONS.md` (auth section), `docs/VISION.md` (screen 3).

```
Implement Phase 2 of EventFlow. Read AGENTS.md, the auth rules in docs/CONVENTIONS.md,
D5 in docs/DECISIONS.md, and screen 3 in docs/VISION.md first.

- Configure Auth.js (NextAuth v5 beta) Credentials provider in src/lib/auth.ts. Verify
  email + bcrypt password against the User table. Session must carry user id and role.
- Build /login and /register pages per VISION screen 3: single narrow centered card,
  Instrument Serif heading, Geist inputs with thin borders, terracotta primary button,
  link to switch between the two. Use React Hook Form + Zod; share the Zod schemas from
  src/lib/schemas. Inline validation errors, no alert boxes.
- Register creates a USER (bcrypt hash) then signs them in.
- Add middleware.ts protecting /admin/* to ADMIN only (redirect others to /).
- Add sign-out. Reflect auth state in the top nav (logged out: Login; logged in: name +
  Sign out; admin: link to /admin).

Keep the design language exactly per AGENTS.md. Server actions must re-check auth
server-side. Then update Phase 2 status in docs/PHASES.md to Done and stop.
```

---

## PHASE 3 — User side

> Read first: `AGENTS.md`, `docs/VISION.md` (screens 1,2,4,5), `docs/PROJECT.md` (capacity/cancel notes), `docs/CONVENTIONS.md`.

```
Implement Phase 3 of EventFlow. Read AGENTS.md and screens 1,2,4,5 of docs/VISION.md,
plus the capacity/cancel notes in docs/PROJECT.md.

Build the full user side, matching VISION exactly:
- Home/events listing (/): serif hero, search + category filter controls, responsive
  event card grid, low-spots indicator, tasteful empty state. Filtering/search works via
  the data layer (getUpcomingEvents with search + category).
- Event detail (/events/[id]): two-column layout, all event info, capacity/spots-left,
  and the Register action with all states (logged-out → login redirect w/ return path;
  already-booked → status badge + Cancel; full → disabled). Toast on success.
- My Bookings (/my-bookings): list of the user's bookings with consistent status badges
  and Cancel where applicable; empty state.
- Profile (/profile): edit name (email read-only) + change-password section; toasts.

Implement booking + cancel as server actions in the data layer with SERVER-SIDE capacity
checks and the unique-constraint handled gracefully (see CONVENTIONS). Cancel sets status
CANCELLED (D8). Use revalidatePath after mutations. Add the status-badge component once
and reuse it. Then update Phase 3 status in docs/PHASES.md to Done and stop.
```

---

## PHASE 4 — Admin side

> Read first: `AGENTS.md`, `docs/VISION.md` (screens 6–10), `docs/DECISIONS.md` (D3 scope fence), `docs/CONVENTIONS.md`.

```
Implement Phase 4 of EventFlow. Read AGENTS.md and screens 6–10 of docs/VISION.md, and
the D3 approve/reject scope fence in docs/DECISIONS.md.

Build the admin side under /admin, in the same design language (NOT a generic admin theme):
- Admin shell: left sidebar (Dashboard, Events, Categories, Bookings, Users) with the
  EventFlow wordmark; active item marked with the terracotta accent.
- Dashboard (/admin): stat cards (Total Events/Users/Bookings) with big serif numbers +
  1–2 minimal Recharts charts (bookings over time, bookings per category) using terracotta
  + muted tones.
- Events (/admin/events): table + New event button; create/edit form (all Event fields,
  Zod-validated); delete with confirm dialog.
- Categories (/admin/categories): inline add + list with rename/delete; block deleting a
  category that has events (clear message).
- Bookings (/admin/bookings): table of ALL bookings with status badges + Approve/Reject
  actions (PENDING → CONFIRMED / REJECTED), updating in place with a toast. STAY within
  the D3 fence — status flip only, no notifications.
- Users (/admin/users): table with role change (USER↔ADMIN) and delete (confirm); never
  allow deleting the last admin or the current admin.

All mutations are server actions in the data layer, re-checking ADMIN role server-side.
Reuse the status-badge component from Phase 3. Then update Phase 4 status in
docs/PHASES.md to Done and stop.
```

---

## PHASE 5 — Polish pass

> Read first: `AGENTS.md`, `docs/VISION.md` (cross-cutting polish), `docs/CONVENTIONS.md`.

```
Implement Phase 5 of EventFlow — polish only, no new features. Read AGENTS.md and the
cross-cutting polish section of docs/VISION.md.

- Add considered empty states to every list/table (serif line + subtle guidance).
- Add loading states (muted skeletons, not spinners everywhere) to data-fetching routes.
- Ensure every mutation shows a toast (book, cancel, create, edit, delete, approve, reject).
- Responsive sweep: user side excellent on mobile; admin tables scroll/stack gracefully.
- Consistency sweep: one spacing scale, one border-radius, tokens only (no stray hex),
  visible accent-colored focus rings, consistent status badges everywhere.
- Remove any dead code, console.logs, unused imports. Run typecheck/build clean.

Do NOT add features or change the data model. Then update Phase 5 status in
docs/PHASES.md to Done and stop.
```
