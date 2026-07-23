# VISION.md — The Final State (screen by screen)

> This is the picture of the finished product. Build toward exactly this. It exists so
> the agent implements a coherent vision instead of guessing screen by screen.
> Aesthetic rules live in `AGENTS.md` — this file is about *what each screen contains
> and how it's laid out*.

## The overall feel

Think of a well-designed independent arts venue's website, or an editorial event
listing — confident serif headlines, lots of warm paper-white space, one rust accent,
photography doing the heavy lifting. Calm, premium, human. Never busy, never "dashboard-y"
on the user side.

**Global shell (user side):**
- Slim top nav on the paper background: wordmark **"EventFlow"** in Instrument Serif (left),
  nav links (Events, My Bookings) + auth state (right). Thin bottom border, no shadow.
- Comfortable max-width content column (~1100px), generous horizontal padding.
- Footer: minimal — wordmark, a line of muted text, nothing decorative.

---

## USER SIDE

### 1. Home / Events listing (`/`)
- **Hero:** an oversized Instrument Serif headline (e.g. "Find your next event.")
  left-aligned, with a short Geist subline. No hero image — type carries it. Whitespace-heavy.
- **Controls row:** a search input (magnifier icon, left) + category filter chips /
  a select. Filters update the grid. Understated, thin borders.
- **Event grid:** responsive cards (1 col mobile → 2 → 3). Each card:
  - image (16:9, subtle rounded corners, thin border — no heavy shadow),
  - category label (small, uppercase, muted, letter-spaced),
  - event title (Instrument Serif, ~22–26px),
  - date + location (Geist, muted, small),
  - a small "spots left" indicator when low.
  - Whole card is a link to the detail page. Hover: gentle lift or border-darken, nothing flashy.
- **Empty state** (no results): a tasteful centered-in-column message in serif, not an error.

### 2. Event detail (`/events/[id]`)
- Two-column on desktop: large event image left (or top on mobile), info right.
- **Right column:** category label, big serif title, date/time + location with small icons,
  full description in comfortable Geist prose, capacity/spots-left line.
- **Booking action:** a single terracotta primary button — "Register" / "Reserve your spot".
  - If not logged in → button prompts login (redirect to /login with return path).
  - If already booked → show status badge + a "Cancel booking" secondary action.
  - If full → disabled button reading "Event full", muted.
- Confirmation via a toast, and the button state updates in place.

### 3. Auth: Login & Register (`/login`, `/register`)
- Single narrow centered card on the paper background — the ONE place centering is right.
- Serif heading ("Welcome back." / "Create your account."), Geist labels, clean inputs
  with thin borders, terracotta primary button, a link to switch between login/register.
- Inline Zod validation errors in muted red, no alert boxes.

### 4. My Bookings (`/my-bookings`)
- Serif page title. A list (not heavy cards) of the user's bookings:
  each row = event thumbnail, title, date, location, a **status badge**, and a
  "Cancel" action where applicable.
- **Status badges** (consistent everywhere): CONFIRMED = terracotta/solid,
  PENDING = muted/outline, REJECTED = strikethrough-muted, CANCELLED = muted/dim.
- Empty state: "You haven't booked anything yet." + link to browse events.

### 5. Profile (`/profile`)
- Serif title. Simple form: name (editable), email (read-only), and a separate
  "Change password" section (current + new). Save buttons per section. Toast on success.

---

## ADMIN SIDE (`/admin/*`)

Admin may look a touch more utilitarian than the user side, but **stays in the same
design language** — same fonts, same palette, same thin-border restraint. Not a
generic bootstrap admin theme.

**Admin shell:** a left sidebar (Dashboard, Events, Categories, Bookings, Users) with
the EventFlow wordmark on top, the active item marked with the terracotta accent (a
left bar or text color — not a filled blob). Main content area on paper background.

### 6. Dashboard (`/admin`)
- Serif "Dashboard" title.
- **Stat cards row:** Total Events, Total Users, Total Bookings — big serif numbers,
  small muted labels, thin borders, NO gaudy colored tiles.
- **One or two Recharts charts** using the terracotta accent + muted tones:
  e.g. bookings over time (line/area) and bookings per category (bar).
  Keep chart chrome minimal — light gridlines, no 3D, no rainbow series.

### 7. Events admin (`/admin/events`)
- Serif title + a terracotta "New event" button (top right).
- A clean table: title, category, date, capacity, bookings count, actions (Edit / Delete).
- Create/Edit uses a form (dialog or dedicated page) with all Event fields, Zod-validated.
- Delete asks for confirmation (shadcn dialog), no accidental destruction.

### 8. Categories admin (`/admin/categories`)
- Simple: inline-add input + a list of categories with rename/delete.
- Deleting a category with events attached must be handled gracefully (block or reassign —
  simplest: block with a clear message).

### 9. Bookings admin (`/admin/bookings`)
- Table of ALL bookings: user, event, date booked, status badge, and
  **Approve / Reject** actions (only meaningful for PENDING; approving → CONFIRMED,
  rejecting → REJECTED). Status updates in place with a toast.

### 10. Users admin (`/admin/users`)
- Table: name, email, role, joined date, bookings count. Actions: change role
  (USER ↔ ADMIN via a select), delete user (confirm dialog). Don't allow deleting the
  last admin or the currently-logged-in admin.

---

## Cross-cutting polish (Phase 5 targets)
- Every list has a considered **empty state** (serif line + subtle guidance).
- **Loading states** on data-fetching routes (skeletons using muted tones, not spinners everywhere).
- **Toasts** for every mutation (book, cancel, create, edit, delete, approve, reject).
- Fully **responsive**: user side shines on mobile; admin tables scroll/stack gracefully.
- Consistent spacing scale and one border-radius value throughout.
- Keyboard-focusable, visible focus rings in the accent color.
