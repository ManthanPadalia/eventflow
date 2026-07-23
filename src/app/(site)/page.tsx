import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { getCategories, getUpcomingEvents } from "@/lib/data";

type HomeProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const [categories, events] = await Promise.all([
    getCategories(),
    getUpcomingEvents({
      search,
      categorySlug: category
    })
  ]);

  return (
    <main className="px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-12">
        <div className="max-w-3xl space-y-5">
          <h1 className="font-display text-7xl leading-none tracking-normal text-foreground sm:text-8xl">
            Find your next event.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Browse intimate performances, practical workshops, community gatherings,
            and sharp talks from the EventFlow calendar.
          </p>
        </div>

        <EventFilters
          categories={categories}
          initialSearch={search}
          initialCategory={category}
        />

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl border-y border-border py-16 text-center">
            <h2 className="font-display text-4xl leading-tight text-foreground">
              No events found.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Try a different search or browse every category.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
