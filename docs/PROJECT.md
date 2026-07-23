# PROJECT.md — Requirements & Data Model

## Elevator pitch

EventFlow lets people discover and register for events, and lets admins run the whole
show — creating events, organizing them into categories, and managing bookings and users
from a dashboard. MVP, local-only, seeded with demo data.

---

## Feature requirements

### User side
- **Registration & login** — email + password, simple.
- **View upcoming events** — a browsable listing of future events.
- **Search & filter** — search by title/keyword; filter by category (and optionally date).
- **Event details page** — full info for a single event, with a register action.
- **Book / register for an event** — reserve a spot; capacity is respected.
- **My bookings** — list of the user's own bookings with status.
- **Cancel booking** — user can cancel their own booking.
- **Profile management** — view/edit name; change password.

### Admin side
- **Admin login** — same login screen, role-gated access to `/admin`.
- **Add new event** — create with title, description, date, location, capacity, category, image URL.
- **Edit / delete event.**
- **Manage categories** — create, rename, delete categories.
- **View all bookings** — across all users and events.
- **Approve / reject registrations** — flip a booking's status (see DECISIONS.md).
- **Manage users** — list users; change role; delete.
- **Dashboard** — totals for events, users, bookings + a simple chart or two.

---

## Data model (final — do not change field names without updating this file)

```prisma
model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String
  role         Role      @default(USER)
  bookings     Booking[]
  createdAt    DateTime  @default(now())
}

model Category {
  id     String  @id @default(cuid())
  name   String  @unique
  slug   String  @unique
  events Event[]
}

model Event {
  id          String    @id @default(cuid())
  title       String
  description String
  date        DateTime
  location    String
  capacity    Int
  imageUrl    String?
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  bookings    Booking[]
  createdAt   DateTime  @default(now())
}

model Booking {
  id        String        @id @default(cuid())
  userId    String
  user      User          @relation(fields: [userId], references: [id])
  eventId   String
  event     Event         @relation(fields: [eventId], references: [id])
  status    BookingStatus @default(CONFIRMED)
  createdAt DateTime      @default(now())

  @@unique([userId, eventId])   // a user books an event at most once
}

enum Role {
  USER
  ADMIN
}

enum BookingStatus {
  PENDING
  CONFIRMED
  REJECTED
  CANCELLED
}
```

### Notes
- **Capacity logic:** an event is "full" when confirmed+pending bookings ≥ capacity.
  Show remaining spots on the detail page. Block booking when full.
- **Default booking status is `CONFIRMED`.** Approve/reject is an admin override
  (a booking can be moved to `REJECTED`, or `PENDING` if you seed some that way).
- **Cancel** sets status to `CANCELLED` (don't hard-delete — keeps history clean).
- **`@@unique([userId, eventId])`** prevents double-booking at the DB level.

---

## Seed data (must ship in repo)

The seed (`prisma/seed.ts`) populates a ready-to-demo database. Include:
- **3–4 categories** (e.g. Music, Tech, Workshops, Community).
- **~8 events** spread across categories, all with future dates, realistic titles,
  descriptions, locations, varied capacities, and image URLs (use Unsplash source URLs).
- **1 admin** + **2–3 regular users**. Document their credentials in the README.
- **A handful of bookings** across users/events, including at least one of each status
  (CONFIRMED, PENDING, REJECTED, CANCELLED) so every UI state is visible on first run.

Suggested demo credentials (put in README):
- admin@eventflow.test / `admin123`
- alex@eventflow.test / `password123`

Passwords must be bcrypt-hashed in the seed, never stored plain.
