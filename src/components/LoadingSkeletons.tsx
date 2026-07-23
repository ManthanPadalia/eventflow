function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md border border-border bg-muted ${className}`}
    />
  );
}

export function EventsGridLoading() {
  return (
    <main className="px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-12">
        <div className="max-w-3xl space-y-5">
          <SkeletonBlock className="h-20 max-w-2xl sm:h-24" />
          <SkeletonBlock className="h-7 max-w-xl" />
        </div>
        <SkeletonBlock className="h-24 w-full" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-md border border-border bg-card p-3"
            >
              <SkeletonBlock className="aspect-video w-full" />
              <div className="space-y-3 px-1 pb-2">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-8 w-4/5" />
                <SkeletonBlock className="h-4 w-3/5" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function EventDetailLoading() {
  return (
    <main className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
      <section className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <SkeletonBlock className="aspect-[4/3] w-full" />
        <div className="space-y-8">
          <div className="space-y-4 border-b border-border pb-8">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <SkeletonBlock className="h-5 w-4/5" />
            <SkeletonBlock className="h-5 w-3/5" />
            <SkeletonBlock className="h-5 w-2/3" />
          </div>
          <SkeletonBlock className="h-32 w-full" />
          <SkeletonBlock className="h-40 w-full" />
        </div>
      </section>
    </main>
  );
}

export function MyBookingsLoading() {
  return (
    <main className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-8">
        <PageHeaderLoading />
        <div className="border-y border-border">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-4 border-b border-border py-5 last:border-b-0 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
            >
              <SkeletonBlock className="aspect-video w-full sm:aspect-[4/3]" />
              <div className="space-y-3">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-8 w-2/3" />
                <SkeletonBlock className="h-4 w-4/5" />
              </div>
              <SkeletonBlock className="h-10 w-28" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ProfileLoading() {
  return (
    <main className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
      <section className="mx-auto max-w-6xl space-y-8">
        <PageHeaderLoading />
        <div className="grid gap-8 lg:grid-cols-2">
          <SkeletonBlock className="h-80 w-full" />
          <SkeletonBlock className="h-80 w-full" />
        </div>
      </section>
    </main>
  );
}

export function AuthLoading() {
  return (
    <main className="flex min-h-[calc(100vh-13rem)] items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-md border border-border bg-card p-8">
        <div className="mb-8 space-y-3">
          <SkeletonBlock className="h-12 w-56" />
          <SkeletonBlock className="h-5 w-full" />
        </div>
        <div className="space-y-5">
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-16 w-full" />
          <SkeletonBlock className="h-11 w-full" />
          <SkeletonBlock className="h-5 w-48" />
        </div>
      </section>
    </main>
  );
}

export function AdminDashboardLoading() {
  return (
    <div className="space-y-8">
      <PageHeaderLoading />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SkeletonBlock className="h-96 w-full" />
        <SkeletonBlock className="h-96 w-full" />
      </div>
    </div>
  );
}

export function AdminTableLoading() {
  return (
    <div className="space-y-5">
      <PageHeaderLoading />
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <div className="min-w-[820px] divide-y divide-border">
          <div className="grid grid-cols-5 gap-4 px-4 py-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-4 w-full" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-4 px-4 py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-6 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageHeaderLoading() {
  return (
    <div className="max-w-2xl space-y-3">
      <SkeletonBlock className="h-16 w-64 sm:h-20" />
      <SkeletonBlock className="h-5 w-full max-w-md" />
    </div>
  );
}
