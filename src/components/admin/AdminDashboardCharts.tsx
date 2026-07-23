"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type {
  DashboardBookingPoint,
  DashboardCategoryPoint
} from "@/lib/data";

type AdminDashboardChartsProps = {
  bookingsOverTime: DashboardBookingPoint[];
  bookingsPerCategory: DashboardCategoryPoint[];
};

const chartMargin = {
  top: 8,
  right: 16,
  bottom: 0,
  left: 0
};

export function AdminDashboardCharts({
  bookingsOverTime,
  bookingsPerCategory
}: AdminDashboardChartsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-md border border-border bg-card p-5">
        <div className="mb-6">
          <h2 className="font-display text-3xl leading-none">
            Bookings over time
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reservations grouped by booking date.
          </p>
        </div>
        <div className="h-72">
          {bookingsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsOverTime} margin={chartMargin}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--foreground)"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--accent)" }}
                  activeDot={{ r: 5, fill: "var(--accent)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState />
          )}
        </div>
      </section>

      <section className="rounded-md border border-border bg-card p-5">
        <div className="mb-6">
          <h2 className="font-display text-3xl leading-none">
            Bookings per category
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Active registrations grouped by event category.
          </p>
        </div>
        <div className="h-72">
          {bookingsPerCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsPerCategory} margin={chartMargin}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--foreground)"
                  }}
                />
                <Bar dataKey="bookings" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmptyState />
          )}
        </div>
      </section>
    </div>
  );
}

function ChartEmptyState() {
  return (
    <div className="flex h-full items-center border-y border-border">
      <p className="font-display text-3xl leading-tight text-muted-foreground">
        No booking data yet.
      </p>
    </div>
  );
}
