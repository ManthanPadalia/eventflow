# EventFlow

EventFlow is a local-only event management system demo built with Next.js, SQLite, Prisma, Tailwind CSS, and shadcn/ui.

## Getting Started

```bash
git clone <repo-url>
cd eventflow
npm install
npm run db:setup
npm run dev
```

Open `http://localhost:3000` to view the app.

## Database

The app uses SQLite at `prisma/dev.db`. The database file is ignored by Git and can be recreated with:

```bash
npm run db:setup
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@eventflow.test` | `admin123` |
| User | `alex@eventflow.test` | `password123` |
| User | `priya@eventflow.test` | `password123` |
| User | `jordan@eventflow.test` | `password123` |
