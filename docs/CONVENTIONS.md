# CONVENTIONS.md — Code rules

> Consistency across many disconnected sessions depends on these. Follow them exactly.

## Architecture
- **Next.js App Router.** Server Components by default. Add `"use client"` ONLY when the
  component needs state, effects, event handlers, or browser APIs.
- **Data mutations** use **Server Actions** (functions marked `"use server"`), not ad-hoc
  API routes, unless a route is genuinely needed.
- **All Prisma access is centralized in `src/lib/data/`.** Components and actions call
  these functions; they never import `@prisma/client` directly. One reason per function,
  clear names (`getUpcomingEvents`, `createBooking`, `updateBookingStatus`).
- **`src/lib/db.ts`** exports a single guarded PrismaClient (prevents hot-reload leaks).

## Validation
- **Zod schemas live in `src/lib/schemas/`** and are the single source of truth.
- The SAME schema validates on the client (React Hook Form + `zodResolver`) and again in
  the server action before touching the DB. Never trust the client alone.

## Auth
- Auth.js config in `src/lib/auth.ts`. Session carries `id` and `role`.
- Protect `/admin/*` in `middleware.ts` (redirect non-admins to `/`).
- Server actions that mutate must re-check the session/role server-side — middleware is
  not enough.

## Components & styling
- **shadcn primitives** in `src/components/ui/` (generated; don't hand-edit heavily).
- **Feature components** in `src/components/` with clear names (`EventCard`, `BookingRow`).
- **Colors, fonts, spacing come from tokens only.** No inline hex, no arbitrary
  `text-[#...]`. Use the Tailwind theme tokens wired to the CSS variables.
- One border-radius scale, one spacing scale. Reuse; don't invent per-component values.
- Keep components small and focused. Extract when a file gets long or repeats markup.

## TypeScript
- `strict` on. Avoid `any`; if unavoidable, add a one-line comment explaining why.
- Type server-action inputs via the Zod schema's inferred type (`z.infer<...>`).
- No unused imports/vars in committed code.

## Data access patterns
- Capacity check happens **server-side** in the booking action (count CONFIRMED+PENDING
  vs capacity) — never rely on the client's view of remaining spots.
- Respect the `@@unique([userId, eventId])` constraint; handle the duplicate-booking
  error gracefully (friendly message, not a stack trace).
- Use `revalidatePath` (or equivalent) after mutations so lists refresh.

## Errors & UX
- Mutations return a typed result (`{ ok: true }` / `{ ok: false, error }`), surfaced as
  a toast. No unhandled promise rejections reaching the UI.
- Every list/table has a real empty state. Every async route has a loading state.

## Hygiene
- No commented-out code, no `console.log` left in committed phases, no TODO stubs that
  pretend a feature exists.
- Small, reviewable diffs scoped to the current phase only.
- Don't touch files outside the current phase's scope.
- Run the build / typecheck before declaring a phase done.

## Naming
- Routes: kebab-case folders (`my-bookings`). Components: PascalCase. Functions/vars:
  camelCase. Zod schemas: `somethingSchema`. Data fns: verbNoun (`getEventById`).
