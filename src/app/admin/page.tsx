import { AdminDashboardCharts } from "@/components/admin/AdminDashboardCharts";
import { getAdminDashboardSummary } from "@/lib/data";

export default async function AdminDashboardPage() {
  const summary = await getAdminDashboardSummary();
  const stats = [
    {
      label: "Total Events",
      value: summary.totalEvents
    },
    {
      label: "Total Users",
      value: summary.totalUsers
    },
    {
      label: "Total Bookings",
      value: summary.totalBookings
    }
  ];

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-3">
        <h1 className="font-display text-6xl leading-none text-foreground sm:text-7xl">
          Dashboard
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          A quiet overview of events, people, and registrations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <section
            key={stat.label}
            className="rounded-md border border-border bg-card p-5"
          >
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-4 font-display text-6xl leading-none">
              {stat.value}
            </p>
          </section>
        ))}
      </div>

      <AdminDashboardCharts
        bookingsOverTime={summary.bookingsOverTime}
        bookingsPerCategory={summary.bookingsPerCategory}
      />
    </div>
  );
}
