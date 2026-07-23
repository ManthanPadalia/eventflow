export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10 lg:px-16">
      <section className="mx-auto flex max-w-5xl flex-col items-start gap-8 border-y border-border py-16 sm:py-24">
        <div className="max-w-3xl space-y-5">
          <h1 className="font-display text-7xl leading-none tracking-normal text-foreground sm:text-8xl">
            EventFlow
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            A warm, editorial foundation for browsing, booking, and managing local
            events.
          </p>
        </div>
        <button className="inline-flex h-11 items-center justify-center rounded-md border border-accent bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Terracotta action
        </button>
      </section>
    </main>
  );
}
