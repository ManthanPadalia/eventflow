import { BookingStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { db } from "../src/lib/db";

const day = 24 * 60 * 60 * 1000;

function futureDate(daysFromNow: number, hour: number) {
  const date = new Date(Date.now() + daysFromNow * day);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  await db.booking.deleteMany();
  await db.event.deleteMany();
  await db.category.deleteMany();
  await db.user.deleteMany();

  const [adminPassword, userPassword] = await Promise.all([
    bcrypt.hash("admin123", 12),
    bcrypt.hash("password123", 12)
  ]);

  const [admin, alex, priya, jordan] = await Promise.all([
    db.user.create({
      data: {
        name: "Maya Chen",
        email: "admin@eventflow.test",
        passwordHash: adminPassword,
        role: Role.ADMIN
      }
    }),
    db.user.create({
      data: {
        name: "Alex Rivera",
        email: "alex@eventflow.test",
        passwordHash: userPassword
      }
    }),
    db.user.create({
      data: {
        name: "Priya Shah",
        email: "priya@eventflow.test",
        passwordHash: userPassword
      }
    }),
    db.user.create({
      data: {
        name: "Jordan Lee",
        email: "jordan@eventflow.test",
        passwordHash: userPassword
      }
    })
  ]);

  const [music, tech, workshops, community] = await Promise.all([
    db.category.create({ data: { name: "Music", slug: "music" } }),
    db.category.create({ data: { name: "Tech", slug: "tech" } }),
    db.category.create({ data: { name: "Workshops", slug: "workshops" } }),
    db.category.create({ data: { name: "Community", slug: "community" } })
  ]);

  const events = await Promise.all([
    db.event.create({
      data: {
        title: "Riverside Jazz Night",
        description:
          "An intimate evening of modern jazz with a local quartet, small plates, and reserved table seating by the river.",
        date: futureDate(12, 19),
        location: "River Hall, Portland",
        capacity: 80,
        imageUrl:
          "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
        categoryId: music.id
      }
    }),
    db.event.create({
      data: {
        title: "Indie Makers Listening Room",
        description:
          "Songwriters and producers share new work in a quiet studio setting, followed by a short audience Q&A.",
        date: futureDate(34, 18),
        location: "North Loop Studio, Minneapolis",
        capacity: 45,
        imageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
        categoryId: music.id
      }
    }),
    db.event.create({
      data: {
        title: "Product Systems Summit",
        description:
          "A practical half-day conference for product teams covering design systems, roadmapping, and measured launches.",
        date: futureDate(18, 9),
        location: "Civic Center Annex, Austin",
        capacity: 160,
        imageUrl:
          "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
        categoryId: tech.id
      }
    }),
    db.event.create({
      data: {
        title: "AI for Operations Roundtable",
        description:
          "Operators, analysts, and founders compare practical AI workflows for support queues, reporting, and internal tools.",
        date: futureDate(47, 14),
        location: "Foundry Commons, Chicago",
        capacity: 55,
        imageUrl:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        categoryId: tech.id
      }
    }),
    db.event.create({
      data: {
        title: "Letterpress Poster Workshop",
        description:
          "Learn the basics of hand-set type, ink mixing, and press operation while printing a small edition to take home.",
        date: futureDate(21, 11),
        location: "Ink & Grain Print Shop, Brooklyn",
        capacity: 18,
        imageUrl:
          "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
        categoryId: workshops.id
      }
    }),
    db.event.create({
      data: {
        title: "Seasonal Cooking Lab",
        description:
          "A hands-on class focused on market vegetables, simple sauces, and building a flexible weeknight menu.",
        date: futureDate(39, 17),
        location: "Table House Kitchen, Oakland",
        capacity: 24,
        imageUrl:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
        categoryId: workshops.id
      }
    }),
    db.event.create({
      data: {
        title: "Neighborhood Volunteer Fair",
        description:
          "Meet local nonprofits, compare volunteer roles, and sign up for spring projects across parks, food access, and tutoring.",
        date: futureDate(15, 10),
        location: "Westside Library Atrium, Denver",
        capacity: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
        categoryId: community.id
      }
    }),
    db.event.create({
      data: {
        title: "Public Market Supper Club",
        description:
          "A shared-table dinner celebrating neighborhood growers, bakers, and cooks with a short talk from each vendor.",
        date: futureDate(63, 19),
        location: "Market Shed, Raleigh",
        capacity: 70,
        imageUrl:
          "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
        categoryId: community.id
      }
    })
  ]);

  await Promise.all([
    db.booking.create({
      data: {
        userId: alex.id,
        eventId: events[0].id,
        status: BookingStatus.CONFIRMED
      }
    }),
    db.booking.create({
      data: {
        userId: priya.id,
        eventId: events[0].id,
        status: BookingStatus.PENDING
      }
    }),
    db.booking.create({
      data: {
        userId: jordan.id,
        eventId: events[2].id,
        status: BookingStatus.CONFIRMED
      }
    }),
    db.booking.create({
      data: {
        userId: alex.id,
        eventId: events[4].id,
        status: BookingStatus.REJECTED
      }
    }),
    db.booking.create({
      data: {
        userId: priya.id,
        eventId: events[5].id,
        status: BookingStatus.CANCELLED
      }
    }),
    db.booking.create({
      data: {
        userId: jordan.id,
        eventId: events[6].id,
        status: BookingStatus.PENDING
      }
    }),
    db.booking.create({
      data: {
        userId: admin.id,
        eventId: events[7].id,
        status: BookingStatus.CONFIRMED
      }
    })
  ]);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
