import { SiteHeader } from "@/components/SiteHeader";

export default function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 sm:px-10 lg:px-16">
          <p className="font-display text-2xl leading-none">EventFlow</p>
          <p className="text-sm text-muted-foreground">
            A local-first event management system demo.
          </p>
        </div>
      </footer>
    </div>
  );
}
