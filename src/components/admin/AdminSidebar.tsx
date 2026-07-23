"use client";

import {
  CalendarDays,
  ChartNoAxesCombined,
  FolderOpen,
  TicketCheck,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: ChartNoAxesCombined
  },
  {
    href: "/admin/events",
    label: "Events",
    icon: CalendarDays
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FolderOpen
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: TicketCheck
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users
  }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border bg-background lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex flex-col items-start gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:block lg:space-y-10 lg:px-8 lg:py-8">
        <Link
          href="/admin"
          className="font-display text-4xl leading-none text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          EventFlow
        </Link>
        <nav className="flex w-full gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0 lg:w-full lg:flex-col lg:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative inline-flex h-10 shrink-0 items-center gap-3 rounded-md border border-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:h-11 lg:pl-4",
                  active && "text-accent lg:border-l-accent"
                )}
              >
                <span
                  className={cn(
                    "hidden h-5 w-px bg-transparent lg:absolute lg:left-0 lg:block",
                    active && "bg-accent"
                  )}
                />
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
